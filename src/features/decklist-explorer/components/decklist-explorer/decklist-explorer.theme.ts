import { StyleSheet } from 'react-native';

import { P9MagicCardArtwork } from '../../../magic-cards';

export const P9DecklistExplorerTheme = StyleSheet.create({
  itemContainer: {
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4.65,

    elevation: 8,
    marginLeft: 10,
    marginVertical: 10,
  },

  itemBackground: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  itemColorIdentityContainer: {
    bottom: 38,
    justifyContent: 'center',
    left: 0,
    paddingLeft: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },

  itemColorSymbol: {
    elevation: 3,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    width: 34,
  },

  itemTitle: {
    backgroundColor: '#000',
    fontFamily: 'Beleren2016-Bold',
    fontSize: 21,
    opacity: 0.9,
    paddingHorizontal: 10,
    paddingBottom: 16,
    paddingTop: 24,
    textAlign: 'center',
  },
});
