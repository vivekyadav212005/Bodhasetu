import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '../types';
import { authenticateUser } from '../utils/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('bodhasetu_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user
        }));
      } catch (error) {
        localStorage.removeItem('bodhasetu_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await authenticateUser(credentials.email, credentials.password, credentials.name);
      
      // Store user in localStorage
      localStorage.setItem('bodhasetu_user', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('bodhasetu_user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};