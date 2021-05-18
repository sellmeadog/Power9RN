import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { v1 } from 'uuid';

export interface P9PredicateState<E = any> {
  expression: E | null | undefined;
  [key: string]: any;
}

/**
 * Describes a basic observable predicate.
 */
export interface P9Predicate<S = any> {
  canReset: Observable<boolean>;
  id: string;
  predicateChanges: Observable<string>;
  reset: () => void;
  state: S;
}

/**
 * Describes the constructor options that can be passed to a P9PredicateBase<T>
 */
export interface P9PredicateBaseOptions<T> {
  id?: string;
  stateOrFn: T | (() => T);
}

/**
 * Base implementation for all P9Predicate instances
 */
export abstract class P9PredicateBase<T> implements P9Predicate<T> {
  #state: T;
  #state$: BehaviorSubject<T>;

  readonly id: string;

  abstract get canReset(): Observable<boolean>;
  abstract get predicateChanges(): Observable<string>;
  abstract reset: () => void;

  get state(): T {
    return this.#state;
  }

  readonly stateChanges: Observable<T>;

  constructor({ id = v1(), stateOrFn }: P9PredicateBaseOptions<T>) {
    this.#state = stateOrFn instanceof Function ? stateOrFn() : stateOrFn;
    this.#state$ = new BehaviorSubject(this.#state);

    this.id = id;
    this.stateChanges = this.#state$.pipe(distinctUntilChanged());
  }

  setState(producer: (draft: T) => void): void {
    this.#state = produce(this.#state, producer);
    this.#state$.next(this.#state);
  }
}

/**
 * The function type that can reset the state of a P9PredicateBase<T>.
 */
export type P9PredicateResetFn<T> = (predicate: P9PredicateBase<T>) => void;
