import { CriteriaToSqlConverter } from "../../../../../src/contexts/shared/infrastructure/criteria/CriteriaToSqlConverter";
import { CriteriaMother } from "../../domain/criteria/CriteriaMother";

describe("CriteriaToSqlConverter should", () => {
  const converter = new CriteriaToSqlConverter();

  it("Generate simple select with an empty criteria", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.empty()
    );

    expect(actualQuery).toBe("SELECT id, name FROM users;");
  });

  it("Generate select with order", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.emptySorted("id", "DESC")
    );

    expect(actualQuery).toBe("SELECT id, name FROM users ORDER BY id DESC;");
  });

  it("Generate select with one filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "EQUAL", "Javier")
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name = 'Javier';"
    );
  });

  it("Generate select with one filter sorted", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilterSorted(
        "name",
        "EQUAL",
        "Javier",
        "id",
        "DESC"
      )
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name = 'Javier' ORDER BY id DESC;"
    );
  });

  it("Generate select with multiples filters", () => {
    const actualQuery = converter.convert(
      ["id", "name", "email"],
      "users",
      CriteriaMother.create({
        filters: [
          {
            field: "name",
            operator: "EQUAL",
            value: "Javier",
          },
          {
            field: "email",
            operator: "EQUAL",
            value: "javier@terra.es",
          },
        ],
        orderBy: null,
        orderType: null,
        pageSize: null,
        pageNumber: null,
      })
    );

    expect(actualQuery).toBe(
      "SELECT id, name, email FROM users WHERE name = 'Javier' AND email = 'javier@terra.es';"
    );
  });

  it("Generate select with multiples filters and sort", () => {
    const actualQuery = converter.convert(
      ["id", "name", "email"],
      "users",
      CriteriaMother.create({
        filters: [
          {
            field: "name",
            operator: "EQUAL",
            value: "Javier",
          },
          {
            field: "email",
            operator: "EQUAL",
            value: "javier@terra.es",
          },
        ],
        orderBy: "id",
        orderType: "DESC",
        pageSize: null,
        pageNumber: null,
      })
    );

    expect(actualQuery).toBe(
      "SELECT id, name, email FROM users WHERE name = 'Javier' AND email = 'javier@terra.es' ORDER BY id DESC;"
    );
  });

  it("Generate select with one contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "CONTAINS", "Javier")
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name LIKE '%Javier%';"
    );
  });

  it("Generate select with one not contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_CONTAINS", "Javier")
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name NOT LIKE '%Javier%';"
    );
  });

  it("Generate simple select paginated", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.emptyPaginated(10, 3)
    );

    expect(actualQuery).toBe("SELECT id, name FROM users LIMIT 10 OFFSET 20;");
  });

  it("Generate select with not contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_CONTAINS", "Javier")
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name NOT LIKE '%Javier%';"
    );
  });

  it("Generate select with not equals filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_EQUAL", "Javier")
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name != 'Javier';"
    );
  });

  it("Generate select with one filter with a different name in the query", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("fullname", "EQUAL", "Javier"),
      { fullname: "name" }
    );

    expect(actualQuery).toBe(
      "SELECT id, name FROM users WHERE name = 'Javier';"
    );
  });
});
