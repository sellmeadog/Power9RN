import { StyleSheet } from 'react-native';

export const P9ListTheme = StyleSheet.create({
  listItemContainer: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 10,
  },

  listItemSeparator: {
    height: StyleSheet.hairlineWidth,
  },

  emptyItemText: {
    alignSelf: 'center',
    fontSize: 19,
    textTransform: 'uppercase',
  },
});
