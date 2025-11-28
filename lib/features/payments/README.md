# MarzPay Payment Integration

This folder contains the MarzPay payment integration for the e-commerce app. MarzPay is a payment platform in Uganda that supports Mobile Money collections via MTN and Airtel.

## Structure

- `screens/PaymentScreen.tsx` - Payment UI screen with phone number input and payment processing
- `services/marzpay_service.tsx` - MarzPay service for payment collection API
- `components/OrderSummaryModal.tsx` - Order summary modal component

## Configuration

Update your MarzPay credentials in `lib/core/constants/marzpay_config.tsx`:

1. **API Credentials** (already configured):
   - API Key: `marz_6lPvnnrCot5QMXd9`
   - API Secret: `j4cw73BVcfue3Inrg8H5OaQN7ljadkVk`
   - Base64 Authorization Header: Pre-encoded for convenience

2. **Base URL**: `https://wallet.wearemarz.com/api/v1`

3. **Current Mode**: Sandbox (for testing)

## Implementation Details

### Payment Flow

1. User selects a book and taps "Buy Now"
2. Navigates to PaymentScreen
3. User enters their mobile money phone number (with country code, e.g., +256781230949)
4. System converts USD price to UGX (using exchange rate)
5. User taps "Request Payment"
6. App calls MarzPay API to initiate collection
7. Payment request is sent to user's mobile money account
8. User completes payment on their phone
9. Success/Error alert is shown

### API Endpoints Used

- `POST /collect-money` - Initiate mobile money collection
- `GET /collect-money/{uuid}` - Get collection details
- `GET /balance` - Get account balance
- `GET /collect-money/services` - Get available services

### Features

- ✅ Mobile Money collection (MTN/Airtel)
- ✅ Automatic phone number formatting
- ✅ Phone number validation
- ✅ UUID generation for transaction references
- ✅ Currency conversion (USD to UGX)
- ✅ Error handling and user feedback
- ✅ Sandbox mode support

## Phone Number Format

MarzPay requires phone numbers in international format:
- **Format**: `+256xxxxxxxxx` (for Uganda)
- **Example**: `+256781230949`
- The service automatically formats numbers if country code is missing

## Currency Conversion

Currently uses a fixed exchange rate:
- **Rate**: 1 USD = 3,700 UGX
- **Location**: `PaymentScreen.tsx`
- **Note**: In production, fetch real-time exchange rates from an API

## Sandbox Mode

The account is currently in **sandbox mode**:
- No real transactions are processed
- No real money is transferred
- Perfect for testing the integration
- All APIs return test responses

To switch to live mode:
1. Complete account verification in MarzPay dashboard
2. Update `IS_SANDBOX: false` in `marzpay_config.tsx`

## Error Handling

The service handles various error scenarios:
- Invalid phone number format
- Amount validation (500 - 10,000,000 UGX)
- Network errors
- API errors (duplicate reference, validation errors, etc.)

## Transaction Reference

Each payment requires a unique UUID v4 reference:
- Automatically generated using `generateUUID()` utility
- Format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- Stored in `lib/core/utils/uuid.ts`

## Testing

### Test Phone Numbers

In sandbox mode, you can use any valid format phone number:
- `+256700000000`
- `+256781230949`
- `0781230949` (will be auto-formatted to +256781230949)

### Test Amounts

- Minimum: 500 UGX
- Maximum: 10,000,000 UGX

## Next Steps

1. ✅ MarzPay integration complete
2. ⏳ Test with real phone numbers (in sandbox mode)
3. ⏳ Set up webhook endpoint for payment callbacks
4. ⏳ Implement payment verification/status checking
5. ⏳ Switch to live mode after testing
6. ⏳ Add real-time exchange rate API integration

## Webhook Setup (Future)

To receive payment status updates:

1. Create webhook endpoint in your backend
2. Register webhook in MarzPay dashboard:
   ```bash
   POST /webhooks
   {
     "name": "Payment Webhook",
     "url": "https://your-domain.com/webhook",
     "event_type": "success",
     "is_active": true
   }
   ```
3. Handle webhook callbacks to update payment status

## API Documentation

Full API documentation: https://wallet.wearemarz.com/api/docs

## Support

For issues or questions:
- MarzPay Dashboard: https://wallet.wearemarz.com
- API Documentation: See MarzPay API docs
- Support: Contact MarzPay support team
