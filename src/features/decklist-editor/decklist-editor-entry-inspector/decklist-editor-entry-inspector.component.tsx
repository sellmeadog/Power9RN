import React, { forwardRef, useMemo, useState } from 'react';
import { LayoutRectangle } from 'react-native';

import { ID } from '@datorama/akita';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { P9UserDecklistEntry } from '../../../core/data-user/schema/user-decklist-entry';
import { useDecklistEditorEntries } from '../decklist-editor-entry-explorer/decklist-editor-entry-explorer.component';
import { P9DecklistEditorBottomSheetBackground } from '../decklist-editor-screen/decklist-editor-bottom-sheet.component';
import { P9DecklistEntryEditorCarousel } from './decklist-editor-entry-carousel.component';

export interface P9DecklistEditorEntryInspectorProps {
  activeId?: ID;
  entries?: P9UserDecklistEntry[];
  initialIndex?: number;
}

export const P9DecklistEditorEntryInspector = forwardRef<BottomSheet, P9DecklistEditorEntryInspectorProps>(
  ({ activeId, entries, initialIndex = 0 }, ref) => {
    const [layout, setLayout] = useState<LayoutRectangle>({ height: 1, width: 0, x: 0, y: 0 });
    const editorEntries = useDecklistEditorEntries(entries);
    const snapPoints = useMemo(() => [0, layout.height], [layout]);

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
            initialIndex={initialIndex}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

// const P9DecklistEditorEntryInspectorTheme = StyleSheet.create({});
