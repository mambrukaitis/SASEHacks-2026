const fetch = require("node-fetch"); // or just `fetch` in browser

async function callFlask() {
    try {
        const response = await fetch("http://10.136.151.191:5000/shopping_list");
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error("Error:", err);
    }
}

callFlask();