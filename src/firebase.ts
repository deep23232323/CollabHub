/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Read Firebase configuration from Vite environment variables with fallback
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyBTZeZsebn_1Je6z0wDh7cEyyXx6cbUf78',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'sadikai-d6edc.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'sadikai-d6edc',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'sadikai-d6edc.firebasestorage.app',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '737352745469',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:737352745469:web:f3c56c70ab11162bdd9994',
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || 'G-CCHX53BXWY'
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Custom Google Sign In function returning ID token and user info with iframe safety fallback
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    return {
      user,
      idToken,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid
    };
    console.log("user", user)
  } catch (error: any) {
    console.error('Firebase Google Sign-In failed:', error.code, error.message);
    // Let the caller handle this properly instead of faking a successful login
    throw error;
  }
};

export const logoutFirebase = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out from Firebase:', error);
  }
};

export { app, auth };
