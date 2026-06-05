import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import VerifyResetOtpPage from "@/pages/auth/VerifyResetOtpPage";
import HistoryPage from "@/pages/profile/HistoryPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import OrderManagementPage from "@/pages/admin/OrderManagementPage";
import WarrantyManagementPage from "@/pages/admin/WarrantyManagementPage";
import InventoryManagementPage from "@/pages/admin/InventoryManagementPage";


import LaptopOrderDetailPage from "@/pages/profile/LaptopOrderDetailPage";
import AccountOrderDetailPage from "@/pages/profile/AccountOrderDetailPage";

import LaptopListPage from "@/pages/product/LaptopListPage";
import LaptopDetailPage from "@/pages/product/LaptopDetailPage";
import AccountListPage from "@/pages/product/AccountListPage";
import AccountDetailPage from "@/pages/product/AccountDetailPage";
import BestSellerPage from "@/pages/product/BestSellerPage";

import CartPage from "@/pages/cart/CartPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import OrderSuccessPage from "@/pages/checkout/OrderSuccessPage";
import ProductManagementPage from '@/pages/admin/ProductManagementPage'
import CustomerManagementPage from "@/pages/admin/CustomerManagementPage";

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
        <Route path="/admin/orders" element={<OrderManagementPage />} />
        <Route path="/admin/warranty" element={<WarrantyManagementPage />} />
        <Route path="/admin/inventory" element={<InventoryManagementPage />} />

        {/* Product */}
        <Route path="/laptops" element={<LaptopListPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />
        <Route path="/accounts" element={<AccountListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />

        {/* Customer */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/history" element={<HistoryPage />} />
        <Route path="/profile/history/laptop/:id" element={<LaptopOrderDetailPage />} />
        <Route path="/profile/history/account/:id" element={<AccountOrderDetailPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/admin/products" element={<ProductManagementPage />} />
        <Route path="/admin/customers" element={<CustomerManagementPage />}/>

        <Route path="/checkout" element={<CheckoutPage />} />
        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}