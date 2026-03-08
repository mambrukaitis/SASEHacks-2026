import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GatorChompsLogo } from '@/components/gatorchomps-logo';
import { Colors } from '@/constants/Colors';
import { useBudget } from '@/contexts/budget-context';
import { useShoppingList } from '@/contexts/shopping-list-context';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, 60);
  const { budget } = useBudget();
  const { expensesTotal } = useShoppingList();
  const remaining = Math.round((budget - expensesTotal) * 100) / 100;
  const displayBudget = remaining.toFixed(2);

  return (
    <View style={[styles.header, { paddingTop: topPadding }]}>
      <View style={styles.headerRow}>
        <View style={styles.logoPill}>
          <GatorChompsLogo color={Colors.darkGreen} />
        </View>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Balance: </Text>
          <Text style={styles.budgetValue}>${displayBudget}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  logoPill: {
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 1,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
  },
  budgetLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  budgetValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
});
