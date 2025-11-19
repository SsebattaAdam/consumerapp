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
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/app_state/app_state';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';
import { FLUTTERWAVE_CONFIG } from '../../../core/constants/flutterwave_config';
import flutterwaveService from '../services/flutterwave_service';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = useSelector((state: RootState) => state.userData);
  const { book } = route.params as { book: any };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user email from Redux or use a default
  const userEmail = `${username.toLowerCase().replace(/\s+/g, '')}@example.com`; // You can store actual email in Redux

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const txRef = flutterwaveService.generateTxRef();
      
      const paymentData = {
        amount: book.price,
        currency: FLUTTERWAVE_CONFIG.CURRENCY,
        email: userEmail,
        phoneNumber: '', 
        txRef: txRef,
        narration: `Payment for ${book.title}`,
        bookTitle: book.title,
      };

      const response = await flutterwaveService.initializePayment(paymentData);

      setIsProcessing(false);

      if (response.status === 'success') {
        Alert.alert(
          'Payment Successful! ',
          `Your payment of $${book.price.toFixed(2)} for "${book.title}" has been processed successfully.\n\nTransaction Reference: ${txRef}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Payment Error', response.message || 'An error occurred while processing your payment. Please try again.');
      }
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert('Payment Error', error.message || 'An error occurred while processing your payment. Please try again.');
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Card Payment', icon: 'credit-card' },
    { id: 'mobile', name: 'Mobile Money', icon: 'cellphone' },
    { id: 'bank', name: 'Bank Transfer', icon: 'bank' },
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
          <Text style={styles.userInfoEmail}>{userEmail}</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id && styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodContent}>
                <Avatar.Icon
                  size={40}
                  icon={method.icon}
                  style={[
                    styles.paymentIcon,
                    selectedPaymentMethod === method.id && styles.paymentIconSelected,
                  ]}
                  color={selectedPaymentMethod === method.id ? COLORS.white : COLORS.gray}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === method.id && styles.paymentMethodTextSelected,
                  ]}
                >
                  {method.name}
                </Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <Avatar.Icon
                  size={24}
                  icon="check-circle"
                  style={styles.checkIcon}
                  color={COLORS.gray}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${book.price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payButtonText}>Pay ${book.price.toFixed(2)}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 Your payment is secure and encrypted
        </Text>
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
    fontWeight: '700',
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
    fontWeight: '700',
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
    fontWeight: '500',
    color: COLORS.dark2,
  },
  paymentMethodTextSelected: {
    color: COLORS.gray,
    fontWeight: '600',
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
    fontWeight: '600',
    color: COLORS.dark2,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
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
    fontWeight: '700',
  },
  securityNote: {
    textAlign: 'center',
    color: COLORS.dark22,
    fontSize: 12,
    marginTop: 16,
    marginBottom: 20,
  },
});

export default PaymentScreen;

