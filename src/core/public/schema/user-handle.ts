export interface P9UserHandle {
  _id: string;
  _partition: 'PUBLIC';
  _owner: string;
  handle: string;
}

export const P9UserHandleSchema: Realm.ObjectSchema = {
  name: 'user_handles',
  properties: {
    _id: 'string',
    _partition: 'string',
    _owner: 'string',
    handle: 'string',
  },
  primaryKey: '_id',
};
