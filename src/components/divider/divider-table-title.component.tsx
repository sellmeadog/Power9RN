import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TextProps } from 'react-native-elements';

import { P9ViewSurface, P9ViewSurfaceProps } from '../layout/surface.component';
import { P9ItemSeparator, P9ItemSeparatorProps } from '../separator/item-separator.component';
import { P9TitleText } from '../text/text.component';

export interface P9TableTitleDividerProps {
  title?: string;
  separatorProps?: P9ItemSeparatorProps;
  surfaceProps?: P9ViewSurfaceProps;
  textProps?: TextProps;
}

export const P9TableTitleDivider: FunctionComponent<P9TableTitleDividerProps> = ({
  children,
  title,
  separatorProps,
  surfaceProps,
  textProps,
}) => {
  const separatorStyle: StyleProp<ViewStyle> = [
    { position: 'absolute', left: 0, top: 24, right: 10 },
    separatorProps?.style,
  ];

  const surfaceStyle: StyleProp<ViewStyle> = [
    { alignItems: 'center', justifyContent: 'center', height: 48 },
    surfaceProps?.style,
  ];

  return (
    <P9ViewSurface {...surfaceProps} containerStyle={[surfaceStyle]}>
      <P9ItemSeparator {...separatorProps} style={[P9TableSectionSeparatorTheme.separator, separatorStyle]} />
      <P9ViewSurface {...surfaceProps} style={[P9TableSectionSeparatorTheme.surface]}>
        {title || children ? <P9TitleText {...textProps}>{title || children}</P9TitleText> : null}
      </P9ViewSurface>
    </P9ViewSurface>
  );
};

const P9TableSectionSeparatorTheme = StyleSheet.create({
  separator: {
    marginLeft: 0,
    marginRight: 0,
  },

  surface: {
    paddingHorizontal: 10,
  },
});
