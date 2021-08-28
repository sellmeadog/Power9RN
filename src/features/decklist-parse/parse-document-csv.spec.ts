import { parseDocumentCsv } from './parse-document-csv';

describe('parseDocumentCsv', () => {
  it('should parse MTGO', () => {
    // Arrange
    const csvString = `Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium
"Banisher Priest",1,51909,Uncommon,PRM,1136/1158,Yes
"Batterskull",10,51909,Uncommon,PRM,1136/1158,Yes
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse MTG Studio', () => {
    // Arrange
    const csvString = `Name,Edition,Qty,Foil
Aether Vial,MMA,1,No
Anax and Cymede,THS,4,Yes
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse Deckbox', () => {
    // Arrange
    const csvString = `Count,Tradelist Count,Name,Edition,Card Number,Condition,Language,Foil,Signed,Artist Proof,Altered Art,Mis,
4,4,Angel of Serenity,Return to Ravnica,1,Near Mint,English,,,,,,,,
1,1,Ashen Rider,Theros,187,Near Mint,English,,,,,,,,
1,0,Anax and Cymede,Theros,186,Near Mint,English,foil,,,,,,,
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse Decked Builder', () => {
    // Arrange
    const csvString = `Total Qty,Reg Qty,Foil Qty,Card,Set,Mana Cost,Card Type,Color,Rarity,Mvid,Single Price,Single Foil Price,Total Price,Price Source,Notes
3,2,1,Black Sun's Zenith,Mirrodin Besieged,XBB,Sorcery,Black,Rare,214061,1.00,6.25,7.25,cardshark,
1,1,0,Snapcaster Mage,Innistrad,1U,Creature  - Human Wizard,Blue,Rare,227676,26.60,115.00,141.60,cardshark,
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse Pucatrade', () => {
    // Arrange
    const csvString = `Count,Name,Edition,Rarity,Expansion Symbol,Points,Foil,Condition,Language,Status,Entered Date,Updated Date,Exported Date
1,Breeding Pool,Gatecrash,RARE,GTC,1009,0,"Near Mint","English",NOT FOR TRADE,"11/19/2014","11/29/2014","11/30/2014",19632
8,Rattleclaw Mystic,Khans of Tarkir,RARE,KTK,194,0,"Near Mint","English",HAVE,"11/29/2014","11/29/2014","11/30/2014",25942
1,Opulent Palace,Khans of Tarkir,UNCOMMON,KTK,461,1,"Near Mint","English",HAVE,"11/29/2014","11/29/2014","11/30/2014",25928
1,Tasigur the Golden Fang,Fate Reforged,RARE,FRF,1045,1,"Near Mint","English",HAVE,"1/24/2015","1/24/2015","2/03/2015",270
1,Tasigur the Golden Fang,Fate Reforged,RARE,FRF,1045,1,"Near Mint","English",HAVE,"1/24/2015","1/24/2015","2/03/2015",270
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse MTGGoldfish', () => {
    // Arrange
    const csvString = `Card,Set ID,Set Name,Quantity,Foil
Aether Vial,MMA,Modern Masters,1
Anax and Cymede,THS,Theros,4,FOIL
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse MTGStocks', () => {
    // Arrange
    const csvString = `"Card","Set","Quantity","Price","Condition","Language","Foil","Signed"
"Abandon Hope","Tempest",2,0.24,M,en,No,No
"Abduction","Classic Sixth Edition",1,0.33,M,en,No,No
"Advent of the Wurm","Modern Masters 2017",1,0.99,M,en,Yes,No
"Advent of the Wurm","Modern Masters 2017",3,0.35,M,en,No,No
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse TCGplayer', () => {
    // Arrange
    const csvString = `Quantity,Name,Simple Name,Set,Card Number,Set Code,Printing,Condition,Language,Rarity,Product ID,SKU
1,Verdant Catacombs,Verdant Catacombs,Zendikar,229,ZEN,Normal,Near Mint,English,Rare,33470,315319
1,Graven Cairns,Graven Cairns,Zendikar Expeditions,28,EXP,Foil,Near Mint,English,Mythic,110729,3042202
1,Olivia Voldaren,Olivia Voldaren,Innistrad,215,ISD,Foil,Near Mint,English,Mythic,52181,500457
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse Deckstats.net', () => {
    // Arrange
    const csvString = `amount,card_name,is_foil,is_pinned,set_id,set_code
1,"Abandon Reason",0,0,147,"EMN"
2,"Abandoned Sarcophagus",0,0,187,"HOU"
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse MTG Manager', () => {
    // Arrange
    const csvString = `Quantity,Name,Code,PurchasePrice,Foil,Condition,Language,PurchaseDate
1,"Amulet of Vigor",WWK,18.04,0,0,0,5/6/2018
1,"Arcane Lighthouse",C14,3.83,0,0,0,5/6/2018
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });

  it('should parse count from Regular and Foil headers', () => {
    // Arrange
    const csvString = `Set,Card,Regular,Foil
Amonkhet,Forest,3,1
`;

    // Act
    const actual = parseDocumentCsv(csvString);

    // Assert
    expect(actual).toMatchSnapshot();
  });
});
