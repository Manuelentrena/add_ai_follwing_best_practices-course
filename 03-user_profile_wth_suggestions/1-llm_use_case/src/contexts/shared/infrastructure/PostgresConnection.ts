import { Pool } from "pg";

export class PostgresConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: "localhost",
      user: "codely",
      password: "c0d3ly7v",
      database: "mooc",
      port: 5432,
    });
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async truncate(table: string): Promise<void> {
    await this.pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
