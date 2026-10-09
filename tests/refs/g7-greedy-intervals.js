module.exports = {
  'maximum-subarray': {
    ref: 'function maxSubArray(nums) { let best = nums[0], cur = 0; for (const x of nums) { cur = Math.max(cur + x, x); best = Math.max(best, cur); } return best; }',
    wrong: 'function maxSubArray(nums) { let best = 0, cur = 0; for (const x of nums) { cur = Math.max(cur + x, 0); best = Math.max(best, cur); } return best; }'
  },
  'jump-game': {
    ref: 'function canJump(nums) { let far = 0; for (let i = 0; i < nums.length; i++) { if (i > far) return false; far = Math.max(far, i + nums[i]); } return true; }',
    wrong: 'function canJump(nums) { for (let i = 0; i < nums.length - 1; i++) if (nums[i] === 0) return false; return true; }'
  },
  'jump-game-ii': {
    ref: 'function jump(nums) { let jumps = 0, end = 0, far = 0; for (let i = 0; i < nums.length - 1; i++) { far = Math.max(far, i + nums[i]); if (i === end) { jumps++; end = far; } } return jumps; }',
    wrong: 'function jump(nums) { let jumps = 0, end = 0, far = 0; for (let i = 0; i < nums.length; i++) { far = Math.max(far, i + nums[i]); if (i === end) { jumps++; end = far; } } return jumps; }'
  },
  'gas-station': {
    ref: 'function canCompleteCircuit(gas, cost) { let total = 0, tank = 0, start = 0; for (let i = 0; i < gas.length; i++) { const d = gas[i] - cost[i]; total += d; tank += d; if (tank < 0) { tank = 0; start = i + 1; } } return total >= 0 ? start : -1; }',
    wrong: 'function canCompleteCircuit(gas, cost) { for (let i = 0; i < gas.length; i++) if (gas[i] >= cost[i]) return i; return -1; }'
  },
  'hand-of-straights': {
    ref: 'function isNStraightHand(hand, groupSize) { if (hand.length % groupSize) return false; const cnt = new Map(); for (const c of hand) cnt.set(c, (cnt.get(c) || 0) + 1); const keys = [...cnt.keys()].sort((a, b) => a - b); for (const k of keys) { const c = cnt.get(k); if (c > 0) { for (let j = 0; j < groupSize; j++) { if ((cnt.get(k + j) || 0) < c) return false; cnt.set(k + j, cnt.get(k + j) - c); } } } return true; }',
    wrong: 'function isNStraightHand(hand, groupSize) { return hand.length % groupSize === 0; }'
  },
  'merge-triplets-to-form-target': {
    ref: 'function mergeTriplets(triplets, target) { const got = [false, false, false]; for (const t of triplets) { if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue; for (let k = 0; k < 3; k++) if (t[k] === target[k]) got[k] = true; } return got[0] && got[1] && got[2]; }',
    wrong: 'function mergeTriplets(triplets, target) { for (let k = 0; k < 3; k++) if (!triplets.some(t => t[k] === target[k])) return false; return true; }'
  },
  'partition-labels': {
    ref: 'function partitionLabels(s) { const last = {}; for (let i = 0; i < s.length; i++) last[s[i]] = i; const res = []; let start = 0, end = 0; for (let i = 0; i < s.length; i++) { end = Math.max(end, last[s[i]]); if (i === end) { res.push(end - start + 1); start = i + 1; } } return res; }',
    wrong: 'function partitionLabels(s) { const last = {}; for (let i = 0; i < s.length; i++) last[s[i]] = i; const res = []; let start = 0; while (start < s.length) { const end = last[s[start]]; res.push(end - start + 1); start = end + 1; } return res; }'
  },
  'valid-parenthesis-string': {
    ref: 'function checkValidString(s) { let lo = 0, hi = 0; for (const c of s) { if (c === "(") { lo++; hi++; } else if (c === ")") { lo--; hi--; } else { lo--; hi++; } if (hi < 0) return false; if (lo < 0) lo = 0; } return lo === 0; }',
    wrong: 'function checkValidString(s) { let open = 0, close = 0, star = 0; for (const c of s) { if (c === "(") open++; else if (c === ")") close++; else star++; } return open <= close + star && close <= open + star; }'
  },
  'insert-new-interval': {
    ref: 'function insert(intervals, newInterval) { const res = []; let i = 0, n = intervals.length; let [s, e] = newInterval; while (i < n && intervals[i][1] < s) res.push(intervals[i++]); while (i < n && intervals[i][0] <= e) { s = Math.min(s, intervals[i][0]); e = Math.max(e, intervals[i][1]); i++; } res.push([s, e]); while (i < n) res.push(intervals[i++]); return res; }',
    wrong: 'function insert(intervals, newInterval) { const res = []; let i = 0, n = intervals.length; let [s, e] = newInterval; while (i < n && intervals[i][1] <= s) res.push(intervals[i++]); while (i < n && intervals[i][0] < e) { s = Math.min(s, intervals[i][0]); e = Math.max(e, intervals[i][1]); i++; } res.push([s, e]); while (i < n) res.push(intervals[i++]); return res; }'
  },
  'merge-intervals': {
    ref: 'function merge(intervals) { const a = intervals.map(x => [x[0], x[1]]).sort((p, q) => p[0] - q[0] || p[1] - q[1]); const res = []; for (const iv of a) { if (res.length && iv[0] <= res[res.length - 1][1]) res[res.length - 1][1] = Math.max(res[res.length - 1][1], iv[1]); else res.push(iv); } return res; }',
    wrong: 'function merge(intervals) { const a = intervals.map(x => [x[0], x[1]]).sort((p, q) => p[0] - q[0]); const res = []; for (const iv of a) { if (res.length && iv[0] <= res[res.length - 1][1]) res[res.length - 1][1] = iv[1]; else res.push(iv); } return res; }'
  },
  'non-overlapping-intervals': {
    ref: 'function eraseOverlapIntervals(intervals) { const a = intervals.slice().sort((p, q) => p[1] - q[1]); let kept = 0, end = -Infinity; for (const [s, e] of a) { if (s >= end) { kept++; end = e; } } return a.length - kept; }',
    wrong: 'function eraseOverlapIntervals(intervals) { const a = intervals.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]); let removed = 0, end = -Infinity; for (const [s, e] of a) { if (s >= end) end = e; else removed++; } return removed; }'
  },
  'meeting-schedule': {
    ref: 'function canAttendMeetings(intervals) { const a = intervals.slice().sort((p, q) => p[0] - q[0]); for (let i = 1; i < a.length; i++) if (a[i][0] < a[i - 1][1]) return false; return true; }',
    wrong: 'function canAttendMeetings(intervals) { for (let i = 1; i < intervals.length; i++) if (intervals[i][0] < intervals[i - 1][1]) return false; return true; }'
  },
  'meeting-schedule-ii': {
    ref: 'function minMeetingRooms(intervals) { const s = intervals.map(x => x[0]).sort((a, b) => a - b), e = intervals.map(x => x[1]).sort((a, b) => a - b); let rooms = 0, best = 0, j = 0; for (let i = 0; i < s.length; i++) { while (e[j] <= s[i]) { j++; rooms--; } rooms++; if (rooms > best) best = rooms; } return best; }',
    wrong: 'function minMeetingRooms(intervals) { if (!intervals.length) return 0; const a = intervals.slice().sort((p, q) => p[0] - q[0]); let rooms = 1, prevEnd = a[0][1]; for (let i = 1; i < a.length; i++) { if (a[i][0] < prevEnd) rooms++; prevEnd = a[i][1]; } return rooms; }'
  },
  'minimum-interval-including-query': {
    ref: 'function minInterval(intervals, queries) { const iv = intervals.slice().sort((a, b) => a[0] - b[0]); const idx = queries.map((_, i) => i).sort((a, b) => queries[a] - queries[b]); const res = new Array(queries.length).fill(-1); const h = []; const push = (x) => { h.push(x); let i = h.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (h[p][0] <= h[i][0]) break; [h[p], h[i]] = [h[i], h[p]]; i = p; } }; const pop = () => { const top = h[0], last = h.pop(); if (h.length) { h[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < h.length && h[l][0] < h[m][0]) m = l; if (r < h.length && h[r][0] < h[m][0]) m = r; if (m === i) break; [h[m], h[i]] = [h[i], h[m]]; i = m; } } return top; }; let j = 0; for (const qi of idx) { const q = queries[qi]; while (j < iv.length && iv[j][0] <= q) { push([iv[j][1] - iv[j][0] + 1, iv[j][1]]); j++; } while (h.length && h[0][1] < q) pop(); if (h.length) res[qi] = h[0][0]; } return res; }',
    wrong: 'function minInterval(intervals, queries) { const iv = intervals.slice().sort((a, b) => (a[1] - a[0]) - (b[1] - b[0])); return queries.map(q => { for (const [l, r] of iv) if (l <= q && q <= r) return r - l; return -1; }); }'
  }
};
