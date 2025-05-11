import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X, AlertTriangle, Check, Lightbulb, ArrowRight, FileText, ChevronLeft } from 'lucide-react-native';
import { useTranslation } from '@/localization/i18n';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';

interface AIDocumentSuggestionsModalProps {
  visible: boolean;
  onClose: () => void;
  documentType: 'bank' | 'expense' | 'document';
  documentName: string;
}

const screenWidth = Dimensions.get('window').width * 0.85;

export default function AIDocumentSuggestionsModal({ 
  visible, 
  onClose,
  documentType,
  documentName
}: AIDocumentSuggestionsModalProps) {
  const { t } = useTranslation();
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<number | null>(null);
  const navigation = useNavigation();

  const getSuggestions = () => {
    switch (documentType) {
      case 'bank':
        return [
          {
            title: t('aiDocumentAnalysis.expenseOptimizationTitle'),
            description: t('aiDocumentAnalysis.expenseOptimizationDesc'),
            icon: <AlertTriangle size={24} color={theme.colors.warning} />,
            actions: [
              t('aiDocumentAnalysis.viewDetailedAnalysis'), 
              t('aiDocumentAnalysis.createSavingsPlan')
            ]
          }
        ];
      case 'expense':
        return [
          {
            title: t('aiDocumentAnalysis.automaticCategorizationTitle'),
            description: t('aiDocumentAnalysis.automaticCategorizationDesc'),
            icon: <Check size={24} color={theme.colors.success} />,
            actions: [
              t('aiDocumentAnalysis.categorizeExpense'), 
              t('aiDocumentAnalysis.viewBudget')
            ]
          },
          {
            title: t('aiDocumentAnalysis.potentialClaimTitle'),
            description: t('aiDocumentAnalysis.potentialClaimDesc'),
            icon: <AlertTriangle size={24} color={theme.colors.warning} />,
            actions: [
              t('aiDocumentAnalysis.startClaim'), 
              t('aiDocumentAnalysis.ignore')
            ]
          }
        ];
      default:
        return [
          {
            title: t('aiDocumentAnalysis.analysisCompletedTitle'),
            description: t('aiDocumentAnalysis.analysisCompletedDesc'),
            icon: <Check size={24} color={theme.colors.success} />,
            actions: [
              t('aiDocumentAnalysis.viewDocument'), 
              t('aiDocumentAnalysis.share')
            ]
          }
        ];
    }
  };
  
  const suggestions = getSuggestions();
  
  const handleApplySuggestion = (index: number, actionIndex: number = 0) => {
    setSelectedSuggestion(index);
    
    // Mostrar simulación/preview para los casos
    setCurrentPreview(index);
    setShowPreview(true);
  };
  
  const handleBackFromPreview = () => {
    setShowPreview(false);
    setCurrentPreview(null);
  };
  
  // Renderizar previsualizaciones según el tipo de documento y sugerencia
  const renderPreview = () => {
    if (currentPreview === null) return null;

    switch(documentType) {
      case 'bank':
        // Optimización de gastos
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>{t('aiDocumentAnalysis.expenseOptimizationTitle')}</Text>
            
            <Text style={styles.previewSubtitle}>{t('finances.monthlyBreakdown')}</Text>
            <BarChart
              data={{
                labels: [
                  t('finances.categories.entertainment'),
                  t('finances.categories.food'),
                  t('finances.categories.transport'),
                  t('finances.categories.utilities'),
                  t('finances.categories.shopping'),
                  t('finances.categories.other')
                ],
                datasets: [{
                  data: [120, 240, 180, 90, 150, 80]
                }]
              }}
              width={screenWidth}
              height={200}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.text.secondary,
              }}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
            
            <View style={styles.savingOpportunityContainer}>
              <Text style={styles.savingLabel}>{t('aiDocumentAnalysis.potentialSavingsLabel')}</Text>
              <View style={styles.savingItems}>
                <View style={styles.savingItem}>
                  <Text style={styles.savingCategory}>{t('finances.categories.entertainment')}</Text>
                  <Text style={styles.savingAmount}>-$40/{t('finances.period.month')}</Text>
                </View>
                <View style={styles.savingItem}>
                  <Text style={styles.savingCategory}>{t('finances.categories.eatingOut')}</Text>
                  <Text style={styles.savingAmount}>-$120/{t('finances.period.month')}</Text>
                </View>
                <View style={styles.savingItem}>
                  <Text style={styles.savingCategory}>{t('finances.categories.subscriptions')}</Text>
                  <Text style={styles.savingAmount}>-$35/{t('finances.period.month')}</Text>
                </View>
                <View style={[styles.savingItem, styles.totalSaving]}>
                  <Text style={styles.totalSavingText}>{t('aiDocumentAnalysis.totalPotentialSavings')}</Text>
                  <Text style={styles.totalSavingAmount}>$195/{t('finances.period.month')}</Text>
                </View>
              </View>
            </View>
          </View>
        );
        
      case 'expense':
        // Categorización automática o reclamación potencial
        if (currentPreview === 0) {
          // Categorización automática
          return (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{t('aiDocumentAnalysis.automaticCategorizationTitle')}</Text>
              
              <View style={styles.receiptPreview}>
                <Text style={styles.receiptTitle}>{t('aiDocumentAnalysis.receipt')}</Text>
                <Text style={styles.receiptDate}>22/07/2023</Text>
                <View style={styles.receiptLine}>
                  <Text style={styles.receiptItem}>{t('finances.categories.taxi')}</Text>
                  <Text style={styles.receiptAmount}>$34.50</Text>
                </View>
                <View style={styles.receiptLine}>
                  <Text style={styles.receiptItem}>{t('aiDocumentAnalysis.serviceFee')}</Text>
                  <Text style={styles.receiptAmount}>$5.00</Text>
                </View>
                <View style={styles.receiptLine}>
                  <Text style={styles.receiptItem}>{t('aiDocumentAnalysis.tip')}</Text>
                  <Text style={styles.receiptAmount}>$8.20</Text>
                </View>
                <View style={styles.receiptTotal}>
                  <Text style={styles.receiptTotalText}>{t('aiDocumentAnalysis.total')}</Text>
                  <Text style={styles.receiptTotalAmount}>$47.70</Text>
                </View>
              </View>
              
              <View style={styles.categoryRecommendation}>
                <Text style={styles.categoryTitle}>{t('aiDocumentAnalysis.suggestedCategory')}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>🚕 {t('aiDocumentAnalysis.transportation')}</Text>
                </View>
                <Text style={styles.categoryNote}>
                  {t('aiDocumentAnalysis.addToBudgetQuestion')}
                </Text>
                
                <View style={styles.categoryButtons}>
                  <TouchableOpacity style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>{t('aiDocumentAnalysis.addToBudget')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.categoryButton, styles.secondaryCategoryButton]}>
                    <Text style={styles.secondaryCategoryButtonText}>{t('aiDocumentAnalysis.changeCategory')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        } else {
          // Reclamación potencial
          return (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{t('aiDocumentAnalysis.potentialClaimTitle')}</Text>
              
              <View style={styles.duplicateChargesContainer}>
                <Text style={styles.duplicateTitle}>{t('aiDocumentAnalysis.duplicateChargesDetected')}</Text>
                
                <View style={styles.chargeItem}>
                  <View style={styles.chargeDetails}>
                    <Text style={styles.chargeName}>{t('finances.services.netflix')}</Text>
                    <Text style={styles.chargeDate}>15/07/2023</Text>
                  </View>
                  <Text style={styles.chargeAmount}>$59.90</Text>
                </View>
                
                <View style={[styles.chargeItem, styles.duplicateCharge]}>
                  <View style={styles.chargeDetails}>
                    <Text style={styles.chargeName}>{t('finances.services.netflix')}</Text>
                    <Text style={styles.chargeDate}>15/07/2023</Text>
                    <View style={styles.duplicateBadge}>
                      <Text style={styles.duplicateBadgeText}>{t('aiDocumentAnalysis.duplicate')}</Text>
                    </View>
                  </View>
                  <Text style={styles.chargeAmount}>$59.90</Text>
                </View>
              </View>
              
              <View style={styles.claimContainer}>
                <Text style={styles.claimText}>
                  {t('aiDocumentAnalysis.claimInstructions')}
                </Text>
                
                <View style={styles.claimSteps}>
                  <View style={styles.claimStep}>
                    <View style={styles.claimStepNumber}>
                      <Text style={styles.claimStepNumberText}>1</Text>
                    </View>
                    <Text style={styles.claimStepText}>{t('aiDocumentAnalysis.contactMerchant')}</Text>
                  </View>
                  
                  <View style={styles.claimStep}>
                    <View style={styles.claimStepNumber}>
                      <Text style={styles.claimStepNumberText}>2</Text>
                    </View>
                    <Text style={styles.claimStepText}>{t('aiDocumentAnalysis.provideBankStatement')}</Text>
                  </View>
                  
                  <View style={styles.claimStep}>
                    <View style={styles.claimStepNumber}>
                      <Text style={styles.claimStepNumberText}>3</Text>
                    </View>
                    <Text style={styles.claimStepText}>{t('aiDocumentAnalysis.requestRefund')}</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.startClaimButton}>
                  <Text style={styles.startClaimButtonText}>{t('aiDocumentAnalysis.startClaim')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      default:
        // Document analysis
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>{t('aiDocumentAnalysis.analysisCompletedTitle')}</Text>
            
            <View style={styles.documentInfoContainer}>
              <FileText size={48} color={theme.colors.primary} style={styles.documentIcon} />
              
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{documentName}</Text>
                <Text style={styles.documentDate}>
                  {t('aiDocumentAnalysis.addedOn')} {new Date().toLocaleDateString()}
                </Text>
                
                <View style={styles.documentTags}>
                  <View style={styles.documentTag}>
                    <Text style={styles.documentTagText}>{t('aiDocumentAnalysis.categorized')}</Text>
                  </View>
                  <View style={styles.documentTag}>
                    <Text style={styles.documentTagText}>{t('aiDocumentAnalysis.indexed')}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.documentActions}>
              <TouchableOpacity style={styles.documentActionButton}>
                <Text style={styles.documentActionText}>{t('aiDocumentAnalysis.viewDocument')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.documentActionButton, styles.documentShareButton]}>
                <Text style={styles.documentShareText}>{t('aiDocumentAnalysis.share')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };
  
  // Reset de estados cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setShowPreview(false);
      setCurrentPreview(null);
      setSelectedSuggestion(-1);
    }
  }, [visible]);
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            {showPreview ? (
              <>
                <TouchableOpacity onPress={handleBackFromPreview} style={styles.backButton}>
                  <ChevronLeft size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{t('aiDocumentAnalysis.preview')}</Text>
              </>
            ) : (
              <Text style={styles.modalTitle}>{t('aiDocumentAnalysis.smartSuggestions')}</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {showPreview ? (
              renderPreview()
            ) : (
              <>
                <Animated.View 
                  entering={FadeIn.delay(200)}
                  style={styles.aiSummaryContainer}
                >
                  <View style={styles.aiIconContainer}>
                    <Lightbulb size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.aiSummaryContent}>
                    <Text style={styles.aiSummaryTitle}>{t('aiDocumentAnalysis.aiSummary')}</Text>
                    <Text style={styles.aiSummaryText}>
                      {documentType === 'bank' && t('aiDocumentAnalysis.bankAnalysisSummary')}
                      {documentType === 'expense' && t('aiDocumentAnalysis.expenseAnalysisSummary')}
                      {documentType === 'document' && t('aiDocumentAnalysis.documentAnalysisSummary')}
                    </Text>
                  </View>
                </Animated.View>
                
                <Text style={styles.suggestionsTitle}>{t('aiDocumentAnalysis.recommendedActions')}</Text>
                
                {suggestions.map((suggestion, index) => (
                  <Animated.View 
                    key={index}
                    entering={FadeInDown.delay(300 + index * 200).springify()}
                    style={[
                      styles.suggestionCard,
                      selectedSuggestion === index && styles.selectedSuggestion
                    ]}
                  >
                    <View style={styles.suggestionHeader}>
                      <View style={styles.suggestionIconContainer}>
                        {suggestion.icon}
                      </View>
                      <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    </View>
                    
                    <Text style={styles.suggestionDescription}>
                      {suggestion.description}
                    </Text>
                    
                    <View style={styles.actionButtons}>
                      {suggestion.actions.map((action, actionIndex) => (
                        <TouchableOpacity 
                          key={actionIndex}
                          style={[
                            styles.actionButton,
                            actionIndex === 0 ? styles.primaryAction : styles.secondaryAction
                          ]}
                          onPress={() => handleApplySuggestion(index, actionIndex)}
                        >
                          <Text style={[
                            styles.actionButtonText,
                            actionIndex === 0 ? styles.primaryActionText : styles.secondaryActionText
                          ]}>
                            {action}
                          </Text>
                          {actionIndex === 0 && <ArrowRight size={16} color="#FFFFFF" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Animated.View>
                ))}
              </>
            )}
          </ScrollView>
          
          {!showPreview && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={onClose}
              >
                <Text style={styles.closeModalText}>{t('aiDocumentAnalysis.close')}</Text>
              </TouchableOpacity>
            </View>
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
    maxHeight: 500,
  },
  aiSummaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  aiSummaryContent: {
    flex: 1,
  },
  aiSummaryTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  aiSummaryText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  suggestionsTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  suggestionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  selectedSuggestion: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  suggestionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  suggestionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  suggestionDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    marginRight: theme.spacing.xs,
  },
  primaryActionText: {
    color: '#FFFFFF',
  },
  secondaryActionText: {
    color: theme.colors.text.primary,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  closeModalButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  closeModalText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  previewContainer: {
    padding: theme.spacing.md,
  },
  previewTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  previewSubtitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  savingOpportunityContainer: {
    backgroundColor: 'rgba(0, 179, 134, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  savingLabel: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  savingItems: {
    marginTop: theme.spacing.sm,
  },
  savingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  savingCategory: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  savingAmount: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
  },
  totalSaving: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 0,
  },
  totalSavingText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  totalSavingAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
  },
  benefitsContainer: {
    marginTop: theme.spacing.lg,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  benefitsTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  strategyComparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  strategyCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginHorizontal: 4,
    ...theme.shadows.small,
    position: 'relative',
  },
  recommendedStrategyCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  strategyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  strategyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  strategyLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  strategyValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  talkWithAdvisorContainer: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  talkWithAdvisorText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  talkWithAdvisorButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  talkWithAdvisorButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
    marginLeft: theme.spacing.sm,
  },
  receiptPreview: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  receiptTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  receiptDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptItem: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  receiptAmount: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  receiptTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  receiptTotalText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  receiptTotalAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  categoryRecommendation: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  categoryTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: theme.colors.success,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.md,
  },
  categoryBadgeText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
  },
  categoryNote: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  secondaryCategoryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
  },
  secondaryCategoryButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  duplicateChargesContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  duplicateTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.warning,
    marginBottom: theme.spacing.md,
  },
  chargeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  duplicateCharge: {
    backgroundColor: 'rgba(255, 149, 0, 0.05)',
  },
  chargeDetails: {
    flex: 1,
  },
  chargeName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  chargeDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  chargeAmount: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  duplicateBadge: {
    backgroundColor: theme.colors.warning,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    marginTop: 4,
  },
  duplicateBadgeText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
  },
  claimContainer: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  claimText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  claimSteps: {
    marginBottom: theme.spacing.md,
  },
  claimStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  claimStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  claimStepNumberText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
  },
  claimStepText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  startClaimButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  startClaimButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
  },
  documentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  documentIcon: {
    marginRight: theme.spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  documentDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  documentTags: {
    flexDirection: 'row',
  },
  documentTag: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    marginRight: 8,
  },
  documentTagText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentActionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  documentActionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: '#FFFFFF',
  },
  documentShareButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  documentShareText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
});
