import { StyleSheet } from 'react-native';
import { FullTheme } from 'react-native-elements';

import { P9_COLORS_DARK as colors } from '../../assets';

export const P9_THEME_DARK: Partial<FullTheme> = {
  colors,

  Avatar: {
    containerStyle: {
      backgroundColor: colors.backgroundInput,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth,
    },
    iconStyle: [{ color: colors.primary }],
    rounded: true,
    titleStyle: [
      {
        color: colors.primary,
      },
    ],
  },

  BottomSheetTextInput: {
    autoCorrect: false,
    placeholderTextColor: colors.placeholder,
    style: [
      {
        color: colors.white,
        fontSize: 17,
        minHeight: 44,
      },
    ],
  },

  ButtonGroup: {
    activeOpacity: 0.9,
    buttonStyle: [{ backgroundColor: colors.grey2 }],
    containerStyle: [
      { borderColor: colors.border, borderRadius: 16, flex: 1, height: 32, marginLeft: 10, marginRight: 10 },
    ],
    selectedButtonStyle: [{ backgroundColor: colors.grey0 }],
    selectedTextStyle: [{ color: colors.primary, fontWeight: '600' }],
    textStyle: [{ color: colors.white, fontWeight: '600' }],
  },

  Header: {
    backgroundColor: colors.background,
    statusBarProps: { animated: true, barStyle: 'light-content' },
    centerComponent: {
      style: [{ color: colors?.white, fontFamily: 'Beleren2016-Bold', fontSize: 19, fontWeight: 'bold' }],
    },
    leftContainerStyle: [
      {
        minHeight: 24,
        justifyContent: 'center',
      },
    ],
    centerContainerStyle: [
      {
        minHeight: 24,
        justifyContent: 'center',
      },
    ],
    rightContainerStyle: [
      {
        minHeight: 24,
        justifyContent: 'center',
      },
    ],
    containerStyle: [
      {
        borderBottomColor: colors.background,
      },
    ],
    rightComponent: { style: [{ fontSize: 17, color: colors.primary }] },
    leftComponent: { style: [{ fontSize: 17, color: colors.primary }] },
  },

  Icon: {
    color: colors.primary,
    size: 19,
  },

  Input: {
    labelStyle: {
      color: colors.grey5,
      fontWeight: '500',
    },
    inputStyle: {
      color: colors.white,
    },
  },

  StackNavigator: {
    screenOptions: {
      cardStyle: [
        {
          backgroundColor: colors.background,
        },
      ],
    },
  },

  Text: {
    adjustsFontSizeToFit: true,
    allowFontScaling: false,
    minimumFontScale: 0.9,
    style: [
      {
        color: colors.white,
        fontSize: 17,
      },
    ],
  },

  TextCaption: {
    style: [{ color: colors.grey5, fontSize: 13, fontWeight: '600' }],
  },

  TextTitle: {
    style: [{ color: colors?.white, fontFamily: 'Beleren2016SmallCaps-Bold', fontSize: 17, fontWeight: 'bold' }],
  },

  TextFootnote: {
    style: [{ color: colors?.grey5, fontSize: 11, fontWeight: 'normal' }],
  },

  TextInput: {
    autoCorrect: false,
    placeholderTextColor: colors.placeholder,
    style: [
      {
        color: colors.white,
        fontSize: 17,
        minHeight: 44,
      },
    ],
  },
};
