/**
 * Design System Tokens
 * 
 * Quy tắc thiết kế chung cho Frontend Account & Laptop
 * Kích thước thiết kế (Desktop Frame): 1440px x Auto
 */

// ========================================
// 1. LAYOUT & FRAME
// ========================================
export const LAYOUT = {
  FRAME_WIDTH: 1440,
  FRAME_HEIGHT_AUTO: true,
  CONTAINER_PADDING: 0,
} as const;

// ========================================
// 2. INPUT FIELD (OÔ NHẬP LIỆU)
// ========================================
export const INPUT = {
  // Dimensions
  WIDTH: '722px', // Tailwind: w-[722px]
  HEIGHT: '82px', // Tailwind: h-[82px]
  
  // Border Radius
  CORNER_RADIUS: '29px', // Tailwind: rounded-[29px]
  
  // Background
  BACKGROUND_COLOR: 'transparent',
  BACKGROUND_OPACITY: 0, // 0%
  
  // Border (Stroke)
  BORDER_COLOR: '#000000', // Black
  BORDER_OPACITY: '34%', // Tailwind: border-black/34
  BORDER_WIDTH: '1px',
  BORDER_POSITION: 'inside',
  BORDER_TAILWIND: 'border border-black/34',
  
  // Padding
  PADDING_X: '20px', // Để chữ gõ vào không bị chạm viền cong
  PADDING_Y: '0px',
  
  // Placeholder Text
  PLACEHOLDER_TEXT: {
    FONT_SIZE: '16px', // Chữ thường
    FONT_WEIGHT: 'normal',
    COLOR: '#ADA2A2',
    OPACITY: '100%',
  },
  
  // Focus State
  FOCUS_OUTLINE: 'none',
  FOCUS_RING: '2px',
  FOCUS_RING_COLOR: '#3783EC',
  FOCUS_RING_OPACITY: '58%',
  
  // Tailwind Classes
  TAILWIND_CLASSES: 'w-[722px] h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5',
} as const;

// ========================================
// 3. BUTTON (NÚT BẤM)
// ========================================
export const BUTTON = {
  // Dimensions
  WIDTH: '704px', // Tailwind: w-[704px]
  HEIGHT: '57px', // Tailwind: h-[57px]
  
  // Border Radius
  CORNER_RADIUS: '84px', // Tailwind: rounded-[84px]
  
  // Background Color
  BACKGROUND_COLOR: '#3783EC', // Blue
  BACKGROUND_OPACITY_DEFAULT: '58%', // Chưa bấm
  BACKGROUND_OPACITY_PRESSED: '83%', // Bấm vào
  BACKGROUND_OPACITY_HOVER: '83%', // Hover
  
  // Border
  BORDER: 'none',
  
  // Text
  FONT_SIZE: '16px',
  FONT_WEIGHT: 'bold',
  TEXT_COLOR: '#FFFFFF', // White
  
  // Tailwind Classes
  TAILWIND_CLASSES_DEFAULT: 'w-[704px] h-[57px] rounded-[84px] bg-[#3783EC] opacity-58 text-white font-bold',
  TAILWIND_CLASSES_HOVER: 'hover:opacity-83',
  TAILWIND_CLASSES_ACTIVE: 'active:opacity-83',
} as const;

// ========================================
// 4. TYPOGRAPHY (HỆ THỐNG KIỂU CHỮ)
// ========================================
export const TYPOGRAPHY = {
  // H1 - Tiêu đề chính
  H1: {
    FONT_SIZE: '36px', // Tailwind: text-4xl
    FONT_WEIGHT: 'bold',
    LINE_HEIGHT: '1.2',
    FONT_FAMILY: 'Inter',
    TAILWIND_CLASS: 'text-4xl font-bold',
  },
  
  // Tên mục (Section Name)
  SECTION_NAME: {
    FONT_SIZE: '30px',
    FONT_WEIGHT: '500', // Medium
    LINE_HEIGHT: '1.3',
    FONT_FAMILY: 'Inter',
    TAILWIND_CLASS: 'text-[30px] font-medium',
  },
  
  // Chữ thường (Regular Text)
  BODY: {
    FONT_SIZE: '20px',
    FONT_WEIGHT: 'normal',
    LINE_HEIGHT: '1.5',
    FONT_FAMILY: 'Inter',
    TAILWIND_CLASS: 'text-xl font-normal',
  },
  
  // Chữ nhãn (Label)
  LABEL: {
    FONT_SIZE: '20px',
    FONT_WEIGHT: 'normal',
    LINE_HEIGHT: '1.5',
    FONT_FAMILY: 'Inter',
    TAILWIND_CLASS: 'text-xl font-normal',
  },
  
  // Chữ gợi ý (Placeholder)
  PLACEHOLDER: {
    FONT_SIZE: '16px',
    FONT_WEIGHT: 'normal',
    COLOR: '#ADA2A2',
    OPACITY: '100%',
    TAILWIND_CLASS: 'text-base font-normal text-[#ADA2A2]',
  },
  
  // Font Family
  FONT_FAMILY_PRIMARY: 'Inter',
} as const;

