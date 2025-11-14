export const theme = {
  colors: {
    background: '#F5F1E8',
    primary: '#8B6B47',
    primaryDark: '#6B4E31',
    secondary: '#D4A574',
    text: {
      primary: '#2C2416',
      secondary: '#5C4A3A',
      light: '#8B7865',
    },
    white: '#FFFFFF',
    error: '#D32F2F',
    success: '#2E7D32',
    border: '#D4C4B0',
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '28px',
    xxl: '48px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
} as const;
