import TrieNode from './trie_node';

class Trie {
  constructor(words, buildCode, Node=TrieNode) {
    this.Node = Node;
    this.buildCode = buildCode;
    this._root = new this.Node();
    this._count = 0;
    words.forEach(word => this.addWord(word));
  }

  addWord(word) {
    const code = this.buildCode(word);

    if (this._root.insert(word, code)) {
      this._count += 1;
    }
  }

  lookupCode(code) {
    const node = this._root.lookup(code);
    if (node) {
      return node.words;
    } else {
      return [];
    }
  }

  lookupPrefix(codePrefix) {
    const node = this._root.lookup(codePrefix);
    if (node) {
      return node.gatherWords();
    } else {
      return [];
    }
  }

  count() {
    return this._count;
  }
}

export default Trie;