import React, { FunctionComponent, useCallback } from 'react';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem } from '../../../../components';
import { useAuthorizationFacade } from '../../../authorization';

export interface P9AccountSettingsProps {}

export const P9AccountSettings: FunctionComponent<P9AccountSettingsProps> = () => {
  const [{ isAnonymous, user }, authenticate] = useAuthorizationFacade();

  const handleAuthenticate = useCallback(() => authenticate(), [authenticate]);

  return (
    <>
      <P9TableDivider title={'Account'} />
      <P9TableViewActionItem primary title={isAnonymous ? 'Anonymous' : user?.customData?.handle ?? 'My Account'} />
      <P9ItemSeparator />
      <P9TableViewActionItem
        action
        accessory={'open-in-new'}
        disabled={!isAnonymous}
        title={'Create Account'}
        onPress={handleAuthenticate}
      />
    </>
  );
};
