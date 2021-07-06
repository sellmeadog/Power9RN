import React, { FunctionComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { P9DrawerNavigatorHeader, P9ItemSeparator, P9TableViewItem } from '../../../../../components';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [{ data }, onRemove] = useHomeScreenFacade();

  console.log('P9DecklistExplorerHomeScreen', data);

  return (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'My Decks' }} />
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={P9ItemSeparator}
        renderItem={({ item }) => (
          <P9TableViewItem>
            <Text style={[P9DecklistExplorerHomeScreenTheme.container]}>
              {item.name} ({item.formatId})
            </Text>
            <Icon
              containerStyle={[P9DecklistExplorerHomeScreenTheme.container]}
              name={'delete-outline'}
              onPress={() => onRemove(item)}
            />
          </P9TableViewItem>
        )}
      />
      <P9DecklistExplorerActionButton decklistCount={0} />
    </>
  );
};

const P9DecklistExplorerHomeScreenTheme = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});
