import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const { colors, typography, spacing } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after animations complete
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

  const styles = createStyles({ colors, typography, spacing });

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo placeholder - you can replace this with an actual logo image */}
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>🌲</Text>
          </View>
          <View style={styles.logoShield}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.appName}>Trail Guardian</Text>
        <Text style={styles.tagline}>Protecting Nature's Pathways</Text>
      </Animated.View>

      {/* Decorative elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.leaf, styles.leafLeft]} />
        <View style={[styles.leaf, styles.leafRight]} />
      </View>
    </View>
  );
};

const createStyles = ({ colors, typography, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  logoContainer: {
    marginBottom: spacing.xxxl,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 4,
    borderColor: colors.accent,
    position: 'relative',
  },
  logoIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  logoText: {
    fontSize: 40,
  },
  logoShield: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  shieldText: {
    fontSize: 25,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  appName: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 2,
    textShadowColor: colors.text,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: typography.fontSize.md,
    color: colors.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  leaf: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.accentLight,
    borderRadius: 15,
    opacity: 0.3,
  },
  leafLeft: {
    top: height * 0.2,
    left: width * 0.1,
    transform: [{ rotate: '45deg' }],
  },
  leafRight: {
    bottom: height * 0.2,
    right: width * 0.1,
    transform: [{ rotate: '-45deg' }],
  },
});

export default SplashScreen;
