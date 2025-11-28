import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import { addTransaction } from '../../../core/app_state/app_actions';
import { Transaction } from '../../../core/app_state/userReducers';
import transactionStatusService from '../services/transactionStatusService';
import { userAuth } from '../../auth/repositry/authContextProvider';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';
import { MARZPAY_CONFIG } from '../../../core/constants/marzpay_config';
import marzpayService from '../services/marzpay_service';
import CustomTextField from '../../../core/components/CustomerTextFiled';
import PaymentResponseModal from '../components/PaymentResponseModal';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { username } = useSelector((state: RootState) => state.userData);
  const { user } = userAuth();
  const { book } = route.params as { book: any };

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Convert USD price to UGX (approximate rate: 1 USD = 3700 UGX)
  // In production, you should fetch real-time exchange rates
  const USD_TO_UGX_RATE = 3700;
  const amountInUGX = Math.round(book.price * USD_TO_UGX_RATE);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    setPhoneError('');
  };

  const handlePayment = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required');
      return;
    }

    // Format and validate phone number
    const formattedPhone = marzpayService.formatPhoneNumber(phoneNumber.trim());
    const validation = marzpayService.validatePhoneNumber(formattedPhone);
    
    if (!validation.valid) {
      setPhoneError(validation.message || 'Invalid phone number format');
      return;
    }

    setIsProcessing(true);
    setPhoneError('');

    try {
      const description = `Payment for "${book.title}" by ${username}`;
      
      const response = await marzpayService.collectMoney(
        amountInUGX,
        formattedPhone,
        description
      );

      setIsProcessing(false);

      // Show response to user for 5 seconds
      setPaymentResponse(response);
      setShowResponseModal(true);

      // If payment was initiated successfully, store transaction and start polling
      if (response.status === 'success' && response.data?.transaction && user) {
        const transactionData = response.data.transaction;
        const collectionData = response.data.collection;

        // Create transaction object
        const transaction: Transaction = {
          uuid: transactionData.uuid,
          reference: transactionData.reference,
          bookId: book.id,
          bookTitle: book.title,
          amount: collectionData?.amount?.raw || amountInUGX,
          currency: collectionData?.amount?.currency || 'UGX',
          phoneNumber: formattedPhone,
          status: 'processing', // Initial status
          createdAt: new Date().toISOString(),
          userId: user.id,
        };

        // Store transaction in Redux
        dispatch(addTransaction(transaction));

        // Start polling transaction status
        transactionStatusService.startPolling(
          transaction.uuid,
          (statusResult) => {
            // Update transaction status in Redux
            dispatch({
              type: 'UPDATE_TRANSACTION_STATUS',
              payload: {
                uuid: transaction.uuid,
                status: statusResult.status,
                updatedAt: statusResult.updatedAt,
              },
            });

            console.log(`📊 Transaction ${transaction.uuid} status updated: ${statusResult.status}`);
          },
          (error) => {
            console.error(`❌ Error polling transaction ${transaction.uuid}:`, error);
          }
        );

        // Auto-close modal after 5 seconds and navigate to transaction status screen
        setTimeout(() => {
          setShowResponseModal(false);
          navigation.navigate('TransactionStatus' as never, { 
            transactionUuid: transaction.uuid,
            bookId: book.id 
          } as never);
        }, 5000);
      } else {
        // For errors, just close modal after 5 seconds (don't navigate)
        setTimeout(() => {
          setShowResponseModal(false);
        }, 5000);
      }
    } catch (error: any) {
      setIsProcessing(false);
      
      // Show error response
      const errorResponse = {
        status: 'error' as const,
        message: error.message || 'An error occurred while processing your payment. Please try again.',
        error_code: 'NETWORK_ERROR',
      };
      
      setPaymentResponse(errorResponse);
      setShowResponseModal(true);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        setShowResponseModal(false);
      }, 5000);
    }
  };

  const paymentMethods = [
    { id: 'mobile', name: 'Mobile Money (MTN/Airtel)', icon: 'cellphone' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username="Payment"
          leftIcon="arrow-left"
          rightIcon="bell"
          onLeftPress={() => navigation.goBack()}
          onRightPress={undefined}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Display */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userInfoLabel}>Paying as</Text>
          <Text style={styles.userInfoName}>{username}</Text>
          <Text style={styles.userInfoEmail}>Mobile Money Payment</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodContent}>
              <Avatar.Icon
                size={40}
                icon="cellphone"
                style={styles.paymentIcon}
                color={COLORS.white}
              />
              <Text style={styles.paymentMethodText}>
                Mobile Money (MTN/Airtel)
              </Text>
            </View>
            <Avatar.Icon
              size={24}
              icon="check-circle"
              style={styles.checkIcon}
              color={COLORS.gray}
            />
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobile Money Number</Text>
          <Text style={styles.inputHint}>
            Enter your phone number with country code (e.g., +256781230949)
          </Text>
          <CustomTextField
            label=""
            placeholder="+256781230949"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Book Price</Text>
            <Text style={styles.totalAmount}>${book.price.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.convertedAmountRow]}>
            <Text style={styles.convertedLabel}>Amount (UGX)</Text>
            <Text style={styles.convertedAmount}>{amountInUGX.toLocaleString()} UGX</Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing || !phoneNumber.trim()}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payButtonText}>
              Request Payment ({amountInUGX.toLocaleString()} UGX)
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 Your payment is secure and encrypted
        </Text>
      </ScrollView>

      {/* Payment Response Modal - Shows API response for 5 seconds */}
      <PaymentResponseModal
        visible={showResponseModal}
        response={paymentResponse}
        onClose={() => {
          setShowResponseModal(false);
          if (paymentResponse?.status === 'success') {
            navigation.goBack();
          }
        }}
        duration={5000}
      />
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
    paddingBottom: 100,
  },
  userInfoSection: {
    backgroundColor: COLORS.white,
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoLabel: {
    fontSize: 12,
    color: COLORS.dark22,
    marginBottom: 8,
  },
  userInfoName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 4,
  },
  userInfoEmail: {
    fontSize: 14,
    color: COLORS.dark22,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodCardSelected: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.lightWhite,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    backgroundColor: COLORS.white,
    marginRight: 12,
  },
  paymentIconSelected: {
    backgroundColor: COLORS.gray,
  },
  paymentMethodText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark2,
  },
  paymentMethodTextSelected: {
    color: COLORS.gray,
    fontFamily: FONTS.semiBold,
  },
  checkIcon: {
    backgroundColor: 'transparent',
  },
  totalSection: {
    backgroundColor: COLORS.white,
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark2,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.gray,
  },
  payButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  securityNote: {
    textAlign: 'center',
    color: COLORS.dark22,
    fontSize: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.dark22,
    marginBottom: 8,
    fontFamily: FONTS.regular,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: -12,
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  convertedAmountRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.offWhite,
  },
  convertedLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
  },
  convertedAmount: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.gray,
  },
});

export default PaymentScreen;

