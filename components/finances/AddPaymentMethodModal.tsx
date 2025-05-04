import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '@/constants/theme';
import { useTranslation } from '@/localization/i18n';
import { X, CreditCard, Wallet, ChevronDown, Check } from 'lucide-react-native';

interface AddPaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddPaymentMethodModal({ visible, onClose }: AddPaymentMethodModalProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<'card' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  
  const handleSubmit = () => {
    // Aquí iría la lógica para añadir el método de pago
    onClose();
  };
  
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // limit to 16 digits + spaces
  };
  
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('finances.addPaymentMethod')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>{t('finances.methodType')}</Text>
            
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  selectedType === 'card' && styles.selectedType
                ]}
                onPress={() => setSelectedType('card')}
              >
                <CreditCard 
                  size={20} 
                  color={selectedType === 'card' ? theme.colors.primary : theme.colors.text.tertiary} 
                />
                <Text style={[
                  styles.typeText,
                  selectedType === 'card' && styles.selectedTypeText
                ]}>
                  {t('finances.creditDebitCard')}
                </Text>
                {selectedType === 'card' && (
                  <View style={styles.checkCircle}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  selectedType === 'bank' && styles.selectedType
                ]}
                onPress={() => setSelectedType('bank')}
              >
                <Wallet 
                  size={20} 
                  color={selectedType === 'bank' ? theme.colors.primary : theme.colors.text.tertiary} 
                />
                <Text style={[
                  styles.typeText,
                  selectedType === 'bank' && styles.selectedTypeText
                ]}>
                  {t('finances.bankAccount')}
                </Text>
                {selectedType === 'bank' && (
                  <View style={styles.checkCircle}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            {selectedType === 'card' ? (
              <View style={styles.formContainer}>
                <Text style={styles.label}>{t('finances.cardInformation')}</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('finances.cardNumber')}</Text>
                  <View style={styles.inputWrapper}>
                    <CreditCard size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      placeholder="**** **** **** ****"
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('finances.cardholderName')}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={cardName}
                      onChangeText={setCardName}
                      placeholder={t('finances.cardholderNamePlaceholder')}
                    />
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: theme.spacing.md }]}>
                    <Text style={styles.inputLabel}>{t('finances.expiryDate')}</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={expiryDate}
                        onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                        placeholder="MM/YY"
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>{t('finances.cvv')}</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={cvv}
                        onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
                        placeholder="***"
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.label}>{t('finances.accountInformation')}</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('finances.bankName')}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={bankName}
                      onChangeText={setBankName}
                      placeholder={t('finances.bankNamePlaceholder')}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('finances.accountType')}</Text>
                  <TouchableOpacity style={styles.dropdownWrapper}>
                    <Text style={[
                      styles.dropdownText, 
                      !accountType && styles.placeholderText
                    ]}>
                      {accountType || t('finances.selectAccountType')}
                    </Text>
                    <ChevronDown size={20} color={theme.colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('finances.accountNumber')}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={accountNumber}
                      onChangeText={(text) => setAccountNumber(text.replace(/\D/g, ''))}
                      placeholder={t('finances.accountNumberPlaceholder')}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>{t('finances.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleSubmit}
            >
              <Text style={styles.addText}>{t('finances.addMethod')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  label: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedType: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  typeText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  selectedTypeText: {
    color: theme.colors.primary,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  formContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  dropdownText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  placeholderText: {
    color: theme.colors.text.tertiary,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  addButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    alignItems: 'center',
  },
  addText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
});
