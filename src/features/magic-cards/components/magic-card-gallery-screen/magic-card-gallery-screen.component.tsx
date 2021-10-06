import React, { FunctionComponent, useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';

import { useMagicCardGalleryFacade } from '../../state/magic-card.query';
import { P9MagicCardGalleryPlaceholder } from '../magic-card-gallery-placeholder/magic-card-gallery-placeholder.component';
import { P9MagicCardGallery } from '../magic-card-gallery/magic-card-gallery.component';
import { P9MagicCardGalleryHeader } from './magic-card-gallery-header.component';
import { P9MagicCardGalleryMetadata } from './magic-card-gallery-metadata.component';

export interface P9MagicCardGalleryScreenProps {}

export const P9MagicCardGalleryScreen: FunctionComponent<P9MagicCardGalleryScreenProps> = () => {
  const [{ dataProvider, keywordExpression }, handleKeywordExpressionChange] = useMagicCardGalleryFacade();
  const { navigate } = useNavigation();

  // @ts-ignore TODO: update navigation type defintions per v6: https://reactnavigation.org/docs/upgrading-from-5.x#stricter-types-for-typescript
  const handlePress = useCallback((_, index) => navigate('P9:Modal:MagicCardFeature:Detail', { index }), [navigate]);

  return (
    <>
      <P9MagicCardGalleryHeader expression={keywordExpression} onExpressionChange={handleKeywordExpressionChange} />
      <P9MagicCardGalleryPlaceholder loading={dataProvider.getSize() === 0} />
      <P9MagicCardGallery dataProvider={dataProvider} onPress={handlePress} />
      <P9MagicCardGalleryMetadata />
    </>
  );
};
