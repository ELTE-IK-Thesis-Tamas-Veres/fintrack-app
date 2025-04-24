export async function callFinTrackServices<T>(
  request: Request,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T | null> {
  const apiEndpoint = `${process.env.FINTRACK_API_URL}/api/`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const authHeader = request?.headers.get("Authorization");

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log("➡️  API Request:", method, `${apiEndpoint}${endpoint}`);

    const requestOptions: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${apiEndpoint}${endpoint}`, requestOptions);

    console.log("🔄 API Response:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText}. Response: ${errorBody}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log("⚠️  API Response has no JSON content");
      return null;
    }

    return (await response.json()) as Promise<T>;
  } catch (error: unknown) {
    console.error("❌ API Call Error:", error);
    throw new Error(`API Call Failed: ${(error as Error).message}`);
  }
}
