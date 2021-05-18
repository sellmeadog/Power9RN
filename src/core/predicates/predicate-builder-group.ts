import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, share } from 'rxjs/operators';
import { v1 } from 'uuid';

import { P9Predicate } from './predicate-base';
import { P9PredicateBuilder } from './predicate-builder';

type P9PredicateBuilderGroupState = {
  ids: string[];
  builders: {
    [id: string]: P9PredicateBuilder;
  };
};

type P9PredicateBuilderTuple = [id: string, builderOrFn: P9PredicateBuilder | (() => P9PredicateBuilder)];

export class P9PredicateBuilderGroup implements P9Predicate {
  #state: P9PredicateBuilderGroupState = { ids: [], builders: {} };

  get builders(): P9PredicateBuilder[] {
    return this.#state.ids.map((id) => this.#state.builders[id]);
  }

  readonly canReset: Observable<boolean>;
  readonly id = v1();
  readonly predicateChanges: Observable<string>;

  get state(): P9PredicateBuilderGroupState {
    return this.#state;
  }

  constructor(builders: P9PredicateBuilderTuple[]) {
    builders.forEach(([id, builderOrFn]) => {
      const builder = builderOrFn instanceof Function ? builderOrFn() : builderOrFn;

      this.#state.ids.push(id);
      this.#state.builders[id] = builder;
    });

    this.predicateChanges = combineLatest(this.builders.map(({ predicateChanges }) => predicateChanges)).pipe(
      map((predicates) => predicates.filter(Boolean).join(' ')),
      distinctUntilChanged(),
      share({ connector: () => new ReplaySubject(1) }),
    );

    this.canReset = this.predicateChanges.pipe(
      map(Boolean),
      distinctUntilChanged(),
      share({ connector: () => new ReplaySubject(1) }),
    );
  }

  builder(id: string): P9PredicateBuilder {
    return this.#state.builders[id];
  }

  reset(): void {
    this.builders.forEach((builder) => builder.reset());
  }
}
