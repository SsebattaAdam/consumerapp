import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';

interface PaymentResponseModalProps {
  visible: boolean;
  response: {
    status: 'success' | 'error' | 'processing';
    message?: string;
    data?: any;
    error_code?: string;
  } | null;
  onClose: () => void;
  duration?: number; // Duration in milliseconds (default: 5000ms = 5 seconds)
}

const PaymentResponseModal: React.FC<PaymentResponseModalProps> = ({
  visible,
  response,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (visible && response) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, response, duration, onClose]);

  if (!response) return null;

  const isSuccess = response.status === 'success';
  const isError = response.status === 'error';
  const isProcessing = response.status === 'processing';

  const transactionData = response.data?.transaction;
  const collectionData = response.data?.collection;
  const transactionRef = transactionData?.reference || 'N/A';
  const transactionUuid = transactionData?.uuid || 'N/A';
  const transactionStatus = transactionData?.status || 'N/A';
  const amount = collectionData?.amount;
  const provider = collectionData?.provider || 'N/A';
  const phoneNumber = collectionData?.phone_number || 'N/A';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            {isSuccess && (
              <Avatar.Icon
                size={60}
                icon="check-circle"
                style={styles.successIcon}
                color={COLORS.white}
              />
            )}
            {isError && (
              <Avatar.Icon
                size={60}
                icon="alert-circle"
                style={styles.errorIcon}
                color={COLORS.white}
              />
            )}
            {isProcessing && (
              <ActivityIndicator size="large" color={COLORS.gray} />
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isSuccess
              ? 'Payment Request Sent!'
              : isError
              ? 'Payment Error'
              : 'Processing...'}
          </Text>

          {/* Message */}
          {response.message && (
            <Text style={styles.message}>{response.message}</Text>
          )}

          {/* Response Details */}
          <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
            {isSuccess && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, styles.successText]}>
                    {transactionStatus}
                  </Text>
                </View>

                {amount && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>
                      {amount.formatted} {amount.currency}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone Number:</Text>
                  <Text style={styles.detailValue}>{phoneNumber}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Provider:</Text>
                  <Text style={styles.detailValue}>{provider.toUpperCase()}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction Ref:</Text>
                  <Text style={[styles.detailValue, styles.referenceText]}>
                    {transactionRef}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction UUID:</Text>
                  <Text style={[styles.detailValue, styles.uuidText]}>
                    {transactionUuid}
                  </Text>
                </View>

                {response.data?.timeline && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Initiated At:</Text>
                    <Text style={styles.detailValue}>
                      {response.data.timeline.initiated_at || 'N/A'}
                    </Text>
                  </View>
                )}
              </>
            )}

            {isError && (
              <>
                {response.error_code && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Error Code:</Text>
                    <Text style={[styles.detailValue, styles.errorText]}>
                      {response.error_code}
                    </Text>
                  </View>
                )}

                {response.data && (
                  <View style={styles.errorDetailsContainer}>
                    <Text style={styles.errorDetailsTitle}>Error Details:</Text>
                    <Text style={styles.errorDetailsText}>
                      {JSON.stringify(response.data, null, 2)}
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Full Response (for debugging) */}
            <View style={styles.fullResponseContainer}>
              <Text style={styles.fullResponseTitle}>Full API Response:</Text>
              <Text style={styles.fullResponseText}>
                {JSON.stringify(response, null, 2)}
              </Text>
            </View>
          </ScrollView>

          {/* Auto-close indicator */}
          <Text style={styles.autoCloseText}>
            This will close automatically in {duration / 1000} seconds...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: COLORS.gray,
  },
  errorIcon: {
    backgroundColor: COLORS.red,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark2,
    flex: 2,
    textAlign: 'right',
  },
  successText: {
    color: COLORS.gray,
  },
  errorText: {
    color: COLORS.red,
  },
  referenceText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
  },
  uuidText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
  },
  errorDetailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.offWhite,
    borderRadius: 8,
  },
  errorDetailsTitle: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark2,
    marginBottom: 8,
  },
  errorDetailsText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
  },
  fullResponseContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.offWhite,
  },
  fullResponseTitle: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark22,
    marginBottom: 8,
  },
  fullResponseText: {
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
  },
  autoCloseText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default PaymentResponseModal;

