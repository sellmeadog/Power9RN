import { useObservable, useObservableState } from 'observable-hooks';
import React, { FunctionComponent } from 'react';
// import { StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { combineLatest } from 'rxjs';

import { useNavigation } from '@react-navigation/core';

import { P9UserDecklist } from '../../../../core/data-user';
import { useDependency } from '../../../../core/di';
import { P9DecklistExplorerQuery } from '../../state/decklist-explorer.query';
import { P9GameFormatType } from '../../state/decklist-feature.model';
import { P9DecklistExplorerSection } from '../decklist-explorer/decklist-explorer-section.component';

export interface P9UserDecklistExplorerSectionScreenProps {}

export const P9UserDecklistExplorerSectionScreen: FunctionComponent<P9UserDecklistExplorerSectionScreenProps> = () => {
  const { goBack } = useNavigation();
  const [{ activeType, data }] = useUserDecklistExplorerSectionFacade();

  return (
    <>
      <Header
        leftComponent={{ icon: 'arrow-back-ios', onPress: goBack, size: 24 }}
        centerComponent={{ text: `${activeType} Decks` }}
      />
      <P9DecklistExplorerSection data={data} horizontal={false} initialNumToRender={5} windowSize={3} />
    </>
  );
};

// const P9UserDecklistExplorerSectionScreenTheme = StyleSheet.create({});

function useUserDecklistExplorerSectionFacade(): [
  state: { activeType: P9GameFormatType | undefined; data: P9UserDecklist[] },
] {
  const query = useDependency(P9DecklistExplorerQuery);

  return [
    useObservableState(
      useObservable(() =>
        combineLatest({ activeType: query.activeDecklistSection$, data: query.activeDecklistSectionData$ }),
      ),
      { activeType: 'casual', data: [] as P9UserDecklist[] },
    ),
  ];
}
