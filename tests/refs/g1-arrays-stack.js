module.exports = {
  'string-encode-and-decode': {
    ref: 'function encode(strs) { let out = ""; for (const s of strs) out += s.length + "#" + s; return out; } function decode(s) { const res = []; let i = 0; while (i < s.length) { let j = i; while (s[j] !== "#") j++; const len = parseInt(s.slice(i, j), 10); res.push(s.slice(j + 1, j + 1 + len)); i = j + 1 + len; } return res; }',
    wrong: 'function encode(strs) { return strs.join("#"); } function decode(s) { return s.split("#"); }'
  },
  'products-of-array-discluding-self': {
    ref: 'function productExceptSelf(nums) { const n = nums.length, out = new Array(n).fill(1); let p = 1; for (let i = 0; i < n; i++) { out[i] = p; p *= nums[i]; } let s = 1; for (let i = n - 1; i >= 0; i--) { out[i] *= s; s *= nums[i]; } return out; }',
    wrong: 'function productExceptSelf(nums) { const total = nums.reduce((a, b) => a * b, 1); return nums.map((x) => total / x); }'
  },
  'valid-sudoku': {
    ref: 'function isValidSudoku(board) { const seen = new Set(); for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) { const v = board[r][c]; if (v === ".") continue; const keys = ["r" + r + v, "c" + c + v, "b" + Math.floor(r / 3) + Math.floor(c / 3) + v]; for (const k of keys) { if (seen.has(k)) return false; seen.add(k); } } return true; }',
    wrong: 'function isValidSudoku(board) { for (let i = 0; i < 9; i++) { const row = new Set(), col = new Set(); for (let j = 0; j < 9; j++) { const a = board[i][j], b = board[j][i]; if (a !== ".") { if (row.has(a)) return false; row.add(a); } if (b !== ".") { if (col.has(b)) return false; col.add(b); } } } return true; }'
  },
  'two-integer-sum-ii': {
    ref: 'function twoSum(numbers, target) { let l = 0, r = numbers.length - 1; while (l < r) { const s = numbers[l] + numbers[r]; if (s === target) return [l + 1, r + 1]; if (s < target) l++; else r--; } return []; }',
    wrong: 'function twoSum(numbers, target) { let l = 0, r = numbers.length - 1; while (l < r) { const s = numbers[l] + numbers[r]; if (s === target) return [l, r]; if (s < target) l++; else r--; } return []; }'
  },
  'three-integer-sum': {
    ref: 'function threeSum(nums) { nums = nums.slice().sort((a, b) => a - b); const res = []; for (let i = 0; i < nums.length - 2; i++) { if (nums[i] > 0) break; if (i > 0 && nums[i] === nums[i - 1]) continue; let l = i + 1, r = nums.length - 1; while (l < r) { const s = nums[i] + nums[l] + nums[r]; if (s < 0) l++; else if (s > 0) r--; else { res.push([nums[i], nums[l], nums[r]]); l++; r--; while (l < r && nums[l] === nums[l - 1]) l++; } } } return res; }',
    wrong: 'function threeSum(nums) { nums = nums.slice().sort((a, b) => a - b); const res = []; for (let i = 0; i < nums.length - 2; i++) { let l = i + 1, r = nums.length - 1; while (l < r) { const s = nums[i] + nums[l] + nums[r]; if (s < 0) l++; else if (s > 0) r--; else { res.push([nums[i], nums[l], nums[r]]); l++; r--; } } } return res; }'
  },
  'max-water-container': {
    ref: 'function maxArea(height) { let l = 0, r = height.length - 1, best = 0; while (l < r) { best = Math.max(best, (r - l) * Math.min(height[l], height[r])); if (height[l] < height[r]) l++; else r--; } return best; }',
    wrong: 'function maxArea(height) { let l = 0, r = height.length - 1, best = 0; while (l < r) { best = Math.max(best, (r - l) * Math.min(height[l], height[r])); l++; r--; } return best; }'
  },
  'trapping-rain-water': {
    ref: 'function trap(height) { let l = 0, r = height.length - 1, lm = 0, rm = 0, res = 0; while (l < r) { if (height[l] < height[r]) { lm = Math.max(lm, height[l]); res += lm - height[l]; l++; } else { rm = Math.max(rm, height[r]); res += rm - height[r]; r--; } } return res; }',
    wrong: 'function trap(height) { let res = 0, lm = 0; for (let i = 0; i < height.length; i++) { lm = Math.max(lm, height[i]); res += lm - height[i]; } return res; }'
  },
  'buy-and-sell-crypto': {
    ref: 'function maxProfit(prices) { let min = Infinity, best = 0; for (const p of prices) { min = Math.min(min, p); best = Math.max(best, p - min); } return best; }',
    wrong: 'function maxProfit(prices) { return Math.max(0, Math.max(...prices) - Math.min(...prices)); }'
  },
  'longest-substring-without-duplicates': {
    ref: 'function lengthOfLongestSubstring(s) { const last = new Map(); let l = 0, best = 0; for (let r = 0; r < s.length; r++) { if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1; last.set(s[r], r); best = Math.max(best, r - l + 1); } return best; }',
    wrong: 'function lengthOfLongestSubstring(s) { let seen = new Set(), best = 0, start = 0; for (let i = 0; i < s.length; i++) { if (seen.has(s[i])) { seen = new Set(); start = i; } seen.add(s[i]); best = Math.max(best, i - start + 1); } return best; }'
  },
  'longest-repeating-substring-with-replacement': {
    ref: 'function characterReplacement(s, k) { const cnt = {}; let l = 0, mx = 0, best = 0; for (let r = 0; r < s.length; r++) { cnt[s[r]] = (cnt[s[r]] || 0) + 1; mx = Math.max(mx, cnt[s[r]]); while (r - l + 1 - mx > k) { cnt[s[l]]--; l++; } best = Math.max(best, r - l + 1); } return best; }',
    wrong: 'function characterReplacement(s, k) { const cnt = {}; let l = 0, mx = 0, best = 0; for (let r = 0; r < s.length; r++) { cnt[s[r]] = (cnt[s[r]] || 0) + 1; mx = Math.max(mx, cnt[s[r]]); while (r - l + 1 - mx >= k) { cnt[s[l]]--; l++; } best = Math.max(best, r - l + 1); } return best; }'
  },
  'permutation-string': {
    ref: 'function checkInclusion(s1, s2) { if (s1.length > s2.length) return false; const a = new Array(26).fill(0), b = new Array(26).fill(0); const code = (c) => c.charCodeAt(0) - 97; for (let i = 0; i < s1.length; i++) { a[code(s1[i])]++; b[code(s2[i])]++; } let match = 0; for (let i = 0; i < 26; i++) if (a[i] === b[i]) match++; for (let i = s1.length; ; i++) { if (match === 26) return true; if (i >= s2.length) return false; const add = code(s2[i]), rem = code(s2[i - s1.length]); b[add]++; if (b[add] === a[add]) match++; else if (b[add] === a[add] + 1) match--; b[rem]--; if (b[rem] === a[rem]) match++; else if (b[rem] === a[rem] - 1) match--; } }',
    wrong: 'function checkInclusion(s1, s2) { return s2.includes(s1); }'
  },
  'minimum-window-with-characters': {
    ref: 'function minWindow(s, t) { const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1; let missing = t.length, l = 0, bestL = 0, bestLen = Infinity; for (let r = 0; r < s.length; r++) { if (need[s[r]] !== undefined) { if (need[s[r]] > 0) missing--; need[s[r]]--; } while (missing === 0) { if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; } if (need[s[l]] !== undefined) { need[s[l]]++; if (need[s[l]] > 0) missing++; } l++; } } return bestLen === Infinity ? "" : s.substr(bestL, bestLen); }',
    wrong: 'function minWindow(s, t) { const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1; let missing = t.length; for (let r = 0; r < s.length; r++) { if (need[s[r]] !== undefined) { if (need[s[r]] > 0) missing--; need[s[r]]--; } if (missing === 0) { let l = 0; while (need[s[l]] === undefined) l++; return s.slice(l, r + 1); } } return ""; }'
  },
  'sliding-window-maximum': {
    ref: 'function maxSlidingWindow(nums, k) { const dq = [], res = []; let head = 0; for (let i = 0; i < nums.length; i++) { while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop(); dq.push(i); if (dq[head] <= i - k) head++; if (i >= k - 1) res.push(nums[dq[head]]); } return res; }',
    wrong: 'function maxSlidingWindow(nums, k) { const res = []; for (let i = 0; i + k < nums.length; i++) res.push(Math.max(...nums.slice(i, i + k))); return res; }'
  },
  'validate-parentheses': {
    ref: 'function isValid(s) { const pair = { ")": "(", "]": "[", "}": "{" }, st = []; for (const c of s) { if (pair[c] === undefined) st.push(c); else if (st.pop() !== pair[c]) return false; } return st.length === 0; }',
    wrong: 'function isValid(s) { const n = (c) => s.split(c).length - 1; return n("(") === n(")") && n("[") === n("]") && n("{") === n("}"); }'
  },
  'minimum-stack': {
    ref: 'class MinStack { constructor() { this.s = []; this.m = []; } push(v) { this.s.push(v); this.m.push(this.m.length ? Math.min(v, this.m[this.m.length - 1]) : v); } pop() { this.s.pop(); this.m.pop(); } top() { return this.s[this.s.length - 1]; } getMin() { return this.m[this.m.length - 1]; } }',
    wrong: 'class MinStack { constructor() { this.s = []; this.min = Infinity; } push(v) { this.s.push(v); if (v < this.min) this.min = v; } pop() { this.s.pop(); } top() { return this.s[this.s.length - 1]; } getMin() { return this.min; } }'
  },
  'evaluate-reverse-polish-notation': {
    ref: 'function evalRPN(tokens) { const st = []; for (const t of tokens) { if (t === "+" || t === "-" || t === "*" || t === "/") { const b = st.pop(), a = st.pop(); st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b)); } else st.push(Number(t)); } return st[0]; }',
    wrong: 'function evalRPN(tokens) { const st = []; for (const t of tokens) { if (t === "+" || t === "-" || t === "*" || t === "/") { const b = st.pop(), a = st.pop(); st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.floor(a / b)); } else st.push(Number(t)); } return st[0]; }'
  },
  'daily-temperatures': {
    ref: 'function dailyTemperatures(temperatures) { const res = new Array(temperatures.length).fill(0), st = []; for (let i = 0; i < temperatures.length; i++) { while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) { const j = st.pop(); res[j] = i - j; } st.push(i); } return res; }',
    wrong: 'function dailyTemperatures(temperatures) { const res = new Array(temperatures.length).fill(0), st = []; for (let i = 0; i < temperatures.length; i++) { while (st.length && temperatures[st[st.length - 1]] <= temperatures[i]) { const j = st.pop(); res[j] = i - j; } st.push(i); } return res; }'
  },
  'car-fleet': {
    ref: 'function carFleet(target, position, speed) { const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]); let fleets = 0, slowest = 0; for (const [p, s] of cars) { const t = (target - p) / s; if (t > slowest) { fleets++; slowest = t; } } return fleets; }',
    wrong: 'function carFleet(target, position, speed) { return new Set(position.map((p, i) => (target - p) / speed[i])).size; }'
  },
  'largest-rectangle-in-histogram': {
    ref: 'function largestRectangleArea(heights) { const st = []; let best = 0; for (let i = 0; i <= heights.length; i++) { const h = i === heights.length ? 0 : heights[i]; let start = i; while (st.length && st[st.length - 1][1] > h) { const [idx, hh] = st.pop(); best = Math.max(best, hh * (i - idx)); start = idx; } st.push([start, h]); } return best; }',
    wrong: 'function largestRectangleArea(heights) { let best = 0, mn = Infinity; for (const h of heights) { best = Math.max(best, h); mn = Math.min(mn, h); } return Math.max(best, mn * heights.length); }'
  }
};
