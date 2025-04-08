class TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;
  
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  export class Trie {
    root: TrieNode;
  
    constructor() {
      this.root = new TrieNode();
    }
  
    // 단어 삽입
    insert(word: string) {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    // 접두사 검색 (자동완성)
    searchPrefix(prefix: string): string[] {
      let node = this.root;
      for (const char of prefix) {
        if (!node.children[char]) return [];
        node = node.children[char];
      }
  
      const results: string[] = [];
      this.collectWords(node, prefix, results);
      return results;
    }
  
    // 자동완성 단어 수집 (DFS)
    private collectWords(node: TrieNode, prefix: string, results: string[]) {
      if (node.isEndOfWord) results.push(prefix);
  
      for (const char in node.children) {
        this.collectWords(node.children[char], prefix + char, results);
      }
    }
  }

// 여행 관련 자동완성 단어 추가
export const trie = new Trie();
const words = [
    "배낭여행", "국내여행", "여행후기", "숙소추천", "호텔리뷰", "호캉스",
    "게스트하우스", "캠핑장추천", "강릉여행", "속초여행", "제주도여행", "부산여행",
    "전주한옥마을", "서울맛집여행", "기차여행", "KTX 여행", "자전거여행",
    "여행코스", "여행일정", "도보여행", "야경명소", "휴양지추천", "온천여행",
    "캠핑여행", "등산코스", "섬여행", "국립공원", "한옥스테이", "바다뷰호텔"
];

// Trie에 단어 삽입
words.forEach((word) => trie.insert(word));
