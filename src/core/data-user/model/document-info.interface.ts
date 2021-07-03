import { DocumentPickerResponse } from 'react-native-document-picker';

export type P9DocumentContent = Promise<string>;

export interface P9DocumentInfo extends Pick<DocumentPickerResponse, 'name' | 'type' | 'uri'> {
  content: P9DocumentContent;
}
