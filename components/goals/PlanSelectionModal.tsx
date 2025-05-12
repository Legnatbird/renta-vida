import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from '@/localization/i18n';
import { theme } from '@/constants/theme';
import { X, Check } from 'lucide-react-native';
import { Goal } from '@/types/goals';
import { useGoalStore } from '@/store/goalStore';
import { formatDate } from '@/utils/dateFormatters';

interface PlanSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal;
}

export default function PlanSelectionModal({ visible, onClose, goal }: PlanSelectionModalProps) {
  const { t, language } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(goal.selectedPlan);
  const { selectPlan } = useGoalStore();

  // Handle selecting a plan
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  // Handle confirming the plan selection
  const handleConfirm = () => {
    if (selectedPlanId) {
      selectPlan(goal.id, selectedPlanId);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{t('goals.selectRentalPlan')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalDescription}>
            {t('plans.selectPlanDescription')}
          </Text>
          
          <ScrollView style={styles.plansContainer}>
            {goal.plans?.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlanId === plan.id ? styles.selectedPlan : {}
                ]}
                onPress={() => handleSelectPlan(plan.id)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>{t(plan.nameKey)}</Text>
                  {selectedPlanId === plan.id && (
                    <View style={styles.selectedBadge}>
                      <Check size={12} color="#FFFFFF" />
                      <Text style={styles.selectedText}>{t('plans.selected')}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.planDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('plans.monthlyRent')}:</Text>
                    <Text style={styles.detailValue}>${plan.monthlyRent.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('plans.rentPeriod')}:</Text>
                    <Text style={styles.detailValue}>{plan.rentPeriod} {t('plans.years')}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('plans.monthlyContribution')}:</Text>
                    <Text style={styles.detailValue}>${plan.monthlyContribution.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('plans.achievementDate')}:</Text>
                    <Text style={styles.detailValue}>{formatDate(new Date(plan.achievementDate), language as 'en' | 'es', 'MMM yyyy')}</Text>
                  </View>
                </View>
                
                {/* Strengths and weaknesses */}
                <View style={styles.strengthsWeaknesses}>
                  <View style={styles.strengthsContainer}>
                    <Text style={styles.sectionTitle}>{t('plans.planStrengths')}</Text>
                    <View style={styles.bulletPoints}>
                      {plan.strengths.map((strength, index) => (
                        <View key={`strength-${index}`} style={styles.bulletPoint}>
                          <View style={[styles.bullet, styles.strengthBullet]} />
                          <Text style={styles.bulletText}>{t(strength)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.weaknessesContainer}>
                    <Text style={styles.sectionTitle}>{t('plans.planWeaknesses')}</Text>
                    <View style={styles.bulletPoints}>
                      {plan.weaknesses.map((weakness, index) => (
                        <View key={`weakness-${index}`} style={styles.bulletPoint}>
                          <View style={[styles.bullet, styles.weaknessBullet]} />
                          <Text style={styles.bulletText}>{t(weakness)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.disclaimer}>{t('plans.disclaimer')}</Text>
          
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedPlanId ? styles.disabledButton : {}
            ]}
            onPress={handleConfirm}
            disabled={!selectedPlanId}
          >
            <Text style={styles.confirmButtonText}>{t('plans.confirmSelection')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  modalDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  plansContainer: {
    maxHeight: '60%',
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  planTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  selectedText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
    marginLeft: theme.spacing.xs,
  },
  planDetails: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  strengthsWeaknesses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthsContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  weaknessesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  bulletPoints: {
    paddingLeft: theme.spacing.sm,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  strengthBullet: {
    backgroundColor: theme.colors.success,
  },
  weaknessBullet: {
    backgroundColor: theme.colors.danger,
  },
  bulletText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  disclaimer: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  confirmButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
    marginRight: theme.spacing.sm,
  },
});
