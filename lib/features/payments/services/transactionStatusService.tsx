/**
 * Transaction Status Service
 * 
 * Polls MarzPay API to check transaction status
 * and updates Redux store with latest status
 */

import marzpayService from './marzpay_service';
import { Transaction } from '../../../core/app_state/userReducers';

export type TransactionStatus = 'processing' | 'successful' | 'failed' | 'cancelled' | 'pending';

export interface TransactionStatusResult {
  status: TransactionStatus;
  updatedAt: string;
  data?: any;
}

class TransactionStatusService {
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private readonly POLL_INTERVAL = 5000; // Poll every 5 seconds
  private readonly MAX_POLL_ATTEMPTS = 60; // Max 5 minutes (60 * 5 seconds)
  private pollAttempts: Map<string, number> = new Map();

  /**
   * Start polling transaction status
   */
  startPolling(
    transactionUuid: string,
    onStatusUpdate: (result: TransactionStatusResult) => void,
    onError?: (error: string) => void
  ): void {
    // Clear any existing polling for this transaction
    this.stopPolling(transactionUuid);

    let attempts = 0;

    const poll = async () => {
      attempts++;
      this.pollAttempts.set(transactionUuid, attempts);

      // Stop polling if max attempts reached
      if (attempts > this.MAX_POLL_ATTEMPTS) {
        console.log(`⏹️ Stopped polling transaction ${transactionUuid} - max attempts reached`);
        this.stopPolling(transactionUuid);
        if (onError) {
          onError('Polling timeout - please check transaction status manually');
        }
        return;
      }

      try {
        console.log(`🔍 Polling transaction status: ${transactionUuid} (attempt ${attempts})`);

        const response = await marzpayService.getCollectionDetails(transactionUuid);

        console.log(`📥 API Response for ${transactionUuid}:`, JSON.stringify(response, null, 2));

        if (response.status === 'success' && response.data) {
          const transactionData = response.data.transaction;
          const rawStatus = transactionData?.status;
          
          console.log(`📋 Raw status from API: "${rawStatus}"`);
          console.log(`📋 Full transaction data:`, JSON.stringify(transactionData, null, 2));
          
          const status = this.mapMarzPayStatusToTransactionStatus(rawStatus);

          console.log(`🔄 Mapped status: "${status}" (from "${rawStatus}")`);

          const result: TransactionStatusResult = {
            status,
            updatedAt: response.data.timeline?.updated_at || response.data.timeline?.created_at || new Date().toISOString(),
            data: response.data,
          };

          console.log(`📊 Transaction ${transactionUuid} status: ${status}`);
          console.log(`📊 Full result:`, JSON.stringify(result, null, 2));

          // IMPORTANT: Call the update callback BEFORE checking if we should stop
          // This ensures Redux is updated even if we stop polling
          console.log(`📞 Calling onStatusUpdate callback with status: ${status}`);
          onStatusUpdate(result);
          console.log(`✅ onStatusUpdate callback completed`);

          // Stop polling if transaction is in final state (successful, failed, cancelled)
          if (status === 'successful' || status === 'failed' || status === 'cancelled') {
            console.log(`🛑 Transaction ${transactionUuid} reached final state: ${status} - Stopping polling`);
            this.stopPolling(transactionUuid);
            return;
          } else {
            console.log(`⏳ Transaction ${transactionUuid} still in progress: ${status} - Continuing polling`);
          }
        } else {
          console.error(`❌ Failed to get transaction status:`, response);
          console.error(`❌ Response status: ${response.status}`);
          console.error(`❌ Response data:`, JSON.stringify(response, null, 2));
          if (onError) {
            onError(response.message || 'Failed to get transaction status');
          }
        }
      } catch (error: any) {
        console.error(`❌ Error polling transaction status:`, error);
        if (onError) {
          onError(error.message || 'Network error while checking status');
        }
      }
    };

    // Start polling immediately
    poll();

    // Set up interval for continuous polling
    const interval = setInterval(poll, this.POLL_INTERVAL);
    this.pollingIntervals.set(transactionUuid, interval);
  }

