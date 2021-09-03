import React, { FunctionComponent } from 'react';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem } from '../../../../components';
import { openExternalUrl } from './settings-link-external';

export interface P9SupportSettingsProps {}

export const P9SupportSettings: FunctionComponent<P9SupportSettingsProps> = () => {
  return (
    <>
      <P9TableDivider title={'Discuss // Support'} />
      <P9TableViewActionItem
        accessory={'open-in-new'}
        title={'/r/power9io on Reddit'}
        onPress={openExternalUrl('https://www.reddit.com/r/power9io/')}
      />
      <P9ItemSeparator />
      <P9TableViewActionItem
        accessory={'open-in-new'}
        title={'@power9io on Twitter'}
        onPress={openExternalUrl('https://twitter.com/power9io')}
      />
    </>
  );
};
