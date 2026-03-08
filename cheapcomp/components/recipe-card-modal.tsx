import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import type { SampleRecipe } from '@/data/sample-recipes';

/** Figma: Cheap Comps node 43-408 — create/edit recipe card modal */
interface RecipeCardModalProps {
  visible: boolean;
  /** When null, creating new recipe; otherwise editing */
  recipe: SampleRecipe | null;
  onClose: () => void;
  onDone: (recipe: { name: string; ingredients: string[] }) => void;
  onDelete?: (id: string) => void;
}

export function RecipeCardModal({
  visible,
  recipe,
  onClose,
  onDone,
  onDelete,
}: RecipeCardModalProps) {
  const [name, setName] = React.useState('');
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [newIngredient, setNewIngredient] = React.useState('');

  React.useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setIngredients(recipe.ingredients ?? []);
    } else {
      setName('');
      setIngredients([]);
    }
    setNewIngredient('');
  }, [recipe, visible]);

  const handleDone = () => {
    onDone({ name: name.trim() || 'Untitled', ingredients: [...ingredients] });
    onClose();
  };

  const handleDelete = () => {
    if (recipe?.id && onDelete) onDelete(recipe.id);
    onClose();
  };

  const addIngredient = () => {
    const t = newIngredient.trim();
    if (t) {
      setIngredients((prev) => [...prev, t]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="Name..."
              placeholderTextColor={Colors.grey}
              value={name}
              onChangeText={setName}
            />
          </View>

          <ScrollView
            style={styles.ingredientsScroll}
            contentContainerStyle={styles.ingredientsContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ing}</Text>
              </View>
            ))}
            <View style={styles.newIngredientRow}>
              <View style={styles.newIngredientBullet} />
              <TextInput
                style={styles.newIngredientInput}
                placeholder="New Ingredient"
                placeholderTextColor={Colors.grey}
                value={newIngredient}
                onChangeText={setNewIngredient}
                onSubmitEditing={addIngredient}
                returnKeyType="done"
              />
            </View>
          </ScrollView>

          <View style={styles.buttons}>
            <Pressable style={styles.doneButton} onPress={handleDone}>
              <MaterialIcons name="check" size={24} color={Colors.background} />
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
            {onDelete && (
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <MaterialIcons name="delete" size={24} color={Colors.background} />
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 360,
    maxWidth: '90%',
    backgroundColor: Colors.lightGreen,
    borderRadius: 35,
    padding: 24,
    paddingTop: 20,
    minHeight: 453,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10.2,
    elevation: 8,
  },
  nameRow: {
    marginBottom: 12,
  },
  nameInput: {
    height: 50,
    backgroundColor: Colors.background,
    borderRadius: 29,
    paddingHorizontal: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.darkGreen,
  },
  ingredientsScroll: {
    maxHeight: 250,
    marginBottom: 8,
  },
  ingredientsContent: {
    gap: 9,
    paddingVertical: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 26,
    height: 26,
    borderRadius: 2,
    backgroundColor: Colors.darkGreen,
  },
  ingredientText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '500',
    color: Colors.darkGreen,
  },
  newIngredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newIngredientBullet: {
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: Colors.grey,
  },
  newIngredientInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '500',
    color: Colors.darkGreen,
    paddingVertical: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 31,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.8,
    elevation: 4,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.delete,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 31,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});
