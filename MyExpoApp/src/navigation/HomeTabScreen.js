import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { useNavigation } from '@react-navigation/native';

const HomeTabScreen = ({ onLogout }) => {
  const navigation = useNavigation();

  const quickActions = [
    { id: 'scanner', title: 'Scan Plant', subtitle: 'Identify flora & fauna', icon: '🔍', screen: 'Scanner' },
    { id: 'routes', title: 'Find Routes', subtitle: 'Discover trails', icon: '🗺️', screen: 'Routes' },
    { id: 'planner', title: 'Plan Trip', subtitle: 'Organize your hike', icon: '🗓️', screen: 'Planner' },
    { id: 'ai', title: 'Ask AI', subtitle: 'Get trail advice', icon: '🤖', screen: 'AI' },
  ];

  const recentActivities = [
    {
      id: 1,
      icon: '🌿',
      title: 'Identified Wild Blueberry',
      time: 'Pine Ridge Trail • 2 hours ago'
    },
    {
      id: 2,
      icon: '🗺️',
      title: 'Completed Cascade Falls Route',
      time: '4.1 miles • Yesterday'
    },
    {
      id: 3,
      icon: '��',
      title: 'Posted in Trail Conditions',
      time: 'Bear sighting update • 2 days ago'
    }
  ];

  const handleQuickAction = (screen) => {
    navigation.navigate(screen);
  };

  const handleActivityPress = (activity) => {
    if (activity.icon === '💬') {
      navigation.navigate('Forum');
    } else if (activity.icon === '🗺️') {
      navigation.navigate('Routes');
    } else if (activity.icon === '🌿') {
      navigation.navigate('Scanner');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🌲 Trail Guardian 🛡️</Text>
          <Text style={styles.subtitle}>Protecting Nature's Pathways</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back, Trail Guardian!</Text>
        <Text style={styles.welcomeText}>
          Ready to explore, protect, and share the beauty of nature's trails?
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleQuickAction(action.screen)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Trails Explored</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Plants Identified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Routes Shared</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>126</Text>
            <Text style={styles.statLabel}>Forum Posts</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              onPress={() => handleActivityPress(activity)}
            >
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  logoutText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  welcomeSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  welcomeText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  quickActionsContainer: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: COLORS.WHITE,
    width: '48%',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.SM,
  },
  actionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: SPACING.LG,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.WHITE,
    width: '48%',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  recentActivity: {
    marginBottom: SPACING.LG,
  },
  activityList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: SPACING.MD,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  activityTime: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default HomeTabScreen;
