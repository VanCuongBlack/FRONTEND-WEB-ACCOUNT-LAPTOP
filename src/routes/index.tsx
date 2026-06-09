import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from '@/pages/LandingPage'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import VerifyResetOtpPage from '@/pages/auth/VerifyResetOtpPage'

import LaptopListPage from '@/pages/product/LaptopListPage'
import LaptopDetailPage from '@/pages/product/LaptopDetailPage'
import AccountListPage from '@/pages/product/AccountListPage'
import AccountDetailPage from '@/pages/product/AccountDetailPage'
import BestSellerPage from '@/pages/product/BestSellerPage'

import CartPage from '@/pages/cart/CartPage'
import CheckoutPage from '@/pages/checkout/CheckoutPage'
import OrderSuccessPage from '@/pages/checkout/OrderSuccessPage'

import ProfilePage from '@/pages/profile/ProfilePage'
import EditProfilePage from '@/pages/profile/EditProfilePage'
import HistoryPage from '@/pages/profile/HistoryPage'
import LaptopOrderDetailPage from '@/pages/profile/LaptopOrderDetailPage'
import AccountOrderDetailPage from '@/pages/profile/AccountOrderDetailPage'

import NotificationPage from '@/pages/notification/NotificationPage'
import WarrantyPolicyPage from '@/pages/WarrantyPolicyPage'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import SystemSettingsPage from '@/pages/admin/SystemSettingsPage'

import StaffDashboard from '@/pages/staff/StaffDashboard'
import ProductManagementPage from '@/pages/staff/ProductManagementPage'
import InventoryManagementPage from '@/pages/staff/InventoryManagementPage'
import OrderManagementPage from '@/pages/staff/OrderManagementPage'
import CustomerManagementPage from '@/pages/staff/CustomerManagementPage'
import WarrantyManagementPage from '@/pages/staff/WarrantyManagementPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
        <Route path="/notification" element={<NotificationPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Product */}
        <Route path="/laptops" element={<LaptopListPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />
        <Route path="/accounts" element={<AccountListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />

        {/* Cart / Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />

        {/* Customer */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/history" element={<HistoryPage />} />
        <Route
          path="/profile/history/laptop/:id"
          element={<LaptopOrderDetailPage />}
        />
        <Route
          path="/profile/history/account/:id"
          element={<AccountOrderDetailPage />}
        />

        {/* Admin / Chủ cửa hàng */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<div>Báo cáo</div>} />
        <Route path="/admin/employees" element={<div>Quản lý nhân viên</div>} />
        <Route path="/admin/roles" element={<div>Phân quyền</div>} />
        <Route path="/admin/settings" element={<SystemSettingsPage />} />

        {/* Staff / Nhân viên */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/products" element={<ProductManagementPage />} />
        <Route path="/staff/inventory" element={<InventoryManagementPage />} />
        <Route path="/staff/orders" element={<OrderManagementPage />} />
        <Route path="/staff/customers" element={<CustomerManagementPage />} />
        <Route path="/staff/warranty" element={<WarrantyManagementPage />} />
        <Route path="/staff/tickets" element={<div>Hỗ trợ khách hàng</div>} />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}