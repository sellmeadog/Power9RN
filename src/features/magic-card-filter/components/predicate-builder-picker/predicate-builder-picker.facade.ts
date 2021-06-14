import { useObservableState } from 'observable-hooks';
import { useCallback } from 'react';

import { useDependency } from '../../../../core/di';
import { P9PickerPredicateExpression, P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterQuery } from '../../state/magic-card-filter.query';
import { P9MagicCardFilterStore } from '../../state/magic-card-filter.store';

// export interface P9PickerPredicateExpression {
//   [key: string]: boolean;
// }

export function usePickerPredicateBuilder(
  attribute: 'card_faces.artist',
): [
  predicate: P9Predicate<P9PickerPredicateExpression> | undefined,
  update: (draft: Partial<P9PickerPredicateExpression>) => void,
  reset: () => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const [predicate] = useObservableState(
    () => query.pickerExpression(attribute),
    () =>
      ({
        attribute,
        expression: {},
        id: attribute,
      } as P9Predicate<P9PickerPredicateExpression>),
  );

  const update = useCallback(
    (expression: Partial<P9PickerPredicateExpression>) =>
      //@ts-ignore
      store.upsert(
        attribute,
        //@ts-ignore
        (state) => ({ ...state, expression: { ...state.expression, ...expression } }),
        (id, state) => ({ attribute, id, ...state }),
      ),
    [attribute, store],
  );

  const reset = useCallback(() => store.remove(attribute), [attribute, store]);

  return [predicate, update, reset];
}
