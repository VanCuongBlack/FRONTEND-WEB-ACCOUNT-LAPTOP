import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import VerifyResetOtpPage from "@/pages/auth/VerifyResetOtpPage";

import AdminDashboard from "@/pages/admin/AdminDashboard";

import LaptopListPage from "@/pages/product/LaptopListPage";
import LaptopDetailPage from "@/pages/product/LaptopDetailPage";
import AccountListPage from "@/pages/product/AccountListPage";
import AccountDetailPage from "@/pages/product/AccountDetailPage";
import BestSellerPage from "@/pages/product/BestSellerPage";

import CartPage from "@/pages/cart/CartPage";
import ProfilePage from "@/pages/profile/ProfilePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Product */}
        <Route path="/laptops" element={<LaptopListPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />
        <Route path="/accounts" element={<AccountListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />

        {/* Customer */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}