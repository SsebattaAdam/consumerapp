// Import with error handling in case @env fails to load
let ENV_APP_BASE_URL = '';
let ENV_GOOGLE_API_KEY = '';

try {
  const env = require('@env');
  ENV_APP_BASE_URL = env.APP_BASE_URL || '';
  ENV_GOOGLE_API_KEY = env.GOOGLE_API_KEY || '';
} catch (error) {
  console.warn('Failed to load app environment variables, using defaults:', error);
  ENV_APP_BASE_URL = 'http://192.168.100.243:3000';
  ENV_GOOGLE_API_KEY = '';
}

import { Dimensions } from 'react-native';


export const COLORS = {
  primary: '#7ed7e7dc',
  primaryLight: '#53a9a5ff',
  secondary: '#7ed7e7dc',
  secondaryLight: '#ffe5db',
  tertiary: '#0078a6',
  gray: '#1C7A68',
  grayLight: '#C1C0C8',
  lightWhite: '#FAFAFC',
  white: '#FFFFFF',
  dark: '#000000',
  dark2: '#2c2b2b',
  dark22: '#4c4c4c',
  dark3: '#1a1a1a',
  red: '#e81e4d',
  offWhite: '#F3F4F8',
  Koffgreen:'#1C7A68'
};

// Onest Font Family
export const FONTS = {
  // Font weights mapping
  thin: 'Onest-Thin',
  extraLight: 'Onest-ExtraLight',
  light: 'Onest-Light',
  regular: 'Onest-Regular',
  medium: 'Onest-Medium',
  semiBold: 'Onest-SemiBold',
  bold: 'Onest-Bold',
  extraBold: 'Onest-ExtraBold',
  black: 'Onest-Black',
  
  // Helper functions for common font weights
  // Maps fontWeight numbers/strings to Onest font variants
  getFontWeight: (weight: string | number): string => {
    const weightMap: { [key: string]: string } = {
      '100': 'Onest-Thin',
      '200': 'Onest-ExtraLight',
      '300': 'Onest-Light',
      '400': 'Onest-Regular',
      'normal': 'Onest-Regular',
      '500': 'Onest-Medium',
      '600': 'Onest-SemiBold',
      '700': 'Onest-Bold',
      'bold': 'Onest-Bold',
      '800': 'Onest-ExtraBold',
      '900': 'Onest-Black',
    };
    return weightMap[String(weight)] || 'Onest-Regular';
  },
};


export const APP_BASE_URL = ENV_APP_BASE_URL || 'http://localhost:3000';

export const GOOGLE_API_KEY = ENV_GOOGLE_API_KEY || ''; 


const { width, height } = Dimensions.get('window');


export const SIZES = {
  width,
  height,
};
