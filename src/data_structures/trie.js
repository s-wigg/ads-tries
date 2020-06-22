class TrieNode {
  constructor() {
    this.words = [];
    this.children = {};
  }
}

class Trie {
  constructor(words, buildCode, Node = TrieNode) {
    this.Node = Node;
    this.buildCode = buildCode;
    this._root = new this.Node();
    this._count = 0;
    words.forEach((word) => this.addWord(word));
  }

  addWord(word) {
    const code = this.buildCode(word);
    if (this.lookupCode(code).includes(word)) {
      return;
    }
    this._count++;
    let node = this._root;

    for (const radix of code.split("")) {
      if (!node.children[radix]) {
        node.children[radix] = new TrieNode();
      }
      node = node.children[radix];
    }
    node.words.push(word);
    return node;
  }

  lookupCode(code) {
    const node = this._lookupCodeReturnNode(code);
    if (node && node.words) {
      return node.words;
    } else {
      return [];
    }
  }

  _lookupCodeReturnNode(code) {
    let node = this._root;
    for (const radix of code.split("")) {
      node = node.children[radix];
      if (!node) {
        return null;
      }
    }
    return node;
  }

  lookupPrefix(codePrefix) {
    let allWords = [];
    let node = this._lookupCodeReturnNode(codePrefix);
    if (!node) {
      return [];
    }
    return this._getAllWords(node, allWords);
  }

  _getAllWords(node, allWords) {
    allWords.push(...node.words);
    Object.values(node.children).forEach((child) => {
      this._getAllWords(child, allWords);
    });
    return allWords;
  }

  count() {
    return this._count;
  }
}

export default Trie;
