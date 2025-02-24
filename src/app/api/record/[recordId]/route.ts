import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { EditRecordRequest } from "@/types/Record";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { recordId: string } }
) => {
  try {
    const body: EditRecordRequest = await req.json();
    console.log("Updating Category:", params.recordId, "with data:", body);

    const resp = await callFinTrackServices(
      req,
      `record/${params.recordId}`,
      "PUT",
      body
    );

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ API Update Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { recordId: number } }
) => {
  try {
    console.log("Deleting Category:", params.recordId);

    const resp = await callFinTrackServices(
      req,
      `record/${params.recordId}`,
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
    console.error("❌ API Delete Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
