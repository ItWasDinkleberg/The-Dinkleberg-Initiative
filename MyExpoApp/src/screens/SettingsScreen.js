import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useFirebase';

const SettingsScreen = ({ navigation }) => {
  const { colors, typography, spacing, borderRadius, shadows, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          icon: isDark ? '🌙' : '☀️',
          type: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Receive alerts and updates',
          icon: '🔔',
          type: 'toggle',
          value: true,
          onPress: () => console.log('Toggle push notifications'),
        },
        {
          id: 'emergencyAlerts',
          title: 'Emergency Alerts',
          subtitle: 'Critical safety notifications',
          icon: '🚨',
          type: 'toggle',
          value: true,
          onPress: () => console.log('Toggle emergency alerts'),
        },
        {
          id: 'forumUpdates',
          title: 'Forum Updates',
          subtitle: 'New posts and replies',
          icon: '💬',
          type: 'toggle',
          value: true,
          onPress: () => console.log('Toggle forum updates'),
        },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'shareLocation',
          title: 'Share Location',
          subtitle: 'Allow location sharing with community',
          icon: '📍',
          type: 'toggle',
          value: false,
          onPress: () => console.log('Toggle location sharing'),
        },
        {
          id: 'publicProfile',
          title: 'Public Profile',
          subtitle: 'Make your profile visible to others',
          icon: '👤',
          type: 'toggle',
          value: true,
          onPress: () => console.log('Toggle public profile'),
        },
        {
          id: 'dataBackup',
          title: 'Data Backup',
          subtitle: 'Automatic cloud backup',
          icon: '☁️',
          type: 'navigation',
          onPress: () => console.log('Navigate to data backup'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Get help and find answers',
          icon: '❓',
          type: 'navigation',
          onPress: () => console.log('Navigate to help'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Report issues or suggestions',
          icon: '💬',
          type: 'navigation',
          onPress: () => console.log('Send feedback'),
        },
        {
          id: 'about',
          title: 'About Trail Guardian',
          subtitle: 'App version and information',
          icon: 'ℹ️',
          type: 'navigation',
          onPress: () => console.log('Navigate to about'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: '✏️',
          type: 'navigation',
          onPress: () => console.log('Navigate to edit profile'),
        },
        {
          id: 'signOut',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: '🚪',
          type: 'action',
          onPress: handleSignOut,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    const styles = createStyles({ colors, typography, spacing, borderRadius, shadows });

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          item.destructive && styles.destructiveItem,
        ]}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingItemLeft}>
          <View style={styles.settingIcon}>
            <Text style={styles.settingIconText}>{item.icon}</Text>
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[
              styles.settingTitle,
              item.destructive && styles.destructiveText,
            ]}>
              {item.title}
            </Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingItemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{
                false: colors.grayLight,
                true: colors.primaryLight,
              }}
              thumbColor={item.value ? colors.primary : colors.gray}
            />
          )}
          {item.type === 'navigation' && (
            <Text style={styles.chevron}>›</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section) => {
    const styles = createStyles({ colors, typography, spacing, borderRadius, shadows });

    return (
      <View key={section.title} style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionContent}>
          {section.items.map(renderSettingItem)}
        </View>
      </View>
    );
  };

  const styles = createStyles({ colors, typography, spacing, borderRadius, shadows });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || 'Trail Guardian User'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map(renderSection)}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Trail Guardian v1.0.0</Text>
          <Text style={styles.versionSubtext}>
            Making outdoor adventures safer 🌲
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, typography, spacing, borderRadius, shadows }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.small,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileAvatarText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingIconText: {
    fontSize: typography.fontSize.lg,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  settingItemRight: {
    marginLeft: spacing.md,
  },
  chevron: {
    fontSize: typography.fontSize.xl,
    color: colors.textLight,
    fontWeight: typography.fontWeight.light,
  },
  destructiveItem: {
    backgroundColor: colors.errorLight + '10',
  },
  destructiveText: {
    color: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  versionSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default SettingsScreen;
