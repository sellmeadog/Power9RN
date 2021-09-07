import React, { FunctionComponent } from 'react';

import { useRoute } from '@react-navigation/native';

import { useMagicCardGalleryFacade } from '../../public/components';
import { P9MagicCardDetailGallery } from './magic-card-detail-gallery.component';

export interface P9MagicCardDetailScreenProps {}

export const P9MagicCardDetailScreen: FunctionComponent<P9MagicCardDetailScreenProps> = () => {
  const { params } = useRoute();
  const [{ visibleResults }] = useMagicCardGalleryFacade();

  return (
    <P9MagicCardDetailGallery
      currentIndex={(params as any)?.index}
      data={visibleResults}
      // onCurrentIndexChange={facade.setCurrentIndex.bind(facade)}
    />
  );
};
