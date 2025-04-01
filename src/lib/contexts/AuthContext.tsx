'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle, 
  signOut, 
  isAllowedUser, 
  getUserRole,
  UserRole,
  User
} from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isAuthorized: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserRole(user ? getUserRole(user) : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;
  const isAuthorized = user ? isAllowedUser(user) : false;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value = {
    user,
    userRole,
    isAuthorized,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 