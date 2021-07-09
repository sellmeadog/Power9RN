import { combineLatest, Observable } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';

import { P9MagicCard } from '../public';
import { extract_scryfall_cards, transform_scryfall_card } from './etl-magic-cards';
import { etl_magic_sets } from './etl-magic-set';

export function etl_scryfall(): Observable<P9MagicCard[]> {
  return combineLatest([extract_scryfall_cards(), etl_magic_sets()]).pipe(
    map(([magic_card, magic_sets]) => transform_scryfall_card(magic_card, magic_sets.get(magic_card.set)!)),
    bufferCount(100),
  );
}
