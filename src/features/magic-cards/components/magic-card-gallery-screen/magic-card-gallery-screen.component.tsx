import React, { FunctionComponent, useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';

import { useMagicCardGalleryFacade } from '../../../public/components';
import { P9MagicCardGallery } from '../magic-card-gallery/magic-card-gallery.component';
import { P9MagicCardGalleryHeader } from './magic-card-gallery-header.component';

export interface P9MagicCardGalleryScreenProps {}

export const P9MagicCardGalleryScreen: FunctionComponent<P9MagicCardGalleryScreenProps> = () => {
  const [{ visibleResults, keywordExpression }, handleKeywordExpressionChange] = useMagicCardGalleryFacade();
  const { navigate } = useNavigation();

  const handlePress = useCallback(() => navigate('P9:Modal:MagicCardFeature:Detail'), [navigate]);

  return (
    <>
      <P9MagicCardGalleryHeader expression={keywordExpression} onExpressionChange={handleKeywordExpressionChange} />
      <P9MagicCardGallery data={visibleResults} onPress={handlePress} />
    </>
  );
};
