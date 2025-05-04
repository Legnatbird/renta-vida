import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import { Check, ArrowRight } from 'lucide-react-native';
import { Goal } from '@/types/goals';
import { useTranslation } from '@/localization/i18n';

interface TimelineProps {
  goals: Goal[];
}

export default function Timeline({ goals }: TimelineProps) {
  const { t } = useTranslation();
  
  const sortedGoals = [...goals].sort((a, b) => {
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  const now = new Date();

  const getTimelineNodeStatus = (date: string) => {
    const targetDate = new Date(date);
    if (isToday(targetDate)) return 'current';
    if (isBefore(targetDate, now)) return 'completed';
    return 'future';
  };

  return (
    <View style={styles.container}>
      {sortedGoals.map((goal, index) => {
        const isLast = index === sortedGoals.length - 1;
        const status = getTimelineNodeStatus(goal.targetDate);
        
        return (
          <View key={goal.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineNode,
                  status === 'completed' && styles.timelineNodeCompleted,
                  status === 'current' && styles.timelineNodeCurrent,
                ]}
              >
                {status === 'completed' ? (
                  <Check size={16} color="#FFFFFF" />
                ) : status === 'current' ? (
                  <ArrowRight size={16} color="#FFFFFF" />
                ) : null}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    status === 'completed' && styles.timelineLineCompleted,
                  ]}
                />
              )}
            </View>
            
            <TouchableOpacity style={styles.timelineContent}>
              <Text style={styles.timelineDate}>
                {format(new Date(goal.targetDate), 'MMM yyyy')}
              </Text>
              <View style={styles.timelineCard}>
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(goal.priority) }]} />
                <View style={styles.timelineCardContent}>
                  <Text style={styles.timelineTitle}>{goal.title}</Text>
                  <Text style={styles.timelineAmount}>${goal.amount.toLocaleString()}</Text>
                  <View style={styles.progressContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${goal.progress}%` },
                        { backgroundColor: getPriorityColor(goal.priority) }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{goal.progress}% complete</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
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
    paddingHorizontal: theme.spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 120,
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.timeline.future,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...theme.shadows.small,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodeCompleted: {
    backgroundColor: theme.colors.timeline.completed,
  },
  timelineNodeCurrent: {
    backgroundColor: theme.colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.timeline.future,
  },
  timelineLineCompleted: {
    backgroundColor: theme.colors.timeline.completed,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  timelineDate: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  timelineCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.medium,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  priorityIndicator: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },
  timelineCardContent: {
    padding: theme.spacing.md,
    flex: 1,
  },
  timelineTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  timelineAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressContainer: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
});