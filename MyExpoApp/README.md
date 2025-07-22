# MyExpoApp

A React Native project built with Expo, featuring a clean and organized folder structure.

## Project Structure

```
MyExpoApp/
├── App.js                 # Main app component
├── app.json              # Expo app configuration
├── package.json          # Dependencies and scripts
├── assets/               # Static assets
│   ├── images/          # App icons, photos, illustrations
│   ├── fonts/           # Custom fonts
│   └── icons/           # Icon assets
└── src/                 # Source code
    ├── components/      # Reusable UI components
    │   ├── Button.js   # Custom button component
    │   └── index.js    # Component exports
    ├── screens/         # Screen components
    │   ├── SplashScreen.js       # App launch screen
    │   ├── WelcomeScreen.js      # Onboarding with mission
    │   ├── LoginScreen.js        # User authentication
    │   ├── SignupScreen.js       # User registration
    │   ├── ForumScreen.js        # Community discussions
    │   ├── ScannerScreen.js      # Plant/track identification
    │   ├── RoutePlannerScreen.js # Trail planning
    │   ├── AIAssistantScreen.js  # AI chat assistance
    │   ├── OfflineMapScreen.js   # Map downloads
    │   └── index.js             # Screen exports
    ├── navigation/      # Navigation structure
    │   ├── AppNavigator.js      # Main app navigator
    │   ├── AuthNavigator.js     # Authentication flow
    │   ├── TabNavigator.js      # Bottom tab navigation
    │   ├── HomeTabScreen.js     # Home dashboard
    │   └── index.js            # Navigation exports
    ├── utils/           # Utility functions
    │   ├── validation.js # Form validation helpers
    │   ├── helpers.js   # General helper functions
    │   └── index.js    # Utility exports
    ├── services/        # API and external services
    │   └── api.js      # API service class
    ├── hooks/           # Custom React hooks
    │   └── useAsyncStorage.js
    ├── constants/       # App constants
    │   ├── colors.js   # Color palette
    │   ├── dimensions.js # Spacing, font sizes
    │   └── index.js    # Constants exports
    └── styles/          # Global styles
        └── globalStyles.js
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android  # Android
   npm run ios      # iOS (macOS required)
   npm run web      # Web
   ```

## Folder Structure Explanation

### `/src/components/`
Reusable UI components that can be used across multiple screens. Each component should be self-contained and reusable.

### `/src/screens/`
Screen-level components that represent different pages/views in your app. These typically correspond to different routes in your navigation.

### `/src/utils/`
Utility functions and helper methods that can be used throughout the app. Includes validation, formatting, and other common operations.

### `/src/services/`
External service integrations like API calls, authentication services, and third-party integrations.

### `/src/hooks/`
Custom React hooks for shared stateful logic that can be reused across components.

### `/src/constants/`
App-wide constants including colors, dimensions, API endpoints, and configuration values.

### `/src/styles/`
Global styles and theme definitions that ensure consistent styling across the app.

### `/assets/`
Static assets organized by type:
- `images/`: Photos, illustrations, app icons
- `fonts/`: Custom font files
- `icons/`: Icon assets and SVGs

## Development Guidelines

1. **Import Organization**: Use index.js files for cleaner imports
2. **Component Naming**: Use PascalCase for components
3. **File Naming**: Use camelCase for utility files, PascalCase for components
4. **Constants**: Use UPPER_CASE for constants
5. **Styling**: Prefer global styles for consistency, component-specific styles when needed

## App Flow

The Trail Guardian app follows this navigation flow:

1. **SplashScreen** - App launch with animated logo
2. **WelcomeScreen** - Mission statement and onboarding
3. **Authentication** - Login or Signup screens
4. **HomeScreen** - Main dashboard for trail guardians

### Authentication Flow:
- Welcome → "Get Started" → Login Screen
- Login → "Sign Up" → Signup Screen  
- Successful login/signup → Home Screen
- Back buttons return to Welcome Screen

## Key Features

### 🌲 WelcomeScreen:
- Beautiful forest background image
- Trail Guardian mission statement
- Feature highlights (monitoring, reports, community)
- Call-to-action "Get Started" button

### 🔐 Authentication:
- **LoginScreen**: Email/password with validation
- **SignupScreen**: Full registration with name, email, password
- Form validation with error handling
- Navigation between login and signup

### 🏠 HomeScreen:
- Welcome message for trail guardians
- Action buttons for monitoring and reports
- Statistics cards showing trail data
- Forest-themed design consistent with app brand

## Navigation Structure

The app uses React Navigation for smooth screen transitions:

### **Authentication Flow:**
1. **SplashScreen** → Shows for 2 seconds on app launch
2. **WelcomeScreen** → Onboarding (shown once per install)
3. **LoginScreen** ↔ **SignupScreen** → Authentication
4. **TabNavigator** → Main app with bottom tabs

### **Tab Navigation:**
- **🏠 Home** - Dashboard with quick actions and recent activity
- **🗣️ Forum** - Community discussions and trail reports
- **🔍 Scanner** - Plant and animal track identification
- **🗺️ Routes** - Trail planning and route discovery
- **🤖 AI Help** - AI assistant for trail advice
- **📍 Maps** - Offline map downloads

### **Persistent State:**
- Uses AsyncStorage for authentication persistence
- Remembers if user has seen onboarding
- Maintains login state across app restarts

## Installed Packages

- `expo-linear-gradient` - Gradient overlays for better text readability
- `@react-navigation/native` - Core navigation library
- `@react-navigation/native-stack` - Stack navigator for auth flow
- `@react-navigation/bottom-tabs` - Bottom tab navigation
- `react-native-screens` - Native screen components
- `react-native-safe-area-context` - Safe area handling
- `@react-native-async-storage/async-storage` - Persistent storage

## Additional Packages to Consider

- `@react-navigation/native` - Professional navigation system
- `@react-native-async-storage/async-storage` - User session persistence
- `react-native-vector-icons` - Icon library
- `react-native-gesture-handler` - Enhanced gestures
- `expo-font` - Custom typography
- `expo-image-picker` - Trail photo capture
- `expo-location` - GPS tracking for trails
