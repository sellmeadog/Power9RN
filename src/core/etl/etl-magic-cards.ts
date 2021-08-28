import { defer, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  P9MagicCard,
  P9MagicCardFace,
  P9MagicCardImageMap,
  P9MagicCardPart,
  P9MagicCardPreview,
  P9MagicSet,
} from '../public';
import {
  ScryfallCard,
  ScryfallCardFace,
  ScryfallCardImageUriMap,
  ScryfallCardLegalityMap,
  ScryfallCardPart,
  ScryfallCardPreview,
} from '../scryfall/model';
import { coalesce } from './coalesce';
import { simplify } from './simplify';

export function transform_scryfall_card(scryfall_card: ScryfallCard, magic_set: P9MagicSet): P9MagicCard {
  const {
    all_parts,
    arena_id,
    booster,
    border_color,
    card_faces,
    cardmarket_id,
    cmc,
    collector_number,
    color_identity,
    digital,
    edhrec_rank,
    foil,
    frame_effects,
    frame,
    full_art,
    games,
    id,
    image_uris,
    keywords,
    lang,
    layout,
    legalities,
    name,
    nonfoil,
    oracle_id,
    oversized,
    preview,
    produced_mana,
    promo_types,
    promo,
    rarity,
    released_at,
    reprint,
    reserved,
    rulings_uri,
    tcgplayer_id,
    textless,
  } = scryfall_card;

  const magic_card: P9MagicCard = {
    _id: id,
    _owner: 'SYSTEM',
    _partition: 'PUBLIC',
    arena_id: coalesce(arena_id),
    booster: coalesce(booster),
    border_color: coalesce(border_color),
    card_faces: transform_scryfall_card_faces(card_faces || [scryfall_card], image_uris),
    cardmarket_id: coalesce(cardmarket_id),
    cmc: coalesce(cmc),
    collector_number: coalesce(collector_number),
    color_identity: coalesce(color_identity, ['C']),
    digital: coalesce(digital),
    edhrec_rank: coalesce(edhrec_rank),
    foil: coalesce(foil),
    frame_effects: coalesce(frame_effects, []),
    frame: coalesce(frame),
    full_art: coalesce(full_art),
    games: coalesce(games, []),
    keywords: coalesce(keywords, []),
    lang: coalesce(lang),
    layout: coalesce(layout),
    legalities: transform_scryfall_card_legalities(legalities),
    magic_set,
    name: coalesce(name),
    name_simple: coalesce(simplify(name)),
    nonfoil: coalesce(nonfoil),
    oracle_id: coalesce(oracle_id),
    oversized: coalesce(oversized),
    preview: transform_scryfall_card_preview(preview, released_at),
    produced_mana: coalesce(produced_mana, []),
    promo_types: coalesce(promo_types, []),
    promo: coalesce(promo),
    rarity: coalesce(rarity),
    related_cards: transform_scryfall_card_parts(all_parts),
    released_at: coalesce(released_at),
    reprint: coalesce(reprint),
    reserved: coalesce(reserved),
    rulings_uri: coalesce(rulings_uri),
    tcgplayer_id: coalesce(tcgplayer_id),
    textless: coalesce(textless),
  };

  return magic_card;
}

/**
 * Transforms a ScryfallCardFace[] to P9MagicCardFace[]
 * @param card_faces A ScryfallCardFace[] to transform
 * @param parent_image_uris A fallback ScryfallCardImageUriMap
 */
