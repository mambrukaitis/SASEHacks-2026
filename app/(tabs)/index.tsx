import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { NewRecipeCard } from '@/components/new-recipe-card';
import { RecipeCard } from '@/components/recipe-card';
import { Colors } from '@/constants/Colors';

const RECIPES = [
  {
    id: '1',
    title: "Mama's Pasta",
    ingredients: ['Penne', 'Tomatoes', 'Zucchini', 'Alfredo Sauce', 'Pine Nuts'],
  },
  {
    id: '2',
    title: 'Hamburgers',
    ingredients: ['Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes'],
  },
  {
    id: '3',
    title: 'Spaghetti',
    ingredients: ['Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes'],
  },
  {
    id: '4',
    title: 'Turtle Soup',
    ingredients: ['Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes'],
  },
  {
    id: '5',
    title: 'Sugar Cookies',
    ingredients: ['Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes', 'Tomatoes'],
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Recipes</Text>

        <View style={styles.grid}>
          <NewRecipeCard onPress={() => {}} />
          {RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              ingredients={recipe.ingredients}
              costBadge={recipe.costBadge}
              onPress={() => {}}
              onInfoPress={() => {}}
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
