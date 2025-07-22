import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ 
  children, 
  style, 
  variant = 'default',
  padding = 'medium',
  shadow = 'medium'
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const styles = createStyles({ colors, spacing, borderRadius, shadows });

  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Variants
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevatedCard);
        break;
      case 'outlined':
        baseStyle.push(styles.outlinedCard);
        break;
      case 'filled':
        baseStyle.push(styles.filledCard);
        break;
      default:
        baseStyle.push(styles.defaultCard);
    }
    
    // Padding
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.push(styles.smallPadding);
        break;
      case 'large':
        baseStyle.push(styles.largePadding);
        break;
      default:
        baseStyle.push(styles.mediumPadding);
    }
    
    // Shadow
    switch (shadow) {
      case 'none':
        break;
      case 'small':
        baseStyle.push(shadows.small);
        break;
      case 'large':
        baseStyle.push(shadows.large);
        break;
      default:
        baseStyle.push(shadows.medium);
    }
    
    return baseStyle;
  };

  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
};

const createStyles = ({ colors, spacing, borderRadius, shadows }) => StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  defaultCard: {
    backgroundColor: colors.card,
  },
  elevatedCard: {
    backgroundColor: colors.card,
    ...shadows.large,
  },
  outlinedCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filledCard: {
    backgroundColor: colors.cardSecondary,
  },
  smallPadding: {
    padding: spacing.md,
  },
  mediumPadding: {
    padding: spacing.lg,
  },
  largePadding: {
    padding: spacing.xl,
  },
});

export default Card;
