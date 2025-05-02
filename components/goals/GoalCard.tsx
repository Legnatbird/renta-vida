import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { Goal } from '@/types/goals';
import { Clock, TriangleAlert as AlertTriangle, Check } from 'lucide-react-native';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const targetDate = new Date(goal.targetDate);
  const formattedDate = format(targetDate, 'MMM d, yyyy');
  
  // Calculate time remaining
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate monthly savings needed
  const monthsRemaining = diffDays / 30;
  const amountRemaining = goal.amount * (1 - goal.progress / 100);
  const monthlySavingsNeeded = monthsRemaining > 0 ? amountRemaining / monthsRemaining : 0;
  
  // Determine status and icon
  const getStatusInfo = () => {
    if (diffDays < 0) {
      return {
        label: 'Past due',
        color: theme.colors.error,
        icon: <AlertTriangle size={16} color={theme.colors.error} />,
      };
    } else if (diffDays < 30) {
      return {
        label: 'Urgent',
        color: theme.colors.warning,
        icon: <Clock size={16} color={theme.colors.warning} />,
      };
    } else if (goal.progress >= 100) {
      return {
        label: 'Completed',
        color: theme.colors.success,
        icon: <Check size={16} color={theme.colors.success} />,
      };
    } else {
      return {
        label: 'On track',
        color: theme.colors.secondary,
        icon: <Check size={16} color={theme.colors.secondary} />,
      };
    }
  };
  
  const status = getStatusInfo();
  
  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(goal.priority) }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{goal.title}</Text>
          <View style={styles.statusContainer}>
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>
        
        <Text style={styles.date}>Target: {formattedDate}</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Goal amount:</Text>
          <Text style={styles.amount}>${goal.amount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>Progress: {goal.progress}%</Text>
            <Text style={styles.savingsText}>
              ${monthlySavingsNeeded.toFixed(0)}/month needed
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${goal.progress}%` },
                { backgroundColor: getPriorityColor(goal.priority) }
              ]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return theme.colors.error;
    case 'medium':
      return theme.colors.warning;
    case 'low':
      return theme.colors.secondary;
    default:
      return theme.colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    ...theme.shadows.medium,
  },
  priorityIndicator: {
    width: 6,
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.md,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 4,
  },
  date: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  amountLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  amount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  savingsText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});