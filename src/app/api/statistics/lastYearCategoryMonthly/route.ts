import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { MonthlyCategoryStatistics } from "@/types/DTO/Statistics";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const queryParams = url.searchParams.toString();

    const endpoint = `statistics/lastYearCategoryMonthly?${queryParams}`;

    const resp: MonthlyCategoryStatistics[] | null = await callFinTrackServices<
      MonthlyCategoryStatistics[]
    >(req, endpoint, "GET");

    console.log("API Response length:", resp?.length);

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
