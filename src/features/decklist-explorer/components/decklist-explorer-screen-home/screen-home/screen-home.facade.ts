import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';

import { ID } from '@datorama/akita';
import { useNavigation } from '@react-navigation/native';

import { P9UserDecklist } from '../../../../../core/data-user';
import { useDocumentPicker } from '../../../../../core/device';
import { useUserDecklistFeatureService } from '../../../state';

export function useHomeScreenFacade(): [
  state: { data: P9UserDecklist[] },
  activate: (id: ID) => void,
  importDecklist: () => Promise<void>,
  remove: (entity: P9UserDecklist) => void,
] {
  const service = useUserDecklistFeatureService();
  const { navigate } = useNavigation();
  const [documentInfo, pickDocumentAsync] = useDocumentPicker();

  useEffect(() => {
    service.loadUserDecklists();
  }, [service]);

  useEffect(() => {
    const importDecklist = async () => {
      if (documentInfo) {
        await service.importCreateDecklistUI(documentInfo);
        navigate('P9:Modal:CreateDecklist');
      }
    };

    importDecklist();
  }, [documentInfo, navigate, service]);

  return [
    useObservableState(service.homeScreenState, { data: [] }),
    useCallback(
      (id: ID) => {
        service.activateDecklist(id);
        navigate('P9:Modal:DecklistExplorer:Editor');
      },
      [navigate, service],
    ),
    useCallback(async () => {
      await pickDocumentAsync();
    }, [pickDocumentAsync]),
    useCallback((entity: P9UserDecklist) => service.removeDecklist(entity), [service]),
  ];
}
