import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  WelcomeScreen, 
  LoginScreen, 
  SignupScreen 
} from '../screens';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ showOnboarding, onAuthSuccess, onOnboardingComplete }) => {
  const handleLogin = (credentials) => {
    console.log('Login with:', credentials);
    // In a real app, you would validate credentials with your backend
    onAuthSuccess(credentials);
  };

  const handleSignup = (userData) => {
    console.log('Signup with:', userData);
    // In a real app, you would create user account with your backend
    onAuthSuccess(userData);
  };

  const handleGetStarted = (navigation) => {
    onOnboardingComplete();
    navigation.navigate('Login');
  };

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={showOnboarding ? "Welcome" : "Login"}
    >
      <Stack.Screen name="Welcome">
        {(props) => (
          <WelcomeScreen 
            {...props} 
            onGetStarted={() => handleGetStarted(props.navigation)}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onLogin={handleLogin}
            onNavigateToSignup={() => props.navigation.navigate('Signup')}
            onBack={() => props.navigation.navigate('Welcome')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            onSignup={handleSignup}
            onNavigateToLogin={() => props.navigation.navigate('Login')}
            onBack={() => props.navigation.navigate('Welcome')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
