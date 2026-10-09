module.exports = {
  'rotate-matrix': {
    ref: 'function rotate(matrix) { const n = matrix.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t; } for (const row of matrix) row.reverse(); }',
    wrong: 'function rotate(matrix) { const n = matrix.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t; } }'
  },
  'spiral-matrix': {
    ref: 'function spiralOrder(matrix) { let top = 0, bot = matrix.length - 1, left = 0, right = matrix[0].length - 1; const res = []; while (top <= bot && left <= right) { for (let j = left; j <= right; j++) res.push(matrix[top][j]); top++; for (let i = top; i <= bot; i++) res.push(matrix[i][right]); right--; if (top <= bot) { for (let j = right; j >= left; j--) res.push(matrix[bot][j]); bot--; } if (left <= right) { for (let i = bot; i >= top; i--) res.push(matrix[i][left]); left++; } } return res; }',
    wrong: 'function spiralOrder(matrix) { let top = 0, bot = matrix.length - 1, left = 0, right = matrix[0].length - 1; const res = []; while (top <= bot && left <= right) { for (let j = left; j <= right; j++) res.push(matrix[top][j]); top++; for (let i = top; i <= bot; i++) res.push(matrix[i][right]); right--; for (let j = right; j >= left; j--) res.push(matrix[bot][j]); bot--; for (let i = bot; i >= top; i--) res.push(matrix[i][left]); left++; } return res; }'
  },
  'set-zeroes-in-matrix': {
    ref: 'function setZeroes(matrix) { const m = matrix.length, n = matrix[0].length; const rows = new Array(m).fill(false), cols = new Array(n).fill(false); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (matrix[i][j] === 0) { rows[i] = true; cols[j] = true; } for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (rows[i] || cols[j]) matrix[i][j] = 0; }',
    wrong: 'function setZeroes(matrix) { const m = matrix.length, n = matrix[0].length; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (matrix[i][j] === 0) { for (let k = 0; k < n; k++) matrix[i][k] = 0; for (let k = 0; k < m; k++) matrix[k][j] = 0; } }'
  },
  'non-cyclical-number': {
    ref: 'function isHappy(n) { const next = (x) => { let s = 0; while (x > 0) { const d = x % 10; s += d * d; x = (x - d) / 10; } return s; }; let slow = n, fast = next(n); while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); } return fast === 1; }',
    wrong: 'function isHappy(n) { let s = 0; while (n > 0) { const d = n % 10; s += d * d; n = (n - d) / 10; } return s === 1; }'
  },
  'plus-one': {
    ref: 'function plusOne(digits) { const res = digits.slice(); for (let i = res.length - 1; i >= 0; i--) { if (res[i] < 9) { res[i]++; return res; } res[i] = 0; } res.unshift(1); return res; }',
    wrong: 'function plusOne(digits) { return String(Number(digits.join("")) + 1).split("").map(Number); }'
  },
  'pow-x-n': {
    ref: 'function myPow(x, n) { let e = Math.abs(n), b = x, r = 1; while (e > 0) { if (e % 2 === 1) r *= b; b *= b; e = Math.floor(e / 2); } return n < 0 ? 1 / r : r; }',
    wrong: 'function myPow(x, n) { let e = Math.abs(n), b = x, r = 1; while (e > 0) { if (e % 2 === 1) r *= b; b *= b; e = Math.floor(e / 2); } return r; }'
  },
  'multiply-strings': {
    ref: 'function multiply(num1, num2) { if (num1 === "0" || num2 === "0") return "0"; const a = num1.length, b = num2.length, res = new Array(a + b).fill(0); for (let i = a - 1; i >= 0; i--) for (let j = b - 1; j >= 0; j--) { const p = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48) + res[i + j + 1]; res[i + j + 1] = p % 10; res[i + j] += Math.floor(p / 10); } let k = 0; while (k < res.length - 1 && res[k] === 0) k++; return res.slice(k).join(""); }',
    wrong: 'function multiply(num1, num2) { return String(Number(num1) * Number(num2)); }'
  },
  'count-squares': {
    ref: 'class DetectSquares { constructor() { this.cnt = new Map(); this.pts = []; } add(point) { const [x, y] = point; const k = x + "," + y; if (!this.cnt.has(k)) { this.cnt.set(k, 0); this.pts.push([x, y]); } this.cnt.set(k, this.cnt.get(k) + 1); } count(point) { const [px, py] = point; let res = 0; for (const [x, y] of this.pts) { if (Math.abs(px - x) !== Math.abs(py - y) || px === x) continue; res += this.cnt.get(x + "," + y) * (this.cnt.get(x + "," + py) || 0) * (this.cnt.get(px + "," + y) || 0); } return res; } }',
    wrong: 'class DetectSquares { constructor() { this.s = new Set(); } add(point) { this.s.add(point[0] + "," + point[1]); } count(point) { const [px, py] = point; let res = 0; for (const k of this.s) { const [x, y] = k.split(",").map(Number); if (Math.abs(px - x) !== Math.abs(py - y) || px === x) continue; if (this.s.has(x + "," + py) && this.s.has(px + "," + y)) res++; } return res; } }'
  },
  'single-number': {
    ref: 'function singleNumber(nums) { let r = 0; for (const x of nums) r ^= x; return r; }',
    wrong: 'function singleNumber(nums) { let r = 1; for (const x of nums) r ^= x; return r; }'
  },
  'number-of-one-bits': {
    ref: 'function hammingWeight(n) { let c = 0; n = n >>> 0; while (n !== 0) { n &= n - 1; n = n >>> 0; c++; } return c; }',
    wrong: 'function hammingWeight(n) { let c = 0; while (n > 0) { c += n & 1; n = n >> 1; } return c; }'
  },
  'counting-bits': {
    ref: 'function countBits(n) { const ans = new Array(n + 1).fill(0); for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1); return ans; }',
    wrong: 'function countBits(n) { const ans = new Array(n).fill(0); for (let i = 1; i < n; i++) ans[i] = ans[i >> 1] + (i & 1); return ans; }'
  },
  'reverse-bits': {
    ref: 'function reverseBits(n) { let res = 0; for (let i = 0; i < 32; i++) { res = (res << 1) | (n & 1); n = n >>> 1; } return res >>> 0; }',
    wrong: 'function reverseBits(n) { let res = 0; for (let i = 0; i < 32; i++) { res = (res << 1) | (n & 1); n = n >>> 1; } return res; }'
  },
  'missing-number': {
    ref: 'function missingNumber(nums) { let x = nums.length; for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i]; return x; }',
    wrong: 'function missingNumber(nums) { let x = 0; for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i]; return x; }'
  },
  'sum-of-two-integers': {
    ref: 'function getSum(a, b) { while (b !== 0) { const carry = (a & b) << 1; a = a ^ b; b = carry; } return a; }',
    wrong: 'function getSum(a, b) { return a ^ b; }'
  },
  'reverse-integer': {
    ref: 'function reverse(x) { const sign = x < 0 ? -1 : 1; let n = Math.abs(x), r = 0; while (n > 0) { r = r * 10 + (n % 10); n = Math.floor(n / 10); } r *= sign; return (r < -2147483648 || r > 2147483647) ? 0 : r; }',
    wrong: 'function reverse(x) { const sign = x < 0 ? -1 : 1; let n = Math.abs(x), r = 0; while (n > 0) { r = r * 10 + (n % 10); n = Math.floor(n / 10); } return r * sign; }'
  }
};
