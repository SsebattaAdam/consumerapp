import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';

type Props = {
  visible: boolean;
  book: any;
  onClose: () => void;
  onConfirm: () => void;
};

const OrderSummaryModal: React.FC<Props> = ({ visible, book, onClose, onConfirm }) => {
  if (!book) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Summary</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Avatar.Icon
                size={32}
                icon="close"
                style={styles.closeIcon}
                color={COLORS.dark2}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.bookSection}>
              <Image
                source={{ uri: book.coverImage }}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>By {book.author}</Text>
                {book.description && (
                  <Text style={styles.bookDescription} numberOfLines={3}>
                    {book.description}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${book.price.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${book.price.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark2,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    backgroundColor: 'transparent',
  },
  scrollView: {
    maxHeight: 400,
  },
  bookSection: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark2,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: COLORS.dark22,
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 12,
    color: COLORS.dark22,
    lineHeight: 18,
  },
  summarySection: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.dark22,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.offWhite,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark2,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default OrderSummaryModal;

