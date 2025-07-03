import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from './AuthTypes';



// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  USERS_DB: '@users_database',
} as const;

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all users from storage (simulating a database)
  const getUsersDatabase = async (): Promise<User[]> => {
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting users database:', error);
      return [];
    }
  };

  // Save users database
  const saveUsersDatabase = async (users: User[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users database:', error);
    }
  };

  // Sign Up Function
  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Input validation 
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { success: false, message: 'All fields are required' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Check if user already exists
      const users = await getUsersDatabase();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() );
      
      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(), // In a real app, hash the password before saving
        createdAt: new Date().toISOString(),
      };

      // Save user to database
      const updatedUsers = [...users, newUser];
      await saveUsersDatabase(updatedUsers);

      // Set current user
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'An error occurred during sign up. Please try again.' };
    }
  };

  // Sign In Function
  const signIn = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Input validation
      if (!email.trim() || !password.trim()) {
        return { success: false, message: 'Email and password are required' };
      }

      // Find user in database
      const users = await getUsersDatabase();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        return { success: false, message: 'No account found with this email. Please sign up first.' };
      }
        if (foundUser.password !== password) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }


      // In a real app, you would verify the password hash here
      // For this demo, we'll simulate successful login if user exists
      // Note: In production, store hashed passwords and verify them properly

      // Set current user
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(foundUser));
      setUser(foundUser);

      return { success: true, message: 'Welcome back!' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, message: 'An error occurred during sign in. Please try again.' };
    }
  };

  // Sign Out Function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Delete Account Function
  const deleteAccount = async () => {
    try {
      if (!user) return;

      // Remove user from database
      const users = await getUsersDatabase();
      const updatedUsers = users.filter(u => u.id !== user.id);
      await saveUsersDatabase(updatedUsers);

      // Sign out
      await signOut();
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
