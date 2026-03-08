import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/Colors';

const TAB_CONFIG: Record<string, { title: string; icon: (color: string) => React.ReactNode }> = {
  index: { title: 'Home', icon: (color: string) => <IconSymbol name="house.fill" size={24} color={color} /> },
  list: { title: 'List', icon: (color: string) => <MaterialIcons name="list" size={24} color={color} /> },
  budget: { title: 'Budget', icon: (color: string) => <MaterialIcons name="show-chart" size={24} color={color} /> },
};

const TAB_ROUTE_NAMES = ['index', 'list', 'budget'];

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);

  const visibleRoutes = state.routes.filter((route) => TAB_ROUTE_NAMES.includes(route.name));

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomInset }]}>
      <View style={styles.container}>
        {visibleRoutes.map((route) => {
          const index = state.routes.findIndex((r) => r.key === route.key);
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = Colors.background;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              android_ripple={null}>
              {config.icon(color)}
              <Text style={[styles.tabLabel, { color }]}>{config.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.secondary,
    borderRadius: 45,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 31,
  },
  tabItemActive: {
    backgroundColor: Colors.lightPurple,
  },
  tabLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});
