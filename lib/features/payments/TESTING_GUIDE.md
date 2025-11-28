# MarzPay Testing Guide

## ✅ Real API Calls (No Simulation)

**Important**: The MarzPay integration is already making **REAL API calls** to MarzPay's sandbox environment. There is **NO simulation** - every payment request is an actual HTTP request to `https://wallet.wearemarz.com/api/v1/collect-money`.

## How to Verify Real API Calls

### 1. Check Console Logs

When you make a payment, you'll see detailed logs in your console:

```
📤 MarzPay API Request: {
  url: 'https://wallet.wearemarz.com/api/v1/collect-money',
  method: 'POST',
  data: { ... }
}

📥 MarzPay API Response: {
  status: 200,
  statusText: 'OK',
  data: { ... }
}
```

### 2. Network Tab (React Native Debugger)

If using React Native Debugger or Flipper:
- Open Network tab
- Make a payment
- You'll see the actual HTTP request to `wallet.wearemarz.com`

### 3. Use Test Utilities

We've created test utilities to verify API connectivity:

```typescript
import { testConnection, testPaymentCollection, runAllTests } from './services/marzpay_test';

// Test API connection
await testConnection();

// Test payment collection
await testPaymentCollection('+256700000000', 1000);

// Run all tests
await runAllTests();
```

## Testing a Complete Transaction

### Method 1: Through the App UI

1. **Start your app**:
   ```bash
   npm start
   npm run android  # or npm run ios
   ```

2. **Navigate to a book** and tap "Buy Now"

3. **Enter a test phone number**:
   - Format: `+256700000000` or `0781230949`
   - The app will auto-format it to `+256700000000`

4. **Tap "Request Payment"**

5. **Check the console** for API logs:
   ```
   📤 MarzPay API Request: ...
   📥 MarzPay API Response: ...
   ✅ MarzPay Collection Success: ...
   ```

6. **Check the alert** - You'll see:
   - Transaction Reference
   - Transaction UUID
   - Status (processing/successful/failed)

### Method 2: Using Test Button Component

Add the test button to your PaymentScreen or create a test screen:

```typescript
import MarzPayTestButton from './components/MarzPayTestButton';

// In your component
<MarzPayTestButton 
  testPhoneNumber="+256700000000"
  testAmount={1000}
/>
```

This will give you buttons to:
- Test API Connection
- Test Payment Collection
- Run All Tests

### Method 3: Direct API Test (Using Test Utilities)

Create a test screen or add to existing screen:

```typescript
import React from 'react';
import { View, Button } from 'react-native';
import { testPaymentCollection } from '../payments/services/marzpay_test';

const TestScreen = () => {
  const handleTest = async () => {
    const result = await testPaymentCollection(
      '+256700000000',  // Phone number
      1000,              // Amount in UGX
      'Test payment'     // Description
    );
    
    console.log('Test Result:', result);
  };

  return (
    <View>
      <Button title="Test Payment" onPress={handleTest} />
    </View>
  );
};
```

## What Happens in Sandbox Mode

When you make a payment in sandbox mode:

1. ✅ **Real API call** is made to MarzPay
2. ✅ **Real authentication** using your API credentials
3. ✅ **Real transaction** is created in MarzPay system
4. ⚠️ **No real money** is transferred (sandbox mode)
5. ✅ **Real response** from MarzPay API

## Expected API Response

When successful, you'll receive:

```json
{
  "status": "success",
  "message": "Collection initiated successfully.",
  "data": {
    "transaction": {
      "uuid": "4e7fb3fa-c13a-4b05-8acd-cf60ff68cb94",
      "reference": "COL1703123456789abc",
      "status": "processing",
      "provider_reference": null
    },
    "collection": {
      "amount": {
        "formatted": "1,000.00",
        "raw": 1000,
        "currency": "UGX"
      },
      "provider": "mtn",
      "phone_number": "+256700000000",
      "mode": "live"
    },
    "timeline": {
      "initiated_at": "2024-01-20 14:30:00",
      "estimated_settlement": "2024-01-20 14:35:00"
    },
    "metadata": {
      "response_timestamp": "2024-01-20 14:30:00",
      "sandbox_mode": true
    }
  }
}
```

## Troubleshooting

### Issue: "Network error" or "Connection failed"

**Check:**
1. Internet connection
2. API credentials in `marzpay_config.tsx`
3. Base URL is correct: `https://wallet.wearemarz.com/api/v1`

### Issue: "Invalid phone number format"

**Solution:**
- Use format: `+256xxxxxxxxx` (13 digits total for Uganda)
- Or: `0781230949` (will be auto-formatted)

### Issue: "Amount must be between 500 and 10,000,000 UGX"

**Solution:**
- Minimum: 500 UGX
- Maximum: 10,000,000 UGX
- Check the converted amount (USD * 3700)

### Issue: "DUPLICATE_REFERENCE"

**Solution:**
- Each transaction needs a unique UUID reference
- The app auto-generates this, but if you see this error, it means the reference was already used
- This shouldn't happen in normal use

## Verifying It's Real (Not Simulated)

1. **Check the code**: `marzpay_service.tsx` uses `axios.post()` - real HTTP calls
2. **Check network**: Use React Native Debugger to see HTTP requests
3. **Check console**: You'll see actual API request/response logs
4. **Check MarzPay dashboard**: Transactions should appear in your MarzPay account

## Next Steps After Testing

1. ✅ Verify API calls are working
2. ⏳ Test with different phone numbers
3. ⏳ Test with different amounts
4. ⏳ Check transaction status in MarzPay dashboard
5. ⏳ Set up webhooks for payment status updates
6. ⏳ Switch to live mode when ready

## Important Notes

- **Sandbox Mode**: All transactions are test transactions (no real money)
- **Real API Calls**: Every request is a real HTTP call to MarzPay
- **No Simulation**: Unlike the old Flutterwave implementation, this makes real API calls
- **Console Logs**: Check console for detailed request/response information
- **Transaction Tracking**: Use transaction UUID to track payments in MarzPay dashboard

