import { SectionListData } from 'react-native';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { combineQueries, QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../core/operators';
import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9MagicCardGalleryQuery } from '../../magic-cards/state/magic-card.query';
import { P9DecklistEditorEntry, P9DecklistEditorState } from '../decklist-editor.model';

@singleton()
export class P9DecklistEditorQuery extends QueryEntity<P9UserDecklistFeatureState> {
  readonly activeEditorEntry$ = this.select(({ ui }) => ui.decklistEditorState?.activeEntryId).pipe(
    whenDefined(),
    switchMap((activeId) => this.selectActive(({ entries }) => entries.find(({ id }) => id === activeId))),
  );

  readonly activeEntryType$ = this.select(({ ui }) => ui.decklistEditorState?.activeEntryType);

  readonly entries$ = this.selectActive(({ entries }) =>
    entries
      .map(
        (entry): P9DecklistEditorEntry => ({
          ...entry,
          magicCard: this.magicCardQuery.findMagicCard(entry.cardId),
        }),
      )
      .sort(sortComparer),
  );

  readonly maindeckEntries$ = this.entries$.pipe(
    map((entries) => entries?.filter(({ maindeck }) => Boolean(maindeck))),
  );

  readonly maindeckEntryCount$ = this.maindeckEntries$.pipe(
    map((entries) => entries?.reduce((sum, { maindeck = 0 }) => sum + maindeck, 0)),
    distinctUntilChanged(),
  );

  readonly maindeckEntrySections$ = combineLatest([
    this.makeEntrySection('Creature'),
    this.makeEntrySection('Planeswalker'),
    this.makeEntrySection('Instant'),
    this.makeEntrySection('Sorcery'),
    this.makeEntrySection('Artifact'),
    this.makeEntrySection('Enchantment'),
    this.makeEntrySection('Land'),
  ]).pipe(map((sections) => sections.filter(({ data }) => Boolean(data?.length))));

  readonly sideboardEntries$ = this.entries$.pipe(
    map((entries) => entries?.filter(({ sideboard }) => Boolean(sideboard))),
  );

  readonly sideboardEntrySections$ = this.sideboardEntries$.pipe(
    map((entries): SectionListData<P9DecklistEditorEntry>[] => [
      {
        data: entries?.filter(({ sideboard }) => Boolean(sideboard)) ?? [],
      },
    ]),
  );

  readonly sideboardEntryCount$ = this.sideboardEntries$.pipe(
    map((entries) => entries?.reduce((sum, { sideboard = 0 }) => sum + sideboard, 0)),
    distinctUntilChanged(),
  );

  readonly editorState$: Observable<P9DecklistEditorState> = combineLatest({
    activeEntryType: this.activeEntryType$,
    entries: this.entries$,
    name: this.selectActive(({ name }) => name),
    maindeck: this.maindeckEntrySections$,
    sideboard: this.sideboardEntrySections$,
  });

  readonly entryInspectorState$ = combineQueries([
    this.entries$,
    this.select(({ ui }) => ui.decklistEditorState?.activeEntryId).pipe(
      switchMap((activeId) => this.entries$.pipe(map((entries) => entries?.find(({ id }) => id === activeId)))),
    ),
  ]).pipe(map(([entries, activeEntry]) => ({ entries, activeEntry })));

  constructor(store: P9UserDecklistFeatureStore, private magicCardQuery: P9MagicCardGalleryQuery) {
    super(store);
  }

  private makeEntrySection(
    cardType: 'Creature' | 'Planeswalker' | 'Instant' | 'Sorcery' | 'Artifact' | 'Enchantment' | 'Land',
  ) {
    return this.maindeckEntries$.pipe(
      map((entries = []): SectionListData<P9DecklistEditorEntry> => {
        const data = entries.filter(({ magicCard }) => {
          const types = Array.from(magicCard?.card_faces[0].types ?? []);

          switch (cardType) {
            case 'Creature':
              return !types.includes('Land') && types.includes(cardType);

            case 'Enchantment':
              return (
                !types.includes('Artifact') &&
                !types.includes('Creature') &&
                !types.includes('Land') &&
                types.includes(cardType)
              );

            case 'Artifact':
              return !types.includes('Creature') && !types.includes('Land') && types.includes(cardType);

            default:
              return types.includes(cardType);
          }
        });

        const size = data.reduce((sum, { maindeck = 0 }) => (sum += maindeck), 0);

        return {
          title: cardType.endsWith('y') ? cardType.replace('y', 'ies') : cardType + 's',
          size,
          data,
        };
      }),
      distinctUntilChanged(),
    );
  }
}

function sortComparer({ magicCard: a }: P9DecklistEditorEntry, { magicCard: b }: P9DecklistEditorEntry) {
  if (a === undefined) {
    return -1;
  } else if (b === undefined) {
    return 1;
  } else if (Array.from(a.card_faces[0].types).includes('Land') > Array.from(b.card_faces[0].types).includes('Land')) {
    return 1;
  } else if (Array.from(a.card_faces[0].types).includes('Land') < Array.from(b.card_faces[0].types).includes('Land')) {
    return -1;
  } else {
    if ((a.cmc ?? 0) > (b.cmc ?? 0)) {
      return 1;
    } else if ((a.cmc ?? 0) < (b.cmc ?? 0)) {
      return -1;
    } else {
      const aName = a.name ?? '';
      const bName = b.name ?? '';

      return aName > bName ? 1 : aName < bName ? -1 : 0;
    }
  }
}
