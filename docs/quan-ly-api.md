# Quản Lý API

## Mục tiêu

Quản lý tập trung toàn bộ API trong frontend nhằm:
- Dễ bảo trì và mở rộng.
- Tách biệt UI và business logic.
- Dễ thay đổi backend endpoint.
- Tái sử dụng API giữa nhiều màn hình.
- Quản lý JWT token tập trung.

---

# Thư mục API

```txt
src/services/
```

---

# Cấu trúc thư mục

```txt
services/
├── api.ts
├── auth.service.ts
├── product.service.ts
├── account.service.ts
├── laptop.service.ts
├── order.service.ts
├── warranty.service.ts
├── customer.service.ts
├── upload.service.ts
└── dashboard.service.ts
```

---

# Chức năng từng file

| File | Chức năng |
|---|---|
| api.ts | Cấu hình Axios chung |
| auth.service.ts | Login, register, refresh token |
| product.service.ts | API sản phẩm |
| account.service.ts | API account số |
| laptop.service.ts | API laptop |
| order.service.ts | API đơn hàng |
| warranty.service.ts | API bảo hành |
| customer.service.ts | API khách hàng |
| upload.service.ts | Upload ảnh/file |
| dashboard.service.ts | API thống kê dashboard |

---

# Công nghệ sử dụng

- Axios
- JWT Authentication
- RESTful API

---

# Cấu hình Axios

## File: `api.ts`

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

# Request Interceptor

Tự động gắn JWT token vào request.

```ts
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

# Response Interceptor

Xử lý lỗi tập trung.

```ts
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

# Ví dụ Service

## File: `product.service.ts`

```ts
import api from "./api";

export const getProducts = () => {
  return api.get("/products");
};

export const getProductById = (id: string) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (data: unknown) => {
  return api.post("/products", data);
};

export const updateProduct = (
  id: string,
  data: unknown
) => {
  return api.put(`/products/${id}`, data);
};

export const deleteProduct = (id: string) => {
  return api.delete(`/products/${id}`);
};
```

---

# Ví dụ Authentication Service

## File: `auth.service.ts`

```ts
import api from "./api";

export const login = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

export const register = (data: unknown) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  return api.get("/auth/profile");
};
```

---

# Quy tắc đặt tên API

| Hành động | Prefix |
|---|---|
| Lấy danh sách | get |
| Lấy chi tiết | getById |
| Tạo mới | create |
| Cập nhật | update |
| Xóa | delete |

Ví dụ:

```ts
getProducts()
getProductById()
createProduct()
updateProduct()
deleteProduct()
```

---

# Quy tắc sử dụng

## Không gọi Axios trực tiếp trong component

❌ Sai:

```ts
axios.get("/products")
```

✅ Đúng:

```ts
getProducts()
```

---

# Quy tắc JWT

- JWT lưu trong localStorage.
- Axios interceptor tự động gắn token.
- Khi token hết hạn:
  - logout tự động
  - chuyển về login

---

# Biến môi trường

## File `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Quy chuẩn Response Backend

## Thành công

```json
{
  "success": true,
  "message": "Success",
  "data": []
}
```

---

## Lỗi

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# Error Handling

## Frontend cần:
- Hiển thị toast khi lỗi.
- Không log lỗi production lung tung.
- Validate dữ liệu trước khi gửi API.

---

# Upload File

## File: `upload.service.ts`

```ts
import api from "./api";

export const uploadImage = (formData: FormData) => {
  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
```

---

# Flow API Frontend

```txt
UI Component
    ↓
Service
    ↓
Axios Instance
    ↓
Backend API
    ↓
Database
```

---

# Mục tiêu kiến trúc

- Dễ scale project lớn.
- Dễ quản lý API.
- Giảm trùng lặp code.
- Dễ bảo trì.
- Dễ tích hợp backend.
- Dễ onboarding member mới.