
import json
import product_to_data

class Recipes:
    def __init__(self):
        self.recipeCards = []    # a list of recipe cards
        self.ingre
    
    def addCard(self, i: list, nm: str):
        self.recipeCards.append(RecipeCard(i, nm))
    
class RecipeCard:
    def __init__(self, i: list):
        self.selec = []
        self.notselec = []

    def addIng(self, i: str):
        self.card.append(i)

class Item:
    def __init__(self, name, price, store = "", brand = "", category = ""):
        self.name = name
        self.price = price
        self.store = store
        self.brand = brand
        self.category = category
        self.selected = True

    def to_dict(self):
        return {
            "name": self.name,
            "price": self.price,
            "store": self.store,
            "brand": self.brand,
            "category": self.category,
            "selected": self.selected
        }
class ShoppingList:
    def __init__(self):
        self.aldis = []
        self.tjs = []
        self.publix = [] # store is a list of Item objects
    def addItem(self, item):
        publix_results =product_to_data.publix_search_limited(item)
        aldi_results = product_to_data.aldi()
        tj_results = product_to_data.tjs()
        if publix_results[0] < tj_results[0] and publix_results[0] < aldi_results[0]:
            self.publix.append(Item(item.name, item.price, "Publix", item.brand))
        elif tj_results[0] < publix_results[0] and tj_results[0] < aldi_results[0]:
            self.tjs.append(Item(item.name, item.price, "TJ's", item.brand))
        else:
            self.aldis.append(Item(item.name, item.price, "Aldi", item.brand))

# i is a string, store is a string
    def removeItem(self, i, store):
        if store == "aldis":
            for item in self.aldis:
                if item.name == i:
                    self.aldis.remove(item)
        elif store == "tjs":
            for item in self.tjs:
                if item.name == i:
                    self.tjs.remove(item)
        elif store == "publix":
            for item in self.publix:
                if item.name == i:
                    self.publix.remove(item)

    def deselectItem(self, i):
        for item in self.aldis:
            if item.name == i:
                item.selected = False
        for item in self.tjs:
            if item.name == i:
                item.selected = False
        for item in self.publix:
            if item.name == i:
                item.selected = False
        

    def selectItem(self, i):
        for item in self.aldis:
            if item.name == i:
                item.selected = True
        for item in self.tjs:
            if item.name == i:
                item.selected = True
        for item in self.publix:
            if item.name == i:
                item.selected = True


    def exportData(self, i):
        data = {
            "aldis": [item.to_dict() for item in self.aldis],
            "tjs": [item.to_dict() for item in self.tjs],
            "publix": [item.to_dict() for item in self.publix]
        }
        # Serialize to JSON
        json_data = json.dumps(data)
        return json_data
