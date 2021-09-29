import React, { FunctionComponent } from 'react';

import { P9MagicCard } from '../../../core/public';
import { P9MagicCardPrintingPickerProvider } from '../../magic-cards';
import { P9MagicCardDetailTable } from './magic-card-detail-table.component';

export interface P9MagicCardDetailGalleryItemProps {
  magicCard: P9MagicCard;
}

export const P9MagicCardDetailGalleryItem: FunctionComponent<P9MagicCardDetailGalleryItemProps> = ({ magicCard }) => {
  return (
    <P9MagicCardPrintingPickerProvider magicCard={magicCard}>
      <P9MagicCardDetailTable />
    </P9MagicCardPrintingPickerProvider>
  );
};
