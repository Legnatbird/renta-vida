import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { theme } from '@/constants/theme';
import { useTranslation } from '@/localization/i18n';
import { X, FileText, Download, ArrowRight, Tag } from 'lucide-react-native';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Invoice } from '@/store/invoiceStore';

interface EmailInvoicesModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  invoices: Invoice[];
}

export default function EmailInvoicesModal({ 
  visible, 
  onClose,
  email,
  invoices
}: EmailInvoicesModalProps) {
  const { t, language } = useTranslation();
  
  // Set date locale based on current language
  const dateLocale = language === 'es' ? es : enUS;
  
  // Helper function for category translation
  const getCategoryTranslation = (category: string) => {
    return t(`finances.invoiceCategories.${category}` as any) || category;
  };
  
  // Helper function for status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'processed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'analyzed':
        return theme.colors.primary;
      default:
        return theme.colors.text.tertiary;
    }
  };
  
  // Helper function for status text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'processed':
        return t('finances.invoiceProcessed');
      case 'pending':
        return t('finances.invoicePending');
      case 'analyzed':
        return t('finances.invoiceAnalyzed');
      default:
        return '';
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
            <View>
              <Text style={styles.modalTitle}>{t('finances.scannedInvoices')}</Text>
              <Text style={styles.emailSubtitle}>{email}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{invoices.length}</Text>
              <Text style={styles.statLabel}>{t('finances.invoicesThisMonth')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                ${invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>{t('finances.totalAmount')}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>{t('finances.recentInvoices')}</Text>
            
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <View key={invoice.id} style={styles.invoiceCard}>
                  <View style={styles.invoiceHeader}>
                    <View style={styles.issuerContainer}>
                      {invoice.logo ? (
                        <Image source={{ uri: invoice.logo }} style={styles.issuerLogo} />
                      ) : (
                        <View style={styles.logoPlaceholder}>
                          <FileText size={20} color={theme.colors.primary} />
                        </View>
                      )}
                      <View>
                        <Text style={styles.issuerName}>{invoice.issuer}</Text>
                        <Text style={styles.invoiceDate}>
                          {format(invoice.date, 'PPP', { locale: dateLocale })}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.invoiceAmount}>
                      ${invoice.amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.invoiceFooter}>
                    <View style={[styles.categoryTag, { backgroundColor: 'rgba(0, 102, 204, 0.1)' }]}>
                      <Tag size={14} color={theme.colors.primary} />
                      <Text style={styles.categoryText}>{getCategoryTranslation(invoice.category)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(invoice.status)}10` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                        {getStatusText(invoice.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.invoiceActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.viewDetailsText}>{t('finances.viewDetails')}</Text>
                      <ArrowRight size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.downloadButton}>
                      <Download size={16} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('finances.noInvoicesFound')}</Text>
              </View>
            )}
          </ScrollView>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{t('finances.viewAllInvoices')}</Text>
          </TouchableOpacity>
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
    maxHeight: '80%',
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
  emailSubtitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  modalContent: {
    padding: theme.spacing.lg,
    maxHeight: 400,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  invoiceCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  issuerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issuerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  issuerName: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  invoiceDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  invoiceAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  invoiceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
  },
  categoryText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
  },
  invoiceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  viewDetailsText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  downloadButton: {
    padding: theme.spacing.sm,
  },
  viewAllButton: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  viewAllText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
