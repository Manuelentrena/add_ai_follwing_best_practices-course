import { CourseSuggestionsRepository } from "../domain/CourseSuggestionsRepository";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export class OllamaMistralCoursesSuggestionsRepository implements CourseSuggestionsRepository {
	async byFinishedCourses(_finishedCourses: string[]): Promise<string[] | null> {

		if (_finishedCourses === null) {
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
        Curso de Inteligencia Artificial Avanzada
        Curso de Aprendizaje Profundo
        No incluyas ningún otro texto, solo la lista de cursos sugeridos.
			`),
			new Ollama({
				model: "llama3:8b-instruct-q4_0",
				baseUrl: "http://localhost:11434",
			}),
		]);

		const suggestions = await chain.invoke({
			completedCourses: _finishedCourses
				.map((course) => `* ${course}`)
				.join("\n"),
		});

		return this.suggestionsStringToArray(suggestions);
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
