/**
 * API layer for Flask backend (app.py). Base URL should match test.js / your server.
 * Budget, ingredients, and recipe data are updated by calls from here.
 */
const API_BASE = 'http://10.136.151.191:5000';

export async function getBudget(): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/budget`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.budget ?? null;
  } catch (e) {
    console.warn('getBudget failed', e);
    return null;
  }
}

export async function getShoppingList(): Promise<BackendShoppingList | null> {
  try {
    const res = await fetch(`${API_BASE}/shopping_list`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('getShoppingList failed', e);
    return null;
  }
}

export async function selectItem(name: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/select_item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deselectItem(name: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/deselect_item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function addItem(name: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/add_item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function removeItem(name: string, store?: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/remove_item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, store: store ?? '' }),
  });
  return res.json();
}

/** Matches app.py / recipeCards.py exportData() */
export interface BackendShoppingList {
  publix?: BackendItem[];
  aldi?: BackendItem[];
  trader_joes?: BackendItem[];
  categories?: string[];
  budget?: number;
  remainingBudget?: number;
}

export interface BackendItem {
  name?: string;
  price?: number;
  store?: string;
  brand?: string;
  category?: string;
  selected?: boolean;
}
