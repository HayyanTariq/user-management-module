export { default as AuthSystem } from './components/AuthSystem';
export { default as LoginPage } from './components/LoginPage';
export {  SignupPage } from './components/SignupPage';

// Context
export { AuthContext } from './context/AuthContext';
export { AuthProvider } from './context/AuthContext';

// Hooks
export { useAuth } from './hooks/useAuth';

// Types
export type { User, AuthContextType, AuthConfig } from './context/AuthTypes';

// Services (if needed for advanced usage)
export { TokenManager } from './services/TokenManager';
export { AuthApiClient } from './services/AuthApiClient';