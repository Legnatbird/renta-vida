import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { Goal } from '@/types/goals';
import { Clock, TriangleAlert as AlertTriangle, Check, ArrowRight, AlertCircle, CreditCard } from 'lucide-react-native';
import { useTranslation } from '@/localization/i18n';
import PlanSelectionModal from './PlanSelectionModal';
import PaymentModal from './PaymentModal';
import { useRouter } from 'expo-router';

interface GoalCardProps {
  goal: Goal;
  onPress?: (goal: Goal) => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const { t } = useTranslation();
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const router = useRouter();
  
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
  
  // Get selected plan
  const selectedPlan = goal.plans?.find(plan => plan.id === goal.selectedPlan);
  
  // Determine status and icon
  const getStatusInfo = () => {
    if (goal.status === 'completed') {
      return {
        label: t('goals.completed'),
        color: theme.colors.success,
        icon: <Check size={16} color={theme.colors.success} />,
      };
    }

    if (goal.status === 'configuration') {
      return {
        label: 'In Configuration',
        color: theme.colors.secondary,
        icon: <AlertCircle size={16} color={theme.colors.secondary} />,
      };
    }
    
    if (goal.status === 'in_progress') {
      if (goal.pendingPayment && goal.pendingPayment > 0) {
        return {
          label: 'Payment Due',
          color: theme.colors.warning,
          icon: <CreditCard size={16} color={theme.colors.warning} />,
        };
      }
      return {
        label: t('goals.onTrack'),
        color: theme.colors.primary,
        icon: <Check size={16} color={theme.colors.primary} />,
      };
    }
    
    if (diffDays < 0) {
      return {
        label: t('goals.pastDue'),
        color: theme.colors.error,
        icon: <AlertTriangle size={16} color={theme.colors.error} />,
      };
    } else if (diffDays < 30) {
      return {
        label: t('goals.urgent'),
        color: theme.colors.warning,
        icon: <Clock size={16} color={theme.colors.warning} />,
      };
    }
    
    return {
      label: t('goals.onTrack'),
      color: theme.colors.secondary,
      icon: <Check size={16} color={theme.colors.secondary} />,
    };
  };
  
  const status = getStatusInfo();
  
  // Handle press on card
  const handlePress = () => {
    if (onPress) {
      onPress(goal);
    } else {
      // Navigate to goal details screen
      router.push({
        pathname: '/goal-details',
        params: { id: goal.id }
      });
    }
  };
  
  // Handle specific action buttons
  const handlePlanSelection = (e: any) => {
    e.stopPropagation();
    setIsPlanModalVisible(true);
  };
  
  const handlePayment = (e: any) => {
    e.stopPropagation();
    setIsPaymentModalVisible(true);
  };
  
  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
      >
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
          
          <Text style={styles.date}>{t('timeline.target')}: {formattedDate}</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>{t('goals.goalTitle')}:</Text>
            <Text style={styles.amount}>${goal.amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>{t('home.progress')}: {goal.progress}%</Text>
              {goal.status === 'in_progress' && selectedPlan && (
                <Text style={styles.savingsText}>
                  ${selectedPlan.monthlyContribution.toLocaleString()}/{t('goals.month')}
                </Text>
              )}
              {(goal.status === 'configuration' || !selectedPlan) && (
                <Text style={styles.savingsText}>
                  ${monthlySavingsNeeded.toFixed(0)}{t('timeline.monthlyNeeded')}
                </Text>
              )}
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
          
          {/* Action buttons based on goal status */}
          {goal.status === 'configuration' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePlanSelection}
            >
              <Text style={styles.actionButtonText}>{t('goals.selectRentalPlan')}</Text>
              <ArrowRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          {goal.status === 'in_progress' && goal.pendingPayment && goal.pendingPayment > 0 && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.paymentButton]}
              onPress={handlePayment}
            >
              <Text style={[styles.actionButtonText, styles.paymentButtonText]}>
                {t('goals.makePayment')} (${goal.pendingPayment.toLocaleString()})
              </Text>
              <CreditCard size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {goal.status === 'in_progress' && selectedPlan && (
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>
                {selectedPlan.name.split(':')[0]}
              </Text>
              <Text style={styles.planDetail}>
                {t('goals.achievement')}: {format(new Date(selectedPlan.achievementDate), 'MMM yyyy')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Modals */}
      <PlanSelectionModal 
        visible={isPlanModalVisible}
        onClose={() => setIsPlanModalVisible(false)}
        goal={goal}
      />
      
      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        goal={goal}
      />
    </>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.md,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  paymentButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  paymentButtonText: {
    color: '#FFFFFF',
  },
  planInfo: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.small,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.primary,
  },
  planTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
  },
  planDetail: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});