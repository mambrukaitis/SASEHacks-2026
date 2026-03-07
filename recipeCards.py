
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

class ShoppingList:
    def __init__(self):
        self.aldis = []
        self.tjs = []
        self.publix = []
