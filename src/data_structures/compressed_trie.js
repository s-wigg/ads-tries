import Trie from "./trie";
import CompressedTrieNode from './compressed_trie_node';

class CompressedTrie extends Trie {
  constructor(words, buildCode, Node = CompressedTrieNode) {
    // e z p z
    super(words, buildCode, Node);
  }
}

export default CompressedTrie;