import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { SankeyData } from "@/types/DTO/Sankey";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams.toString();

    let endpoint = `sankey`;

    if (queryParams) {
      endpoint += `?${queryParams}`;
    }

    const resp: SankeyData[] | null = await callFinTrackServices<SankeyData[]>(
      req,
      endpoint,
      "GET"
    );

    return NextResponse.json(resp);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
