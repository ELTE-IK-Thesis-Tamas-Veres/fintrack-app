import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

export interface GetCategoryResponse {
  id: number;
  name: string;
}

export const GET = async (req: Request) => {
  try {
    const resp: GetCategoryResponse[] | null = await callFinTrackServices<
      GetCategoryResponse[]
    >(req, "category", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export interface AddCategoryRequest {
  name: string;
}

export const POST = async (req: Request) => {
  try {
    // 🔥 Parse request body
    const body = await req.json();
    console.log("Received Body:", body);

    // 🔥 Call external API
    const resp = await callFinTrackServices(req, "category", "POST", body);

    console.log("API Response:", resp);

    // ✅ If API returns an empty response, return 204 No Content
    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    // ✅ Return successful response
    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ API Request Failed:", error);

    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
};

export interface EditCategoriesParentRequest {
  categoryIds: number[];
  parentId: number | null;
}

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Received Body:", body);

    // 🔥 Call external API
    const resp = await callFinTrackServices(req, "category", "PUT", body);

    return NextResponse.json(resp, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ API Request Failed:", error);

    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
};
