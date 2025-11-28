import React, { useEffect, useState } from 'react';
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
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';
import transactionStatusService from '../../payments/services/transactionStatusService';
import { userAuth } from '../../auth/repositry/authContextProvider';
import booksData from '../../../core/static_data/booksData';

const BookReaderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params as { bookId: number };
  const { transactions } = useSelector((state: RootState) => state.userData);
  const { user } = userAuth();

  const [book, setBook] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Find book in data
    const foundBook = booksData.find((b) => b.id === bookId);
    setBook(foundBook);

    // Check if user has paid for this book
    if (user && foundBook) {
      const hasPaid = transactionStatusService.hasUserPaidForBook(
        transactions,
        bookId,
        user.id
      );
      setHasAccess(hasPaid);
    }

    setIsChecking(false);
  }, [bookId, user, transactions]);

  const handleReadBook = () => {
    if (!book?.pdfLink) {
      Alert.alert('Error', 'Book PDF link not available');
      return;
    }

    // Navigate to PDF viewer screen
    navigation.navigate('PDFViewer' as never, {
      pdfUrl: book.pdfLink,
      bookTitle: book.title,
    } as never);
  };

  const handlePurchase = () => {
    if (book) {
      navigation.navigate('Payment' as never, { book } as never);
    }
  };

  if (isChecking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gray} />
          <Text style={styles.loadingText}>Checking access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerContainer}>
          <DynamicHeader
            username="Book Not Found"
            leftIcon="arrow-left"
            rightIcon=""
            onLeftPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get transaction for this book
  const transaction = user
    ? transactionStatusService.getTransactionForBook(transactions, bookId, user.id)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username={book.title}
          leftIcon="arrow-left"
          rightIcon=""
          onLeftPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Book Info */}
        <View style={styles.bookInfoContainer}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <Text style={styles.bookDescription}>{book.description}</Text>
          <Text style={styles.bookCategory}>Category: {book.category}</Text>
        </View>

        {/* Access Status */}
        {hasAccess ? (
          <View style={styles.accessGrantedContainer}>
            <Avatar.Icon
              size={60}
              icon="check-circle"
              style={styles.successIcon}
              color={COLORS.white}
            />
            <Text style={styles.accessTitle}>Access Granted</Text>
            <Text style={styles.accessMessage}>
              You have successfully purchased this book. You can now read it.
            </Text>
            {transaction && (
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionLabel}>Transaction Reference:</Text>
                <Text style={styles.transactionValue}>{transaction.reference}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.readButton}
              onPress={handleReadBook}
              activeOpacity={0.8}
            >
              <Text style={styles.readButtonText}>Read Book</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.accessDeniedContainer}>
            <Avatar.Icon
              size={60}
              icon="lock"
              style={styles.lockIcon}
              color={COLORS.white}
            />
            <Text style={styles.accessTitle}>Purchase Required</Text>
            <Text style={styles.accessMessage}>
              You need to purchase this book to read it.
            </Text>
            {transaction && (
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionLabel}>Payment Status:</Text>
                <Text style={[styles.transactionValue, styles[`${transaction.status}Text` as keyof typeof styles] as any]}>
                  {transaction.status.toUpperCase()}
                </Text>
                {transaction.status === 'processing' && (
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => {
                      navigation.navigate('TransactionStatus' as never, {
                        transactionUuid: transaction.uuid,
                        bookId: book.id,
                      } as never);
                    }}
                  >
                    <Text style={styles.statusButtonText}>Check Payment Status</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={handlePurchase}
              activeOpacity={0.8}
            >
              <Text style={styles.purchaseButtonText}>
                Purchase for ${book.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  bookInfoContainer: {
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
  bookTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
    marginBottom: 12,
  },
  bookDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    lineHeight: 20,
    marginBottom: 12,
  },
  bookCategory: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  accessGrantedContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    backgroundColor: COLORS.gray,
    marginBottom: 16,
  },
  accessTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 8,
  },
  accessMessage: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    textAlign: 'center',
    marginBottom: 20,
  },
  transactionInfo: {
    width: '100%',
    padding: 12,
    backgroundColor: COLORS.offWhite,
    borderRadius: 8,
    marginBottom: 20,
  },
  transactionLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.dark22,
    marginBottom: 4,
  },
  transactionValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark2,
  },
  readButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  readButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  accessDeniedContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockIcon: {
    backgroundColor: COLORS.red,
    marginBottom: 16,
  },
  purchaseButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  purchaseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  statusButton: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  statusButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  successfulText: {
    color: COLORS.gray,
  },
  failedText: {
    color: COLORS.red,
  },
  processingText: {
    color: COLORS.tertiary,
  },
});

export default BookReaderScreen;

