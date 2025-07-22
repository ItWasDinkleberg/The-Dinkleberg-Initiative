import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, COLLECTIONS } from '../config/firebase';
import { generateId } from '../utils';

class FirebaseDataService {
  // =============== TRAILS ===============

  // Save trail data
  async saveTrail(userId, trailData) {
    try {
      const trail = {
        ...trailData,
        id: trailData.id || generateId(),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: trailData.isPublic || false,
        likes: 0,
        downloads: 0,
        difficulty: trailData.difficulty || 'moderate',
        estimatedTime: trailData.estimatedTime || '',
        tags: trailData.tags || []
      };

      await setDoc(doc(db, COLLECTIONS.TRAILS, trail.id), trail);

      // Update user stats
      await this.updateUserStats(userId, { trailsCreated: increment(1) });

      return trail;
    } catch (error) {
      console.error('Save trail error:', error);
      throw error;
    }
  }

  // Get user's trails
  async getUserTrails(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.TRAILS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get user trails error:', error);
      return [];
    }
  }

  // Get public trails
  async getPublicTrails(limitCount = 20) {
    try {
      const q = query(
        collection(db, COLLECTIONS.TRAILS),
        where('isPublic', '==', true),
        orderBy('likes', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get public trails error:', error);
      return [];
    }
  }

  // Delete trail
  async deleteTrail(trailId, userId) {
    try {
      const trailDoc = await getDoc(doc(db, COLLECTIONS.TRAILS, trailId));
      if (trailDoc.exists() && trailDoc.data().userId === userId) {
        await deleteDoc(doc(db, COLLECTIONS.TRAILS, trailId));
        return true;
      }
      throw new Error('Trail not found or unauthorized');
    } catch (error) {
      console.error('Delete trail error:', error);
      throw error;
    }
  }

  // =============== MARKERS ===============

  // Save marker
  async saveMarker(userId, markerData) {
    try {
      const marker = {
        ...markerData,
        id: markerData.id || generateId(),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: markerData.isPublic || false
      };

      await setDoc(doc(db, COLLECTIONS.MARKERS, marker.id), marker);
      return marker;
    } catch (error) {
      console.error('Save marker error:', error);
      throw error;
    }
  }

  // Get user's markers
  async getUserMarkers(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.MARKERS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get user markers error:', error);
      return [];
    }
  }

  // =============== FORUM POSTS ===============

  // Create forum post
  async createForumPost(userId, postData) {
    try {
      const post = {
        ...postData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        replies: 0,
        views: 0,
        isResolved: false,
        tags: postData.tags || [],
        category: postData.category || 'general'
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.FORUM_POSTS), post);
      
      // Update user stats
      await this.updateUserStats(userId, { forumPosts: increment(1) });

      return { id: docRef.id, ...post };
    } catch (error) {
      console.error('Create forum post error:', error);
      throw error;
    }
  }

  // Get forum posts
  async getForumPosts(category = null, limitCount = 20) {
    try {
      let q;
      if (category && category !== 'All') {
        q = query(
          collection(db, COLLECTIONS.FORUM_POSTS),
          where('category', '==', category.toLowerCase()),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          collection(db, COLLECTIONS.FORUM_POSTS),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get forum posts error:', error);
      return [];
    }
  }

  // Listen to forum posts (real-time)
  subscribeToForumPosts(callback, category = null) {
    try {
      let q;
      if (category && category !== 'All') {
        q = query(
          collection(db, COLLECTIONS.FORUM_POSTS),
          where('category', '==', category.toLowerCase()),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } else {
        q = query(
          collection(db, COLLECTIONS.FORUM_POSTS),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      }

      return onSnapshot(q, (querySnapshot) => {
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(posts);
      });
    } catch (error) {
      console.error('Subscribe to forum posts error:', error);
      return () => {};
    }
  }

  // =============== PLANT IDENTIFICATIONS ===============

  // Save plant identification
  async savePlantIdentification(userId, identificationData) {
    try {
      const identification = {
        ...identificationData,
        userId,
        createdAt: serverTimestamp(),
        confidence: identificationData.confidence || 0,
        verified: false,
        location: identificationData.location || null,
        imageUrl: identificationData.imageUrl || null
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.PLANT_IDS), identification);
      
      // Update user stats
      await this.updateUserStats(userId, { plantsIdentified: increment(1) });

      return { id: docRef.id, ...identification };
    } catch (error) {
      console.error('Save plant identification error:', error);
      throw error;
    }
  }

  // Get user's plant identifications
  async getUserPlantIdentifications(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PLANT_IDS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get user plant identifications error:', error);
      return [];
    }
  }

  // =============== TRIP PLANS ===============

  // Save trip plan
  async saveTripPlan(userId, planData) {
    try {
      const plan = {
        ...planData,
        id: planData.id || generateId(),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isShared: planData.isShared || false
      };

      await setDoc(doc(db, COLLECTIONS.TRIP_PLANS, plan.id), plan);
      return plan;
    } catch (error) {
      console.error('Save trip plan error:', error);
      throw error;
    }
  }

  // Get user's trip plans
  async getUserTripPlans(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.TRIP_PLANS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get user trip plans error:', error);
      return [];
    }
  }

  // =============== AI CONVERSATIONS ===============

  // Save AI conversation
  async saveAIConversation(userId, conversationData) {
    try {
      const conversation = {
        ...conversationData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.AI_CONVERSATIONS), conversation);
      return { id: docRef.id, ...conversation };
    } catch (error) {
      console.error('Save AI conversation error:', error);
      throw error;
    }
  }

  // =============== FILE UPLOADS ===============

  // Upload image to Firebase Storage
  async uploadImage(file, path, userId) {
    try {
      const fileName = `${generateId()}_${file.name || 'image.jpg'}`;
      const fullPath = `${path}/${userId}/${fileName}`;
      const storageRef = ref(storage, fullPath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: fullPath,
        fileName
      };
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  // Delete image from Firebase Storage
  async deleteImage(imagePath) {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }

  // =============== USER STATS ===============

  // Update user statistics
  async updateUserStats(userId, updates) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        'stats': updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Update user stats error:', error);
    }
  }

  // =============== NOTIFICATIONS ===============

  // Create notification
  async createNotification(userId, notificationData) {
    try {
      const notification = {
        ...notificationData,
        userId,
        createdAt: serverTimestamp(),
        read: false,
        type: notificationData.type || 'info'
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), notification);
      return { id: docRef.id, ...notification };
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get user notifications error:', error);
      return [];
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
    }
  }

  // =============== REAL-TIME LISTENERS ===============

  // Subscribe to user's data changes
  subscribeToUserData(userId, callback) {
    const unsubscribe = onSnapshot(doc(db, COLLECTIONS.USERS, userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
    return unsubscribe;
  }

  // Batch operations for offline sync
  async syncOfflineData(userId, offlineData) {
    try {
      const results = {
        trails: [],
        markers: [],
        plans: [],
        errors: []
      };

      // Sync trails
      if (offlineData.trails) {
        for (const trail of offlineData.trails) {
          try {
            const savedTrail = await this.saveTrail(userId, trail);
            results.trails.push(savedTrail);
          } catch (error) {
            results.errors.push({ type: 'trail', data: trail, error: error.message });
          }
        }
      }

      // Sync markers
      if (offlineData.markers) {
        for (const marker of offlineData.markers) {
          try {
            const savedMarker = await this.saveMarker(userId, marker);
            results.markers.push(savedMarker);
          } catch (error) {
            results.errors.push({ type: 'marker', data: marker, error: error.message });
          }
        }
      }

      // Sync plans
      if (offlineData.plans) {
        for (const plan of offlineData.plans) {
          try {
            const savedPlan = await this.saveTripPlan(userId, plan);
            results.plans.push(savedPlan);
          } catch (error) {
            results.errors.push({ type: 'plan', data: plan, error: error.message });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Sync offline data error:', error);
      throw error;
    }
  }
}

export const firebaseDataService = new FirebaseDataService();
export default firebaseDataService;
