import * as React from 'react';

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

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ShoppingListItem[]>(defaultItems);

  const totalCost = React.useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const toggleItem = React.useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
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

  const value = React.useMemo(
    () => ({ items, toggleItem, updateItem, removeItem, addItem, totalCost }),
    [items, toggleItem, updateItem, removeItem, addItem, totalCost]
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
    };
  }
  return ctx;
}
