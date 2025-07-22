import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';

const AIScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [useLocalMode, setUseLocalMode] = useState(true);
  const scrollViewRef = useRef();

  // Enhanced survival-focused quick questions
  const survivalQuestions = [
    "What are the essential items for a survival kit?",
    "How do I find and purify water in the wilderness?",
    "What are signs of hypothermia and how do I treat it?",
    "How do I signal for help if I'm lost?",
    "What plants are safe to eat in North American forests?",
    "How do I build an emergency shelter?",
    "What should I do if I encounter a bear?",
    "How do I navigate without a compass?",
    "What are the signs of dehydration?",
    "How do I start a fire without matches?",
    "What should I do if someone is having an allergic reaction?",
    "How do I treat cuts and wounds in the wilderness?"
  ];

  const systemPrompt = `You are an expert wilderness survival and hiking safety AI assistant for the Trail Guardian app. You specialize in:

1. Wilderness survival techniques and emergency procedures
2. Hiking and trail safety best practices
3. Wildlife encounters and safety protocols
4. Plant identification and foraging safety
5. Navigation and orienteering
6. First aid and medical emergencies in remote areas
7. Weather-related safety and preparation
8. Leave No Trace principles and conservation

Always provide practical, actionable advice that prioritizes safety. If a question involves serious medical emergencies, always recommend seeking professional medical help when possible while providing immediate care guidance. Be concise but thorough, and use clear, easy-to-follow instructions.

Include relevant emojis to make responses more engaging and scannable. Structure longer responses with bullet points or numbered steps when appropriate.`;

  useEffect(() => {
    loadApiKey();
    loadConversationHistory();
    initializeConversation();
  }, []);

  const loadApiKey = async () => {
    try {
      const savedKey = await AsyncStorage.getItem('openai_api_key');
      if (savedKey) {
        setApiKey(savedKey);
        setUseLocalMode(false);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async (key) => {
    try {
      if (key.trim()) {
        await AsyncStorage.setItem('openai_api_key', key.trim());
        setApiKey(key.trim());
        setUseLocalMode(false);
        setShowApiKeyInput(false);
        Alert.alert('Success', 'OpenAI API key saved successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const loadConversationHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('ai_conversation_history');
      if (saved) {
        const history = JSON.parse(saved);
        if (history.length > 0) {
          setMessages(history);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const saveConversationHistory = async (newMessages) => {
    try {
      // Keep only last 50 messages to manage storage
      const messagesToSave = newMessages.slice(-50);
      await AsyncStorage.setItem('ai_conversation_history', JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  };

  const initializeConversation = () => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: generateId(),
        type: 'ai',
        text: "🏔️ Welcome to your Trail Guardian AI Assistant! I'm here to help you with wilderness survival, hiking safety, and outdoor emergency situations.\n\n🎯 **I can help you with:**\n• Emergency survival techniques\n• Wildlife safety protocols\n• First aid in remote areas\n• Navigation and signaling\n• Water purification and food safety\n• Weather-related precautions\n\nWhat survival or safety question can I help you with today?",
        timestamp: new Date(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: generateId(),
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);

    try {
      let response;
      if (useLocalMode || !apiKey) {
        response = await getLocalResponse(userMessage.text);
      } else {
        response = await getOpenAIResponse(userMessage.text, updatedMessages);
      }

      const aiMessage = {
        id: generateId(),
        type: 'ai',
        text: response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveConversationHistory(finalMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: generateId(),
        type: 'ai',
        text: "⚠️ I'm having trouble connecting right now. Please check your internet connection or try again later. In the meantime, remember the basic survival priorities: shelter, water, fire, and signaling for help.",
        timestamp: new Date(),
        isError: true
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const getOpenAIResponse = async (userMessage, conversationHistory) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  };

  const getLocalResponse = async (userText) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerText = userText.toLowerCase();
    
    // Enhanced survival-focused responses
    if (lowerText.includes('survival kit') || lowerText.includes('essential items')) {
      return "🎒 **Essential Survival Kit Items:**\n\n🔥 **Fire & Warmth:**\n• Waterproof matches/lighter\n• Fire starter (tinder)\n• Emergency blanket/bivvy\n\n💧 **Water & Food:**\n• Water purification tablets\n• Emergency water filter\n• High-energy food bars\n• Fishing line & hooks\n\n🧭 **Navigation & Signaling:**\n• Compass & map\n• Whistle (3 sharp blasts = distress)\n• Mirror for signaling\n• Bright colored cloth/flag\n\n🏥 **Medical & Tools:**\n• First aid kit\n• Multi-tool knife\n• Paracord (50+ feet)\n• Duct tape\n\n⚠️ **Remember:** Practice using these items before you need them!";
    }
    
    if (lowerText.includes('water') && (lowerText.includes('find') || lowerText.includes('purify'))) {
      return "💧 **Finding & Purifying Water:**\n\n🔍 **Finding Water Sources:**\n• Follow animal trails (lead to water)\n• Look for green vegetation\n• Listen for running water\n• Collect dew with cloth in early morning\n• Dig in dry creek beds\n\n🧪 **Purification Methods:**\n1. **Boiling:** 1 minute at sea level, 3 minutes above 6,500ft\n2. **Purification tablets:** Follow package instructions\n3. **UV sterilization:** Clear water only\n4. **Improvised filter:** Sand, charcoal, cloth layers\n\n⚠️ **Never drink:** Stagnant water, water with algae, or cloudy water without treatment. When in doubt, always purify!";
    }
    
    if (lowerText.includes('hypothermia')) {
      return "🥶 **Hypothermia Recognition & Treatment:**\n\n🚨 **Signs of Hypothermia:**\n• Shivering (early stage)\n• Confusion, slurred speech\n• Loss of coordination\n• Drowsiness, weak pulse\n• No shivering (severe stage)\n\n🏥 **Immediate Treatment:**\n1. **Get out of cold/wet conditions**\n2. **Remove wet clothing**\n3. **Insulate with dry materials**\n4. **Warm the core first** (chest, neck, head)\n5. **Give warm, sweet drinks** (if conscious)\n6. **Seek immediate medical help**\n\n⚠️ **DON'T:** Give alcohol, rub extremities, or use direct heat. Handle gently - rough movement can cause cardiac arrest!";
    }
    
    if (lowerText.includes('signal') || lowerText.includes('lost') || lowerText.includes('help')) {
      return "🆘 **Signaling for Help:**\n\n📢 **Universal Distress Signals:**\n• **Three of anything:** 3 whistle blasts, 3 horn honks, 3 gunshots\n• **SOS:** ... --- ... (Morse code)\n• **Mirror signals:** Flash aircraft/rescuers\n• **Ground signals:** Large X or SOS visible from air\n\n🔥 **Signal Fires:**\n• Build 3 fires in triangle (100ft apart)\n• Add green vegetation for smoke during day\n• Bright flames at night\n\n📱 **Modern Methods:**\n• Cell phone (even without signal, may work for 911)\n• Personal locator beacon (PLB)\n• Satellite messenger\n\n🧭 **If Lost - STOP:**\n• **S**it and calm down\n• **T**hink about how you got here\n• **O**bserve your surroundings\n• **P**lan your next move\n\n Stay put if possible - you're easier to find!";
    }
    
    if (lowerText.includes('bear')) {
      return "🐻 **Bear Encounter Safety:**\n\n🚫 **Prevention:**\n• Make noise while hiking\n• Store food in bear containers\n• Cook/eat 200ft from sleeping area\n• Never approach or feed bears\n\n😱 **If You See a Bear:**\n• **Don't run!** Bears can run 35+ mph\n• Avoid direct eye contact\n• Back away slowly\n• Speak in calm, firm voice\n• Make yourself appear large\n\n⚡ **If Bear Approaches:**\n• **Black Bear:** Fight back with everything you have\n• **Grizzly Bear:** Play dead (lie flat, protect neck)\n• Use bear spray when bear is 10-30 feet away\n\n🎒 **Always carry bear spray** in bear country and know how to use it!\n\n🆘 **After any bear encounter:** Report to park authorities immediately.";
    }
    
    if (lowerText.includes('fire') && !lowerText.includes('signal')) {
      return "🔥 **Starting Fire Without Matches:**\n\n⚡ **Fire Starting Methods:**\n1. **Flint & Steel/Ferro Rod:**\n   • Strike ferro rod with steel\n   • Aim sparks at tinder\n\n2. **Bow Drill Method:**\n   • Dry wood spindle & baseboard\n   • Create friction to make ember\n   • Transfer ember to tinder nest\n\n3. **Fire Plow:**\n   • Rub hardwood stick in softwood groove\n   • Push wood dust to end, ignite\n\n🪶 **Tinder Ideas:**\n• Birch bark, dry grass, pine needles\n• Paper, cloth, char cloth\n• Steel wool + battery\n\n🏗️ **Fire Structure:**\n1. Tinder (pencil-thin)\n2. Kindling (thumb-thick)\n3. Fuel wood (wrist-thick+)\n\n💨 **Remember:** Fire needs oxygen, fuel, and heat. Build up gradually!";
    }
    
    if (lowerText.includes('shelter')) {
      return "🏠 **Emergency Shelter Building:**\n\n🌡️ **Shelter Priority:** Protection from wind, rain, and ground cold\n\n🏗️ **Quick Shelter Types:**\n\n**Lean-to:**\n• Find/make ridgepole between trees\n• Lean branches against ridgepole\n• Cover with bark, leaves, pine boughs\n\n**Debris Hut:**\n• Build frame like lean-to\n• Pile debris 3-4 feet thick\n• Create insulation layer inside\n\n**Tree Well:**\n• Use natural depression around large tree\n• Add roof of branches\n• Insulate floor with pine boughs\n\n🛏️ **Ground Insulation:** Critical! Use:\n• Pine boughs, leaves, or debris\n• Emergency blanket/bivy\n• Anything to get off cold ground\n\n⏰ **Start building shelter early** - before you get cold and tired!";
    }
    
    // Default response for unrecognized queries
    return "🏔️ I'm here to help with wilderness survival and hiking safety! I can provide advice on:\n\n• Emergency survival techniques\n• Wildlife encounters and safety\n• Finding and purifying water\n• Building emergency shelters\n• Fire starting methods\n• Navigation and signaling for help\n• First aid in remote areas\n• Weather-related safety\n\nWhat specific survival situation would you like guidance on? The more details you provide, the better I can help you prepare for or handle the situation safely.";
  };

  const sendQuickQuestion = (question) => {
    setMessage(question);
    setTimeout(() => sendMessage(), 100);
  };

  const clearConversation = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            AsyncStorage.removeItem('ai_conversation_history');
            initializeConversation();
          }
        }
      ]
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>🆘 Survival AI Assistant</Text>
          <Text style={styles.subtitle}>
            {useLocalMode ? 'Local Mode' : 'OpenAI Powered'} • Wilderness Expert
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowApiKeyInput(!showApiKeyInput)}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearConversation}>
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* API Key Configuration */}
      {showApiKeyInput && (
        <View style={styles.apiKeyContainer}>
          <Text style={styles.apiKeyLabel}>OpenAI API Key (Optional):</Text>
          <View style={styles.apiKeyRow}>
            <TextInput
              style={styles.apiKeyInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-..."
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.saveApiKeyButton}
              onPress={() => saveApiKey(apiKey)}
            >
              <Text style={styles.saveApiKeyText}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.localModeContainer}>
            <Text style={styles.localModeLabel}>Use Local Mode:</Text>
            <Switch
              value={useLocalMode}
              onValueChange={setUseLocalMode}
              trackColor={{ false: COLORS.GRAY_LIGHT, true: COLORS.PRIMARY_LIGHT }}
              thumbColor={useLocalMode ? COLORS.PRIMARY : COLORS.WHITE}
            />
          </View>
          <Text style={styles.apiKeyNote}>
            💡 Local mode provides pre-programmed survival responses. Add your OpenAI API key for personalized AI assistance.
          </Text>
        </View>
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.type === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={[styles.messageText, msg.type === 'user' ? styles.userMessageText : styles.aiMessageText]}>
              {msg.text}
            </Text>
            <Text style={[styles.messageTime, msg.type === 'user' ? styles.userMessageTime : styles.aiMessageTime]}>
              {formatTime(msg.timestamp)}
            </Text>
          </View>
        ))}
        
        {isLoading && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.PRIMARY} />
              <Text style={[styles.messageText, styles.aiMessageText, styles.loadingText]}>
                Getting survival advice...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Survival Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <Text style={styles.quickQuestionsTitle}>🚨 Emergency Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {survivalQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionChip}
              onPress={() => sendQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about wilderness survival, safety, or emergencies..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <Text style={styles.sendButtonText}>🆘</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.ERROR,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },
  clearIcon: {
    fontSize: 20,
  },
  apiKeyContainer: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  apiKeyLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  apiKeyRow: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
  },
  apiKeyInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: FONT_SIZE.SM,
    marginRight: SPACING.SM,
  },
  saveApiKeyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
  },
  saveApiKeyText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
  localModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  localModeLabel: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  apiKeyNote: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_LIGHT,
    fontStyle: 'italic',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.MD,
  },
  messageBubble: {
    maxWidth: '85%',
    marginBottom: SPACING.MD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.PRIMARY,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  messageText: {
    fontSize: FONT_SIZE.MD,
    lineHeight: 20,
  },
  userMessageText: {
    color: COLORS.WHITE,
  },
  aiMessageText: {
    color: COLORS.TEXT_PRIMARY,
  },
  messageTime: {
    fontSize: FONT_SIZE.XS,
    marginTop: SPACING.XS,
  },
  userMessageTime: {
    color: COLORS.WHITE,
    opacity: 0.8,
    textAlign: 'right',
  },
  aiMessageTime: {
    color: COLORS.TEXT_LIGHT,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: SPACING.SM,
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  quickQuestionsTitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.ERROR,
    marginBottom: SPACING.SM,
  },
  quickQuestionChip: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    maxWidth: 200,
  },
  quickQuestionText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    alignItems: 'flex-end',
    backgroundColor: COLORS.WHITE,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZE.MD,
    maxHeight: 100,
    marginRight: SPACING.SM,
  },
  sendButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.GRAY,
  },
  sendButtonText: {
    fontSize: FONT_SIZE.LG,
  },
});

export default AIScreen;
