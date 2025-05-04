import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGoalStore } from '@/store/goalStore';
import GoalDetailScreen from '@/components/goals/GoalDetailScreen';
import { StatusBar } from 'expo-status-bar';

export default function GoalDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { goals } = useGoalStore();
  
  // Find the goal with the matching id
  const goal = goals.find(g => g.id === id);
  
  // Handle navigation back
  const handleBack = () => {
    router.back();
  };
  
  if (!goal) {
    // Handle the case where the goal is not found
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <GoalDetailScreen goal={goal} onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
