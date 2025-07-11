export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<{ success: boolean; message: string }>;
}

export interface AuthConfig {
  baseURL: string;
  endpoints: {
    login: string;
    signup: string;
    logout: string;
    refresh: string;
    user: string;
    googleSignIn?: string;
    delete: string
  };
  tokenStorageKey?: string;
  refreshTokenStorageKey?: string;
  onAuthStateChange?: (user: User | null) => void;
  onTokenExpired?: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}