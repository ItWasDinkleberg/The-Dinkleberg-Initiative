// Environment configuration for the Trail Guardian app
// Note: Never commit actual API keys to version control

export const config = {
  // OpenAI Configuration
  openai: {
    // Set your OpenAI API key here or use the in-app settings
    // You can also set this as an environment variable
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.7,
  },
  
  // API endpoints
  api: {
    openaiUrl: 'https://api.openai.com/v1/chat/completions',
  },
  
  // App configuration
  app: {
    enableLocalMode: true, // Allow fallback to local responses
    maxConversationHistory: 50, // Maximum messages to store
    apiTimeout: 30000, // 30 seconds
  }
};

// Helper function to check if OpenAI is configured
export const isOpenAIConfigured = () => {
  return !!(config.openai.apiKey && config.openai.apiKey.length > 0);
};

// Helper function to get API key from storage or config
export const getOpenAIApiKey = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const storedKey = await AsyncStorage.getItem('openai_api_key');
    return storedKey || config.openai.apiKey;
  } catch (error) {
    return config.openai.apiKey;
  }
};
