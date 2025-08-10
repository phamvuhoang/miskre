'use client';
import { createContext, useContext, ReactNode } from 'react';
import { SellerData, createSellerTheme, DEFAULT_THEME } from '@/lib/theme';

interface ThemeContextType {
  seller: SellerData | null;
  theme: ReturnType<typeof createSellerTheme>;
}

const ThemeContext = createContext<ThemeContextType>({
  seller: null,
  theme: {
    ...DEFAULT_THEME,
    classes: {
      primary: { bg: 'bg-black', text: 'text-black', border: 'border-black', hover: 'hover:bg-black' },
      secondary: { bg: 'bg-white', text: 'text-white', border: 'border-white', hover: 'hover:bg-white' },
      accent: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hover: 'hover:bg-red-500' }
    },
    css: '',
    contrastColors: { primary: '#ffffff', secondary: '#000000', accent: '#ffffff' }
  }
});

interface ThemeProviderProps {
  seller: SellerData | null;
  children: ReactNode;
}

export function ThemeProvider({ seller, children }: ThemeProviderProps) {
  const theme = seller ? createSellerTheme(seller) : {
    ...DEFAULT_THEME,
    classes: {
      primary: { bg: 'bg-black', text: 'text-black', border: 'border-black', hover: 'hover:bg-black' },
      secondary: { bg: 'bg-white', text: 'text-white', border: 'border-white', hover: 'hover:bg-white' },
      accent: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hover: 'hover:bg-red-500' }
    },
    css: '',
    contrastColors: { primary: '#ffffff', secondary: '#000000', accent: '#ffffff' }
  };

  return (
    <ThemeContext.Provider value={{ seller, theme }}>
      {seller && (
        <style dangerouslySetInnerHTML={{ __html: theme.css }} />
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useSellerTheme() {
  const { theme } = useTheme();
  return theme;
}
