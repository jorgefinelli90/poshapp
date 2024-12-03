import React, { createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      return await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmailAndPassword,
      signUpWithEmailAndPassword,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};