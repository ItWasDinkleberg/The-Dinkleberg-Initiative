import { 
  getToken, 
  onMessage, 
  deleteToken 
} from 'firebase/messaging';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { messaging, db, COLLECTIONS } from '../config/firebase';

class FirebaseMessagingService {
  constructor() {
    this.token = null;
    this.unsubscribeFromMessages = null;
  }

  // Initialize push notifications
  async initializePushNotifications(userId) {
    try {
      // Check if messaging is supported (Web only for now)
      if (!messaging) {
        console.log('Firebase Messaging not supported on this platform');
        return null;
      }

      // Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your VAPID key
        });
        
        if (token) {
          console.log('FCM Token:', token);
          this.token = token;
          
          // Save token to user's document
          await this.saveTokenToDatabase(userId, token);
          
          // Listen for messages
          this.listenForMessages();
          
          return token;
        } else {
          console.log('No registration token available.');
          return null;
        }
      } else {
        console.log('Unable to get permission to notify.');
        return null;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  // Save FCM token to user's document
  async saveTokenToDatabase(userId, token) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        fcmTokens: arrayUnion(token),
        lastTokenUpdate: new Date()
      });
      console.log('FCM token saved to database');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  // Remove FCM token from user's document
  async removeTokenFromDatabase(userId, token) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        fcmTokens: arrayRemove(token)
      });
      console.log('FCM token removed from database');
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  }

  // Listen for foreground messages
  listenForMessages() {
    if (!messaging) return;

    this.unsubscribeFromMessages = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Handle the message
      this.handleForegroundMessage(payload);
    });
  }

  // Handle foreground message
  handleForegroundMessage(payload) {
    const { notification, data } = payload;
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: data?.type || 'default',
        data: data
      };

      const notificationInstance = new Notification(notification.title, options);
      
      // Handle notification click
      notificationInstance.onclick = (event) => {
        event.preventDefault();
        this.handleNotificationClick(data);
        notificationInstance.close();
      };
    }
  }

  // Handle notification click
  handleNotificationClick(data) {
    if (data?.type) {
      switch (data.type) {
        case 'forum_post':
          // Navigate to forum post
          console.log('Navigate to forum post:', data.postId);
          break;
        case 'trail_shared':
          // Navigate to shared trail
          console.log('Navigate to trail:', data.trailId);
          break;
        case 'emergency_alert':
          // Show emergency alert
          console.log('Emergency alert:', data.message);
          break;
        case 'weather_warning':
          // Show weather warning
          console.log('Weather warning:', data.area);
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  // Send notification to specific user (server-side function call)
  async sendNotificationToUser(targetUserId, notificationData) {
    try {
      // This would typically call a Cloud Function
      // For now, we'll just create a notification document
      const notification = {
        targetUserId,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        type: notificationData.type || 'info',
        sent: false,
        createdAt: new Date()
      };

      // In a real implementation, this would trigger a Cloud Function
      // that sends the actual push notification
      console.log('Notification queued for user:', targetUserId, notification);
      
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send notification to topic (for broadcast messages)
  async sendNotificationToTopic(topic, notificationData) {
    try {
      // This would call a Cloud Function to send to a topic
      const notification = {
        topic,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        type: notificationData.type || 'broadcast',
        createdAt: new Date()
      };

      console.log('Topic notification queued:', topic, notification);
      
      return notification;
    } catch (error) {
      console.error('Error sending topic notification:', error);
      throw error;
    }
  }

  // Subscribe to topic
  async subscribeToTopic(userId, topic) {
    try {
      // This would call a Cloud Function to subscribe the user's token to a topic
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        subscribedTopics: arrayUnion(topic),
        topicsUpdated: new Date()
      });
      
      console.log(`User ${userId} subscribed to topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  // Unsubscribe from topic
  async unsubscribeFromTopic(userId, topic) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        subscribedTopics: arrayRemove(topic),
        topicsUpdated: new Date()
      });
      
      console.log(`User ${userId} unsubscribed from topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }

  // Delete FCM token
  async deleteToken(userId) {
    try {
      if (this.token) {
        await deleteToken(messaging);
        await this.removeTokenFromDatabase(userId, this.token);
        this.token = null;
        console.log('FCM token deleted');
      }
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.unsubscribeFromMessages) {
      this.unsubscribeFromMessages();
    }
  }

  // Predefined notification types for the app
  static NOTIFICATION_TYPES = {
    FORUM_POST: 'forum_post',
    FORUM_REPLY: 'forum_reply',
    TRAIL_SHARED: 'trail_shared',
    TRAIL_LIKED: 'trail_liked',
    EMERGENCY_ALERT: 'emergency_alert',
    WEATHER_WARNING: 'weather_warning',
    PLANT_VERIFIED: 'plant_verified',
    TRIP_REMINDER: 'trip_reminder',
    ACHIEVEMENT_EARNED: 'achievement_earned',
    FRIEND_REQUEST: 'friend_request',
    SYSTEM_UPDATE: 'system_update'
  };

  // Predefined topics for the app
  static TOPICS = {
    EMERGENCY_ALERTS: 'emergency_alerts',
    WEATHER_WARNINGS: 'weather_warnings',
    TRAIL_UPDATES: 'trail_updates',
    APP_UPDATES: 'app_updates',
    CONSERVATION_NEWS: 'conservation_news'
  };
}

export const firebaseMessagingService = new FirebaseMessagingService();
export default firebaseMessagingService;
