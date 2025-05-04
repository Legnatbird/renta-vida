import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { RentalPlan } from '@/types/goals';
import { useTranslation } from '@/localization/i18n';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
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
  const { t, language } = useTranslation();
  const achievementDate = new Date(plan.achievementDate);
  const dateLocale = language === 'es' ? es : enUS;
  
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
        <Text style={styles.title}>{t(plan.name.startsWith('Plan A') ? 'plans.planA' : 'plans.planB')}</Text>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>{t('plans.selected')}</Text>
            <Check size={14} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('plans.monthlyRent')}:</Text>
          <Text style={styles.detailValue}>${plan.monthlyRent.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('plans.rentPeriod')}:</Text>
          <Text style={styles.detailValue}>{plan.rentPeriod} {t('plans.years')}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('plans.monthlyContribution')}:</Text>
          <Text style={[styles.detailValue, styles.highlightedValue]}>
            ${plan.monthlyContribution.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('plans.achievementDate')}:</Text>
          <Text style={[styles.detailValue, styles.highlightedValue]}>{format(achievementDate, 'MMMM yyyy', { locale: dateLocale })}</Text>
        </View>
      </View>
      
      <View style={styles.proConContainer}>
        <View style={styles.proSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('plans.planStrengths')}</Text>
          </View>
          
          <View style={styles.itemsList}>
            {plan.strengths.map((strength, index) => (
              <View key={`strength-${index}`} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>
                  {t(strength)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.conSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('plans.planWeaknesses')}</Text>
          </View>
          
          <View style={styles.itemsList}>
            {plan.weaknesses.map((weakness, index) => (
              <View key={`weakness-${index}`} style={styles.listItem}>
                <View style={[styles.bulletPoint, styles.weaknessBullet]} />
                <Text style={styles.listItemText}>
                  {t(weakness)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {!isSelected && (
        <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
          <Text style={styles.selectButtonText}>{t('plans.selectThisPlan')}</Text>
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
  selectedBadgeText: {
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
  highlightedValue: {
    color: theme.colors.primary,
  },
  proConContainer: {
    marginBottom: theme.spacing.md,
  },
  proSection: {
    marginBottom: theme.spacing.md,
  },
  conSection: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  itemsList: {
    marginLeft: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  weaknessBullet: {
    backgroundColor: theme.colors.error,
  },
  listItemText: {
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
  selectButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
});
