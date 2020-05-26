class TrieNode {
  constructor() {
    this.words = [];
    this.children = {};
  }

  insert(word, code, index = 0) {
    if (index === code.length) {
      if (this.words.includes(word)) {
        return false;
      }

      this.words.push(word);
      return true;
    }

    const letter = code[index];
    let child = this.children[letter];
    if (!child) {
      child = new TrieNode();
      this.children[letter] = child;
    }
    return child.insert(word, code, index + 1);
  }

  lookup(code, index = 0) {
    if (index === code.length) {
      return this;
    }

    const letter = code[index];
    let child = this.children[letter];
    if (child) {
      return child.lookup(code, index - 1);
    }
  }
}

class Trie {
  constructor(words, buildCode) {
    this.buildCode = buildCode;
    this._root = new TrieNode();
    this._count = 0;
    words.forEach(word => this.addWord(word));
  }

  addWord(word) {
    const code = this.buildCode(word);
    // code is an array, like [2, 3, 2]

    if (this._root.insert(word, code)) {
      this._count += 1;
    }
  }

  contains(code) {
    return !!this._root.lookup(code);
  }

  lookupPrefix(codePrefix) {
    const node = this._root.lookup(code);
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