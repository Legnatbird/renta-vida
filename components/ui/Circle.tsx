import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

interface CircleProps {
  size?: number;
  color?: string;
  onPress?: () => void;
}

export default function Circle({ size = 40, color = theme.colors.primary, onPress }: CircleProps) {
  const styles = StyleSheet.create({
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      ...Platform.select({
        web: {
          cursor: onPress ? 'pointer' : 'default',
        },
      }),
    },
  });

  const circle = <View style={styles.circle} />;

  if (Platform.OS === 'web') {
    return (
      <div 
        style={StyleSheet.flatten(styles.circle)}
        onClick={onPress}
        role="button"
        tabIndex={0}
      />
    );
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {circle}
      </Pressable>
    );
  }

  return circle;
}