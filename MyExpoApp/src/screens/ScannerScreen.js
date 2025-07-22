import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Image,
  Modal,
  Dimensions,
  Platform
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button } from '../components';

const { width, height } = Dimensions.get('window');

const ScannerScreen = () => {
  const [scanMode, setScanMode] = useState('plant'); // 'plant' or 'track'
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);

  const recentScans = [
    { 
      id: 1, 
      type: 'plant', 
      name: 'Douglas Fir', 
      confidence: '95%', 
      location: 'Pine Ridge Trail', 
      time: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop'
    },
    { 
      id: 2, 
      type: 'track', 
      name: 'White-tailed Deer', 
      confidence: '87%', 
      location: 'Cascade Falls', 
      time: '1 day ago',
      image: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?w=200&h=200&fit=crop'
    },
    { 
      id: 3, 
      type: 'plant', 
      name: 'Wild Blueberry', 
      confidence: '92%', 
      location: 'Mountain Loop', 
      time: '2 days ago',
      image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=200&h=200&fit=crop'
    },
  ];

  useEffect(() => {
    requestCameraPermission();
    requestMediaPermission();
  }, []);

  const handleCameraPress = async () => {
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access to scan plants and tracks.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setShowCamera(true);
    setCapturedImage(null);
    setIdentificationResult(null);
  };

  const handleLibraryPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setIdentificationResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from library');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedImage(photo.uri);
        setShowCamera(false);
        
        // Optionally save to device
        if (mediaPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handleIdentify = async () => {
    if (!capturedImage) return;
    
    setIsIdentifying(true);
    
    // Simulate AI identification process
    setTimeout(() => {
      const mockResults = {
        plant: [
          { name: 'Mountain Laurel', confidence: 89, description: 'Evergreen shrub with pink flowers', isEdible: false, isToxic: true },
          { name: 'Wild Azalea', confidence: 72, description: 'Deciduous shrub with colorful blooms', isEdible: false, isToxic: true },
          { name: 'Rhododendron', confidence: 68, description: 'Large flowering shrub', isEdible: false, isToxic: true }
        ],
        track: [
          { name: 'Black Bear', confidence: 78, description: 'Large omnivorous mammal', safety: 'Exercise extreme caution, make noise', size: 'Large paw print' },
          { name: 'Raccoon', confidence: 65, description: 'Small nocturnal mammal', safety: 'Generally harmless, secure food', size: 'Small hand-like print' },
          { name: 'Coyote', confidence: 45, description: 'Medium-sized canine', safety: 'Keep distance, secure pets', size: 'Dog-like paw print' }
        ]
      };
      
      setIdentificationResult(mockResults[scanMode]);
      setIsIdentifying(false);
    }, 2000);
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setIdentificationResult(null);
    setShowCamera(false);
  };

  const getScanIcon = (type) => {
    return type === 'plant' ? '🌿' : '🐾';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Plant & Track Scanner</Text>
        <Text style={styles.subtitle}>Identify flora and fauna on your trails</Text>
      </View>

      {/* Scan Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, scanMode === 'plant' && styles.activeModeButton]}
          onPress={() => setScanMode('plant')}
        >
          <Text style={styles.modeIcon}>🌿</Text>
          <Text style={[styles.modeText, scanMode === 'plant' && styles.activeModeText]}>Plant Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, scanMode === 'track' && styles.activeModeButton]}
          onPress={() => setScanMode('track')}
        >
          <Text style={styles.modeIcon}>🐾</Text>
          <Text style={[styles.modeText, scanMode === 'track' && styles.activeModeText]}>Track Scanner</Text>
        </TouchableOpacity>
      </View>

      {/* Camera/Image Section */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={resetCamera}>
                <Text style={styles.retakeButtonText}>↻ Retake</Text>
              </TouchableOpacity>
              <Button
                title={isIdentifying ? 'Identifying...' : 'Identify'}
                onPress={handleIdentify}
                disabled={isIdentifying}
                style={[styles.identifyButton, isIdentifying && styles.identifyingButton]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraIcon}>📸</Text>
            <Text style={styles.cameraText}>
              Capture {scanMode === 'plant' ? 'plant or flower' : 'animal track'}
            </Text>
            <Text style={styles.cameraSubtext}>
              {scanMode === 'plant' 
                ? 'Position plant in center of frame'
                : 'Ensure track is clearly visible'
              }
            </Text>
            
            <View style={styles.captureButtons}>
              <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
                <Text style={styles.cameraButtonIcon}>📷</Text>
                <Text style={styles.cameraButtonText}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.libraryButton} onPress={handleLibraryPress}>
                <Text style={styles.libraryButtonIcon}>🖼️</Text>
                <Text style={styles.libraryButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Identification Results */}
      {identificationResult && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>🎯 Identification Results</Text>
          <ScrollView style={styles.resultsList}>
            {identificationResult.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <Text style={styles.resultConfidence}>{result.confidence}% match</Text>
                </View>
                <Text style={styles.resultDescription}>{result.description}</Text>
                {scanMode === 'plant' ? (
                  <View style={styles.plantInfo}>
                    <Text style={[styles.safetyTag, result.isToxic ? styles.toxicTag : styles.safeTag]}>
                      {result.isToxic ? '⚠️ Toxic' : '✅ Non-toxic'}
                    </Text>
                    <Text style={[styles.edibleTag, result.isEdible ? styles.edibleSafeTag : styles.notEdibleTag]}>
                      {result.isEdible ? '🍃 Edible' : '🚫 Not edible'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.trackInfo}>
                    <Text style={styles.animalSize}>Size: {result.size}</Text>
                    <Text style={styles.safetyAdvice}>🛡️ {result.safety}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>
          {scanMode === 'plant' ? '🌿 Plant Identification Tips:' : '🐾 Track Identification Tips:'}
        </Text>
        <Text style={styles.instructionsText}>
          {scanMode === 'plant' 
            ? '• Take clear photos of leaves, flowers, and bark\n• Capture multiple angles for better accuracy\n• Ensure good lighting conditions\n• Include size reference when possible'
            : '• Photograph the entire track clearly\n• Include surrounding tracks if available\n• Add a coin or ruler for scale\n• Note the substrate (mud, sand, etc.)'
          }
        </Text>
      </View>

      {/* Recent Scans */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Scans</Text>
        <ScrollView style={styles.recentList}>
          {recentScans.map((scan) => (
            <TouchableOpacity key={scan.id} style={styles.scanItem}>
              <Image source={{ uri: scan.image }} style={styles.scanItemImage} />
              <View style={styles.scanItemLeft}>
                <Text style={styles.scanItemIcon}>{getScanIcon(scan.type)}</Text>
                <View style={styles.scanItemInfo}>
                  <Text style={styles.scanItemName}>{scan.name}</Text>
                  <Text style={styles.scanItemLocation}>{scan.location}</Text>
                </View>
              </View>
              <View style={styles.scanItemRight}>
                <Text style={styles.scanItemConfidence}>{scan.confidence}</Text>
                <Text style={styles.scanItemTime}>{scan.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" statusBarTranslucent>
        <View style={styles.cameraModal}>
          {cameraPermission?.granted ? (
            <CameraView 
              style={styles.camera} 
              ref={cameraRef}
              facing={CameraType.back}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.cameraHeader}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.cameraTitle}>
                    {scanMode === 'plant' ? '🌿 Plant Scanner' : '🐾 Track Scanner'}
                  </Text>
                  <View style={styles.placeholder} />
                </View>

                <View style={styles.cameraFrame}>
                  <View style={styles.focusArea}>
                    <Text style={styles.focusText}>
                      Position {scanMode === 'plant' ? 'plant' : 'track'} here
                    </Text>
                  </View>
                </View>

                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Camera access is required to scan plants and tracks</Text>
              <Button title="Grant Permission" onPress={requestCameraPermission} />
            </View>
          )}
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
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
  },
  activeModeButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: SPACING.XS,
  },
  modeText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  activeModeText: {
    color: COLORS.WHITE,
  },
  cameraContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  // Image Preview Styles
  imagePreviewContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  capturedImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    padding: SPACING.MD,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: COLORS.GRAY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
  },
  retakeButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: FONT_SIZE.SM,
  },
  identifyButton: {
    backgroundColor: COLORS.ACCENT,
    flex: 1,
    marginLeft: SPACING.SM,
  },
  identifyingButton: {
    backgroundColor: COLORS.GRAY,
  },
  
  // Camera Placeholder Styles
  cameraPlaceholder: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    alignItems: 'center',
    marginBottom: SPACING.MD,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    minHeight: 250,
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  cameraText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
  cameraSubtext: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  captureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cameraButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    minWidth: 100,
  },
  libraryButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    minWidth: 100,
  },
  cameraButtonIcon: {
    fontSize: 20,
    marginBottom: SPACING.XS,
  },
  libraryButtonIcon: {
    fontSize: 20,
    marginBottom: SPACING.XS,
  },
  cameraButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  libraryButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },

  // Results Styles
  resultsContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  resultsTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  resultName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  resultConfidence: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    lineHeight: 18,
  },
  plantInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trackInfo: {
    marginTop: SPACING.SM,
  },
  safetyTag: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    marginRight: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  toxicTag: {
    backgroundColor: COLORS.ERROR,
    color: COLORS.WHITE,
  },
  safeTag: {
    backgroundColor: COLORS.SUCCESS,
    color: COLORS.WHITE,
  },
  edibleTag: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
    fontSize: FONT_SIZE.XS,
    fontWeight: '600',
    marginBottom: SPACING.XS,
  },
  edibleSafeTag: {
    backgroundColor: COLORS.SUCCESS,
    color: COLORS.WHITE,
  },
  notEdibleTag: {
    backgroundColor: COLORS.WARNING,
    color: COLORS.WHITE,
  },
  animalSize: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  safetyAdvice: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },

  // Camera Modal Styles
  cameraModal: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  cameraTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  cameraFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XXL,
  },
  focusArea: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.XXL,
    paddingHorizontal: SPACING.LG,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.WHITE,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.WHITE,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  permissionText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LG,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  instructionsContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  instructionsTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  instructionsText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },
  recentTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  recentList: {
    flex: 1,
  },
  scanItem: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scanItemImage: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.MD,
  },
  scanItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanItemIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },
  scanItemInfo: {
    flex: 1,
  },
  scanItemName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  scanItemLocation: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  scanItemRight: {
    alignItems: 'flex-end',
  },
  scanItemConfidence: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  scanItemTime: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_LIGHT,
  },
});

export default ScannerScreen;
