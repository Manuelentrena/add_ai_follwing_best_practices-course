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
  suggested_courses: string;
};

export class MySqlUserRepository implements UserRepository {
  constructor(private readonly connection: PostgresConnection) {}

  async save(user: User): Promise<void> {
    const userPrimitives = user.toPrimitives();

    const query = `
    INSERT INTO mooc__users (id, name, email, profile_picture, status, suggested_courses)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      profile_picture = EXCLUDED.profile_picture,
      status = EXCLUDED.status,
      suggested_courses = EXCLUDED.suggested_courses;
  `;

    const params = [
      userPrimitives.id,
      userPrimitives.name,
      userPrimitives.email,
      userPrimitives.profilePicture,
      userPrimitives.status.valueOf(),
      userPrimitives.suggestedCourses,
    ];

    await this.connection.query(query, params);
  }

  async search(id: UserId): Promise<User | null> {
    console.log("Searching user with ID:", id.value);
    const query = `
      SELECT id, name, email, profile_picture, status, suggested_courses
      FROM mooc__users
      WHERE id = $1;
    `;

    const result = await this.connection.searchOne<DatabaseUser>(query, [
      id.value,
    ]);

    if (!result) {
      return null;
    }

    return User.fromPrimitives({
      id: result.id,
      name: result.name,
      email: result.email,
      profilePicture: result.profile_picture,
      status: result.status,
      suggestedCourses: result.suggested_courses,
    });
  }
}
