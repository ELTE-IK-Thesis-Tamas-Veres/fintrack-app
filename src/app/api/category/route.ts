import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

interface categoryResponse {
  id: number;
  name: string;
}

export const GET = withApiAuthRequired(async (req) => {
  try {
    const resp: categoryResponse[] = await callFinTrackServices<
      categoryResponse[]
    >("category", "GET");

    console.log(resp);

    return NextResponse.json(resp, req);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
