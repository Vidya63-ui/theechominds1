import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EmployeeAuthProvider } from "./context/EmployeeAuthContext.jsx";
import App from "./App.jsx";
import About from "./About.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Login from "./Login.jsx";
import Product1 from "./Product-1.jsx";
import Product2 from "./Product-2.jsx";
import Preorder from "./Preorder.jsx";
import Payment from "./Payment.jsx";
import Checkout from "./Checkout.jsx";
import Playapp from "./PlayApp.jsx";
import Support from "./Support.jsx";
import HelpCentre from "./HelpCentre.jsx";
import CompanyInvestorRelations from "./CompanyInvestorRelations.jsx";
import Dashboard from "./Dashboard.jsx";
import LegalPolicyPage from "./LegalPolicyPage.jsx";
import EmployeeLogin from "./EmployeeLogin.jsx";
import EchoSpace from "./EchoSpace.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import {
  TermsOfUsePage,
  WarrantyPolicyPage,
  RepairServicePolicyPage,
  ShippingPolicyPage,
} from "./PolicySupplementPages.jsx";
import "./index.css";
import { Navigate, useLocation } from "react-router-dom";
import { useEmployeeAuth } from "./context/EmployeeAuthContext.jsx";
import { getEmployeeToken } from "./lib/api.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (token) return children;
  return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
};

const ProtectedEmployeeRoute = ({ children }) => {
  const { isEmployeeLoggedIn, loading } = useEmployeeAuth();
  const hasToken = Boolean(getEmployeeToken());
  if (!hasToken) {
    return <Navigate to="/employee-login" replace />;
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400 text-sm">
        Checking work session…
      </div>
    );
  }
  if (!isEmployeeLoggedIn) {
    return <Navigate to="/employee-login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EmployeeAuthProvider>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route
          path="/echospace"
          element={
            <ProtectedEmployeeRoute>
              <EchoSpace />
            </ProtectedEmployeeRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedEmployeeRoute>
              <AdminDashboard />
            </ProtectedEmployeeRoute>
          }
        />
        <Route path="/preorder" element={<Preorder />} />
        <Route path="/payment/:preorderId" element={<Payment />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product-1" element={<Product1 />} />
        <Route path="/product-2" element={<Product2 />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/help-centre"
          element={
            <ProtectedRoute>
              <HelpCentre />
            </ProtectedRoute>
          }
        />
        <Route path="/company-investor-relations" element={<CompanyInvestorRelations />} />
        <Route path="/play" element={<Playapp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<LegalPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
        <Route path="/repair-service-policy" element={<RepairServicePolicyPage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        </Routes>
        </EmployeeAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

