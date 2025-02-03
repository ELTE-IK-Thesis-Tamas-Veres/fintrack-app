import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    console.log(accessToken);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // console.log(requestOptions);

    const resp = await fetch(
      `https://localhost:7101/api/auth/login`,
      requestOptions
    );

    console.log("###########################");
    // console.log(resp);

    const shows = resp;

    return NextResponse.json(shows, res);
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
});
