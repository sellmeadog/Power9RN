import { P9DocumentInfo } from '../../core/device';
import { parseDocument } from './parse-document';

describe('parseDocument', () => {
  it('should parse a TXT document', async () => {
    // Arrange
    const documentInfo: P9DocumentInfo = {
      name: 'Another One Bites The Dust - Davis.txt',
      content: Promise.resolve(
        `4 Gravecrawler
4 geralfs messenger

3 damping sphere
`,
      ),
      type: 'text/plain',
      uri: 'file://test.txt',
    };

    // Act
    const actual = await parseDocument(documentInfo);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse a CSV document', async () => {
    // Arrange
    const documentInfo: P9DocumentInfo = {
      name: 'We Will Rock You - Davis.csv',
      content: Promise.resolve(
        `Count,Tradelist Count,Name,Edition,Card Number,Condition,Language,Foil,Signed,Artist Proof,Altered Art,Mis,
4,4,Angel of Serenity,Return to Ravnica,1,Near Mint,English,,,,,,,,
1,1,Ashen Rider,Theros,187,Near Mint,English,,,,,,,,
1,0,Anax and Cymede,Theros,186,Near Mint,English,foil,,,,,,,
`,
      ),
      type: 'text/csv',
      uri: 'file://test.csv',
    };

    // Act
    const actual = await parseDocument(documentInfo);

    // Assert
    expect(actual).toMatchSnapshot();
  });
});
