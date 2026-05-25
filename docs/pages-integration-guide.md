# Hướng Dẫn Tích Hợp Pages - Đặt Lại Mật Khẩu & Tạo Mật Khẩu Mới

## 📋 Pages Vừa Tạo

### 1. ForgotPasswordPage.tsx
- **Vị trí**: `src/pages/ForgotPasswordPage.tsx`
- **Bước**: Step 1 của quy trình đặt lại mật khẩu
- **Màn hình Figma**: node-id=1-14 "Đặt lại mật khẩu"
- **Chức năng**:
  - User nhập email hoặc số điện thoại
  - Validate format email/phone
  - Gửi yêu cầu reset password
  - Điều hướng đến trang tạo mật khẩu mới

### 2. CreateNewPasswordPage.tsx
- **Vị trí**: `src/pages/CreateNewPasswordPage.tsx`
- **Bước**: Step 2 của quy trình đặt lại mật khẩu
- **Màn hình Figma**: node-id=1-15 "Tạo mật khẩu mới"
- **Chức năng**:
  - User nhập mã xác nhân (4-6 chữ số)
  - User nhập mật khẩu mới
  - Xác nhận mật khẩu (với check trùng)
  - Toggle show/hide password
  - Validate mật khẩu mạnh (8+ chars, uppercase, lowercase, numbers)
  - Lưu mật khẩu mới và điều hướng về login

---

## 🔀 Cách Tích Hợp vào Routing

### 1. Import Pages vào Routes File

```tsx
// src/routes/index.tsx hoặc routes.tsx
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { CreateNewPasswordPage } from '@/pages/CreateNewPasswordPage';
```

### 2. Thêm Routes

#### Option A: Nếu bạn dùng React Router DOM (v7+)

```tsx
// src/routes/index.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { CreateNewPasswordPage } from '@/pages/CreateNewPasswordPage';

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
    layout: AuthLayout,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    layout: AuthLayout,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    layout: AuthLayout,
  },
  {
    path: '/create-new-password',
    element: <CreateNewPasswordPage />,
    layout: AuthLayout,
  },
];

export default authRoutes;
```

#### Option B: Nếu dùng cách khác

```tsx
// Trong routes config của bạn
{
  path: '/forgot-password',
  element: <ForgotPasswordPage />,
},
{
  path: '/create-new-password',
  element: <CreateNewPasswordPage />,
}
```

### 3. Thêm Link từ Login Page

```tsx
// src/pages/LoginPage.tsx
// Thêm vào forgot password link (có sẵn trong code)
<a 
  href="/forgot-password" 
  className="text-base text-[#3783EC] hover:underline"
>
  Quên mật khẩu?
</a>
```

---

## 🔄 Quy Trình Luồng (Flow)

```
┌─────────────┐
│  Login Page │
└──────┬──────┘
       │
       └──> Click "Quên mật khẩu?"
       │
       v
┌──────────────────────────────┐
│  ForgotPasswordPage          │
│  - Nhập email/phone          │
│  - Validate & Submit         │
└──────────────┬───────────────┘
               │
               └──> Submit (API Call)
               │
               v
   ┌──────────────────────────────┐
   │ CreateNewPasswordPage        │
   │ - Nhập mã xác nhân           │
   │ - Nhập mật khẩu mới         │
   │ - Xác nhận mật khẩu         │
   └──────────────┬───────────────┘
                  │
                  └──> Submit (API Call)
                  │
                  v
            ┌──────────────┐
            │  Login Page  │
            │ (Successfully)
            └──────────────┘
```

---

## 🎯 Component Structure

### ForgotPasswordPage
```
Form (title="Đặt lại mật khẩu")
├── Back Button (ChevronLeft icon)
├── FormGroup
│   └── Input (email/phone)
├── FormActions
│   └── Button (Tiếp tục)
└── Support Link
```

### CreateNewPasswordPage
```
Form (title="Tạo mật khẩu mới")
├── Back Button (ChevronLeft icon)
├── FormGroup
│   └── Input (verification code)
├── FormGroup
│   └── Input (new password with show/hide)
├── FormGroup
│   └── Input (confirm password with show/hide)
├── FormActions
│   └── Button (Lưu thay đổi)
├── Password Requirements Box
└── Support Link
```

---

## 🔑 Key Features

### ForgotPasswordPage
- ✅ Email/Phone validation regex
- ✅ Back button navigation
- ✅ Loading state during submission
- ✅ Error handling
- ✅ Help text guidance
- ✅ Support link footer

### CreateNewPasswordPage
- ✅ Numeric-only input for verification code (auto-strips non-digits)
- ✅ Show/hide password toggles
- ✅ Password strength validation:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
- ✅ Confirm password matching
- ✅ Password requirements display box
- ✅ Back button navigation
- ✅ Loading state during submission
- ✅ Error handling

---

## 📱 Responsive Design

Cả 2 pages đều:
- ✅ Sử dụng responsive padding (`px-4 py-8`)
- ✅ Max-width 1440px (design frame)
- ✅ Centered layout
- ✅ Flexbox for centering
- ✅ Mobile-friendly spacing

---

## 🔐 Security Considerations

### ForgotPasswordPage
- Validate email/phone format before submission
- Rate limiting recommended on backend
- HTTPS only
- Hide/obfuscate whether email exists in system

### CreateNewPasswordPage
- Server-side verification code validation
- Password strength requirements enforced
- HTTPS only
- Set HTTP-only, secure cookies for session
- Clear any previous auth tokens

---

## 🧪 Testing Checklist

### ForgotPasswordPage
- [ ] Valid email accepted
- [ ] Valid phone number accepted
- [ ] Invalid email rejected
- [ ] Invalid phone rejected
- [ ] Back button works
- [ ] Loading state shows
- [ ] Submit button disabled while loading
- [ ] Success navigates to next page
- [ ] Error message displays

### CreateNewPasswordPage
- [ ] Verification code accepts only digits
- [ ] Max length 6 digits enforced
- [ ] Show/hide password toggles work
- [ ] Password requirements checked
- [ ] Confirm password matching works
- [ ] Weak passwords rejected
- [ ] Back button works
- [ ] Loading state shows
- [ ] Success navigates to login
- [ ] Error message displays

---

## 📚 Design System Used

Cả 2 pages đều tuân theo design system đã tạo:

- **Components**: Form, FormGroup, FormActions, Input, Button
- **Typography**: H1 (36px, bold), Body (20px, normal)
- **Colors**: #3783EC (primary), #000000 (black), #ADA2A2 (placeholder)
- **Spacing**: 47px (elements), 75px (title), 12px (label-input)
- **Icons**: lucide-react (ChevronLeft, Eye, EyeOff)

---

## 🔗 Related Pages

- LoginPage.tsx - `src/pages/LoginPage.tsx`
- RegisterPage.tsx - `src/pages/RegisterPage.tsx`

---

## 📝 Next Steps

1. ✅ Pages created
2. Add routes to routing config
3. Test both pages in browser
4. Connect to backend APIs for:
   - Send verification code
   - Validate verification code
   - Update password
5. Add success notifications (toast)
6. Add email/SMS integration for verification code

---

**Ngày tạo**: 2026-05-21  
**Design Reference**: Figma WIREFRAME_ACC (node-id 1-14, 1-15)  
**Status**: ✅ Ready for Integration
