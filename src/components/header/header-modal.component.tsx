import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Header, HeaderProps } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

export interface P9ModalHeaderProps extends HeaderProps {
  cancelButtonIcon?: string;
  cancelButtonIconType?: 'material' | 'material-community';
  cancelButtonTitle?: string;
}

export const P9ModalHeader: FunctionComponent<P9ModalHeaderProps> = ({
  cancelButtonIcon,
  cancelButtonIconType = 'material',
  cancelButtonTitle = 'Cancel',
  containerStyle,
  leftComponent,
  ...rest
}) => {
  const { goBack } = useNavigation();

  return (
    <Header
      containerStyle={[P9ModalHeaderTheme.container, containerStyle]}
      leftComponent={
        leftComponent ?? {
          icon: cancelButtonIcon,
          onPress: goBack,
          size: 24,
          text: cancelButtonIcon ? undefined : cancelButtonTitle,
          type: cancelButtonIconType,
        }
      }
      {...rest}
    />
  );
};

const P9ModalHeaderTheme = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 2,
  },
});
