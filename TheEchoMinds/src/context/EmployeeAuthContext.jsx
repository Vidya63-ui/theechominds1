import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearEmployeeToken,
  employeeApiFetch,
  getEmployeeEmailCache,
  getEmployeeToken,
  setEmployeeEmailCache,
  setEmployeeToken,
} from "@/lib/api";

const EmployeeAuthContext = createContext(null);

export function EmployeeAuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Apply token + employee from verify-otp (does not call /me).
   * Fixes redirect when /me fails due to network/CORS while OTP succeeded.
   */
  const commitEmployeeSession = useCallback((token, employeePayload) => {
    if (token) setEmployeeToken(token);
    const emp = employeePayload?.email ? { email: employeePayload.email } : null;
    setEmployee(emp);
    if (emp?.email) setEmployeeEmailCache(emp.email);
    setLoading(false);
  }, []);

  const refreshEmployeeAuth = useCallback(() => {
    const token = getEmployeeToken();
    if (!token) {
      setEmployee(null);
      setLoading(false);
      return Promise.resolve(null);
    }
    setLoading(true);
    const cachedEmail = getEmployeeEmailCache();
    if (cachedEmail) {
      setEmployee({ email: cachedEmail });
    }
    return employeeApiFetch("/employee-auth/me")
      .then((data) => {
        const emp = data.employee || null;
        setEmployee(emp);
        if (emp?.email) setEmployeeEmailCache(emp.email);
        return data;
      })
      .catch(() => {
        // Do NOT clear token here: only employeeApiFetch clears it on 401.
        // Previously we cleared on any error (e.g. /me 503), which removed a valid session after OTP.
        if (!getEmployeeToken()) {
          setEmployee(null);
          setEmployeeEmailCache(null);
        } else {
          const cached = getEmployeeEmailCache();
          setEmployee(cached ? { email: cached } : null);
        }
        return null;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshEmployeeAuth();
  }, [refreshEmployeeAuth]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "employeeToken" || e.key === null) {
        refreshEmployeeAuth();
      }
    };
    const onCustom = () => refreshEmployeeAuth();
    window.addEventListener("storage", onStorage);
    window.addEventListener("employee-auth-changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("employee-auth-changed", onCustom);
    };
  }, [refreshEmployeeAuth]);

  const logoutEmployee = useCallback((navigate) => {
    clearEmployeeToken();
    setEmployee(null);
    window.dispatchEvent(new Event("employee-auth-changed"));
    if (navigate) navigate("/");
  }, []);

  return (
    <EmployeeAuthContext.Provider
      value={{
        employee,
        isEmployeeLoggedIn: !!employee,
        loading,
        refreshEmployeeAuth,
        commitEmployeeSession,
        logoutEmployee,
      }}
    >
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth() {
  const ctx = useContext(EmployeeAuthContext);
  if (!ctx) {
    throw new Error("useEmployeeAuth must be used within EmployeeAuthProvider");
  }
  return ctx;
}
