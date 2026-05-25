# Hệ Thống Thiết Kế (Design System)

## Tổng Quan

Tài liệu này định nghĩa các quy tắc thiết kế chung cho dự án Frontend Account & Laptop. Tất cả các component và trang cần tuân theo các tiêu chuẩn được định nghĩa tại đây.

---

## 1. Kích Thước Thiết Kế (Desktop Frame)

- **Chiều ngang (Width)**: 1440px
- **Chiều cao (Height)**: Tự do theo nội dung
- **Padding/Margin**: Không có (Mặc định)

```tsx
const LAYOUT = {
  FRAME_WIDTH: 1440,
  FRAME_HEIGHT_AUTO: true,
}
```

---

## 2. Ô Nhập Liệu (Input Field)

### Thông Số Kỹ Thuật

| Thuộc tính | Giá trị | Tailwind Class |
|-----------|--------|---|
| Chiều ngang (Width) | 722px | `w-[722px]` |
| Chiều cao (Height) | 82px | `h-[82px]` |
| Độ bo góc (Radius) | 29px | `rounded-[29px]` |
| Nền (Fill) | Transparent | `bg-transparent` |
| Viền | Black, 34% opacity, 1px | `border border-black/34` |
| Padding X | 20px | `px-5` |
| Placeholder | #ADA2A2, 100% opacity | `placeholder-[#ADA2A2]` |

### Cách Sử Dụng

```tsx
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  return (
    <Input
      label="Email"
      placeholder="Nhập email của bạn"
      type="email"
    />
  );
}
```

### Trạng Thái

- **Default**: `border-black/34`
- **Focus**: `focus:ring-2 focus:ring-[#3783EC] focus:ring-opacity-58`
- **Error**: `border-red-500 border-2`

---

## 3. Nút Bấm (Button)

### Thông Số Kỹ Thuật

| Thuộc tính | Giá trị | Tailwind Class |
|-----------|--------|---|
| Chiều ngang (Width) | 704px | `w-[704px]` |
| Chiều cao (Height) | 57px | `h-[57px]` |
| Độ bo góc (Radius) | 84px | `rounded-[84px]` |
| Màu nền | #3783EC (Blue) | `bg-[#3783EC]` |
| Opacity (Mặc định) | 58% | `opacity-58` |
| Opacity (Hover) | 83% | `hover:opacity-83` |
| Opacity (Bấm) | 83% | `active:opacity-83` |
| Viền | Không có | N/A |

### Cách Sử Dụng

```tsx
import { Button } from '@/components/ui/button';

export function LoginButton() {
  return (
    <Button 
      size="md"
      onClick={handleLogin}
    >
      Đăng Nhập
    </Button>
  );
}
```

### Variants

- **primary** (Mặc định): Blue button với opacity states
- **secondary**: Gray button
- **outline**: Bordered button

---

## 4. Hệ Thống Kiểu Chữ (Typography)

### H1 - Tiêu Đề Chính

- **Font Size**: 36px
- **Font Weight**: Bold
- **Font Family**: Inter
- **Tailwind**: `text-4xl font-bold`

```tsx
<h1 className="text-4xl font-bold text-black">Tiêu Đề Chính</h1>
```

### Tên Mục (Section Name)

- **Font Size**: 30px
- **Font Weight**: Medium
- **Font Family**: Inter
- **Tailwind**: `text-[30px] font-medium`

```tsx
<h2 className="text-[30px] font-medium text-black">Tên Mục</h2>
```

### Chữ Thường (Body Text)

- **Font Size**: 20px
- **Font Weight**: Normal
- **Font Family**: Inter
- **Tailwind**: `text-xl font-normal`

```tsx
<p className="text-xl font-normal text-black">Nội dung chính</p>
```

### Chữ Nhãn (Label)

- **Font Size**: 20px
- **Font Weight**: Normal
- **Font Family**: Inter
- **Tailwind**: `text-xl font-normal`

```tsx
<label className="text-xl font-normal text-black">Nhãn trường</label>
```

### Chữ Gợi Ý (Placeholder)

- **Font Size**: 16px
- **Font Weight**: Normal
- **Color**: #ADA2A2
- **Opacity**: 100%

```tsx
<input placeholder="Chữ gợi ý" className="placeholder-[#ADA2A2]" />
```

---

## 5. Khoảng Cách (Spacing)

### Các Giá Trị Tiêu Chuẩn

| Loại | Giá Trị | Tailwind | Mô Tả |
|------|--------|---------|------|
| Khoảng cách giữa phần tử | 47px | `gap-[47px]` hoặc `mb-[47px]` | Khoảng cách dọc giữa các ô nhập và nội dung |
| Khoảng cách tiêu đề | 75px | `mb-[75px]` | Từ tiêu đề (H1) đến nội dung đầu tiên |
| Khoảng cách Label-Input | 12px | `gap-3` | Cố định giữa Label và Input |

### Cách Sử Dụng

