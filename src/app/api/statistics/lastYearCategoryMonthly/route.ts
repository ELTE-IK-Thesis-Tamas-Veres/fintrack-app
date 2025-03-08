import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface MonthlyCategoryStatistics {
  month: string;
  amount: number;
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams.toString();

    const endpoint = `statistics/lastYearCategoryMonthly?${queryParams}`;

    const resp: MonthlyCategoryStatistics[] | null = await callFinTrackServices<
      MonthlyCategoryStatistics[]
    >(req, endpoint, "GET");

    console.log("API Response:", resp);

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
