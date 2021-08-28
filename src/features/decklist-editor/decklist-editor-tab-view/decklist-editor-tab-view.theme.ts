import { StyleSheet } from 'react-native';

export const P9DecklistEditorTabViewTheme = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowColor: 'transparent',
    height: 44,
  },

  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    height: 44,
  },

  tabBarItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  tabBarItemCount: {
    fontSize: 8,
    fontWeight: '700',
  },
});
