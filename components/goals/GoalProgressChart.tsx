import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { LineChart } from 'react-native-chart-kit';
import { RentalPlan } from '@/types/goals';
import { useTranslation } from '@/localization/i18n';
import { format, differenceInMonths, addMonths } from 'date-fns';

interface GoalProgressChartProps {
  plan: RentalPlan;
  progress: number;
  startDate?: string;
}

export default function GoalProgressChart({ 
  plan, 
  progress,
  startDate = new Date().toISOString()
}: GoalProgressChartProps) {
  const { t, language } = useTranslation();
  
  // Calculate the date range for the chart
  const start = new Date(startDate);
  const end = new Date(plan.achievementDate);
  const totalMonths = Math.max(1, differenceInMonths(end, start));
  
  // Generate labels for the chart (6 points)
  const labels = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const spanishMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  for (let i = 0; i <= 5; i++) {
    const date = addMonths(start, Math.floor(i * totalMonths / 5));
    const monthIndex = date.getMonth();
    const monthName = language === 'es' ? spanishMonths[monthIndex] : months[monthIndex];
    labels.push(`${monthName} ${date.getFullYear()}`);
  }
  
  // Generate projected progress data
  const projectedData = [];
  const currentMonthProgress = progress / 100 * (plan.monthlyContribution * plan.rentPeriod * 12);
  
  for (let i = 0; i <= 5; i++) {
    const monthsPassed = Math.floor(i * totalMonths / 5);
    const projectedProgress = Math.min(
      100, 
      ((currentMonthProgress + (monthsPassed * plan.monthlyContribution)) / 
       (plan.monthlyContribution * plan.rentPeriod * 12)) * 100
    );
    projectedData.push(projectedProgress);
  }
  
  const chartData = {
    labels: labels.map(label => label.substring(0, 4)), // Abbreviate labels for space
    datasets: [
      {
        data: projectedData,
        color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: [t('home.progress')]
  };
  
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
      <Text style={styles.title}>{t('goals.projectedProgress')}</Text>
      <LineChart
        data={chartData}
        width={320}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withShadow={false}
        withVerticalLines={false}
        yAxisSuffix="%"
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.legendText}>{t('goals.projectedProgress')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
          <Text style={styles.legendText}>{t('goals.currentProgress')}: {progress}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.small,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  chart: {
    borderRadius: theme.borderRadius.medium,
    paddingRight: 0,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
