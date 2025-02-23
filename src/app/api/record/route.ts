import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";
import { GetCategoryResponse } from "../category/route";

export interface GetRecordResponse {
  id: number;
  date: Date;
  category?: GetCategoryResponse;
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

export interface CreateRecordRequest {
  date: string;
  categoryId: number | null;
  description: string;
  amount: number;
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Received Body:", body);

    const resp = await callFinTrackServices(req, "record", "POST", body);

    console.log("API Response:", resp);

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ API Request Failed:", error);

    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
};
