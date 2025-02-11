import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

interface categoryResponse {
  id: number;
  name: string;
}

export const GET = async () => {
  try {
    const resp: categoryResponse[] = await callFinTrackServices<
      categoryResponse[]
    >("category", "GET");

    console.log(resp);

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
