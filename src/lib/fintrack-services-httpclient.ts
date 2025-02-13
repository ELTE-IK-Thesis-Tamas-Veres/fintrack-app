import { auth0 } from "@/lib/auth0";

export async function callFinTrackServices<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T | null> {
  // ✅ Return `null` if no response body
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 🔥 Ensure token retrieval is handled properly
    const accessToken = await auth0.getAccessToken();

    if (accessToken?.token) {
      headers["Authorization"] = `Bearer ${accessToken.token}`;
    }

    console.log(
      "➡️  API Request:",
      method,
      `https://localhost:7101/api/${endpoint}`
    );
    console.log("📦 Request Body:", body);

    const requestOptions: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(
      `https://localhost:7101/api/${endpoint}`,
      requestOptions
    );

    console.log("🔄 API Response:", response.status, response.statusText);

    // 🔥 Check for error response (Non 200/201 status codes)
    if (!response.ok) {
      const errorBody = await response.text(); // Try to extract more error details
      throw new Error(
        `API Error: ${response.status} ${response.statusText}. Response: ${errorBody}`
      );
    }

    // ✅ Handle cases where response has no content (204 No Content or empty body)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log("⚠️  API Response has no JSON content");
      return null; // ✅ Return `null` when there's no JSON response
    }

    // ✅ Success - return parsed JSON response
    return (await response.json()) as Promise<T>;
  } catch (error: unknown) {
    // 🔥 Catch and log detailed errors
    console.error("❌ API Call Error:", error);
    throw new Error(`API Call Failed: ${(error as Error).message}`);
  }
}