export function transform_scryfall_card_faces(
  card_faces: ScryfallCardFace[],
  parent_image_uris: ScryfallCardImageUriMap,
): P9MagicCardFace[] {
  return card_faces.map((card_face) => {
    const {
      artist,
      color_indicator,
      colors,
      flavor_text,
      image_uris,
      loyalty,
      mana_cost,
      name,
      oracle_text,
      power,
      printed_name,
      printed_text,
      printed_type_line,
      toughness,
      type_line,
      watermark,
    } = card_face;

    const name_simple = simplify(name);

    return {
      artist: coalesce(artist),
      color_indicator: coalesce(color_indicator, []),
      colors: coalesce(colors, ['C']),
      flavor_text: coalesce(flavor_text),
      image_uris: transform_scryfall_card_image_uris(image_uris || parent_image_uris),
      loyalty_numeric: to_numeric(loyalty),
      loyalty: coalesce(loyalty),
      mana_cost: coalesce(mana_cost),
      names: coalesce(name_simple?.split(' '), []),
      name: coalesce(name),
      name_simple: coalesce(name_simple),
      oracle_text: coalesce(oracle_text),
      power_numeric: to_numeric(power),
      power: coalesce(power),
      printed_name: coalesce(printed_name),
      printed_text: coalesce(printed_text),
      printed_type_line: coalesce(printed_type_line),
      printed_types: transform_type_line(printed_type_line),
      toughness_numeric: to_numeric(toughness),
      toughness: coalesce(toughness),
      type_line: coalesce(type_line),
      types: transform_type_line(type_line),
      watermark: coalesce(watermark),
    };
  });
}

/**
 * Transforms a ScryfallCardFace type_line or printed_type_line to an array of type values
 * @param type_line A string to transform
 */
function transform_type_line(type_line: string | undefined): string[] {
  return type_line?.split(' ').filter((type) => !/\W/i.test(type)) || [];
}

/**
 * Transforms a ScryfallCardImageUriMap to a P9MagicCardImageUriMap
 * @param image_uris A ScryfallCardImageUriMap to transform
 */
function transform_scryfall_card_image_uris(image_uris: ScryfallCardImageUriMap | undefined): P9MagicCardImageMap {
  return {
    art_crop: coalesce(image_uris?.art_crop),
    border_crop: coalesce(image_uris?.border_crop),
    large: coalesce(image_uris?.large),
    normal: coalesce(image_uris?.normal),
    png: coalesce(image_uris?.png),
    small: coalesce(image_uris?.small),
  };
}

/**
 * Transforms a ScryfallCardLegalityMap to a string[]
 * @param legalities The ScryfallCardLegalityMap to transform
 */
function transform_scryfall_card_legalities(legalities: ScryfallCardLegalityMap): string[] {
  return Object.entries(legalities).map((entry) => entry.join(':'));
}

/**
 * Transforms a ScryfallCardPreview to a P9MagicCardPreview
 * @param preview A ScryfallCardPreview to transform
 * @param released_at The fallback preview date value
 */
function transform_scryfall_card_preview(
  preview: ScryfallCardPreview | undefined,
  released_at: string,
): P9MagicCardPreview {
  return {
    date: coalesce(preview?.previewed_at, released_at),
    source: coalesce(preview?.source),
    source_uri: coalesce(preview?.source_uri),
  };
}

/**
 * Converts an arbitrary value to a number
 * @param value A value to convert
 */
function to_numeric(value: any) {
  try {
    const numeric_value = Number(value);

    if (isNaN(numeric_value)) {
      return null;
    }

    return numeric_value;
  } catch {
    return null;
  }
}

/**
 * Transforms a ScryfallCardPart[] to P9MagicCardPart[]
 * @param all_parts A ScryfallCardPart[] to transform
 */
function transform_scryfall_card_parts(all_parts: ScryfallCardPart[] | undefined): P9MagicCardPart[] {
  return (
    all_parts?.map((card_part) => ({
      card_id: card_part.id,
      component: card_part.component,
      name: card_part.name,
      type_line: card_part.type_line,
    })) || []
  );
}

export function extract_scryfall_cards(): Observable<ScryfallCard> {
  // return make_scryfall_request('https://api.scryfall.com/cards/search?order=set&q=e:isd&unique=prints');
  return defer(() =>
    fetch('https://c2.scryfall.com/file/scryfall-bulk/default-cards/default-cards-20210708210326.json', {
      headers: [
        ['content-type', 'application/json'],
        ['content-encoding', 'gzip'],
      ],
    }),
  ).pipe(
    mergeMap((res) =>
      defer(() => res.json()).pipe(
        mergeMap((body: ScryfallCard[]) => body.filter(({ type_line }) => !(type_line === 'Card'))),
      ),
    ),
  );
}
