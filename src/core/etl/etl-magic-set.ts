import { defer, Observable } from 'rxjs';
import { map, mergeMap, retry } from 'rxjs/operators';

import { P9MagicSet } from '../public';
import { ScryfallSet, ScryfallSetList } from '../scryfall/model';
import { coalesce } from './coalesce';

export function extract_scryfall_sets(): Observable<ScryfallSetList> {
  return defer(() => fetch('https://api.scryfall.com/sets')).pipe(
    retry(3),
    mergeMap((res) => res.json()),
  );
}

function transform_scryfall_sets({ data }: ScryfallSetList) {
  return data.map(transform_scryfall_set);
}

function transform_scryfall_set(scryfall_set: ScryfallSet): P9MagicSet {
  const {
    arena_code,
    block_code,
    block,
    card_count,
    code,
    digital,
    foil_only,
    icon_svg_uri,
    id,
    mtgo_code,
    name,
    nonfoil_only,
    parent_set_code,
    printed_size,
    released_at,
    set_type,
    tcgplayer_id,
  } = scryfall_set;

  return {
    arena_code: coalesce(arena_code),
    block_code: coalesce(block_code, code),
    block: coalesce(block, 'Non-Block Expansions'),
    card_count: coalesce(card_count, 0),
    code,
    digital: coalesce(digital),
    foil_only: coalesce(foil_only),
    icon_svg_uri: coalesce(icon_svg_uri),
    mtgo_code: coalesce(mtgo_code),
    name,
    nonfoil_only: coalesce(nonfoil_only),
    parent_set_code: coalesce(parent_set_code),
    printed_size: coalesce(printed_size),
    released_at: coalesce(released_at),
    set_type: coalesce(set_type),
    source_id: id,
    tcgplayer_id: coalesce(tcgplayer_id),
  };
}

export function etl_magic_sets() {
  return extract_scryfall_sets().pipe(
    map(transform_scryfall_sets),
    map((magic_sets) => new Map<string, P9MagicSet>(magic_sets.map((magic_set) => [magic_set.code, magic_set]))),
  );
}
