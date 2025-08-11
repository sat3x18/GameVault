import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple admin credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(true);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // First check local credentials
    if (username === 'admin' && password === ADMIN_CREDENTIALS.password) {
      try {
        // First try to sign up the user if they don't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });
        
        // Ignore error if user already exists
        if (signUpError && !signUpError.message.includes('already registered')) {
          console.error('Sign up error:', signUpError);
        }

        // Sign in with Supabase using the admin email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });

        if (error) {
          console.error('Supabase auth error:', error);
          return false;
        }

        if (data.session) {
          setIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};