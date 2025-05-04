import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X, Calendar } from 'lucide-react-native';
import DatePicker from '@/components/ui/DatePicker';
import { useGoalStore } from '@/store/goalStore';
import { useTranslation } from '@/localization/i18n';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddGoalModal({ visible, onClose }: AddGoalModalProps) {
  const { t } = useTranslation();
  const { addGoal } = useGoalStore();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleSubmit = () => {
    if (!title || !amount) return;
    
    const amountValue = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(amountValue)) return;
    
    addGoal({
      id: Date.now().toString(),
      title,
      amount: amountValue,
      targetDate: targetDate.toISOString(),
      priority,
      progress: 0,
      description: ''
    });
    
    // Reset form
    setTitle('');
    setAmount('');
    setTargetDate(new Date());
    setPriority('medium');
    
    onClose();
  };
  
  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Format with commas
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    setAmount(parts.join('.'));
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('goals.newGoal')}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>{t('goals.goalTitle')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('goals.goalPlaceholder')}
                value={title}
                onChangeText={setTitle}
              />
              
              <Text style={styles.inputLabel}>{t('goals.targetAmount')}</Text>
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
              
              <Text style={styles.inputLabel}>{t('goals.targetDate')}</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={theme.colors.text.secondary} />
                <Text style={styles.dateText}>
                  {targetDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
              
              <DatePicker
                visible={showDatePicker}
                date={targetDate}
                onDateChange={setTargetDate}
                onClose={() => setShowDatePicker(false)}
              />
              
              <Text style={styles.inputLabel}>{t('goals.priority')}</Text>
              <View style={styles.priorityContainer}>
                {([
                  { key: 'low', label: t('goals.low') },
                  { key: 'medium', label: t('goals.medium') },
                  { key: 'high', label: t('goals.high') }
                ] as const).map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.priorityButton,
                      priority === p.key && styles.activePriorityButton,
                      priority === p.key && { borderColor: getPriorityColor(p.key) },
                    ]}
                    onPress={() => setPriority(p.key)}
                  >
                    <View 
                      style={[
                        styles.priorityDot, 
                        { backgroundColor: getPriorityColor(p.key) }
                      ]} 
                    />
                    <Text 
                      style={[
                        styles.priorityText,
                        priority === p.key && styles.activePriorityText,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  (!title || !amount) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!title || !amount}
              >
                <Text style={styles.addButtonText}>{t('goals.addGoal')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    maxHeight: '90%',
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
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '31%',
    justifyContent: 'center',
  },
  activePriorityButton: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderWidth: 2,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  priorityText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  activePriorityText: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  addButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
});