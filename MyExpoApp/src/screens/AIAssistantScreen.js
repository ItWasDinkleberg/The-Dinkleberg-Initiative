import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';

const AIAssistantScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your Trail Guardian AI assistant. I can help you with trail recommendations, safety tips, wildlife information, and answer any questions about hiking and conservation. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const quickQuestions = [
    "What should I pack for a day hike?",
    "How do I identify poison ivy?",
    "Best trails for beginners?",
    "Wildlife safety tips",
    "Weather conditions today",
    "Leave No Trace principles"
  ];

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('pack') || lowerText.includes('gear')) {
      return "For a day hike, I recommend packing:\n\n🎒 **Essentials:**\n• Water (2-3 liters)\n• Snacks/lunch\n• First aid kit\n• Map and compass/GPS\n• Headlamp/flashlight\n• Extra layers\n• Rain gear\n• Sunscreen and hat\n\n🌲 **Trail Guardian Tips:**\n• Always inform someone of your plans\n• Check weather conditions\n• Start early to avoid afternoon storms\n\nWould you like specific recommendations for any particular trail or season?";
    }
    
    if (lowerText.includes('poison ivy') || lowerText.includes('identify')) {
      return "🌿 **Poison Ivy Identification:**\n\n**Key Features:**\n• \"Leaves of three, let it be!\"\n• Three leaflets per stem\n• Shiny or dull green leaves\n• Red stems (often)\n• Grows as vine or shrub\n\n**Seasonal Changes:**\n• Spring: Reddish new growth\n• Summer: Green, may have white berries\n• Fall: Brilliant red/orange colors\n\n**If Exposed:**\n• Wash with dish soap immediately\n• Don't touch other areas\n• Wash all clothing and gear\n• Seek medical help if severe reaction\n\nStay safe out there! Any other plant identification questions?";
    }
    
    if (lowerText.includes('beginner') || lowerText.includes('easy trail')) {
      return "🥾 **Great Beginner Trails:**\n\n**Cascade Falls Trail** (4.1 mi)\n• Easy difficulty, beautiful waterfalls\n• Well-marked path\n• Gradual elevation gain\n\n**Pine Ridge Loop** (6.2 mi)\n• Moderate difficulty\n• Scenic overlooks\n• Good introduction to longer hikes\n\n**Nature Center Loop** (2.3 mi)\n• Very easy, great for families\n• Educational signs along trail\n• Minimal elevation change\n\n**Beginner Tips:**\n• Start with shorter distances\n• Choose well-maintained trails\n• Hike with experienced friends\n• Always tell someone your plans\n\nWould you like specific details about any of these trails?";
    }
    
    if (lowerText.includes('wildlife') || lowerText.includes('safety')) {
      return "🐻 **Wildlife Safety Guidelines:**\n\n**Bear Safety:**\n• Make noise while hiking\n• Store food properly\n• Never feed or approach bears\n• If you see a bear: stay calm, back away slowly\n\n**General Wildlife:**\n• Observe from distance\n• Never feed animals\n• Keep pets leashed\n• Store food in bear containers\n\n**Snake Safety:**\n• Watch where you step\n• Use a flashlight at night\n• Wear proper footwear\n• Don't reach into blind spots\n\n**Emergency Contacts:**\n• Know local ranger station numbers\n• Carry emergency whistle\n• Consider satellite communicator for remote areas\n\nAny specific wildlife concerns for your upcoming hike?";
    }
    
    if (lowerText.includes('weather')) {
      return "🌤️ **Current Trail Conditions:**\n\n**Today's Weather:**\n• Temperature: 68°F (20°C)\n• Partly cloudy\n• 10% chance of rain\n• Light winds 5-10 mph\n\n**Trail Conditions:**\n• Most trails: Good condition\n• Some muddy spots on north-facing slopes\n• Creek crossings normal levels\n\n**This Week's Forecast:**\n• Monday-Wednesday: Clear skies\n• Thursday: Possible afternoon showers\n• Weekend: Sunny and warm\n\n**Recommendations:**\n• Great hiking weather today!\n• Pack light rain gear just in case\n• Creek crossings should be easy\n\nWould you like conditions for a specific trail?";
    }
    
    if (lowerText.includes('leave no trace') || lowerText.includes('principles')) {
      return "🌱 **Leave No Trace Principles:**\n\n1. **Plan Ahead & Prepare**\n   • Research trails and regulations\n   • Check weather and conditions\n\n2. **Travel & Camp on Durable Surfaces**\n   • Stay on designated trails\n   • Camp in established sites\n\n3. **Dispose of Waste Properly**\n   • Pack out all trash\n   • Bury human waste 6-8 inches deep\n\n4. **Leave What You Find**\n   • Don't pick flowers or collect rocks\n   • Preserve cultural/historical artifacts\n\n5. **Minimize Campfire Impacts**\n   • Use established fire rings\n   • Keep fires small\n\n6. **Respect Wildlife**\n   • Observe from distance\n   • Don't feed animals\n\n7. **Be Considerate of Others**\n   • Keep noise levels down\n   • Yield trail appropriately\n\nEvery trail guardian helps protect these spaces for future generations! Questions about any specific principle?";
    }
    
    // Default response
    return "I'd be happy to help you with that! As your Trail Guardian AI assistant, I can provide information about:\n\n🥾 Trail recommendations and conditions\n🌿 Plant and wildlife identification\n⛑️ Safety tips and emergency procedures\n🎒 Gear and packing advice\n🌍 Conservation and Leave No Trace practices\n🗺️ Navigation and route planning\n\nCould you be more specific about what you'd like to know? I'm here to help make your outdoor adventures safe and enjoyable!";
  };

  const sendQuickQuestion = (question) => {
    setMessage(question);
    setTimeout(() => sendMessage(), 100);
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
        <Text style={styles.title}>🤖 AI Trail Assistant</Text>
        <Text style={styles.subtitle}>Your personal hiking and conservation guide</Text>
      </View>

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
        
        {isTyping && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <Text style={[styles.messageText, styles.aiMessageText]}>
              AI is typing...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickQuestions.map((question, index) => (
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
          placeholder="Ask me anything about trails, safety, or conservation..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>📤</Text>
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
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.MD,
  },
  messageBubble: {
    maxWidth: '80%',
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
  quickQuestionsContainer: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
  },
  quickQuestionsTitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  quickQuestionChip: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  quickQuestionText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
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
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.GRAY,
  },
  sendButtonText: {
    fontSize: FONT_SIZE.MD,
  },
});

export default AIAssistantScreen;
