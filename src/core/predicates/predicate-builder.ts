import { Observable } from 'rxjs';
import { v1 } from 'uuid';

import { P9PredicateArray, P9PredicateArrayState } from './predicate-array';
import { P9Predicate, P9PredicateBase, P9PredicateState } from './predicate-base';
import { P9PredicateScalar } from './predicate-scalar';

export interface P9PredicateBuilderOptions<P extends P9PredicateType> {
  id?: string;
  parseFn: (expression: P9PredicateExpressionType<P>, predicate: P) => void;
  predicateOrFn: P | (() => P);
}

export class P9PredicateBuilder<P extends P9PredicateType = any> implements P9Predicate {
  #predicate: P;

  get canReset(): Observable<boolean> {
    return this.#predicate.canReset;
  }

  readonly id: string;

  get predicateChanges(): Observable<string> {
    return this.#predicate.predicateChanges;
  }

  get state(): P9PredicateStateType<P> {
    return this.#predicate.state;
  }

  constructor({ id = v1(), parseFn, predicateOrFn }: P9PredicateBuilderOptions<P>) {
    this.#predicate = predicateOrFn instanceof Function ? predicateOrFn() : predicateOrFn;

    this.id = id;
    this.parse = (expression: P9PredicateExpressionType<P>) => parseFn(expression, this.#predicate);
  }

  parse: (expression: P9PredicateExpressionType<P>) => void;

  reset(): void {
    this.#predicate.reset();
  }
}

type ArrayExpressionType<S> = S extends P9PredicateState<infer E> ? E : unknown;

type ExpressionType<S> = S extends P9PredicateState<infer E>
  ? E
  : S extends P9PredicateArrayState<infer E>
  ? ArrayExpressionType<E>
  : unknown;

type P9PredicateType = P9PredicateArray | P9PredicateScalar;

type P9PredicateStateType<P> = P extends P9PredicateBase<infer S> ? S : unknown;
type P9PredicateExpressionType<P> = P extends P9PredicateBase<infer S>
  ? ExpressionType<S>
  : P extends P9PredicateState<infer E>
  ? E
  : unknown;
