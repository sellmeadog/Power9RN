import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';

import { P9DecklistEditorNavigatorParamList } from '../decklist-editor';
import { P9NavigationContainerParamsList } from './';

type P9NavigationParamsList = P9NavigationContainerParamsList & P9DecklistEditorNavigatorParamList;

export function useNavigationService<T extends NavigationProp<P9NavigationParamsList>>(): [
  service: { openDecklistSettings: () => void; openDecklistSimulator: () => void },
  navigate: <RouteName extends keyof P9NavigationParamsList>(
    ...args: undefined extends P9NavigationParamsList[RouteName]
      ? [RouteName] | [RouteName, P9NavigationParamsList[RouteName]]
      : [RouteName, P9NavigationParamsList[RouteName]]
  ) => void,
] {
  const { navigate } = useNavigation<T>();

  return [
    useMemo(
      () => ({
        openDecklistSettings: () => navigate('P9:Modal:DecklistExplorer:Editor:Settings'),
        openDecklistSimulator: () => {
          Alert.alert('Coming Soon', 'This feature is still being developed and will be available in a future update.');
          // navigate('P9:Modal:Decklist:Simulator')
        },
      }),
      [navigate],
    ),
    useCallback(navigate, [navigate]),
  ];
}
