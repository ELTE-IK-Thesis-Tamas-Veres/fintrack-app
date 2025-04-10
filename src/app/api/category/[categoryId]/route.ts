import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { EditCategoryRequest } from "@/types/DTO/Category";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  try {
    const { categoryId } = await params;
    const body: EditCategoryRequest = await req.json();

    await callFinTrackServices(req, `category/${categoryId}`, "PUT", body);

    return NextResponse.json("Category updated successfully", { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  try {
    const { categoryId } = await params;
    await callFinTrackServices(req, `category/${categoryId}`, "DELETE");

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
