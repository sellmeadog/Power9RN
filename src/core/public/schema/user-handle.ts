export interface P9UserHandle {
  _id: string;
  _partition: 'PUBLIC';
  _owner: string;
  handle: string;
  picture_url?: string;
}

export const P9UserHandleSchema: Realm.ObjectSchema = {
  name: 'UserHandle',
  properties: {
    _id: 'string',
    _partition: 'string',
    _owner: 'string',
    handle: 'string',
    picture_url: 'string?',
  },
  primaryKey: '_id',
};
