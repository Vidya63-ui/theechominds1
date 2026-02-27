import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import About from "./About.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Login from "./Login.jsx";
import Product1 from "./Product-1.jsx";
import Product2 from "./Product-2.jsx";
import Preorder from "./Preorder.jsx";
import Payment from "./Payment.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preorder" element={<Preorder />} />
        <Route path="/payment/:preorderId" element={<Payment />} />
        <Route path="/product-1" element={<Product1 />} />
        <Route path="/product-2" element={<Product2 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

