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

// Mock user for development mode
const createMockUser = (): User => {
  return {
    uid: 'mock-uid-123',
    email: 'kamil@texonica.com',
    displayName: 'Kamil (Dev Mode)',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token' } as any),
    reload: async () => {},
    toJSON: () => ({}),
    providerId: 'google.com',
    photoURL: null,
    phoneNumber: null
  } as User;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in dev bypass mode
    const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
    
    if (isDevBypass) {
      // Use mock user in dev bypass mode
      const mockUser = createMockUser();
      setUser(mockUser);
      setUserRole(getUserRole(mockUser));
      setLoading(false);
      return () => {};
    } else {
      // Use normal Firebase auth in production
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setUserRole(user ? getUserRole(user) : null);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, []);

  const isAuthenticated = !!user;
  const isAuthorized = user ? isAllowedUser(user) : false;

  const handleSignIn = async () => {
    // If in dev bypass mode, just set the mock user
    if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true') {
      const mockUser = createMockUser();
      setUser(mockUser);
      setUserRole(getUserRole(mockUser));
      return;
    }
    
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      // If in dev bypass mode, just clear the user
      if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true') {
        setUser(null);
        setUserRole(null);
        return;
      }
      
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