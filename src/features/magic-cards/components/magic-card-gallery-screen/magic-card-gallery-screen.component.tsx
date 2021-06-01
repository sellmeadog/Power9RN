import React, { FunctionComponent } from 'react';

import { useMagicCardGalleryFacade } from '../../../public/components';
import { P9MagicCardGallery } from '../magic-card-gallery/magic-card-gallery.component';
import { P9MagicCardGalleryHeader } from './magic-card-gallery-header.component';

export interface P9MagicCardGalleryScreenProps {}

export const P9MagicCardGalleryScreen: FunctionComponent<P9MagicCardGalleryScreenProps> = () => {
  const [{ visibleResults, keywordExpression }, handleKeywordExpressionChange] = useMagicCardGalleryFacade();

  return (
    <>
      <P9MagicCardGalleryHeader expression={keywordExpression} onExpressionChange={handleKeywordExpressionChange} />
      <P9MagicCardGallery data={visibleResults} />
    </>
  );
};
