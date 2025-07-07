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

  async searchOne<T>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async truncate(table: string): Promise<void> {
    await this.pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
