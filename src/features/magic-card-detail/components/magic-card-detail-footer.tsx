import React, { FunctionComponent } from 'react';

import { P9ArtistLabel, P9CaptionText, P9FootnoteText, P9ItemSeparator, P9ViewSurface } from '../../../components';
import { P9MagicCard } from '../../../core/public';

export interface P9MagicCardDetailFooterProps {
  magicCard: P9MagicCard;
}

export const P9MagicCardDetailFooter: FunctionComponent<P9MagicCardDetailFooterProps> = ({ magicCard }) => {
  const { card_faces, released_at } = magicCard;

  return (
    <>
      <P9ItemSeparator marginBottom={24} marginLeft={0} marginTop={12} />
      <P9ViewSurface paddingHorizontal={10}>
        <P9CaptionText>© {released_at?.substring(0, 4)} Wizards of the Coast</P9CaptionText>
        <P9ArtistLabel artist={card_faces.map(({ artist }) => artist).join(' // ')} />
      </P9ViewSurface>
      <P9ViewSurface edges={['bottom']} paddingHorizontal={10} paddingVertical={16}>
        <P9FootnoteText>
          {`The literal and graphical information presented in this app including card images, mana symbols, and oracle text are copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc.

Power 9 is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.`}
        </P9FootnoteText>
      </P9ViewSurface>
    </>
  );
};
