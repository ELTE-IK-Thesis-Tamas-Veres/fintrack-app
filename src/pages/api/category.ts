// pages/api/categories.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { callFinTrackServices } from "@/lib/fintrack-services-httpclient";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

interface CategoryResponse {
  id: number;
  name: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Call your service to get categories
    const resp: CategoryResponse[] = await callFinTrackServices<
      CategoryResponse[]
    >("category", "GET");
    console.log(resp);

    // Return a JSON response with a 200 status code
    res.status(200).json(resp);
  } catch (error: unknown) {
    console.error("API Request Failed:", error);

    // Return a JSON error response with a 500 status code
    res.status(500).json({ error: (error as Error).message });
  }
}

export default withApiAuthRequired(handler);
