import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { RentalPlan } from '@/types/goals';
import { useTranslation } from '@/localization/i18n';
import { format } from 'date-fns';
import { Check, Calendar, DollarSign } from 'lucide-react-native';

interface RentalPlanCardProps {
  plan: RentalPlan;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function RentalPlanCard({ 
  plan, 
  isSelected = false, 
  onSelect 
}: RentalPlanCardProps) {
  const { t } = useTranslation();
  const achievementDate = new Date(plan.achievementDate);
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onSelect}
      disabled={!onSelect}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t(plan.name.startsWith('Plan A') ? 'goals.planA' : 'goals.planB')}</Text>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Check size={12} color="#FFFFFF" />
            <Text style={styles.selectedText}>{t('goals.selected')}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <DollarSign size={16} color={theme.colors.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{t('goals.monthlyRent')}:</Text>
            <Text style={styles.detailValue}>${plan.monthlyRent.toLocaleString()}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Calendar size={16} color={theme.colors.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{t('goals.rentPeriod')}:</Text>
            <Text style={styles.detailValue}>{plan.rentPeriod} {t('goals.years')}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <DollarSign size={16} color={theme.colors.success} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{t('goals.monthlyContribution')}:</Text>
            <Text style={styles.detailValue}>${plan.monthlyContribution.toLocaleString()}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Calendar size={16} color={theme.colors.success} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{t('goals.achievementDate')}:</Text>
            <Text style={styles.detailValue}>
              {format(achievementDate, 'MMMM yyyy')}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.pointsContainer}>
        <View style={styles.pointsSection}>
          <Text style={styles.pointsTitle}>{t('goals.planStrengths')}</Text>
          {plan.strengths.map((strength, index) => (
            <View key={`strength-${index}`} style={styles.pointRow}>
              <View style={[styles.pointBullet, styles.strengthBullet]} />
              <Text style={styles.pointText}>{t(strength)}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.pointsSection}>
          <Text style={styles.pointsTitle}>{t('goals.planWeaknesses')}</Text>
          {plan.weaknesses.map((weakness, index) => (
            <View key={`weakness-${index}`} style={styles.pointRow}>
              <View style={[styles.pointBullet, styles.weaknessBullet]} />
              <Text style={styles.pointText}>{t(weakness)}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {onSelect && (
        <TouchableOpacity 
          style={[
            styles.selectButton,
            isSelected && styles.selectedButton
          ]}
          onPress={onSelect}
        >
          <Text style={[
            styles.selectButtonText,
            isSelected && styles.selectedButtonText
          ]}>
            {isSelected ? t('goals.selected') : t('goals.selectThisPlan')}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.small,
  },
  selectedText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  detailsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  pointsContainer: {
    marginBottom: theme.spacing.md,
  },
  pointsSection: {
    marginBottom: theme.spacing.md,
  },
  pointsTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.sm,
  },
  strengthBullet: {
    backgroundColor: theme.colors.success,
  },
  weaknessBullet: {
    backgroundColor: theme.colors.error,
  },
  pointText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  selectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  selectButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});
