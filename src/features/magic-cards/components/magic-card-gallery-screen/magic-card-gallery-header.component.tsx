import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';

import { P9DrawerNavigatorHeader } from '../../../../components';
import { P9SearchBar } from '../../../../components/search-bar/search-bar';

export interface P9MagicCardGalleryHeaderProps {
  expression?: string;
  onExpressionChange?(expression?: string): void;
}

export const P9MagicCardGalleryHeader: FunctionComponent<P9MagicCardGalleryHeaderProps> = ({
  expression,
  onExpressionChange,
}) => {
  return (
    <P9DrawerNavigatorHeader
      containerStyle={P9MagicCardGalleryHeaderTheme.container}
      leftContainerStyle={P9MagicCardGalleryHeaderTheme.edgeContainer}
      centerContainerStyle={P9MagicCardGalleryHeaderTheme.centerContainer}
      rightContainerStyle={P9MagicCardGalleryHeaderTheme.edgeContainer}
      centerComponent={<P9SearchBar onExpressionChange={onExpressionChange} expression={expression} />}
    />
  );
};

const P9MagicCardGalleryHeaderTheme = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },

  centerContainer: {
    flex: undefined,
    flexGrow: 1,
    paddingRight: 0,
  },

  edgeContainer: {
    alignItems: 'center',
    flex: undefined,
    flexShrink: 1,
    justifyContent: 'center',
    paddingRight: 0,
  },
});
