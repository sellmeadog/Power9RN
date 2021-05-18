import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, share } from 'rxjs/operators';

import { P9PredicateArray } from './predicate-array';
import { P9PredicateBase, P9PredicateBaseOptions, P9PredicateResetFn, P9PredicateState } from './predicate-base';

export interface P9PredicateScalarOptions<T extends P9PredicateState> extends P9PredicateBaseOptions<T> {
  resetFn?: P9PredicateResetFn<T>;
  serializeFn(state: T): string;
}

export class P9PredicateScalar<T extends P9PredicateState = any> extends P9PredicateBase<T> {
  #parent: P9PredicateArray<T> | undefined = undefined;

  readonly canReset: Observable<boolean>;

  get parent(): P9PredicateArray<T> | undefined {
    return this.#parent;
  }

  readonly predicateChanges: Observable<string>;
  readonly reset: () => void;

  constructor({ resetFn, serializeFn, ...rest }: P9PredicateScalarOptions<T>) {
    super(rest);

    this.predicateChanges = this.stateChanges.pipe(
      map(serializeFn),
      distinctUntilChanged(),
      share({ connector: () => new ReplaySubject() }),
    );

    this.canReset = this.predicateChanges.pipe(
      map(Boolean),
      distinctUntilChanged(),
      share({ connector: () => new ReplaySubject() }),
    );

    this.reset = () => resetFn?.(this);
  }

  remove(): void {
    this.#parent?.removePredicate(this);
  }

  setParent(parent: P9PredicateArray<T> | undefined): void {
    this.#parent = parent;
  }
}
