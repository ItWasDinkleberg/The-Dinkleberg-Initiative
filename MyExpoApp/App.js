import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens';
import { globalStyles } from './src/styles/globalStyles';

export default function App() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <HomeScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
