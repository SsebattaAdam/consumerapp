import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator/BottomTabNavigator';
import { Provider } from 'react-redux';
import { store } from '../../core/app_state/app_state';
import LoginScreen from '../auth/screens/loginscreen';
import BookListScreen from '../home/screens/BookListScreen';
import FavoritesScreen from '../home/screens/FavoritesScreen';
import PaymentScreen from '../payments/screens/PaymentScreen';
import TransactionStatusScreen from '../payments/screens/TransactionStatusScreen';
import BookReaderScreen from '../home/screens/BookReaderScreen';
import PDFViewerScreen from '../home/screens/PDFViewerScreen';
import { userAuth } from '../auth/repositry/authContextProvider';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  BookList: { title: string; data: any[] };
  Favorites: undefined;
  Payment: { book: any };
  TransactionStatus: { transactionUuid: string; bookId: number };
  BookReader: { bookId: number };
  PDFViewer: { pdfUrl: string; bookTitle: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigatorContent() {
  const { user, isLoading } = userAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="BookList" component={BookListScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="TransactionStatus" component={TransactionStatusScreen} />
            <Stack.Screen name="BookReader" component={BookReaderScreen} />
            <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <Provider store={store}>
      <NavigatorContent />
    </Provider>
  );
}
