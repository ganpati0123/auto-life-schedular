import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAIStore } from '../../store';
import { Avatar, Button } from '../common';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

export const AIChat: React.FC = () => {
  const { colors } = useTheme();
  const { conversations, activeConversationId, addMessage, createConversation, isProcessing } = useAIStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  useEffect(() => {
    if (!activeConversationId) {
      createConversation();
    }
  }, []);
  
  const handleSend = async () => {
    if (!inputText.trim() || !activeConversationId) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    addMessage(activeConversationId, {
      role: 'user',
      content: userMessage,
    });
    
    // Simulate AI response
    setTimeout(() => {
      addMessage(activeConversationId, {
        role: 'assistant',
        content: getAIResponse(userMessage),
      });
    }, 1000);
  };
  
  const getAIResponse = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('schedule') || lower.includes('meeting')) {
      return "I'd be happy to help you schedule a meeting! I can find the best time based on your availability. What meeting would you like to schedule?";
    }
    if (lower.includes('email')) {
      return "I can help you manage your emails! I can search, summarize, or draft replies. What would you like me to do?";
    }
    if (lower.includes('task') || lower.includes('todo')) {
      return "I can create tasks for you. Just tell me what you need to do and when it's due.";
    }
    return "I'm your AI executive assistant. I can help you with scheduling meetings, managing emails, creating tasks, and more. How can I assist you today?";
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Avatar name="AI Assistant" size={40} backgroundColor={colors.secondary} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Online</Text>
        </View>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {activeConversation?.messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.aiBubble,
              { backgroundColor: message.role === 'user' ? colors.primary : colors.surface },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: message.role === 'user' ? '#FFFFFF' : colors.text },
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {(!activeConversation || activeConversation.messages.length === 0) && (
          <View style={styles.welcome}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Welcome to AI Assistant
            </Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              I can help you schedule meetings, manage emails, create tasks, and more. Just ask!
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isProcessing}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerInfo: {
    marginLeft: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  welcome: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
