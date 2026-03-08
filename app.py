from flask import Flask, jsonify, request

app = Flask(__name__)

# --- Shopping List Storage ---
class ShoppingList:
    def __init__(self):
        self.aldis = []
        self.tjs = []
        self.publix = []

    def add_item(self, item):
        """Add an item dict to the specified store list"""
        if store not in ["aldis", "trader joes", "publix"]:
            return False
        getattr(self, store).append(item)
        return True

    def clear_list(self):
        self.aldis.clear()
        self.tjs.clear()
        self.publix.clear()

    def get_data(self):
        return {
            "aldis": self.aldis,
            "tjs": self.tjs,
            "publix": self.publix
        }

    def get_budget(self):
        total = 0.0
        for store_list in [self.aldis, self.tjs, self.publix]:
            for item in store_list:
                price = item.get("price", "$0").replace("$", "")
                try:
                    total += float(price)
                except ValueError:
                    continue
        return total


shopping_list = ShoppingList()

# --- Endpoints ---

# 1. Read shopping list data
@app.route("/shopping_list", methods=["GET"])
def get_shopping_list():
    return jsonify(shopping_list.get_data())

# 2. Add a new item
@app.route("/shopping_list/add", methods=["POST"])
def add_item():
    data = request.json
    store = data.get("store")
    item = data.get("item")
    if not store or not item:
        return jsonify({"error": "store and item required"}), 400
    success = shopping_list.add_item(store, item)
    if not success:
        return jsonify({"error": "invalid store"}), 400
    return jsonify({"message": "item added", "item": item}), 201

# 3. Clear the list
@app.route("/shopping_list/clear", methods=["POST"])
def clear_list():
    shopping_list.clear_list()
    return jsonify({"message": "shopping list cleared"}), 200

# 4. Get budget
@app.route("/shopping_list/budget", methods=["GET"])
def get_budget():
    total = shopping_list.get_budget()
    return jsonify({"budget": total})

# --- Run the app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)