class NRTrieNode {
  constructor(word) {
    this.words = [];
    this.children = {};
  }

  gatherWords(words = []) {
    words.push(...this.words);
    Object.values(this.children).forEach(child => {
      child.gatherWords(words);
    });
    return words;
  }
}

class NonrecursiveTrie {
  constructor(words, buildCode, Node=NRTrieNode) {
    this.Node = Node;
    this.buildCode = buildCode;
    this._root = new this.Node();
    this._count = 0;
    words.forEach(word => this.addWord(word));
  }

  addWord(word) {
    const code = this.buildCode(word);

    let node = this._root;

    for (let index = 0; index < code.length; index += 1) {
      const letter = code[index];
      let child = node.children[letter];
      if (!child) {
        child = new this.Node();
        node.children[letter] = child;
      }

      node = child;
    }

    if (!node.words.includes(word)) {
      node.words.push(word);
      this._count += 1;
    }
  }

  _findNode(code) {
    let node = this._root;
    for (let index = 0; index < code.length && node; index += 1) {
      node = node.children[code[index]];
    }
    return node;
  }

  lookupCode(code) {
    const node = this._findNode(code);
    if (node) {
      return node.words;
    } else {
      return [];
    }
  }

  lookupPrefix(codePrefix) {
    const node = this._findNode(codePrefix);
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

export default NonrecursiveTrie;