import { serializeColorPredicate } from './serialization';

describe('Predicate Serialization', () => {
  it('should serialize exact color predicate expression', () => {
    const expected =
      '(card_faces.colors =[c] "W" AND card_faces.colors =[c] "U" AND NOT card_faces.colors =[c] "B" AND NOT card_faces.colors =[c] "R" AND NOT card_faces.colors =[c] "G" AND NOT card_faces.colors =[c] "C")';

    const actual = serializeColorPredicate({
      attribute: 'card_faces.colors',
      predicates: { fuzziness: 0, W: true, U: true },
    });

    expect(actual).toEqual(expected);
  });

  it('should serialize include color predicate expression', () => {
    const expected = '(card_faces.colors =[c] "W" AND card_faces.colors =[c] "U")';

    const actual = serializeColorPredicate({
      attribute: 'card_faces.colors',
      predicates: { fuzziness: 1, W: true, U: true },
    });

    expect(actual).toEqual(expected);
  });

  it('should serialize at most color predicate expression', () => {
    const expected =
      '(card_faces.colors =[c] "W" OR card_faces.colors =[c] "U" OR card_faces.colors.@count == 0 AND NOT card_faces.colors =[c] "B" AND NOT card_faces.colors =[c] "R" AND NOT card_faces.colors =[c] "G" AND NOT card_faces.colors =[c] "C")';

    const actual = serializeColorPredicate({
      attribute: 'card_faces.colors',
      predicates: { fuzziness: 2, W: true, U: true },
    });

    expect(actual).toEqual(expected);
  });

  it('should ignore an empty selection', () => {
    const expected = '';
    const actual = serializeColorPredicate({
      attribute: 'card_faces.colors',
      predicates: { fuzziness: 2, W: false, U: false, B: false, R: false, G: false, C: false },
    });

    expect(actual).toEqual(expected);
  });
});
