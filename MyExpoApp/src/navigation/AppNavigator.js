import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { SplashScreen } from '../screens';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // Check if user is authenticated
      const userToken = await AsyncStorage.getItem('userToken');
      
      setShowOnboarding(!hasSeenOnboarding);
      setIsAuthenticated(!!userToken);
      
      // Simulate splash screen duration
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (userData) => {
    try {
      // Store user token and data
      await AsyncStorage.setItem('userToken', 'user_authenticated');
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error storing auth data:', error);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setIsAuthenticated(false);
      setShowOnboarding(true);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs">
            {(props) => <TabNavigator {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthNavigator
                {...props}
                showOnboarding={showOnboarding}
                onAuthSuccess={handleAuthSuccess}
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
