import { TextInputProps } from 'react-native';
import { TextProps } from 'react-native-elements';

import { BottomSheetTextInputProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import { DefaultNavigatorOptions } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module 'react-native-elements' {
  export interface Colors {
    background: string;
    backgroundInput: string;
    border: string;
    card: string;
    placeholder: string;
    teal: string;
    text: string;
  }

  export interface FullTheme {
    colors: RecursivePartial<Colors>;
    BottomSheetTextInput: Partial<BottomSheetTextInputProps>;
    StackNavigator: Partial<DefaultNavigatorOptions<StackNavigationOptions>>;
    TextCaption: Partial<TextProps>;
    TextFootnote: Partial<TextProps>;
    TextInput: Partial<TextInputProps>;
    TextTitle: Partial<TextProps>;
    TextTitleLarge: Partial<TextProps>;
  }
}
