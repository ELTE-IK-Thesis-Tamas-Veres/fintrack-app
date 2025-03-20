import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { MonthlyIncomeExpense } from "@/types/DTO/Statistics";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const resp: MonthlyIncomeExpense[] | null = await callFinTrackServices<
      MonthlyIncomeExpense[]
    >(req, "statistics/lastYearMonthly", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
