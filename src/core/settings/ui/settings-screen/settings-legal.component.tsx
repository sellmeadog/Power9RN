import React, { FunctionComponent } from 'react';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem, P9TableViewTextItem } from '../../../../components';
import { openExternalUrl } from './settings-link-external';

export interface P9LegalSettingsProps {}

export const P9LegalSettings: FunctionComponent<P9LegalSettingsProps> = () => {
  return (
    <>
      <P9TableDivider borderTop title={'Legal'} />
      <P9TableViewActionItem
        accessory={'open-in-new'}
        title={'Privacy Policy'}
        onPress={openExternalUrl('http://privacy.power9.io')}
      />
      <P9ItemSeparator />
      <P9TableViewActionItem
        accessory={'open-in-new'}
        title={'Terms of Use'}
        onPress={openExternalUrl('http://legal.power9.io/terms-of-use')}
      />
      <P9TableViewTextItem
        text={[
          'The literal and graphical information provided by this app about Magic: The Gathering, including card images, mana symbols, and oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. This app is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.',
          'Card prices represent market values provided by our affiliates. Absolutely no guarantee is made for any price information. See stores for final prices and availability.',
        ]}
      />
    </>
  );
};
