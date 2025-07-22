import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    loading,
    colors: isDark ? darkColors : lightColors,
    typography: typography,
    spacing: spacing,
    borderRadius: borderRadius,
    shadows: isDark ? darkShadows : lightShadows,
    layout: layout
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Light theme colors (earth tones)
const lightColors = {
  primary: '#2D5016',
  primaryDark: '#1A3009',
  primaryLight: '#4A7C2A',
  secondary: '#8B4513',
  secondaryLight: '#CD853F',
  secondaryDark: '#654321',
  background: '#F8F6F0',
  backgroundSecondary: '#F0EDE5',
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAF8',
  card: '#FFFFFF',
  cardSecondary: '#F5F3EE',
  cardBorder: '#E8E4DC',
  text: '#2C3E14',
  textSecondary: '#5A6B3F',
  textLight: '#8A9B7A',
  textInverse: '#FFFFFF',
  accent: '#D2691E',
  accentLight: '#F4A460',
  warning: '#FF8C00',
  warningLight: '#FFA500',
  error: '#B22222',
  errorLight: '#DC143C',
  success: '#228B22',
  successLight: '#32CD32',
  info: '#4682B4',
  infoLight: '#87CEEB',
  gray: '#8B8680',
  grayLight: '#D3CFC4',
  grayDark: '#5D5A54',
  border: '#E0DDD6',
  borderDark: '#C8C3B8',
  online: '#32CD32',
  offline: '#808080',
  away: '#FFA500',
};

// Dark theme colors (earth tones)
const darkColors = {
  primary: '#4A7C2A',
  primaryDark: '#2D5016',
  primaryLight: '#6B9940',
  secondary: '#CD853F',
  secondaryLight: '#DEB887',
  secondaryDark: '#8B4513',
  background: '#1C1917',
  backgroundSecondary: '#2C2925',
  surface: '#292622',
  surfaceSecondary: '#3C3832',
  card: '#332F2A',
  cardSecondary: '#3F3B35',
  cardBorder: '#4A453E',
  text: '#F5F3EE',
  textSecondary: '#D3CFC4',
  textLight: '#A8A399',
  textInverse: '#1C1917',
  accent: '#F4A460',
  accentLight: '#DEB887',
  warning: '#FFA500',
  warningLight: '#FFB84D',
  error: '#DC143C',
  errorLight: '#FF6B6B',
  success: '#32CD32',
  successLight: '#90EE90',
  info: '#87CEEB',
  infoLight: '#B0E0E6',
  gray: '#6B6662',
  grayLight: '#8B8680',
  grayDark: '#4A453E',
  border: '#4A453E',
  borderDark: '#3C3832',
  online: '#32CD32',
  offline: '#808080',
  away: '#FFA500',
};

const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    title: 32,
    heading: 36,
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  lineHeight: {
    xs: 16,
    sm: 18,
    md: 20,
    lg: 22,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    title: 36,
    heading: 40,
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  circle: 100,
};

const lightShadows = {
  small: {
    shadowColor: '#2C3E14',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2C3E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#2C3E14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

const darkShadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
};

const layout = {
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 100,
  avatarSize: {
    small: 32,
    medium: 48,
    large: 64,
    xl: 96,
  },
};

export default ThemeProvider;
