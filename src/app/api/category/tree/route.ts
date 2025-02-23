import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface GetCategoryTreeResponse {
  id: number;
  name: string;
  children: GetCategoryTreeResponse[];
}

export const GET = async (req: Request) => {
  try {
    const resp: GetCategoryTreeResponse[] | null = await callFinTrackServices<
      GetCategoryTreeResponse[]
    >(req, "category/tree", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
