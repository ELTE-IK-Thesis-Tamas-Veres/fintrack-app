import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface MonthlyIncomeExpense {
  month: string;
  income: number;
  expense: number;
}

export const GET = async (req: Request) => {
  try {
    const resp: MonthlyIncomeExpense[] | null = await callFinTrackServices<
      MonthlyIncomeExpense[]
    >(req, "statistics/lastYearMonthly", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
