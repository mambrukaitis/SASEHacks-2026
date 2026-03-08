import * as React from 'react';

import type { BackendShoppingList } from '@/services/api';
import { getShoppingList, selectItem as apiSelectItem, deselectItem as apiDeselectItem } from '@/services/api';

export type StoreName = 'Publix' | 'Aldis' | 'Trader Joes';

export interface ShoppingListItem {
  id: string;
  name: string;
  price: number;
  store: StoreName;
  checked: boolean;
}

interface ShoppingListContextValue {
  items: ShoppingListItem[];
  toggleItem: (id: string) => void;
  updateItem: (id: string, updates: { name?: string; price?: number }) => void;
  removeItem: (id: string) => void;
  addItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  totalCost: number;
  expensesTotal: number;
  /** Refetch from backend. Returns true if data was fetched, false if API failed. */
  refreshFromBackend: () => Promise<boolean>;
}

const defaultItems: ShoppingListItem[] = [
  { id: '1', name: 'Tomatoes /lbs', price: 0.92, store: 'Publix', checked: false },
  {
    id: '2',
    name: 'Maruchan Ramen Noodle Soup, Beef Flavor Instant Noodles, 3 oz, Pack of 12',
    price: 3.97,
    store: 'Publix',
    checked: false,
  },
  {
    id: '3',
    name: 'Kraft Mac and Cheese, 5 Boxes 7.25 oz',
    price: 3.98,
    store: 'Aldis',
    checked: true,
  },
];

const ShoppingListContext = React.createContext<ShoppingListContextValue | null>(null);

let nextId = 4;

function mapBackendToItems(data: BackendShoppingList | null): ShoppingListItem[] {
  if (!data) return defaultItems;
  const items: ShoppingListItem[] = [];
  const stores: { key: keyof BackendShoppingList; store: StoreName }[] = [
    { key: 'publix', store: 'Publix' },
    { key: 'aldi', store: 'Aldis' },
    { key: 'trader_joes', store: 'Trader Joes' },
  ];
  const parsePrice = (v: unknown): number => {
    if (typeof v === 'number' && !isNaN(v)) return v;
    if (typeof v === 'string') {
      const n = parseFloat(v.replace(/[^0-9.]/g, ''));
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  for (const { key, store } of stores) {
    const arr = data[key];
    if (!Array.isArray(arr)) continue;
    arr.forEach((row: { name?: string; price?: unknown; selected?: boolean }, i: number) => {
      items.push({
        id: `${store}-${i}-${row.name ?? ''}`,
        name: row.name ?? '',
        price: parsePrice(row.price),
        store,
        checked: !!row.selected,
      });
    });
  }
  return items.length ? items : defaultItems;
}

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ShoppingListItem[]>(defaultItems);

  React.useEffect(() => {
    getShoppingList().then((data) => {
      const mapped = mapBackendToItems(data);
      setItems(mapped);
    });
  }, []);

  const totalCost = React.useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const expensesTotal = React.useMemo(
    () => items.filter((i) => i.checked).reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const toggleItem = React.useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
      const item = prev.find((i) => i.id === id);
      if (item) {
        const nowChecked = !item.checked;
        if (nowChecked) apiSelectItem(item.name).catch(() => {});
        else apiDeselectItem(item.name).catch(() => {});
      }
      return next;
    });
  }, []);

  const updateItem = React.useCallback((id: string, updates: { name?: string; price?: number }) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const addItem = React.useCallback((item: Omit<ShoppingListItem, 'id'>) => {
    setItems((prev) => [...prev, { ...item, id: String(nextId++) }]);
  }, []);

  const refreshFromBackend = React.useCallback(async () => {
    const data = await getShoppingList();
    if (data) {
      const mapped = mapBackendToItems(data);
      if (mapped.length > 0) {
        setItems(mapped);
        return true;
      }
    }
    return false;
  }, []);

  const value = React.useMemo(
    () => ({ items, toggleItem, updateItem, removeItem, addItem, totalCost, expensesTotal, refreshFromBackend }),
    [items, toggleItem, updateItem, removeItem, addItem, totalCost, expensesTotal, refreshFromBackend]
  );

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = React.useContext(ShoppingListContext);
  if (!ctx) {
    return {
      items: defaultItems,
      toggleItem: () => {},
      updateItem: () => {},
      removeItem: () => {},
      addItem: () => {},
      totalCost: 0,
      expensesTotal: 0,
      refreshFromBackend: async () => false,
    };
  }
  return ctx;
}
