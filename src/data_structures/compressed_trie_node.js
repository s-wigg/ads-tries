
class CompressedTrieNode {
  constructor(children = {}) {
    this.words = [];
    this.children = children;
  }

  findMatchingChild(searchCode, index) {
    for (let childCodeStr in this.children) {
      const childCode = childCodeStr.split('');
      let childCodeIndex = 0;
      let searchCodeIndex = index;
      while (childCodeIndex < childCode.length &&
        searchCodeIndex < searchCode.length &&
        childCode[childCodeIndex] === searchCode[searchCodeIndex]) {
        childCodeIndex += 1;
        searchCodeIndex += 1;
      }
      if (childCodeIndex > 0) {
        // Found a match
        return { childCode: childCodeStr, overlap: childCodeIndex };
      }
    };
    return { childCode: null, overlap: 0 };
  }

  insert(word, code, index = 0) {
    // Base case: word lives here!
    if (index === code.length) {
      if (this.words.includes(word)) {
        return false;
      }

      this.words.push(word);
      return true;
    }

    // Recursive case: word lives below us
    // Look for a child matching the next part of the code
    const { childCode, overlap } = this.findMatchingChild(code, index);
    let child;
    let newIndex;

    if (childCode) {
      if (overlap === childCode.length) {
        // Exact match, pass the buck
        child = this.children[childCode]
        newIndex = index + overlap;

      } else {
        // Partial match, need to split
        const newChildCode = childCode.slice(0, overlap);
        const grandchildCode = childCode.slice(overlap);

        const grandchild = this.children[childCode];
        delete this.children[childCode];  // remove our stale reference

        child = new CompressedTrieNode({ [grandchildCode]: grandchild });
        this.children[newChildCode] = child;
        newIndex = index + overlap;
      }

    } else {
      // No matching child found
      // Create a new node, add it to our list using all remaining code letters
      child = new CompressedTrieNode();

      const suffix = code.slice(index).join('');
      this.children[suffix] = child;

      newIndex = code.length;
    }

    return child.insert(word, code, newIndex);
  }

  lookup(code, index = 0) {
    if (index === code.length) {
      return this;
    }

    const { childCode, overlap } = this.findMatchingChild(code, index);
    if (childCode) {
      return this.children[childCode].lookup(code, index + overlap);
    } else {
      return null;
    }
  }

  // Copied wholesale from TrieNode
  gatherWords(words = []) {
    words.push(...this.words);
    Object.values(this.children).forEach(child => {
      child.gatherWords(words);
    });
    return words;
  }
}

export default CompressedTrieNode;