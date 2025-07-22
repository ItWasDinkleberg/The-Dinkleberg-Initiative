import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "trail-guardian-app.firebaseapp.com",
  projectId: "trail-guardian-app",
  storageBucket: "trail-guardian-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging (Web only)
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}
export { messaging };

// Firebase collections
export const COLLECTIONS = {
  USERS: 'users',
  TRAILS: 'trails',
  MARKERS: 'markers',
  FORUM_POSTS: 'forumPosts',
  PLANT_IDS: 'plantIdentifications',
  TRIP_PLANS: 'tripPlans',
  AI_CONVERSATIONS: 'aiConversations',
  NOTIFICATIONS: 'notifications',
  USER_ACTIVITIES: 'userActivities'
};

// Development mode configuration
const isDevelopment = __DEV__;
if (isDevelopment) {
  // Connect to Firestore emulator in development
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
