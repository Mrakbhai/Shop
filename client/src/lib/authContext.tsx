import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, loginWithEmail, loginWithGoogle, registerWithEmail, logoutUser, resetUserPassword } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLoginWithEmail = async (email: string, password: string) => {
    try {
      const user = await loginWithEmail(email, password);
      setUser(user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
      throw error;
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      setUser(user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message
      });
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const user = await registerWithEmail(email, password, name);
      setUser(user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message
      });
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetUserPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginWithEmail,
      loginWithGoogle,
      register,
      logout,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};