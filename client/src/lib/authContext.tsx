import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  auth, 
  googleProvider, 
  registerWithEmail as firebaseRegister,
  loginWithEmail as firebaseLogin,
  logoutUser as firebaseLogout,
  getUserData as getFirebaseUserData,
  db
} from './firebase';
import { 
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';

// Define user interface
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isCreator: false,
  isAuthenticated: false,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userData = await getFirebaseUserData(firebaseUser.uid);
          
          // Set user profile
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData?.displayName || null,
            photoURL: firebaseUser.photoURL || null,
            role: userData?.role || 'user',
            createdAt: userData?.createdAt
          });
          
          // If user data doesn't exist in Firestore yet, create it
          if (!userData) {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              createdAt: new Date().toISOString(),
              role: "user"
            });
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
          
          // Still set basic user info even if Firestore fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email & password
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseLogin(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to PrintCreator Marketplace!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login. Please check your credentials.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore if this is their first login
      const userData = await getFirebaseUserData(user.uid);
      if (!userData) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          role: "user"
        });
      }
      
      toast({
        title: "Google login successful",
        description: "Welcome to PrintCreator Marketplace!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message || "Failed to login with Google.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email & password
  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const user = await firebaseRegister(email, password, name);
      
      // Update profile with display name if needed
      if (!user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create your account. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await firebaseLogout();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Failed to logout. Please try again.",
      });
      throw error;
    }
  };

  // Check if current user is admin or creator
  const isAdmin = user?.role === 'admin';
  const isCreator = user?.role === 'creator';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user,
      isLoading: loading, 
      isAdmin, 
      isCreator, 
      isAuthenticated, 
      loginWithEmail, 
      loginWithGoogle,
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
