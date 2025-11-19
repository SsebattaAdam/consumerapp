import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authRepository, { AuthUser } from '../repository/authRepository';
import supabase from '../../../core/services/supabaseClient';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  onLogin?: (email: string, password: string) => Promise<void>;
  onRegister?: (email: string, username: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const currentUser = await authRepository.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    let subscription: { unsubscribe: () => void } | null = null;

    try {
      if (supabase && supabase.auth) {
        const authStateChange = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!isMounted) return;
          
          const authUser = session?.user
            ? {
                id: session.user.id,
                email: session.user.email,
                username: session.user.user_metadata?.username ?? null,
              }
            : null;
          setUser(authUser);
        });

        if (authStateChange && authStateChange.data && authStateChange.data.subscription) {
          subscription = authStateChange.data.subscription;
        }
      }
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      if (isMounted) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await authRepository.login(email, password);
  };

  const handleRegister = async (email: string, username: string, password: string) => {
    await authRepository.register(email, username, password);
  };

  const handleLogout = async () => {
    await authRepository.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        onLogin: handleLogin,
        onRegister: handleRegister,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('userAuth must be used within an AuthProvider');
  }
  return context;
};



