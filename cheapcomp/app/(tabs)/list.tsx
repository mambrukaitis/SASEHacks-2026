import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { ListItemModal } from '@/components/list-item-modal';
import { Colors } from '@/constants/Colors';
import {
  useShoppingList,
  type ShoppingListItem,
  type StoreName,
} from '@/contexts/shopping-list-context';

const FILTERS = ['Overall', 'Publix', 'Aldis', 'Trader Joes'] as const;
type FilterType = (typeof FILTERS)[number];

function storeFromFilter(f: FilterType): StoreName | 'all' {
  if (f === 'Overall') return 'all';
  return f as StoreName;
}

export default function ListScreen() {
  const { items, toggleItem, updateItem, removeItem } = useShoppingList();
  const [selectedFilter, setSelectedFilter] = React.useState<FilterType>('Overall');
  const [modalItem, setModalItem] = React.useState<ShoppingListItem | null>(null);
  const insets = useSafeAreaInsets();

  const storeFilter = storeFromFilter(selectedFilter);

  const grouped = React.useMemo(() => {
    const filtered =
      storeFilter === 'all'
        ? items
        : items.filter((i) => i.store === storeFilter);
    const groups: Record<StoreName, ShoppingListItem[]> = {
      Publix: [],
      Aldis: [],
      Trader Joes: [],
    };
    filtered.forEach((item) => {
      if (groups[item.store]) groups[item.store].push(item);
    });
    return groups;
  }, [items, storeFilter]);

  const handleItemPress = (item: ShoppingListItem) => {
    setModalItem(item);
  };

  const handleToggle = (e: any, item: ShoppingListItem) => {
    e?.stopPropagation?.();
    toggleItem(item.id);
  };

  const handleDone = (id: string, name: string, price: number) => {
    updateItem(id, { name, price });
    setModalItem(null);
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    setModalItem(null);
  };

  const storeOrder: StoreName[] = ['Publix', 'Aldis', 'Trader Joes'];

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Shopping List</Text>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter ? styles.filterButtonActive : styles.filterButtonInactive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {storeOrder.map((store) => {
          const list = grouped[store];
          if (list.length === 0) return null;
          return (
            <View key={store} style={styles.storeSection}>
              <View style={styles.storeHeader}>
                <View style={styles.storeBullet} />
                <Text style={styles.storeName}>{store}</Text>
              </View>
              {list.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItem}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}>
                  <View style={styles.itemLeft}>
                    <TouchableOpacity
                      style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                      onPress={(e) => handleToggle(e, item)}
                      hitSlop={8}>
                      {item.checked && <View style={styles.checkmark} />}
                    </TouchableOpacity>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleItemPress(item)}
                    hitSlop={8}>
                    <MaterialIcons name="edit" size={18} color={Colors.darkGreen} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <MaterialIcons name="add" size={24} color={Colors.background} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </ScrollView>

      <ListItemModal
        visible={modalItem !== null}
        item={modalItem}
        onClose={() => setModalItem(null)}
        onDone={handleDone}
        onDelete={handleDelete}
      />
    </View>
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
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.darkGreen,
  },
  filterButtonInactive: {
    backgroundColor: Colors.lightLightGreen,
  },
  filterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  storeSection: {
    marginBottom: 24,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  storeBullet: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: Colors.darkGreen,
  },
  storeName: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.darkGreen,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    paddingVertical: 13,
    paddingLeft: 24,
    paddingRight: 36,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10.2,
    elevation: 4,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.background,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.darkGreen,
  },
  itemName: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  itemPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginRight: 16,
  },
  editButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: Colors.darkGreen,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 28,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10.2,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
  },
});
