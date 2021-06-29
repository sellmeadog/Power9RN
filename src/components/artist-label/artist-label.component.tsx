import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { P9ArtistNib } from '../svg/artist-nib.component';
import { P9CaptionText } from '../text/text.component';

export interface P9ArtistLabelProps {
  artist?: string;
}

export const P9ArtistLabel: FunctionComponent<P9ArtistLabelProps> = ({ artist }) => {
  return (
    <View style={P9ArtistLabelTheme.container}>
      <P9ArtistNib size={15} />
      <P9CaptionText style={[P9ArtistLabelTheme.caption]}>{artist}</P9CaptionText>
    </View>
  );
};

const P9ArtistLabelTheme = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  caption: {
    paddingHorizontal: 4,
  },
});
