module.exports = {
  'binary-search': {
    ref: 'function search(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = (l + r) >> 1; if (nums[m] === target) return m; if (nums[m] < target) l = m + 1; else r = m - 1; } return -1; }',
    wrong: 'function search(nums, target) { let l = 0, r = nums.length - 1; while (l < r) { const m = (l + r) >> 1; if (nums[m] === target) return m; if (nums[m] < target) l = m + 1; else r = m - 1; } return -1; }'
  },
  'search-2d-matrix': {
    ref: 'function searchMatrix(matrix, target) { const n = matrix[0].length; let l = 0, r = matrix.length * n - 1; while (l <= r) { const m = (l + r) >> 1, v = matrix[Math.floor(m / n)][m % n]; if (v === target) return true; if (v < target) l = m + 1; else r = m - 1; } return false; }',
    wrong: 'function searchMatrix(matrix, target) { return matrix.some((row) => row[0] === target || row[row.length - 1] === target); }'
  },
  'eating-bananas': {
    ref: 'function minEatingSpeed(piles, h) { let l = 1, r = Math.max(...piles); while (l < r) { const k = Math.floor((l + r) / 2); let t = 0; for (const p of piles) t += Math.ceil(p / k); if (t <= h) r = k; else l = k + 1; } return l; }',
    wrong: 'function minEatingSpeed(piles, h) { const s = piles.reduce((a, b) => a + b, 0); return Math.max(1, Math.ceil(s / h)); }'
  },
  'find-minimum-in-rotated-sorted-array': {
    ref: 'function findMin(nums) { let l = 0, r = nums.length - 1; while (l < r) { const m = (l + r) >> 1; if (nums[m] > nums[r]) l = m + 1; else r = m; } return nums[l]; }',
    wrong: 'function findMin(nums) { let l = 0, r = nums.length - 1; while (l < r) { const m = (l + r) >> 1; if (nums[m] > nums[r]) l = m + 1; else r = m - 1; } return nums[l]; }'
  },
  'find-target-in-rotated-sorted-array': {
    ref: 'function search(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = (l + r) >> 1; if (nums[m] === target) return m; if (nums[l] <= nums[m]) { if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1; } else { if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1; } } return -1; }',
    wrong: 'function search(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = (l + r) >> 1; if (nums[m] === target) return m; if (nums[l] < nums[m]) { if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1; } else { if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1; } } return -1; }'
  },
  'time-based-key-value-store': {
    ref: 'class TimeMap { constructor() { this.m = new Map(); } set(key, value, timestamp) { if (!this.m.has(key)) this.m.set(key, []); this.m.get(key).push([timestamp, value]); } get(key, timestamp) { const a = this.m.get(key); if (!a) return ""; let l = 0, r = a.length - 1, res = ""; while (l <= r) { const mid = (l + r) >> 1; if (a[mid][0] <= timestamp) { res = a[mid][1]; l = mid + 1; } else r = mid - 1; } return res; } }',
    wrong: 'class TimeMap { constructor() { this.m = new Map(); } set(key, value, timestamp) { if (!this.m.has(key)) this.m.set(key, new Map()); this.m.get(key).set(timestamp, value); } get(key, timestamp) { const a = this.m.get(key); if (!a || !a.has(timestamp)) return ""; return a.get(timestamp); } }'
  },
  'median-of-two-sorted-arrays': {
    ref: 'function findMedianSortedArrays(a, b) { if (a.length > b.length) return findMedianSortedArrays(b, a); const m = a.length, n = b.length, half = (m + n + 1) >> 1; let lo = 0, hi = m; while (lo <= hi) { const i = (lo + hi) >> 1, j = half - i; const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity, bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity; if (aL <= bR && bL <= aR) { const L = Math.max(aL, bL); if ((m + n) % 2) return L; return (L + Math.min(aR, bR)) / 2; } if (aL > bR) hi = i - 1; else lo = i + 1; } return 0; }',
    wrong: 'function findMedianSortedArrays(a, b) { const med = (x) => { if (!x.length) return null; const n = x.length; return n % 2 ? x[(n - 1) / 2] : (x[n / 2 - 1] + x[n / 2]) / 2; }; const p = med(a), q = med(b); if (p === null) return q; if (q === null) return p; return (p + q) / 2; }'
  },
  'merge-two-sorted-linked-lists': {
    ref: 'function mergeTwoLists(list1, list2) { const d = new ListNode(0); let t = d; while (list1 && list2) { if (list1.val <= list2.val) { t.next = list1; list1 = list1.next; } else { t.next = list2; list2 = list2.next; } t = t.next; } t.next = list1 || list2; return d.next; }',
    wrong: 'function mergeTwoLists(list1, list2) { const d = new ListNode(0); let t = d; while (list1 && list2) { if (list1.val <= list2.val) { t.next = list1; list1 = list1.next; } else { t.next = list2; list2 = list2.next; } t = t.next; } return d.next; }'
  },
  'linked-list-cycle-detection': {
    ref: 'function hasCycle(head) { let s = head, f = head; while (f && f.next) { s = s.next; f = f.next.next; if (s === f) return true; } return false; }',
    wrong: 'function hasCycle(head) { const seen = new Set(); while (head) { if (seen.has(head.val)) return true; seen.add(head.val); head = head.next; } return false; }'
  },
  'reorder-linked-list': {
    ref: 'function reorderList(head) { let s = head, f = head; while (f && f.next) { s = s.next; f = f.next.next; } let prev = null, cur = s.next; s.next = null; while (cur) { const n = cur.next; cur.next = prev; prev = cur; cur = n; } let a = head, b = prev; while (b) { const an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; } }',
    wrong: 'function reorderList(head) { let s = head, f = head; while (f && f.next) { s = s.next; f = f.next.next; } let b = s.next; s.next = null; let a = head; while (b) { const an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; } }'
  },
  'remove-node-from-end-of-linked-list': {
    ref: 'function removeNthFromEnd(head, n) { const d = new ListNode(0, head); let f = d, s = d; for (let i = 0; i < n; i++) f = f.next; while (f.next) { f = f.next; s = s.next; } s.next = s.next.next; return d.next; }',
    wrong: 'function removeNthFromEnd(head, n) { let f = head, s = head; for (let i = 0; i < n; i++) f = f.next; while (f && f.next) { f = f.next; s = s.next; } s.next = s.next.next; return head; }'
  },
  'copy-linked-list-with-random-pointer': {
    ref: 'function copyRandomList(head) { const m = new Map(); for (let p = head; p; p = p.next) { const n = new ListNode(p.val); n.random = null; m.set(p, n); } for (let p = head; p; p = p.next) { const n = m.get(p); n.next = p.next ? m.get(p.next) : null; n.random = p.random ? m.get(p.random) : null; } return head ? m.get(head) : null; }',
    wrong: 'function copyRandomList(head) { const d = new ListNode(0); let t = d; for (let p = head; p; p = p.next) { const n = new ListNode(p.val); n.random = p.random; t.next = n; t = n; } return d.next; }'
  },
  'add-two-numbers': {
    ref: 'function addTwoNumbers(l1, l2) { const d = new ListNode(0); let t = d, c = 0; while (l1 || l2 || c) { const s = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + c; c = s >= 10 ? 1 : 0; t.next = new ListNode(s % 10); t = t.next; l1 = l1 ? l1.next : null; l2 = l2 ? l2.next : null; } return d.next; }',
    wrong: 'function addTwoNumbers(l1, l2) { const num = (l) => { let s = ""; for (; l; l = l.next) s = l.val + s; return Number(s); }; const digits = String(num(l1) + num(l2)).split("").reverse(); const d = new ListNode(0); let t = d; for (const x of digits) { t.next = new ListNode(Number(x)); t = t.next; } return d.next; }'
  },
  'find-duplicate-integer': {
    ref: 'function findDuplicate(nums) { let s = nums[0], f = nums[0]; do { s = nums[s]; f = nums[nums[f]]; } while (s !== f); s = nums[0]; while (s !== f) { s = nums[s]; f = nums[f]; } return s; }',
    wrong: 'function findDuplicate(nums) { nums.sort((a, b) => a - b); for (let i = 1; i < nums.length; i++) if (nums[i] === nums[i - 1]) return nums[i]; return -1; }'
  },
  'merge-k-sorted-linked-lists': {
    ref: 'function mergeKLists(lists) { function merge(a, b) { const d = new ListNode(0); let t = d; while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; } t.next = a || b; return d.next; } if (!lists.length) return null; let arr = lists.slice(); while (arr.length > 1) { const nx = []; for (let i = 0; i < arr.length; i += 2) nx.push(i + 1 < arr.length ? merge(arr[i], arr[i + 1]) : arr[i]); arr = nx; } return arr[0]; }',
    wrong: 'function mergeKLists(lists) { function merge(a, b) { const d = new ListNode(0); let t = d; while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; } t.next = a || b; return d.next; } let res = null; for (let i = 0; i < lists.length - 1; i++) res = merge(res, lists[i]); return res; }'
  },
  'reverse-nodes-in-k-group': {
    ref: 'function reverseKGroup(head, k) { const d = new ListNode(0, head); let prev = d; while (true) { let e = prev; for (let i = 0; i < k && e; i++) e = e.next; if (!e) break; const start = prev.next, after = e.next; let p = after, c = start; while (c !== after) { const n = c.next; c.next = p; p = c; c = n; } prev.next = e; prev = start; } return d.next; }',
    wrong: 'function reverseKGroup(head, k) { const d = new ListNode(0, head); let prev = d; while (prev.next) { let e = prev, cnt = 0; while (cnt < k && e.next) { e = e.next; cnt++; } const start = prev.next, after = e.next; let p = after, c = start; while (c !== after) { const n = c.next; c.next = p; p = c; c = n; } prev.next = e; prev = start; } return d.next; }'
  }
};
