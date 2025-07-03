// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  password: string
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}
