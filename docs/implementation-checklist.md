# Design System - Implementation Checklist

Danh sách kiểm tra để đảm bảo tuân thủ Design System khi phát triển tính năng mới.

## ✅ Pre-Development Checklist

### Before Starting a New Page/Component

- [ ] Read `docs/design-system.md` for relevant sections
- [ ] Review `docs/design-system-quick-reference.md` for syntax
- [ ] Check existing example pages (LoginPage, RegisterPage)
- [ ] Understand the design tokens in `src/constants/designTokens.ts`
- [ ] Set up component structure with proper folders

### Project Setup

- [ ] TailwindCSS is configured (`tailwindcss.config.ts`)
- [ ] Font family "Inter" is imported and available
- [ ] `cn` utility from `@/utils/cn` works correctly
- [ ] Import paths with `@/` alias are working

---

## 📝 Form Component Checklist

When creating a form page (Login, Register, etc.):

### Layout Structure
- [ ] Use `<Form>` wrapper component
- [ ] Set `title` prop for main heading (H1)
- [ ] Add `description` prop if needed
- [ ] Wrap form fields in `<FormGroup>` components
- [ ] Use `<FormActions>` for button section

### Input Fields
- [ ] Each input has a `label` prop
- [ ] Placeholder text is provided
- [ ] Input type is correct (email, password, tel, etc.)
- [ ] Error prop shows validation errors
- [ ] HelperText provided where needed (password hints, etc.)
- [ ] Required fields are marked with `required` attribute

### Validation
- [ ] All inputs are validated before submit
- [ ] Error messages are shown below inputs
- [ ] Form-level error message displayed if needed
- [ ] Success feedback is provided after submit

### Button
- [ ] Button size is `md` (standard form size)
- [ ] Button variant is `primary` (default blue)
- [ ] Loading state is handled with `isLoading` prop
- [ ] Button is disabled while loading
- [ ] Submit button has `type="submit"`
- [ ] Cancel/Back button provided if needed

### Spacing & Layout
- [ ] 47px gap between form elements (`gap-[47px]`)
- [ ] 75px margin from title to first element (`mb-[75px]`)
- [ ] 12px gap between label and input (auto with FormGroup)
- [ ] Form is centered on page
- [ ] Max-width respects 1440px design frame

### Typography
- [ ] Title is H1 (36px, bold, Inter)
- [ ] Description is body text (20px, normal)
- [ ] Labels are 20px, normal weight
- [ ] Error messages are red and appropriately sized
- [ ] All text uses Inter font family

---

## 🔘 Button Usage Checklist

When adding buttons to components:

### Styling
- [ ] Button uses `size="md"` for standard form buttons
- [ ] Button has `variant="primary"` for main actions
- [ ] Button is 704px × 57px with 84px border radius
- [ ] Button background is #3783EC
- [ ] Opacity changes work correctly (58% → 83%)

### Functionality
- [ ] Button has appropriate `onClick` or form integration
- [ ] Loading state shows spinner/text during async operations
- [ ] Disabled state prevents multiple submissions
- [ ] Button text is clear and actionable

### Placement
- [ ] Primary action button centered or right-aligned
- [ ] Secondary actions grouped together if multiple
- [ ] Button spacing uses `gap-4` or `gap-6` for groups
- [ ] Buttons fit within 1440px frame

---

## 📥 Input Field Checklist

When adding input fields:

### Dimensions & Styling
- [ ] Input width is 722px (`w-[722px]`)
- [ ] Input height is 82px (`h-[82px]`)
- [ ] Border radius is 29px (`rounded-[29px]`)
- [ ] Border is black, 34% opacity, 1px (`border border-black/34`)
- [ ] Background is transparent (`bg-transparent`)
- [ ] Padding X is 20px (`px-5`)

### Text & Placeholders
- [ ] Placeholder text is provided and descriptive
- [ ] Placeholder color is #ADA2A2 (`placeholder-[#ADA2A2]`)
- [ ] Input text is black, normal weight
- [ ] Font size is 16px (base Tailwind)

