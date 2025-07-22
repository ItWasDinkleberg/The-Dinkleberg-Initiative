import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button } from '../components';

const RoutePlannerScreen = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('moderate');
  const [selectedDistance, setSelectedDistance] = useState('5-10');

  const popularRoutes = [
    {
      id: 1,
      name: "Pine Ridge Loop",
      distance: "6.2 mi",
      duration: "3-4 hours",
      difficulty: "Moderate",
      elevation: "+850 ft",
      highlights: ["Scenic overlook", "Waterfall", "Wildlife viewing"],
      rating: 4.5
    },
    {
      id: 2,
      name: "Cascade Falls Trail",
      distance: "4.1 mi",
      duration: "2-3 hours",
      difficulty: "Easy",
      elevation: "+320 ft",
      highlights: ["Multiple waterfalls", "Stream crossing", "Photography spots"],
      rating: 4.8
    },
    {
      id: 3,
      name: "Summit Challenge",
      distance: "12.5 mi",
      duration: "6-8 hours",
      difficulty: "Hard",
      elevation: "+2,100 ft",
      highlights: ["Mountain peak", "360° views", "Rock scrambling"],
      rating: 4.3
    }
  ];

  const difficulties = ['easy', 'moderate', 'hard'];
  const distances = ['0-5', '5-10', '10-15', '15+'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return COLORS.SUCCESS;
      case 'moderate': return COLORS.WARNING;
      case 'hard': return COLORS.ERROR;
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '��';
      case 'moderate': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Route Planner</Text>
        <Text style={styles.subtitle}>Plan your perfect trail adventure</Text>
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Difficulty Level</Text>
        <View style={styles.filterRow}>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty && styles.activeFilterChip
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text style={styles.filterEmoji}>{getDifficultyIcon(difficulty)}</Text>
              <Text style={[
                styles.filterText,
                selectedDifficulty === difficulty && styles.activeFilterText
              ]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterTitle}>Distance (miles)</Text>
        <View style={styles.filterRow}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.filterChip,
                selectedDistance === distance && styles.activeFilterChip
              ]}
              onPress={() => setSelectedDistance(distance)}
            >
              <Text style={[
                styles.filterText,
                selectedDistance === distance && styles.activeFilterText
              ]}>
                {distance} mi
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trails or locations..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Popular Routes */}
      <View style={styles.routesContainer}>
        <View style={styles.routesHeader}>
          <Text style={styles.routesTitle}>Popular Routes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
          {popularRoutes.map((route) => (
            <TouchableOpacity key={route.id} style={styles.routeCard}>
              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>⭐ {route.rating}</Text>
                </View>
              </View>

              <View style={styles.routeStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📏</Text>
                  <Text style={styles.statText}>{route.distance}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⏱️</Text>
                  <Text style={styles.statText}>{route.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={styles.statText}>{route.elevation}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{getDifficultyIcon(route.difficulty)}</Text>
                  <Text style={[styles.statText, { color: getDifficultyColor(route.difficulty) }]}>
                    {route.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.highlightsContainer}>
                <Text style={styles.highlightsTitle}>Highlights:</Text>
                <View style={styles.highlightsList}>
                  {route.highlights.map((highlight, index) => (
                    <View key={index} style={styles.highlightTag}>
                      <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.routeActions}>
                <Button
                  title="View Details"
                  style={styles.detailsButton}
                  textStyle={styles.detailsButtonText}
                  onPress={() => console.log('View details for:', route.name)}
                />
                <Button
                  title="Start Navigation"
                  style={styles.navigateButton}
                  onPress={() => console.log('Navigate to:', route.name)}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="🧭 Create Custom Route"
          style={styles.customRouteButton}
          onPress={() => console.log('Create custom route')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  filterTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    marginTop: SPACING.SM,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    marginBottom: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  activeFilterChip: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterEmoji: {
    marginRight: SPACING.XS,
  },
  filterText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.WHITE,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    fontSize: FONT_SIZE.MD,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginLeft: SPACING.SM,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: FONT_SIZE.MD,
  },
  routesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },
  routesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  routesTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  viewAllText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  routesList: {
    flex: 1,
  },
  routeCard: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  routeName: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: COLORS.EARTH_TAN,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  ratingText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginBottom: SPACING.XS,
  },
  statText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  highlightsContainer: {
    marginBottom: SPACING.MD,
  },
  highlightsTitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  highlightsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightTag: {
    backgroundColor: COLORS.ACCENT_LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  highlightText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  routeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginRight: SPACING.SM,
  },
  detailsButtonText: {
    color: COLORS.PRIMARY,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: COLORS.ACCENT,
  },
  quickActions: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
  },
  customRouteButton: {
    backgroundColor: COLORS.SECONDARY,
  },
});

export default RoutePlannerScreen;
