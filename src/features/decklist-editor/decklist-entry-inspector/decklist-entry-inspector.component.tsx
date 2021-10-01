import { useObservableState } from 'observable-hooks';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ID } from '@datorama/akita';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import { P9BottomSheetBackground, P9RowView, P9SpinButton } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { useDependency } from '../../../core/di';
import {
  P9MagicCardPrintingPickerProvider,
  P9MagicCardPrintingPickerSheet,
  P9MagicCardPrintingPickerToggle,
} from '../../magic-cards';
import { P9DecklistEditorEntry } from '../decklist-editor.model';
import { P9DecklistEntryInspectorState } from '../state/decklist-editor.query';
import { P9DecklistEditorService } from '../state/decklist-editor.service';
import { P9DecklistEntryCarousel } from './decklist-entry-carousel.component';

export interface P9DecklistEntryInspectorProps {
  activeId?: ID;
  entries?: P9DecklistEditorEntry[];
}

export const P9DecklistEntryInspector = forwardRef<BottomSheetModal, P9DecklistEntryInspectorProps>(
  ({ activeId }, ref) => {
    const [{ activeEntry, entries }, activateEntry, updateCount, updatePrinting] = useDecklistEditorEntryFacade();
    const snapPoints = useMemo(() => [562 + 12], []);

    const handleEditorEntryChange = useCallback(
      (entryId) => {
        entryId && activateEntry(entryId);
      },
      [activateEntry],
    );

    const handleMaindeckValueChange = useCallback(
      (count: number) => {
        if (activeEntry) {
          updateCount(activeEntry.id, 'maindeck', count);
        }
      },
      [activeEntry, updateCount],
    );

    const handleSideboardValueChange = useCallback(
      (count: number) => {
        if (activeEntry) {
          updateCount(activeEntry.id, 'sideboard', count);
        }
      },
      [activeEntry, updateCount],
    );

    const [printing, handlePrintingChange] = useState(activeEntry?.magicCard);

    useEffect(() => {
      if (!activeEntry?.magicCard) {
        return;
      }

      if (!printing) {
        return;
      }

      if (activeEntry.magicCard.oracle_id === printing.oracle_id) {
        if (activeEntry.magicCard._id === printing._id) {
          return;
        }

        updatePrinting(activeEntry.id, printing._id);
      }
    }, [activeEntry, printing, updatePrinting]);

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={P9BottomSheetBackground}
        enablePanDownToClose={true}
        index={0}
        snapPoints={snapPoints}
      >
        <P9MagicCardPrintingPickerProvider magicCard={activeEntry?.magicCard} onPrintingChange={handlePrintingChange}>
          <BottomSheetView>
            <P9DecklistEntryCarousel
              activeId={activeId}
              editorEntries={entries}
              onEditorEntryChanged={handleEditorEntryChange}
            />
            <P9MagicCardPrintingPickerToggle
              containerStyle={[P9DecklistEditorEntryInspectorTheme.printingToggleContainer]}
            />
            <P9RowView edges={['bottom']} style={P9DecklistEditorEntryInspectorTheme.spinButtonRow}>
              <P9SpinButton title={'main'} onValueChange={handleMaindeckValueChange} value={activeEntry?.maindeck} />
              <P9SpinButton
                title={'sideboard'}
                onValueChange={handleSideboardValueChange}
                value={activeEntry?.sideboard}
              />
            </P9RowView>
          </BottomSheetView>
          <P9MagicCardPrintingPickerSheet />
        </P9MagicCardPrintingPickerProvider>
      </BottomSheetModal>
    );
  },
);

const P9DecklistEditorEntryInspectorTheme = StyleSheet.create({
  spinButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
    zIndex: -1,
  },

  printingToggleContainer: {
    marginBottom: 16,
  },
});

function useDecklistEditorEntryFacade(): [
  state: P9DecklistEntryInspectorState,
  activateFn: (entryId: string) => void,
  updateFn: (entryId: string, entryType: P9DecklistEntryType, count: number) => void,
  updatePrintingFn: (entryId: string, cardId: string) => void,
] {
  const service = useDependency(P9DecklistEditorService);

  return [
    useObservableState(service.query.entryInspectorState$, {} as P9DecklistEntryInspectorState),
    useCallback((entryId: string) => service.activateDecklistEntry(entryId), [service]),
    useCallback(
      (entryId: string, entryType: P9DecklistEntryType, count: number) => {
        service.updateEntryCount(entryId, entryType, count);
      },
      [service],
    ),
    useCallback(
      (entryId: string, cardId: string) => {
        service.updateEntryPrinting(entryId, cardId);
      },
      [service],
    ),
  ];
}
