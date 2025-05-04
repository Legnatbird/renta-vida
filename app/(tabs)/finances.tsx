import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { PieChart } from 'react-native-chart-kit';
import { LineChart } from 'react-native-chart-kit';
import { Plus, Wallet, Briefcase, Receipt, FileText, CreditCard, ArrowRight, Percent, Coins, CalendarDays, Clock, ArrowDownUp } from 'lucide-react-native';
import { useFinanceStore } from '@/store/financeStore';
import AddFinanceModal from '@/components/finances/AddFinanceModal';
import { useTranslation } from '@/localization/i18n';
import AddPaymentMethodModal from '@/components/finances/AddPaymentMethodModal';
import AutoContributionModal from '@/components/finances/AutoContributionModal';

// Define payment method type
interface PaymentMethod {
  id: number;
  type: 'card' | 'bank';
  label: string;
  isAuto: boolean;
  autoType: 'round' | 'percent' | 'fixed' | null;
  autoValue: number | null;
}

export default function FinancesScreen() {
  const { t, language } = useTranslation();
  const { finances } = useFinanceStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isPaymentMethodModalVisible, setIsPaymentMethodModalVisible] = useState(false);
  const [isAutoContributionModalVisible, setIsAutoContributionModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };
  
  const pieData = [
    { name: t('finances.income'), value: 6500, color: theme.colors.success, legendFontColor: theme.colors.text.primary },
    { name: t('finances.expenses'), value: 3800, color: theme.colors.warning, legendFontColor: theme.colors.text.primary },
    { name: t('finances.savings'), value: 2700, color: theme.colors.primary, legendFontColor: theme.colors.text.primary },
  ];
  
  // Localized month labels based on the current language
  const monthLabels = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
  };
  
  const lineData = {
    labels: language === 'es' ? monthLabels.es : monthLabels.en,
    datasets: [
      {
        data: [5200, 5500, 6000, 5800, 6200, 6500],
        color: (opacity = 1) => `rgba(0, 179, 134, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: [t('finances.income')]
  };

  const financeCategories = [
    { id: '1', title: t('finances.bankStatements'), icon: <Wallet size={24} color={theme.colors.primary} /> },
    { id: '2', title: t('finances.investments'), icon: <Briefcase size={24} color={theme.colors.secondary} /> },
    { id: '3', title: t('finances.expenses'), icon: <Receipt size={24} color={theme.colors.warning} /> },
    { id: '4', title: t('finances.documents'), icon: <FileText size={24} color={theme.colors.text.primary} /> },
  ];

  // Sample payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 1, type: 'card', label: 'Visa ****4582', isAuto: true, autoType: 'round', autoValue: 1000 },
    { id: 2, type: 'bank', label: 'Cuenta Ahorros ****7390', isAuto: false, autoType: null, autoValue: null }
  ];

  const handleAddPaymentMethod = () => {
    setIsPaymentMethodModalVisible(true);
  };

  const handleConfigureAutoContribution = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsAutoContributionModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('finances.financialDashboard')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Plus size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('finances.monthlyBreakdown')}</Text>
          <PieChart
            data={pieData}
            width={300}
            height={180}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{ borderRadius: theme.borderRadius.medium }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('finances.incomeTrend')}</Text>
          <LineChart
            data={lineData}
            width={320}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Nueva sección: Métodos de Pago */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('finances.paymentMethods')}</Text>
          <TouchableOpacity onPress={handleAddPaymentMethod}>
            <Text style={styles.sectionAction}>{t('finances.addNew')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map(method => (
            <TouchableOpacity 
              key={method.id} 
              style={styles.paymentMethodCard}
              onPress={() => handleConfigureAutoContribution(method)}
            >
              <View style={styles.paymentMethodIconContainer}>
                {method.type === 'card' ? (
                  <CreditCard size={24} color={theme.colors.primary} />
                ) : (
                  <Wallet size={24} color={theme.colors.secondary} />
                )}
              </View>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodTitle}>{method.label}</Text>
                {method.isAuto ? (
                  <View style={styles.autoContributionBadge}>
                    <Text style={styles.autoContributionText}>
                      {method.autoType === 'round' ? t('finances.roundUpActive') : 
                       method.autoType === 'percent' ? t('finances.percentActive') : 
                       t('finances.fixedActive')}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.inactiveText}>{t('finances.tapToConfigure')}</Text>
                )}
              </View>
              <ArrowRight size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Sección: Configuración de Contribuciones Automáticas */}
        <Text style={styles.sectionTitle}>{t('finances.autoContributionSettings')}</Text>
        
        <View style={styles.contributionSettingsContainer}>
          <View style={styles.contributionSettingCard}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                <CalendarDays size={20} color={theme.colors.warning} />
              </View>
              <Text style={styles.settingTitle}>{t('finances.dueDatePriority')}</Text>
            </View>
            <Text style={styles.settingDescription}>{t('finances.dueDateDescription')}</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{t('finances.activateRule')}</Text>
              <Switch
                value={true}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.contributionSettingCard}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(0, 102, 204, 0.1)' }]}>
                <Coins size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.settingTitle}>{t('finances.minPaymentPriority')}</Text>
            </View>
            <Text style={styles.settingDescription}>{t('finances.minPaymentDescription')}</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{t('finances.activateRule')}</Text>
              <Switch
                value={false}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.contributionSettingCard}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                <ArrowDownUp size={20} color={theme.colors.success} />
              </View>
              <Text style={styles.settingTitle}>{t('finances.goalPriorityRule')}</Text>
            </View>
            <Text style={styles.settingDescription}>{t('finances.goalPriorityDescription')}</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{t('finances.activateRule')}</Text>
              <Switch
                value={false}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('finances.financialCategories')}</Text>
        
        <View style={styles.categoriesContainer}>
          {financeCategories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryIconContainer}>
                {category.icon}
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('finances.recentUploads')}</Text>
        
        {finances.length > 0 ? (
          <View style={styles.documentsContainer}>
            {finances.map(finance => (
              <TouchableOpacity key={finance.id} style={styles.documentCard}>
                <View style={styles.documentIconContainer}>
                  <FileText size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{finance.title}</Text>
                  <Text style={styles.documentDate}>{finance.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('finances.emptyDocuments')}</Text>
          </View>
        )}
      </ScrollView>
      
      <AddFinanceModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
      
      <AddPaymentMethodModal 
        visible={isPaymentMethodModalVisible}
        onClose={() => setIsPaymentMethodModalVisible(false)}
      />
      
      <AutoContributionModal 
        visible={isAutoContributionModalVisible}
        onClose={() => setIsAutoContributionModalVisible(false)}
        paymentMethod={selectedMethod}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.medium,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  pieChart: {
    borderRadius: theme.borderRadius.medium,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionAction: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  paymentMethodsContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  paymentMethodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  autoContributionBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    alignSelf: 'flex-start',
  },
  autoContributionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
  },
  inactiveText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  contributionSettingsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  contributionSettingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  settingTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  documentsContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  documentDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
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