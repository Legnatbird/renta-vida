import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X, Paperclip, File, Scan } from 'lucide-react-native';
import { useFinanceStore } from '@/store/financeStore';
import { useTranslation } from '@/localization/i18n';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence,
  Easing 
} from 'react-native-reanimated';
import AIDocumentSuggestionsModal from '@/components/finances/AIDocumentSuggestionsModal'

interface AddFinanceModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddFinanceModal({ visible, onClose }: AddFinanceModalProps) {
  const { t } = useTranslation();
  const { addFinance } = useFinanceStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'bank' | 'investment' | 'expense' | 'document'>('bank');

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const opacityValue = useSharedValue(0);
  const scanLinePosition = useSharedValue(0);
  const documentOpacity = useSharedValue(0.5);
  
  const selectedFileStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
    };
  });
  
  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value * 150 }]
  }));
  
  const documentStyle = useAnimatedStyle(() => ({
    opacity: documentOpacity.value
  }));
  
  const categories: { key: 'bank' | 'investment' | 'expense' | 'document'; label: string }[] = [
    { key: 'bank', label: t('finances.bankStatement') },
    { key: 'investment', label: t('finances.investment') },
    { key: 'expense', label: t('finances.expense') },
    { key: 'document', label: t('finances.document') },
  ];
  
  const handleSaveDocument = () => {
    if (!title || !isFileSelected) return;
    
    addFinance({
      id: Date.now().toString(),
      title,
      description,
      category,
      date: new Date().toISOString(),
      fileName: selectedFileName || 'document.pdf',
    });
  };
  
  const handleCloseAndReset = () => {
    resetForm();
    onClose();
  };
  
  const handleShowSuggestions = () => {
    if (isFileSelected) {
      handleSaveDocument();
      
      setIsScanning(true);
      
      scanLinePosition.value = 0;
      documentOpacity.value = 0.5;
      
      scanLinePosition.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.linear }),
        2,
        true
      );
      
      documentOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 800 }),
          withTiming(0.5, { duration: 800 })
        ),
        2,
        true
      );
      
      setTimeout(() => {
        setIsScanning(false);
        setShowAISuggestions(true);
      }, 3000);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('bank');
    setIsFileSelected(false);
    setSelectedFileName('');
    opacityValue.value = 0;
  };
  
  const handleAttachDocument = () => {
    const documentNames = {
      bank: 'estado_cuenta_junio_2023.pdf',
      investment: 'reporte_inversiones_q2_2023.pdf',
      expense: 'factura_servicios_julio_2023.pdf',
      document: 'contrato_financiero_2023.pdf'
    };
    
    setSelectedFileName(documentNames[category]);
    setIsFileSelected(true);
    opacityValue.value = withTiming(1, { duration: 300 });
  };

  // Cerrar los modales cuando se cierra el modal principal
  useEffect(() => {
    if (visible) {
      resetForm();
    } else {
      setShowAISuggestions(false);
    }
  }, [visible]);
  
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isScanning ? t('aiDocumentAnalysis.analyzing') : t('finances.addDocument')}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              {isScanning ? (
                // Mostrar animación de escaneo
                <View style={styles.analyzingContainer}>
                  <View style={styles.scanAnimationContainer}>
                    {/* Document with scanning effect */}
                    <Animated.View style={[styles.documentOutline, documentStyle]}>
                      <File size={64} color={theme.colors.primary} />
                    </Animated.View>
                    
                    {/* Moving scan line */}
                    <Animated.View style={[styles.scanLine, scanLineStyle]} />
                    
                    <View style={styles.scanningIconContainer}>
                      <Scan size={24} color={theme.colors.primary} />
                      <ActivityIndicator 
                        size="small" 
                        color={theme.colors.primary} 
                        style={styles.activityIndicator} 
                      />
                    </View>
                  </View>
                  
                  <Text style={styles.analyzingText}>
                    {t('aiDocumentAnalysis.analyzingFile').replace('{documentName}', selectedFileName)}
                  </Text>
                  <Text style={styles.analyzingSubtext}>
                    {t('aiDocumentAnalysis.processDescription')}
                  </Text>
                </View>
              ) : (
                // Mostrar formulario normal
                <Pressable onPress={Keyboard.dismiss} style={{flex: 1}}>
                  <View>
                    <Text style={styles.inputLabel}>{t('finances.documentTitle')}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Bank Statement June 2025"
                      value={title}
                      onChangeText={setTitle}
                    />
                    
                    <Text style={styles.inputLabel}>{t('finances.description')}</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Add details about this document"
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    
                    <Text style={styles.inputLabel}>{t('finances.category')}</Text>
                    <View style={styles.categoriesContainer}>
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat.key}
                          style={[
                            styles.categoryButton,
                            category === cat.key && styles.activeCategoryButton,
                          ]}
                          onPress={() => setCategory(cat.key)}
                          disabled={isFileSelected}
                        >
                          <Text 
                            style={[
                              styles.categoryText,
                              category === cat.key && styles.activeCategoryText,
                            ]}
                          >
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {!isFileSelected ? (
                      <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={handleAttachDocument}
                      >
                        <Paperclip size={20} color="#FFFFFF" />
                        <Text style={styles.uploadButtonText}>{t('finances.attachDocument')}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Animated.View style={[styles.selectedFileContainer, selectedFileStyle]}>
                        <View style={styles.fileIconContainer}>
                          <File size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.fileInfoContainer}>
                          <Text style={styles.fileName}>{selectedFileName}</Text>
                        </View>
                      </Animated.View>
                    )}
                    
                    {/* Botón para mostrar sugerencias - activado inmediatamente después de adjuntar */}
                    <TouchableOpacity 
                      style={[
                        styles.addButton,
                        (!isFileSelected) && styles.disabledButton
                      ]}
                      onPress={handleShowSuggestions}
                      disabled={!isFileSelected}
                    >
                      <Text style={styles.addButtonText}>
                        {isFileSelected 
                          ? t('finances.showSuggestions') 
                          : t('finances.add')
                        }
                      </Text>
                    </TouchableOpacity>
                    
                    {/* Botón para guardar sin ver sugerencias - aparece cuando se ha adjuntado un archivo */}
                    {isFileSelected && (
                      <TouchableOpacity 
                        style={styles.skipButton}
                        onPress={() => {
                          handleSaveDocument();
                          handleCloseAndReset();
                        }}
                      >
                        <Text style={styles.skipButtonText}>{t('finances.saveWithoutSuggestions')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      <AIDocumentSuggestionsModal 
        visible={showAISuggestions} 
        onClose={() => {
          setShowAISuggestions(false);
          handleCloseAndReset();
        }}
        documentType={category}
        documentName={selectedFileName}
      />
    </>
  );
}

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
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  activeCategoryButton: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  categoryText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  activeCategoryText: {
    color: theme.colors.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  uploadButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
    marginLeft: theme.spacing.sm,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  fileInfoContainer: {
    flex: 1,
  },
  fileName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  skipButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
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
  
  analyzingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scanAnimationContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
  },
  documentOutline: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.small,
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    width: '80%',
    backgroundColor: 'rgba(0, 102, 204, 0.5)',
    top: 0,
    left: '10%',
    zIndex: 10,
  },
  scanningIconContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.small,
    padding: 5,
  },
  activityIndicator: {
    marginLeft: 5,
  },
  analyzingText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  analyzingSubtext: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});