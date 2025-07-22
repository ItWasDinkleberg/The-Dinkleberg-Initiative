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
    │   ├── HomeScreen.js
    │   └── index.js    # Screen exports
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

## Additional Packages to Consider

- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-vector-icons` - Icons
- `react-native-gesture-handler` - Gestures
- `expo-font` - Custom fonts
- `expo-image-picker` - Image selection
