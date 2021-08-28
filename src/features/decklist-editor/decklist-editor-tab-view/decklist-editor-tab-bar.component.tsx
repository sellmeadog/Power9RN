import React, { FunctionComponent } from 'react';
import { Circle as ProgressCircle } from 'react-native-progress';
import { TabBar, TabBarProps } from 'react-native-tab-view';

import { usePower9Theme } from '../../../core/theme';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';
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
  const [{ entryCounts = {} }] = useDecklistEditorFacade();

  return (
    <TabBar
      activeColor={colors?.warning}
      navigationState={navigationState}
      inactiveColor={colors?.grey5}
      indicatorStyle={{ backgroundColor: colors?.warning }}
      labelStyle={P9DecklistEditorTabViewTheme.tabBarItemLabel}
      style={[P9DecklistEditorTabViewTheme.tabBar, { backgroundColor: colors?.grey2 }]}
      tabStyle={P9DecklistEditorTabViewTheme.tabBarItem}
      renderIcon={({ color, route: { key } }) => {
        const count = entryCounts[key] ?? 0;
        const progress = count / (key === 'maindeck' ? 60 : 15);

        return (
          <ProgressCircle
            animated
            borderWidth={0}
            color={color}
            formatText={() => count}
            progress={progress}
            showsText
            size={24}
            strokeCap={'round'}
            textStyle={P9DecklistEditorTabViewTheme.tabBarItemCount}
          />
        );
      }}
      {...rest}
    />
  );
};
