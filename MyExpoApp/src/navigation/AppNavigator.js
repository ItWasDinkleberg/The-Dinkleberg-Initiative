import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import MainStackNavigator from './MainStackNavigator';
import { SplashScreen } from '../screens';
import { useAuth } from '../hooks/useFirebase';
import { firebaseMessagingService } from '../services/firebaseMessaging';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
    // Show splash screen for at least 2 seconds
    setTimeout(() => {
      setSplashVisible(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Initialize messaging when user is authenticated
    if (user) {
      firebaseMessagingService.initializePushNotifications(user.uid);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setShowOnboarding(!hasSeenOnboarding);
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.log('Error storing onboarding status:', error);
      setShowOnboarding(false);
    }
  };

  // Show splash screen while loading or during initial splash duration
  if (loading || splashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main">
            {(props) => <MainStackNavigator {...props} user={user} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthNavigator
                {...props}
                showOnboarding={showOnboarding}
                onOnboardingComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
