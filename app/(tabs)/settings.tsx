import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { User, Bell, Shield, CircleHelp as HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';
import { useTranslation } from '@/localization/i18n';
import LanguageSelector from '@/components/settings/LanguageSelector';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  const sections = [
    {
      title: t('settings.account'),
      items: [
        {
          icon: <User size={20} color={theme.colors.primary} />,
          label: t('settings.profile'),
          action: 'navigate',
        }
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: <Bell size={20} color={theme.colors.primary} />,
          label: t('settings.notifications'),
          action: 'toggle',
          value: notifications,
          onToggle: () => setNotifications(!notifications),
        },
        {
          icon: <Shield size={20} color={theme.colors.primary} />,
          label: t('settings.privacy'),
          action: 'navigate',
        }
      ]
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: <HelpCircle size={20} color={theme.colors.primary} />,
          label: t('settings.helpCenter'),
          action: 'navigate',
        },
        {
          icon: <Info size={20} color={theme.colors.primary} />,
          label: t('settings.about'),
          action: 'navigate',
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t('settings.edit')}</Text>
          </TouchableOpacity>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={styles.settingItem}
                  onPress={() => item.action === 'navigate' && console.log(`Navigate to: ${item.label}`)}
                >
                  <View style={styles.settingIconContainer}>
                    {item.icon}
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  
                  {item.action === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#e5e5e5', true: '#bcdaff' }}
                      thumbColor={item.value ? theme.colors.primary : '#f4f3f4'}
                    />
                  ) : (
                    <ChevronRight size={20} color={theme.colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {/* Language Selector */}
        <View style={styles.section}>
          <LanguageSelector />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>{t('settings.version')} 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.medium,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  profileEmail: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderRadius: theme.borderRadius.medium,
  },
  editButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.small,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});