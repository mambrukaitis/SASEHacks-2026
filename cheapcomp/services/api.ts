/**
 * API layer for Flask backend (app.py). Base URL should match test.js.
 * When calls fail, returns null/empty — app falls back to local data.
 */
const API_BASE = 'http://10.136.194.45:5001';
const FETCH_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return res;
  } catch {
    clearTimeout(id);
    throw new Error('Network timeout');
  }
}

export async function getBudget(): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/budget`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.budget ?? null;
  } catch {
    return null;
  }
}

export async function getShoppingList(): Promise<BackendShoppingList | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/shopping_list`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchItem(name: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/search_item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export async function addItem(name: string): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/add_item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function addRecipeIngredientsToShopping(ingredients: string[]): Promise<void> {
  if (!ingredients || ingredients.length === 0) return;
  for (const ingredient of ingredients) {
    const name = (ingredient ?? '').trim();
    if (!name) continue;
    try {
      await searchItem(name);
      await addItem(name);
    } catch {
      // ignore individual ingredient errors so others can still be added
    }
  }
}

export async function selectItem(name: string): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/select_item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function deselectItem(name: string): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/deselect_item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function removeItem(name: string, store?: string): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/remove_item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, store: store ?? '' }),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function getRecipes(): Promise<BackendRecipe[] | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/recipes`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function addRecipe(data: { name: string; ingredients: string[] }): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/add_recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function editRecipe(data: { old_name: string; name: string; ingredients: string[] }): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/edit_recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteRecipe(data: { name: string }): Promise<unknown> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/delete_recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return null;
  }
}

export async function addRecipeToShopping(name: string): Promise<BackendShoppingList | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/add_recipe_to_shopping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function clearShoppingList(): Promise<BackendShoppingList | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/clear_shopping_list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Matches app.py / recipeCards.py exportData() */
export interface BackendShoppingList {
  publix?: BackendItem[];
  aldi?: BackendItem[];
  trader_joes?: BackendItem[];
  categories?: string[];
  budget?: number;
  remainingBudget?: number;
  projectedRemaining?: number;
}

export interface BackendItem {
  name?: string;
  price?: number;
  store?: string;
  brand?: string;
  category?: string;
  selected?: boolean;
}

export interface BackendRecipe {
  name: string;
  ingredients: string[];
}
