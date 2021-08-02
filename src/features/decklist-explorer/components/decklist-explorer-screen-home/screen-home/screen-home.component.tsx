import React, { FunctionComponent, useCallback } from 'react';
import { Alert, FlatList, ImageBackground, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

import {
  P9DrawerNavigatorHeader,
  P9GameSymbol,
  P9GameSymbolType,
  P9RowView,
  P9TableDivider,
} from '../../../../../components';
import { P9UserDecklist } from '../../../../../core/data-user';
import { P9MagicCardArtwork } from '../../../../magic-cards';
import { useUserDecklistExplorerFacade } from '../../../state/decklist-explorer.facade';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [_, onActivate, onRemove] = useHomeScreenFacade();
  const [data] = useUserDecklistExplorerFacade();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const handleLongPress = useCallback(
    (decklist: P9UserDecklist) => {
      Alert.alert(
        `Delete ${decklist.name}?`,
        'Are you sure you want to delete this deck? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'default' },
          { text: 'Delete', onPress: () => onRemove(decklist), style: 'destructive' },
        ],
      );
    },
    [onRemove],
  );

  console.log(data);

  return (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'My Decks' }} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.formatId}
        renderItem={({ item }) => {
          return (
            <>
              <P9TableDivider title={`${item.formatId} Decks`} />
              <Carousel
                activeSlideAlignment={'center'}
                containerCustomStyle={{ paddingVertical: 20 }}
                autoplay={true}
                autoplayDelay={3600000}
                data={item.data}
                enableSnap={true}
                itemWidth={SCREEN_WIDTH - 96}
                renderItem={(info) => {
                  const colorIdentity = Object.entries(info.item.metadata).filter(
                    ([key, value]) => ['W', 'U', 'B', 'R', 'G', 'C'].includes(key) && value,
                  );

                  return (
                    <Pressable
                      onLongPress={() => handleLongPress(info.item)}
                      onPress={() => onActivate(info.item._id)}
                      style={[P9DecklistExplorerHomeScreenTheme.itemContainer]}
                    >
                      <ImageBackground
                        source={{ uri: info.item.metadata?.defaultCardArtworkUri }}
                        style={P9DecklistExplorerHomeScreenTheme.itemBackground}
                      >
                        <P9RowView style={P9DecklistExplorerHomeScreenTheme.itemColorIdentityContainer}>
                          {colorIdentity.map(([symbol]) => (
                            <P9GameSymbol
                              key={symbol}
                              symbol={symbol as P9GameSymbolType}
                              containerStyle={P9DecklistExplorerHomeScreenTheme.itemColorSymbol}
                            />
                          ))}
                        </P9RowView>
                        <Text style={[P9DecklistExplorerHomeScreenTheme.itemTitle]}>{info.item.name}</Text>
                      </ImageBackground>
                    </Pressable>
                  );
                }}
                sliderWidth={SCREEN_WIDTH}
                vertical={false}
              />
            </>
          );
        }}
      />
      <P9DecklistExplorerActionButton decklistCount={0} />
    </>
  );
};

const P9DecklistExplorerHomeScreenTheme = StyleSheet.create({
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
  },

  itemBackground: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    borderRadius: 16,
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
