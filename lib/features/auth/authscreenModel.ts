import { useState, useEffect, useRef } from 'react';
import { userAuth } from './repositry/authContextProvider';
import { getAuthErrorMessage, APP_ERRORS } from '../../core/constants/app_errors';

export const useAuthScreenModel = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { onLogin, onRegister, onLogout } = userAuth();

  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 10000); // 10 seconds
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  const clearErrorOnInput = () => {
    if (error) {
      setError(null);
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    }
  };

  const handleAuth = async () => {
    const trimmedEmail = email?.trim() || '';
    const trimmedUsername = username?.trim() || '';
    const passwordValue = password || '';

    setError(null);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (!trimmedEmail || !passwordValue) {
      setError(APP_ERRORS.AUTH.CREDENTIALS_REQUIRED);
      return;
    }

    if (isSignUp && !trimmedUsername) {
      setError('Please enter your name.');
      return;
    }

    if (passwordValue.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!onRegister) {
          throw new Error(APP_ERRORS.AUTH.SERVICE_UNAVAILABLE);
        }
        await onRegister(trimmedEmail, trimmedUsername, passwordValue);
        // After successful registration, sign out if auto-logged in and switch to login mode
        if (onLogout) {
          try {
            await onLogout();
          } catch (logoutError) {
            // Ignore logout errors, user might not be logged in
            console.log('Logout after registration:', logoutError);
          }
        }
        // Switch to login mode
        setIsSignUp(false);
        setError(null);
        setSuccessMessage('Account created successfully! Please sign in.');
        // Clear password but keep email for convenience
        setPassword('');
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        if (!onLogin) {
          throw new Error(APP_ERRORS.AUTH.SERVICE_UNAVAILABLE);
        }
        await onLogin(trimmedEmail, passwordValue);
      }
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetName = (text: string) => {
    setName(text);
    clearErrorOnInput();
  };

  const handleSetEmail = (text: string) => {
    setEmail(text);
    clearErrorOnInput();
  };

  const handleSetPassword = (text: string) => {
    setPassword(text);
    clearErrorOnInput();
  };

  return {
    isSignUp,
    setIsSignUp,
    username,
    setName: handleSetName,
    email,
    setEmail: handleSetEmail,
    password,
    setPassword: handleSetPassword,
    error,
    setError,
    successMessage,
    isLoading,
    handleAuth,
  };
};



