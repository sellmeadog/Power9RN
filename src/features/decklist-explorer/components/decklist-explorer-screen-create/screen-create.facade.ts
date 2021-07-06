import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { P9DocumentInfo } from '../../../../core/data-user';
import { useAuthorizationFacade } from '../../../authorization';
import { P9CreateDecklistInfo, parseDocument } from '../../../decklist-parse';
import { useUserDecklistFeatureService } from '../../state';

type UpdateFn = <K extends keyof P9CreateDecklistInfo>(key: K, value: P9CreateDecklistInfo[K]) => void;

export function useCreateDecklistFacade(): [
  state: { decklistInfo: P9CreateDecklistInfo | undefined; isValid: boolean },
  dispatch: UpdateFn,
  parseDocumentInfo: (documentInfo?: P9DocumentInfo) => void,
  createFn: () => Promise<void>,
] {
  const [{ user }] = useAuthorizationFacade();
  const service = useUserDecklistFeatureService();

  const state = useObservableState(
    useObservable(() =>
      combineLatest({
        decklistInfo: service.createDecklistUIState,
        isValid: service.createDecklistUIState.pipe(map((info) => Boolean(info?.name))),
      }),
    ),
    { decklistInfo: { name: '', formatId: 'casual' }, isValid: false },
  );

  const dispatchFn: UpdateFn = useCallback(
    <K extends keyof P9CreateDecklistInfo>(key: K, value: P9CreateDecklistInfo[K]) =>
      service.updateCreateDecklistUI(key, value),
    [service],
  );

  useEffect(() => service.initCreateDecklistUI(), [service]);

  const parseDocumentInfo = useCallback(
    async (documentInfo: P9DocumentInfo | undefined) => {
      if (documentInfo) {
        const { manualEntries, name } = await parseDocument(documentInfo);

        dispatchFn('manualEntries', manualEntries);
        dispatchFn('name', name);
      }
    },
    [dispatchFn],
  );

  const createFn = useCallback(async () => {
    try {
      await service.createDecklist(user);
    } catch (error) {
      Alert.alert('Decklist Error', error.message);
    }
  }, [service, user]);

  return [state, dispatchFn, parseDocumentInfo, createFn];
}
