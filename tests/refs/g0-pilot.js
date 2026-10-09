module.exports = {
  'is-palindrome': {
    ref: 'function isPalindrome(s) { let l = 0, r = s.length - 1; const ok = (c) => /[a-z0-9]/i.test(c); while (l < r) { while (l < r && !ok(s[l])) l++; while (l < r && !ok(s[r])) r--; if (s[l].toLowerCase() !== s[r].toLowerCase()) return false; l++; r--; } return true; }',
    wrong: 'function isPalindrome(s) { return s === s.split("").reverse().join(""); }'
  },
  'reverse-a-linked-list': {
    ref: 'function reverseList(head) { let prev = null; while (head) { const n = head.next; head.next = prev; prev = head; head = n; } return prev; }',
    wrong: 'function reverseList(head) { return head; }'
  },
  'lru-cache': {
    ref: 'class LRUCache { constructor(c) { this.c = c; this.m = new Map(); } get(k) { if (!this.m.has(k)) return -1; const v = this.m.get(k); this.m.delete(k); this.m.set(k, v); return v; } put(k, v) { if (this.m.has(k)) this.m.delete(k); this.m.set(k, v); if (this.m.size > this.c) this.m.delete(this.m.keys().next().value); } }',
    wrong: 'class LRUCache { constructor(c) { this.c = c; this.m = new Map(); } get(k) { return this.m.has(k) ? this.m.get(k) : -1; } put(k, v) { this.m.set(k, v); if (this.m.size > this.c) this.m.delete(this.m.keys().next().value); } }'
  }
};
