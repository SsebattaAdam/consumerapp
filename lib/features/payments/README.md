# Flutterwave Payment Integration

This folder contains the Flutterwave payment integration for the e-commerce app.

## Structure

- `screens/PaymentScreen.tsx` - Payment UI screen with order summary and payment method selection
- `services/flutterwave_service.tsx` - Flutterwave service for payment processing
- `flutterwave/` - Additional Flutterwave utilities (if needed)

## Configuration

Update your Flutterwave credentials in `lib/core/constants/flutterwave_config.tsx`:

1. Get your **Public Key** from Flutterwave Dashboard:
   - Go to https://dashboard.flutterwave.com
   - Navigate to Settings > API Keys
   - Copy your Public Key (format: `FLWPUBK_TEST-xxxxxxxxxxxxx` for test mode)

2. Update the config file with your actual Public Key

## Current Implementation

The current implementation uses a **simulated payment** for testing purposes. 

### For Production:

You have two options:

1. **Backend Integration (Recommended)**
   - Create a backend API endpoint that initializes Flutterwave payments
   - The backend should handle the actual Flutterwave API calls
   - Your React Native app calls your backend, which then communicates with Flutterwave

2. **React Native Flutterwave Package**
   - Install a React Native Flutterwave package (if available)
   - Or create a native module bridge to the Android SDK

## Testing

Currently, the payment flow simulates a successful payment after 2 seconds. This allows you to test the UI and flow.

To test with actual Flutterwave:
1. Update the `flutterwave_service.tsx` to call your backend API
2. Or integrate Flutterwave's web SDK using WebView
3. Or create a native module for the Android SDK

## Usage

When a user taps "Buy Now" on any book:
1. Navigates to PaymentScreen
2. User enters email and phone number
3. Selects payment method
4. Taps "Pay" button
5. Payment is processed (currently simulated)
6. Success/Error alert is shown

## Next Steps

1. Get your Public Key from Flutterwave Dashboard
2. Set up a backend API for payment processing
3. Update `flutterwave_service.tsx` to call your backend
4. Implement payment verification on your backend
5. Test with Flutterwave test cards

