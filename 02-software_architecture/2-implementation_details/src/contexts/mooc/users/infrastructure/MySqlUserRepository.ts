import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  status: string;
  completed_courses: string;
};

export class MySqlUserRepository implements UserRepository {
  constructor(private readonly connection: PostgresConnection) {}

  async save(user: User): Promise<void> {
    const userPrimitives = user.toPrimitives();

    const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, completed_courses)
			VALUES (
						   '${userPrimitives.id}',
						   '${userPrimitives.name}',
						   '${userPrimitives.email}',
						   '${userPrimitives.profilePicture}',
						   '${userPrimitives.status.valueOf()}',
						   '${JSON.stringify(userPrimitives.completedCourses)}'
				   );`;

    await this.connection.query(query);
  }

  async search(id: UserId): Promise<User | null> {
    const query = `
			SELECT id, name, email, profile_picture, completed_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

    const results = await this.connection.query<DatabaseUser>(query);
    const result = results[0];

    if (!result) {
      return null;
    }

    const completedCourses = JSON.parse(result.completed_courses) as string[];

    return User.fromPrimitives({
      id: result.id,
      name: result.name,
      email: result.email,
      profilePicture: result.profile_picture,
      status: result.status,
      completedCourses,
    });
  }

  private userHasAnyCourseFinished(completedCourses: string[]): boolean {
    return completedCourses.length > 0;
  }
}
