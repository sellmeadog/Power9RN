import { useCallback, useState } from 'react';

import { P9UserDecklist } from '../../../core/data-user';
import { P9CreateDecklistInfo } from '../../decklist-parse';

type P9CreateDecklistFn = (decklistInfo?: P9CreateDecklistInfo) => void;
type P9CreateDecklistProgress = {
  decklist?: P9UserDecklist;
  error?: any;
  hasError: boolean;
  progress?: [number, number];
  writing: boolean;
};

export function useCreateDecklist(): [P9CreateDecklistFn, P9CreateDecklistProgress] {
  // const globalDatabase = useGlobalDatabase();
  // const userContentDatabase = useUserContentDatabase();
  const [result, setResult] = useState<P9CreateDecklistProgress>({ hasError: false, writing: false });

  const createFn: P9CreateDecklistFn = useCallback(
    async (/*decklistInfo?: P9CreateDecklistInfo*/) => {
      setResult((current) => ({ ...current }));
    },
    [],
    // async (decklistInfo?: P9CreateDecklistInfo) => {
    //   const mergeResult = (partial: Partial<P9CreateDecklistProgress>) => {
    //     setResult((prev) => ({ ...prev, ...partial }));
    //   };

    //   setResult({ hasError: false, writing: true });

    //   if (!decklistInfo) {
    //     mergeResult({ hasError: true, writing: false, error: 'A valid decklist was not provided.' });
    //   } else if (!userContentDatabase) {
    //     mergeResult({ hasError: true, writing: false, error: 'No database instance is available to write to.' });
    //   } else {
    //     const { manualEntries, parsedEntries, ...rest } = decklistInfo;
    //     let position = 0;
    //     const total = parsedEntries?.length || 0;

    //     mergeResult({ progress: [position, total] });

    //     // Write the initial decklist to the database
    //     const decklistObject = await new Promise<P9DecklistObject>((resolve) => {
    //       const decklist: P9UserDecklist = { id: v1(), ...rest, entries: [], createdAt: DateTime.utc().toSeconds() };

    //       userContentDatabase.write(() => {
    //         resolve(userContentDatabase.create<P9DecklistObject>('Decklist2', decklist, UpdateMode.Never));
    //       });
    //     });

    //     if (parsedEntries && parsedEntries.length) {
    //       mergeResult({ decklist: decklistObject });

    //       // Add entries to the decklist and report progress
    //       parsedEntries.forEach(({ cardName, count, collectorNumber, expansionCode, type }) => {
    //         setTimeout(() => {
    //           let magicCards = globalDatabase
    //             .objects<P9MagicCardFace>('CardFace')
    //             .filtered(
    //               'name ==[c] $0 OR name_searchable ==[c] $0 OR card.card_name ==[c] $0 OR card.card_name_searchable ==[c] $0',
    //               cardName
    //             );

    //           if (expansionCode) {
    //             magicCards = magicCards.filtered('expansion.code ==[c] $0', expansionCode);
    //           }

    //           if (collectorNumber) {
    //             magicCards = magicCards.filtered('collector_number ==[c] $0', collectorNumber);
    //           }

    //           const magicCard = magicCards[0];

    //           if (magicCard) {
    //             userContentDatabase.write(() => {
    //               decklistObject.entries.push({ id: v1(), cardId: magicCard.card.id, count: Number(count), type });
    //             });
    //           }

    //           const nextPosition = ++position;
    //           mergeResult({ progress: [nextPosition, total], writing: !(nextPosition === total) });
    //         });
    //       });
    //     } else {
    //       mergeResult({ decklist: decklistObject, writing: false });
    //     }
    //   }
    // },
    // [globalDatabase, userContentDatabase]
  );

  return [createFn, result];
}