### States
- [ ] Focus state shows blue ring (#3783EC, 58% opacity)
- [ ] Error state shows red border (2px)
- [ ] Disabled state shows reduced opacity
- [ ] Hover/focus transitions are smooth

### Validation
- [ ] Required fields are marked
- [ ] Error messages appear below input
- [ ] Helper text explains requirements if needed
- [ ] Validation runs on blur or submit

---

## 🎨 Typography Checklist

When adding text content:

### Headings
- [ ] Main titles use H1 class (text-4xl font-bold)
- [ ] Section headings use text-[30px] font-medium
- [ ] All headings use Inter font family
- [ ] Heading color is black (#000000)

### Body Text
- [ ] Regular text is 20px (text-xl font-normal)
- [ ] Line height is appropriate for readability
- [ ] Text color has sufficient contrast
- [ ] Font family is Inter

### Special Text
- [ ] Placeholder text is #ADA2A2
- [ ] Error messages are red (#EF4444)
- [ ] Helper text is gray and smaller
- [ ] Links are blue (#3783EC) with hover effect

---

## 📐 Spacing Checklist

When arranging components:

### Vertical Spacing
- [ ] Gap between form elements is 47px (`gap-[47px]`)
- [ ] Margin from title to content is 75px (`mb-[75px]`)
- [ ] Gap between label and input is 12px (`gap-3`)
- [ ] Use consistent spacing throughout form

### Horizontal Spacing
- [ ] Padding inside inputs is 20px X (`px-5`)
- [ ] Container has max-width of 1440px
- [ ] Padding on page level is minimal
- [ ] Elements are center-aligned within frame

---

## 🎯 Design Tokens Usage

When implementing new components:

- [ ] Import tokens from `@/constants/designTokens.ts`
- [ ] Use token values instead of hardcoding colors/sizes
- [ ] Reference `TYPOGRAPHY`, `SPACING`, `COLORS` constants
- [ ] Use Tailwind class strings from tokens when available
- [ ] Update tokens if new design values are needed

---

## 🔄 Cross-Browser & Responsive

When finalizing components:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Ensure input focus states work properly
- [ ] Verify button opacity transitions are smooth
- [ ] Check placeholder text is visible
- [ ] Confirm form doesn't overflow 1440px width
- [ ] Test on 1440px desktop resolution

---

## 📋 Code Quality Checklist

Before committing changes:

- [ ] No inline styles (use Tailwind classes)
- [ ] No hardcoded design values
- [ ] Proper TypeScript types for all components
- [ ] Props documented in JSDoc comments
- [ ] Component uses React.forwardRef if needed
- [ ] Accessibility considered (labels, ARIA if needed)
- [ ] No console errors or warnings

### Code Examples

✅ Good:
```tsx
<Input 
  label="Email"
  type="email"
  placeholder="Nhập email"
  error={errors.email}
/>
```

❌ Bad:
```tsx
<input 
  style={{ width: '722px', height: '82px' }}
  placeholder="Email"
/>
```

---

## 🧪 Testing Checklist

For form pages specifically:

### Functionality
- [ ] Form submits correctly with valid data
- [ ] Validation errors show for invalid data
- [ ] Input values update on change
- [ ] Button loading state works
- [ ] Form clears after successful submission
- [ ] Navigation works correctly

### UI/UX
- [ ] All elements align to design specs
- [ ] Spacing matches 47px/75px/12px standards
- [ ] Colors match design tokens
- [ ] Typography is consistent
- [ ] Responsive behavior works (if applicable)

### Edge Cases
- [ ] Very long input values handled
- [ ] Multi-line labels wrap correctly
- [ ] Multiple errors display properly
- [ ] Button states transition smoothly
- [ ] Form works with keyboard navigation

---

## 📚 Documentation

When creating new pages/components:

- [ ] Add JSDoc comments to components
- [ ] Document all props and their types
- [ ] Include usage example in code comments
- [ ] Update this checklist if new patterns emerge
- [ ] Document any exceptions to design system

---

## 🚀 Final Approval Checklist

Before code review:

- [ ] All items above are checked
- [ ] No console errors or warnings
- [ ] Code passes ESLint
- [ ] TypeScript types are correct
- [ ] Functionality tested thoroughly
- [ ] Design specs verified visually
- [ ] Ready for peer review

---

## 📞 Quick Help

**Not sure about spacing?** → Check `SPACING` in designTokens.ts  
**Typography question?** → See `TYPOGRAPHY` in designTokens.ts  
**Color values?** → Reference `COLORS` object  
**Component usage?** → Review LoginPage or RegisterPage examples  
**Need more help?** → Read full `docs/design-system.md`

---

**Last Updated**: 2026-05-20  
**Status**: ✅ Active  
**Maintainer**: Design System Team
