/**
 * Design Tokens for Ledgerline
 * Extracted from the design system for consistent theming
 */

export const colors = {
  // Core backgrounds
  background: {
    primary: '#08080C',
    card: 'linear-gradient(165deg, rgba(30, 31, 44, 0.96), rgba(14, 14, 20, 0.97))',
    cardSolid: '#1E1F2C',
    input: 'rgba(0, 0, 0, 0.35)',
    glass: 'rgba(255, 255, 255, 0.04)',
    glassHover: 'rgba(255, 255, 255, 0.06)',
    glassActive: 'rgba(255, 255, 255, 0.045)',
  },

  // Text colors
  text: {
    primary: '#EEF0FA',
    secondary: 'rgba(238, 240, 250, 0.6)',
    tertiary: 'rgba(238, 240, 250, 0.55)',
    muted: 'rgba(238, 240, 250, 0.4)',
    placeholder: 'rgba(238, 240, 250, 0.34)',
    label: 'rgba(238, 240, 250, 0.62)',
    link: '#9AA4FF',
    linkHover: '#BFC5FF',
  },

  // Primary brand - Indigo
  primary: {
    main: '#6E7BFF',
    light: '#8B95FF',
    dark: '#5A66F0',
    darker: '#4E5AE8',
    gradient: 'linear-gradient(#7C88FF, #5A66F0)',
    gradientHover: 'linear-gradient(#8B95FF, #6470F5)',
    gradientActive: 'linear-gradient(#5A66F0, #4E5AE8)',
    // 3D cube faces
    cubeFront: 'linear-gradient(150deg, #8B95FF, #5A66F0)',
    cubeSide: 'linear-gradient(150deg, #4C57DC, #2B32A0)',
    cubeTop: 'linear-gradient(150deg, #B4BBFF, #8B95FF)',
  },

  // Secondary brand - Aqua/Cyan
  secondary: {
    main: '#35C8DE',
    light: '#5FD6E8',
    dark: '#1E9FB4',
    gradient: 'linear-gradient(150deg, #5FD6E8, #1E9FB4)',
    // 3D cube faces
    cubeFront: 'linear-gradient(150deg, #5FD6E8, #1E9FB4)',
    cubeSide: 'linear-gradient(150deg, #1A8497, #0F5C6B)',
    cubeTop: 'linear-gradient(150deg, #9BE7F4, #5FD6E8)',
  },

  // Error state
  error: {
    main: '#FF6B8A',
    light: '#FF9DB2',
    background: 'rgba(255, 107, 138, 0.1)',
    border: 'rgba(255, 107, 138, 0.28)',
  },

  // Border colors
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.11)',
    strong: 'rgba(255, 255, 255, 0.12)',
    focus: '#6E7BFF',
    hover: 'rgba(255, 255, 255, 0.2)',
  },

  // Dividers
  divider: {
    left: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14))',
    right: 'linear-gradient(90deg, rgba(255, 255, 255, 0.14), transparent)',
  },

  // Glow effects
  glow: {
    primary: 'rgba(94, 106, 240, 0.3)',
    primaryStrong: 'rgba(94, 106, 240, 0.45)',
    secondary: 'rgba(53, 200, 222, 0.22)',
    focus: 'rgba(110, 123, 255, 0.22)',
  },
} as const;

export const shadows = {
  // Card shadows
  card: '0 40px 80px rgba(0, 0, 0, 0.62), 0 18px 60px rgba(94, 106, 240, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
  cardMobile: '0 20px 44px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.13)',

  // Button shadows
  buttonPrimary: '0 12px 28px rgba(94, 106, 240, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.38)',
  buttonPrimaryActive: '0 4px 12px rgba(94, 106, 240, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  buttonSecondary: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 18px rgba(0, 0, 0, 0.35)',

  // Input shadows
  input: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)',
  inputFocus: 'inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(110, 123, 255, 0.22)',

  // Checkbox shadows
  checkbox: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
  checkboxChecked: '0 3px 10px rgba(94, 106, 240, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.45)',

  // Feature card shadows
  featureCard: 'inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 8px 22px rgba(0, 0, 0, 0.3)',

  // Badge shadows
  badge: 'inset 0 1px 0 rgba(255, 255, 255, 0.09)',

  // Icon shadows
  iconPrimary: '0 4px 12px rgba(94, 106, 240, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  iconSecondary: '0 4px 12px rgba(30, 159, 180, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',

  // Status indicator glow
  statusGlow: '0 0 10px #35C8DE',
} as const;

export const typography = {
  fonts: {
    primary: "'Manrope', system-ui, sans-serif",
    mono: "'DM Mono', ui-monospace, monospace",
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  sizes: {
    // Headings
    h1: '66px',
    h2: '28px',
    h3: '19px',

    // Body
    body: '18px',
    bodySmall: '14.5px',

    // UI elements
    button: '16px',
    buttonSmall: '15px',
    input: '15px',
    label: '12.5px',
    link: '13.5px',
    caption: '11.5px',
    mono: '10.5px',
  },

  lineHeights: {
    tight: 1.03,
    snug: 1.1,
    normal: 1.55,
    relaxed: 1.6,
  },

  letterSpacing: {
    tight: '-0.035em',
    snug: '-0.025em',
    normal: '-0.01em',
    wide: '0.12em',
    wider: '0.16em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '4px',
  2: '7px',
  3: '10px',
  4: '12px',
  5: '14px',
  6: '16px',
  7: '18px',
  8: '20px',
  9: '22px',
  10: '26px',
  12: '34px',
  14: '36px',
  16: '44px',
  20: '56px',
  24: '72px',
  28: '80px',
} as const;

export const radii = {
  sm: '6px',
  md: '11px',
  default: '13px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '999px',
} as const;

export const transitions = {
  fast: '0.18s cubic-bezier(0.2, 1.5, 0.4, 1)',
  default: '0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
  slow: '0.35s ease',
} as const;

export const animations = {
  spin: 'spin 0.8s linear infinite',
  fadeIn: 'fadeIn 0.3s ease both',
  pop: 'pop 0.18s cubic-bezier(0.2, 1.5, 0.4, 1) both',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
} as const;

// Export combined theme object
export const theme = {
  colors,
  shadows,
  typography,
  spacing,
  radii,
  transitions,
  animations,
  breakpoints,
} as const;

export type Theme = typeof theme;
