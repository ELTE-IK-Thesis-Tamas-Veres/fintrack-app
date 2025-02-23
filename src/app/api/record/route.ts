import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";
import { GetCategoryTreeResponse } from "../category/route";

export interface GetRecordResponse {
  id: number;
  date: Date;
  category?: GetCategoryTreeResponse;
  description: string;
  amount: number;
}

export const GET = async (req: Request) => {
  try {
    const resp: GetRecordResponse[] | null = await callFinTrackServices<
      GetRecordResponse[]
    >(req, "record", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
