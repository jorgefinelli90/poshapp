import { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  // Add any additional user properties here
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}