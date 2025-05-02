import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Message } from '@/types/chat';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    opacity.value = withSpring(1);
    translateY.value = withSpring(0);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const isUser = message.sender === 'user';
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  
  return (
    <Animated.View 
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
        animatedStyle,
      ]}
    >
      <View 
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.botText,
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formattedTime}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 0,
  },
  text: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});