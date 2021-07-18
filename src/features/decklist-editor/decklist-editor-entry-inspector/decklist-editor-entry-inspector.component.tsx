import { useObservableState } from 'observable-hooks';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { LayoutRectangle, StyleSheet } from 'react-native';

import { ID } from '@datorama/akita';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { P9RowView, P9SpinButton } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9UserDecklistEntry } from '../../../core/data-user/schema/user-decklist-entry';
import { useDependency } from '../../../core/di';
import { useDecklistEditorEntries } from '../decklist-editor-entry-explorer/decklist-editor-entry-explorer.component';
import { P9DecklistEditorBottomSheetBackground } from '../decklist-editor-screen/decklist-editor-bottom-sheet.component';
import { P9DecklistEditorService } from '../state/decklist-editor.service';
import { P9DecklistEntryEditorCarousel } from './decklist-editor-entry-carousel.component';

export interface P9DecklistEditorEntryInspectorProps {
  activeId?: ID;
  entries?: P9UserDecklistEntry[];
}

export const P9DecklistEditorEntryInspector = forwardRef<BottomSheet, P9DecklistEditorEntryInspectorProps>(
  ({ activeId }, ref) => {
    const [{ activeEntry, entries }, activateEntry, updateCount] = useDecklistEditorEntryFacade();
    const [layout, setLayout] = useState<LayoutRectangle>({ height: 1, width: 0, x: 0, y: 0 });
    const editorEntries = useDecklistEditorEntries(entries);
    const snapPoints = useMemo(() => [0, layout.height], [layout]);

    const handleEditorEntryChange = useCallback((entryId) => entryId && activateEntry(entryId), [activateEntry]);

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

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={P9DecklistEditorBottomSheetBackground}
      >
        <BottomSheetView onLayout={(event) => setLayout(event.nativeEvent.layout)}>
          <P9DecklistEntryEditorCarousel
            activeId={activeId}
            editorEntries={editorEntries}
            onEditorEntryChanged={handleEditorEntryChange}
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
      </BottomSheet>
    );
  },
);

const P9DecklistEditorEntryInspectorTheme = StyleSheet.create({
  spinButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
  },
});

type P9DecklistEntryInspectorState = {
  entries?: P9UserDecklistEntry[];
  activeEntry?: P9UserDecklistEntry;
};

function useDecklistEditorEntryFacade(): [
  state: P9DecklistEntryInspectorState,
  activateFn: (entryId: string) => void,
  updateFn: (entryId: string, entryType: P9DecklistEntryType, count: number) => void,
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
  ];
}
