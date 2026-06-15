import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import Login from "./signup/L";
import Signup from "./signup/Signup"; 
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Access Routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/paymentsuccess"
            element={<PaymentSuccess />}
          />

          <Route
            path="/paymentfailed"
            element={<PaymentFailed />}
          />

          {/* Guarded Core App Architecture Routes */}
          <Route 
            path="/*" 
            element = {
              <ProtectedRoute>
                <Home />

               </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);




