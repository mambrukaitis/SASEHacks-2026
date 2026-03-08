import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import type { ShoppingListItem } from '@/contexts/shopping-list-context';
import { searchItem, addItem } from '@/services/api';

interface ListItemModalProps {
  visible: boolean;
  item: ShoppingListItem | null;
  isNewItem?: boolean;
  onClose: () => void;
  onDone: (id: string, name: string, price: number) => void;
  onDelete: (id: string) => void;
  onAddFromSearch?: (name: string, price: number) => Promise<void>;
}

export function ListItemModal({
  visible,
  item,
  isNewItem = false,
  onClose,
  onDone,
  onDelete,
  onAddFromSearch,
}: ListItemModalProps) {
  const [name, setName] = React.useState('');
  const [priceStr, setPriceStr] = React.useState('');
  const [searching, setSearching] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setPriceStr(item.price.toFixed(2));
    } else if (isNewItem) {
      setName('');
      setPriceStr('');
    }
  }, [item, isNewItem]);

  const handleSearch = async () => {
    const term = name.trim();
    if (!term) return;
    setSearching(true);
    try {
      const result = await searchItem(term);
      if (result && typeof result === 'object' && 'name' in result) {
        const r = result as { name?: string; price?: number | string };
        setName(r.name ?? term);
        const p = r.price;
        if (typeof p === 'number') setPriceStr(p.toFixed(2));
        else if (typeof p === 'string') setPriceStr(p.replace(/[^0-9.]/g, '') || '0');
        else setPriceStr('0');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleDone = async () => {
    if (isNewItem) {
      const displayName = name.trim();
      if (!displayName) {
        onClose();
        return;
      }
      const price = parseFloat(priceStr) || 0;
      const apiResult = await addItem(displayName);
      await onAddFromSearch?.(displayName, price);
      onClose();
      return;
    }
    if (item) {
      const price = parseFloat(priceStr) || 0;
      onDone(item.id, name.trim() || item.name, price);
    }
    onClose();
  };

  const handleDelete = () => {
    if (item) {
      onDelete(item.id);
    }
    onClose();
  };

  if (!item && !isNewItem) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={isNewItem ? 'Enter ingredient...' : 'Search...'}
              placeholderTextColor={Colors.grey}
              value={name}
              onChangeText={setName}
              onSubmitEditing={isNewItem ? handleSearch : undefined}
              returnKeyType={isNewItem ? 'search' : 'done'}
              editable={!searching}
            />
            {searching && (
              <ActivityIndicator size="small" color={Colors.darkGreen} style={styles.searchSpinner} />
            )}
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price:</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.pricePrefix}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                placeholderTextColor="rgba(249,243,240,0.7)"
                value={priceStr}
                onChangeText={(t) => setPriceStr(t.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                editable={true}
              />
            </View>
          </View>
          <View style={styles.buttons}>
            <Pressable style={styles.doneButton} onPress={handleDone} disabled={searching}>
              <MaterialIcons name="check" size={24} color={Colors.background} />
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
            {!isNewItem && (
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <MaterialIcons name="delete" size={24} color={Colors.background} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.lightPurple,
    borderRadius: 35,
    padding: 20,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10.2,
    elevation: 8,
  },
  searchRow: {
    marginBottom: 16,
    position: 'relative',
  },
  searchSpinner: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 29,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.darkGreen,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontFamily: 'Inter-Italic',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.background,
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricePrefix: {
    fontFamily: 'Inter-Italic',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.background,
    marginRight: 2,
  },
  priceInput: {
    minWidth: 80,
    fontFamily: 'Inter-Italic',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 31,
  },
  doneButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.delete,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 31,
  },
  deleteButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});
