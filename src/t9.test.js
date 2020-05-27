import { t9KeyCode } from './t9';

describe(t9KeyCode, () => {
  it('returns an array containing the code', () => {
    expect(t9KeyCode('ada')).toStrictEqual('232');
  });

  it('returns the correct code for many different words', () => {
    const codes = {
      ada: '232',
      developers: '3383567377',
      academy: '2223369',
      advanced: '23826233',
      data: '3282',
      structures: '7878288737'
    }
    Object.keys(codes).forEach(word => {
      expect(t9KeyCode(word)).toStrictEqual(codes[word]);
    });
  });

  it('returns an empty array for an emtpy string', () => {
    expect(t9KeyCode('')).toStrictEqual('');
  });

  it('ignores non-letter characters', () => {
    const codes = {
      '$%^&': '',
      '.mixed-input_today!': t9KeyCode('mixedinputtoday'),
      ' white  space   ': t9KeyCode('whitespace'),
      '😃': ''
    };
    Object.keys(codes).forEach(word => {
      expect(t9KeyCode(word)).toStrictEqual(codes[word]);
    });
  });

  it('accepts upper and lower case', () => {
    const codes = {
      ada: '232',
      ADA: '232',
      aDa: '232',
    };
    Object.keys(codes).forEach(word => {
      expect(t9KeyCode(word)).toStrictEqual(codes[word]);
    });
  });
});