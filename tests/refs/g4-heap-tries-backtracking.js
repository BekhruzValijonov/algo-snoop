const HEAP = `class Heap { constructor(c) { this.a = []; this.c = c; } size() { return this.a.length; } peek() { return this.a[0]; }
  push(v) { const a = this.a; a.push(v); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.c(a[i], a[p]) < 0) { [a[i], a[p]] = [a[p], a[i]]; i = p; } else break; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && this.c(a[l], a[m]) < 0) m = l; if (r < a.length && this.c(a[r], a[m]) < 0) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; } }
`;

module.exports = {
  'kth-largest-integer-in-a-stream': {
    ref: HEAP + `class KthLargest { constructor(k, nums) { this.k = k; this.h = new Heap((a, b) => a - b); for (const x of nums) this.add(x); }
  add(val) { this.h.push(val); if (this.h.size() > this.k) this.h.pop(); return this.h.peek(); } }`,
    wrong: `class KthLargest { constructor(k, nums) { this.k = k; this.a = nums.slice(); } add(val) { this.a.push(val); this.a.sort((x, y) => x - y); return this.a[this.k - 1]; } }`
  },
  'last-stone-weight': {
    ref: HEAP + `function lastStoneWeight(stones) { const h = new Heap((a, b) => b - a); for (const s of stones) h.push(s);
  while (h.size() > 1) { const y = h.pop(), x = h.pop(); if (y !== x) h.push(y - x); } return h.size() ? h.peek() : 0; }`,
    wrong: `function lastStoneWeight(stones) { const a = stones.slice().sort((x, y) => y - x); while (a.length > 1) { const y = a.shift(), x = a.shift(); if (y !== x) a.push(y - x); } return a.length ? a[0] : 0; }`
  },
  'k-closest-points-to-origin': {
    ref: HEAP + `function kClosest(points, k) { const h = new Heap((a, b) => b[0] - a[0]);
  for (const p of points) { h.push([p[0] * p[0] + p[1] * p[1], p]); if (h.size() > k) h.pop(); }
  return h.a.map((e) => e[1]); }`,
    wrong: `function kClosest(points, k) { return points.slice().sort((a, b) => (Math.abs(a[0]) + Math.abs(a[1])) - (Math.abs(b[0]) + Math.abs(b[1]))).slice(0, k); }`
  },
  'kth-largest-element-in-an-array': {
    ref: HEAP + `function findKthLargest(nums, k) { const h = new Heap((a, b) => a - b); for (const x of nums) { h.push(x); if (h.size() > k) h.pop(); } return h.peek(); }`,
    wrong: `function findKthLargest(nums, k) { return nums.slice().sort((a, b) => a - b)[k - 1]; }`
  },
  'task-scheduling': {
    ref: HEAP + `function leastInterval(tasks, n) { const cnt = new Map(); for (const t of tasks) cnt.set(t, (cnt.get(t) || 0) + 1);
  const h = new Heap((a, b) => b - a); for (const v of cnt.values()) h.push(v);
  const q = []; let time = 0;
  while (h.size() || q.length) { time++;
    if (h.size()) { const c = h.pop() - 1; if (c > 0) q.push([c, time + n]); }
    if (q.length && q[0][1] === time) h.push(q.shift()[0]); }
  return time; }`,
    wrong: `function leastInterval(tasks, n) { const c = {}; let m = 0; for (const t of tasks) { c[t] = (c[t] || 0) + 1; m = Math.max(m, c[t]); } return Math.max(tasks.length, (m - 1) * (n + 1) + 1); }`
  },
  'design-twitter-feed': {
    ref: HEAP + `class Twitter { constructor() { this.t = 0; this.tw = new Map(); this.f = new Map(); }
  postTweet(u, id) { if (!this.tw.has(u)) this.tw.set(u, []); this.tw.get(u).push([this.t++, id]); }
  getNewsFeed(u) { const us = new Set(this.f.get(u) || []); us.add(u); const h = new Heap((a, b) => b[0] - a[0]);
    for (const x of us) { const l = this.tw.get(x); if (l && l.length) h.push([l[l.length - 1][0], l[l.length - 1][1], x, l.length - 1]); }
    const res = [];
    while (res.length < 10 && h.size()) { const e = h.pop(); res.push(e[1]); if (e[3] > 0) { const p = this.tw.get(e[2])[e[3] - 1]; h.push([p[0], p[1], e[2], e[3] - 1]); } }
    return res; }
  follow(a, b) { if (!this.f.has(a)) this.f.set(a, new Set()); this.f.get(a).add(b); }
  unfollow(a, b) { if (this.f.has(a)) this.f.get(a).delete(b); } }`,
    wrong: `class Twitter { constructor() { this.tw = []; this.f = new Map(); }
  postTweet(u, id) { this.tw.push([u, id]); }
  getNewsFeed(u) { const us = new Set(this.f.get(u) || []); us.add(u); return this.tw.filter((x) => us.has(x[0])).map((x) => x[1]).reverse().slice(0, 10); }
  follow(a, b) { if (!this.f.has(a)) this.f.set(a, new Set()); this.f.get(a).add(b); }
  unfollow(a, b) { } }`
  },
  'find-median-in-a-data-stream': {
    ref: HEAP + `class MedianFinder { constructor() { this.lo = new Heap((a, b) => b - a); this.hi = new Heap((a, b) => a - b); }
  addNum(x) { this.lo.push(x); this.hi.push(this.lo.pop()); if (this.hi.size() > this.lo.size()) this.lo.push(this.hi.pop()); }
  findMedian() { return this.lo.size() > this.hi.size() ? this.lo.peek() : (this.lo.peek() + this.hi.peek()) / 2; } }`,
    wrong: `class MedianFinder { constructor() { this.a = []; } addNum(x) { this.a.push(x); this.a.sort((p, q) => p - q); } findMedian() { return this.a[Math.floor((this.a.length - 1) / 2)]; } }`
  },
  'implement-prefix-tree': {
    ref: `class PrefixTree { constructor() { this.root = {}; }
  insert(w) { let n = this.root; for (const c of w) { if (!n[c]) n[c] = {}; n = n[c]; } n.end = true; }
  find(w) { let n = this.root; for (const c of w) { n = n[c]; if (!n) return null; } return n; }
  search(w) { const n = this.find(w); return !!(n && n.end); }
  startsWith(p) { return this.find(p) !== null; } }`,
    wrong: `class PrefixTree { constructor() { this.root = {}; }
  insert(w) { let n = this.root; for (const c of w) { if (!n[c]) n[c] = {}; n = n[c]; } n.end = true; }
  find(w) { let n = this.root; for (const c of w) { n = n[c]; if (!n) return null; } return n; }
  search(w) { return this.find(w) !== null; }
  startsWith(p) { return this.find(p) !== null; } }`
  },
  'design-word-search-data-structure': {
    ref: `class WordDictionary { constructor() { this.root = {}; }
  addWord(w) { let n = this.root; for (const c of w) { if (!n[c]) n[c] = {}; n = n[c]; } n.end = true; }
  search(w) { const go = (n, i) => { if (i === w.length) return !!n.end; const c = w[i];
      if (c === '.') { for (const k in n) if (k !== 'end' && go(n[k], i + 1)) return true; return false; }
      return n[c] ? go(n[c], i + 1) : false; };
    return go(this.root, 0); } }`,
    wrong: `class WordDictionary { constructor() { this.w = []; } addWord(w) { this.w.push(w); }
  search(q) { return this.w.some((x) => { for (let i = 0; i < q.length; i++) if (q[i] !== '.' && q[i] !== x[i]) return false; return true; }); } }`
  },
  'search-for-word-ii': {
    ref: `function findWords(board, words) {
  const root = {};
  for (const w of words) { let n = root; for (const c of w) { if (!n[c]) n[c] = {}; n = n[c]; } n.word = w; }
  const m = board.length, nn = board[0].length, res = [];
  function dfs(i, j, parent) {
    const c = board[i][j], node = parent[c];
    if (!node) return;
    if (node.word) { res.push(node.word); node.word = null; }
    board[i][j] = '#';
    if (i > 0 && board[i - 1][j] !== '#') dfs(i - 1, j, node);
    if (j > 0 && board[i][j - 1] !== '#') dfs(i, j - 1, node);
    if (i < m - 1 && board[i + 1][j] !== '#') dfs(i + 1, j, node);
    if (j < nn - 1 && board[i][j + 1] !== '#') dfs(i, j + 1, node);
    board[i][j] = c;
    let empty = true; for (const k in node) if (k !== 'word' && node[k]) { empty = false; break; }
    if (empty && !node.word) delete parent[c];
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < nn; j++) dfs(i, j, root);
  return res; }`,
    wrong: `function findWords(board, words) { const m = board.length, n = board[0].length;
  const has = (w) => { const go = (i, j, p) => { if (p === w.length) return true; if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== w[p]) return false; return go(i + 1, j, p + 1) || go(i - 1, j, p + 1) || go(i, j + 1, p + 1) || go(i, j - 1, p + 1); };
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (go(i, j, 0)) return true; return false; };
  return words.filter(has); }`
  },
  'subsets': {
    ref: `function subsets(nums) { const res = [], cur = []; (function go(i) { if (i === nums.length) { res.push(cur.slice()); return; } cur.push(nums[i]); go(i + 1); cur.pop(); go(i + 1); })(0); return res; }`,
    wrong: `function subsets(nums) { const res = [[]]; for (let i = 0; i < nums.length; i++) res.push([nums[i]]); return res; }`
  },
  'combination-target-sum': {
    ref: `function combinationSum(nums, target) { const res = [], cur = [];
  (function go(i, rem) { if (rem === 0) { res.push(cur.slice()); return; } if (i === nums.length || rem < 0) return;
    cur.push(nums[i]); go(i, rem - nums[i]); cur.pop(); go(i + 1, rem); })(0, target);
  return res; }`,
    wrong: `function combinationSum(nums, target) { const res = [], cur = [];
  (function go(i, rem) { if (rem === 0) { res.push(cur.slice()); return; } if (i === nums.length || rem < 0) return;
    cur.push(nums[i]); go(i + 1, rem - nums[i]); cur.pop(); go(i + 1, rem); })(0, target);
  return res; }`
  },
  'combination-target-sum-ii': {
    ref: `function combinationSum2(candidates, target) { const c = candidates.slice().sort((a, b) => a - b), res = [], cur = [];
  (function go(start, rem) { if (rem === 0) { res.push(cur.slice()); return; }
    for (let i = start; i < c.length && c[i] <= rem; i++) { if (i > start && c[i] === c[i - 1]) continue; cur.push(c[i]); go(i + 1, rem - c[i]); cur.pop(); } })(0, target);
  return res; }`,
    wrong: `function combinationSum2(candidates, target) { const c = candidates.slice().sort((a, b) => a - b), res = [], cur = [];
  (function go(start, rem) { if (rem === 0) { res.push(cur.slice()); return; }
    for (let i = start; i < c.length && c[i] <= rem; i++) { if (i > 0 && c[i] === c[i - 1]) continue; cur.push(c[i]); go(i + 1, rem - c[i]); cur.pop(); } })(0, target);
  return res; }`
  },
  'permutations': {
    ref: `function permute(nums) { const res = [], cur = [], used = new Array(nums.length).fill(false);
  (function go() { if (cur.length === nums.length) { res.push(cur.slice()); return; }
    for (let i = 0; i < nums.length; i++) { if (used[i]) continue; used[i] = true; cur.push(nums[i]); go(); cur.pop(); used[i] = false; } })();
  return res; }`,
    wrong: `function permute(nums) { const res = []; for (let s = 0; s < nums.length; s++) res.push(nums.slice(s).concat(nums.slice(0, s))); return res; }`
  },
  'subsets-ii': {
    ref: `function subsetsWithDup(nums) { const a = nums.slice().sort((x, y) => x - y), res = [], cur = [];
  (function go(start) { res.push(cur.slice()); for (let i = start; i < a.length; i++) { if (i > start && a[i] === a[i - 1]) continue; cur.push(a[i]); go(i + 1); cur.pop(); } })(0);
  return res; }`,
    wrong: `function subsetsWithDup(nums) { const a = nums.slice().sort((x, y) => x - y), res = [], cur = [];
  (function go(start) { res.push(cur.slice()); for (let i = start; i < a.length; i++) { cur.push(a[i]); go(i + 1); cur.pop(); } })(0);
  return res; }`
  },
  'generate-parentheses': {
    ref: `function generateParenthesis(n) { const res = []; (function go(s, open, close) { if (s.length === 2 * n) { res.push(s); return; } if (open < n) go(s + '(', open + 1, close); if (close < open) go(s + ')', open, close + 1); })('', 0, 0); return res; }`,
    wrong: `function generateParenthesis(n) { const res = []; (function go(s, open, close) { if (s.length === 2 * n) { res.push(s); return; } if (open < n) go(s + '(', open + 1, close); if (close < n) go(s + ')', open, close + 1); })('', 0, 0); return res; }`
  },
  'search-for-word': {
    ref: `function exist(board, word) { const m = board.length, n = board[0].length;
  const cnt = {}; for (const row of board) for (const ch of row) cnt[ch] = (cnt[ch] || 0) + 1;
  for (const ch of word) { if (!cnt[ch]) return false; cnt[ch]--; }
  function go(i, j, p) { if (p === word.length) return true; if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== word[p]) return false;
    const c = board[i][j]; board[i][j] = '#'; const f = go(i + 1, j, p + 1) || go(i - 1, j, p + 1) || go(i, j + 1, p + 1) || go(i, j - 1, p + 1); board[i][j] = c; return f; }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (go(i, j, 0)) return true;
  return false; }`,
    wrong: `function exist(board, word) { const m = board.length, n = board[0].length;
  function go(i, j, p) { if (p === word.length) return true; if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== word[p]) return false;
    const c = board[i][j]; board[i][j] = '#'; const f = go(i + 1, j, p + 1) || go(i, j + 1, p + 1) || go(i, j - 1, p + 1); board[i][j] = c; return f; }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (go(i, j, 0)) return true;
  return false; }`
  },
  'palindrome-partitioning': {
    ref: `function partition(s) { const res = [], cur = [];
  const isPal = (l, r) => { while (l < r) { if (s[l++] !== s[r--]) return false; } return true; };
  (function go(start) { if (start === s.length) { res.push(cur.slice()); return; }
    for (let end = start; end < s.length; end++) if (isPal(start, end)) { cur.push(s.slice(start, end + 1)); go(end + 1); cur.pop(); } })(0);
  return res; }`,
    wrong: `function partition(s) { const res = [], cur = [];
  const isPal = (l, r) => { while (l < r) { if (s[l++] !== s[r--]) return false; } return true; };
  (function go(start) { if (start === s.length) { res.push(cur.slice()); return; }
    for (let end = start; end < Math.min(s.length, start + 2); end++) if (isPal(start, end)) { cur.push(s.slice(start, end + 1)); go(end + 1); cur.pop(); } })(0);
  return res; }`
  },
  'combinations-of-a-phone-number': {
    ref: `function letterCombinations(digits) { if (!digits.length) return [];
  const map = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' }, res = [];
  (function go(i, cur) { if (i === digits.length) { res.push(cur); return; } for (const ch of map[digits[i]]) go(i + 1, cur + ch); })(0, '');
  return res; }`,
    wrong: `function letterCombinations(digits) { if (!digits.length) return [];
  const map = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqr', 8: 'tuv', 9: 'wxy' }, res = [];
  (function go(i, cur) { if (i === digits.length) { res.push(cur); return; } for (const ch of map[digits[i]]) go(i + 1, cur + ch); })(0, '');
  return res; }`
  },
  'n-queens': {
    ref: `function solveNQueens(n) { const res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), pos = [];
  (function go(r) { if (r === n) { res.push(pos.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1))); return; }
    for (let c = 0; c < n; c++) { if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); pos.push(c); go(r + 1); pos.pop(); cols.delete(c); d1.delete(r - c); d2.delete(r + c); } })(0);
  return res; }`,
    wrong: `function solveNQueens(n) { const res = [], cols = new Set(), d1 = new Set(), pos = [];
  (function go(r) { if (r === n) { res.push(pos.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1))); return; }
    for (let c = 0; c < n; c++) { if (cols.has(c) || d1.has(r - c)) continue;
      cols.add(c); d1.add(r - c); pos.push(c); go(r + 1); pos.pop(); cols.delete(c); d1.delete(r - c); } })(0);
  return res; }`
  }
};
