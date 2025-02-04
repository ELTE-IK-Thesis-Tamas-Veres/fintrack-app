import { getAccessToken } from "@auth0/nextjs-auth0";

export async function callFinTrackServices<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const { accessToken } = await getAccessToken();

    console.log("Access Token:", accessToken);

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(
      `https://localhost:7101/api/${endpoint}`,
      requestOptions
    );

    console.log(response);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error: unknown) {
    console.error("API Call Error:", error);
    throw error;
  }
}
