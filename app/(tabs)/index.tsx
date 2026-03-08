import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { NewRecipeCard } from '@/components/new-recipe-card';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeCardModal } from '@/components/recipe-card-modal';
import { Colors } from '@/constants/Colors';
import {
  getRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  addRecipeIngredientsToShopping,
} from '@/services/api';
import {
  SAMPLE_RECIPES,
  type SampleRecipe,
} from '@/data/sample-recipes';
import { useShoppingList } from '@/contexts/shopping-list-context';

export default function HomeScreen() {
  const [recipes, setRecipes] = React.useState<SampleRecipe[]>(SAMPLE_RECIPES);
  const [modalRecipe, setModalRecipe] = React.useState<SampleRecipe | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const { refreshFromBackend } = useShoppingList();

  React.useEffect(() => {
    getRecipes().then((data) => {
      if (data && data.length > 0) {
        setRecipes(
          data.map((r, i) => ({
            id: String(i + 1),
            name: r.name ?? 'Untitled',
            ingredients: r.ingredients ?? [],
          }))
        );
      }
    });
  }, []);

  const openNew = () => {
    setModalRecipe(null);
    setModalVisible(true);
  };

  const openEdit = (recipe: SampleRecipe) => {
    setModalRecipe(recipe);
    setModalVisible(true);
  };

  const handleAddRecipeToList = async (recipe: SampleRecipe) => {
    await addRecipeIngredientsToShopping(recipe.ingredients);
    await refreshFromBackend();
  };

  const handleDone = async (data: { name: string; ingredients: string[] }) => {
    if (modalRecipe) {
      const updated = await editRecipe({
        old_name: modalRecipe.name,
        name: data.name,
        ingredients: data.ingredients,
      });
      if (Array.isArray(updated)) {
        setRecipes(updated.map((r, i) => ({ id: String(i + 1), name: r.name, ingredients: r.ingredients ?? [] })));
      } else {
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === modalRecipe.id ? { ...r, name: data.name, ingredients: data.ingredients } : r
          )
        );
      }
    } else {
      const updated = await addRecipe({ name: data.name, ingredients: data.ingredients });
      if (Array.isArray(updated)) {
        setRecipes(updated.map((r, i) => ({ id: String(i + 1), name: r.name, ingredients: r.ingredients ?? [] })));
      } else {
        setRecipes((prev) => [
          ...prev,
          { id: String(Date.now()), name: data.name, ingredients: data.ingredients },
        ]);
      }
    }
    setModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    const rec = recipes.find((r) => r.id === id);
    if (rec) {
      const updated = await deleteRecipe({ name: rec.name });
      if (Array.isArray(updated)) {
        setRecipes(updated.map((r, i) => ({ id: String(i + 1), name: r.name, ingredients: r.ingredients ?? [] })));
      } else {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Recipes</Text>

        <View style={styles.grid}>
          <NewRecipeCard onPress={openNew} />
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.name}
              ingredients={recipe.ingredients}
              onPress={() => handleAddRecipeToList(recipe)}
              onInfoPress={() => openEdit(recipe)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.gradientWrapper} pointerEvents="none">
        <LinearGradient
          colors={['transparent', Colors.background]}
          style={styles.gradient}
        />
      </View>

      <RecipeCardModal
        visible={modalVisible}
        recipe={modalRecipe}
        onClose={() => setModalVisible(false)}
        onDone={handleDone}
        onDelete={modalRecipe ? handleDelete : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.darkGreen,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  bottomPadding: {
    height: 120,
  },
  gradientWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 105,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    flex: 1,
  },
});
