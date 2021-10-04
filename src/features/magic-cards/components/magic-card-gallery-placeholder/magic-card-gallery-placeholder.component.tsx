import React, { FunctionComponent, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { P9MagicCardImage } from '../..';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardGalleryPlaceholderProps {
  loading: boolean;
}

export const P9MagicCardGalleryPlaceholder: FunctionComponent<P9MagicCardGalleryPlaceholderProps> = ({ loading }) => {
  const [{ colors }] = usePower9Theme();
  const { width } = useWindowDimensions();
  const itemWidth = useMemo(() => width / 2 - 5, [width]);

  if (!loading) {
    return null;
  }

  return (
    <SkeletonPlaceholder backgroundColor={colors?.grey3} highlightColor={colors?.grey4} speed={900}>
      <SkeletonPlaceholder.Item
        flexDirection={'row'}
        flexGrow={1}
        flexWrap={'wrap'}
        paddingHorizontal={5}
        paddingTop={10}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <SkeletonPlaceholder.Item key={index} paddingHorizontal={5} paddingBottom={10} width={itemWidth}>
            <SkeletonPlaceholder.Item
              aspectRatio={P9MagicCardImage.ASPECT_RATIO}
              borderRadius={10}
              elevation={8}
              shadowColor={colors?.primary}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={1}
              shadowRadius={4.65}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
