
class Recipes:
    def __init__(self):
        self.recipeCards = []    # a list of recipe cards
    
    def addCard(self, i: list, nm: str):
        self.recipeCards.append(RecipeCard(i, nm))
    
class RecipeCard:
    def __init__(self, i: list, nm: str ):
        self.card = [nm] + i    # a list of ingredients, first element is name
        self.selected = [0 for c in self.card]