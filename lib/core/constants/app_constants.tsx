

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


export const APP_BASE_URL = 'http://192.168.100.243:3000';


export const GOOGLE_API_KEY = ''; 


const { width, height } = Dimensions.get('window');


export const SIZES = {
  width,
  height,
};
