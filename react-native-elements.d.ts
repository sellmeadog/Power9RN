import { DefaultNavigatorOptions } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { TextInputProps } from 'react-native';

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
    StackNavigator: Partial<DefaultNavigatorOptions<StackNavigationOptions>>;
    TextInput: Partial<TextInputProps>;
    TextCaption: Partial<TextProps>;
    TextTitle: Partial<TextProps>;
    TextFootnote: Partial<TextProps>;
  }
}
