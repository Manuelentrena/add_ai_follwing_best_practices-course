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
  finished_courses: string[];
};

export class MySqlUserRepository implements UserRepository {
  constructor(private readonly connection: PostgresConnection) {}

  async save(user: User): Promise<void> {
    const userPrimitives = user.toPrimitives();

    const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, finished_courses)
			VALUES (
						   '${userPrimitives.id}',
						   '${userPrimitives.name}',
						   '${userPrimitives.email}',
						   '${userPrimitives.profilePicture}',
						   '${userPrimitives.status.valueOf()}',
						   '${JSON.stringify(userPrimitives.finishedCourses)}'
				   );`;

    await this.connection.query(query);
  }

  async search(id: UserId): Promise<User | null> {
    const query = `
      SELECT id, name, email, profile_picture, status, finished_courses
      FROM mooc__users
      WHERE id = $1;
    `;

    const [user] = await this.connection.query<DatabaseUser>(query, [id.value]);

    if (!user) {
      return null;
    }

    const finishedCourses = JSON.parse(
      user.finished_courses as unknown as string
    ) as string[];

    return User.fromPrimitives({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
      status: user.status,
      finishedCourses,
      recommendedCourses: "",
    });
  }
}
