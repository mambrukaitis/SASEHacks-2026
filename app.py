from flask import Flask, jsonify, request
from recipeCards import ShoppingList, Expenses, Recipes, Item

app = Flask(__name__)

# ---------------------------------------------------
# GLOBAL OBJECTS
# ---------------------------------------------------

expenses = Expenses(100)
shopping_list = ShoppingList(100, expenses)
recipes = Recipes()
tempItem = Item()



# ---------------------------------------------------
# SHOPPING LIST ROUTES
# ---------------------------------------------------

@app.route("/shopping_list", methods=["GET"])
def get_shopping_list():

    data = shopping_list.exportData()

    data["budget"] = expenses.budget
    data["remainingBudget"] = expenses.remainingBudget

    return jsonify(data)


# --- Add item ---
@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.json

    shopping_list.addItemItem(tempItem)

    return get_shopping_list()

# --- Search item ---
@app.route("/search_item", methods=["POST"])
def search_item():
    data = request.json
    #data is string in text box
    global tempItem
    tempItem = shopping_list.searchItem(data["name"])

    return jsonify(tempItem.to_dict())



@app.route("/remove_item", methods=["POST"])
def remove_item():

    data = request.json
    shopping_list.removeItemClass(data["name"])

    return get_shopping_list()


@app.route("/select_item", methods=["POST"])
def select_item():

    data = request.json
    shopping_list.selectItem(data["name"], expenses)

    return get_shopping_list()


@app.route("/deselect_item", methods=["POST"])
def deselect_item():

    data = request.json
    shopping_list.deselectItem(data["name"], expenses)

    return get_shopping_list()


@app.route("/change_budget", methods=["POST"])
def change_budget():

    data = request.json

    new_budget = float(data["budget"])

    expenses.changeBudget(new_budget)
    shopping_list.changeBudget(new_budget)

    return get_shopping_list()


@app.route("/budget", methods=["GET"])
def get_budget():

    return jsonify({
        "budget": expenses.budget,
        "remainingBudget": expenses.remainingBudget
    })


# ---------------------------------------------------
# RECIPE ROUTES
# ---------------------------------------------------

@app.route("/recipes", methods=["GET"])
def get_recipes():

    return jsonify(recipes.exportData())


@app.route("/add_recipe", methods=["POST"])
def add_recipe():

    data = request.json

    recipes.addCard(
        data["ingredients"],
        data["name"]
    )

    return jsonify(recipes.exportData())


@app.route("/delete_recipe", methods=["POST"])
def delete_recipe():

    data = request.json

    for card in recipes.recipeCards:
        if card.name == data["name"]:
            recipes.deleteCard(card)
            break

    return jsonify(recipes.exportData())


@app.route("/edit_recipe", methods=["POST"])
def edit_recipe():

    data = request.json

    for card in recipes.recipeCards:
        if card.name == data["old_name"]:

            card.name = data["name"]
            card.ingredients = data["ingredients"]

            break

    return jsonify(recipes.exportData())


@app.route("/add_recipe_to_shopping", methods=["POST"])
def add_recipe_to_shopping():

    data = request.json

    for card in recipes.recipeCards:
        if card.name == data["name"]:

            card.addToShopping(shopping_list)

            break

    return get_shopping_list()


# ---------------------------------------------------
# RUN SERVER
# ---------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)