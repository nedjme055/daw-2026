const API_URL = "http://localhost:8000/api";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(API_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", 
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}