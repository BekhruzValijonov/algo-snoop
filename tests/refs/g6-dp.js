module.exports = {
  'climbing-stairs': {
    ref: `function climbStairs(n) { let a = 1, b = 1; for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; } return b; }`,
    wrong: `function climbStairs(n) { if (n <= 2) return n; let a = 1, b = 2; for (let i = 3; i < n; i++) { const c = a + b; a = b; b = c; } return b; }`
  },
  'min-cost-climbing-stairs': {
    ref: `function minCostClimbingStairs(cost) { let a = 0, b = 0; for (let i = 2; i <= cost.length; i++) { const c = Math.min(b + cost[i - 1], a + cost[i - 2]); a = b; b = c; } return b; }`,
    wrong: `function minCostClimbingStairs(cost) { const dp = cost.slice(); for (let i = 2; i < cost.length; i++) dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]); return dp[cost.length - 1]; }`
  },
  'house-robber': {
    ref: `function rob(nums) { let a = 0, b = 0; for (const x of nums) { const c = Math.max(b, a + x); a = b; b = c; } return b; }`,
    wrong: `function rob(nums) { let e = 0, o = 0; for (let i = 0; i < nums.length; i++) { if (i % 2 === 0) e += nums[i]; else o += nums[i]; } return Math.max(e, o); }`
  },
  'house-robber-ii': {
    ref: `function rob(nums) { if (nums.length === 1) return nums[0]; const f = (l, r) => { let a = 0, b = 0; for (let i = l; i <= r; i++) { const c = Math.max(b, a + nums[i]); a = b; b = c; } return b; }; return Math.max(f(0, nums.length - 2), f(1, nums.length - 1)); }`,
    wrong: `function rob(nums) { let a = 0, b = 0; for (const x of nums) { const c = Math.max(b, a + x); a = b; b = c; } return b; }`
  },
  'longest-palindromic-substring': {
    ref: `function longestPalindrome(s) { let bs = 0, bl = 1; for (let c = 0; c < s.length; c++) { for (let k = 0; k < 2; k++) { let l = c, r = c + k; while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } if (r - l - 1 > bl) { bl = r - l - 1; bs = l + 1; } } } return s.substr(bs, bl); }`,
    wrong: `function longestPalindrome(s) { let bs = 0, bl = 1; for (let c = 0; c < s.length; c++) { let l = c, r = c; while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } if (r - l - 1 > bl) { bl = r - l - 1; bs = l + 1; } } return s.substr(bs, bl); }`
  },
  'palindromic-substrings': {
    ref: `function countSubstrings(s) { let cnt = 0; for (let c = 0; c < s.length; c++) { for (let k = 0; k < 2; k++) { let l = c, r = c + k; while (l >= 0 && r < s.length && s[l] === s[r]) { cnt++; l--; r++; } } } return cnt; }`,
    wrong: `function countSubstrings(s) { let cnt = 0; for (let c = 0; c < s.length; c++) { let l = c, r = c; while (l >= 0 && r < s.length && s[l] === s[r]) { cnt++; l--; r++; } } return cnt; }`
  },
  'decode-ways': {
    ref: `function numDecodings(s) { const n = s.length; const dp = new Array(n + 1).fill(0); dp[0] = 1; for (let i = 1; i <= n; i++) { if (s[i - 1] !== '0') dp[i] += dp[i - 1]; if (i >= 2 && s[i - 2] !== '0' && Number(s.slice(i - 2, i)) <= 26) dp[i] += dp[i - 2]; } return dp[n]; }`,
    wrong: `function numDecodings(s) { const n = s.length; const dp = new Array(n + 1).fill(0); dp[0] = 1; dp[1] = 1; for (let i = 2; i <= n; i++) { dp[i] = dp[i - 1]; const v = Number(s.slice(i - 2, i)); if (v >= 10 && v <= 26) dp[i] += dp[i - 2]; } return dp[n]; }`
  },
  'coin-change': {
    ref: `function coinChange(coins, amount) { const dp = new Array(amount + 1).fill(Infinity); dp[0] = 0; for (let a = 1; a <= amount; a++) { for (const c of coins) { if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1; } } return dp[amount] === Infinity ? -1 : dp[amount]; }`,
    wrong: `function coinChange(coins, amount) { const cs = coins.slice().sort((a, b) => b - a); let cnt = 0; for (const c of cs) { cnt += Math.floor(amount / c); amount %= c; } return amount === 0 ? cnt : -1; }`
  },
  'maximum-product-subarray': {
    ref: `function maxProduct(nums) { let mx = nums[0], mn = nums[0], res = nums[0]; for (let i = 1; i < nums.length; i++) { const x = nums[i]; const a = mx * x, b = mn * x; mx = Math.max(x, a, b); mn = Math.min(x, a, b); res = Math.max(res, mx); } return res; }`,
    wrong: `function maxProduct(nums) { let mx = nums[0], res = nums[0]; for (let i = 1; i < nums.length; i++) { mx = Math.max(nums[i], mx * nums[i]); res = Math.max(res, mx); } return res; }`
  },
  'word-break': {
    ref: `function wordBreak(s, wordDict) { const set = new Set(wordDict); const dp = new Array(s.length + 1).fill(false); dp[0] = true; for (let i = 1; i <= s.length; i++) { for (let j = Math.max(0, i - 20); j < i; j++) { if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; } } } return dp[s.length]; }`,
    wrong: `function wordBreak(s, wordDict) { let i = 0; while (i < s.length) { let hit = null; for (const w of wordDict) { if (s.startsWith(w, i) && (hit === null || w.length > hit.length)) hit = w; } if (hit === null) return false; i += hit.length; } return true; }`
  },
  'longest-increasing-subsequence': {
    ref: `function lengthOfLIS(nums) { const t = []; for (const x of nums) { let l = 0, r = t.length; while (l < r) { const m = (l + r) >> 1; if (t[m] < x) l = m + 1; else r = m; } t[l] = x; } return t.length; }`,
    wrong: `function lengthOfLIS(nums) { const t = []; for (const x of nums) { let l = 0, r = t.length; while (l < r) { const m = (l + r) >> 1; if (t[m] <= x) l = m + 1; else r = m; } t[l] = x; } return t.length; }`
  },
  'partition-equal-subset-sum': {
    ref: `function canPartition(nums) { const sum = nums.reduce((a, b) => a + b, 0); if (sum % 2) return false; const h = sum / 2; const dp = new Array(h + 1).fill(false); dp[0] = true; for (const x of nums) { for (let j = h; j >= x; j--) { if (dp[j - x]) dp[j] = true; } } return dp[h]; }`,
    wrong: `function canPartition(nums) { return nums.reduce((a, b) => a + b, 0) % 2 === 0; }`
  },
  'count-paths': {
    ref: `function uniquePaths(m, n) { const dp = new Array(n).fill(1); for (let i = 1; i < m; i++) { for (let j = 1; j < n; j++) dp[j] += dp[j - 1]; } return dp[n - 1]; }`,
    wrong: `function uniquePaths(m, n) { const dp = new Array(n).fill(1); for (let i = 2; i < m; i++) { for (let j = 1; j < n; j++) dp[j] += dp[j - 1]; } return dp[n - 1]; }`
  },
  'longest-common-subsequence': {
    ref: `function longestCommonSubsequence(text1, text2) { const n = text1.length, m = text2.length; let prev = new Array(m + 1).fill(0); for (let i = 1; i <= n; i++) { const cur = new Array(m + 1).fill(0); for (let j = 1; j <= m; j++) cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]); prev = cur; } return prev[m]; }`,
    wrong: `function longestCommonSubsequence(text1, text2) { const n = text1.length, m = text2.length; let prev = new Array(m + 1).fill(0), best = 0; for (let i = 1; i <= n; i++) { const cur = new Array(m + 1).fill(0); for (let j = 1; j <= m; j++) { cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : 0; if (cur[j] > best) best = cur[j]; } prev = cur; } return best; }`
  },
  'buy-and-sell-crypto-with-cooldown': {
    ref: `function maxProfit(prices) { let hold = -Infinity, sold = 0, rest = 0; for (const p of prices) { const prevSold = sold; sold = hold + p; hold = Math.max(hold, rest - p); rest = Math.max(rest, prevSold); } return Math.max(sold, rest); }`,
    wrong: `function maxProfit(prices) { let res = 0; for (let i = 1; i < prices.length; i++) if (prices[i] > prices[i - 1]) res += prices[i] - prices[i - 1]; return res; }`
  },
  'coin-change-ii': {
    ref: `function change(coins, amount) { const dp = new Array(amount + 1).fill(0); dp[0] = 1; for (const c of coins) { for (let a = c; a <= amount; a++) dp[a] += dp[a - c]; } return dp[amount]; }`,
    wrong: `function change(coins, amount) { const dp = new Array(amount + 1).fill(0); dp[0] = 1; for (let a = 1; a <= amount; a++) { for (const c of coins) { if (c <= a) dp[a] += dp[a - c]; } } return dp[amount]; }`
  },
  'target-sum': {
    ref: `function findTargetSumWays(nums, target) { const total = nums.reduce((a, b) => a + b, 0); if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0; const s = (total + target) / 2; const dp = new Array(s + 1).fill(0); dp[0] = 1; for (const x of nums) { for (let j = s; j >= x; j--) dp[j] += dp[j - x]; } return dp[s]; }`,
    wrong: `function findTargetSumWays(nums, target) { nums = nums.filter((x) => x > 0); const total = nums.reduce((a, b) => a + b, 0); if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0; const s = (total + target) / 2; const dp = new Array(s + 1).fill(0); dp[0] = 1; for (const x of nums) { for (let j = s; j >= x; j--) dp[j] += dp[j - x]; } return dp[s]; }`
  },
  'interleaving-string': {
    ref: `function isInterleave(s1, s2, s3) { const n = s1.length, m = s2.length; if (n + m !== s3.length) return false; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false)); dp[0][0] = true; for (let i = 0; i <= n; i++) { for (let j = 0; j <= m; j++) { if (i > 0 && dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) dp[i][j] = true; if (j > 0 && dp[i][j - 1] && s2[j - 1] === s3[i + j - 1]) dp[i][j] = true; } } return dp[n][m]; }`,
    wrong: `function isInterleave(s1, s2, s3) { return s3 === s1 + s2 || s3 === s2 + s1; }`
  },
  'longest-increasing-path-in-matrix': {
    ref: `function longestIncreasingPath(matrix) { const R = matrix.length, C = matrix[0].length; const cells = []; for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) cells.push([i, j]); cells.sort((a, b) => matrix[b[0]][b[1]] - matrix[a[0]][a[1]]); const dp = matrix.map((r) => r.map(() => 1)); const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; let best = 1; for (const [i, j] of cells) { for (const [di, dj] of dirs) { const a = i + di, b = j + dj; if (a >= 0 && a < R && b >= 0 && b < C && matrix[a][b] > matrix[i][j] && dp[a][b] + 1 > dp[i][j]) dp[i][j] = dp[a][b] + 1; } if (dp[i][j] > best) best = dp[i][j]; } return best; }`,
    wrong: `function longestIncreasingPath(matrix) { const R = matrix.length, C = matrix[0].length; const cells = []; for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) cells.push([i, j]); cells.sort((a, b) => matrix[b[0]][b[1]] - matrix[a[0]][a[1]]); const dp = matrix.map((r) => r.map(() => 1)); const dirs = [[1, 0], [0, 1]]; let best = 1; for (const [i, j] of cells) { for (const [di, dj] of dirs) { const a = i + di, b = j + dj; if (a < R && b < C && matrix[a][b] > matrix[i][j] && dp[a][b] + 1 > dp[i][j]) dp[i][j] = dp[a][b] + 1; } if (dp[i][j] > best) best = dp[i][j]; } return best; }`
  },
  'count-subsequences': {
    ref: `function numDistinct(s, t) { const dp = new Array(t.length + 1).fill(0); dp[0] = 1; for (let i = 0; i < s.length; i++) { for (let j = t.length; j >= 1; j--) { if (s[i] === t[j - 1]) dp[j] += dp[j - 1]; } } return dp[t.length]; }`,
    wrong: `function numDistinct(s, t) { const n = s.length, m = t.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0)); for (let i = 0; i <= n; i++) dp[i][0] = 1; for (let i = 1; i <= n; i++) { for (let j = 1; j <= m; j++) { dp[i][j] = s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : dp[i - 1][j]; } } return dp[n][m]; }`
  },
  'edit-distance': {
    ref: `function minDistance(word1, word2) { const n = word1.length, m = word2.length; let prev = []; for (let j = 0; j <= m; j++) prev.push(j); for (let i = 1; i <= n; i++) { const cur = [i]; for (let j = 1; j <= m; j++) { cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (word1[i - 1] === word2[j - 1] ? 0 : 1))); } prev = cur; } return prev[m]; }`,
    wrong: `function minDistance(word1, word2) { const n = word1.length, m = word2.length; let prev = []; for (let j = 0; j <= m; j++) prev.push(j); for (let i = 1; i <= n; i++) { const cur = [i]; for (let j = 1; j <= m; j++) { cur.push(word1[i - 1] === word2[j - 1] ? prev[j - 1] : Math.min(prev[j], cur[j - 1]) + 1); } prev = cur; } return prev[m]; }`
  },
  'burst-balloons': {
    ref: `function maxCoins(nums) { const a = [1, ...nums, 1]; const n = a.length; const dp = Array.from({ length: n }, () => new Array(n).fill(0)); for (let len = 2; len < n; len++) { for (let l = 0; l + len < n; l++) { const r = l + len; for (let k = l + 1; k < r; k++) { const v = dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]; if (v > dp[l][r]) dp[l][r] = v; } } } return dp[0][n - 1]; }`,
    wrong: `function maxCoins(nums) { const a = nums.slice(); let total = 0; while (a.length) { let k = 0; for (let i = 1; i < a.length; i++) if (a[i] < a[k]) k = i; total += (k > 0 ? a[k - 1] : 1) * a[k] * (k < a.length - 1 ? a[k + 1] : 1); a.splice(k, 1); } return total; }`
  },
  'regular-expression-matching': {
    ref: `function isMatch(s, p) { const n = s.length, m = p.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false)); dp[0][0] = true; for (let j = 2; j <= m; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2]; for (let i = 1; i <= n; i++) { for (let j = 1; j <= m; j++) { if (p[j - 1] === '*') { dp[i][j] = dp[i][j - 2] || ((p[j - 2] === '.' || p[j - 2] === s[i - 1]) && dp[i - 1][j]); } else { dp[i][j] = (p[j - 1] === '.' || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1]; } } } return dp[n][m]; }`,
    wrong: `function isMatch(s, p) { const n = s.length, m = p.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false)); dp[0][0] = true; for (let i = 1; i <= n; i++) { for (let j = 1; j <= m; j++) { if (p[j - 1] === '*') { dp[i][j] = (p[j - 2] === '.' || p[j - 2] === s[i - 1]) && (dp[i - 1][j] || dp[i - 1][j - 2]); } else { dp[i][j] = (p[j - 1] === '.' || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1]; } } } return dp[n][m]; }`
  }
};
