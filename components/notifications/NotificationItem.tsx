import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { Notification } from '@/types/notifications';
import { useTranslation } from '@/localization/i18n';
import { 
  Bell, 
  CreditCard, 
  Calendar, 
  Award, 
  Shield, 
  GraduationCap,
  Heart,
  Activity,
  Landmark,
  Coins,
  Home
} from 'lucide-react-native';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'payment_due':
        return <CreditCard size={24} color={theme.colors.warning} />;
      case 'payment_completed':
        return <CreditCard size={24} color={theme.colors.success} />;
      case 'goal_progress':
        return <Award size={24} color={theme.colors.secondary} />;
      case 'goal_achievement':
        return <Calendar size={24} color={theme.colors.success} />;
      case 'insurance_recommendation':
        // Different icons based on insurance type
        switch (notification.insuranceType) {
          case 'education':
            return <GraduationCap size={24} color={theme.colors.primary} />;
          case 'life':
            return <Heart size={24} color={theme.colors.primary} />;
          case 'personal_accident':
            return <Activity size={24} color={theme.colors.primary} />;
          case 'voluntary_pension':
            return <Landmark size={24} color={theme.colors.primary} />;
          case 'life_annuity':
            return <Coins size={24} color={theme.colors.primary} />;
          case 'voluntary_rent':
            return <Home size={24} color={theme.colors.primary} />;
          default:
            return <Shield size={24} color={theme.colors.primary} />;
        }
      default:
        return <Bell size={24} color={theme.colors.text.secondary} />;
    }
  };
  
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'es' ? es : enUS;
    
    if (isToday(date)) {
      return t('notifications.today');
    } else if (isYesterday(date)) {
      return t('notifications.yesterday');
    } else {
      // For more than 7 days, display actual date
      const now = new Date();
      const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 7) {
        return format(date, 'dd MMM', { locale });
      } else {
        return formatDistanceToNow(date, { addSuffix: true, locale });
      }
    }
  };
  
  // Get notification title - use translation key if available, fallback to title property
  const getNotificationTitle = () => {
    if (notification.titleKey) {
      return t(notification.titleKey as any);
    }
    return notification.title || '';
  };
  
  // Get notification message - use translation key if available, fallback to message property
  const getNotificationMessage = () => {
    if (notification.messageKey) {
      // If we have message parameters, we need to handle interpolation
      if (notification.messageParams) {
        // This is a simplified approach - ideally you'd have a proper interpolation system
        let message = t(notification.messageKey as any);
        Object.entries(notification.messageParams).forEach(([key, value]) => {
          message = message.replace(`{${key}}`, value.toString());
        });
        return message;
      }
      return t(notification.messageKey as any);
    }
    return notification.message || '';
  };

  const handleActionPress = () => {
    // Handle action based on notification type
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.read && styles.unreadContainer
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon()}
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{getNotificationTitle()}</Text>
        <Text style={styles.message}>{getNotificationMessage()}</Text>
        
        {notification.action && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleActionPress}
          >
            <Text style={styles.actionButtonText}>
              {notification.action.labelKey ? t(notification.action.labelKey as any) : notification.action.label }
            </Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.date}>
          {formatNotificationDate(notification.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  unreadContainer: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  message: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
  },
  date: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
});
