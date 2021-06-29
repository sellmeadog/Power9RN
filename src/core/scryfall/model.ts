export interface ScryfallObject {
  object: string;
}

export interface ScryfallCatalog extends ScryfallObject {
  object: 'catalog';
  uri?: string;
  total_values?: number;
  data: string[];
}

export interface ScryfallObjectList<T extends ScryfallObject = ScryfallObject> extends ScryfallObject {
  has_more: boolean;
  next_page?: string;
  data: T[];
}

export interface ScryfallSet extends ScryfallObject {
  arena_code?: string;
  block_code?: string;
  block?: string;
  card_count: number;
  code: string;
  digital: boolean;
  foil_only: boolean;
  icon_svg_uri: string;
  id: string;
  mtgo_code?: string;
  name: string;
  nonfoil_only: boolean;
  parent_set_code?: string;
  printed_size?: number;
  released_at: string;
  scryfall_uri: string;
  search_uri: string;
  set_type: string;
  tcgplayer_id?: number;
  uri: string;
}

export interface ScryfallCard extends ScryfallObject, ScryfallCardFace {
  all_parts?: ScryfallCardPart[];
  arena_id?: number;
  artist_ids?: string[];
  booster?: boolean;
  border_color?: string;
  card_back_id?: string;
  card_faces?: ScryfallCardFace[];
  cardmarket_id?: number;
  cmc: number;
  collector_number?: string;
  color_identity?: string[];
  digital?: boolean;
  edhrec_rank?: number;
  foil?: boolean;
  frame_effects?: string[];
  frame?: string;
  full_art?: boolean;
  games: string[];
  highres_image?: boolean;
  id: string;
  keywords?: string[];
  lang: string;
  layout: string;
  legalities: ScryfallCardLegalityMap;
  mtgo_id?: number;
  mtgo_foil_id?: number;
  multiverse_ids: number[];
  name: string;
  nonfoil?: boolean;
  oracle_id: string;
  oversized?: boolean;
  preview?: ScryfallCardPreview;
  prices?: ScryfallCardPriceMap;
  prints_search_uri?: string;
  produced_mana?: string[];
  promo_types?: string[];
  promo?: boolean;
  purchase_uris?: ScryfallCardPurchaseUriMap;
  rarity?: string;
  related_uris?: ScryfallCardRelatedUriMap;
  released_at: string;
  reprint?: boolean;
  reserved?: boolean;
  rulings_uri?: string;
  scryfall_set_uri?: string;
  scryfall_uri: string;
  set_name: string;
  set_search_uri?: string;
  set_type?: string;
  set_uri?: string;
  set: string;
  story_spotlight?: boolean;
  tcgplayer_id?: number;
  textless?: boolean;
  uri: string;
  variation?: boolean;
  variation_of?: string;
}

export interface ScryfallCardImageUriMap {
  art_crop?: string;
  border_crop?: string;
  large?: string;
  normal?: string;
  png?: string;
  small?: string;
}

export interface ScryfallCardLegalityMap {
  [key: string]: string;
}

export interface ScryfallCardPreview {
  previewed_at?: string;
  source_uri?: string;
  source?: string;
}

export interface ScryfallCardPriceMap {
  usd: string;
  usd_foil: string;
  eur: string;
  eur_foil: string;
  tix?: string;
}

export interface ScryfallCardRelatedUriMap {
  gatherer: string;
  tcgplayer_decks: string;
  edhrec: string;
  mtgtop8: string;
}

export interface ScryfallCardPurchaseUriMap {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}

export interface ScryfallCardPart extends ScryfallObject {
  component: string;
  id: string;
  name: string;
  type_line: string;
  uri: string;
}

export interface ScryfallCardFace extends ScryfallObject {
  artist_id?: string;
  artist?: string;
  color_indicator?: string[];
  colors?: string[];
  flavor_text?: string;
  illustration_id?: string;
  image_uris: ScryfallCardImageUriMap;
  loyalty?: string;
  mana_cost?: string;
  name: string;
  oracle_text?: string;
  power?: string;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  toughness?: string;
  type_line: string;
  watermark?: string;
}

export type ScryfallRulingSource = 'wotc' | 'scryfall' | string;

export interface ScryfallRuling extends ScryfallObject {
  oracle_id: string;
  source: ScryfallRulingSource;
  published_at: Date;
  comment: string;
}

export type ScryfallRulingList = ScryfallObjectList<ScryfallRuling>;
export type ScryfallSetList = ScryfallObjectList<ScryfallSet>;
export type ScryfallCardList = ScryfallObjectList<ScryfallCard>;
