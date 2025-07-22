# Firebase Setup for Trail Guardian App

## Prerequisites

1. **Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "Trail Guardian"
   - Enable Google Analytics (optional)

2. **Firebase Services Configuration**
   
   ### Authentication
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Configure authorized domains for production

   ### Cloud Firestore
   - Go to Firestore Database > Create database
   - Start in test mode for development
   - Choose a location close to your users

   ### Cloud Storage
   - Go to Storage > Get started
   - Start in test mode for development
   - This will store user uploaded images

   ### Cloud Messaging (FCM)
   - Go to Project Settings > Cloud Messaging
   - Generate a new web app and copy the config
   - For web notifications, generate a VAPID key

## Configuration Steps

### 1. Update Firebase Config

Replace the config in `src/config/firebase.js` with your actual Firebase project config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 2. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Trail and marker rules
    match /trails/{trailId} {
      allow read: if resource.data.isPublic == true || 
        (request.auth != null && request.auth.uid == resource.data.userId);
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /markers/{markerId} {
      allow read: if resource.data.isPublic == true || 
        (request.auth != null && request.auth.uid == resource.data.userId);
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Forum posts are readable by all authenticated users
    match /forumPosts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Plant identifications
    match /plantIdentifications/{identificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Trip plans
    match /tripPlans/{planId} {
      allow read: if resource.data.isShared == true || 
        (request.auth != null && request.auth.uid == resource.data.userId);
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // AI conversations
    match /aiConversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Storage Security Rules

Set up the following security rules in Cloud Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Cloud Functions (Optional)

For advanced features like push notifications, you may want to deploy Cloud Functions:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Send notification when a new forum post is created
exports.notifyNewForumPost = functions.firestore
    .document('forumPosts/{postId}')
    .onCreate(async (snap, context) => {
      const postData = snap.data();
      
      // Send notification to subscribed users
      const message = {
        notification: {
          title: 'New Trail Forum Post',
          body: `${postData.title} in ${postData.category}`
        },
        topic: 'forum_updates'
      };
      
      return admin.messaging().send(message);
    });

// Clean up old notifications
exports.cleanupOldNotifications = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
      const db = admin.firestore();
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const oldNotifications = await db.collection('notifications')
        .where('createdAt', '<', oneWeekAgo)
        .get();
      
      const batch = db.batch();
      oldNotifications.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      return batch.commit();
    });
```

## Data Models

### User Document
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  photoURL: "https://...",
  createdAt: Timestamp,
  lastActiveAt: Timestamp,
  preferences: {
    notifications: true,
    shareLocation: false,
    publicProfile: true,
    experienceLevel: "beginner" | "intermediate" | "advanced"
  },
  stats: {
    trailsHiked: 0,
    plantsIdentified: 0,
    forumPosts: 0,
    totalDistance: 0,
    badgesEarned: []
  },
  fcmTokens: ["token1", "token2"],
  subscribedTopics: ["emergency_alerts", "trail_updates"]
}
```

### Trail Document
```javascript
{
  id: "trail-id",
  userId: "user-id",
  name: "Mountain Loop Trail",
  description: "Scenic trail with great views",
  coordinates: [
    { latitude: 45.5017, longitude: -122.6750 },
    { latitude: 45.5027, longitude: -122.6760 }
  ],
  distance: 5.2,
  difficulty: "moderate",
  estimatedTime: "2-3 hours",
  isPublic: false,
  likes: 0,
  downloads: 0,
  tags: ["scenic", "moderate", "loop"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Marker Document
```javascript
{
  id: "marker-id",
  userId: "user-id",
  coordinate: { latitude: 45.5017, longitude: -122.6750 },
  title: "Scenic Viewpoint",
  description: "Great mountain views",
  type: "viewpoint",
  isPublic: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Forum Post Document
```javascript
{
  id: "post-id",
  userId: "user-id",
  title: "Trail conditions update",
  content: "The trail is muddy after recent rains...",
  category: "trail reports",
  tags: ["muddy", "weather", "conditions"],
  likes: 0,
  replies: 0,
  views: 0,
  isResolved: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Plant Identification Document
```javascript
{
  id: "identification-id",
  userId: "user-id",
  type: "plant",
  species: "Mountain Laurel",
  confidence: 89,
  description: "Evergreen shrub with pink flowers",
  imageUrl: "https://storage.googleapis.com/...",
  location: { latitude: 45.5017, longitude: -122.6750 },
  identifiedAt: Timestamp,
  verified: false,
  additionalData: {
    isEdible: false,
    isToxic: true,
    allResults: [...]
  }
}
```

## Testing

1. **Firestore Emulator** (Optional for development):
   ```bash
   npm install -g firebase-tools
   firebase init emulators
   firebase emulators:start
   ```
   Uncomment the emulator connection in `firebase.js`

2. **Test Authentication**:
   - Create test accounts
   - Verify user documents are created
   - Test sign in/out functionality

3. **Test Data Operations**:
   - Save trails, markers, and forum posts
   - Verify real-time updates
   - Test offline sync functionality

## Production Deployment

1. **Security Rules**: Switch from test mode to production rules
2. **API Keys**: Secure your API keys and configure authorized domains
3. **Budget Alerts**: Set up billing alerts in Google Cloud Console
4. **Monitoring**: Enable Firebase Performance Monitoring
5. **Backup**: Set up automated Firestore backups

## Cost Optimization

- Use Firestore compound indexes for efficient queries
- Implement pagination for large datasets
- Optimize image uploads with compression
- Use Storage lifecycle rules to delete old files
- Monitor usage in Firebase Console

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Check Firestore security rules
2. **CORS Errors**: Add your domain to authorized domains
3. **Storage Upload Fails**: Verify Storage security rules
4. **Real-time Updates Not Working**: Check network connection and listeners

### Debug Tools:
- Firebase Console logs
- Browser Developer Tools
- React Native Debugger
- Flipper for React Native debugging
