import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { 
  HomeScreen, 
  SplashScreen, 
  WelcomeScreen, 
  LoginScreen, 
  SignupScreen 
} from './src/screens';
import { globalStyles } from './src/styles/globalStyles';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSplashFinish = () => {
    setCurrentScreen('welcome');
  };

  const handleGetStarted = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (credentials) => {
    console.log('Login with:', credentials);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleSignup = (userData) => {
    console.log('Signup with:', userData);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleNavigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={handleNavigateToSignup}
            onBack={handleBackToWelcome}
          />
        );
      
      case 'signup':
        return (
          <SignupScreen
            onSignup={handleSignup}
            onNavigateToLogin={handleNavigateToLogin}
            onBack={handleBackToWelcome}
          />
        );
      
      case 'home':
      default:
        return (
          <SafeAreaView style={globalStyles.container}>
            <HomeScreen />
          </SafeAreaView>
        );
    }
  };

  const getStatusBarStyle = () => {
    switch (currentScreen) {
      case 'splash':
      case 'welcome':
        return 'light';
      default:
        return 'auto';
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style={getStatusBarStyle()} />
    </>
  );
}
