import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { Button } from '../components';

const OfflineMapScreen = () => {
  const [downloadingMaps, setDownloadingMaps] = useState({});
  
  const mapRegions = [
    {
      id: 1,
      name: "Pine Ridge National Forest",
      size: "2.1 GB",
      trails: 15,
      downloaded: true,
      lastUpdated: "2024-01-15",
      coverage: "Complete trail network with elevation data"
    },
    {
      id: 2,
      name: "Cascade Mountains Region",
      size: "3.4 GB", 
      trails: 28,
      downloaded: false,
      lastUpdated: "2024-01-12",
      coverage: "High-resolution topographic maps"
    },
    {
      id: 3,
      name: "Desert Trails Network",
      size: "1.8 GB",
      trails: 12,
      downloaded: false,
      lastUpdated: "2024-01-10",
      coverage: "Desert hiking trails with water sources"
    },
    {
      id: 4,
      name: "Coastal Hiking Paths",
      size: "2.7 GB",
      trails: 22,
      downloaded: true,
      lastUpdated: "2024-01-18",
      coverage: "Beach access and cliff trails"
    }
  ];

  const downloadedMaps = mapRegions.filter(map => map.downloaded);
  const availableMaps = mapRegions.filter(map => !map.downloaded);

  const handleDownload = (mapId) => {
    setDownloadingMaps(prev => ({ ...prev, [mapId]: true }));
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingMaps(prev => ({ ...prev, [mapId]: false }));
      Alert.alert(
        'Download Complete!',
        'Map region has been downloaded and is now available offline.',
        [{ text: 'OK' }]
      );
    }, 3000);
  };

  const handleDelete = (mapId, mapName) => {
    Alert.alert(
      'Delete Offline Map',
      `Are you sure you want to delete "${mapName}"? This will free up storage space but you'll need internet to view this area.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle map deletion
            console.log('Deleting map:', mapId);
          }
        }
      ]
    );
  };

  const getTotalStorage = () => {
    const total = downloadedMaps.reduce((sum, map) => {
      return sum + parseFloat(map.size.replace(' GB', ''));
    }, 0);
    return total.toFixed(1);
  };

  const MapCard = ({ map, isDownloaded }) => (
    <View style={styles.mapCard}>
      <View style={styles.mapHeader}>
        <View style={styles.mapInfo}>
          <Text style={styles.mapName}>{map.name}</Text>
          <View style={styles.mapStats}>
            <Text style={styles.mapStat}>📍 {map.trails} trails</Text>
            <Text style={styles.mapStat}>💾 {map.size}</Text>
            <Text style={styles.mapStat}>🗓️ Updated {map.lastUpdated}</Text>
          </View>
        </View>
        <View style={styles.mapStatus}>
          {isDownloaded ? (
            <View style={styles.downloadedBadge}>
              <Text style={styles.downloadedText}>✓ Downloaded</Text>
            </View>
          ) : (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.mapCoverage}>{map.coverage}</Text>

      <View style={styles.mapActions}>
        {isDownloaded ? (
          <>
            <Button
              title="Open Map"
              style={styles.openButton}
              onPress={() => console.log('Opening map:', map.name)}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(map.id, map.name)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            title={downloadingMaps[map.id] ? "Downloading..." : "Download"}
            style={[styles.downloadButton, downloadingMaps[map.id] && styles.downloadingButton]}
            disabled={downloadingMaps[map.id]}
            onPress={() => handleDownload(map.id)}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Offline Maps</Text>
        <Text style={styles.subtitle}>Download maps for offline trail navigation</Text>
      </View>

      {/* Storage Info */}
      <View style={styles.storageContainer}>
        <View style={styles.storageInfo}>
          <Text style={styles.storageTitle}>📱 Storage Used</Text>
          <Text style={styles.storageAmount}>{getTotalStorage()} GB of maps downloaded</Text>
        </View>
        <TouchableOpacity style={styles.manageStorageButton}>
          <Text style={styles.manageStorageText}>Manage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Downloaded Maps */}
        {downloadedMaps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Downloaded Maps ({downloadedMaps.length})</Text>
            {downloadedMaps.map((map) => (
              <MapCard key={map.id} map={map} isDownloaded={true} />
            ))}
          </View>
        )}

        {/* Available Maps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☁️ Available for Download ({availableMaps.length})</Text>
          {availableMaps.map((map) => (
            <MapCard key={map.id} map={map} isDownloaded={false} />
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Offline Map Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• Download maps over Wi-Fi to save mobile data</Text>
            <Text style={styles.tipText}>• Maps work without internet but GPS still requires minimal signal</Text>
            <Text style={styles.tipText}>• Update maps regularly for the latest trail information</Text>
            <Text style={styles.tipText}>• Download maps for your destination before leaving home</Text>
            <Text style={styles.tipText}>• Larger regions provide more comprehensive coverage</Text>
          </View>
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="🌐 Check for Updates"
          style={styles.updateButton}
          onPress={() => Alert.alert('Checking for Updates', 'All maps are up to date!')}
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
  storageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.LG,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storageInfo: {
    flex: 1,
  },
  storageTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  storageAmount: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  manageStorageButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
  },
  manageStorageText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  mapCard: {
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
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  mapInfo: {
    flex: 1,
  },
  mapName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  mapStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mapStat: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    marginRight: SPACING.MD,
    marginBottom: SPACING.XS,
  },
  mapStatus: {
    alignItems: 'flex-end',
  },
  downloadedBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  downloadedText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: COLORS.INFO,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  availableText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  mapCoverage: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: 18,
  },
  mapActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    marginRight: SPACING.SM,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.MD,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: COLORS.ACCENT,
  },
  downloadingButton: {
    backgroundColor: COLORS.GRAY,
  },
  tipsContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  tipsTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  tipsList: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  tipText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.SM,
  },
  quickActions: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
  },
  updateButton: {
    backgroundColor: COLORS.SECONDARY,
  },
});

export default OfflineMapScreen;
