import React, { FunctionComponent } from 'react';
import { Path, Svg } from 'react-native-svg';

import { usePower9Theme } from '../../core/theme';

export interface P9ArtistNibProps {
  size?: number;
}

export const P9ArtistNib: FunctionComponent<P9ArtistNibProps> = ({ size = 32 }) => {
  const [{ colors }] = usePower9Theme();

  return (
    <Svg width={size} height={size} viewBox={'0 0 32 32'}>
      <Path
        fill={colors?.grey4}
        d={
          'M14.411 6.677c0.789 0.077 0.452 0.027 1.013 0.124 6.399 1.064 11.598 5.328 16.563 9.204-5.174 4.030-10.647 8.705-17.449 9.277-3.514 0.403-6.577-2.152-7.673-5.352-1.548 2.434-4.167 4.008-6.851 4.927v-17.536c2.773 0.54 4.941 2.55 6.956 4.388 1.036-2.554 3.352-4.568 6.117-4.968 0.589-0.085 0.73-0.064 1.325-0.064zM13.858 7.87c-3.869 0.16-5.793 4.238-6.357 7.596 3.030-2.281 6.835-0.999 9.954 0.395 3.933 1.918 8.511 1.282 12.501-0.097-4.779-3.256-9.688-6.899-15.523-7.874-0.321-0.022-0.129-0.012-0.574-0.020z'
        }
      />
    </Svg>
  );
};
