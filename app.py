from flask import Flask, jsonify, request
from recipeCards import ShoppingList

app = Flask(__name__)
shopping_list = ShoppingList()


@app.route("/shopping_list", methods=["GET"])
def get_shopping_list():
    data = shopping_list.exportData()
    return jsonify(data)


@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.json or {}
    name = data.get("name") or data.get("category")
    if name:
        shopping_list.addItem(name)
    return jsonify(shopping_list.exportData())


@app.route("/remove_item", methods=["POST"])
def remove_item():
    data = request.json or {}
    name = data.get("name")
    if name:
        shopping_list.removeItemClass(name)
    return jsonify(shopping_list.exportData())


@app.route("/select_item", methods=["POST"])
def select_item():
    data = request.json or {}
    name = data.get("name")
    if name:
        shopping_list.selectItem(name, None)
    return jsonify(shopping_list.exportData())


@app.route("/deselect_item", methods=["POST"])
def deselect_item():
    data = request.json or {}
    name = data.get("name")
    if name:
        shopping_list.deselectItem(name, None)
    return jsonify(shopping_list.exportData())


@app.route("/budget", methods=["GET"])
def get_budget():
    return jsonify({"budget": shopping_list.remainingBudget})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
