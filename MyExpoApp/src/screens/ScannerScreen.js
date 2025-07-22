import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button } from '../components';

const ScannerScreen = () => {
  const [scanMode, setScanMode] = useState('plant'); // 'plant' or 'track'
  const [isScanning, setIsScanning] = useState(false);

  const recentScans = [
    { id: 1, type: 'plant', name: 'Douglas Fir', confidence: '95%', location: 'Pine Ridge Trail', time: '2 hours ago' },
    { id: 2, type: 'track', name: 'White-tailed Deer', confidence: '87%', location: 'Cascade Falls', time: '1 day ago' },
    { id: 3, type: 'plant', name: 'Wild Blueberry', confidence: '92%', location: 'Mountain Loop', time: '2 days ago' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'Scan Complete!',
        scanMode === 'plant' 
          ? 'Found: Mountain Laurel (Confidence: 89%)\nLocation recorded and added to your trail log.'
          : 'Found: Bear Track (Confidence: 78%)\nRecommendation: Exercise caution in this area.',
        [{ text: 'OK' }]
      );
    }, 3000);
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

      {/* Camera Area */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraFrame}>
          {isScanning ? (
            <View style={styles.scanningContainer}>
              <Text style={styles.scanningIcon}>🔄</Text>
              <Text style={styles.scanningText}>
                Scanning {scanMode === 'plant' ? 'plant' : 'animal track'}...
              </Text>
              <Text style={styles.scanningSubtext}>Keep camera steady</Text>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraIcon}>📸</Text>
              <Text style={styles.cameraText}>
                Point camera at {scanMode === 'plant' ? 'plant or flower' : 'animal track'}
              </Text>
              <Text style={styles.cameraSubtext}>
                {scanMode === 'plant' 
                  ? 'Position plant in center of frame'
                  : 'Ensure track is clearly visible'
                }
              </Text>
            </View>
          )}
        </View>
        
        <Button
          title={isScanning ? 'Scanning...' : `Scan ${scanMode === 'plant' ? 'Plant' : 'Track'}`}
          onPress={handleScan}
          disabled={isScanning}
          style={[styles.scanButton, isScanning && styles.scanningButton]}
        />
      </View>

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
  cameraFrame: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    height: 250,
    marginBottom: SPACING.MD,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  scanningIcon: {
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
  scanningText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
  cameraSubtext: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scanningSubtext: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: COLORS.ACCENT,
  },
  scanningButton: {
    backgroundColor: COLORS.GRAY,
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
