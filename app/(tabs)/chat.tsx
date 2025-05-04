import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Send, Plus, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useChatStore } from '@/store/chatStore';
import { useGoalStore } from '@/store/goalStore';
import ChatBubble from '@/components/chat/ChatBubble';
import { processMessage } from '@/utils/chatProcessing';
import { useTranslation } from '@/localization/i18n';
import { Message, SenderType } from '@/types/chat';

export default function ChatScreen() {
  const { t } = useTranslation();
  const { messages, addMessage } = useChatStore();
  const { addGoal, updateGoal, removeGoal } = useGoalStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message with correct type
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as SenderType,
      timestamp: new Date().toISOString(),
    };
    
    addMessage(userMessage);
    setInput('');
    
    // Set typing indicator
    setIsTyping(true);
    
    // Process the message to detect intents (like adding/updating goals)
    const { response, action } = await processMessage(input);
    
    // Simulate network delay
    setTimeout(() => {
      // Add bot response with correct type
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot' as SenderType,
        timestamp: new Date().toISOString(),
      };
      
      addMessage(botMessage);
      setIsTyping(false);
      
      // Execute any detected actions
      if (action) {
        switch (action.type) {
          case 'ADD_GOAL':
            addGoal(action.payload);
            break;
          case 'UPDATE_GOAL':
            updateGoal(action.payload.id, action.payload);
            break;
          case 'REMOVE_GOAL':
            removeGoal(action.payload.id);
            break;
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('chat.financialAssistant')}</Text>
          <Text style={styles.subtitle}>{t('chat.askAnything')}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.assistantIconContainer}>
                <Sparkles size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.emptyTitle}>{t('chat.financialAssistant')}</Text>
              <Text style={styles.emptyText}>
                {t('chat.emptyChat')}
              </Text>
              <View style={styles.suggestionsContainer}>
                <TouchableOpacity
                  style={styles.suggestionButton}
                  onPress={() => setInput(t('chat.savingsGoalExample'))}
                >
                  <Text style={styles.suggestionText}>{t('chat.setSavingsGoal')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.suggestionButton}
                  onPress={() => setInput(t('chat.retirementExample'))}
                >
                  <Text style={styles.suggestionText}>{t('chat.retirementPlanning')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.suggestionButton}
                  onPress={() => setInput(t('chat.budgetExample'))}
                >
                  <Text style={styles.suggestionText}>{t('chat.createBudget')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />

        {isTyping && (
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut} 
            style={styles.typingContainer}
          >
            <Text style={styles.typingText}>{t('chat.assistantTyping')}</Text>
          </Animated.View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Plus size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={t('chat.typeMessage')}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              input.trim() === '' && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={input.trim() === ''}
          >
            <Send size={20} color={input.trim() === '' ? theme.colors.text.tertiary : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  messagesContainer: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  assistantIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  suggestionsContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  suggestionButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  typingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  typingText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  attachButton: {
    padding: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    maxHeight: 120,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  sendButton: {
    marginLeft: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});