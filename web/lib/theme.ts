export interface SellerTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo_url?: string;
  phrases?: string[];
}

export interface SellerData {
  id: string;
  name: string;
  subdomain: string;
  custom_domain?: string;
  logo_url?: string;
  colors?: SellerTheme['colors'];
  phrases?: string[];
}

/**
 * Generate CSS custom properties for a seller's theme
 */
export function generateThemeCSS(seller: SellerData): string {
  const colors = seller.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ef4444'
  };

  const contrast = {
    primary: getContrastColor(colors.primary),
    secondary: getContrastColor(colors.secondary),
    accent: getContrastColor(colors.accent),
  };

  return `
    :root {
      --seller-primary: ${colors.primary};
      --seller-secondary: ${colors.secondary};
      --seller-accent: ${colors.accent};
      --seller-primary-rgb: ${hexToRgb(colors.primary)};
      --seller-secondary-rgb: ${hexToRgb(colors.secondary)};
      --seller-accent-rgb: ${hexToRgb(colors.accent)};
      --seller-primary-contrast: ${contrast.primary};
      --seller-secondary-contrast: ${contrast.secondary};
      --seller-accent-contrast: ${contrast.accent};
    }
  `;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ');
}

/**
 * Get Tailwind classes for seller theme colors
 */
export function getThemeClasses(seller: SellerData) {
  const colors = seller.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ef4444'
  };

  return {
    primary: {
      bg: `bg-[${colors.primary}]`,
      text: `text-[${colors.primary}]`,
      border: `border-[${colors.primary}]`,
      hover: `hover:bg-[${colors.primary}]`,
    },
    secondary: {
      bg: `bg-[${colors.secondary}]`,
      text: `text-[${colors.secondary}]`,
      border: `border-[${colors.secondary}]`,
      hover: `hover:bg-[${colors.secondary}]`,
    },
    accent: {
      bg: `bg-[${colors.accent}]`,
      text: `text-[${colors.accent}]`,
      border: `border-[${colors.accent}]`,
      hover: `hover:bg-[${colors.accent}]`,
    }
  };
}

/**
 * Determine if a color is light or dark for contrast
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex).split(', ').map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128;
}

/**
 * Get contrasting text color for a background
 */
export function getContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}

/**
 * Generate a complete theme object for a seller
 */
export function createSellerTheme(seller: SellerData): SellerTheme & {
  classes: ReturnType<typeof getThemeClasses>;
  css: string;
  contrastColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
} {
  const colors = seller.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ef4444'
  };

  return {
    colors,
    logo_url: seller.logo_url,
    phrases: seller.phrases,
    classes: getThemeClasses(seller),
    css: generateThemeCSS(seller),
    contrastColors: {
      primary: getContrastColor(colors.primary),
      secondary: getContrastColor(colors.secondary),
      accent: getContrastColor(colors.accent),
    }
  };
}

/**
 * Default theme for fallback
 */
export const DEFAULT_THEME: SellerTheme = {
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ef4444'
  }
};
