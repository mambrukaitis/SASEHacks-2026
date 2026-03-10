// test2.js
const fetch = require('node-fetch');

const API_BASE = "http://10.136.232.27:5001"; // your Flask LAN IP

async function test() {
  try {
    const response = await fetch(`${API_BASE}/shopping_list`);
    const data = await response.json();
    console.log("API response:", data);
  } catch (err) {
    console.error("Error fetching API:", err);
  }
}

test();