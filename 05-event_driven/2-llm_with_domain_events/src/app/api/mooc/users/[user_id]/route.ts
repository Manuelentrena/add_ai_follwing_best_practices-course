import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { UserFinder } from "../../../../../contexts/mooc/users/application/find/UserFinder";
import { MySqlUserRepository } from "../../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";

const finder = new UserFinder(
  new MySqlUserRepository(new PostgresConnection())
);

export async function GET(
  _request: Request,
  context: { params: Params }
): Promise<NextResponse> {
  const userId = context.params.user_id as string;

  const users = await finder.find(userId);

  return NextResponse.json(users.toPrimitives());
}
