import { Route } from 'react-native-tab-view';

import { P9DecklistEntryType } from '../../../core/data-user';

export interface P9DecklistEditorRoute extends Route {
  key: P9DecklistEntryType;
}
