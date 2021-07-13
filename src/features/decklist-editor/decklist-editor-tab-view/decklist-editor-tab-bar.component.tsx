import React, { FunctionComponent } from 'react';
import { TabBar, TabBarProps } from 'react-native-tab-view';

import { usePower9Theme } from '../../../core/theme';
import { P9DecklistEditorTabViewTheme } from './decklist-editor-tab-view.theme';
import { P9DecklistEditorRoute } from './decklist-editor-tab-view.types';

export interface P9DecklistEditorTabBarProps
  extends Omit<
    TabBarProps<P9DecklistEditorRoute>,
    'getLabelText' | 'getAccessible' | 'getAccessibilityLabel' | 'getTestID' | 'renderIndicator'
  > {}

export const P9DecklistEditorTabBar: FunctionComponent<P9DecklistEditorTabBarProps> = ({
  navigationState,
  ...rest
}) => {
  const [{ colors }] = usePower9Theme();
  // const placeholder = useMemo(() => (navigationState.index === 0 ? 'main deck' : 'sideboard'), [navigationState]);

  return (
    <>
      <TabBar
        activeColor={colors?.warning}
        navigationState={navigationState}
        inactiveColor={colors?.grey5}
        indicatorStyle={{ backgroundColor: colors?.warning }}
        labelStyle={P9DecklistEditorTabViewTheme.tabBarItemLabel}
        style={[P9DecklistEditorTabViewTheme.tabBar, { backgroundColor: colors?.grey2 }]}
        tabStyle={P9DecklistEditorTabViewTheme.tabBarItem}
        {...rest}
      />
      {/* <P9SearchBar containerStyle={{ paddingLeft: 5, paddingRight: 10 }} placeholder={`Add cards to ${placeholder}`} /> */}
      {/* <P9MagicCardSearchResultPanel canExpand={!!keyword?.length} /> */}
    </>
  );
};
