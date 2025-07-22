import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button } from '../components';
import { generateId } from '../utils';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 45.5017, // Portland, OR - Trail-rich area
    longitude: -122.6750,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [trailPoints, setTrailPoints] = useState([]);
  const [isTrailMode, setIsTrailMode] = useState(false);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [showTrailModal, setShowTrailModal] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [markerForm, setMarkerForm] = useState({
    title: '',
    description: '',
    type: 'waypoint'
  });
  const [trailForm, setTrailForm] = useState({
    name: '',
    description: '',
    difficulty: 'moderate',
    estimatedTime: ''
  });
  const [savedTrails, setSavedTrails] = useState([]);
  const [showTrailsList, setShowTrailsList] = useState(false);

  const markerTypes = [
    { id: 'waypoint', label: 'Waypoint', icon: '📍', color: COLORS.PRIMARY },
    { id: 'trailhead', label: 'Trailhead', icon: '🥾', color: COLORS.ACCENT },
    { id: 'campsite', label: 'Campsite', icon: '⛺', color: COLORS.SECONDARY },
    { id: 'water', label: 'Water Source', icon: '💧', color: COLORS.INFO },
    { id: 'viewpoint', label: 'Viewpoint', icon: '👁️', color: COLORS.SUCCESS },
    { id: 'danger', label: 'Danger/Warning', icon: '⚠️', color: COLORS.ERROR },
    { id: 'parking', label: 'Parking', icon: '🅿️', color: COLORS.TEXT_SECONDARY },
    { id: 'shelter', label: 'Shelter', icon: '🏠', color: COLORS.EARTH_BROWN },
  ];

  const difficultyLevels = [
    { id: 'easy', label: 'Easy', color: COLORS.SUCCESS },
    { id: 'moderate', label: 'Moderate', color: COLORS.WARNING },
    { id: 'hard', label: 'Hard', color: COLORS.ERROR },
    { id: 'extreme', label: 'Extreme', color: COLORS.TEXT_PRIMARY },
  ];

  // Mock trail data for demonstration
  const mockTrails = [
    {
      id: 'trail1',
      name: 'Forest Loop Trail',
      coordinates: [
        { latitude: 45.5017, longitude: -122.6750 },
        { latitude: 45.5050, longitude: -122.6780 },
        { latitude: 45.5080, longitude: -122.6800 },
        { latitude: 45.5100, longitude: -122.6750 },
        { latitude: 45.5080, longitude: -122.6720 },
        { latitude: 45.5017, longitude: -122.6750 },
      ],
      difficulty: 'moderate',
      distance: '3.2 miles',
      color: COLORS.ACCENT,
    },
    {
      id: 'trail2',
      name: 'Ridge View Trail',
      coordinates: [
        { latitude: 45.4990, longitude: -122.6800 },
        { latitude: 45.4980, longitude: -122.6850 },
        { latitude: 45.4960, longitude: -122.6900 },
        { latitude: 45.4940, longitude: -122.6950 },
      ],
      difficulty: 'hard',
      distance: '2.8 miles',
      color: COLORS.ERROR,
    },
  ];

  useEffect(() => {
    getCurrentLocation();
    loadSavedMarkers();
    loadSavedTrails();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please enable location services to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userPos = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userPos);
      setRegion({
        ...userPos,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadSavedMarkers = async () => {
    try {
      const saved = await AsyncStorage.getItem('map_markers');
      if (saved) {
        setMarkers(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const loadSavedTrails = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_trails');
      if (saved) {
        setSavedTrails(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading trails:', error);
    }
  };

  const saveMarkers = async (newMarkers) => {
    try {
      await AsyncStorage.setItem('map_markers', JSON.stringify(newMarkers));
    } catch (error) {
      console.error('Error saving markers:', error);
    }
  };

  const saveTrails = async (trails) => {
    try {
      await AsyncStorage.setItem('saved_trails', JSON.stringify(trails));
    } catch (error) {
      console.error('Error saving trails:', error);
    }
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    
    if (isTrailMode) {
      // Add point to current trail
      setTrailPoints([...trailPoints, coordinate]);
    } else {
      // Add marker
      setCurrentMarker(coordinate);
      setMarkerForm({ title: '', description: '', type: 'waypoint' });
      setShowMarkerModal(true);
    }
  };

  const addMarker = () => {
    if (!markerForm.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the marker.');
      return;
    }

    const newMarker = {
      id: generateId(),
      coordinate: currentMarker,
      title: markerForm.title,
      description: markerForm.description,
      type: markerForm.type,
      createdAt: new Date().toISOString(),
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    saveMarkers(updatedMarkers);
    setShowMarkerModal(false);
    setCurrentMarker(null);
  };

  const deleteMarker = (markerId) => {
    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedMarkers = markers.filter(marker => marker.id !== markerId);
            setMarkers(updatedMarkers);
            saveMarkers(updatedMarkers);
          }
        }
      ]
    );
  };

  const startTrailPlanning = () => {
    setIsTrailMode(true);
    setTrailPoints([]);
    Alert.alert(
      'Trail Planning Mode',
      'Tap on the map to add points to your trail. Tap "Finish Trail" when done.',
      [{ text: 'OK' }]
    );
  };

  const finishTrail = () => {
    if (trailPoints.length < 2) {
      Alert.alert('Error', 'A trail needs at least 2 points.');
      return;
    }
    setShowTrailModal(true);
  };

  const saveTrail = () => {
    if (!trailForm.name.trim()) {
      Alert.alert('Error', 'Please enter a name for the trail.');
      return;
    }

    const newTrail = {
      id: generateId(),
      name: trailForm.name,
      description: trailForm.description,
      difficulty: trailForm.difficulty,
      estimatedTime: trailForm.estimatedTime,
      coordinates: trailPoints,
      distance: calculateDistance(trailPoints),
      createdAt: new Date().toISOString(),
    };

    const updatedTrails = [...savedTrails, newTrail];
    setSavedTrails(updatedTrails);
    saveTrails(updatedTrails);
    
    setIsTrailMode(false);
    setTrailPoints([]);
    setShowTrailModal(false);
    setTrailForm({ name: '', description: '', difficulty: 'moderate', estimatedTime: '' });
    
    Alert.alert('Success', 'Trail saved successfully!');
  };

  const cancelTrail = () => {
    setIsTrailMode(false);
    setTrailPoints([]);
    setTrailForm({ name: '', description: '', difficulty: 'moderate', estimatedTime: '' });
  };

  const calculateDistance = (coordinates) => {
    if (coordinates.length < 2) return '0.0 miles';
    
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const distance = getDistanceBetweenPoints(coordinates[i-1], coordinates[i]);
      totalDistance += distance;
    }
    
    return `${(totalDistance * 0.621371).toFixed(1)} miles`; // Convert km to miles
  };

  const getDistanceBetweenPoints = (point1, point2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  const getMarkerIcon = (type) => {
    return markerTypes.find(t => t.id === type)?.icon || '📍';
  };

  const getMarkerColor = (type) => {
    return markerTypes.find(t => t.id === type)?.color || COLORS.PRIMARY;
  };

  const getDifficultyColor = (difficulty) => {
    return difficultyLevels.find(d => d.id === difficulty)?.color || COLORS.WARNING;
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="standard"
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor={COLORS.ACCENT_LIGHT}
          />
        )}

        {/* Custom markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={getMarkerColor(marker.type)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {getMarkerIcon(marker.type)} {marker.title}
                </Text>
                {marker.description && (
                  <Text style={styles.calloutDescription}>{marker.description}</Text>
                )}
                <TouchableOpacity
                  style={styles.deleteMarkerButton}
                  onPress={() => deleteMarker(marker.id)}
                >
                  <Text style={styles.deleteMarkerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Current trail points */}
        {trailPoints.map((point, index) => (
          <Marker
            key={`trail-point-${index}`}
            coordinate={point}
            pinColor={COLORS.WARNING}
          >
            <Callout>
              <Text>Trail Point {index + 1}</Text>
            </Callout>
          </Marker>
        ))}

        {/* Current trail line */}
        {trailPoints.length > 1 && (
          <Polyline
            coordinates={trailPoints}
            strokeColor={COLORS.WARNING}
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}

        {/* Mock trails */}
        {mockTrails.map((trail) => (
          <Polyline
            key={trail.id}
            coordinates={trail.coordinates}
            strokeColor={trail.color}
            strokeWidth={3}
          />
        ))}

        {/* Saved trails */}
        {savedTrails.map((trail) => (
          <Polyline
            key={trail.id}
            coordinates={trail.coordinates}
            strokeColor={getDifficultyColor(trail.difficulty)}
            strokeWidth={3}
          />
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowTrailsList(true)}>
          <Text style={styles.controlButtonText}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Trail Mode Controls */}
      {isTrailMode && (
        <View style={styles.trailControls}>
          <Text style={styles.trailModeText}>
            Trail Planning Mode - Points: {trailPoints.length}
          </Text>
          <View style={styles.trailButtonsContainer}>
            <TouchableOpacity style={styles.cancelTrailButton} onPress={cancelTrail}>
              <Text style={styles.cancelTrailText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.finishTrailButton, trailPoints.length < 2 && styles.disabledButton]}
              onPress={finishTrail}
              disabled={trailPoints.length < 2}
            >
              <Text style={styles.finishTrailText}>Finish Trail</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {!isTrailMode && (
        <View style={styles.actionButtons}>
          <Button
            title="🗺️ Plan Trail"
            onPress={startTrailPlanning}
            style={styles.planTrailButton}
          />
        </View>
      )}

      {/* Marker Modal */}
      <Modal visible={showMarkerModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMarkerModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Marker</Text>
            <TouchableOpacity onPress={addMarker}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                style={styles.formInput}
                value={markerForm.title}
                onChangeText={(text) => setMarkerForm(prev => ({ ...prev, title: text }))}
                placeholder="Enter marker title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={markerForm.description}
                onChangeText={(text) => setMarkerForm(prev => ({ ...prev, description: text }))}
                placeholder="Additional details"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Marker Type</Text>
              <View style={styles.typeGrid}>
                {markerTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeOption,
                      markerForm.type === type.id && styles.selectedType,
                      { borderColor: type.color }
                    ]}
                    onPress={() => setMarkerForm(prev => ({ ...prev, type: type.id }))}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[styles.typeLabel, { color: type.color }]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Trail Modal */}
      <Modal visible={showTrailModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTrailModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Save Trail</Text>
            <TouchableOpacity onPress={saveTrail}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Trail Name</Text>
              <TextInput
                style={styles.formInput}
                value={trailForm.name}
                onChangeText={(text) => setTrailForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter trail name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={trailForm.description}
                onChangeText={(text) => setTrailForm(prev => ({ ...prev, description: text }))}
                placeholder="Trail description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Estimated Time</Text>
              <TextInput
                style={styles.formInput}
                value={trailForm.estimatedTime}
                onChangeText={(text) => setTrailForm(prev => ({ ...prev, estimatedTime: text }))}
                placeholder="e.g., 2-3 hours"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Difficulty Level</Text>
              <View style={styles.difficultyOptions}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.difficultyOption,
                      trailForm.difficulty === level.id && { backgroundColor: level.color }
                    ]}
                    onPress={() => setTrailForm(prev => ({ ...prev, difficulty: level.id }))}
                  >
                    <Text style={[
                      styles.difficultyText,
                      trailForm.difficulty === level.id && styles.selectedDifficultyText
                    ]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.trailStats}>
              <Text style={styles.statsTitle}>Trail Statistics</Text>
              <Text style={styles.statText}>Points: {trailPoints.length}</Text>
              <Text style={styles.statText}>Distance: {calculateDistance(trailPoints)}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Trails List Modal */}
      <Modal visible={showTrailsList} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTrailsList(false)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Trails & Markers</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.trailsSection}>
              <Text style={styles.sectionTitle}>Your Trails ({savedTrails.length})</Text>
              {savedTrails.map((trail) => (
                <View key={trail.id} style={styles.trailItem}>
                  <View style={styles.trailItemHeader}>
                    <Text style={styles.trailItemName}>{trail.name}</Text>
                    <View style={[styles.trailDifficultyBadge, { backgroundColor: getDifficultyColor(trail.difficulty) }]}>
                      <Text style={styles.trailDifficultyText}>{trail.difficulty}</Text>
                    </View>
                  </View>
                  <Text style={styles.trailItemDetails}>
                    {trail.distance} • {trail.estimatedTime || 'Time not set'}
                  </Text>
                  {trail.description && (
                    <Text style={styles.trailItemDescription}>{trail.description}</Text>
                  )}
                </View>
              ))}
              
              {savedTrails.length === 0 && (
                <Text style={styles.emptyText}>No saved trails yet. Start planning your first trail!</Text>
              )}
            </View>

            <View style={styles.trailsSection}>
              <Text style={styles.sectionTitle}>Markers ({markers.length})</Text>
              {markers.map((marker) => (
                <View key={marker.id} style={styles.markerItem}>
                  <Text style={styles.markerItemTitle}>
                    {getMarkerIcon(marker.type)} {marker.title}
                  </Text>
                  {marker.description && (
                    <Text style={styles.markerItemDescription}>{marker.description}</Text>
                  )}
                </View>
              ))}
              
              {markers.length === 0 && (
                <Text style={styles.emptyText}>No markers added yet. Tap on the map to add markers!</Text>
              )}
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
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: SPACING.MD,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    fontSize: 20,
  },
  trailControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: SPACING.MD,
    right: SPACING.MD,
    backgroundColor: COLORS.WARNING,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  trailModeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  trailButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelTrailButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    flex: 1,
    marginRight: SPACING.SM,
  },
  cancelTrailText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    textAlign: 'center',
  },
  finishTrailButton: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    flex: 1,
    marginLeft: SPACING.SM,
  },
  finishTrailText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY,
  },
  actionButtons: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: SPACING.MD,
    right: SPACING.MD,
  },
  planTrailButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  callout: {
    minWidth: 150,
    padding: SPACING.SM,
  },
  calloutTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  calloutDescription: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  deleteMarkerButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    alignSelf: 'flex-end',
  },
  deleteMarkerText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.XS,
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
  modalCancelText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  modalSaveText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.LG,
  },
  formGroup: {
    marginBottom: SPACING.LG,
  },
  formLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  formInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.SM,
  },
  selectedType: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: SPACING.XS,
  },
  typeLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    textAlign: 'center',
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
  difficultyText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  selectedDifficultyText: {
    color: COLORS.WHITE,
  },
  trailStats: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginTop: SPACING.MD,
  },
  statsTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  statText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  trailsSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  trailItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trailItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  trailItemName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  trailDifficultyBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  trailDifficultyText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  trailItemDetails: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  trailItemDescription: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  markerItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  markerItemTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  markerItemDescription: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: SPACING.LG,
  },
});

export default MapScreen;
