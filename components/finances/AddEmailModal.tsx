import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { theme } from '@/constants/theme';
import { useTranslation } from '@/localization/i18n';
import { X, Mail, Check } from 'lucide-react-native';

interface AddEmailModalProps {
  visible: boolean;
  onClose: () => void;
  onAddEmail: (email: string) => void;
}

export default function AddEmailModal({ 
  visible, 
  onClose, 
  onAddEmail 
}: AddEmailModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendCode = () => {
    if (!email || !validateEmail(email)) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsCodeSent(true);
      // Aquí se simula el envío del código de verificación
      setVerificationCode('123456');
    }, 2000);
  };
  
  const handleAddEmail = () => {
    if (!email || !verificationCode) return;
    
    setIsLoading(true);
    // Simulación de verificación exitosa
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      
      // Cerrar el modal y añadir el correo a la lista
      setTimeout(() => {
        onAddEmail(email);
        resetForm();
        onClose();
      }, 1500);
    }, 1000);
  };
  
  const resetForm = () => {
    setEmail('');
    setVerificationCode('');
    setIsCodeSent(false);
    setIsSending(false);
    setIsVerified(false);
  };
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Limpiar el formulario cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);
  
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
            <Text style={styles.modalTitle}>
              {isVerified ? t('finances.emailVerified') : t('finances.addEmail')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {isVerified ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Check size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>{t('finances.emailAddedSuccessfully')}</Text>
              <Text style={styles.successText}>
                {email} {t('finances.hasBeenLinked')}
              </Text>
            </View>
          ) : (
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>{t('finances.emailAddress')}</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isCodeSent}
                />
              </View>
              
              {!isCodeSent ? (
                <TouchableOpacity 
                  style={[
                    styles.sendCodeButton,
                    (!validateEmail(email) || isSending) && styles.disabledButton
                  ]}
                  onPress={handleSendCode}
                  disabled={!validateEmail(email) || isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sendCodeText}>{t('finances.sendVerificationCode')}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={styles.inputLabel}>{t('finances.verificationCode')}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      placeholder="123456"
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <Text style={styles.codeInfo}>
                    {t('finances.verificationCodeSent')} {email}
                  </Text>
                  
                  <TouchableOpacity 
                    style={[
                      styles.addButton,
                      (!verificationCode || isLoading) && styles.disabledButton
                    ]}
                    onPress={handleAddEmail}
                    disabled={!verificationCode || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.addButtonText}>{t('finances.verifyAndAdd')}</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
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
    width: '85%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
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
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.lg,
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
  sendCodeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCodeText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
  codeInfo: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
    opacity: 0.7,
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
    textAlign: 'center',
  }
});
