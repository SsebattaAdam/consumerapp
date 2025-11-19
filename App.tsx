import React from 'react';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './lib/features/navigation/AppNavigator';
import { AuthProvider } from './lib/features/auth/repositry/authContextProvider';

enableScreens();

function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
