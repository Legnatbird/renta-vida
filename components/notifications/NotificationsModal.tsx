import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { theme } from '@/constants/theme';
import { useNotificationStore } from '@/store/notificationStore';
import { Notification } from '@/types/notifications';
import { useTranslation } from '@/localization/i18n';
import NotificationItem from '@/components/notifications/NotificationItem';
import { Check, Bell, Trash2, X } from 'lucide-react-native';

type FilterType = 'all' | 'unread' | 'insurance' | 'payments' | 'goals';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  const { t } = useTranslation();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    getInsuranceRecommendations,
    getPaymentNotifications,
    getGoalNotifications
  } = useNotificationStore();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const filteredNotifications = useCallback(() => {
    switch(activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'insurance':
        return getInsuranceRecommendations();
      case 'payments':
        return getPaymentNotifications();
      case 'goals':
        return getGoalNotifications();
      default:
        return notifications;
    }
  }, [notifications, activeFilter, getInsuranceRecommendations, getPaymentNotifications, getGoalNotifications]);
  
  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  const renderFilterButton = (filter: FilterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        activeFilter === filter && styles.activeFilterText
      ]}>
        {label}
      </Text>
      
      {filter === 'unread' && notifications.some(n => !n.read) && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>
            {notifications.filter(n => !n.read).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>{t('notifications.title')}</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={markAllAsRead}
                  >
                    <Check size={18} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={clearAll}
                  >
                    <Trash2 size={18} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={onClose}
                  >
                    <X size={22} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.filtersWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersContainer}
                >
                  {renderFilterButton('all', t('notifications.tabs.all'))}
                  {renderFilterButton('insurance', t('notifications.tabs.insurance'))}
                  {renderFilterButton('payments', t('notifications.tabs.payments'))}
                  {renderFilterButton('goals', t('notifications.tabs.goals'))}
                  {renderFilterButton('unread', t('notifications.filters.unread'))}
                </ScrollView>
              </View>
              
              {filteredNotifications().length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Bell size={48} color={theme.colors.text.tertiary} />
                  <Text style={styles.emptyText}>
                    {t('notifications.noNotifications')}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredNotifications()}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <NotificationItem 
                      notification={item}
                      onPress={handleNotificationPress}
                    />
                  )}
                  style={styles.notificationsList}
                  contentContainerStyle={styles.notificationsListContent}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  headerActionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    marginLeft: 4,
  },
  closeButton: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  filtersWrapper: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs, // Reduced from sm to xs
    height: 32, // Added explicit height
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Added to ensure proper centering
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: theme.colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsListContent: {
    paddingBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    flex: 1,
    minHeight: 200,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
