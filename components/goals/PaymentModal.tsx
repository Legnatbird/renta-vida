import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Alert,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X, CreditCard, Receipt, Check } from 'lucide-react-native';
import { Goal } from '@/types/goals';
import { useGoalStore } from '@/store/goalStore';
import { useTranslation } from '@/localization/i18n';
import { formatDate } from '@/utils/dateFormatters';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal;
}

export default function PaymentModal({ 
  visible, 
  onClose, 
  goal 
}: PaymentModalProps) {
  const { t, language } = useTranslation();
  const { makePayment } = useGoalStore();
  const [amount, setAmount] = useState(goal.pendingPayment?.toString() || '0');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'receipt'>('card');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [goalCompleted, setGoalCompleted] = useState(false);
  
  const formattedDueDate = goal.nextPaymentDate 
    ? formatDate(new Date(goal.nextPaymentDate), language as 'en' | 'es', 'MMM d, yyyy')
    : '';
  
  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };
  
  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      Alert.alert(t('payment.invalidAmount'), t('payment.enterValidAmount'));
      return;
    }
    
    // Process payment and check if goal was completed
    const result = makePayment(goal.id, paymentAmount);
    setGoalCompleted(result.goalCompleted);
    setPaymentComplete(true);
    
    // Reset and close after delay
    setTimeout(() => {
      setPaymentComplete(false);
      setGoalCompleted(false);
      onClose();
    }, 2000);
  };
  
  const handleGenerateReceipt = () => {
    // In a real app, this would generate a PDF receipt
    Alert.alert(
      t('payment.receiptGenerated'), 
      t('payment.receiptSentToEmail')
    );
    onClose();
  };
  
  const selectedPlan = goal.plans?.find(plan => plan.id === goal.selectedPlan);
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {paymentComplete ? (
            <View style={styles.successContainer}>
              <View style={[
                styles.successIconContainer, 
                { backgroundColor: goalCompleted ? theme.colors.success : theme.colors.primary }
              ]}>
                <Check size={40} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.successTitle,
                { color: goalCompleted ? theme.colors.success : theme.colors.primary }
              ]}>
                {goalCompleted ? t('goals.goalAchieved') : t('payment.successful')}
              </Text>
              <Text style={styles.successText}>
                {goalCompleted ? t('goals.goalAchievedMessage') : t('payment.thankYouContribution')}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('payment.makePayment')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.goalInfoContainer}>
                  <Text style={styles.goalTitle}>{goal.titleKey}</Text>
                  <View style={styles.goalRow}>
                    <Text style={styles.goalInfoLabel}>{t('payment.monthlyContribution')}:</Text>
                    <Text style={styles.goalInfoValue}>${selectedPlan?.monthlyContribution.toLocaleString()}</Text>
                  </View>
                  <View style={styles.goalRow}>
                    <Text style={styles.goalInfoLabel}>{t('payment.pendingPayment')}:</Text>
                    <Text style={[styles.goalInfoValue, styles.pendingValue]}>${goal.pendingPayment?.toLocaleString()}</Text>
                  </View>
                  <View style={styles.goalRow}>
                    <Text style={styles.goalInfoLabel}>{t('payment.dueDate')}:</Text>
                    <Text style={styles.goalInfoValue}>{formattedDueDate}</Text>
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>{t('payment.paymentAmount')}</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={handleAmountChange}
                  />
                </View>
                
                <Text style={styles.inputLabel}>{t('payment.paymentMethod')}</Text>
                <View style={styles.paymentMethodContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === 'card' && styles.selectedPaymentMethod
                    ]}
                    onPress={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={24} color={paymentMethod === 'card' ? theme.colors.primary : theme.colors.text.secondary} />
                    <Text style={[
                      styles.paymentMethodText,
                      paymentMethod === 'card' && styles.selectedPaymentMethodText
                    ]}>
                      {t('payment.creditDebitCard')}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === 'receipt' && styles.selectedPaymentMethod
                    ]}
                    onPress={() => setPaymentMethod('receipt')}
                  >
                    <Receipt size={24} color={paymentMethod === 'receipt' ? theme.colors.primary : theme.colors.text.secondary} />
                    <Text style={[
                      styles.paymentMethodText,
                      paymentMethod === 'receipt' && styles.selectedPaymentMethodText
                    ]}>
                      {t('payment.generateReceipt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.paymentButton}
                  onPress={paymentMethod === 'card' ? handlePayment : handleGenerateReceipt}
                >
                  <Text style={styles.paymentButtonText}>
                    {paymentMethod === 'card' ? t('payment.makePayment') : t('payment.generateReceipt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  goalInfoContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  goalTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalInfoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  goalInfoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  pendingValue: {
    color: theme.colors.error,
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  amountInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedPaymentMethod: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderColor: theme.colors.primary,
  },
  paymentMethodText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  selectedPaymentMethodText: {
    color: theme.colors.primary,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  paymentButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
  successContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  successText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  }
});
