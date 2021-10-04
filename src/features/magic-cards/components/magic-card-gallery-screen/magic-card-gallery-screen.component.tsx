import React, { FunctionComponent, useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';

import { useMagicCardGalleryFacade } from '../../../public/components';
import { P9MagicCardGalleryPlaceholder } from '../magic-card-gallery-placeholder/magic-card-gallery-placeholder.component';
import { P9MagicCardGallery } from '../magic-card-gallery/magic-card-gallery.component';
import { P9MagicCardGalleryHeader } from './magic-card-gallery-header.component';
import { P9MagicCardGalleryMetadata } from './magic-card-gallery-metadata.component';

export interface P9MagicCardGalleryScreenProps {}

export const P9MagicCardGalleryScreen: FunctionComponent<P9MagicCardGalleryScreenProps> = () => {
  const [{ visibleResults, keywordExpression }, handleKeywordExpressionChange] = useMagicCardGalleryFacade();
  const { navigate } = useNavigation();

  const handlePress = useCallback((_, index) => navigate('P9:Modal:MagicCardFeature:Detail', { index }), [navigate]);

  return (
    <>
      <P9MagicCardGalleryHeader expression={keywordExpression} onExpressionChange={handleKeywordExpressionChange} />
      <P9MagicCardGalleryPlaceholder loading={(visibleResults?.length ?? 0) === 0} />
      <P9MagicCardGallery data={visibleResults} onPress={handlePress} />
      <P9MagicCardGalleryMetadata />
    </>
  );
};
