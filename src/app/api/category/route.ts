import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextResponse } from "next/server";

interface categoryResponse {
  id: number;
  name: string;
}

export interface AddCategoryRequest {
  name: string;
}

export const GET = async () => {
  try {
    const resp: categoryResponse[] | null = await callFinTrackServices<
      categoryResponse[]
    >("category", "GET");

    return NextResponse.json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    // 🔥 Parse request body
    const body = await req.json();
    console.log("Received Body:", body);

    // 🔥 Call external API
    const resp = await callFinTrackServices("category", "POST", body);

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
