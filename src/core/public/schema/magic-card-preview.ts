import { ObjectSchema } from 'realm';

export interface P9MagicCardPreview {
  previewed_at: string | null;
  source_uri: string | null;
  source: string | null;
}

export const P9MagicCardPreviewSchema: ObjectSchema = {
  name: 'MagicCardPreview',
  embedded: true,
  properties: {
    previewed_at: 'string?',
    source_uri: 'string?',
    source: 'string?',
  },
};
