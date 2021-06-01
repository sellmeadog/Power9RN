import { TestScheduler } from 'rxjs/testing';

import { whenDefined } from './when-defined';

describe('whenDefined', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('whenDefined does not publish null or undefined values', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const sourceExpression = '  --a--b--c-';
      const expectedExpression = '--------d-';

      const sourceValues = { a: null, b: undefined, c: 0 };
      const expectedValues = { d: 0 };

      const source$ = cold(sourceExpression, sourceValues);
      const expected$ = cold(expectedExpression, expectedValues);

      expectObservable(source$.pipe(whenDefined())).toEqual(expected$);
    });
  });
});
