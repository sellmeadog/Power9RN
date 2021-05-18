import { TestScheduler } from 'rxjs/testing';

import { P9PredicateScalar } from './predicate-scalar';

describe('P9Predicate', () => {
  describe('P9PredicateScalar', () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
      scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    });

    it('should initialize with default state', () => {
      const scalar1 = new P9PredicateScalar({ stateOrFn: defaultState, serializeFn });
      const scalar2 = new P9PredicateScalar({ stateOrFn: defaultStateFn, serializeFn });

      scheduler.run(({ expectObservable }) => {
        expect(scalar1.state).toEqual(defaultState);
        expectObservable(scalar1.canReset).toBe('a-', { a: false });
        expectObservable(scalar1.predicateChanges).toBe('b', { b: '' });

        expect(scalar2.state).toEqual(defaultState);
        expectObservable(scalar2.canReset).toBe('a-', { a: false });
        expectObservable(scalar2.predicateChanges).toBe('b', { b: '' });
      });
    });

    it('should publish changes and reset', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const scalar = new P9PredicateScalar({
          stateOrFn: defaultStateFn(),
          serializeFn: ({ attribute, expression }) =>
            expression ? [attribute, 'BEGINSWITH[c]', `"${expression}"`].join(' ') : '',
          resetFn: (predicate) =>
            predicate.setState((draft) => {
              draft.expression = '';
            }),
        });

        const actionSeq = '   --a-b-c-d|';
        const canResetSeq = ' e-f-----g-';
        const predicateSeq = 'h-i-j-k-l-';

        const actions$ = cold(actionSeq, { a: 'grave', b: 'gravecrawler', c: 'graveyard', d: '' });

        actions$.forEach((expression) => {
          if (expression) {
            scalar.setState((draft) => {
              draft.expression = expression;
            });
          } else {
            scalar.reset();
          }
        });

        expectObservable(scalar.canReset).toBe(canResetSeq, { e: false, f: true, g: false });
        expectObservable(scalar.predicateChanges).toBe(predicateSeq, {
          h: '',
          i: 'name BEGINSWITH[c] "grave"',
          j: 'name BEGINSWITH[c] "gravecrawler"',
          k: 'name BEGINSWITH[c] "graveyard"',
          l: '',
        });
      });
    });
  });
});

const defaultState = { attribute: 'name', expression: '' };
const defaultStateFn = () => defaultState;
const serializeFn = ({ attribute, expression }: { attribute: string; expression: string }): string =>
  expression ? [attribute, 'BEGINSWITH[c]', `"${expression}"`].join('') : '';
