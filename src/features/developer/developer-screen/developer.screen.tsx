import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthorizationFacade } from '../../authorization';

export interface P9DeveloperScreenProps {}

let count = 0;

export const P9DeveloperScreen: FunctionComponent<P9DeveloperScreenProps> = () => {
  const [{ user, isAnonymous, error }, authenticate] = useAuthorizationFacade();
  console.log('Render:', ++count);

  return (
    <SafeAreaView>
      <Text>{'Developer Settings'}</Text>
      <Text>User: {user?.id}</Text>
      <Text>isAnonymous: {isAnonymous ? 'True' : 'False'}</Text>
      <Text>
        Error code: {error?.code} Message: {error?.message}
      </Text>
      <Button onPress={authenticate} title={'Authenticate'} />
    </SafeAreaView>
  );
};
