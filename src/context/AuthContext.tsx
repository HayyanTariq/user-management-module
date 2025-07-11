// context/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, AuthConfig, AuthResponse } from './AuthTypes';
import { AuthApiClient } from '../services/AuthApiClient';
import { TokenManager } from '../services/TokenManager';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; config: AuthConfig }> = ({ 
  children, 
  config 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiClient] = useState(() => new AuthApiClient(config));

  useEffect(() => {
    TokenManager.setStorageKeys(
      config.tokenStorageKey || '@auth_token',
      config.refreshTokenStorageKey || '@auth_refresh_token'
    );
    
    initializeAuth();
  }, [config]);

  const initializeAuth = async () => {
    try {
      const storedUser = await TokenManager.getUser();
      const hasToken = await TokenManager.hasValidToken();

      if (storedUser && hasToken) {
        // Verify token is still valid
        const currentUser = await apiClient.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          config.onAuthStateChange?.(currentUser);
        } else {
          await TokenManager.clearTokens();
          config.onAuthStateChange?.(null);
        }
      } else {
        await TokenManager.clearTokens();
        config.onAuthStateChange?.(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await TokenManager.clearTokens();
      config.onAuthStateChange?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const result = await apiClient.signup({ name, email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        config.onAuthStateChange?.(result.user);
        return { success: true, message: result.message };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiClient.login({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        config.onAuthStateChange?.(result.user);
        return { success: true, message: result.message };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      await TokenManager.clearTokens();
      config.onAuthStateChange?.(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signInWithGoogle = async (idToken: string) => {
  
    try {
      const result = await apiClient.googleSignIn(idToken);
      if (result.success && result.user) {
        setUser(result.user);
        config.onAuthStateChange?.(result.user);
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return { success: false, message: 'Google Sign-In failed' };
    }
  };

  const deleteAccount = async () => {
    try {
      await apiClient.deleteAccount();
      await signOut();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};