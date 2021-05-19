import { StyleSheet } from 'react-native';
import { Theme } from 'react-native-elements';

import { P9_COLORS_LIGHT as colors } from '../../assets';

export const P9_THEME_LIGHT: Theme = {
  colors,

  Avatar: {
    containerStyle: {
      backgroundColor: colors.backgroundInput,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth,
    },
    iconStyle: { color: colors.primary },
    rounded: true,
    titleStyle: {
      color: colors.primary,
    },
  },

  Header: {
    backgroundColor: colors.background,
    statusBarProps: { animated: true, barStyle: 'dark-content' },
    centerComponent: {
      style: [{ fontFamily: 'Beleren2016-Bold', fontSize: 19, fontWeight: 'bold' }],
    },
    containerStyle: {
      borderBottomColor: colors.background,
    },
  },

  Icon: {
    color: colors.primary,
    size: 19,
  },

  StackNavigator: {
    screenOptions: {
      cardStyle: {
        backgroundColor: colors.background,
      },
    },
  },

  Text: {
    style: {
      color: colors.black,
      fontSize: 17,
    },
  },

  TextInput: {
    autoCorrect: false,
    placeholderTextColor: colors?.placeholder,
    style: [
      {
        color: colors.black,
        fontSize: 17,
      },
    ],
  },
};
