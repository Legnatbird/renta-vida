import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Plus, Filter } from 'lucide-react-native';
import { useGoalStore } from '@/store/goalStore';
import GoalCard from '@/components/goals/GoalCard';
import AddGoalModal from '@/components/goals/AddGoalModal';
import { useTranslation } from '@/localization/i18n';

type FilterType = 'all' | 'short-term' | 'mid-term' | 'long-term';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const { goals } = useGoalStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check if reduced motion is enabled
    AccessibilityInfo.isReduceMotionEnabled().then(reducedMotion => {
      setIsReducedMotion(reducedMotion);
    });

    // Listen for changes in the reduced motion setting
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reducedMotion => {
        setIsReducedMotion(reducedMotion);
      }
    );

    return () => {
      // Clean up listener on component unmount
      listener.remove();
    };
  }, []);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('goals.allGoals') },
    { key: 'short-term', label: t('goals.shortTerm') },
    { key: 'mid-term', label: t('goals.midTerm') },
    { key: 'long-term', label: t('goals.longTerm') },
  ];

  const filteredGoals = goals.filter((goal) => {
    if (activeFilter === 'all') return true;
    
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    const diffYears = targetDate.getFullYear() - currentDate.getFullYear();
    
    if (activeFilter === 'short-term' && diffYears <= 1) return true;
    if (activeFilter === 'mid-term' && diffYears > 1 && diffYears <= 5) return true;
    if (activeFilter === 'long-term' && diffYears > 5) return true;
    
    return false;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('goals.financialGoals')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        scrollEventThrottle={16}
        overScrollMode="never"
        scrollEnabled={!isReducedMotion || filters.length > 3}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.activeFilterChip,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.key && styles.activeFilterChipText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        maintainVisibleContentPosition={isReducedMotion ? { minIndexForVisible: 0 } : undefined}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('goals.emptyGoals')}</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <AddGoalModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.sm,
    minWidth: 80, // Add fixed minimum width to prevent expansion
    height: 36, // Fixed height for consistency
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    ...theme.shadows.small,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center', // Ensure text is centered
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Extra padding for FAB
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.large,
  },
});