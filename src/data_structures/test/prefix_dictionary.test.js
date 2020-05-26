import WordList from "../word_list";
import Trie from "../trie";
// import CompressedTrie from "../compressed_trie";

const dataStructures = [
  WordList,
  Trie,
  // CompressedTrie,
];

const identity = (word) => word.split('');

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
    })
  });
}) 