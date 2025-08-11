import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Swal from 'sweetalert2';

export const authService = {
  // Sign up with email and password
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Send email verification with root domain to avoid Vercel 404 issues
      const continueUrl = window.location.origin;
      await sendEmailVerification(user, { url: continueUrl });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      });
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          isEmailVerified: false
        }
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData?.displayName || user.displayName,
          isEmailVerified: user.emailVerified
        }
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send password reset email
  async forgotPassword(email) {
    try {
      // Use root domain for continueUrl to avoid Vercel 404 issues
      const continueUrl = window.location.origin;
      await sendPasswordResetEmail(auth, email, { url: continueUrl });
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send email verification
  async sendEmailVerification() {
    try {
      const user = auth.currentUser;
      if (user) {
        // Use root domain for continueUrl to avoid Vercel 404 issues
        const continueUrl = window.location.origin;
        await sendEmailVerification(user, { url: continueUrl });
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check if user is authenticated
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}; 