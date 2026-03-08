const API_BASE = "http://10.136.194.45:5001";


export async function getShoppingList() {
  const res = await fetch(`${API_BASE}/shopping_list`);
  return await res.json();
}

export async function getBudget() {
  try {
    const response = await fetch("http://10.136.194.45:5001/budget");

    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }

    const data = await response.json();

    return data.budget; // returns the number
  } catch (error) {
    console.error("Error getting budget:", error);
    return null;
  }
}

// export async function searchItem(name) {
//   const res = await fetch(`${API_BASE}/search_item`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       name: name
//     })
//   });

//   return await res.json();
// }


// export async function addItem(name) {
//   const res = await fetch(`${API_BASE}/add_item`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       name: name
//     })
//   });

//   return await res.json();
// }


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
