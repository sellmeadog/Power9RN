import { parseTextEntries } from './parse-text-entries';

describe('parseTextEntries', () => {
  it('should parse standard format text entries', () => {
    // Arrange
    const textEntries = `
4 Gravecrawler
4 geralfs messenger
3 damping sphere
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse standard format text entries with empty line divider', () => {
    // Arrange
    const textEntries = `
4 Gravecrawler
4 geralfs messenger

3 damping sphere
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    // expect(
    //   actual.includes({
    //     cardName: 'damping sphere',
    //     collectorNumber: undefined,
    //     count: '3',
    //     expansionCode: undefined,
    //     type: 'sideboard',
    //   })
    // ).toBeTruthy();
    expect(actual).toMatchSnapshot();
  });

  it('should parse standard format text entries with Sideboard line divider', () => {
    // Arrange
    const textEntries = `
4 Gravecrawler
4 geralfs messenger
Sideboard:
3 damping sphere
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    // expect(
    //   actual.includes({
    //     cardName: 'damping sphere',
    //     collectorNumber: undefined,
    //     count: '3',
    //     expansionCode: undefined,
    //     type: 'sideboard',
    //   })
    // ).toBeTruthy();
    expect(actual).toMatchSnapshot();
  });

  it('should parse standard format text entries with Sideboard line and extra whitespace', () => {
    // Arrange
    const textEntries = `
4 Gravecrawler
4 geralfs messenger


Sideboard:
3 damping sphere
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse standard format text entries regardless of bad input', () => {
    // Arrange
    const textEntries = `
4 Gravecrawler
chili cheese dogs
4 geralfs messenger
Sideboard:
3 damping sphere
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should gracefully handle bad input', () => {
    // Arrange
    const textEntries = `
this is a useless
Sideboard:
list of card entries
in a deck list
`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    expect(actual).toMatchSnapshot();
  });
});
