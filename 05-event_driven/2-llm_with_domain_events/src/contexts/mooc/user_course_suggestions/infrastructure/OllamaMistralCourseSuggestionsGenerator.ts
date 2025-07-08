/* eslint-disable no-console */
import { Ollama } from "@langchain/community/llms/ollama";
import { LengthBasedExampleSelector } from "@langchain/core/example_selectors";
import { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

import { CourseSuggestionsGenerator } from "../domain/CourseSuggestionsGenerator";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";

export class OllamaMistralCourseSuggestionsGenerator
  implements CourseSuggestionsGenerator
{
  private readonly existingCodelyCourses = [
    "Diseño de infraestructura: AWS SQS como cola de mensajería",
    "Patrones de Diseño: Criteria",
    "Diseño de infraestructura: RabbitMQ como cola de mensajería",
    "Diseño de infraestructura: Mapeo de herencia en PHP",
    "Next.js: Open Graph Images",
    "Problemas con DDD: Gestión de errores en Eventos de Domino",
    "Linting en PHP",
    "Modelado del Dominio: Eventos de Dominio",
    "Análisis de código estático en PHP",
    "Modelado del dominio: Agregados",
    "Buenas prácticas con CSS: Colores",
    "TypeScript Avanzado: Mejora tu Developer eXperience",
    "Grafana",
    "Modelado del dominio: Repositorios",
    "Crea tu librería en React: Carousel",
  ];

  async generate(
    userCourseSuggestions: UserCourseSuggestions
  ): Promise<string> {
    const prefix = `Dado unos cursos de entrada, sugiere exactamente tres cursos relevantes de la siguiente lista. Responde exclusivamente en el siguiente formato:
${this.formatCodelyCourses(this.existingCodelyCourses)}

Cumple con las siguientes reglas:
* Devuelve solo 3 cursos, ni más, ni menos.
* No repitas cursos que ya han sido completados por el usuario.
* Devuelve sólo el título del curso.
* Devuelve sólo la lista de cursos, sin añadir información adicional.
* Recomienda cursos que sean relevantes para los cursos completados por el usuario.
* No me digas por qué has escogido los cursos. Solo quiero la lista de cursos.
* Mo modifiques los títulos de los cursos.
* No añadas introducciones ni mensajes de bienvenida.
* No expliques nada. Devuelve sólo la lista.
* No modifiques los títulos de los cursos.
* No añadas nada más.

Dame las sugerencias para los siguientes cursos:`;

    const examplePrompt = new PromptTemplate({
      inputVariables: ["completed_courses", "suggested_courses"],
      template:
        "Cursos Completados:\n{completed_courses}\n\nSugerencias:\n{suggested_courses}",
    });

    const exampleSelector = await LengthBasedExampleSelector.fromExamples(
      [
        {
          completed_courses: this.formatCoursesInline([
            "Modelado del Dominio: Eventos de Dominio",
          ]),
          suggested_courses: this.formatExampleCourses([
            "Modelado del dominio: Agregados",
            "Modelado del dominio: Repositorios",
            "Patrones de Diseño: Criteria",
          ]),
        },
        {
          completed_courses: this.formatCoursesInline([
            "Linting en PHP",
            "Diseño de infraestructura: Mapeo de herencia en PHP",
          ]),
          suggested_courses: this.formatExampleCourses([
            "Análisis de código estático en PHP",
            "Diseño de infraestructura: AWS SQS como cola de mensajería",
            "Diseño de infraestructura: RabbitMQ como cola de mensajería",
          ]),
        },
        {
          completed_courses: this.formatCoursesInline([
            "Next.js: Open Graph Images",
          ]),
          suggested_courses: this.formatExampleCourses([
            "Crea tu librería en React: Carousel",
            "Buenas prácticas con CSS: Colores",
            "TypeScript Avanzado: Mejora tu Developer eXperience",
          ]),
        },
      ],
      {
        examplePrompt,
        maxLength: 250,
      }
    );

    const dynamicPrompt = new FewShotPromptTemplate({
      prefix,
      examplePrompt,
      exampleSelector,
      suffix: "Cursos Completados:\n{completed_courses}\n\nSugerencias:\n",
      inputVariables: ["completed_courses"],
    });

    const prompt = await dynamicPrompt.format({
      completed_courses: this.formatCoursesInline(
        userCourseSuggestions.completedCourses
      ),
    });

    return await new Ollama({
      model: "llama3:8b-instruct-q4_0",
      baseUrl: "http://localhost:11434",
      temperature: 0,
      callbacks: [
        {
          handleLLMStart: (_llm: Serialized, prompts: string[]) => {
            console.log("-- PROMPT --\n");
            console.log(prompts[0]);
          },
          handleLLMEnd: (output: LLMResult) => {
            console.log("\n\n-- RESULT --\n");
            console.log(output.generations[0][0].text);
          },
        },
      ],
    }).invoke(prompt);
  }

  private formatCodelyCourses(courses: string[]): string {
    return courses.map((course) => `\t- ${course}`).join("\n");
  }

  private formatExampleCourses(courses: string[]): string {
    return courses.map((course) => `- ${course}`).join("\n");
  }

  private formatCoursesInline(courses: string[]): string {
    return courses.map((course) => `- ${course}`).join("\n");
  }
}
