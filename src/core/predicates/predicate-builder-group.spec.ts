import { TestScheduler } from 'rxjs/testing';

import { P9PredicateArray } from './predicate-array';
import { P9PredicateBuilder } from './predicate-builder';
import { P9PredicateBuilderGroup } from './predicate-builder-group';
import { P9PredicateScalar } from './predicate-scalar';

describe('P9PredicateBuilderGroup', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should initialize with defaults', () => {
    const group = new P9PredicateBuilderGroup([['name', makeStringPredicateBuilder('name')]]);

    scheduler.run(({ expectObservable, hot }) => {
      const canReset$ = hot('a', { a: false });
      const predicate$ = hot('b', { b: '' });

      expectObservable(group.canReset).toEqual(canReset$);
      expectObservable(group.predicateChanges).toEqual(predicate$);
    });
  });

  it('should publish changes from internal builder', () => {
    const group = new P9PredicateBuilderGroup([
      ['name', makeStringPredicateBuilder('name')],
      ['oracle_text', makeStringPredicateBuilder.bind(undefined, 'oracle_text')],
    ]);

    scheduler.run(({ expectObservable, hot }) => {
      const nameBuilder: P9PredicateBuilder<P9PredicateArray<{ attribute: string; expression: string }>> =
        group.builder('name');

      const oracleTextBuilder: P9PredicateBuilder<P9PredicateArray<{ attribute: string; expression: string }>> =
        group.builder('oracle_text');

      nameBuilder.parse('huntmaster');
      oracleTextBuilder.parse('flying');

      const canReset$ = hot('a', { a: true });
      const predicate$ = hot('b', { b: 'name BEGINSWITH[c] "huntmaster" oracle_text BEGINSWITH[c] "flying"' });

      expectObservable(group.canReset).toEqual(canReset$);
      expectObservable(group.predicateChanges).toEqual(predicate$);
    });
  });

  it('should reset internal predicates', () => {
    const group = new P9PredicateBuilderGroup([
      ['name', makeStringPredicateBuilder('name')],
      ['oracle_text', makeStringPredicateBuilder('oracle_text')],
    ]);

    scheduler.run(({ expectObservable, hot }) => {
      group.reset();

      const canReset$ = hot('a', { a: false });
      const predicate$ = hot('b', { b: '' });

      expect(group.state.ids).toEqual(['name', 'oracle_text']);
      expectObservable(group.canReset).toEqual(canReset$);
      expectObservable(group.predicateChanges).toEqual(predicate$);
    });
  });
});

function makeStringPredicateBuilder(attribute: string) {
  return new P9PredicateBuilder<P9PredicateArray<{ attribute: string; expression: string }>>({
    id: attribute,
    parseFn: (expression, predicate) => {
      predicate.addPredicate(
        ...expression
          .trim()
          .split(' ')
          .filter(Boolean)
          .map(
            (exp) =>
              new P9PredicateScalar({
                stateOrFn: { attribute, expression: exp },
                serializeFn: serializeStringFn,
              }),
          ),
      );
    },
    predicateOrFn: new P9PredicateArray<{ attribute: string; expression: string }>(),
  });
}

const serializeStringFn = ({ attribute, expression }: { attribute: string; expression: string }): string =>
  expression ? [attribute, 'BEGINSWITH[c]', `"${expression}"`].join(' ').trim() : '';
