import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import { updateTransactionStatus } from '../../../core/app_state/app_actions';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';
import transactionStatusService from '../services/transactionStatusService';
import { Transaction } from '../../../core/app_state/userReducers';

const TransactionStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { transactions } = useSelector((state: RootState) => state.userData);
  const { transactionUuid, bookId } = route.params as { transactionUuid: string; bookId: number };

  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<Transaction['status']>('processing');

  // Find transaction in Redux store
  const transaction = transactions.find((tx: Transaction) => tx.uuid === transactionUuid);

  useEffect(() => {
    let isMounted = true;

    // Always start by checking status once
    const initializeStatus = async () => {
      console.log('🚀 Initializing status check for transaction:', transactionUuid);
      
      // Check status once first
      const result = await transactionStatusService.checkStatusOnce(transactionUuid);
      
      if (!isMounted) return;
      
      if (result) {
        console.log('📊 Initial status check result:', result);
        const initialStatus = result.status;
        setCurrentStatus(initialStatus);
        dispatch(updateTransactionStatus(transactionUuid, initialStatus, result.updatedAt));
        setIsLoading(false);
        
        // If status is still processing/pending, start polling
        if (initialStatus === 'processing' || initialStatus === 'pending') {
          console.log('🔄 Status is processing/pending, starting polling');
          startStatusPolling();
        } else {
          console.log(`✅ Status is final: ${initialStatus} - No polling needed`);
        }
      } else {
        // If no result, check if we have transaction in Redux
        if (transaction) {
          const txStatus = transaction.status;
          setCurrentStatus(txStatus);
          setIsLoading(false);
          
          if (txStatus === 'processing' || txStatus === 'pending') {
            console.log('🔄 Starting polling based on Redux transaction status');
            startStatusPolling();
          }
        } else {
          setIsLoading(false);
          // Start polling anyway to check status
          console.log('🔄 No transaction found, starting polling to check status');
          startStatusPolling();
        }
      }
    };

    initializeStatus();

    // Cleanup: stop polling when component unmounts
    return () => {
      isMounted = false;
      console.log('🧹 Cleaning up polling for transaction:', transactionUuid);
      transactionStatusService.stopPolling(transactionUuid);
    };
  }, [transactionUuid]);

  // Watch for status changes from Redux
  useEffect(() => {
    if (transaction && transaction.status !== currentStatus) {
      const newStatus = transaction.status;
      console.log(`📊 Status changed in Redux: ${currentStatus} -> ${newStatus}`);
      setCurrentStatus(newStatus);
      setIsLoading(false);
      
      // If status changed to final state, stop polling
      if (newStatus === 'successful' || newStatus === 'failed' || newStatus === 'cancelled') {
        console.log('✅ Final state reached, stopping polling');
        transactionStatusService.stopPolling(transactionUuid);
      }
    }
  }, [transaction?.status, currentStatus, transactionUuid]);

  const startStatusPolling = () => {
    console.log('🚀 Starting polling for transaction:', transactionUuid);
    
    // Stop any existing polling first
    transactionStatusService.stopPolling(transactionUuid);
    
    transactionStatusService.startPolling(
      transactionUuid,
      (statusResult) => {
        console.log('📊 Status update received in callback:', JSON.stringify(statusResult, null, 2));
        const newStatus = statusResult.status;
        
        console.log(`🔄 Updating status from ${currentStatus} to ${newStatus}`);
        
        // Update local state immediately
        setCurrentStatus(newStatus);
        setIsLoading(false);
        
        // Update Redux store
        console.log(`💾 Dispatching Redux update: ${newStatus}`);
        dispatch(updateTransactionStatus(transactionUuid, newStatus, statusResult.updatedAt));

        console.log(`✅ Status updated in Redux: ${newStatus}`);

        // If transaction reached final state, stop polling
        if (newStatus === 'successful' || newStatus === 'failed' || newStatus === 'cancelled') {
          console.log(`🛑 Final state reached: ${newStatus} - Stopping polling`);
          transactionStatusService.stopPolling(transactionUuid);
        }
      },
      (error) => {
        console.error('❌ Error polling status:', error);
        setIsLoading(false);
      }
    );
  };

  const checkStatusOnce = async () => {
    console.log('🔍 Checking status once for transaction:', transactionUuid);
    setIsLoading(true);
    
    try {
      const result = await transactionStatusService.checkStatusOnce(transactionUuid);
      
      if (result) {
        console.log('📊 Status check result:', result);
        const newStatus = result.status;
        setCurrentStatus(newStatus);
        dispatch(updateTransactionStatus(transactionUuid, newStatus, result.updatedAt));
        console.log(`✅ Status updated: ${newStatus}`);
      } else {
        console.warn('⚠️ No status result returned');
      }
    } catch (error) {
      console.error('❌ Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadBook = () => {
    if (currentStatus === 'successful' && bookId) {
      navigation.navigate('BookReader' as never, { bookId } as never);
    }
  };

  const handleRetryPayment = () => {
    if (transaction) {
      navigation.navigate('Payment' as never, { book: { id: transaction.bookId, title: transaction.bookTitle } } as never);
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'successful':
        return { icon: 'check-circle', color: COLORS.gray };
      case 'failed':
        return { icon: 'alert-circle', color: COLORS.red };
      case 'cancelled':
        return { icon: 'cancel', color: COLORS.dark22 };
      case 'processing':
      case 'pending':
        return { icon: 'clock-outline', color: COLORS.tertiary };
      default:
        return { icon: 'help-circle', color: COLORS.dark22 };
    }
  };

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'successful':
        return 'Payment Successful! You can now read the book.';
      case 'failed':
        return 'Payment Failed. Please try again.';
      case 'cancelled':
        return 'Payment was cancelled.';
      case 'processing':
        return 'Payment is being processed. Please wait...';
      case 'pending':
        return 'Payment is pending. Please complete the payment on your mobile money account.';
      default:
        return 'Checking payment status...';
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username="Payment Status"
          leftIcon="arrow-left"
          rightIcon="refresh"
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => {
            console.log('🔄 Manual refresh triggered');
            checkStatusOnce();
            // Restart polling if status is still processing
            if (currentStatus === 'processing' || currentStatus === 'pending') {
              transactionStatusService.stopPolling(transactionUuid);
              startStatusPolling();
            }
          }}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.gray} />
            <Text style={styles.loadingText}>Checking payment status...</Text>
          </View>
        ) : (
          <>
            {/* Status Icon */}
            <View style={styles.statusIconContainer}>
              <Avatar.Icon
                size={100}
                icon={statusIcon.icon}
                style={[styles.statusIcon, { backgroundColor: statusIcon.color }]}
                color={COLORS.white}
              />
            </View>

            {/* Status Message */}
            <Text style={styles.statusTitle}>
              {currentStatus === 'successful' ? 'Payment Successful!' : 
               currentStatus === 'failed' ? 'Payment Failed' :
               currentStatus === 'cancelled' ? 'Payment Cancelled' :
               'Payment Processing'}
            </Text>

            <Text style={styles.statusMessage}>{getStatusMessage()}</Text>

            {/* Transaction Details */}
            {transaction && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Transaction Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Book:</Text>
                  <Text style={styles.detailValue}>{transaction.bookTitle}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reference:</Text>
                  <Text style={[styles.detailValue, styles.referenceText]}>
                    {transaction.reference}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, styles[`${currentStatus}Text` as keyof typeof styles] as any]}>
                    {currentStatus.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {currentStatus === 'successful' && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleReadBook}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Read Book</Text>
                </TouchableOpacity>
              )}

              {(currentStatus === 'failed' || currentStatus === 'cancelled') && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleRetryPayment}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Try Again</Text>
                </TouchableOpacity>
              )}

              {(currentStatus === 'processing' || currentStatus === 'pending') && (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="small" color={COLORS.gray} />
                  <Text style={styles.processingText}>
                    Checking status automatically...
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  headerContainer: {
    backgroundColor: COLORS.gray,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  statusIcon: {
    // backgroundColor set dynamically
  },
  statusTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusMessage: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    textAlign: 'center',
    marginBottom: 30,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark2,
    flex: 2,
    textAlign: 'right',
  },
  referenceText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  successfulText: {
    color: COLORS.gray,
  },
  failedText: {
    color: COLORS.red,
  },
  cancelledText: {
    color: COLORS.dark22,
  },
  processingText: {
    color: COLORS.tertiary,
  },
  pendingText: {
    color: COLORS.tertiary,
  },
  actionsContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  secondaryButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  processingText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
  },
});

export default TransactionStatusScreen;

