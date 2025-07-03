import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { UserCourseSuggestionsSearcher } from "../../../../../contexts/mooc/user_course_suggestions/application/search/UserCourseSuggestionsSearcher";
import { OllamaMistralUserCourseSuggestionsRepository } from "../../../../../contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralUserCourseSuggestionsRepository";
import { MySqlUserRepository } from "../../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";

const searcher = new UserCourseSuggestionsSearcher(
  new OllamaMistralUserCourseSuggestionsRepository(
    new MySqlUserRepository(new PostgresConnection())
  )
);

export async function GET(
  _request: Request,
  context: { params: Params }
): Promise<NextResponse> {
  console.log("GET /api/mooc/user_course_suggestions/[user_id]");
  const userId = context.params.user_id as string;

  const userCourseSuggestions = await searcher.search(userId);

  return NextResponse.json(userCourseSuggestions?.toPrimitives() ?? {});
}
