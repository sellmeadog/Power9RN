import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { P9ItemSeparator } from '../separator/item-separator.component';

export interface P9TableViewTextItemProps {
  edges?: readonly Edge[];
  text: string[];
}

export const P9TableViewTextItem: FunctionComponent<P9TableViewTextItemProps> = ({ edges, text }) => {
  const Container = edges ? SafeAreaView : View;

  return (
    <>
      <P9ItemSeparator marginLeft={0} />
      <Container edges={edges} style={[P9TableViewTextItemTheme.container]}>
        {text?.map((text_, index) => (
          <Text key={index} style={[P9TableViewTextItemTheme.paragraph]}>
            {text_}
          </Text>
        ))}
      </Container>
    </>
  );
};

const P9TableViewTextItemTheme = StyleSheet.create({
  container: {
    paddingTop: 10,
  },

  contentContainer: {
    flexDirection: 'column',
  },

  paragraph: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
