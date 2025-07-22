import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../config/firebase';

class FirebaseAuthService {
  constructor() {
    this.user = null;
    this.unsubscribe = null;
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    this.unsubscribe = onAuthStateChanged(auth, async (user) => {
      this.user = user;
      if (user) {
        // Load user profile data from Firestore
        const userProfile = await this.getUserProfile(user.uid);
        callback({ ...user, profile: userProfile });
      } else {
        callback(null);
      }
    });
    return this.unsubscribe;
  }

  // Sign up new user
  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user document in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: `${userData.firstName} ${userData.lastName}`,
        photoURL: user.photoURL || null,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        preferences: {
          notifications: true,
          shareLocation: false,
          publicProfile: true,
          experienceLevel: 'beginner'
        },
        stats: {
          trailsHiked: 0,
          plantsIdentified: 0,
          forumPosts: 0,
          totalDistance: 0,
          badgesEarned: []
        }
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);

      return { user, profile: userProfile };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last active timestamp
      await this.updateUserActivity(user.uid);

      const userProfile = await this.getUserProfile(user.uid);
      return { user, profile: userProfile };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out user
  async signOut() {
    try {
      if (this.user) {
        await this.updateUserActivity(this.user.uid, { isOnline: false });
      }
      await signOut(auth);
      this.user = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
        ...updates,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Update user activity
  async updateUserActivity(uid, activity = {}) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
        lastActiveAt: new Date(),
        isOnline: true,
        ...activity
      });
    } catch (error) {
      console.error('Update activity error:', error);
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Handle Firebase Auth errors
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('This email address is already registered. Please sign in instead.');
      case 'auth/weak-password':
        return new Error('Password is too weak. Please choose a stronger password.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      case 'auth/user-not-found':
        return new Error('No account found with this email address.');
      case 'auth/wrong-password':
        return new Error('Incorrect password. Please try again.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your internet connection.');
      default:
        return new Error(error.message || 'An authentication error occurred.');
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Clean up listeners
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
