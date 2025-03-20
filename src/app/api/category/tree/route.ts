import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { GetCategoryTreeResponse } from "@/types/DTO/Category";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const resp: GetCategoryTreeResponse[] | null = await callFinTrackServices<
      GetCategoryTreeResponse[]
    >(req, "category/tree", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
