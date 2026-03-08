const API_BASE = "http://10.136.194.45:5001";

export async function getShoppingList() {
  try {
    const res = await fetch(`${API_BASE}/shopping_list`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function addRecipeIngredients(ingredients) {
  if (!ingredients || !ingredients.length) return;

  for (const ingredient of ingredients) {
    try {
      // Call the search endpoint (optional, if you need to check first)
      await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: ingredient }),
      });

      // Call the insert endpoint
      await fetch(`${API_BASE}/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: ingredient }),
      });
    } catch (err) {
      console.error(`Failed to process ingredient "${ingredient}":`, err);
    }
  }
}

export async function getBudget() {
  try {
    const response = await fetch(`${API_BASE}/budget`);
    if (!response.ok) throw new Error("Failed");
    const data = await response.json();
    return data.budget;
  } catch (error) {
    return null;
  }
}

export async function searchItem(name) {
  try {
    const res = await fetch(`${API_BASE}/search_item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function addItem(name) {
  try {
    const res = await fetch(`${API_BASE}/add_item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getRecipes() {
  try {
    const res = await fetch(`${API_BASE}/recipes`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function addRecipe(data) {
  try {
    const res = await fetch(`${API_BASE}/add_recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function editRecipe(data) {
  try {
    const res = await fetch(`${API_BASE}/edit_recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteRecipe(data) {
  try {
    const res = await fetch(`${API_BASE}/delete_recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}


export async function removeItem(name, store) {
  const res = await fetch(`${API_BASE}/remove_item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      store: store
    })
  });

  return await res.json();
}
export async function deleteItem(name) {
  return fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}


export async function selectItem(name) {
  const res = await fetch(`${API_BASE}/select_item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name
    })
  });

  return await res.json();
}


export async function deselectItem(name) {
  const res = await fetch(`${API_BASE}/deselect_item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name
    })
  });

  return await res.json();
}
