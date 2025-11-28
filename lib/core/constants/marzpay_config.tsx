// Import with error handling in case @env fails to load
let MARZPAY_API_KEY_ENV = '';
let MARZPAY_API_SECRET_ENV = '';
let MARZPAY_AUTHORIZATION_HEADER_ENV = '';
let MARZPAY_BASE_URL_ENV = '';
let MARZPAY_DEFAULT_COUNTRY_ENV = '';
let MARZPAY_CURRENCY_ENV = '';
let MARZPAY_IS_SANDBOX_ENV = '';
let MARZPAY_MIN_AMOUNT_ENV = '';
let MARZPAY_MAX_AMOUNT_ENV = '';

try {
  const env = require('@env');
  MARZPAY_API_KEY_ENV = env.MARZPAY_API_KEY || '';
  MARZPAY_API_SECRET_ENV = env.MARZPAY_API_SECRET || '';
  MARZPAY_AUTHORIZATION_HEADER_ENV = env.MARZPAY_AUTHORIZATION_HEADER || '';
  MARZPAY_BASE_URL_ENV = env.MARZPAY_BASE_URL || '';
  MARZPAY_DEFAULT_COUNTRY_ENV = env.MARZPAY_DEFAULT_COUNTRY || '';
  MARZPAY_CURRENCY_ENV = env.MARZPAY_CURRENCY || '';
  MARZPAY_IS_SANDBOX_ENV = env.MARZPAY_IS_SANDBOX || '';
  MARZPAY_MIN_AMOUNT_ENV = env.MARZPAY_MIN_AMOUNT || '';
  MARZPAY_MAX_AMOUNT_ENV = env.MARZPAY_MAX_AMOUNT || '';
} catch (error) {
  console.warn('Failed to load MarzPay environment variables, using defaults:', error);
  // Fallback values
  MARZPAY_API_KEY_ENV = 'marz_6lPvnnrCot5QMXd9';
  MARZPAY_API_SECRET_ENV = 'j4cw73BVcfue3Inrg8H5OaQN7ljadkVk';
  MARZPAY_AUTHORIZATION_HEADER_ENV = 'bWFyel82bFB2bm5yQ290NVFNWGQ5Omo0Y3c3M0JWY2Z1ZTNJbnJnOEg1T2FRTjdsamFka1Zr';
  MARZPAY_BASE_URL_ENV = 'https://wallet.wearemarz.com/api/v1';
  MARZPAY_DEFAULT_COUNTRY_ENV = 'UG';
  MARZPAY_CURRENCY_ENV = 'UGX';
  MARZPAY_IS_SANDBOX_ENV = 'false';
  MARZPAY_MIN_AMOUNT_ENV = '500';
  MARZPAY_MAX_AMOUNT_ENV = '10000000';
}

// MarzPay Configuration
export const MARZPAY_CONFIG = {
  // Base URL for MarzPay API
  BASE_URL: MARZPAY_BASE_URL_ENV || 'https://wallet.wearemarz.com/api/v1',
  
  // API Credentials (from environment variables)
  API_KEY: MARZPAY_API_KEY_ENV || '',
  API_SECRET: MARZPAY_API_SECRET_ENV || '',
  
  // Base64 Authorization Header (pre-encoded for convenience)
  // Format: base64_encode("API_KEY:API_SECRET")
  AUTHORIZATION_HEADER: MARZPAY_AUTHORIZATION_HEADER_ENV || '',
  
  // Default country code (Uganda)
  DEFAULT_COUNTRY: MARZPAY_DEFAULT_COUNTRY_ENV || 'UG',
  
  // Default currency
  CURRENCY: MARZPAY_CURRENCY_ENV || 'UGX',
  
  // Sandbox mode flag (set to false for live transactions)
  // Environment variable is a string, so we check for string 'true' or '1'
  // Defaults to false (live mode) if not set
  IS_SANDBOX: MARZPAY_IS_SANDBOX_ENV ? (MARZPAY_IS_SANDBOX_ENV.toLowerCase() === 'true' || MARZPAY_IS_SANDBOX_ENV === '1') : false,
  
  // Amount limits (in UGX)
  MIN_AMOUNT: parseInt(MARZPAY_MIN_AMOUNT_ENV || '500', 10),
  MAX_AMOUNT: parseInt(MARZPAY_MAX_AMOUNT_ENV || '10000000', 10),
};
