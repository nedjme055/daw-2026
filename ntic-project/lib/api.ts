const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("auth_token");
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const isApiEndpoint =
    normalizedEndpoint === "/api" || normalizedEndpoint.startsWith("/api/");
  const isSanctumEndpoint =
    normalizedEndpoint === "/sanctum" ||
    normalizedEndpoint.startsWith("/sanctum/");
  const finalEndpoint =
    isApiEndpoint || isSanctumEndpoint
      ? normalizedEndpoint
      : `/api${normalizedEndpoint}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (!headers.has("Authorization")) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  if (!headers.has("X-XSRF-TOKEN")) {
    const xsrf = getCookie("XSRF-TOKEN");
    if (xsrf) {
      headers.set("X-XSRF-TOKEN", xsrf);
    }
  }

  const res = await fetch(`${API_URL}${finalEndpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(headers.entries()),
    },
    ...options,
  });

  // IMPORTANT: do NOT force JSON if there is no body
  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || res.statusText;
    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).data = data;
    throw error;
  }

  return data;
}
