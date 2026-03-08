import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Colors } from '@/constants/Colors';
import { useBudget } from '@/contexts/budget-context';
import { useShoppingList } from '@/contexts/shopping-list-context';

export default function BudgetScreen() {
  const { budget, setBudget } = useBudget();
  const { items, expensesTotal } = useShoppingList();
  const budgetInputRef = React.useRef<TextInput>(null);
  const [budgetInputValue, setBudgetInputValue] = React.useState(String(budget));

  const expenseItems = React.useMemo(
    () => items.filter((i) => i.checked),
    [items]
  );
  const total = expensesTotal;
  const remaining = budget - total;

  React.useEffect(() => {
    setBudgetInputValue(String(budget));
  }, [budget]);

  const handleBudgetChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setBudgetInputValue(digits || '0');
  };

  const handleBudgetBlur = () => {
    const num = parseInt(budgetInputValue, 10);
    if (!isNaN(num)) {
      setBudget(num);
      setBudgetInputValue(String(num));
    } else {
      setBudgetInputValue(String(budget));
    }
  };

  const handlePencilPress = () => {
    budgetInputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <AppHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>March Expenses</Text>

        <View style={styles.expenseList}>
          {expenseItems.length === 0 ? (
            <Text style={styles.emptyText}>No expenses yet. Check off items on the Shopping List to add them here.</Text>
          ) : (
            expenseItems.map((item) => (
              <View key={item.id} style={styles.expenseRow}>
                <Text style={styles.expenseName}>{item.name}</Text>
                <Text style={styles.expensePrice}>{item.price.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
        </View>

        <View style={styles.budgetBox}>
          <View style={styles.budgetTitleRow}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetColon}>:</Text>
          </View>
          <View style={styles.budgetValueRow}>
            <Text style={styles.dollarPrefix}>$</Text>
            <TextInput
              ref={budgetInputRef}
              style={styles.budgetInput}
              value={budgetInputValue}
              onChangeText={handleBudgetChange}
              onBlur={handleBudgetBlur}
              keyboardType="number-pad"
              maxLength={8}
            />
          </View>
          <View style={styles.remainingRow}>
            <Text style={styles.remainingLabel}>Balance:</Text>
            <Text style={styles.remainingValue}>${remaining.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.pencilButton} onPress={handlePencilPress} hitSlop={12}>
            <MaterialIcons name="edit" size={22} color={Colors.darkGreen} />
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
    marginBottom: 20,
  },
  expenseList: {
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.darkGreen,
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  expenseName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  expensePrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 16,
  },
  divider: {
    height: 5,
    backgroundColor: Colors.darkGreen,
    marginVertical: 8,
    borderRadius: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  budgetBox: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 26,
    padding: 24,
    paddingRight: 48,
    minHeight: 105,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
  },
  budgetColon: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '800',
    color: Colors.darkGreen,
  },
  budgetValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dollarPrefix: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
    marginRight: 2,
  },
  budgetInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
    padding: 0,
    minWidth: 80,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  remainingLabel: {
    fontFamily: 'Inter-Italic',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.darkGreen,
  },
  remainingValue: {
    fontFamily: 'Inter-Italic',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.darkGreen,
  },
  pencilButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 24,
  },
});
