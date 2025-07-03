import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { UserId } from "../../users/domain/UserId";
import { UserRepository } from "../../users/domain/UserRepository";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

export class OllamaMistralUserCourseSuggestionsRepository
  implements UserCourseSuggestionsRepository
{
  constructor(private readonly userRepository: UserRepository) {}

  async search(userId: UserId): Promise<UserCourseSuggestions | null> {
    const user = await this.userRepository.search(userId);

    if (user === null || !user.hasCompletedAnyCourse()) {
      return null;
    }

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(`
				Eres un experto en formación online.
				El usuario ha completado estos cursos:

				{completedCourses}

				Sugiere cursos similares y relevantes para continuar aprendiendo.
				El formato de la respuesta debe ser una lista de cursos, cada uno en una línea separada, comenzando con un asterisco.
        Por ejemplo:  
        * Curso de Inteligencia Artificial Avanzada
        * Curso de Aprendizaje Profundo
        No incluyas ningún otro texto, solo la lista de cursos sugeridos.
			`),
      new Ollama({
        model: "llama3:8b-instruct-q4_0",
        baseUrl: "http://localhost:11434",
      }),
    ]);

    const suggestions = await chain.invoke({
      completedCourses: user.completedCourses
        .map((course) => `* ${course}`)
        .join("\n"),
    });

    return UserCourseSuggestions.fromPrimitives({
      userId: userId.value,
      completedCourses: user.completedCourses,
      suggestions: this.suggestionsStringToArray(suggestions),
    });
  }

  private suggestionsStringToArray(
    suggestions: string
  ): string[] {
    return suggestions
      .split("\n")
      .map((suggestion) => suggestion.trim())
      .filter((suggestion) => suggestion.length > 0);
  }
}
