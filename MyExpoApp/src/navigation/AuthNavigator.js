import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  WelcomeScreen, 
  LoginScreen, 
  SignupScreen 
} from '../screens';
import { useAuth } from '../hooks/useFirebase';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ showOnboarding, onOnboardingComplete }) => {
  const { signIn, signUp } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await signIn(credentials.email, credentials.password);
      // Navigation will be handled automatically by useAuth hook
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Let the screen handle the error display
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signUp(userData.email, userData.password, {
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      // Navigation will be handled automatically by useAuth hook
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Let the screen handle the error display
    }
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
