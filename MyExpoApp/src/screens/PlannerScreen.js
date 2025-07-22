import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button, Input } from '../components';
import { generateId } from '../utils';

const PlannerScreen = () => {
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState({
    id: '',
    destination: '',
    date: '',
    timeOfDay: 'morning',
    expectedWeather: 'sunny',
    temperature: '',
    supplies: {
      water: false,
      food: false,
      firstAid: false,
      navigation: false,
      shelter: false,
      clothing: false,
      lighting: false,
      communication: false,
      tools: false,
      safety: false,
    },
    customSupplies: [],
    notes: '',
    difficulty: 'moderate',
    estimatedDuration: '',
    emergencyContact: '',
    createdAt: new Date().toISOString(),
  });
  const [customSupplyInput, setCustomSupplyInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const timeOptions = [
    { id: 'early_morning', label: 'Early Morning (5-8 AM)', icon: '🌅' },
    { id: 'morning', label: 'Morning (8-12 PM)', icon: '🌤️' },
    { id: 'afternoon', label: 'Afternoon (12-5 PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (5-8 PM)', icon: '🌆' },
    { id: 'night', label: 'Night (8 PM+)', icon: '🌙' },
  ];

  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', icon: '☀️' },
    { id: 'partly_cloudy', label: 'Partly Cloudy', icon: '⛅' },
    { id: 'cloudy', label: 'Cloudy', icon: '☁️' },
    { id: 'rainy', label: 'Rainy', icon: '🌧️' },
    { id: 'stormy', label: 'Stormy', icon: '⛈️' },
    { id: 'snowy', label: 'Snowy', icon: '❄️' },
    { id: 'foggy', label: 'Foggy', icon: '🌫️' },
    { id: 'windy', label: 'Windy', icon: '💨' },
  ];

  const difficultyOptions = [
    { id: 'easy', label: 'Easy', color: COLORS.SUCCESS },
    { id: 'moderate', label: 'Moderate', color: COLORS.WARNING },
    { id: 'hard', label: 'Hard', color: COLORS.ERROR },
    { id: 'extreme', label: 'Extreme', color: COLORS.TEXT_PRIMARY },
  ];

  const essentialSupplies = [
    { id: 'water', label: 'Water (2-3 Liters)', icon: '💧', essential: true },
    { id: 'food', label: 'Food & Snacks', icon: '🥪', essential: true },
    { id: 'firstAid', label: 'First Aid Kit', icon: '🏥', essential: true },
    { id: 'navigation', label: 'Map & Compass', icon: '🧭', essential: true },
    { id: 'shelter', label: 'Emergency Shelter', icon: '⛺', essential: false },
    { id: 'clothing', label: 'Extra Clothing', icon: '👕', essential: true },
    { id: 'lighting', label: 'Headlamp/Flashlight', icon: '🔦', essential: true },
    { id: 'communication', label: 'Communication Device', icon: '📱', essential: false },
    { id: 'tools', label: 'Multi-tool/Knife', icon: '🔧', essential: false },
    { id: 'safety', label: 'Whistle & Signal', icon: '🔔', essential: true },
  ];

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const saved = await AsyncStorage.getItem('hiking_plans');
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const savePlan = async () => {
    if (!currentPlan.destination.trim()) {
      Alert.alert('Missing Information', 'Please enter a destination for your hiking plan.');
      return;
    }

    try {
      const planToSave = {
        ...currentPlan,
        id: currentPlan.id || generateId(),
        updatedAt: new Date().toISOString(),
      };

      let updatedPlans;
      if (isEditing) {
        updatedPlans = savedPlans.map(plan => 
          plan.id === planToSave.id ? planToSave : plan
        );
      } else {
        updatedPlans = [planToSave, ...savedPlans];
      }

      await AsyncStorage.setItem('hiking_plans', JSON.stringify(updatedPlans));
      setSavedPlans(updatedPlans);
      
      Alert.alert(
        'Plan Saved!',
        `Your hiking plan for ${planToSave.destination} has been saved successfully.`,
        [{ text: 'OK', onPress: () => {
          setShowNewPlan(false);
          resetCurrentPlan();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your hiking plan. Please try again.');
      console.error('Error saving plan:', error);
    }
  };

  const deletePlan = async (planId) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this hiking plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
              await AsyncStorage.setItem('hiking_plans', JSON.stringify(updatedPlans));
              setSavedPlans(updatedPlans);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plan.');
            }
          }
        }
      ]
    );
  };

  const editPlan = (plan) => {
    setCurrentPlan(plan);
    setIsEditing(true);
    setShowNewPlan(true);
  };

  const resetCurrentPlan = () => {
    setCurrentPlan({
      id: '',
      destination: '',
      date: '',
      timeOfDay: 'morning',
      expectedWeather: 'sunny',
      temperature: '',
      supplies: {
        water: false,
        food: false,
        firstAid: false,
        navigation: false,
        shelter: false,
        clothing: false,
        lighting: false,
        communication: false,
        tools: false,
        safety: false,
      },
      customSupplies: [],
      notes: '',
      difficulty: 'moderate',
      estimatedDuration: '',
      emergencyContact: '',
      createdAt: new Date().toISOString(),
    });
    setIsEditing(false);
    setCustomSupplyInput('');
  };

  const toggleSupply = (supplyId) => {
    setCurrentPlan(prev => ({
      ...prev,
      supplies: {
        ...prev.supplies,
        [supplyId]: !prev.supplies[supplyId]
      }
    }));
  };

  const addCustomSupply = () => {
    if (customSupplyInput.trim()) {
      setCurrentPlan(prev => ({
        ...prev,
        customSupplies: [...prev.customSupplies, customSupplyInput.trim()]
      }));
      setCustomSupplyInput('');
    }
  };

  const removeCustomSupply = (index) => {
    setCurrentPlan(prev => ({
      ...prev,
      customSupplies: prev.customSupplies.filter((_, i) => i !== index)
    }));
  };

  const getWeatherIcon = (weather) => {
    return weatherOptions.find(option => option.id === weather)?.icon || '☀️';
  };

  const getTimeIcon = (time) => {
    return timeOptions.find(option => option.id === time)?.icon || '🌤️';
  };

  const getDifficultyColor = (difficulty) => {
    return difficultyOptions.find(option => option.id === difficulty)?.color || COLORS.WARNING;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🗓️ Trip Planner</Text>
        <Text style={styles.subtitle}>Plan your perfect hiking adventure</Text>
      </View>

      {/* New Plan Button */}
      <View style={styles.actionContainer}>
        <Button
          title="+ New Hiking Plan"
          onPress={() => {
            resetCurrentPlan();
            setShowNewPlan(true);
          }}
          style={styles.newPlanButton}
        />
      </View>

      {/* Saved Plans */}
      <ScrollView style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>Your Hiking Plans ({savedPlans.length})</Text>
        
        {savedPlans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎒</Text>
            <Text style={styles.emptyTitle}>No hiking plans yet</Text>
            <Text style={styles.emptyText}>
              Create your first hiking plan to track destinations, supplies, and weather conditions.
            </Text>
          </View>
        ) : (
          savedPlans.map((plan) => (
            <TouchableOpacity key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planDestination}>{plan.destination}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
                    <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.planDate}>{formatDate(plan.date)}</Text>
              </View>

              <View style={styles.planDetails}>
                <View style={styles.planDetailItem}>
                  <Text style={styles.planDetailIcon}>{getTimeIcon(plan.timeOfDay)}</Text>
                  <Text style={styles.planDetailText}>
                    {timeOptions.find(t => t.id === plan.timeOfDay)?.label}
                  </Text>
                </View>
                <View style={styles.planDetailItem}>
                  <Text style={styles.planDetailIcon}>{getWeatherIcon(plan.expectedWeather)}</Text>
                  <Text style={styles.planDetailText}>
                    {weatherOptions.find(w => w.id === plan.expectedWeather)?.label}
                    {plan.temperature && ` (${plan.temperature}°F)`}
                  </Text>
                </View>
                {plan.estimatedDuration && (
                  <View style={styles.planDetailItem}>
                    <Text style={styles.planDetailIcon}>⏱️</Text>
                    <Text style={styles.planDetailText}>{plan.estimatedDuration}</Text>
                  </View>
                )}
              </View>

              <View style={styles.planActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editPlan(plan)}
                >
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePlan(plan.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* New/Edit Plan Modal */}
      <Modal visible={showNewPlan} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowNewPlan(false);
                resetCurrentPlan();
              }}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Hiking Plan' : 'New Hiking Plan'}
            </Text>
            <TouchableOpacity style={styles.modalSaveButton} onPress={savePlan}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Destination */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>📍 Destination</Text>
              <Input
                label="Trail or Location Name"
                value={currentPlan.destination}
                onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, destination: text }))}
                placeholder="e.g., Pine Ridge Trail, Cascade Falls"
              />
              
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={currentPlan.date}
                    onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, date: text }))}
                    placeholder="MM/DD/YYYY"
                  />
                </View>
                <View style={styles.formColumn}>
                  <Text style={styles.inputLabel}>Duration (hours)</Text>
                  <TextInput
                    style={styles.durationInput}
                    value={currentPlan.estimatedDuration}
                    onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, estimatedDuration: text }))}
                    placeholder="e.g., 4-6 hours"
                  />
                </View>
              </View>
            </View>

            {/* Time of Day */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>🕐 Time of Day</Text>
              <View style={styles.optionsGrid}>
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      currentPlan.timeOfDay === option.id && styles.selectedOption
                    ]}
                    onPress={() => setCurrentPlan(prev => ({ ...prev, timeOfDay: option.id }))}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      currentPlan.timeOfDay === option.id && styles.selectedOptionText
                    ]}>
                      {option.label.split(' ')[0]} {option.label.split(' ')[1]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Weather */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>🌤️ Expected Weather</Text>
              <View style={styles.optionsGrid}>
                {weatherOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      currentPlan.expectedWeather === option.id && styles.selectedOption
                    ]}
                    onPress={() => setCurrentPlan(prev => ({ ...prev, expectedWeather: option.id }))}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      currentPlan.expectedWeather === option.id && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.temperatureRow}>
                <Text style={styles.inputLabel}>Expected Temperature (°F)</Text>
                <TextInput
                  style={styles.temperatureInput}
                  value={currentPlan.temperature}
                  onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, temperature: text }))}
                  placeholder="e.g., 65-75"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Difficulty */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>⛰️ Difficulty Level</Text>
              <View style={styles.difficultyOptions}>
                {difficultyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.difficultyOption,
                      currentPlan.difficulty === option.id && { backgroundColor: option.color }
                    ]}
                    onPress={() => setCurrentPlan(prev => ({ ...prev, difficulty: option.id }))}
                  >
                    <Text style={[
                      styles.difficultyOptionText,
                      currentPlan.difficulty === option.id && styles.selectedDifficultyText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Supplies Checklist */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>🎒 Supplies Checklist</Text>
              <View style={styles.suppliesContainer}>
                {essentialSupplies.map((supply) => (
                  <View key={supply.id} style={styles.supplyItem}>
                    <View style={styles.supplyInfo}>
                      <Text style={styles.supplyIcon}>{supply.icon}</Text>
                      <Text style={styles.supplyLabel}>{supply.label}</Text>
                      {supply.essential && <Text style={styles.essentialTag}>Essential</Text>}
                    </View>
                    <Switch
                      value={currentPlan.supplies[supply.id]}
                      onValueChange={() => toggleSupply(supply.id)}
                      trackColor={{ false: COLORS.GRAY_LIGHT, true: COLORS.PRIMARY_LIGHT }}
                      thumbColor={currentPlan.supplies[supply.id] ? COLORS.PRIMARY : COLORS.WHITE}
                    />
                  </View>
                ))}
              </View>

              {/* Custom Supplies */}
              <View style={styles.customSuppliesContainer}>
                <Text style={styles.customSuppliesTitle}>Custom Supplies</Text>
                <View style={styles.customSupplyInput}>
                  <TextInput
                    style={styles.customSupplyField}
                    value={customSupplyInput}
                    onChangeText={setCustomSupplyInput}
                    placeholder="Add custom supply item..."
                  />
                  <TouchableOpacity style={styles.addSupplyButton} onPress={addCustomSupply}>
                    <Text style={styles.addSupplyText}>+</Text>
                  </TouchableOpacity>
                </View>
                
                {currentPlan.customSupplies.map((supply, index) => (
                  <View key={index} style={styles.customSupplyItem}>
                    <Text style={styles.customSupplyText}>• {supply}</Text>
                    <TouchableOpacity onPress={() => removeCustomSupply(index)}>
                      <Text style={styles.removeSupplyText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>🚨 Emergency Contact</Text>
              <Input
                label="Emergency Contact Name & Phone"
                value={currentPlan.emergencyContact}
                onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, emergencyContact: text }))}
                placeholder="John Doe - (555) 123-4567"
              />
            </View>

            {/* Notes */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>📝 Additional Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={currentPlan.notes}
                onChangeText={(text) => setCurrentPlan(prev => ({ ...prev, notes: text }))}
                placeholder="Special considerations, route notes, conditions..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  actionContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  newPlanButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  plansContainer: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XXL,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    marginBottom: SPACING.MD,
  },
  planTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  planDestination: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  difficultyText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planDate: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  planDetails: {
    marginBottom: SPACING.MD,
  },
  planDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  planDetailIcon: {
    fontSize: 16,
    marginRight: SPACING.SM,
    width: 20,
  },
  planDetailText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    flex: 1,
    marginRight: SPACING.SM,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    flex: 1,
    marginLeft: SPACING.SM,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  modalCloseButton: {
    padding: SPACING.SM,
  },
  modalCloseText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  modalSaveButton: {
    padding: SPACING.SM,
  },
  modalSaveText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.LG,
  },
  formSection: {
    marginBottom: SPACING.LG,
  },
  formSectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formColumn: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  inputLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  dateInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
  },
  durationInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.SM,
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  optionIcon: {
    fontSize: 20,
    marginBottom: SPACING.XS,
  },
  optionText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.WHITE,
  },
  temperatureRow: {
    marginTop: SPACING.MD,
  },
  temperatureInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
  },
  difficultyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyOption: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    flex: 1,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
  },
  difficultyOptionText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  selectedDifficultyText: {
    color: COLORS.WHITE,
  },
  suppliesContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
  },
  supplyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  supplyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supplyIcon: {
    fontSize: 16,
    marginRight: SPACING.SM,
    width: 20,
  },
  supplyLabel: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  essentialTag: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.ERROR,
    fontWeight: '600',
    marginLeft: SPACING.SM,
  },
  customSuppliesContainer: {
    marginTop: SPACING.MD,
  },
  customSuppliesTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  customSupplyInput: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
  },
  customSupplyField: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: FONT_SIZE.MD,
    marginRight: SPACING.SM,
  },
  addSupplyButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSupplyText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  customSupplyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  customSupplyText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  removeSupplyText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    fontWeight: 'bold',
    padding: SPACING.XS,
  },
  notesInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
    minHeight: 100,
  },
});

export default PlannerScreen;
