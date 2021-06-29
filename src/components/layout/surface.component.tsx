import React, { FunctionComponent, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeSafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePower9Theme } from '../../core/theme';

export interface P9ViewSurfaceProps extends NativeSafeAreaViewProps {
  containerStyle?: StyleProp<ViewStyle>;
  paddingBottom?: number;
  paddingHorizontal?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingVertical?: number;
}

export const P9ViewSurface: FunctionComponent<P9ViewSurfaceProps> = ({
  children,
  containerStyle,
  edges,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  style,
  ...rest
}) => {
  const [{ colors }] = usePower9Theme();
  const insets = useSafeAreaInsets();

  const safeAreaStyle: StyleProp<ViewStyle> = useMemo(() => {
    let paddingBottom_: number | undefined;
    let paddingTop_: number | undefined;

    if (edges?.includes('bottom')) {
      paddingBottom_ = insets.bottom;
    }

    if (edges?.includes('top')) {
      paddingTop_ = insets.top;
    }

    return { paddingBottom: paddingBottom_, paddingTop: paddingTop_ };
  }, [edges, insets]);

  const containerStyle_: StyleProp<ViewStyle> = useMemo(() => {
    return {
      paddingBottom,
      paddingHorizontal,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingVertical,
    };
  }, [paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical]);

  return (
    <Animated.View style={[{ backgroundColor: colors?.background }, style, safeAreaStyle]} {...rest}>
      <View style={[containerStyle_, containerStyle]}>{children}</View>
    </Animated.View>
  );
};
