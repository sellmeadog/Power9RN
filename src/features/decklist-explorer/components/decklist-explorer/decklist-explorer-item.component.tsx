import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';

import { P9GameSymbol, P9GameSymbolType, P9RowView, P9SpringPressable } from '../../../../components';
import { P9UserDecklist } from '../../../../core/data-user';
import { P9DecklistExplorerTheme } from './decklist-explorer.theme';

export interface P9DecklistExplorerItemProps {
  item: P9UserDecklist;
  onLongPress(decklist: P9UserDecklist): void;
  onPress(id: string): void;
  width?: number;
}

export const P9DecklistExplorerItem: FunctionComponent<P9DecklistExplorerItemProps> = ({
  item,
  onLongPress,
  onPress,
  width = 250,
}) => {
  const colorIdentity = useMemo(
    () => Object.entries(item.metadata).filter(([key, value]) => ['W', 'U', 'B', 'R', 'G', 'C'].includes(key) && value),
    [item.metadata],
  );

  const handleLongPress = useCallback(() => onLongPress(item), [item, onLongPress]);

  const handlePress = useCallback(() => onPress(item._id), [item._id, onPress]);

  return (
    <P9SpringPressable
      onLongPress={handleLongPress}
      onPress={handlePress}
      springValue={0.9}
      style={[P9DecklistExplorerTheme.itemContainer, { width }]}
    >
      <ImageBackground
        source={{ uri: item.metadata?.defaultCardArtworkUri ?? undefined }}
        style={P9DecklistExplorerTheme.itemBackground}
      >
        <P9RowView style={P9DecklistExplorerTheme.itemColorIdentityContainer}>
          {colorIdentity.map(([symbol]) => (
            <P9GameSymbol
              key={symbol}
              symbol={symbol as P9GameSymbolType}
              containerStyle={P9DecklistExplorerTheme.itemColorSymbol}
            />
          ))}
        </P9RowView>
        <Text
          adjustsFontSizeToFit={true}
          ellipsizeMode={'tail'}
          minimumFontScale={0.6}
          numberOfLines={1}
          style={[P9DecklistExplorerTheme.itemTitle]}
        >
          {item.name}
        </Text>
      </ImageBackground>
    </P9SpringPressable>
  );
};
