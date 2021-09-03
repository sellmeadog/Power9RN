import React, { FunctionComponent } from 'react';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem } from '../../../../components';
import { openExternalUrl } from './settings-link-external';

export interface P9LegalSettingsProps {}

export const P9LegalSettings: FunctionComponent<P9LegalSettingsProps> = () => {
  return (
    <>
      <P9TableDivider title={'Discuss // Support'} />
      <P9TableViewActionItem title={'Privacy Policy'} onPress={openExternalUrl('http://privacy.power9.io')} />
      <P9ItemSeparator />
      <P9TableViewActionItem title={'Terms of Use'} onPress={openExternalUrl('http://legal.power9.io/terms-of-use')} />
    </>
  );
};
