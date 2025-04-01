// Firebase configuration for authentication
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';

// Your Firebase configuration
// This should be in environment variables in production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure provider to allow only texonica.com domain
googleProvider.setCustomParameters({
  hd: 'texonica.com'
});

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider);
};

// Sign out
export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth);
};

// Check if user email is allowed (currently only kamil@texonica.com)
export const isAllowedUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // In development mode, bypass the check if environment variable is set
  if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true') {
    return true;
  }
  
  // Currently only allow kamil@texonica.com
  return user.email === 'kamil@texonica.com';
};

// User roles
export enum UserRole {
  ADMIN = 'admin',
  SALES_MANAGER = 'sales_manager',
  PM = 'pm',
  VA = 'va',
}

// Get user role (hardcoded for now)
export const getUserRole = (user: User | null): UserRole | null => {
  if (!user) return null;
  
  // Assign admin role to kamil@texonica.com
  if (user.email === 'kamil@texonica.com') {
    return UserRole.ADMIN;
  }
  
  // Add other role assignments here when needed
  // For now, all other texonica users would be VA by default
  if (user.email?.endsWith('@texonica.com')) {
    return UserRole.VA;
  }
  
  return null;
};

export { auth, onAuthStateChanged };
export type { User }; 