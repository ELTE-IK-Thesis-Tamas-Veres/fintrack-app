import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { EditRecordRequest } from "@/types/DTO/Record";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ recordId: string }> }
) => {
  try {
    const { recordId } = await params;

    const body: EditRecordRequest = await req.json();

    const resp = await callFinTrackServices(
      req,
      `record/${recordId}`,
      "PUT",
      body
    );

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ recordId: number }> }
) => {
  const { recordId } = await params;

  try {
    const resp = await callFinTrackServices(
      req,
      `record/${recordId}`,
      "DELETE"
    );

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
