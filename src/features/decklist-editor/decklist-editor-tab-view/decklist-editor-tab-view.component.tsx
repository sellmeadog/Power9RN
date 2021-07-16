import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';

import { P9DecklistEntryType } from '../../../core/data-user';
import { P9DecklistEditorEntry } from '../../decklist-explorer/state/decklist-feature.model';
import { P9DecklistEditorEntryExplorer } from '../decklist-editor-entry-explorer/decklist-editor-entry-explorer.component';
import { P9DecklistEditorTabBar } from './decklist-editor-tab-bar.component';
import { P9DecklistEditorRoute } from './decklist-editor-tab-view.types';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const INITIAL_LAYOUT = { width: SCREEN_WIDTH };

type P9RenderSceneFn = (props: SceneRendererProps & { route: P9DecklistEditorRoute }) => React.ReactNode;
type P9RenderTabBarFn = (
  props: SceneRendererProps & { navigationState: NavigationState<P9DecklistEditorRoute> },
) => React.ReactNode;

const DECKLIST_ENTRY_TYPES: P9DecklistEntryType[] = ['maindeck', 'sideboard'];

export interface P9DecklistEditorTabViewProps {
  activeEntryType: P9DecklistEntryType;
  onActiveEntryTypeChange?(value: P9DecklistEntryType): void;
  onPress?(entry: P9DecklistEditorEntry): void;
}

const TABVIEW_ROUTES: P9DecklistEditorRoute[] = [
  { key: 'maindeck', title: 'Maindeck' },
  { key: 'sideboard', title: 'Sideboard' },
];

export const P9DecklistEditorTabView: FunctionComponent<P9DecklistEditorTabViewProps> = ({
  activeEntryType,
  onActiveEntryTypeChange,
  onPress,
}) => {
  const navigationState = useMemo(
    () => ({
      index: DECKLIST_ENTRY_TYPES.indexOf(activeEntryType),
      routes: TABVIEW_ROUTES,
    }),
    [activeEntryType],
  );

  const handleIndexChange = (index: number) => {
    onActiveEntryTypeChange?.(DECKLIST_ENTRY_TYPES[index]);
  };

  const renderScene = useCallback<P9RenderSceneFn>(
    ({ route }) => <P9DecklistEditorEntryExplorer entryType={route.key} onPress={onPress} />,
    [onPress],
  );

  const renderTabBar = useCallback<P9RenderTabBarFn>((props) => <P9DecklistEditorTabBar {...props} />, []);

  return (
    <>
      <TabView
        navigationState={navigationState}
        initialLayout={INITIAL_LAYOUT}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
    </>
  );
};
