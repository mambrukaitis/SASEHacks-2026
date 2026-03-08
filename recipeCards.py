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
    def __init__(self, itemDict: dict | None = None, i: str = ""):
        if itemDict is None:
            itemDict = {}

        self.name = itemDict.get("name")
        self.price = itemDict.get("price")
        self.store = itemDict.get("store")
        self.brand = itemDict.get("brand")
        self.category = i
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
    def __init__(self, budget: float = 0):
        self.aldis = []
        self.tjs = []
        self.publix = [] # store is a list of Item objects
        self.budget = budget
        self.remaingingBudget = budget

    def addItem(self, item: str):
        publix_results = product_to_data.publix_search_limited(item)
        aldi_results = product_to_data.aldi(item)
        tj_results = product_to_data.tjs(item)

        if not publix_results or not aldi_results or not tj_results:
            return

        p = publix_results[0]
        a = aldi_results[0]
        t = tj_results[0]

        if p["price"] <= t["price"] and p["price"] <= a["price"]:
            self.publix.append(Item(p, item))
            self.remaingingBudget -= p["price"]
        elif t["price"] <= p["price"] and t["price"] <= a["price"]:
            self.tjs.append(Item(t, item))
            self.remaingingBudget -= t["price"]
        else:
            self.aldis.append(Item(a, item))
            self.remaingingBudget -= a["price"]


    def removeItem(self, i: Item):
        if i.store.lower() == "aldi":
            self.aldis.remove(i)
        elif i.store.lower() == "trader joe's" or i.store.lower() == "trader joes":
            self.tjs.remove(i)
        elif i.store == "publix":
            self.publix.remove(i)

        self.remaingingBudget += i.price

    def deselectItem(self, i: Item):
        i.selected = False
        self.removeItem(i)
        
    def selectItem(self, i: Item):
        i.selected = True
        self.addItem(i.category)

    def changeBudget(self, newBudget: float):
        diff = self.budget - self.remaingingBudget
        self.budget = newBudget
        self.remaingingBudget  = self.budget - diff

    def exportData(self):
        return {
            "publix": [i.to_dict() for i in self.publix],
            "aldi": [i.to_dict() for i in self.aldis],
            "trader_joes": [i.to_dict() for i in self.tjs],
            "remainingBudget": self.remaingingBudget,
            "budget" : self.budget
        }