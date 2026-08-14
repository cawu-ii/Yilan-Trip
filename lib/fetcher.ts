export class ApiError extends Error {}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error || `請求失敗（${res.status}）`);
  }
  return res.json() as Promise<T>;
}

export async function sendJson<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new ApiError(errBody?.error || `請求失敗（${res.status}）`);
  }
  return res.json() as Promise<T>;
}
