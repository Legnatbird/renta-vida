import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { ChevronLeft, Mail, Trash2, Shield, Lock, Eye } from 'lucide-react-native';
import { useTranslation } from '@/localization/i18n';
import { useRouter } from 'expo-router';
import { useEmailStore } from '@/store/emailStore';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { linkedEmails, removeEmail } = useEmailStore();
  
  // Estado para toggle switches
  const [dataSharing, setDataSharing] = React.useState(true);
  const [analyticsCookies, setAnalyticsCookies] = React.useState(true);
  const [locationTracking, setLocationTracking] = React.useState(false);
  
  // Función para desvincular un correo (actualiza el store compartido)
  const handleUnlinkEmail = (emailId: number) => {
    Alert.alert(
      t('privacy.unlinkEmailTitle'),
      t('privacy.unlinkEmailMessage'),
      [
        {
          text: t('privacy.cancel'),
          style: 'cancel',
        },
        {
          text: t('privacy.confirm'),
          onPress: () => {
            // Eliminamos el correo del store compartido
            removeEmail(emailId);
            // Mostrar confirmación
            Alert.alert(t('privacy.emailUnlinked'));
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.privacy')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('privacy.linkedEmails')}</Text>
          </View>
          <Text style={styles.sectionDescription}>
            {t('privacy.linkedEmailsDescription')}
          </Text>
          
          {linkedEmails.length > 0 ? (
            linkedEmails.map((email) => (
              <View key={email.id} style={styles.emailItem}>
                <Text style={styles.emailText}>{email.email}</Text>
                <TouchableOpacity 
                  onPress={() => handleUnlinkEmail(email.id)}
                  style={styles.unlinkButton}
                >
                  <Trash2 size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>{t('privacy.noLinkedEmails')}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('privacy.dataPrivacy')}</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('privacy.dataSharing')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.dataSharingDescription')}</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('privacy.analyticsCookies')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.analyticsCookiesDescription')}</Text>
            </View>
            <Switch
              value={analyticsCookies}
              onValueChange={setAnalyticsCookies}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('privacy.locationTracking')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.locationTrackingDescription')}</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton}>
            <Lock size={20} color={theme.colors.text.primary} />
            <Text style={styles.actionButtonText}>{t('privacy.changePassword')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Eye size={20} color={theme.colors.text.primary} />
            <Text style={styles.actionButtonText}>{t('privacy.privacyPolicy')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
            <Text style={styles.dangerButtonText}>{t('privacy.deleteAccount')}</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  sectionDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  emailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  emailText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  unlinkButton: {
    padding: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  settingLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  dangerButton: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.md,
  },
  dangerButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
  },
});
