import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { LineChart } from 'react-native-chart-kit';
import { ChevronRight } from 'lucide-react-native';
import { useGoalStore } from '@/store/goalStore';
import { useTranslation } from '@/localization/i18n';

export default function SummaryCard() {
  const { t, language } = useTranslation();
  const { goals } = useGoalStore();
  
  // Calculate total goal amount and saved amount
  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.amount, 0);
  const savedAmount = goals.reduce((sum, goal) => sum + (goal.amount * goal.progress / 100), 0);
  const overallProgress = totalGoalAmount > 0 ? (savedAmount / totalGoalAmount) * 100 : 0;
  
  // Monthly savings data for the chart - with localized month names and legend
  const monthlySavingsData = {
    labels: language === 'es' 
      ? ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [1500, 1800, 2200, 2000, 2400, 2600],
        color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: [t('home.monthlySavings')]
  };
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#0066CC"
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('home.financialSummary')}</Text>
          <Text style={styles.subtitle}>{t('home.savingsJourney')}</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
          <ChevronRight size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${totalGoalAmount.toLocaleString()}</Text>
          <Text style={styles.statLabel}>{t('home.goalAmount')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${Math.round(savedAmount).toLocaleString()}</Text>
          <Text style={styles.statLabel}>{t('home.saved')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(overallProgress)}%</Text>
          <Text style={styles.statLabel}>{t('home.progress')}</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={monthlySavingsData}
          width={320}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  chart: {
    borderRadius: theme.borderRadius.medium,
    marginLeft: -15,
    fontFamily: theme.typography.fontFamily.semiBold
  },
});