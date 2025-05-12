import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Bell, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Timeline from '@/components/timeline/Timeline';
import { useGoalStore } from '@/store/goalStore';
import SummaryCard from '@/components/home/SummaryCard';
import { useTranslation } from '@/localization/i18n';
import { useNotificationStore } from '@/store/notificationStore';
import NotificationsModal from '@/components/notifications/NotificationsModal';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { goals } = useGoalStore();
  const { unreadCount } = useNotificationStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState(false);

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

  const handleNotificationPress = () => {
    setIsNotificationsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.dateText}>
                <Calendar size={16} color={theme.colors.text.secondary} /> {formattedDate}
              </Text>
              <Text style={styles.title}>{t('home.financialTimeline')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotificationPress}
            >
              <Bell size={24} color={theme.colors.text.primary} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <SummaryCard />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.yourFinancialJourney')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <Timeline goals={goals} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.tipsAndRecommendations')}</Text>
          </View>

          <TouchableOpacity style={styles.tipCard}>
            <LinearGradient
              colors={[theme.colors.primary, '#003F7D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipCardGradient}
            >
              <View style={styles.tipIconContainer}>
                <Sparkles size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.tipTitle}>{t('home.optimizeSavings')}</Text>
              <Text style={styles.tipDescription}>
                {t('home.savingsTip')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.ScrollView>
      </SafeAreaView>

      <NotificationsModal 
        visible={isNotificationsModalVisible}
        onClose={() => setIsNotificationsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBackground: {
    backgroundColor: theme.colors.background,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  notificationBadgeText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  seeAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  tipCard: {
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  tipCardGradient: {
    padding: theme.spacing.lg,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  tipTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  tipDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
});