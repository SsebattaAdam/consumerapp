import { MARZPAY_CONFIG } from '../../../core/constants/marzpay_config';
import { generateUUID } from '../../../core/utils/uuid';
import axios from 'axios';

export interface MarzPayCollectionData {
  amount: number;
  phone_number: string;
  country: string;
  reference: string;
  description?: string;
  callback_url?: string;
}

export interface MarzPayResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
  error_code?: string;
}

export interface CollectionResponse {
  transaction: {
    uuid: string;
    reference: string;
    status: string;
    provider_reference: string | null;
  };
  collection: {
    amount: {
      formatted: string;
      raw: number;
      currency: string;
    };
    provider: string;
    phone_number: string;
    mode: string;
  };
  timeline: {
    initiated_at: string;
    estimated_settlement: string;
  };
  metadata: {
    response_timestamp: string;
    sandbox_mode: boolean;
  };
}

class MarzPayService {
  private baseUrl = MARZPAY_CONFIG.BASE_URL;
  private authHeader = `Basic ${MARZPAY_CONFIG.AUTHORIZATION_HEADER}`;

  /**
   * Collect money from customer (Mobile Money Collection)
   */
  async collectMoney(
    amount: number,
    phoneNumber: string,
    description?: string,
    callbackUrl?: string
  ): Promise<MarzPayResponse> {
    try {
      // Validate amount
      if (amount < MARZPAY_CONFIG.MIN_AMOUNT || amount > MARZPAY_CONFIG.MAX_AMOUNT) {
        return {
          status: 'error',
          message: `Amount must be between ${MARZPAY_CONFIG.MIN_AMOUNT} and ${MARZPAY_CONFIG.MAX_AMOUNT} UGX`,
          error_code: 'INVALID_AMOUNT',
        };
      }

      // Validate phone number format (should include country code)
      if (!phoneNumber.startsWith('+')) {
        return {
          status: 'error',
          message: 'Phone number must include country code (e.g., +256xxxxxxxxx)',
          error_code: 'INVALID_PHONE_FORMAT',
        };
      }

      // Generate UUID reference
      const reference = generateUUID();

      const collectionData: MarzPayCollectionData = {
        amount: Math.round(amount), // Ensure integer amount
        phone_number: phoneNumber,
        country: MARZPAY_CONFIG.DEFAULT_COUNTRY,
        reference,
        description: description || `Payment for book purchase`,
        callback_url: callbackUrl,
      };

      // Log the API request details (for debugging)
      console.log('📤 MarzPay API Request:', {
        url: `${this.baseUrl}/collect-money`,
        method: 'POST',
        data: {
          ...collectionData,
          phone_number: collectionData.phone_number, // Log phone number
          amount: collectionData.amount,
          reference: collectionData.reference,
        },
      });

      const response = await axios.post(
        `${this.baseUrl}/collect-money`,
        collectionData,
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the API response (for debugging)
      console.log('📥 MarzPay API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      if (response.data.status === 'success') {
        console.log('✅ MarzPay Collection Success:', {
          transactionUuid: response.data.data?.transaction?.uuid,
          reference: response.data.data?.transaction?.reference,
          status: response.data.data?.transaction?.status,
        });
        
        return {
          status: 'success',
          message: response.data.message || 'Collection initiated successfully',
          data: response.data.data,
        };
      }

      return {
        status: 'error',
        message: response.data.message || 'Collection failed',
        error_code: response.data.error_code,
      };
    } catch (error: any) {
      console.error('❌ MarzPay Collection Error:', error);
      
      if (error.response) {
        // API returned an error response - this is a REAL API call that failed
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        
        const errorData = error.response.data;
        return {
          status: 'error',
          message: errorData.message || 'Payment collection failed',
          error_code: errorData.error_code,
        };
      }

      return {
        status: 'error',
        message: error.message || 'Network error. Please check your connection and try again.',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Get collection details by transaction UUID
   */
  async getCollectionDetails(transactionUuid: string): Promise<MarzPayResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/collect-money/${transactionUuid}`,
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the API response for debugging
      console.log('📥 MarzPay Get Collection Response Status:', response.status);
      console.log('📥 MarzPay Response Data:', JSON.stringify(response.data, null, 2));
      
      if (response.data?.status === 'success' || response.status === 200) {
        const transactionStatus = response.data?.data?.transaction?.status;
        console.log(`✅ Collection details retrieved. Transaction status: "${transactionStatus}"`);
        console.log(`✅ Full transaction object:`, JSON.stringify(response.data?.data?.transaction, null, 2));
        
        return {
          status: 'success',
          message: 'Collection details retrieved successfully',
          data: response.data?.data || response.data,
        };
      }
      
      // Also check if response.data exists directly (some API formats)
      if (response.data?.transaction) {
        const transactionStatus = response.data.transaction.status;
        console.log(`✅ Found transaction directly in response. Status: "${transactionStatus}"`);
        
        return {
          status: 'success',
          message: 'Collection details retrieved successfully',
          data: response.data,
        };
      }

      return {
        status: 'error',
        message: response.data.message || 'Failed to retrieve collection details',
        error_code: response.data.error_code,
      };
    } catch (error: any) {
      console.error('MarzPay Get Collection Error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        return {
          status: 'error',
          message: errorData.message || 'Failed to retrieve collection details',
          error_code: errorData.error_code,
        };
      }

      return {
        status: 'error',
        message: error.message || 'Network error',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<MarzPayResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/balance`, {
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        return {
          status: 'success',
          message: 'Balance retrieved successfully',
          data: response.data.data,
        };
      }

      return {
        status: 'error',
        message: response.data.message || 'Failed to retrieve balance',
        error_code: response.data.error_code,
      };
    } catch (error: any) {
      console.error('MarzPay Get Balance Error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        return {
          status: 'error',
          message: errorData.message || 'Failed to retrieve balance',
          error_code: errorData.error_code,
        };
      }

      return {
        status: 'error',
        message: error.message || 'Network error',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Get available collection services
   */
  async getAvailableServices(): Promise<MarzPayResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/collect-money/services`, {
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        return {
          status: 'success',
          message: 'Services retrieved successfully',
          data: response.data.data,
        };
      }

      return {
        status: 'error',
        message: response.data.message || 'Failed to retrieve services',
        error_code: response.data.error_code,
      };
    } catch (error: any) {
      console.error('MarzPay Get Services Error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        return {
          status: 'error',
          message: errorData.message || 'Failed to retrieve services',
          error_code: errorData.error_code,
        };
      }

      return {
        status: 'error',
        message: error.message || 'Network error',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Format phone number to include country code if missing
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string = '+256'): string {
    // Remove any spaces, dashes, or other characters
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If already has country code, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If starts with 0, replace with country code
    if (cleaned.startsWith('0')) {
      return countryCode + cleaned.substring(1);
    }
    
    // Otherwise, prepend country code
    return countryCode + cleaned;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): { valid: boolean; message?: string } {
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Must start with +
    if (!cleaned.startsWith('+')) {
      return {
        valid: false,
        message: 'Phone number must include country code (e.g., +256xxxxxxxxx)',
      };
    }
    
    // For Uganda (+256), should be 13 digits total
    if (cleaned.startsWith('+256')) {
      if (cleaned.length !== 13) {
        return {
          valid: false,
          message: 'Ugandan phone number must be 9 digits after country code (e.g., +256781230949)',
        };
      }
    }
    
    return { valid: true };
  }
}

export default new MarzPayService();

