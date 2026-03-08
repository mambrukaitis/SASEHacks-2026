import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import type { ShoppingListItem } from '@/contexts/shopping-list-context';
import { searchItem, addItem, searchList, type BackendItem } from '@/services/api';

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
  const [results, setResults] = React.useState<BackendItem[]>([]);

  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setPriceStr(item.price.toFixed(2));
    } else if (isNewItem) {
      setName('');
      setPriceStr('');
    }
    setResults([]);
  }, [item, isNewItem]);

  const performSearch = React.useCallback(
    async (termRaw: string) => {
      const term = termRaw.trim();
      if (!term) {
        setResults([]);
        return;
      }
      setSearching(true);
      try {
        const listResults = await searchList(term);
        setResults(listResults);
      } finally {
        setSearching(false);
      }
    },
    []
  );

  const handleSelectResult = React.useCallback(async (result: BackendItem) => {
    const selectedName = (result.name ?? '').trim();
    if (!selectedName) return;
    const price =
      typeof result.price === 'number'
        ? result.price
        : typeof result.price === 'string'
        ? parseFloat(result.price.replace(/[^0-9.]/g, '')) || 0
        : 0;

    setName(selectedName);
    setPriceStr(price.toFixed(2));
    setResults([]);

    // Ensure backend temp item is aligned for add flow
    try {
      await searchItem(selectedName);
    } catch {
      // ignore network errors here; fallback will still work
    }
  }, []);

  const handleNameChange = (text: string) => {
    setName(text);
    // clear previous results; user must press enter to search again
    setResults([]);
  };

  const handleSubmitSearch = () => {
    const term = name.trim();
    if (term.length >= 2) {
      void performSearch(term);
    } else {
      setResults([]);
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
      try {
        await searchItem(displayName);
      } catch {
        // ignore, backend will simply reuse last temp item if available
      }
      await addItem(displayName);
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
              onChangeText={handleNameChange}
              onSubmitEditing={handleSubmitSearch}
              returnKeyType="search"
              editable={!searching}
            />
            {searching && (
              <ActivityIndicator size="small" color={Colors.darkGreen} style={styles.searchSpinner} />
            )}
          </View>
          {results.length > 0 && (
            <View style={styles.resultsContainer}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {results.map((r, index) => {
                  const resultName = r.name ?? '';
                  const rawPrice = r.price;
                  let parsedPrice = 0;
                  if (typeof rawPrice === 'number') parsedPrice = rawPrice;
                  else if (typeof rawPrice === 'string') {
                    const n = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
                    parsedPrice = isNaN(n) ? 0 : n;
                  }
                  return (
                    <Pressable
                      key={`${resultName}-${index}`}
                      style={styles.resultRow}
                      onPress={() => void handleSelectResult(r)}>
                      <Text style={styles.resultName} numberOfLines={2}>
                        {resultName}
                      </Text>
                      {parsedPrice > 0 && (
                        <Text style={styles.resultPrice}>${parsedPrice.toFixed(2)}</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
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
  resultsContainer: {
    maxHeight: 200,
    marginBottom: 12,
    marginTop: -4,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  resultName: {
    flex: 1,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  resultPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '600',
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
