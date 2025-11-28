/**
 * MarzPay Test Button Component
 * 
 * This component provides a test button to verify MarzPay API connectivity
 * and perform test transactions. Use this in development/testing only.
 * 
 * Usage: Add this component to your PaymentScreen or a test screen
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { testConnection, testPaymentCollection, runAllTests } from '../services/marzpay_test';

interface MarzPayTestButtonProps {
  testPhoneNumber?: string;
  testAmount?: number;
}

const MarzPayTestButton: React.FC<MarzPayTestButtonProps> = ({
  testPhoneNumber = '+256700000000',
  testAmount = 1000,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult('Testing connection...');
    
    try {
      const result = await testConnection();
      
      if (result.success) {
        Alert.alert(
          '✅ Connection Test Passed',
          `API connection successful!\n\nAccount Balance: ${JSON.stringify(result.data?.account?.balance || 'N/A')}\n\nCheck console for full details.`,
          [{ text: 'OK' }]
        );
        setTestResult('✅ Connection successful');
      } else {
        Alert.alert(
          '❌ Connection Test Failed',
          result.message || 'Connection failed',
          [{ text: 'OK' }]
        );
        setTestResult('❌ Connection failed: ' + result.message);
      }
    } catch (error: any) {
      Alert.alert('❌ Test Error', error.message || 'An error occurred');
      setTestResult('❌ Error: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestPayment = async () => {
    setIsTesting(true);
    setTestResult('Testing payment collection...');
    
    try {
      const result = await testPaymentCollection(
        testPhoneNumber,
        testAmount,
        'Test payment from React Native app'
      );
      
      if (result.success) {
        const transactionRef = result.data?.transactionRef || 'N/A';
        const transactionUuid = result.data?.transactionUuid || 'N/A';
        
        Alert.alert(
          '✅ Payment Test Passed',
          `Payment collection initiated successfully!\n\nTransaction Reference: ${transactionRef}\nTransaction UUID: ${transactionUuid}\n\nCheck console for full details.`,
          [{ text: 'OK' }]
        );
        setTestResult(`✅ Payment successful - Ref: ${transactionRef}`);
      } else {
        Alert.alert(
          '❌ Payment Test Failed',
          result.message || 'Payment collection failed',
          [{ text: 'OK' }]
        );
        setTestResult('❌ Payment failed: ' + result.message);
      }
    } catch (error: any) {
      Alert.alert('❌ Test Error', error.message || 'An error occurred');
      setTestResult('❌ Error: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunAllTests = async () => {
    setIsTesting(true);
    setTestResult('Running all tests...');
    
    try {
      await runAllTests();
      Alert.alert(
        '✅ All Tests Completed',
        'Check the console for detailed test results.',
        [{ text: 'OK' }]
      );
      setTestResult('✅ All tests completed - Check console');
    } catch (error: any) {
      Alert.alert('❌ Test Error', error.message || 'An error occurred');
      setTestResult('❌ Error: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MarzPay API Tests</Text>
      <Text style={styles.subtitle}>Test real API calls (Sandbox Mode)</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.primaryButton, isTesting && styles.buttonDisabled]}
        onPress={handleTestConnection}
        disabled={isTesting}
      >
        {isTesting ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Test Connection</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, isTesting && styles.buttonDisabled]}
        onPress={handleTestPayment}
        disabled={isTesting}
      >
        {isTesting ? (
          <ActivityIndicator color={COLORS.gray} size="small" />
        ) : (
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Test Payment ({testAmount} UGX)
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.tertiaryButton, isTesting && styles.buttonDisabled]}
        onPress={handleRunAllTests}
        disabled={isTesting}
      >
        {isTesting ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Run All Tests</Text>
        )}
      </TouchableOpacity>

      {testResult ? (
        <Text style={styles.resultText}>{testResult}</Text>
      ) : null}

      <Text style={styles.note}>
        💡 These are REAL API calls to MarzPay sandbox. Check console for detailed logs.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: COLORS.gray,
  },
  secondaryButton: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  tertiaryButton: {
    backgroundColor: COLORS.tertiary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.gray,
  },
  resultText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
    marginTop: 8,
    textAlign: 'center',
  },
  note: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MarzPayTestButton;

