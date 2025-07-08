import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { UserId } from "../../users/domain/UserId";
import {
  CourseSuggestion,
  CourseSuggestionPrimitives,
} from "../domain/CourseSuggestion";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

type DatabaseUserCourseSuggestions = {
  user_id: string;
  completed_courses: string;
  suggested_courses: string;
};

export class PostgresUserCourseSuggestionsRepository
  implements UserCourseSuggestionsRepository
{
  constructor(private readonly connection: PostgresConnection) {}

  async save(user: UserCourseSuggestions): Promise<void> {
    const primitives = user.toPrimitives();

    const query = `
      INSERT INTO mooc__user_course_suggestions (user_id, completed_courses, suggested_courses)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO UPDATE SET
        completed_courses = EXCLUDED.completed_courses,
        suggested_courses = EXCLUDED.suggested_courses;
    `;

    const params = [
      primitives.userId,
      JSON.stringify(primitives.completedCourses),
      primitives.suggestions,
    ];

    await this.connection.query(query, params);
  }

  async search(id: UserId): Promise<UserCourseSuggestions | null> {
    const query = `
      SELECT user_id, completed_courses, suggested_courses
      FROM mooc__user_course_suggestions
      WHERE user_id = $1;
    `;

    const result =
      await this.connection.searchOne<DatabaseUserCourseSuggestions>(query, [
        id.value,
      ]);

    if (!result) {
      return null;
    }

    const completedCourses = JSON.parse(result.completed_courses) as string[];
    const suggestions = JSON.parse(
      result.suggested_courses
    ) as CourseSuggestionPrimitives[];

    return UserCourseSuggestions.fromPrimitives({
      userId: result.user_id,
      completedCourses,
      suggestions: suggestions.map((primitives) =>
        CourseSuggestion.fromPrimitives(primitives)
      ),
    });
  }
}
