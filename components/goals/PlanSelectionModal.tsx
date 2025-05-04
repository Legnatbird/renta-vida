import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X, ArrowRight } from 'lucide-react-native';
import { Goal } from '@/types/goals';
import { useGoalStore } from '@/store/goalStore';
import { useTranslation } from '@/localization/i18n';
import RentalPlanCard from './RentalPlanCard';

interface PlanSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal;
}

export default function PlanSelectionModal({ 
  visible, 
  onClose, 
  goal 
}: PlanSelectionModalProps) {
  const { t } = useTranslation();
  const { selectPlan } = useGoalStore();
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(goal.selectedPlan);
  
  const handleConfirmSelection = () => {
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('goals.rentalPlans')}: {goal.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.introText}>
              {t('goals.selectPlanDescription')}
            </Text>
            
            {goal.plans?.map((plan) => (
              <RentalPlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
              />
            ))}
            
            <Text style={styles.disclaimer}>
              * {t('goals.disclaimer')}
            </Text>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                !selectedPlanId && styles.disabledButton
              ]}
              onPress={handleConfirmSelection}
              disabled={!selectedPlanId}
            >
              <Text style={styles.confirmButtonText}>{t('goals.confirmSelection')}</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    width: '90%',
    maxHeight: '80%',
    ...theme.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  introText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  disclaimer: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
