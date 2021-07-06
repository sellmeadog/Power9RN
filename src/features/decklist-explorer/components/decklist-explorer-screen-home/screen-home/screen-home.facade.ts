import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';

import { P9UserDecklist } from '../../../../../core/data-user';
import { useUserDecklistFeatureService } from '../../../state';

export function useHomeScreenFacade(): [state: { data: P9UserDecklist[] }, remove: (entity: P9UserDecklist) => void] {
  const service = useUserDecklistFeatureService();

  useEffect(() => {
    service.loadUserDecklists();
  }, [service]);

  return [
    useObservableState(service.homeScreenState, { data: [] }),
    useCallback((entity: P9UserDecklist) => service.removeDecklist(entity), [service]),
  ];
}
