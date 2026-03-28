const API_BASE = import.meta.env.VITE_API_URL || "/api";

/** Auth endpoints where 401 means invalid credentials/OTP, not an expired session */
const AUTH_401_NO_SESSION_CLEAR = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/signup",
  "/auth/verify-otp",
  "/auth/resend-otp",
]);

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
  };

  try {
    const response = await fetch(`${API_BASE}${path}`, fetchOptions);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      const hadToken = Boolean(token);
      if (hadToken && !AUTH_401_NO_SESSION_CLEAR.has(path)) {
        clearToken();
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.replace("/login");
        }
      }
      throw new Error(data.message || "Request failed");
    }

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
