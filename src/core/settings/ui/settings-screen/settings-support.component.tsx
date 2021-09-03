import React, { FunctionComponent } from 'react';
import { Alert, Linking } from 'react-native';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem } from '../../../../components';

const handlePress = (url: string) => async () => {
  try {
    await Linking.openURL(url);
  } catch {
    alertError();
  }
};

export interface P9SupportSettingsProps {}

export const P9SupportSettings: FunctionComponent<P9SupportSettingsProps> = () => {
  return (
    <>
      <P9TableDivider title={'Discuss // Support'} />
      <P9TableViewActionItem
        title={'/r/power9io on Reddit'}
        onPress={handlePress('https://www.reddit.com/r/power9io/')}
      />
      <P9ItemSeparator />
      <P9TableViewActionItem title={'@power9io on Twitter'} onPress={handlePress('https://twitter.com/power9io')} />
    </>
  );
};

function alertError() {
  Alert.alert(
    'An Error Occurred',
    'An error occurred trying to open your default browser. Please check your security settings and try again.',
  );
}
