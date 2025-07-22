import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { Button } from '../components';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🌲 Trail Guardian 🛡️</Text>
        <Text style={styles.subtitle}>Protecting Nature's Pathways</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Welcome, Trail Guardian!</Text>
        <Text style={styles.description}>
          Monitor and protect hiking trails, track environmental conditions, 
          and ensure the safety of nature enthusiasts.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Trail Monitoring"
          onPress={() => console.log('Start monitoring pressed')}
          style={styles.primaryButton}
        />
        
        <Button
          title="View Trail Reports"
          onPress={() => console.log('View reports pressed')}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Trails</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Reports Filed</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XXL,
    paddingTop: SPACING.LG,
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
  section: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LG,
    borderRadius: 12,
    marginBottom: SPACING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  description: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: SPACING.LG,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.LG,
  },
  statCard: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LG,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default HomeScreen;
