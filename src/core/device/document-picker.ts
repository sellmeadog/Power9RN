import { useState } from 'react';
import { Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export type P9DocumentContent = Promise<string>;

export interface P9DocumentInfo extends Pick<DocumentPickerResponse, 'name' | 'type' | 'uri'> {
  content: P9DocumentContent;
}
/**
 * A hook that returns the content of a document picked from the device.
 *
 * @returns An an object that contains the document content as a string and a function to initiate the document picker
 * workflow. Note that `documentInfo` will only be set if a `callback` is NOT provided to the hook.
 */
export const useDocumentPicker = (
  callback?: (documentInfo: P9DocumentInfo) => void,
): [documentInfo: P9DocumentInfo | undefined, pickDocumentAsync: () => Promise<boolean>] => {
  const [documentInfo, setDocumentInfo] = useState<P9DocumentInfo>();

  async function pickDocumentAsync() {
    try {
      const { name, type, uri } = await DocumentPicker.pick({ type: ['public.plain-text'] });
      const [_, inbox] = uri.split('/').reverse();

      const documentPickerResponse: P9DocumentInfo = {
        name,
        type,
        uri,
        content: RNFS.readFile([RNFS.TemporaryDirectoryPath, inbox, name].join('/')).then((content) =>
          content.replace(/\r?\n/g, '\n'),
        ),
      };

      setDocumentInfo(documentPickerResponse);
      callback?.(documentPickerResponse);
      return true;
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Document Error', 'An error occurred in the document picker. Please try again.');
      }
      return false;
    }
  }

  return [documentInfo, pickDocumentAsync];
};
