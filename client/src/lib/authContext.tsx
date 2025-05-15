import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@shared/schema';
import { auth, googleProvider } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { apiRequest } from './queryClient';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (email: string, password: string, username: string) => Promise<User>;
  logout: () => Promise<void>;
  applyForCreator: (application: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isLoading: true,
  isAdmin: false,
  isCreator: false,
  isAuthenticated: false,
  loginWithEmail: async () => { throw new Error('Not implemented') },
  loginWithGoogle: async () => { throw new Error('Not implemented') },
  register: async () => { throw new Error('Not implemented') },
  logout: async () => {},
  applyForCreator: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch or create user profile when Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Get user profile from API
        try {
          const userProfile = await apiRequest('GET', `/api/users/${firebaseUser.uid}`);
          if (userProfile.ok) {
            const userData = await userProfile.json();
            setUser(userData);
          } else {
            // Create new user profile if not found
            const defaultUser = {
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`,
              role: UserRole.USER,
              displayName: firebaseUser.displayName || '',
              avatar: firebaseUser.photoURL || ''
            };
            
            const newUser = await apiRequest('POST', '/api/users', defaultUser);
            const userData = await newUser.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check if current user is admin or creator
  const isAdmin = user?.role === UserRole.ADMIN;
  const isCreator = user?.role === UserRole.CREATOR;
  const isAuthenticated = !!user;

  // Firebase login with email & password
  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await apiRequest('GET', `/api/users/${userCredential.user.uid}`);
      const user = await userData.json();
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  // Firebase login with Google
  const loginWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await apiRequest('GET', `/api/users/${result.user.uid}`);
      const user = await userData.json();
      return user;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };

  // Register with email & password
  const register = async (email: string, password: string, username: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in our database
      const newUser = {
        firebaseUid: userCredential.user.uid,
        email,
        username,
        role: UserRole.USER,
        displayName: username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      };
      
      const userData = await apiRequest('POST', '/api/users', newUser);
      const user = await userData.json();
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      // Clear user data from cache
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  };

  // Apply for creator status
  const applyForCreator = async (application: any): Promise<void> => {
    if (!user) throw new Error('You must be logged in to apply');
    
    try {
      await apiRequest('POST', '/api/creator/apply', { 
        ...application,
        userId: user.id
      });
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    } catch (error: any) {
      console.error('Creator application error:', error);
      throw new Error(error.message || 'Failed to submit application');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      isLoading: loading, 
      isAdmin, 
      isCreator, 
      isAuthenticated, 
      loginWithEmail, 
      loginWithGoogle,
      register, 
      logout,
      applyForCreator
    }}>
      {children}
    </AuthContext.Provider>
  );
};
