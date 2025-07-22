import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { 
  ForumScreen, 
  ScannerScreen, 
  RoutePlannerScreen, 
  AIAssistantScreen, 
  OfflineMapScreen,
  PlannerScreen,
  MapScreen
} from '../screens';
import HomeTabScreen from './HomeTabScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.WHITE,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName = getTabIcon(route.name);
          return (
            <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
              <Text style={[styles.tabIcon, { color: focused ? COLORS.WHITE : color }]}>
                {iconName}
              </Text>
            </View>
          );
        },
        tabBarButton: (props) => (
          <TouchableOpacity 
            {...props} 
            style={[props.style, styles.tabButton]}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ title: 'Home' }}
      >
        {(props) => <HomeTabScreen {...props} onLogout={handleLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Forum" 
        component={ForumScreen}
        options={{ title: 'Forum' }}
      />
      
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Scanner' }}
      />
      
      <Tab.Screen 
        name="Routes" 
        component={RoutePlannerScreen}
        options={{ title: 'Routes' }}
      />
      
      <Tab.Screen 
        name="AI" 
        component={AIAssistantScreen}
        options={{ title: 'AI Help' }}
      />
      
      <Tab.Screen 
        name="Maps" 
        component={MapScreen}
        options={{ title: 'Maps' }}
      />
      
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen}
        options={{ title: 'Planner' }}
      />
    </Tab.Navigator>
  );
};

const getTabIcon = (routeName) => {
  switch (routeName) {
    case 'Home':
      return '🏠';
    case 'Forum':
      return '��️';
    case 'Scanner':
      return '🔍';
    case 'Routes':
      return '🗺️';
    case 'AI':
      return '🤖';
    case 'Maps':
      return '📍';
    case 'Planner':
      return '🗓️';
    default:
      return '🏠';
  }
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    paddingVertical: SPACING.SM,
    paddingBottom: SPACING.MD,
    height: 80,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XS,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: 2,
  },
  activeTabIconContainer: {
    backgroundColor: COLORS.PRIMARY,
    transform: [{ scale: 1.1 }],
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default TabNavigator;
