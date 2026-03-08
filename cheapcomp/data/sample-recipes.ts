/**
 * Sample recipe data for UI and modal. Replace with Flask API later (e.g. GET /recipes, GET /recipe/:id).
 */
export interface SampleRecipe {
  id: string;
  name: string;
  ingredients: string[];
  price?: number;
}

export const SAMPLE_RECIPES: SampleRecipe[] = [
  {
    id: '1',
    name: "Mama's Pasta",
    ingredients: ['Penne', 'Alfredo Sauce', 'Parmesan', 'Zucchini', 'Tomatoes', 'Pine Nuts'],
    price: 12.5,
  },
  {
    id: '2',
    name: 'Hamburgers',
    ingredients: ['Ground beef', 'Buns', 'Tomatoes', 'Lettuce', 'Onion'],
    price: 8.0,
  },
  {
    id: '3',
    name: 'Spaghetti',
    ingredients: ['Spaghetti', 'Tomato sauce', 'Garlic', 'Basil', 'Parmesan'],
    price: 6.5,
  },
  {
    id: '4',
    name: 'Turtle Soup',
    ingredients: ['Turtle meat', 'Celery', 'Onion', 'Tomatoes', 'Stock'],
    price: 15.0,
  },
  {
    id: '5',
    name: 'Sugar Cookies',
    ingredients: ['Flour', 'Sugar', 'Butter', 'Egg', 'Vanilla'],
    price: 4.0,
  },
];
