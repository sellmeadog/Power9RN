import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { distinctUntilChanged } from 'rxjs/operators';

import { P9DocumentInfo } from '../../core/data-user';
import { useDocumentPicker } from '../../core/device';
import { whenDefined } from '../../core/operators';
import { P9TableViewItem } from './table-view-item.component';

export interface P9TableViewDocumentPickerItemProps {
  onPress?(): void;
  onDocumentContent?(content: string): void;
  onDocumentSelected?(documentInfo: P9DocumentInfo): void;
}

export const P9TableViewDocumentPickerItem: FunctionComponent<P9TableViewDocumentPickerItemProps> = ({
  onDocumentSelected,
}) => {
  const [documentInfo, pickDocumentAsync] = useDocumentPicker();

  useSubscription(
    useObservable((document$) => document$.pipe(pluckFirst, whenDefined(), distinctUntilChanged()), [documentInfo]),
    (document) => onDocumentSelected?.(document),
  );

  return (
    <P9TableViewItem onPress={() => pickDocumentAsync()}>
      <Text style={[P9TableViewDocumentPickerItemTheme.container, P9TableViewDocumentPickerItemTheme.title]}>
        Import a File
      </Text>
      <Icon name={'file-download'} size={20} containerStyle={[P9TableViewDocumentPickerItemTheme.container]} />
    </P9TableViewItem>
  );
};

const P9TableViewDocumentPickerItemTheme = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 15,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
  },
});
