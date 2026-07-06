import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'

import LandingPage from '@/pages/public/LandingPage'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import VerifyResetOtpPage from '@/pages/auth/VerifyResetOtpPage'
import GoogleAuthPage from '@/pages/auth/GoogleAuthPage'
import GoogleAuthSuccessPage from '@/pages/auth/GoogleAuthSuccessPage'

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
import SupportRequestPage from '@/pages/profile/SupportRequestPage'
import SupportRequestDetailPage from '@/pages/profile/SupportRequestDetailPage'

import NotificationPage from '@/pages/notification/NotificationPage'
import WarrantyPolicyPage from '@/pages/public/WarrantyPolicyPage'
import PurchaseGuidePage from '@/pages/public/PurchaseGuidePage'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import SystemSettingsPage from '@/pages/admin/SystemSettingsPage'
import EmployeeManagementPage from '@/pages/admin/EmployeeManagementPage'
import ReportsPage from '@/pages/admin/ReportsPage'

import StaffDashboard from '@/pages/staff/StaffDashboard'
import ProductManagementPage from '@/pages/staff/ProductManagementPage'
import InventoryManagementPage from '@/pages/staff/InventoryManagementPage'
import OrderManagementPage from '@/pages/staff/OrderManagementPage'
import CustomerManagementPage from '@/pages/staff/CustomerManagementPage'
import WarrantyManagementPage from '@/pages/staff/WarrantyManagementPage'
import StaffSettingsPage from '@/pages/staff/StaffSettingsPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
        <Route path="/purchase-guide" element={<PurchaseGuidePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google" element={<GoogleAuthPage />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccessPage />} />

        <Route path="/laptops" element={<LaptopListPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />
        <Route path="/accounts" element={<AccountListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />

        <Route path="/cart" element={<ProtectedRoute requiredRoles={['customer']}><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute requiredRoles={['customer']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute requiredRoles={['customer']}><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/notification" element={<ProtectedRoute requiredRoles={['customer']}><NotificationPage /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute requiredRoles={['customer']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute requiredRoles={['customer']}><EditProfilePage /></ProtectedRoute>} />
        <Route path="/profile/history" element={<ProtectedRoute requiredRoles={['customer']}><HistoryPage /></ProtectedRoute>} />
        <Route path="/profile/history/:id" element={<ProtectedRoute requiredRoles={['customer']}><LaptopOrderDetailPage /></ProtectedRoute>} />
        <Route path="/profile/history/laptop/:id" element={<ProtectedRoute requiredRoles={['customer']}><LaptopOrderDetailPage /></ProtectedRoute>} />
        <Route path="/profile/history/account/:id" element={<ProtectedRoute requiredRoles={['customer']}><AccountOrderDetailPage /></ProtectedRoute>} />
        <Route path="/profile/history/support/:type/:id" element={<ProtectedRoute requiredRoles={['customer']}><SupportRequestPage /></ProtectedRoute>} />
        <Route path="/profile/support/:ticketId" element={<ProtectedRoute requiredRoles={['customer']}><SupportRequestDetailPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute requiredRoles={['admin']}><EmployeeManagementPage /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute requiredRoles={['admin']}><CustomerManagementPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRoles={['admin']}><SystemSettingsPage /></ProtectedRoute>} />

        <Route path="/staff" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/products" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><ProductManagementPage /></ProtectedRoute>} />
        <Route path="/staff/inventory" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><InventoryManagementPage /></ProtectedRoute>} />
        <Route path="/staff/orders" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><OrderManagementPage /></ProtectedRoute>} />
        <Route path="/staff/customers" element={<ProtectedRoute requiredRoles={['admin']}><CustomerManagementPage /></ProtectedRoute>} />
        <Route path="/staff/warranty" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><WarrantyManagementPage /></ProtectedRoute>} />
        <Route path="/staff/tickets" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><WarrantyManagementPage /></ProtectedRoute>} />
        <Route path="/staff/settings" element={<ProtectedRoute requiredRoles={['staff', 'admin']}><StaffSettingsPage /></ProtectedRoute>} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
