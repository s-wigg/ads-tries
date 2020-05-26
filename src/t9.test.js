import { buildCode } from './t9';

describe(buildCode, () => {
  it('returns an array containing the code', () => {
    expect(buildCode('ada')).toStrictEqual([2, 3, 2]);
  });

  it('returns the correct code for many different words', () => {
    const codes = {
      ada: [2, 3, 2],
      developers: [3, 3, 8, 3, 5, 6, 7, 3, 7, 7],
      academy: [2, 2, 2, 3, 3, 6, 9],
      advanced: [2, 3, 8, 2, 6, 2, 3, 3],
      data: [3, 2, 8, 2],
      structures: [7, 8, 7, 8, 2, 8, 8, 7, 3, 7]
    }
    Object.keys(codes).forEach(word => {
      expect(buildCode(word)).toStrictEqual(codes[word]);
    });
  });

  it('returns an empty array for an emtpy string', () => {
    expect(buildCode('')).toStrictEqual([]);
  });

  it('ignores non-letter characters', () => {
    const codes = {
      '$%^&': [],
      '.mixed-input_today!': buildCode('mixedinputtoday'),
      ' white  space   ': buildCode('whitespace'),
      '😃': []
    };
    Object.keys(codes).forEach(word => {
      expect(buildCode(word)).toStrictEqual(codes[word]);
    });
  });

  it('accepts upper and lower case', () => {
    const codes = {
      ada: [2, 3, 2],
      ADA: [2, 3, 2],
      aDa: [2, 3, 2],
    };
    Object.keys(codes).forEach(word => {
      expect(buildCode(word)).toStrictEqual(codes[word]);
    });
  });
});