  /**
   * Stop polling for a specific transaction
   */
  stopPolling(transactionUuid: string): void {
    const interval = this.pollingIntervals.get(transactionUuid);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(transactionUuid);
      this.pollAttempts.delete(transactionUuid);
      console.log(`⏹️ Stopped polling transaction ${transactionUuid}`);
    }
  }

  /**
   * Stop all polling
   */
  stopAllPolling(): void {
    this.pollingIntervals.forEach((interval, uuid) => {
      clearInterval(interval);
      console.log(`⏹️ Stopped polling transaction ${uuid}`);
    });
    this.pollingIntervals.clear();
    this.pollAttempts.clear();
  }

  /**
   * Check transaction status once (without polling)
   */
  async checkStatusOnce(transactionUuid: string): Promise<TransactionStatusResult | null> {
    try {
      console.log(`🔍 Checking status once for transaction: ${transactionUuid}`);
      const response = await marzpayService.getCollectionDetails(transactionUuid);

      console.log(`📥 checkStatusOnce response:`, JSON.stringify(response, null, 2));

      if (response.status === 'success' && response.data) {
        const transactionData = response.data.transaction;
        const rawStatus = transactionData?.status;
        
        console.log(`📋 Raw status from checkStatusOnce: "${rawStatus}"`);
        
        const status = this.mapMarzPayStatusToTransactionStatus(rawStatus);

        console.log(`🔄 Mapped status in checkStatusOnce: "${status}" (from "${rawStatus}")`);

        const result = {
          status,
          updatedAt: response.data.timeline?.updated_at || response.data.timeline?.created_at || new Date().toISOString(),
          data: response.data,
        };

        console.log(`✅ checkStatusOnce result:`, JSON.stringify(result, null, 2));
        return result;
      }

      console.warn(`⚠️ checkStatusOnce: No valid response data`);
      return null;
    } catch (error: any) {
      console.error(`❌ Error checking transaction status:`, error);
      return null;
    }
  }

  /**
   * Map MarzPay status to our transaction status
   */
  private mapMarzPayStatusToTransactionStatus(marzPayStatus: string | undefined): TransactionStatus {
    if (!marzPayStatus) {
      console.warn('⚠️ No status provided, defaulting to pending');
      return 'pending';
    }

    const statusLower = marzPayStatus.toLowerCase().trim();
    
    console.log(`🔍 Mapping status: "${marzPayStatus}" -> "${statusLower}"`);

    // Check for successful/completed status - IMPORTANT: MarzPay uses "completed" not "successful"
    if (statusLower === 'successful' || 
        statusLower === 'success' || 
        statusLower === 'completed' || 
        statusLower === 'complete' ||
        statusLower.includes('success') ||
        statusLower.includes('complete')) {
      console.log(`✅ Mapped to: successful (from "${marzPayStatus}")`);
      return 'successful';
    }

    // Check for failed status
    if (statusLower === 'failed' || 
        statusLower === 'fail' || 
        statusLower.includes('fail')) {
      console.log(`❌ Mapped to: failed`);
      return 'failed';
    }

    // Check for cancelled status
    if (statusLower === 'cancelled' || 
        statusLower === 'cancel' || 
        statusLower.includes('cancel')) {
      console.log(`🚫 Mapped to: cancelled`);
      return 'cancelled';
    }

    // Check for processing/pending status
    if (statusLower === 'processing' || 
        statusLower === 'pending' || 
        statusLower.includes('process') ||
        statusLower.includes('pending')) {
      const result = statusLower === 'processing' ? 'processing' : 'pending';
      console.log(`⏳ Mapped to: ${result}`);
      return result;
    }

    // Default to processing if unknown status
    console.warn(`⚠️ Unknown status "${marzPayStatus}", defaulting to processing`);
    return 'processing';
  }

  /**
   * Check if user has paid for a book
   */
  hasUserPaidForBook(transactions: Transaction[], bookId: number, userId: string): boolean {
    return transactions.some(
      (tx) =>
        tx.bookId === bookId &&
        tx.userId === userId &&
        tx.status === 'successful'
    );
  }

  /**
   * Get transaction for a book
   */
  getTransactionForBook(transactions: Transaction[], bookId: number, userId: string): Transaction | null {
    return (
      transactions.find(
        (tx) => tx.bookId === bookId && tx.userId === userId
      ) || null
    );
  }
}

export default new TransactionStatusService();

