import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams.toString();

    const endpoint = `sankey?${queryParams}`;

    const resp: SankeyData[] | null = await callFinTrackServices<SankeyData[]>(
      req,
      endpoint,
      "GET"
    );

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
