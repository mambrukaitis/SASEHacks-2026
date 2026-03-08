import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

interface RecipeCardProps {
  title: string;
  ingredients: string[];
  costBadge?: number;
  onPress?: () => void;
  onInfoPress?: () => void;
}

export function RecipeCard({
  title,
  ingredients,
  costBadge,
  onPress,
  onInfoPress,
}: RecipeCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {costBadge != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{costBadge}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.underline} />
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.ingredients}>
          {ingredients.map((ingredient, i) => (
            <View key={i} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText} numberOfLines={1}>
                {ingredient}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Pressable style={styles.infoButton} onPress={onInfoPress} hitSlop={8}>
        <MaterialIcons name="info-outline" size={22} color={Colors.darkGreen} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 177 / 210,
    backgroundColor: Colors.lightGreen,
    borderRadius: 30,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.31,
    shadowRadius: 19.1,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: Colors.delete,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 1,
  },
  badgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    marginBottom: 8,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: Colors.darkGreen,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  ingredients: {
    gap: 9,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.darkGreen,
  },
  ingredientText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGreen,
  },
  infoButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
});
