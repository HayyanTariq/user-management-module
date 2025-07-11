// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContextType } from '../context/AuthTypes';
import { AuthContext } from '../context/AuthContext';


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};