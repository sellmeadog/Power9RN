import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { P9PredicateBase, P9PredicateBaseOptions, P9PredicateState } from './predicate-base';
import { P9PredicateScalar } from './predicate-scalar';

export interface P9PredicateArrayState<S extends P9PredicateState> {
  ids: string[];
  predicates: { [id: string]: P9PredicateScalar<S> };
}

export interface P9PredicateArrayOptions<S extends P9PredicateState>
  extends P9PredicateBaseOptions<P9PredicateArrayState<S>> {
  serializeFn: (state: string[]) => string;
}

export class P9PredicateArray<S extends P9PredicateState = any> extends P9PredicateBase<P9PredicateArrayState<S>> {
  readonly predicateChanges: Observable<string>;
  readonly canReset: Observable<boolean>;
  readonly predicates: Observable<P9PredicateScalar<S>[]>;

  constructor({ serializeFn, ...rest }: P9PredicateArrayOptions<S> = makeDefaultOptions()) {
    super(rest);

    this.predicates = this.stateChanges.pipe(map(({ ids, predicates }) => ids.map((id) => predicates[id])));

    this.predicateChanges = this.predicates.pipe(
      switchMap((predicates) =>
        predicates.length === 0
          ? of([] as string[])
          : combineLatest(predicates.map(({ predicateChanges }) => predicateChanges)),
      ),
      map(serializeFn),
      distinctUntilChanged(),
    );

    this.canReset = this.predicateChanges.pipe(map(Boolean), distinctUntilChanged());
  }

  addPredicate = (...predicates: P9PredicateScalar<S>[]): void => {
    this.setState((draft) => {
      predicates.forEach((predicate) => {
        predicate.setParent(this);

        draft.ids.push(predicate.id);
        draft.predicates[predicate.id] = predicate;
      });
    });
  };

  removePredicate(id: string): void;
  removePredicate(predicate: P9PredicateScalar<S>): void;
  removePredicate(idOrPredicate: string | P9PredicateScalar<S>): void {
    const id = typeof idOrPredicate === 'string' ? idOrPredicate : idOrPredicate.id;

    this.setState((draft) => {
      draft.predicates[id].setParent(undefined);
      draft.ids.splice(draft.ids.indexOf(id), 1);
      delete draft.predicates[id];
    });
  }

  reset = (): void => {
    this.setState((draft) => {
      draft.ids.map((id) => draft.predicates[id]).forEach((predicate) => predicate.setParent(undefined));
      draft.ids = [];
      draft.predicates = {};
    });
  };
}

function makeDefaultOptions<S extends P9PredicateState>(): P9PredicateArrayOptions<S> {
  return { serializeFn: (state: string[]) => state.filter(Boolean).join(' '), stateOrFn: { ids: [], predicates: {} } };
}
