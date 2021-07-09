import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';

import { ID } from '@datorama/akita';
import { useNavigation } from '@react-navigation/native';

import { P9UserDecklist } from '../../../../../core/data-user';
import { useUserDecklistFeatureService } from '../../../state';

export function useHomeScreenFacade(): [
  state: { data: P9UserDecklist[] },
  activate: (id: ID) => void,
  remove: (entity: P9UserDecklist) => void,
] {
  const service = useUserDecklistFeatureService();
  const { navigate } = useNavigation();

  useEffect(() => {
    service.loadUserDecklists();
  }, [service]);

  return [
    useObservableState(service.homeScreenState, { data: [] }),
    useCallback(
      (id: ID) => {
        service.activateDecklist(id);
        navigate('P9:Modal:DecklistExplorer:Editor');
      },
      [navigate, service],
    ),
    useCallback((entity: P9UserDecklist) => service.removeDecklist(entity), [service]),
  ];
}
