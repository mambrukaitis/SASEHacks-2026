from flask import Flask, jsonify, request
from recipeCards import ShoppingList, Item   # change to your actual filename

app = Flask(__name__)

shopping_list = ShoppingList()
tempItem = {}


# --- Get shopping list data ---
@app.route("/shopping_list", methods=["GET"])
def get_shopping_list():
    data = shopping_list.exportData(None)
    return data


# --- Add item ---
@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.json

    shopping_list.addItem(temp["name"])

    return get_shopping_list()

# --- Search item ---
@app.route("/search_item", methods=["POST"])
def search_item():
    data = request.json
    #data is string in text box
    tempItem = shopping_list.searchItem(data)

    return get_shopping_list()


# --- Remove all items ---
@app.route("/remove_item", methods=["POST"])
def remove_item():
    data = request.json

    shopping_list.removeItem(
        data["name"]
    )

    return get_shopping_list()


# --- Select item ---
@app.route("/select_item", methods=["POST"])
def select_item():
    data = request.json

    shopping_list.selectItem(data["name"])

    return get_shopping_list()


# --- Run server ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

shopping_list = ShoppingList()


# --- Get shopping list data ---
@app.route("/shopping_list", methods=["GET"])
def get_shopping_list():
    data = shopping_list.exportData()
    return data


# --- Add item ---
@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.json

    shopping_list.addItem(data)

    return get_shopping_list()


# --- Remove item ---
@app.route("/remove_item", methods=["POST"])
def remove_item():
    data = request.json

    shopping_list.removeItem(
        data["name"],
        data["store"]
    )

    return jsonify({"message": "item removed"})


# --- Select item ---
@app.route("/select_item", methods=["POST"])
def select_item():
    data = request.json

    shopping_list.selectItem(data["name"])

    return get_shopping_list()

@app.route("/budget", methods=["GET"])
def get_budget():
    total = shopping_list.remainingBudget
    return jsonify({
        "budget": total
    })

# --- Deselect item ---
@app.route("/deselect_item", methods=["POST"])
def deselect_item():
    data = request.json

    shopping_list.deselectItem(data["name"])

    return get_shopping_list()


# --- Run server ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
