import { TestScheduler } from 'rxjs/testing';

import { P9PredicateArray } from './predicate-array';
import { P9PredicateState } from './predicate-base';
import { P9PredicateScalar } from './predicate-scalar';

export interface P9StringPredicateState extends P9PredicateState {
  attribute: string;
}

describe('P9PredicateArray', () => {
  let scheduler: TestScheduler;
  let predicate: P9PredicateArray<P9StringPredicateState>;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    predicate = new P9PredicateArray<P9StringPredicateState>();
  });

  it('should initialize with defaults', () => {
    scheduler.run(({ expectObservable }) => {
      expect(predicate.state).toEqual({ ids: [], predicates: {} });
      expectObservable(predicate.predicates).toBe('a', { a: [] });
      expectObservable(predicate.canReset).toBe('b', { b: false });
      expectObservable(predicate.predicateChanges).toBe('c', { c: '' });
    });
  });

  it('should add and remove predicates', () => {
    const scalar1 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'huntmaster' },
      serializeFn: scalarSerializeFn,
    });
    const scalar2 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'of the' },
      serializeFn: scalarSerializeFn,
    });
    const scalar3 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'fells' },
      serializeFn: scalarSerializeFn,
    });

    const actualCanResets: boolean[] = [];
    predicate.canReset.subscribe((value) => actualCanResets.push(value));

    const actualPredicates: string[] = [];
    predicate.predicateChanges.subscribe((value) => actualPredicates.push(value));

    predicate.addPredicate(scalar1);
    predicate.addPredicate(scalar2);
    predicate.addPredicate(scalar3);
    predicate.removePredicate(scalar2);
    predicate.removePredicate(scalar1.id);
    predicate.reset();

    expect(actualCanResets).toEqual([false, true, false]);
    expect(actualPredicates).toEqual([
      '',
      'name BEGINSWITH[c] "huntmaster"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "of the"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "of the" name BEGINSWITH[c] "fells"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "fells"',
      'name BEGINSWITH[c] "fells"',
      '',
    ]);
  });

  it('should merge changes from inner predicates', () => {
    const scalar1 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'huntmaster' },
      serializeFn: scalarSerializeFn,
    });
    const scalar2 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'of the' },
      serializeFn: scalarSerializeFn,
    });
    const scalar3 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'fells' },
      serializeFn: scalarSerializeFn,
    });

    predicate.addPredicate(scalar1, scalar2, scalar3);

    const actualPredicates: string[] = [];
    predicate.predicateChanges.subscribe((value) => actualPredicates.push(value));

    scalar2.setState((draft) => {
      draft.expression = 'of';
    });

    scalar2.setState((draft) => {
      draft.expression = '';
    });

    expect(actualPredicates).toEqual([
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "of the" name BEGINSWITH[c] "fells"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "of" name BEGINSWITH[c] "fells"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "fells"',
    ]);
  });

  it('scalar predicate should remove itself from parent', () => {
    const scalar1 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'huntmaster' },
      serializeFn: scalarSerializeFn,
    });
    const scalar2 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'of the' },
      serializeFn: scalarSerializeFn,
    });
    const scalar3 = new P9PredicateScalar({
      stateOrFn: { attribute: 'name', expression: 'fells' },
      serializeFn: scalarSerializeFn,
    });

    predicate.addPredicate(scalar1, scalar2, scalar3);

    const actualPredicates: string[] = [];
    predicate.predicateChanges.subscribe((value) => actualPredicates.push(value));

    expect(scalar2.parent).toBe(predicate);

    scalar2.remove();

    expect(scalar2.parent).toBeUndefined();
    expect(actualPredicates).toEqual([
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "of the" name BEGINSWITH[c] "fells"',
      'name BEGINSWITH[c] "huntmaster" name BEGINSWITH[c] "fells"',
    ]);
  });
});

const scalarSerializeFn = ({ attribute, expression }: { attribute: string; expression: string }): string =>
  expression ? [attribute, 'BEGINSWITH[c]', `"${expression}"`].join(' ') : '';
