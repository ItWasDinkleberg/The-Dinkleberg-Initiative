# Dark Mode & Styling System - Trail Guardian App

## 🌗 Dark Mode Implementation

### Theme Context System
The app now features a comprehensive theme system with Dark/Light mode support:

- **ThemeProvider**: Wraps the entire app to provide theme context
- **useTheme Hook**: Provides access to colors, typography, spacing, and more
- **Persistent Storage**: Theme preference saved to AsyncStorage
- **Dynamic Status Bar**: Automatically adjusts based on theme

### Color Schemes

#### Light Theme (Earth Tones):
```javascript
Primary: #2D5016 (Dark Forest Green)
Secondary: #8B4513 (Saddle Brown)
Background: #F8F6F0 (Warm White)
Card: #FFFFFF (Pure White)
Text: #2C3E14 (Dark Green Text)
Accent: #D2691E (Chocolate)
```

#### Dark Theme (Earth Tones):
```javascript
Primary: #4A7C2A (Lighter Forest Green)
Secondary: #CD853F (Peru)
Background: #1C1917 (Dark Brown)
Card: #332F2A (Dark Card)
Text: #F5F3EE (Light Earth Text)
Accent: #F4A460 (Sandy Brown)
```

## 🎨 Comprehensive Styling System

### Typography System:
```javascript
Font Sizes: xs(12) → sm(14) → md(16) → lg(18) → xl(20) → xxl(24) → xxxl(28)
Font Weights: light(300) → regular(400) → medium(500) → semiBold(600) → bold(700)
Line Heights: Proportional to font sizes for optimal readability
```

### Spacing System:
```javascript
Spacing: xs(4) → sm(8) → md(12) → lg(16) → xl(20) → xxl(24) → xxxl(32)
```

### Border Radius System:
```javascript
Border Radius: xs(4) → sm(6) → md(8) → lg(12) → xl(16) → xxl(20) → round(50)
```

### Shadow System:
- **Small Shadow**: Subtle elevation for inputs and small cards
- **Medium Shadow**: Standard elevation for cards and buttons
- **Large Shadow**: High elevation for modals and important elements

## 🔧 Component Updates

### Enhanced Button Component:
```javascript
// Multiple variants and sizes
<Button title="Primary" variant="primary" size="medium" />
<Button title="Secondary" variant="secondary" size="large" />
<Button title="Outlined" variant="outline" size="small" />
<Button title="Ghost" variant="ghost" />
```

### Enhanced Input Component:
```javascript
// Multiple sizes and variants
<Input label="Email" size="medium" variant="default" />
<Input placeholder="Search..." size="small" variant="search" />
<Input label="Description" size="large" />
```

### New Card Component:
```javascript
// Flexible card system
<Card variant="default" padding="medium" shadow="medium">
  <Text>Card Content</Text>
</Card>
<Card variant="elevated" padding="large" shadow="large" />
<Card variant="outlined" padding="small" shadow="none" />
```

## 📱 Settings Screen

### Dark Mode Toggle:
- **Settings Icon**: Accessible from home screen header
- **Theme Toggle**: Switch between light and dark modes
- **Instant Application**: Theme changes immediately across app
- **Persistence**: Theme preference saved for future sessions

### Settings Categories:
1. **Appearance**: Dark mode toggle, theme preferences
2. **Notifications**: Push notifications, emergency alerts, forum updates
3. **Privacy & Data**: Location sharing, public profile, data backup
4. **Support**: Help & FAQ, feedback, about
5. **Account**: Edit profile, sign out

## 🏗️ Navigation Updates

### Stack Navigation Structure:
```
App
├── ThemeProvider
│   ├── SplashScreen
│   ├── AuthNavigator (Welcome → Login → Signup)
│   └── MainStackNavigator
│       ├── TabNavigator (Home, Forum, Scanner, etc.)
│       └── SettingsScreen (Modal presentation)
```

### Settings Integration:
- **Header Button**: Settings gear icon in home screen
- **Modal Presentation**: Settings screen opens as modal
- **Proper Navigation**: Back button returns to previous screen

## 🎯 Styled Screens

### Updated Screens with Theme System:
1. **SplashScreen**: Earth-tone colors, dynamic theme support
2. **HomeTabScreen**: Card-based layout, consistent spacing
3. **SettingsScreen**: Professional settings interface
4. **Button & Input Components**: Multiple variants and sizes

### Design Patterns:
- **Rounded Cards**: All content in rounded, elevated cards
- **Consistent Spacing**: Standardized padding and margins
- **Earth Tone Palette**: Nature-inspired color scheme
- **Professional Typography**: Clear hierarchy and readability

## 📐 Layout Standards

### Card Layout:
```javascript
// Standard card structure
<Card variant="default" padding="large" shadow="medium">
  <Text style={styles.cardTitle}>Section Title</Text>
  <Text style={styles.cardContent}>Content goes here</Text>
</Card>
```

### Grid System:
```javascript
// Action cards grid
<View style={styles.actionsGrid}>
  {actions.map(action => (
    <TouchableOpacity style={styles.actionCard}>
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  ))}
</View>
```

### Header Pattern:
```javascript
// Consistent header with actions
<View style={styles.header}>
  <View style={styles.headerContent}>
    <Text style={styles.title}>Screen Title</Text>
    <Text style={styles.subtitle}>Screen Description</Text>
  </View>
  <View style={styles.headerActions}>
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionIcon}>⚙️</Text>
    </TouchableOpacity>
  </View>
</View>
```

## 🌟 Key Benefits

### User Experience:
✅ **Dark Mode**: Reduces eye strain in low-light conditions
✅ **Consistent Design**: Unified look and feel across all screens
✅ **Accessibility**: High contrast ratios and readable typography
✅ **Personalization**: User choice between light and dark themes

### Developer Experience:
✅ **Theme System**: Centralized color and style management
✅ **Reusable Components**: Consistent Button, Input, and Card components
✅ **Type Safety**: Structured theme object with TypeScript support
✅ **Easy Maintenance**: Single source of truth for all styling

### Performance:
✅ **Optimized Renders**: Theme context prevents unnecessary re-renders
✅ **Cached Styles**: StyleSheet.create for optimal performance
✅ **Memory Efficient**: Reusable style functions
✅ **Fast Switching**: Instant theme changes without flicker

## 🔄 Usage Examples

### Theme Integration:
```javascript
// In any component
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { colors, typography, spacing, isDark, toggleTheme } = useTheme();
  const styles = createStyles({ colors, typography, spacing });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};
```

### Dynamic Styles:
```javascript
// Style creation with theme
const createStyles = ({ colors, typography, spacing }) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
});
```

## 🚀 Future Enhancements

### Planned Features:
- **System Theme Detection**: Auto-follow device theme setting
- **Theme Scheduling**: Automatic dark mode at sunset
- **Custom Color Schemes**: User-defined color palettes
- **Accessibility Options**: High contrast mode, larger text sizes
- **Animation Preferences**: Reduced motion support

The Trail Guardian app now features a professional, accessible, and beautiful design system that enhances both the user experience and developer workflow! 🌲✨
