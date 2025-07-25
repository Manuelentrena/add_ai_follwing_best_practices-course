import { faker } from "@faker-js/faker";
import { CourseSuggestion } from "../../../../../src/contexts/mooc/user_course_suggestions/domain/CourseSuggestion";
import { UserCourseSuggestionsMother } from "../domain/UserCourseSuggestionsMother";
import { OllamaMistralCourseSuggestionsWithReasonGenerator } from "../../../../../src/contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralCourseSuggestionsWithReasonGenerator";

describe("OllamaMistralCourseSuggestionsGenerator should", () => {
  const generator = new OllamaMistralCourseSuggestionsWithReasonGenerator();

  let suggestions: CourseSuggestion[];
  const someExistingCourses = faker.helpers.arrayElements(
    generator.existingCodelyCourses,
    {
      min: 1,
      max: 3,
    }
  );

  beforeAll(async () => {
    suggestions = await generator.generateWithReason(
      UserCourseSuggestionsMother.withoutSuggestions(someExistingCourses)
    );
  }, 60000);

  it("suggest only 3 courses", () => {
    expect(suggestions.length).toBe(3);
  });

  it("suggest only existing courses", () => {
    const suggestedCourseNames = suggestions.map(
      (suggestion) => suggestion.courseName
    );

    expect(generator.existingCodelyCourses).toEqual(
      expect.arrayContaining(suggestedCourseNames)
    );
  });

  it("suggest only courses that have not been completed", () => {
    const suggestedCourseNames = suggestions.map(
      (suggestion) => suggestion.courseName
    );

    expect(someExistingCourses).not.toEqual(
      expect.arrayContaining(suggestedCourseNames)
    );
  });

  //   it("suggest relevant courses", async () => {
  //     const suggestedCourseNames = suggestions.map(
  //       (suggestion) => suggestion.courseName
  //     );

  //     const evaluator = await loadEvaluator("criteria", {
  //       criteria: "helpfulness",
  //       llm: new Ollama({
  //         model: "mistral",
  //         temperature: 0,
  //         callbacks: [
  //           {
  //             handleLLMStart: (_llm: Serialized, prompts: string[]) => {
  //               console.log("-- PROMPT --\n");
  //               console.log(prompts[0]);
  //             },
  //             handleLLMEnd: (output: LLMResult) => {
  //               console.log("\n\n-- RESULT --\n");
  //               console.log(output.generations[0][0].text);
  //             },
  //           },
  //         ],
  //       }),
  //     });

  //     const response = await evaluator.evaluateStrings({
  //       input: `Dado que ofrecemos estos cursos:
  // ${formatList(generator.existingCodelyCourses)}

  // Sugiere 3 cursos similares para alguien que ha completado los siguientes:
  // ${formatList(someExistingCourses)}
  // `,
  //       prediction: suggestedCourseNames.join(", "),
  //     });

  //     console.log(response);

  //     expect(response.value).toEqual("Y");
  //   }, 30000);
});

// function formatList(items: string[]): string {
//   return items.map((name) => `\t- ${name}`).join(`\n`);
// }
