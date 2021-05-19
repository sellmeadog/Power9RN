import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface P9DeveloperScreenProps {}

export const P9DeveloperScreen: FunctionComponent<P9DeveloperScreenProps> = () => {
  return (
    <SafeAreaView>
      <Text>Developer Settings</Text>
    </SafeAreaView>
  );
};
