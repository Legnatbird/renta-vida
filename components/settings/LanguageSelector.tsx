import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/localization/i18n';
import { Globe } from 'lucide-react-native';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Globe size={20} color={theme.colors.primary} />
        <Text style={styles.title}>{t('settings.language')}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, language === 'en' && styles.selectedOption]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[
            styles.optionText,
            language === 'en' && styles.selectedOptionText
          ]}>
            {t('settings.english')}
          </Text>
          {language === 'en' && (
            <View style={styles.selectedDot} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.option, language === 'es' && styles.selectedOption]}
          onPress={() => setLanguage('es')}
        >
          <Text style={[
            styles.optionText,
            language === 'es' && styles.selectedOptionText
          ]}>
            {t('settings.spanish')}
          </Text>
          {language === 'es' && (
            <View style={styles.selectedDot} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  optionsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 102, 204, 0.05)',
  },
  optionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  selectedOptionText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
});
