import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { GetCategoryResponse } from "@/types/DTO/Category";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const resp: GetCategoryResponse[] | null = await callFinTrackServices<
      GetCategoryResponse[]
    >(req, "category", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const resp = await callFinTrackServices(req, "category", "POST", body);

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();

    const resp = await callFinTrackServices(req, "category", "PUT", body);

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
};
