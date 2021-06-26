import { v1 } from 'uuid';

import { serializeColorPredicateGroup } from './serialization';

describe('Predicate Serialization', () => {
  it('should serialize exact color predicate expression', () => {
    const expected =
      '(card_faces.colors =[c] "W" AND card_faces.colors =[c] "U" AND NOT card_faces.colors =[c] "B" AND NOT card_faces.colors =[c] "R" AND NOT card_faces.colors =[c] "G" AND NOT card_faces.colors =[c] "C")';

    const actual = serializeColorPredicateGroup({
      attribute: 'card_faces.colors',
      metadata: { fuzziness: 0 },
      predicates: [
        { attribute: 'card_faces.colors', expression: 'W', id: v1() },
        { attribute: 'card_faces.colors', expression: 'U', id: v1() },
      ],
    });

    expect(actual).toEqual(expected);
  });

  it('should serialize include color predicate expression', () => {
    const expected = '(card_faces.colors =[c] "W" AND card_faces.colors =[c] "U")';

    const actual = serializeColorPredicateGroup({
      attribute: 'card_faces.colors',
      metadata: { fuzziness: 1 },
      predicates: [
        { attribute: 'card_faces.colors', expression: 'W', id: v1() },
        { attribute: 'card_faces.colors', expression: 'U', id: v1() },
      ],
    });

    expect(actual).toEqual(expected);
  });

  it('should serialize at most color predicate expression', () => {
    const expected =
      '(card_faces.colors =[c] "W" OR card_faces.colors =[c] "U" OR card_faces.colors.@count == 0 AND NOT card_faces.colors =[c] "B" AND NOT card_faces.colors =[c] "R" AND NOT card_faces.colors =[c] "G" AND NOT card_faces.colors =[c] "C")';

    const actual = serializeColorPredicateGroup({
      attribute: 'card_faces.colors',
      metadata: { fuzziness: 2 },
      predicates: [
        { attribute: 'card_faces.colors', expression: 'W', id: v1() },
        { attribute: 'card_faces.colors', expression: 'U', id: v1() },
      ],
    });

    expect(actual).toEqual(expected);
  });

  it('should ignore an empty selection', () => {
    const expected = '';
    const actual = serializeColorPredicateGroup({
      attribute: 'card_faces.colors',
      metadata: { fuzziness: 2 },
      predicates: [],
    });

    expect(actual).toEqual(expected);
  });
});