// ========================================
// 5. SPACING (KHOẢNG CÁCH)
// ========================================
export const SPACING = {
  // Vertical spacing between elements
  ELEMENT_SPACING: '47px', // Khoảng cách dọc giữa các ô và nội dung
  
  // Title to first content
  TITLE_TO_CONTENT: '75px', // Khoảng cách tiêu đề đến nội dung đầu
  
  // Label to Input
  LABEL_TO_INPUT: '12px', // Khoảng cách giữa Chữ nhãn (Label) và Ô nhập (Input): Cố định
  
  // Tailwind mappings
  TAILWIND: {
    ELEMENT_SPACING: 'gap-[47px]', // Or mb-[47px], mt-[47px]
    TITLE_TO_CONTENT: 'mb-[75px]',
    LABEL_TO_INPUT: 'gap-3', // Approx 12px in Tailwind default scale (1rem = 16px, so 12px ≈ 0.75rem)
  },
} as const;

// ========================================
// 6. COLORS (MÀU SẮC)
// ========================================
export const COLORS = {
  // Primary
  PRIMARY_BLUE: '#3783EC',
  PRIMARY_BLUE_58: '#3783EC',
  PRIMARY_BLUE_83: '#3783EC',
  
  // Grayscale
  BLACK: '#000000',
  BLACK_34: '#00000056', // 34% opacity
  WHITE: '#FFFFFF',
  GRAY_LIGHT: '#ADA2A2',
  
  // Semantic
  ERROR: '#EF4444',
  SUCCESS: '#22C55E',
  WARNING: '#EAB308',
  INFO: '#06B6D4',
} as const;

// ========================================
// 7. STATES (TRẠNG THÁI THÀNH PHẦN)
// ========================================
export const STATES = {
  // Button States
  BUTTON_DEFAULT: 'opacity-58',
  BUTTON_HOVER: 'opacity-83',
  BUTTON_PRESSED: 'opacity-83',
  BUTTON_DISABLED: 'opacity-50 cursor-not-allowed',
  
  // Input States
  INPUT_DEFAULT: 'border-black/34',
  INPUT_FOCUS: 'focus:outline-none focus:ring-2 focus:ring-[#3783EC] focus:ring-opacity-58',
  INPUT_ERROR: 'border-red-500 border-2',
  INPUT_DISABLED: 'opacity-50 cursor-not-allowed bg-gray-100',
} as const;

// ========================================
// 8. RESPONSIVE BREAKPOINTS
// ========================================
export const BREAKPOINTS = {
  MOBILE: '320px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1440px',
} as const;

// ========================================
// 9. FORM COMPONENT DEFAULTS
// ========================================
export const FORM = {
  // Input field default width for forms
  FULL_WIDTH_INPUT: INPUT.WIDTH,
  FULL_WIDTH_BUTTON: BUTTON.WIDTH,
  
  // Spacing between form elements
  FORM_ELEMENT_GAP: SPACING.ELEMENT_SPACING,
  FORM_ELEMENT_MARGIN_BOTTOM: 'mb-[47px]',
} as const;

// ========================================
// 10. EXPORT PRESET COMBINATIONS
// ========================================
export const PRESETS = {
  // Input with all styling
  INPUT_FULL: {
    width: INPUT.WIDTH,
    height: INPUT.HEIGHT,
    borderRadius: INPUT.CORNER_RADIUS,
    backgroundColor: INPUT.BACKGROUND_COLOR,
    border: `${INPUT.BORDER_WIDTH} solid ${INPUT.BORDER_COLOR}`,
    borderOpacity: INPUT.BORDER_OPACITY,
    padding: `${INPUT.PADDING_Y} ${INPUT.PADDING_X}`,
  },
  
  // Button with all styling
  BUTTON_FULL: {
    width: BUTTON.WIDTH,
    height: BUTTON.HEIGHT,
    borderRadius: BUTTON.CORNER_RADIUS,
    backgroundColor: BUTTON.BACKGROUND_COLOR,
    color: BUTTON.TEXT_COLOR,
    fontSize: BUTTON.FONT_SIZE,
    fontWeight: BUTTON.FONT_WEIGHT,
    border: BUTTON.BORDER,
  },
  
  // H1 Typography
  H1_FULL: {
    fontSize: TYPOGRAPHY.H1.FONT_SIZE,
    fontWeight: TYPOGRAPHY.H1.FONT_WEIGHT,
    lineHeight: TYPOGRAPHY.H1.LINE_HEIGHT,
    fontFamily: TYPOGRAPHY.H1.FONT_FAMILY,
  },
} as const;

export default {
  LAYOUT,
  INPUT,
  BUTTON,
  TYPOGRAPHY,
  SPACING,
  COLORS,
  STATES,
  BREAKPOINTS,
  FORM,
  PRESETS,
} as const;
