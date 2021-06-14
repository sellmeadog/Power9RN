import React, { FunctionComponent, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeSafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePower9Theme } from '../../core/theme';

export interface P9ViewSurfaceProps extends NativeSafeAreaViewProps {}

export const P9ViewSurface: FunctionComponent<P9ViewSurfaceProps> = ({
  children,
  edges = ['bottom'],
  style,
  ...rest
}) => {
  const [{ colors }] = usePower9Theme();
  const insets = useSafeAreaInsets();

  const safeAreaStyle: StyleProp<ViewStyle> = useMemo(() => {
    let paddingBottom: number | undefined;
    let paddingTop: number | undefined;

    if (edges?.includes('bottom')) {
      paddingBottom = insets.bottom;
    }

    if (edges?.includes('top')) {
      paddingTop = insets.top;
    }

    return { paddingBottom, paddingTop };
  }, [edges, insets]);

  return (
    <Animated.View style={[{ backgroundColor: colors?.background }, style, safeAreaStyle]} {...rest}>
      {children}
    </Animated.View>
  );
};
