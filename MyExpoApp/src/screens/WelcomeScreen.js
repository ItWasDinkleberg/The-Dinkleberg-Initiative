import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { Button } from '../components';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ onGetStarted, navigation }) => {
  
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
    if (navigation) {
      navigation.navigate('Login');
    }
  };
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Dark overlay for text readability */}
      <LinearGradient
        colors={['rgba(26, 48, 9, 0.7)', 'rgba(45, 80, 22, 0.8)', 'rgba(26, 48, 9, 0.9)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🌲🛡️</Text>
            </View>
            <Text style={styles.appTitle}>Trail Guardian</Text>
            <Text style={styles.appSubtitle}>Protecting Nature's Pathways</Text>
          </View>

          {/* Mission Statement Section */}
          <View style={styles.missionSection}>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              Empowering trail enthusiasts and conservationists to monitor, 
              protect, and preserve hiking trails for future generations. 
              Together, we ensure that nature's pathways remain safe, 
              accessible, and pristine.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📍</Text>
                <Text style={styles.featureText}>Trail Monitoring</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🌿</Text>
                <Text style={styles.featureText}>Conservation Reports</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>👥</Text>
                <Text style={styles.featureText}>Community Driven</Text>
              </View>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              textStyle={styles.getStartedButtonText}
            />
            
            <Text style={styles.joinText}>
              Join thousands of trail guardians making a difference
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },
  headerSection: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.XXL,
  },
  logoContainer: {
    marginBottom: SPACING.MD,
  },
  logoEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  appTitle: {
    fontSize: FONT_SIZE.XXL + 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.SM,
    letterSpacing: 2,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 6,
  },
  appSubtitle: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.EARTH_TAN,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 3,
  },
  missionSection: {
    flex: 0.45,
    justifyContent: 'center',
    paddingHorizontal: SPACING.SM,
  },
  missionTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.LG,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 3,
  },
  missionText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.XL,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.LG,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: SPACING.XS,
  },
  featureText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.WHITE,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  actionSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SPACING.XXL,
  },
  getStartedButton: {
    backgroundColor: COLORS.ACCENT_LIGHT,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XXL,
    borderRadius: 30,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    minWidth: width * 0.6,
  },
  getStartedButtonText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    letterSpacing: 1,
  },
  joinText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.EARTH_TAN,
    textAlign: 'center',
    marginTop: SPACING.MD,
    fontStyle: 'italic',
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
});

export default WelcomeScreen;
