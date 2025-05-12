import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/constants/theme';
import { useTranslation } from '@/localization/i18n';
import { Notification } from '@/types/notifications';
import { 
  GraduationCap, 
  Heart, 
  Activity, 
  Landmark, 
  Coins, 
  Home, 
  Shield, 
  ArrowRight 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface InsuranceRecommendationCardProps {
  notification: Notification;
}

export default function InsuranceRecommendationCard({ notification }: InsuranceRecommendationCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  if (notification.type !== 'insurance_recommendation' || !notification.insuranceType) {
    return null;
  }
  
  const getInsuranceImage = () => {
    // En un caso real, aquí importarías imágenes específicas para cada tipo de seguro
    // Por ahora usaremos íconos como ejemplo
    switch(notification.insuranceType) {
      case 'education':
        return <GraduationCap size={48} color={theme.colors.primary} />;
      case 'life':
        return <Heart size={48} color="#FF5D8F" />;
      case 'personal_accident':
        return <Activity size={48} color="#FF9500" />;
      case 'voluntary_pension':
        return <Landmark size={48} color="#34C759" />;
      case 'life_annuity':
        return <Coins size={48} color="#AF52DE" />;
      case 'voluntary_rent':
        return <Home size={48} color="#007AFF" />;
      default:
        return <Shield size={48} color={theme.colors.primary} />;
    }
  };
  
  const handlePress = () => {
    if (notification.action) {
      router.push({ 
        pathname: notification.action.screen as any, 
        params: notification.action.params 
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getInsuranceImage()}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.insuranceType}>
            {t(`notifications.insuranceTypes.${notification.insuranceType}`)}
          </Text>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>
              {t('notifications.recommendedForYou')}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description}>{notification.message}</Text>
      
      {notification.reason && (
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('notifications.basedOn')}: </Text>
          <Text style={styles.infoValue}>{notification.reason}</Text>
        </View>
      )}
      
      {notification.savingAmount && (
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('notifications.savingPotential')}: </Text>
          <Text style={[styles.infoValue, { color: theme.colors.success }]}>
            ${notification.savingAmount.toLocaleString()}
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handlePress}
      >
        <Text style={styles.actionButtonText}>
          {notification.action?.label || t('notifications.viewDetails')}
        </Text>
        <ArrowRight size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  insuranceType: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  recommendedBadge: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    alignSelf: 'flex-start',
  },
  recommendedText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
  },
  description: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
    marginRight: theme.spacing.sm,
  },
});
