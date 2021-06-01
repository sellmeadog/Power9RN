import React, { FunctionComponent, useMemo } from 'react';
import { Icon } from 'react-native-elements';

import { P9MagicCardImageTheme } from './magic-card-image.theme';

export const P9MagicCardImagePlaceholder: FunctionComponent<{ hasError: boolean }> = ({ hasError }) => {
  const iconName = useMemo(() => (hasError ? 'broken-image' : 'image'), [hasError]);

  return <Icon name={iconName} size={96} containerStyle={P9MagicCardImageTheme.placeholderContainerStyle} />;
};