```tsx
// Khoảng cách giữa các form element
<div className="flex flex-col gap-[47px]">
  {/* Form fields */}
</div>

// Khoảng cách từ tiêu đề đến nội dung
<div className="mb-[75px]">
  <h1 className="text-4xl font-bold">Tiêu Đề</h1>
</div>

// Khoảng cách giữa label và input
<div className="flex flex-col gap-3">
  <label>Email</label>
  <input />
</div>
```

---

## 6. Màu Sắc (Colors)

### Màu Chính (Primary)

- **Primary Blue**: `#3783EC`
  - Mặc định: 58% opacity
  - Hover/Active: 83% opacity

### Màu Tập Hợp (Grayscale)

- **Black**: `#000000`
- **Black (34% opacity)**: `#000000` với `opacity-34`
- **White**: `#FFFFFF`
- **Gray Light**: `#ADA2A2` (cho placeholder)

### Màu Ngữ Nghĩa (Semantic)

- **Error**: `#EF4444`
- **Success**: `#22C55E`
- **Warning**: `#EAB308`
- **Info**: `#06B6D4`

---

## 7. Form Component (Wrapper)

Component `Form` tự động áp dụng tất cả các spacing rules theo design system.

### Cách Sử Dụng

```tsx
import { Form, FormGroup, FormActions } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  return (
    <Form
      title="Đăng Nhập"
      description="Vui lòng nhập thông tin tài khoản của bạn"
      onSubmit={handleSubmit}
    >
      <FormGroup>
        <Input
          label="Email"
          placeholder="Nhập email"
          type="email"
        />
      </FormGroup>

      <FormGroup>
        <Input
          label="Mật Khẩu"
          placeholder="Nhập mật khẩu"
          type="password"
        />
      </FormGroup>

      <FormActions justify="center">
        <Button size="md">Đăng Nhập</Button>
      </FormActions>
    </Form>
  );
}
```

---

## 8. Design Tokens Import

Tất cả các giá trị thiết kế được định nghĩa tại: `src/constants/designTokens.ts`

### Cách Sử Dụng

```tsx
import {
  INPUT,
  BUTTON,
  TYPOGRAPHY,
  SPACING,
  COLORS,
} from '@/constants/designTokens';

// Sử dụng trong component
const customStyle = {
  width: INPUT.WIDTH,
  height: INPUT.HEIGHT,
  borderRadius: INPUT.CORNER_RADIUS,
};

// Hoặc sử dụng preset
const buttonStyle = PRESETS.BUTTON_FULL;
```

---

## 9. Responsive Design

Dự án hiện tại được thiết kế cho **Desktop** (1440px). Nếu cần responsive, sử dụng breakpoints:

```tsx
export const BREAKPOINTS = {
  MOBILE: '320px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1440px',
}
```

---

## 10. Ví Dụ Toàn Diện

### Login Page Example

```tsx
import React, { useState } from 'react';
import { Form, FormGroup, FormActions } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate and submit
    try {
      // API call here
      console.log('Login with:', email, password);
    } catch (err) {
      setError('Đăng nhập thất bại');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Form
        title="Đăng Nhập"
        description="Quản Lý Tài Khoản Số & Laptop"
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <Input
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Input
            label="Mật Khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        {error && (
          <div className="text-red-500 text-base">
            {error}
          </div>
        )}

        <FormActions justify="center">
          <Button 
            size="md"
            type="submit"
          >
            Đăng Nhập
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}
```

---

## 11. Lưu Ý Khi Phát Triển

1. **Luôn sử dụng Design Tokens**: Không hardcode giá trị thiết kế
2. **Tuân theo Typography**: Sử dụng các class typography được định nghĩa
3. **Spacing Consistency**: Sử dụng `gap-[47px]`, `mb-[75px]`, `gap-3` như quy định
4. **Button Variants**: Chỉ sử dụng các variant được định nghĩa (primary, secondary, outline)
5. **Input Validation**: Sử dụng `error` prop để hiển thị lỗi
6. **Color Constants**: Tham khảo `COLORS` object thay vì hardcode

---

## 12. Troubleshooting

### Input không hiển thị đúng chiều rộng?
Đảm bảo lớp cha có `display: flex` hoặc không giới hạn chiều rộng.

### Button opacity không thay đổi khi hover?
Kiểm tra rằng `size="md"` được sử dụng (vì opacity states chỉ áp dụng cho size này).

### Spacing giữa các phần tử không đúng?
Sử dụng `gap-[47px]` cho container flex chứa các phần tử.

---

## 13. Thay Đổi Design

Nếu cần cập nhật bất kỳ giá trị thiết kế nào:
1. Cập nhật `src/constants/designTokens.ts`
2. Cập nhật component liên quan (`Input.tsx`, `button.tsx`)
3. Cập nhật tài liệu này
4. Thử nghiệm trên tất cả các page liên quan

---

**Phiên bản**: 1.0  
**Cập nhật lần cuối**: 2026-05-20  
**Tác giả**: Design System Team
