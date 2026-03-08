import json
import product_to_data

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
    
class Expenses:
    def __init__(self, budget: float =0, shopList=None):
        self.budget = budget
        self.remainingBudget = budget
        self.items = [] # a list of selected Items

    def addItem(self, item: Item):
        self.items.append(item)
        self.remainingBudget -= item.price

    def removeItem(self, item: Item):
        self.items.remove(item)
        self.remainingBudget += item.price
    
    def changeBudget(self, newBudget: float):
        diff = self.budget - self.remainingBudget
        self.budget = newBudget
        self.remainingBudget  = self.budget - diff
       
        if self.shopping_list:
            self.shopping_list.changeBudget(newBudget)

    def exportData(self):
        return {
            "budget": self.budget,
            "remainingBudget": self.remainingBudget,
            "items": [i.to_dict() for i in self.items]
        }

        
class ShoppingList:
    def __init__(self, budget: float = 0, expenses: Expenses = None):
        self.aldis = []
        self.tjs = []
        self.publix = [] # store is a list of Item objects
        self.items = [] # list of "categories"
        self.expenses = expenses
        self.budget = budget
        self.remainingBudget = budget

    def searchItem(self, item: str):
        publix_results = product_to_data.publix_search_limited(item) or []
        aldi_results = product_to_data.aldi(item) or []
        tj_results = product_to_data.tj(item) or []

        print(len(publix_results))
        print(len(tj_results))
        print(len(aldi_results))
    
        if  len(publix_results) == 0 and len(aldi_results) == 0 and  len(tj_results) == 0:
            return Item({}, "")  # return an empty Item instead of None

        temp = []
        if (len(publix_results) != 0):
            p = publix_results[0]
            temp.append(p)
        if (len(aldi_results) != 0):
            a = aldi_results[0]
            temp.append(a)
        if (len(tj_results) != 0):
            t = tj_results[0]
            temp.append(t)
        temp = sorted(temp, key=lambda x: x["price"])

        return Item(temp[0], item)
    
        
    
        # publix_results = product_to_data.publix_search_limited(item)
        # aldi_results = product_to_data.aldi(item)
        # tj_results = product_to_data.tj(item)
        # p, a, t = None
        # print(item)
        # print(len(publix_results))
        # print(len(tj_results))
        # if not publix_results or not aldi_results or not tj_results:
        #     return Item({}, "")

        # if(not len(publix_results)):
        #     p = publix_results[0]
        # if (not len(aldi_results)):
        #     a = aldi_results[0]
        # if(not len(tj_results)):
        #     t = tj_results[0]

        
        # if p and p["price"] <= t["price"] and p["price"] <= a["price"]:
        #     return Item(p, item)
        # elif t and t["price"] <= p["price"] and t["price"] <= a["price"]:
        #     return Item(t, item)
        # else:
        #     if not a:
        #         return Item(a, item)
        # return Item({}, "")


    def addItemItem(self, item: Item):
        if item is None:
            print("item is none fix now")
        if (item.store == "Publix"):
            print (item.name + "p")
            self.publix.append(item)
        elif (item.store == "Trader Joe's"):
            print (item.name + "a")
            self.tjs.append(item)
        else:
            print(item.name  + "a")
            self.aldis.append(item)
        
        print("additemitem ran")
        
    def addItem(self, item: str):
        publix_results = product_to_data.publix_search_limited(item)
        aldi_results = product_to_data.aldi(item)
        tj_results = product_to_data.tj(item)

        if not publix_results or not aldi_results or not tj_results:
            return

        p = publix_results[0]
        a = aldi_results[0]
        t = tj_results[0]

        if p["price"] <= t["price"] and p["price"] <= a["price"]:
            self.publix.append(Item(p, item))
            self.remainingBudget -= p["price"]
        elif t["price"] <= p["price"] and t["price"] <= a["price"]:
            self.tjs.append(Item(t, item))
            self.remainingBudget -= t["price"]
        else:
            self.aldis.append(Item(a, item))
            self.remainingBudget -= a["price"]

        self.items.append(item)

    def removeItemClass(self, item_name: str):
        # Search each store list for the Item with matching name
        for lst in [self.aldis, self.tjs, self.publix]:
            for item in lst:
                if item.name == item_name:
                    lst.remove(item)
                    self.remainingBudget += item.price
                    if item.category in self.items:
                        self.items.remove(item.category)
                    return

    def deselectItem(self, item_name: str, expenses: Expenses):
        # Look in all store lists
        for lst in [self.aldis, self.tjs, self.publix]:
            for item in lst:
                if item.name == item_name:
                    item.selected = False
                    if self.expenses:
                        self.expenses.removeItem(item)
                    return

        
    def selectItem(self, item_name: str, expenses: Expenses):
        # Look in all store lists
        for lst in [self.aldis, self.tjs, self.publix]:
            for item in lst:
                if item.name == item_name:
                    item.selected = True
                    if self.expenses:
                        self.expenses.addItem(item)
                    return

    def changeBudget(self, newBudget: float):
        diff = self.budget - self.remainingBudget
        self.budget = newBudget
        self.remainingBudget  = self.budget - diff

    def removeAll(self):
        for a in self.aldis: self.aldis.remove(a)
        for p in self.publix: self.publix.remove(p)
        for t in self.tjs: self.tjs.remove(t)
        for i in self.items: self.items.remove(i)

    def exportData(self):
        return {
            "publix": [i.to_dict() for i in self.publix],
            "aldi": [i.to_dict() for i in self.aldis],
            "trader_joes": [i.to_dict() for i in self.tjs],
            "categories": self.items,
            "budget": self.budget,
            "remainingBudget": self.remainingBudget
        }
    
class RecipeCard:
    def __init__(self, i: list | None = None, nm: str = ""):
        if i is None:
            i = []

        self.ingredients = i
        self.name = nm

    def addIngredient(self, i: str):
        self.ingredients.append(i)

    def addToShopping(self, shopList: ShoppingList):
        for ingredient in self.ingredients:
            if ingredient not in shopList.items:
                shopList.addItem(ingredient)
    
    def exportData(self):
        return {
            "name": self.name,
            "ingredients": self.ingredients
        }

class Recipes:
    def __init__(self):
        self.recipeCards = []    # a list of recipe cards
    
    def addCard(self, i: list, nm: str):
        self.recipeCards.append(RecipeCard(i, nm))

    def deleteCard(self, card: RecipeCard):
        self.recipeCards.remove(card)

    def exportData(self):
        return [card.exportData() for card in self.recipeCards]
