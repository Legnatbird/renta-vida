import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Goal } from '@/types/goals';
import { ArrowLeft, CreditCard, Clock, BarChart3, Calendar, DollarSign, Award } from 'lucide-react-native';
import { useTranslation } from '@/localization/i18n';
import { useNavigation } from '@react-navigation/native';
import RentalPlanCard from './RentalPlanCard';
import GoalProgressChart from './GoalProgressChart';
import PaymentModal from './PaymentModal';
import PlanSelectionModal from './PlanSelectionModal';

interface GoalDetailScreenProps {
  goal: Goal;
  onBack?: () => void; // Make onBack optional
}

export default function GoalDetailScreen({ goal, onBack }: GoalDetailScreenProps) {
  const { t, language } = useTranslation();
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const navigation = useNavigation(); // Get navigation object
  
  // Function to handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack(); // Use provided onBack function if available
    } else if (navigation.canGoBack()) {
      navigation.goBack(); // Use React Navigation's goBack if possible
    }
  };
  
  // Get selected plan
  const selectedPlan = goal.plans?.find(plan => plan.id === goal.selectedPlan);
  const nextPaymentDate = goal.nextPaymentDate ? new Date(goal.nextPaymentDate) : new Date();
  
  // Set date locale based on current language
  const dateLocale = language === 'es' ? es : enUS;
  
  const getStatusBadgeColor = () => {
    switch (goal.status) {
      case 'configuration':
        return theme.colors.secondary;
      case 'in_progress':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      default:
        return theme.colors.text.secondary;
    }
  };
  
  const getStatusLabel = () => {
    switch (goal.status) {
      case 'configuration':
        return t('goals.configuration');
      case 'in_progress':
        return t('goals.in_progress');
      case 'completed':
        return t('goals.completed');
      default:
        return t('goals.unknown');
    }
  };
  
  // Traduce la prioridad
  const getPriorityLabel = () => {
    switch (goal.priority) {
      case 'high':
        return t('goals.highPriority');
      case 'medium':
        return t('goals.mediumPriority');
      case 'low':
        return t('goals.lowPriority');
      default:
        return t('goals.unknownPriority');
    }
  };
  
  // Function to properly format progress display
  const getProgressDisplay = () => {
    if (goal.status === 'completed') {
      return `100% ${t('goals.complete')}`;
    }
    return `${goal.progress}% ${t('goals.complete')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('goals.goalDetails')}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topSection}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
            <Text style={styles.statusText}>
              {getStatusLabel()}
            </Text>
          </View>
          
          <Text style={styles.goalTitle}>{goal.title}</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.targetAmount}>${goal.amount.toLocaleString()}</Text>
            <Text style={styles.amountLabel}>{t('goals.targetAmount')}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${goal.progress}%` },
                { backgroundColor: getStatusBadgeColor() }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{getProgressDisplay()}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('goals.targetDate')}:</Text>
              <Text style={styles.infoValue}>
                {format(new Date(goal.targetDate), 'MMMM d, yyyy', { locale: dateLocale })}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Award size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('goals.priority')}:</Text>
              <Text style={styles.infoValue}>
                {getPriorityLabel()}
              </Text>
            </View>
          </View>
          
          {goal.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>{t('goals.description')}:</Text>
              <Text style={styles.descriptionText}>{goal.description}</Text>
            </View>
          )}
        </View>
        
        {/* Rental Plan Section */}
        {goal.status === 'configuration' ? (
          <View style={styles.planSection}>
            <Text style={styles.sectionTitle}>{t('goals.selectRentalPlan')}</Text>
            <Text style={styles.sectionDescription}>
              {t('plans.selectPlanDescription')}
            </Text>
            
            <TouchableOpacity 
              style={styles.selectPlanButton}
              onPress={() => setIsPlanModalVisible(true)}
            >
              <Text style={styles.selectPlanButtonText}>{t('goals.viewAvailablePlans')}</Text>
            </TouchableOpacity>
          </View>
        ) : selectedPlan ? (
          <View style={styles.planSection}>
            <Text style={styles.sectionTitle}>{t('goals.selectedRentalPlan')}</Text>
            <RentalPlanCard plan={selectedPlan} isSelected={true} />
            
            {goal.status === 'in_progress' && (
              <>
                <GoalProgressChart 
                  plan={selectedPlan} 
                  progress={goal.progress}
                />
                
                <View style={styles.paymentSection}>
                  <Text style={styles.sectionTitle}>{t('goals.paymentInformation')}</Text>
                  
                  {goal.pendingPayment && goal.pendingPayment > 0 ? (
                    <View style={styles.paymentDueContainer}>
                      <View style={styles.paymentDueIconContainer}>
                        <Clock size={24} color={theme.colors.warning} />
                      </View>
                      <View style={styles.paymentDueContent}>
                        <Text style={styles.paymentDueTitle}>{t('goals.paymentDue')}</Text>
                        <Text style={styles.paymentDueAmount}>
                          ${goal.pendingPayment.toLocaleString()}
                        </Text>
                        <Text style={styles.paymentDueDate}>
                          {t('goals.dueBy')}: {format(nextPaymentDate, 'MMMM d, yyyy', { locale: dateLocale })}
                        </Text>
                        <TouchableOpacity 
                          style={styles.makePaymentButton}
                          onPress={() => setIsPaymentModalVisible(true)}
                        >
                          <CreditCard size={16} color="#FFFFFF" />
                          <Text style={styles.makePaymentButtonText}>
                            {t('goals.makePayment')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.noPaymentDueContainer}>
                      <Text style={styles.noPaymentDueText}>
                        {t('goals.noPendingPayments')}
                      </Text>
                      {goal.status === 'in_progress' && (
                        <Text style={styles.nextPaymentText}>
                          {t('goals.nextPaymentDue')} {format(nextPaymentDate, 'MMMM d, yyyy', { locale: dateLocale })}
                        </Text>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.paymentHistoryContainer}>
                    <Text style={styles.paymentHistoryTitle}>{t('goals.paymentHistory')}</Text>
                    <TouchableOpacity style={styles.viewAllButton}>
                      <Text style={styles.viewAllButtonText}>{t('goals.viewAll')}</Text>
                      <ArrowLeft size={16} color={theme.colors.primary} style={{ transform: [{rotate: '180deg'}] }} />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Sample payment history entries */}
                  <View style={styles.paymentEntryContainer}>
                    <View style={styles.paymentEntryIconContainer}>
                      <DollarSign size={16} color={theme.colors.success} />
                    </View>
                    <View style={styles.paymentEntryContent}>
                      <Text style={styles.paymentEntryTitle}>{t('goals.paymentCompleted')}</Text>
                      <Text style={styles.paymentEntryDate}>
                        {format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM d, yyyy', { locale: dateLocale })}
                      </Text>
                    </View>
                    <Text style={styles.paymentEntryAmount}>
                      ${selectedPlan.monthlyContribution.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.paymentEntryContainer}>
                    <View style={styles.paymentEntryIconContainer}>
                      <DollarSign size={16} color={theme.colors.success} />
                    </View>
                    <View style={styles.paymentEntryContent}>
                      <Text style={styles.paymentEntryTitle}>{t('goals.paymentCompleted')}</Text>
                      <Text style={styles.paymentEntryDate}>
                        {format(new Date(new Date().setMonth(new Date().getMonth() - 2)), 'MMMM d, yyyy', { locale: dateLocale })}
                      </Text>
                    </View>
                    <Text style={styles.paymentEntryAmount}>
                      ${selectedPlan.monthlyContribution.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        ) : null}
        
        {goal.status === 'completed' && (
          <View style={styles.completedSection}>
            <View style={styles.completionIconContainer}>
              <Award size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.completionTitle}>{t('goals.goalAchieved')}</Text>
            <Text style={styles.completionText}>
              {t('goals.goalAchievedMessage')}
            </Text>
            
            <View style={styles.completionDetails}>
              <View style={styles.completionDetail}>
                <Text style={styles.completionDetailLabel}>{t('goals.startDate')}</Text>
                <Text style={styles.completionDetailValue}>
                  {format(new Date(new Date().setMonth(new Date().getMonth() - 24)), 'MMM d, yyyy', { locale: dateLocale })}
                </Text>
              </View>
              <View style={styles.completionDetailDivider} />
              <View style={styles.completionDetail}>
                <Text style={styles.completionDetailLabel}>{t('goals.completionDate')}</Text>
                <Text style={styles.completionDetailValue}>
                  {format(new Date(), 'MMM d, yyyy', { locale: dateLocale })}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  topSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.md,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
  },
  goalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  targetAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  amountLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.md,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  descriptionContainer: {
    marginTop: theme.spacing.sm,
  },
  descriptionLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  descriptionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  planSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  selectPlanButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectPlanButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
  paymentSection: {
    marginTop: theme.spacing.lg,
  },
  paymentDueContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  paymentDueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  paymentDueContent: {
    flex: 1,
  },
  paymentDueTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.warning,
    marginBottom: 2,
  },
  paymentDueAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  paymentDueDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  makePaymentButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  makePaymentButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
    marginLeft: theme.spacing.xs,
  },
  noPaymentDueContainer: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
    alignItems: 'center',
  },
  noPaymentDueText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
    marginBottom: 4,
  },
  nextPaymentText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  paymentHistoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  paymentHistoryTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 2,
  },
  paymentEntryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  paymentEntryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  paymentEntryContent: {
    flex: 1,
  },
  paymentEntryTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  paymentEntryDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  paymentEntryAmount: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
  },
  completedSection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  completionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  completionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  completionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  completionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    width: '100%',
    ...theme.shadows.small,
  },
  completionDetail: {
    flex: 1,
    alignItems: 'center',
  },
  completionDetailLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  completionDetailValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  completionDetailDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
});
