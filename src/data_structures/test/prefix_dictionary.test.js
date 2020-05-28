import WordList from "../word_list";
import Trie from "../trie";
import CompressedTrie from "../compressed_trie";

const dataStructures = [
  // WordList,
  // Trie,
  CompressedTrie,
];

const identity = (word) => word;

const lowerCase = (word) => word.toLowerCase();

dataStructures.forEach(PrefixDictionary => {
  describe(PrefixDictionary, () => {
    describe('constructor', () => {
      it('creates a trie with a count of 0 if no words are given', () => {
        const pd = new PrefixDictionary([], identity);
        expect(pd.count()).toBe(0);
      });

      it('counts unique words', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.count()).toBe(3);
      });

      it('does not count duplicate words', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy', 'academy'],
          identity
        );

        expect(pd.count()).toBe(3);
      });

      it('counts different words with the same code', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'ADA', 'DeVeLoPeRs'],
          lowerCase
        );

        expect(pd.count()).toBe(4);
      });
    });

    describe('addWord', () => {
      it('increases count by one for new words', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.count()).toBe(3);

        ['advanced', 'data', 'structures'].forEach((word, i) => {
          pd.addWord(word);
          expect(pd.count()).toBe(4 + i);
        });
      });

      it('ignores words added at initialization', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.count()).toBe(3);

        ['ada', 'developers', 'academy'].forEach((word, i) => {
          pd.addWord(word);
          expect(pd.count()).toBe(3);
        });
      });

      it('ignores words added after initialization', () => {
        const pd = new PrefixDictionary(
          [],
          identity
        );

        expect(pd.count()).toBe(0);

        ['ada', 'developers', 'academy'].forEach((word, i) => {
          pd.addWord(word);
          expect(pd.count()).toBe(1 + i);
        });

        ['ada', 'developers', 'academy'].forEach((word, i) => {
          pd.addWord(word);
          expect(pd.count()).toBe(3);
        });
      });

      it('counts different words with the same code', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.count()).toBe(3);

        ['ADA', 'DeVeLoPeRs', 'Academy'].forEach((word, i) => {
          pd.addWord(word);
          expect(pd.count()).toBe(4 + i);
        });
      });
    });

    describe('lookupCode', () => {
      it('finds a word matching the code', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.lookupCode('ada')).toStrictEqual(['ada']);
      });

      it('finds all words matching the code', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy', 'ADA', 'AdA'],
          lowerCase
        );

        expect(pd.lookupCode('ada')).toStrictEqual(['ada', 'ADA', 'AdA']);
      });

      it('finds words added after initialization', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          lowerCase
        );

        pd.addWord('ADA');
        pd.addWord('AdA');

        expect(pd.lookupCode('ada')).toStrictEqual(['ada', 'ADA', 'AdA']);
      });

      it('finds words added along an existing path', () => {
        const pd = new PrefixDictionary(
          ['adamant', 'developers', 'academy'],
          identity
        );

        pd.addWord('ada');

        expect(pd.lookupCode('ada')).toStrictEqual(['ada']);
      });

      it('returns an empty array if no words match', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.lookupCode('nope')).toStrictEqual([]);
      });

      it('ignores words where the code prefix matches', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        pd.addWord('adamant');

        expect(pd.lookupCode('ada')).toStrictEqual(['ada']);
      });
    });

    describe('lookupPrefix', () => {
      it('finds a word matching the prefix entirely', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.lookupPrefix('ada')).toStrictEqual(['ada']);
      });

      it('finds a word where the code starts with the prefix', () => {
        const pd = new PrefixDictionary(
          ['adamant', 'developers', 'academy'],
          identity
        );

        expect(pd.lookupPrefix('ada')).toStrictEqual(['adamant']);
      });

      it('finds all words matching the prefix', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy', 'ADA', 'AdA', 'adamant', 'AdAmAnT'],
          lowerCase
        );

        expect(pd.lookupPrefix('ada')).toStrictEqual(['ada', 'ADA', 'AdA', 'adamant', 'AdAmAnT']);
      });

      it('finds words added after initialization', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          lowerCase
        );

        pd.addWord('ADA');
        pd.addWord('adamant');

        expect(pd.lookupPrefix('ada')).toStrictEqual(['ada', 'ADA', 'adamant']);
      });

      it('finds words added along an existing path', () => {
        const pd = new PrefixDictionary(
          ['adamant', 'developers', 'academy'],
          identity
        );

        pd.addWord('ada');

        expect(pd.lookupPrefix('ada')).toStrictEqual(['ada', 'adamant']);
      });

      it('returns an empty array if no words match', () => {
        const pd = new PrefixDictionary(
          ['ada', 'developers', 'academy'],
          identity
        );

        expect(pd.lookupPrefix('nope')).toStrictEqual([]);
      });

      it('ignores words where the code is the prefix of the prefix', () => {
        const pd = new PrefixDictionary(
          ['ada', 'a', 'ad'],
          identity
        );

        expect(pd.lookupPrefix('ada')).toStrictEqual(['ada']);
      })
    });
  });
}) 