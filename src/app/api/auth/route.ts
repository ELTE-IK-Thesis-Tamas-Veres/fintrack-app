import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const accessToken = await auth0.getAccessToken();
    console.log(accessToken);

    return NextResponse.json(accessToken);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
