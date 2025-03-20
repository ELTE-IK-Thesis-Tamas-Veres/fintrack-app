import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    const body = {
      transactions: JSON.parse(text),
    };

    const resp = await callFinTrackServices(req, "import", "POST", body);

    if (!resp) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid file" }, { status: 500 });
  }
};
