import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePower9Theme } from '../../../core/theme';
import { useNavigationService } from '../../navigation';

export interface P9DecklistEditorToolbarProps {}

export const P9DecklistEditorToolbar: FunctionComponent<P9DecklistEditorToolbarProps> = () => {
  const [{ colors }] = usePower9Theme();
  const [{ openDecklistSettings, openDecklistSimulator }] = useNavigationService();

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        P9DecklistEditorToolbarTheme.container,
        { backgroundColor: colors?.grey2, borderTopColor: colors?.grey0 },
      ]}
    >
      <View style={[P9DecklistEditorToolbarTheme.iconContainerRow]}>
        <Icon
          name={'cog-outline'}
          size={24}
          onPress={openDecklistSettings}
          containerStyle={[P9DecklistEditorToolbarTheme.iconContainer]}
          type={'material-community'}
        />
        <Icon
          name={'test-tube'}
          size={24}
          onPress={openDecklistSimulator}
          containerStyle={[P9DecklistEditorToolbarTheme.iconContainer]}
          type={'material-community'}
        />
      </View>
    </SafeAreaView>
  );
};

const P9DecklistEditorToolbarTheme = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },

  iconContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconContainer: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
