import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import DynamicHeader from '../../../core/components/headercomponet';
import { COLORS, FONTS } from '../../../core/constants/app_constants';
import { Avatar } from 'react-native-paper';

const PDFViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pdfUrl, bookTitle } = route.params as { pdfUrl: string; bookTitle: string };

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Format PDF URL for WebView
  // Google Docs Viewer or direct PDF link
  const getPDFUrl = () => {
    if (!pdfUrl) return '';
    
    // If it's already a direct PDF link, use it
    if (pdfUrl.toLowerCase().endsWith('.pdf')) {
      return pdfUrl;
    }
    
    // Use Google Docs Viewer as fallback for better compatibility
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setHasError(true);
    setErrorMessage(nativeEvent.description || 'Failed to load PDF');
    setIsLoading(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
  };

  const handleOpenInBrowser = async () => {
    try {
      const { Linking } = require('react-native');
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Cannot open PDF in browser');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to open PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <DynamicHeader
          username={bookTitle || 'PDF Viewer'}
          leftIcon="arrow-left"
          rightIcon="open-in-new"
          onLeftPress={() => navigation.goBack()}
          onRightPress={handleOpenInBrowser}
        />
      </View>

      {hasError ? (
        <View style={styles.errorContainer}>
          <Avatar.Icon
            size={80}
            icon="alert-circle"
            style={styles.errorIcon}
            color={COLORS.white}
          />
          <Text style={styles.errorTitle}>Failed to Load PDF</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.browserButton}
              onPress={handleOpenInBrowser}
              activeOpacity={0.8}
            >
              <Text style={styles.browserButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.gray} />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )}
          <WebView
            source={{ uri: getPDFUrl() }}
            style={styles.webView}
            onError={handleError}
            onLoadEnd={handleLoadEnd}
            onHttpError={handleError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.gray} />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
          />
        </View>
      )}
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
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    zIndex: 1,
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
    padding: 40,
    backgroundColor: COLORS.white,
  },
  errorIcon: {
    backgroundColor: COLORS.red,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.dark2,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark22,
    textAlign: 'center',
    marginBottom: 30,
  },
  errorActions: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  browserButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  browserButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
});

export default PDFViewerScreen;

