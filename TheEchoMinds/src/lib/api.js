const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    signal: controller.signal,
    credentials: "include",
  };

  try {
    const response = await fetch(`${API_BASE}${path}`, fetchOptions);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Server timeout. Check backend/MongoDB and try again.");
    }
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot reach backend (${API_BASE}). Start backend server and check CORS/env.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
