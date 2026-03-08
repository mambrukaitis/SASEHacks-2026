import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

interface NewRecipeCardProps {
  onPress?: () => void;
}

export function NewRecipeCard({ onPress }: NewRecipeCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.circle}>
        <MaterialIcons name="add" size={40} color={Colors.background} />
      </View>
      <Text style={styles.label}>New</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 177 / 210,
    backgroundColor: Colors.lightLightGreen,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.31,
    shadowRadius: 19.1,
    elevation: 6,
  },
  circle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10.2,
    elevation: 4,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
});
