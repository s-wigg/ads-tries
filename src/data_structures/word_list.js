class WordList {
  constructor(words = [], buildCode) {
    this.buildCode = buildCode;

    const uniqueWords = words.filter((v, i, a) => a.indexOf(v) === i);
    this.words = uniqueWords.map(word => {
      return {
        text: word,
        code: this.buildCode(word),
      }
    });
  }

  // Build incrementally
  addWord(word) {
    if (this.words.find(w => w.text === word)) {
      return;
    }

    this.words.push({
      text: word,
      code: this.buildCode(word),
    });
  }

  // prefix should be an string of numbers
  lookupPrefix(prefix) {
    return this.words
      .filter(word => word.code.startsWith(prefix))
      .map(word => word.text);
  }

  count() {
    return this.words.length;
  }
}

export default WordList;