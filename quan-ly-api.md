# Quản Lý API

## Thư mục API

```txt
src/services/
```

## Cấu trúc

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
└── upload.service.ts
```

## Thư viện API
- Axios

## Ví dụ cấu hình Axios

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export default api;