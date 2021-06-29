import { useObservableState } from 'observable-hooks';
import React, { FunctionComponent, useCallback } from 'react';
import { SvgXml } from 'react-native-svg';
import { defer, of } from 'rxjs';
import { catchError, distinctUntilChanged, mergeMap, retry } from 'rxjs/operators';

import { useFocusEffect } from '@react-navigation/core';

import { usePower9Theme } from '../../core/theme';

export interface P9MagicSetSymbolProps {
  sourceUri?: string;
}

export const P9MagicSetSymbol: FunctionComponent<P9MagicSetSymbolProps> = ({ sourceUri }) => {
  const [xml, setXml] = useObservableState((input$) => input$.pipe(distinctUntilChanged()), null as string | null);
  const [{ colors }] = usePower9Theme();

  useFocusEffect(
    useCallback(() => {
      if (sourceUri) {
        const subscription = defer(() => fetch(sourceUri))
          .pipe(
            retry(3),
            mergeMap((res) => res.text()),
            catchError(() =>
              defer(() => fetch('https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1608526800')).pipe(
                retry(3),
                mergeMap((res) => res.text()),
                catchError(() => of(null)),
              ),
            ),
          )
          .subscribe(setXml);

        return () => subscription.unsubscribe();
      }
    }, [sourceUri, setXml]),
  );

  return <SvgXml fill={colors?.grey5} stroke={colors?.border} height={44} width={44} xml={xml} />;
};
