import React, { FunctionComponent } from 'react';

import { useMagicCardGalleryFacade } from '../../public/components';
import { P9MagicCardDetailGallery } from './magic-card-detail-gallery.component';

export interface P9MagicCardDetailScreenProps {}

export const P9MagicCardDetailScreen: FunctionComponent<P9MagicCardDetailScreenProps> = () => {
  const [{ visibleResults }] = useMagicCardGalleryFacade();

  return (
    <P9MagicCardDetailGallery
      // currentIndex={currentIndex}
      data={visibleResults}
      // onCurrentIndexChange={facade.setCurrentIndex.bind(facade)}
    />
  );
};
