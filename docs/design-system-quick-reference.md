# Design System - Quick Reference Guide

Hướng dẫn nhanh sử dụng Design System cho Frontend Account & Laptop

## 🎯 Import Statements

```tsx
// Components
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Form, FormGroup, FormActions } from '@/components/ui/Form';

// Utilities
import { cn } from '@/utils/cn';

// Design Tokens
import { INPUT, BUTTON, TYPOGRAPHY, SPACING, COLORS } from '@/constants/designTokens';
```

---

## 📝 Input Field

### Basic Usage
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Nhập email"
/>
```

### With Validation
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Nhập email"
  error="Email không hợp lệ"
  helperText="Ví dụ: user@example.com"
/>
```

### Key Props
- `label` - Label text
- `placeholder` - Placeholder text (color: #ADA2A2)
- `error` - Error message (shows red border)
- `helperText` - Helper text below input
- `type` - Input type (text, email, password, etc.)

### Styling Details
- Width: 722px | Height: 82px
- Border Radius: 29px
- Border: 1px black, 34% opacity
- Padding X: 20px
- Focus: Blue ring (#3783EC, 58% opacity)

---

## 🔘 Button

### Basic Usage
```tsx
<Button>Click me</Button>
```

### With Variant
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
```

### With Size
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> {/* Default design size */}
<Button size="lg">Large</Button>
```

### With States
```tsx
<Button isLoading={true}>Loading...</Button>
<Button disabled>Disabled</Button>
<Button onClick={handleClick}>Click</Button>
```

### Key Props
- `variant` - 'primary' | 'secondary' | 'outline'
- `size` - 'sm' | 'md' | 'lg'
- `isLoading` - Show loading state
- `disabled` - Disable button

### Styling Details (Primary)
- Width: 704px | Height: 57px
- Border Radius: 84px
- Color: #3783EC
- Opacity: 58% (default) → 83% (hover/active)

---

## 📋 Form Component

### Complete Form Example
```tsx
<Form
  title="Đăng Nhập"
  description="Quản Lý Tài Khoản"
  onSubmit={handleSubmit}
>
  <FormGroup>
    <Input label="Email" type="email" />
  </FormGroup>

  <FormGroup>
    <Input label="Password" type="password" />
  </FormGroup>

  <FormActions justify="center">
    <Button size="md" type="submit">
      Đăng Nhập
    </Button>
  </FormActions>
</Form>
```

### Form Features
- Auto 75px margin below title
- Auto 47px gap between form groups
- Centered max-width (1440px)
- 12px gap between label and input

### FormActions Alignment
```tsx
<FormActions justify="start">...</FormActions>    {/* Align left */}
<FormActions justify="center">...</FormActions>   {/* Align center */}
<FormActions justify="end">...</FormActions>      {/* Align right */}
<FormActions justify="between">...</FormActions>  {/* Space between */}
```

---

## 🎨 Typography

### H1 - Main Title
```tsx
<h1 className="text-4xl font-bold">Main Title</h1>
```

### Section Name
```tsx
<h2 className="text-[30px] font-medium">Section Name</h2>
```

### Body Text
```tsx
<p className="text-xl font-normal">Body text</p>
```

### Label
```tsx
<label className="text-xl font-normal">Label</label>
```

### Placeholder
```tsx
<input placeholder="Gợi ý" className="placeholder-[#ADA2A2]" />
```

---

## 📏 Spacing

### Between Form Elements
```tsx
<div className="flex flex-col gap-[47px]">
  {/* Form fields */}
</div>
```

### Title to Content
```tsx
<div className="mb-[75px]">
  <h1>Title</h1>
</div>
```

### Label to Input
```tsx
<div className="flex flex-col gap-3">
  <label>Label</label>
  <input />
</div>
```

### Quick Reference
| Use | Class | Value |
|-----|-------|-------|
| Between elements | `gap-[47px]` | 47px |
| Title spacing | `mb-[75px]` | 75px |
| Label-input | `gap-3` | ~12px |

---

## 🎯 Colors

### Primary (Blue)
```tsx
className="text-[#3783EC]"          {/* Default text */}
className="bg-[#3783EC] opacity-58" {/* Button default */}
className="bg-[#3783EC] opacity-83" {/* Button hover */}
```

### Grayscale
```tsx
className="text-black"              {/* Black text */}
className="border-black/34"         {/* 34% black border */}
className="text-white"              {/* White */}
className="text-[#ADA2A2]"          {/* Gray - placeholder */}
```

### Semantic Colors
```tsx
className="text-red-500"            {/* Error */}
className="text-green-500"          {/* Success */}
className="text-yellow-500"         {/* Warning */}
className="text-cyan-500"           {/* Info */}
```

---

## ✅ Form Validation Example

```tsx
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = {};

  if (!email) newErrors.email = 'Required';
  if (password.length < 8) newErrors.password = 'Min 8 chars';

  setErrors(newErrors);
  if (Object.keys(newErrors).length === 0) {
    // Submit form
  }
};

return (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
    </FormGroup>
    
    <FormGroup>
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
    </FormGroup>

    <FormActions justify="center">
      <Button size="md" type="submit">Submit</Button>
    </FormActions>
  </Form>
);
```

---

## 🔗 Important Links

- **Design Tokens**: `src/constants/designTokens.ts`
- **Full Documentation**: `docs/design-system.md`
- **Example Pages**: 
  - `src/pages/LoginPage.tsx`
  - `src/pages/RegisterPage.tsx`

---

## ⚠️ Common Mistakes to Avoid

❌ Don't hardcode design values:
```tsx
// Bad
<div style={{ width: '722px', height: '82px' }}>
```

✅ Use components instead:
```tsx
// Good
<Input label="Email" />
```

❌ Don't mix spacing systems:
```tsx
// Bad
<div className="gap-4 mb-6">
```

✅ Use standard spacing:
```tsx
// Good
<div className="gap-[47px]">
```

❌ Don't change button sizes:
```tsx
// Bad
<Button style={{ width: '500px', height: '80px' }}>
```

✅ Use predefined sizes:
```tsx
// Good
<Button size="md">
```

---

## 📱 Responsive Notes

Current design is optimized for **Desktop (1440px)**. For responsive design:

```tsx
// Mobile
<div className="w-full px-4 md:px-0">
  <Input className="w-full md:w-[722px]" />
</div>
```

Breakpoints in `designTokens.ts`:
- MOBILE: 320px
- TABLET: 768px
- DESKTOP: 1024px
- LARGE_DESKTOP: 1440px

---

## 🆘 Troubleshooting

**Input too narrow?**
- Check parent has `display: flex` or `inline-block`
- Remove constraining `max-w-` classes

**Button opacity not changing?**
- Use `size="md"` (only md has opacity states)
- Check `variant="primary"` is set

**Spacing looks wrong?**
- Use `gap-[47px]` not `gap-10` or `gap-12`
- Use `mb-[75px]` for title spacing
- Use `gap-3` for label-input spacing

**Text styles not applying?**
- Use `className` prop, not inline styles
- Import and use Tailwind classes from typography guide
- Check font loading in `fonts/` or `@font-face`

---

**Version**: 1.0  
**Updated**: 2026-05-20  
**Status**: ✅ Ready for Use
