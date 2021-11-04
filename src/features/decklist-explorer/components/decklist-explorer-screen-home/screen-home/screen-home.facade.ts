import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { ID } from '@datorama/akita';

import { P9UserDecklist } from '../../../../../core/data-user';
import { useDocumentPicker } from '../../../../../core/device';
import { useNavigationService } from '../../../../navigation';
import { useUserDecklistFeatureService } from '../../../state';
import { P9GameFormatType } from '../../../state/decklist-feature.model';

export function useHomeScreenFacade(): [
  state: { data: P9UserDecklist[] },
  activate: (id: ID) => void,
  importDecklist: () => Promise<void>,
  remove: (entity: P9UserDecklist) => void,
  activateSection: (type: P9GameFormatType) => void,
] {
  const service = useUserDecklistFeatureService();
  const actions = useUserDecklistActions();

  return [useObservableState(service.homeScreenState, { data: [] }), ...actions];
}

export function useUserDecklistActions(): [
  activate: (id: ID) => void,
  importDecklist: () => Promise<void>,
  remove: (entity: P9UserDecklist) => void,
  activateSection: (type: P9GameFormatType) => void,
] {
  const service = useUserDecklistFeatureService();
  const [{ openDecklistCreator, openDecklistEditor, openDecklistSection }] = useNavigationService();
  const [documentInfo, pickDocumentAsync] = useDocumentPicker();

  useEffect(() => {
    const importDecklist = async () => {
      if (documentInfo) {
        await service.importCreateDecklistUI(documentInfo);
        openDecklistCreator();
      }
    };

    importDecklist();
  }, [documentInfo, openDecklistCreator, service]);

  return [
    useCallback(
      (id: ID) => {
        service.activateDecklist(id);
        openDecklistEditor();
      },
      [openDecklistEditor, service],
    ),
    useCallback(async () => {
      await pickDocumentAsync();
    }, [pickDocumentAsync]),
    useCallback(
      (entity: P9UserDecklist) =>
        Alert.alert(
          `Delete ${entity.name}?`,
          'Are you sure you want to delete this deck? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'default' },
            { text: 'Delete', onPress: () => service.removeDecklist(entity), style: 'destructive' },
          ],
        ),
      [service],
    ),
    useCallback(
      (type: P9GameFormatType) => {
        service.activateDecklistSection(type);
        openDecklistSection();
      },
      [openDecklistSection, service],
    ),
  ];
}
