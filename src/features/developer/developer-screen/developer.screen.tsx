import React, { FunctionComponent, useCallback } from 'react';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { P9TableDivider } from '../../../components';
import { useAuthorizationFacade } from '../../../core/authorization';
import { useDependency } from '../../../core/di';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';

export interface P9DeveloperScreenProps {}

export const P9DeveloperScreen: FunctionComponent<P9DeveloperScreenProps> = () => {
  const service = useDependency(P9PublicPartitionService);
  const [{ user, isAnonymous }, authenticate] = useAuthorizationFacade();

  const handlePress = useCallback(() => {
    authenticate();
  }, [authenticate]);

  return (
    <SafeAreaView>
      <Text>{'Developer Settings'}</Text>
      <P9TableDivider title={'Security'} />
      <Text>
        User: {user?.profile.email} ({user?.id})
      </Text>
      <Text>isAnonymous: {isAnonymous ? 'True' : 'False'}</Text>
      <Button onPress={handlePress} title={'Authenticate'} />
      <P9TableDivider title={'Public Data'} />
      <Button onPress={() => service.etl()} title={'Populate Public Partition'} />
    </SafeAreaView>
  );
};
