import { MySqlUserRepository } from "../../../../../src/contexts/mooc/users/infrastructure/MySqlUserRepository";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";
import { CriteriaMother } from "../../../shared/domain/criteria/CriteriaMother";
import { UserIdMother } from "../domain/UserIdMother";
import { UserMother } from "../domain/UserMother";

describe("MySqlUserRepository should", () => {
  const connection = new PostgresConnection();
  const repository = new MySqlUserRepository(connection);

  beforeEach(async () => {
    await connection.query(
      "TRUNCATE TABLE mooc__users RESTART IDENTITY CASCADE;"
    );
  });
  afterAll(async () => await connection.close());

  it("save a user", async () => {
    const user = UserMother.create();

    await repository.save(user);
  });

  it("return null searching a non existing user", async () => {
    const userId = UserIdMother.create();

    expect(await repository.search(userId)).toBeNull();
  });

  it("return existing user", async () => {
    const user = UserMother.create();

    await repository.save(user);

    expect(await repository.search(user.id)).toStrictEqual(user);
  });
});
