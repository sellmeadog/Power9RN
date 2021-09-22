import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { FlatList, ImageBackground, ListRenderItem, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { P9SpringPressable } from '../../../components';
import { P9UserDecklistEntry, P9UserDecklistMetadata } from '../../../core/data-user/schema/user-decklist-entry';
import { useDependency } from '../../../core/di';
import { P9MagicCard } from '../../../core/public';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';
import { P9MagicCardArtwork } from '../../magic-cards';

export interface P9DecklistEntryArtworkExplorerProps {
  entries?: P9UserDecklistEntry[];
  selected?: string | null;
  onSelected?: (metadata: Pick<P9UserDecklistMetadata, 'defaultCardArtworkUri' | 'defaultCardId'>) => void;
}

export const P9DecklistEntryArtworkExplorer: FunctionComponent<P9DecklistEntryArtworkExplorerProps> = ({
  entries,
  selected,
  onSelected,
}) => {
  const service = useDependency(P9PublicPartitionService);

  const data = useMemo(
    () => entries?.map(({ cardId }) => service.magicCardById(cardId)).sort((a, b) => (a?.cmc ?? 0) - (b?.cmc ?? 0)),
    [entries, service],
  );

  const renderItem: ListRenderItem<P9MagicCard | undefined> = useCallback(
    ({ item }) => {
      const defaultCardArtworkUri = item?.card_faces[0].image_uris?.art_crop ?? '';
      const defaultCardId = item?._id;

      return (
        <P9SpringPressable
          springValue={0.9}
          stiffness={300}
          onPress={() => onSelected?.({ defaultCardArtworkUri, defaultCardId })}
        >
          <View style={[P9DecklistEntryArtworkExplorerTheme.itemContainer]}>
            <ImageBackground
              source={{ uri: item?.card_faces[0].image_uris?.art_crop ?? '' }}
              style={[P9DecklistEntryArtworkExplorerTheme.itemArtwork]}
            >
              <Icon
                color={'#fff'}
                name={item?._id === selected ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
              />
            </ImageBackground>
          </View>
        </P9SpringPressable>
      );
    },
    [onSelected, selected],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      contentContainerStyle={[P9DecklistEntryArtworkExplorerTheme.contentContainer]}
      horizontal={true}
      extraData={selected}
    />
  );
};

const P9DecklistEntryArtworkExplorerTheme = StyleSheet.create({
  contentContainer: {
    paddingLeft: 10,
  },

  itemContainer: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    borderRadius: 10,
    height: 135,
    paddingRight: 10,
    paddingVertical: 10,
  },

  itemArtwork: {
    borderRadius: 10,
    flex: 1,
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});
