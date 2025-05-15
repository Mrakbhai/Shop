import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "1234567890", // This is not used in our current implementation
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage service
export const storage = getStorage(app);

// Firestore service
export const db = getFirestore(app);

// Firebase Auth helper functions
export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with displayName
    await updateProfile(user, { displayName });
    
    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      createdAt: new Date().toISOString(),
      role: "user"
    });
    
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    let errorMessage = "An error occurred during registration.";
    
    if (errorCode === 'auth/email-already-in-use') {
      errorMessage = "This email is already in use.";
    } else if (errorCode === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters.";
    } else if (errorCode === 'auth/invalid-email') {
      errorMessage = "Invalid email address format.";
    }
    
    throw new Error(errorMessage);
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    const errorCode = error.code;
    let errorMessage = "Failed to login. Please check your credentials.";
    
    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      errorMessage = "Invalid email or password.";
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = "Too many unsuccessful login attempts. Please try again later.";
    }
    
    throw new Error(errorMessage);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to logout. Please try again.");
  }
};

export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export default app;