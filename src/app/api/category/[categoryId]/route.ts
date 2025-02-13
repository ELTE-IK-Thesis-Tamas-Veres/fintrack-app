import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface EditCategoryRequest {
  name: string;
}

export const PUT = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const body: EditCategoryRequest = await req.json();
    console.log("Updating Category:", params.categoryId, "with data:", body);

    const resp = await callFinTrackServices(
      `category/${params.categoryId}`,
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
  { params }: { params: { categoryId: string } }
) => {
  try {
    console.log("Deleting Category:", params.categoryId);

    const resp = await callFinTrackServices(
      `category/${params.categoryId}`,
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
