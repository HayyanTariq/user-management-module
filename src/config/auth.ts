// config/auth.ts
import { AuthConfig } from '../context/AuthTypes';

export const authConfig: AuthConfig = {
  baseURL: 'http://your-backend-url.com/api',
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    user: '/auth/user',
    googleSignIn: '/auth/google',
    delete: '/auth/delete'
  },
  onAuthStateChange: (user) => {
    console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
    // You can add navigation logic here if needed
  },
  onTokenExpired: async () => {
    console.log('Token expired - redirecting to login');
    // Add logic to redirect to login screen
  }
};