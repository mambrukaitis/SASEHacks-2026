import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { NewRecipeCard } from '@/components/new-recipe-card';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeCardModal } from '@/components/recipe-card-modal';
import { Colors } from '@/constants/Colors';
import {
  SAMPLE_RECIPES,
  type SampleRecipe,
} from '@/data/sample-recipes';

export default function HomeScreen() {
  const [recipes, setRecipes] = React.useState<SampleRecipe[]>(SAMPLE_RECIPES);
  const [modalRecipe, setModalRecipe] = React.useState<SampleRecipe | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openNew = () => {
    setModalRecipe(null);
    setModalVisible(true);
  };

  const openEdit = (recipe: SampleRecipe) => {
    setModalRecipe(recipe);
    setModalVisible(true);
  };

  const handleDone = (data: { name: string; ingredients: string[]; price: number }) => {
    if (modalRecipe) {
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === modalRecipe.id
            ? { ...r, name: data.name, ingredients: data.ingredients, price: data.price }
            : r
        )
      );
    } else {
      setRecipes((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: data.name,
          ingredients: data.ingredients,
          price: data.price,
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
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
              costBadge={recipe.price}
              onPress={() => openEdit(recipe)}
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
