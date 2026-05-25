import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

import LaptopListPage from "@/pages/product/LaptopListPage";
import LaptopDetailPage from "@/pages/product/LaptopDetailPage";

import AccountListPage from "@/pages/product/AccountListPage";
import AccountDetailPage from "@/pages/product/AccountDetailPage";

import CartPage from "@/pages/cart/CartPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import BestSellerPage from "@/pages/product/BestSellerPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Laptop */}
        <Route path="/laptops" element={<LaptopListPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />

        {/* Account số */}
        <Route path="/accounts" element={<AccountListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}