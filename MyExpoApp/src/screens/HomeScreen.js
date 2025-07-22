import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { 
  ForumScreen, 
  ScannerScreen, 
  RoutePlannerScreen, 
  AIAssistantScreen, 
  OfflineMapScreen 
} from './';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'forum', title: 'Forum', icon: '🗣️' },
    { id: 'scanner', title: 'Scanner', icon: '🔍' },
    { id: 'planner', title: 'Routes', icon: '🗺️' },
    { id: 'ai', title: 'AI Help', icon: '🤖' },
    { id: 'maps', title: 'Maps', icon: '📍' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'forum':
        return <ForumScreen />;
      case 'scanner':
        return <ScannerScreen />;
      case 'planner':
        return <RoutePlannerScreen />;
      case 'ai':
        return <AIAssistantScreen />;
      case 'maps':
        return <OfflineMapScreen />;
      default:
        return (
          <ScrollView style={styles.homeContent} contentContainerStyle={styles.homeScrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>🌲 Trail Guardian 🛡️</Text>
              <Text style={styles.subtitle}>Protecting Nature's Pathways</Text>
            </View>
            
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome back, Trail Guardian!</Text>
              <Text style={styles.welcomeText}>
                Ready to explore, protect, and share the beauty of nature's trails?
              </Text>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('scanner')}
                >
                  <Text style={styles.actionIcon}>🔍</Text>
                  <Text style={styles.actionTitle}>Scan Plant</Text>
                  <Text style={styles.actionSubtitle}>Identify flora & fauna</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('planner')}
                >
                  <Text style={styles.actionIcon}>🗺️</Text>
                  <Text style={styles.actionTitle}>Plan Route</Text>
                  <Text style={styles.actionSubtitle}>Find perfect trails</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('ai')}
                >
                  <Text style={styles.actionIcon}>🤖</Text>
                  <Text style={styles.actionTitle}>Ask AI</Text>
                  <Text style={styles.actionSubtitle}>Get trail advice</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('maps')}
                >
                  <Text style={styles.actionIcon}>📍</Text>
                  <Text style={styles.actionTitle}>Offline Maps</Text>
                  <Text style={styles.actionSubtitle}>Download for later</Text>
                </TouchableOpacity>
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
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🌿</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Identified Wild Blueberry</Text>
                    <Text style={styles.activityTime}>Pine Ridge Trail • 2 hours ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🗺️</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Completed Cascade Falls Route</Text>
                    <Text style={styles.activityTime}>4.1 miles • Yesterday</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>💬</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Posted in Trail Conditions</Text>
                    <Text style={styles.activityTime}>Bear sighting update • 2 days ago</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabIcon, activeTab === tab.id && styles.activeTabIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
  },
  homeScrollContent: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.LG,
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
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.SM,
    paddingBottom: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    marginHorizontal: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});

export default HomeScreen;
