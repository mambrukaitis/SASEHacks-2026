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
    def __init__(self, budget: float = 0, shopList=None):
        self.budget = budget
        self.remainingBudget = budget
        self.items = []
        self.shopping_list = shopList

    def _parse_price(self, p):
        if p is None:
            return 0.0
        if isinstance(p, (int, float)):
            return float(p)
        if isinstance(p, str):
            try:
                return float(str(p).replace("$", "").strip())
            except ValueError:
                return 0.0
        return 0.0

    def addItem(self, item: Item):
        self.items.append(item)
        self.remainingBudget -= self._parse_price(item.price)

    def removeItem(self, item: Item):
        self.items.remove(item)
        self.remainingBudget += self._parse_price(item.price)
    
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
        publix_results = product_to_data.publix_search_limited(item)
        if not publix_results:
            return None
        p = publix_results[0]
        price_val = p.get("price") or p.get("priceString", "")
        if isinstance(price_val, str):
            try:
                price_val = float(str(price_val).replace("$", ""))
            except ValueError:
                price_val = 0.0
        p_copy = {"name": p.get("name"), "price": price_val, "store": "Publix", "brand": p.get("brand")}
        return Item(p_copy, item)

    def addItemItem(self, item):
        if item is None:
            return
        store = (item.store or "").lower()
        if "publix" in store:
            self.publix.append(item)
        elif "trader" in store or "joe" in store:
            self.tjs.append(item)
        else:
            self.aldis.append(item)
        if item.price:
            self.remainingBudget -= item.price if isinstance(item.price, (int, float)) else 0
        self.items.append(item.category or item.name)

    def addItem(self, item: str):
        publix_results = product_to_data.publix_search_limited(item)
        if not publix_results:
            return
        p = publix_results[0]
        price_val = p.get("price") or p.get("priceString", "")
        if isinstance(price_val, str):
            try:
                price_val = float(str(price_val).replace("$", ""))
            except ValueError:
                price_val = 0.0
        self.publix.append(Item({**p, "price": price_val}, item))
        self.remainingBudget -= price_val
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
