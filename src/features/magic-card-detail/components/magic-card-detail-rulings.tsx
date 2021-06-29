import { useObservable, useObservableState } from 'observable-hooks';
import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { defer, of } from 'rxjs';
import { map, mergeMap, retry, switchMap } from 'rxjs/operators';

import {
  P9CaptionText,
  P9EmptyListItem,
  P9ItemSeparator,
  P9ListItem,
  P9TableTitleDivider,
  P9ViewSurface,
} from '../../../components';
import { ScryfallRuling, ScryfallRulingList, ScryfallRulingSource } from '../../../core/scryfall/model';
import { P9MagicCardText } from '../../magic-cards';

export interface P9MagicCardDetailRulingProps {
  rulings_uri?: string;
}

export const P9MagicCardDetailRuling: FunctionComponent<P9MagicCardDetailRulingProps> = ({ rulings_uri }) => {
  const response = useObservableState(
    useObservable((rulings_uri$) => rulings_uri$.pipe(switchMap(([uri]) => fetchRulings(uri))), [rulings_uri]),
    <P9EmptyListItem message={'No Rulings Available'} />,
  );

  return (
    <P9ViewSurface>
      <P9TableTitleDivider>{'Rulings'}</P9TableTitleDivider>
      {response}
    </P9ViewSurface>
  );
};

const emptyNode = <P9EmptyListItem message={'No Rulings Available'} />;

function fetchRulings(uri: string | undefined) {
  return uri
    ? defer(() => fetch(uri)).pipe(
        retry(3),
        mergeMap((res): Promise<ScryfallRulingList> => res.json()),
        map(({ data }) => {
          if (data.length) {
            return data.map(renderRuling);
          } else {
            return emptyNode;
          }
        }),
      )
    : of(emptyNode);
}

function parseScryfallRulingSource(source: ScryfallRulingSource) {
  if (source === 'wotc') {
    return 'Gatherer';
  }

  return 'Scrfyall';
}

function renderRuling(item: ScryfallRuling, index: number, { length }: Array<ScryfallRuling>) {
  const end = index === length - 1;

  return (
    <React.Fragment key={`magic_card_ruling_${index}`}>
      <P9ListItem style={[P9MagicCardDetailRulingTheme.rulingContainer]}>
        <P9MagicCardText>{item.comment}</P9MagicCardText>
        <P9CaptionText>
          {parseScryfallRulingSource(item.source)} {'\u2022'} {item.published_at}
        </P9CaptionText>
      </P9ListItem>
      {end ? undefined : <P9ItemSeparator marginTop={12} marginBottom={12} />}
    </React.Fragment>
  );
}

const P9MagicCardDetailRulingTheme = StyleSheet.create({
  rulingContainer: {
    paddingVertical: 0,
  },
});
