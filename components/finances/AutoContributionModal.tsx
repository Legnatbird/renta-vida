import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
} from 'react-native';
import { theme } from '@/constants/theme';
import { useTranslation } from '@/localization/i18n';
import { X, ArrowUp, Percent, Coins, InfoIcon } from 'lucide-react-native';

interface AutoContributionModalProps {
  visible: boolean;
  onClose: () => void;
  paymentMethod: any;
}

export default function AutoContributionModal({ 
  visible, 
  onClose, 
  paymentMethod 
}: AutoContributionModalProps) {
  const { t } = useTranslation();
  const [contributionType, setContributionType] = useState<'round' | 'percent' | 'fixed'>(
    paymentMethod?.autoType || 'round'
  );
  const [roundUpValue, setRoundUpValue] = useState<string>(
    paymentMethod?.autoType === 'round' ? String(paymentMethod?.autoValue) : '1000'
  );
  const [percentValue, setPercentValue] = useState<string>(
    paymentMethod?.autoType === 'percent' ? String(paymentMethod?.autoValue) : '5'
  );
  const [fixedValue, setFixedValue] = useState<string>(
    paymentMethod?.autoType === 'fixed' ? String(paymentMethod?.autoValue) : '500'
  );
  
  const handleSubmit = () => {
    // Aquí iría la lógica para guardar la configuración
    onClose();
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
            <Text style={styles.modalTitle}>{t('finances.autoContributionSetup')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.paymentMethodInfoContainer}>
              <Text style={styles.paymentMethodInfoLabel}>{t('finances.configuring')}</Text>
              <Text style={styles.paymentMethodInfoValue}>
                {paymentMethod?.label || t('finances.selectedPaymentMethod')}
              </Text>
            </View>
            
            <View style={styles.infoBox}>
              <View style={styles.infoIconContainer}>
                <InfoIcon size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>{t('finances.autoContributionDescription')}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>{t('finances.contributionMethod')}</Text>
            
            <TouchableOpacity 
              style={[
                styles.optionContainer,
                contributionType === 'round' && styles.selectedOption
              ]}
              onPress={() => setContributionType('round')}
            >
              <View style={[
                styles.optionIconContainer,
                { backgroundColor: contributionType === 'round' ? 'rgba(0, 102, 204, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
              ]}>
                <ArrowUp size={20} color={contributionType === 'round' ? theme.colors.primary : theme.colors.text.tertiary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  contributionType === 'round' && styles.selectedOptionTitle
                ]}>
                  {t('finances.roundUpOption')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('finances.roundUpDescription')}
                </Text>
                
                {contributionType === 'round' && (
                  <View style={styles.valueInputContainer}>
                    <Text style={styles.valueInputLabel}>{t('finances.roundUpTo')}</Text>
                    <View style={styles.valueInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.valueInput}
                        value={roundUpValue}
                        onChangeText={setRoundUpValue}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={[
                styles.radioCircle, 
                contributionType === 'round' && styles.selectedRadioCircle
              ]}>
                {contributionType === 'round' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionContainer,
                contributionType === 'percent' && styles.selectedOption
              ]}
              onPress={() => setContributionType('percent')}
            >
              <View style={[
                styles.optionIconContainer,
                { backgroundColor: contributionType === 'percent' ? 'rgba(255, 149, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
              ]}>
                <Percent size={20} color={contributionType === 'percent' ? theme.colors.warning : theme.colors.text.tertiary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  contributionType === 'percent' && styles.selectedOptionTitle
                ]}>
                  {t('finances.percentageOption')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('finances.percentageDescription')}
                </Text>
                
                {contributionType === 'percent' && (
                  <View style={styles.valueInputContainer}>
                    <Text style={styles.valueInputLabel}>{t('finances.percentageValue')}</Text>
                    <View style={styles.valueInputWrapper}>
                      <TextInput
                        style={styles.valueInput}
                        value={percentValue}
                        onChangeText={setPercentValue}
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentSymbol}>%</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={[
                styles.radioCircle, 
                contributionType === 'percent' && styles.selectedRadioCircle
              ]}>
                {contributionType === 'percent' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionContainer,
                contributionType === 'fixed' && styles.selectedOption
              ]}
              onPress={() => setContributionType('fixed')}
            >
              <View style={[
                styles.optionIconContainer,
                { backgroundColor: contributionType === 'fixed' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
              ]}>
                <Coins size={20} color={contributionType === 'fixed' ? theme.colors.success : theme.colors.text.tertiary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  contributionType === 'fixed' && styles.selectedOptionTitle
                ]}>
                  {t('finances.fixedAmountOption')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t('finances.fixedAmountDescription')}
                </Text>
                
                {contributionType === 'fixed' && (
                  <View style={styles.valueInputContainer}>
                    <Text style={styles.valueInputLabel}>{t('finances.fixedAmount')}</Text>
                    <View style={styles.valueInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.valueInput}
                        value={fixedValue}
                        onChangeText={setFixedValue}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={[
                styles.radioCircle, 
                contributionType === 'fixed' && styles.selectedRadioCircle
              ]}>
                {contributionType === 'fixed' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
            
            <View style={styles.estimationContainer}>
              <Text style={styles.estimationTitle}>{t('finances.estimatedContribution')}</Text>
              <Text style={styles.estimationDescription}>
                {t('finances.estimationDescription')}
              </Text>
              <View style={styles.estimationAmountContainer}>
                <Text style={styles.estimationAmount}>$3,600</Text>
                <Text style={styles.estimationPeriod}>{t('finances.estimationPeriod')}</Text>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.disableButton}
              onPress={onClose}
            >
              <Text style={styles.disableText}>{t('finances.disableContributions')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSubmit}
            >
              <Text style={styles.saveText}>{t('finances.saveChanges')}</Text>
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
    justifyContent: 'flex-end',
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
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
    maxHeight: 500,
  },
  paymentMethodInfoContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  paymentMethodInfoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  paymentMethodInfoValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoIconContainer: {
    marginRight: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  optionContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  selectedOptionTitle: {
    color: theme.colors.primary,
  },
  optionDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  selectedRadioCircle: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  valueInputContainer: {
    marginTop: theme.spacing.md,
  },
  valueInputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  valueInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginRight: 4,
  },
  percentSymbol: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  valueInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  estimationContainer: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  estimationTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
    marginBottom: 2,
  },
  estimationDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  estimationAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  estimationAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  estimationPeriod: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  disableButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.error,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
  },
  disableText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
  },
  saveButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
});
