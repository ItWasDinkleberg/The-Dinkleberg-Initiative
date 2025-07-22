import { useState, useEffect, useRef } from 'react';
import { firebaseAuthService } from '../services/firebaseAuth';
import { firebaseDataService } from '../services/firebaseData';
import { firebaseMessagingService } from '../services/firebaseMessaging';

// Custom hook for Firebase authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    
    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await firebaseAuthService.signIn(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setError(null);
      const result = await firebaseAuthService.signUp(email, password, userData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseAuthService.signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
};

// Custom hook for forum posts with real-time updates
export const useForumPosts = (category = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = firebaseDataService.subscribeToForumPosts((newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    }, category);
    
    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [category]);

  const createPost = async (postData) => {
    try {
      setError(null);
      const user = firebaseAuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      const newPost = await firebaseDataService.createForumPost(user.uid, postData);
      return newPost;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost
  };
};

// Custom hook for user's trails
export const useUserTrails = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadTrails();
    } else {
      setTrails([]);
      setLoading(false);
    }
  }, [user]);

  const loadTrails = async () => {
    try {
      setLoading(true);
      const userTrails = await firebaseDataService.getUserTrails(user.uid);
      setTrails(userTrails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveTrail = async (trailData) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');
      
      const savedTrail = await firebaseDataService.saveTrail(user.uid, trailData);
      setTrails(prev => [savedTrail, ...prev]);
      return savedTrail;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteTrail = async (trailId) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');
      
      await firebaseDataService.deleteTrail(trailId, user.uid);
      setTrails(prev => prev.filter(trail => trail.id !== trailId));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    trails,
    loading,
    error,
    saveTrail,
    deleteTrail,
    refreshTrails: loadTrails
  };
};

// Custom hook for user's markers
export const useUserMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadMarkers();
    } else {
      setMarkers([]);
      setLoading(false);
    }
  }, [user]);

  const loadMarkers = async () => {
    try {
      setLoading(true);
      const userMarkers = await firebaseDataService.getUserMarkers(user.uid);
      setMarkers(userMarkers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveMarker = async (markerData) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');
      
      const savedMarker = await firebaseDataService.saveMarker(user.uid, markerData);
      setMarkers(prev => [savedMarker, ...prev]);
      return savedMarker;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    markers,
    loading,
    error,
    saveMarker,
    refreshMarkers: loadMarkers
  };
};

// Custom hook for trip plans
export const useTripPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadPlans();
    } else {
      setPlans([]);
      setLoading(false);
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const userPlans = await firebaseDataService.getUserTripPlans(user.uid);
      setPlans(userPlans);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async (planData) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');
      
      const savedPlan = await firebaseDataService.saveTripPlan(user.uid, planData);
      setPlans(prev => {
        const existingIndex = prev.findIndex(p => p.id === savedPlan.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = savedPlan;
          return updated;
        } else {
          return [savedPlan, ...prev];
        }
      });
      return savedPlan;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    plans,
    loading,
    error,
    savePlan,
    refreshPlans: loadPlans
  };
};

// Custom hook for plant identifications
export const usePlantIdentifications = () => {
  const [identifications, setIdentifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadIdentifications();
    } else {
      setIdentifications([]);
      setLoading(false);
    }
  }, [user]);

  const loadIdentifications = async () => {
    try {
      setLoading(true);
      const userIds = await firebaseDataService.getUserPlantIdentifications(user.uid);
      setIdentifications(userIds);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveIdentification = async (identificationData) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');
      
      const saved = await firebaseDataService.savePlantIdentification(user.uid, identificationData);
      setIdentifications(prev => [saved, ...prev]);
      return saved;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    identifications,
    loading,
    error,
    saveIdentification,
    refreshIdentifications: loadIdentifications
  };
};

// Custom hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Initialize push notifications
      firebaseMessagingService.initializePushNotifications(user.uid);
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userNotifications = await firebaseDataService.getUserNotifications(user.uid);
      setNotifications(userNotifications);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await firebaseDataService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refreshNotifications: loadNotifications
  };
};

// Custom hook for offline data sync
export const useOfflineSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  const user = firebaseAuthService.getCurrentUser();

  const syncOfflineData = async (offlineData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setSyncing(true);
      setError(null);
      
      const results = await firebaseDataService.syncOfflineData(user.uid, offlineData);
      setLastSync(new Date());
      
      return results;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  return {
    syncing,
    lastSync,
    error,
    syncOfflineData
  };
};
