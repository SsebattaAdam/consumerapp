/**
 * MarzPay Test Utility
 * 
 * This file contains test functions to verify MarzPay API connectivity
 * and perform test transactions in sandbox mode.
 * 
 * Usage: Import and call these functions from your app or test environment
 */

import marzpayService from './marzpay_service';
import { MARZPAY_CONFIG } from '../../../core/constants/marzpay_config';

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Test API connection by checking account balance
 */
export const testConnection = async (): Promise<TestResult> => {
  try {
    console.log('🔍 Testing MarzPay API Connection...');
    console.log('Base URL:', MARZPAY_CONFIG.BASE_URL);
    console.log('Sandbox Mode:', MARZPAY_CONFIG.IS_SANDBOX);
    
    const response = await marzpayService.getBalance();
    
    if (response.status === 'success') {
      console.log('✅ Connection successful!');
      console.log('Account Balance:', response.data);
      return {
        success: true,
        message: 'API connection successful',
        data: response.data,
      };
    } else {
      console.log('❌ Connection failed:', response.message);
      return {
        success: false,
        message: response.message || 'Connection failed',
        error: response,
      };
    }
  } catch (error: any) {
    console.error('❌ Connection error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
      error,
    };
  }
};

/**
 * Test available services
 */
export const testAvailableServices = async (): Promise<TestResult> => {
  try {
    console.log('🔍 Testing Available Services...');
    
    const response = await marzpayService.getAvailableServices();
    
    if (response.status === 'success') {
      console.log('✅ Services retrieved successfully!');
      console.log('Available Services:', response.data);
      return {
        success: true,
        message: 'Services retrieved successfully',
        data: response.data,
      };
    } else {
      console.log('❌ Failed to retrieve services:', response.message);
      return {
        success: false,
        message: response.message || 'Failed to retrieve services',
        error: response,
      };
    }
  } catch (error: any) {
    console.error('❌ Services error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
      error,
    };
  }
};

/**
 * Test a complete payment collection transaction
 * 
 * @param phoneNumber - Test phone number (e.g., +256700000000)
 * @param amount - Amount in UGX (must be between 500 and 10,000,000)
 * @param description - Optional description for the transaction
 */
export const testPaymentCollection = async (
  phoneNumber: string = '+256700000000',
  amount: number = 1000,
  description?: string
): Promise<TestResult> => {
  try {
    console.log('🔍 Testing Payment Collection...');
    console.log('Phone Number:', phoneNumber);
    console.log('Amount:', amount, 'UGX');
    console.log('Description:', description || 'Test payment');
    
    // Validate amount
    if (amount < MARZPAY_CONFIG.MIN_AMOUNT || amount > MARZPAY_CONFIG.MAX_AMOUNT) {
      return {
        success: false,
        message: `Amount must be between ${MARZPAY_CONFIG.MIN_AMOUNT} and ${MARZPAY_CONFIG.MAX_AMOUNT} UGX`,
      };
    }
    
    // Format phone number
    const formattedPhone = marzpayService.formatPhoneNumber(phoneNumber);
    const validation = marzpayService.validatePhoneNumber(formattedPhone);
    
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || 'Invalid phone number format',
      };
    }
    
    console.log('Formatted Phone:', formattedPhone);
    
    // Make the API call
    const response = await marzpayService.collectMoney(
      amount,
      formattedPhone,
      description || 'Test payment collection'
    );
    
    if (response.status === 'success') {
      console.log('✅ Payment collection initiated successfully!');
      console.log('Transaction Data:', response.data);
      
      const transactionData = response.data;
      const transactionRef = transactionData?.transaction?.reference || 'N/A';
      const transactionUuid = transactionData?.transaction?.uuid || 'N/A';
      const status = transactionData?.transaction?.status || 'N/A';
      
      console.log('Transaction Reference:', transactionRef);
      console.log('Transaction UUID:', transactionUuid);
      console.log('Transaction Status:', status);
      
      return {
        success: true,
        message: 'Payment collection initiated successfully',
        data: {
          transactionRef,
          transactionUuid,
          status,
          fullResponse: response.data,
        },
      };
    } else {
      console.log('❌ Payment collection failed:', response.message);
      console.log('Error Code:', response.error_code);
      return {
        success: false,
        message: response.message || 'Payment collection failed',
        error: {
          error_code: response.error_code,
          fullResponse: response,
        },
      };
    }
  } catch (error: any) {
    console.error('❌ Payment collection error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
      error,
    };
  }
};

/**
 * Test getting collection details by transaction UUID
 */
export const testGetCollectionDetails = async (
  transactionUuid: string
): Promise<TestResult> => {
  try {
    console.log('🔍 Testing Get Collection Details...');
    console.log('Transaction UUID:', transactionUuid);
    
    const response = await marzpayService.getCollectionDetails(transactionUuid);
    
    if (response.status === 'success') {
      console.log('✅ Collection details retrieved successfully!');
      console.log('Collection Data:', response.data);
      return {
        success: true,
        message: 'Collection details retrieved successfully',
        data: response.data,
      };
    } else {
      console.log('❌ Failed to retrieve collection details:', response.message);
      return {
        success: false,
        message: response.message || 'Failed to retrieve collection details',
        error: response,
      };
    }
  } catch (error: any) {
    console.error('❌ Get collection details error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
      error,
    };
  }
};

/**
 * Run all tests sequentially
 */
export const runAllTests = async (): Promise<void> => {
  console.log('🚀 Starting MarzPay API Tests...\n');
  
  // Test 1: Connection
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: API Connection');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const connectionTest = await testConnection();
  console.log('Result:', connectionTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Message:', connectionTest.message);
  console.log('');
  
  // Test 2: Available Services
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Available Services');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const servicesTest = await testAvailableServices();
  console.log('Result:', servicesTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Message:', servicesTest.message);
  console.log('');
  
  // Test 3: Payment Collection
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Payment Collection');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const paymentTest = await testPaymentCollection(
    '+256700000000',
    1000,
    'Test payment from React Native app'
  );
  console.log('Result:', paymentTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Message:', paymentTest.message);
  
  if (paymentTest.success && paymentTest.data?.transactionUuid) {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 4: Get Collection Details');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const detailsTest = await testGetCollectionDetails(paymentTest.data.transactionUuid);
    console.log('Result:', detailsTest.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Message:', detailsTest.message);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ All tests completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

