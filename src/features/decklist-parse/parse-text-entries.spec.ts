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

  it('should parse pasted file text', () => {
    // Arrange
    const textEntries = `
2 Craterhoof Behemoth
4 Frogmite
4 Memnite
2 Myr Enforcer
4 Ornithopter
4 Sojourner's Companion
4 Thought Monitor
4 Neoform
2 Thoughtcast
3 Cranial Plating
4 Mishra's Bauble
1 Shadowspear
4 Springleaf Drum
4 Darksteel Citadel
2 Glimmervoid
2 Razortide Bridge
2 Spire of Industry
4 Tanglepool Bridge
4 Urza's Saga
Sideboard
2 Dispatch
3 Etched Champion
2 Flusterstorm
3 Hurkyl's Recall
1 Pithing Needle
3 Soul-Guide Lantern
1 Welding Jar

`;

    // Act
    const actual = parseTextEntries(textEntries);

    // Assert
    expect(actual).toMatchSnapshot();
  });
});
