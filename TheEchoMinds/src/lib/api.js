/**
 * Express mounts routes under `/api`. Bare origins like `http://localhost:5000` must become `.../api`.
 */
export function normalizeApiBase(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "/api";
  if (s.startsWith("/")) {
    const t = s.replace(/\/+$/, "");
    return t || "/api";
  }
  const noTrail = s.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(noTrail)) return noTrail;
  try {
    const u = new URL(noTrail);
    const path = (u.pathname || "/").replace(/\/+$/, "") || "/";
    if (path === "/") return `${u.origin}/api`;
    return noTrail;
  } catch {
    return "/api";
  }
}

export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

/** Always produce a valid URL: `/api` + `/help-centre/tickets` → `/api/help-centre/tickets` */
export function joinApiUrl(path) {
  const p = String(path || "").startsWith("/") ? path : `/${path}`;
  const base = String(API_BASE || "/api").replace(/\/+$/, "");
  return `${base}${p}`;
}

/** Auth endpoints where 401 means invalid credentials/OTP, not an expired session */
const AUTH_401_NO_SESSION_CLEAR = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/signup",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/employee-auth/request-otp",
  "/employee-auth/verify-otp",
]);

const EMPLOYEE_AUTH_401_NO_CLEAR = new Set([
  "/employee-auth/request-otp",
  "/employee-auth/verify-otp",
]);

export const EMPLOYEE_TOKEN_KEY = "employeeToken";
/** Shown when /me fails temporarily so UI still knows you are signed in as work email */
export const EMPLOYEE_EMAIL_CACHE_KEY = "employeeEmailCache";

export function getEmployeeToken() {
  return localStorage.getItem(EMPLOYEE_TOKEN_KEY);
}

export function setEmployeeToken(token) {
  localStorage.setItem(EMPLOYEE_TOKEN_KEY, token);
}

export function clearEmployeeToken() {
  localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
  localStorage.removeItem(EMPLOYEE_EMAIL_CACHE_KEY);
}

export function setEmployeeEmailCache(email) {
  if (email) localStorage.setItem(EMPLOYEE_EMAIL_CACHE_KEY, String(email).trim());
  else localStorage.removeItem(EMPLOYEE_EMAIL_CACHE_KEY);
}

export function getEmployeeEmailCache() {
  return localStorage.getItem(EMPLOYEE_EMAIL_CACHE_KEY);
}

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
    const response = await fetch(joinApiUrl(path), fetchOptions);
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
      throw new Error(formatHttpErrorMessage(response, data, path));
    }

    if (!response.ok) {
      throw new Error(formatHttpErrorMessage(response, data, path));
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

function formatHttpErrorMessage(response, data, path) {
  const fromBody =
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" ? data : null);
  if (fromBody) return String(fromBody);
  const statusLine = `${response.status} ${response.statusText || ""}`.trim();
  if (response.status === 404) {
    const full = typeof path === "string" ? joinApiUrl(path) : path;
    return `Not found (${statusLine}) at ${full}. Restart the API server after pulling latest code; VITE_API_URL should be unset or end with /api.`;
  }
  if (response.status === 503) {
    return 'Database unavailable. Start or fix MongoDB and wait until the API logs "MongoDB connected."';
  }
  return `Request failed (${statusLine})`;
}

/** Calls admin / employee-auth routes with the work-email JWT (separate from customer auth). */
export async function employeeApiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const headers = {
    ...(options.headers || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getEmployeeToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(joinApiUrl(path), fetchOptions);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      const hadToken = Boolean(token);
      if (hadToken && !EMPLOYEE_AUTH_401_NO_CLEAR.has(path)) {
        clearEmployeeToken();
        window.dispatchEvent(new Event("employee-auth-changed"));
        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/admin")
        ) {
          window.location.replace("/employee-login");
        }
      }
      throw new Error(formatHttpErrorMessage(response, data, path));
    }

    if (!response.ok) {
      throw new Error(formatHttpErrorMessage(response, data, path));
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Server timeout. Check backend and try again.");
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
