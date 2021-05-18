import { TestScheduler } from 'rxjs/testing';

import { P9PredicateArray } from './predicate-array';
import { P9PredicateBuilder } from './predicate-builder';
import { P9PredicateScalar } from './predicate-scalar';

type P9PredicatePickerState = {
  attribute: string;
  expression: {
    [key: string]: boolean;
  };
};

type P9PickerPredicate = P9PredicateScalar<P9PredicatePickerState>;

type P9StringPredicateState = {
  attribute: string;
  expression: string;
};

type P9StringPredicate = P9PredicateScalar<P9StringPredicateState>;
type P9StringPredicateArray = P9PredicateArray<P9StringPredicateState>;

describe('P9PredicateBuilder', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  describe('Scalar Builder', () => {
    let builder: P9PredicateBuilder<P9PickerPredicate>;

    beforeEach(() => {
      builder = makePickerPredicateBuilder();
    });

    it('should initialize with default values', () => {
      scheduler.run(({ expectObservable }) => {
        expect(builder.state).toEqual({ attribute: 'format', expression: {} });
        expectObservable(builder.canReset).toBe('a', { a: false });
        expectObservable(builder.predicateChanges).toBe('b', { b: '' });
      });
    });

    it('should parse expression and publish changes from internal predicate', () => {
      builder.parse({ standard: false, modern: true });

      scheduler.run(({ expectObservable }) => {
        expectObservable(builder.canReset).toBe('a', { a: true });
        expectObservable(builder.predicateChanges).toBe('b', { b: 'modern IN format' });
      });
    });

    it('should reset internal predicate', () => {
      builder.parse({ standard: false, modern: true });
      builder.reset();

      scheduler.run(({ expectObservable }) => {
        expectObservable(builder.canReset).toBe('a', { a: false });
        expectObservable(builder.predicateChanges).toBe('b', { b: '' });
      });
    });
  });

  describe('Array Builder', () => {
    let builder: P9PredicateBuilder<P9StringPredicateArray>;

    beforeEach(() => {
      builder = new P9PredicateBuilder({
        parseFn: (expression, predicate) => {
          predicate.addPredicate(
            ...expression
              .trim()
              .split(' ')
              .map(
                (exp) =>
                  new P9PredicateScalar({
                    serializeFn: ({ attribute, expression: ex }) => (expression ? [attribute, ex].join(' ') : ''),
                    stateOrFn: { attribute: 'name', expression: exp },
                  }),
              ),
          );
        },
        predicateOrFn: new P9PredicateArray<P9StringPredicateState>(),
      });
    });

    it('should initialize with default values', () => {
      scheduler.run(({ expectObservable }) => {
        expectObservable(builder.canReset).toBe('a', { a: false });
        expectObservable(builder.predicateChanges).toBe('b', { b: '' });
      });
    });

    it('should parse expression and publish changes', () => {
      scheduler.run(({ expectObservable }) => {
        builder.parse('huntmaster of the fells');

        expectObservable(builder.canReset).toBe('a', { a: true });
        expectObservable(builder.predicateChanges).toBe('b', { b: 'name huntmaster name of name the name fells' });
      });
    });
  });
});

function makePickerPredicate() {
  return new P9PredicateScalar<P9PredicatePickerState>({
    resetFn: (predicate) =>
      predicate.setState((draft) => {
        draft.expression = {};
      }),
    stateOrFn: { attribute: 'format', expression: {} },
    serializeFn: ({ attribute, expression }) =>
      Object.entries(expression)
        .filter(([_, status]) => status)
        .map(([format]) => [format, 'IN', attribute].join(' '))
        .join(' '),
  });
}

function makePickerPredicateBuilder() {
  return new P9PredicateBuilder<P9PickerPredicate>({
    parseFn: (expression, predicate) => {
      predicate.setState((draft) => {
        draft.expression = expression;
      });
    },
    predicateOrFn: makePickerPredicate,
  });
}
