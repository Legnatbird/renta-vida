import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { PieChart } from 'react-native-chart-kit';
import { LineChart } from 'react-native-chart-kit';
import { Plus, Wallet, Briefcase, Receipt, FileText } from 'lucide-react-native';
import { useFinanceStore } from '@/store/financeStore';
import AddFinanceModal from '@/components/finances/AddFinanceModal';

export default function FinancesScreen() {
  const { finances } = useFinanceStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
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
    { name: 'Income', value: 6500, color: theme.colors.success, legendFontColor: theme.colors.text.primary },
    { name: 'Expenses', value: 3800, color: theme.colors.warning, legendFontColor: theme.colors.text.primary },
    { name: 'Savings', value: 2700, color: theme.colors.primary, legendFontColor: theme.colors.text.primary },
  ];
  
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [5200, 5500, 6000, 5800, 6200, 6500],
        color: (opacity = 1) => `rgba(0, 179, 134, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Income"]
  };

  const financeCategories = [
    { id: '1', title: 'Bank Statements', icon: <Wallet size={24} color={theme.colors.primary} /> },
    { id: '2', title: 'Investments', icon: <Briefcase size={24} color={theme.colors.secondary} /> },
    { id: '3', title: 'Expenses', icon: <Receipt size={24} color={theme.colors.warning} /> },
    { id: '4', title: 'Documents', icon: <FileText size={24} color={theme.colors.text.primary} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Dashboard</Text>
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
          <Text style={styles.cardTitle}>Monthly Breakdown</Text>
          <PieChart
            data={pieData}
            width={300}
            height={180}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Income Trend</Text>
          <LineChart
            data={lineData}
            width={320}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <Text style={styles.sectionTitle}>Financial Categories</Text>
        
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

        <Text style={styles.sectionTitle}>Recent Uploads</Text>
        
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
            <Text style={styles.emptyText}>No financial documents yet. Add your first document!</Text>
          </View>
        )}
      </ScrollView>
      
      <AddFinanceModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
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
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
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