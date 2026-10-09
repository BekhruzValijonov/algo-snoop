(function () {
  var ALNUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER = 'abcdefghijklmnopqrstuvwxyz';
  var LETTERS = LOWER + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function rep(ch, n) { var s = ''; for (var i = 0; i < n; i++) s += ch; return s; }
  function randStr(len, alphabet, seed) {
    var r = lcg(seed), s = '';
    for (var i = 0; i < len; i++) s += alphabet.charAt(Math.floor(r() * alphabet.length));
    return s;
  }
  function randInts(n, lo, hi, seed) {
    var r = lcg(seed);
    return range(n, function () { return lo + Math.floor(r() * (hi - lo + 1)); });
  }

  // ---------- climbing-stairs ----------
  function oClimb(n) {
    var f = [1, 1];
    for (var i = 2; i <= n; i++) f.push(f[i - 1] + f[i - 2]);
    return f[n];
  }
  NC_TESTS['climbing-stairs'] = {
    fn: 'climbStairs',
    starter: 'function climbStairs(n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      return [
        { args: [2], expected: 2 },
        { args: [3], expected: 3 },
        { args: [1], expected: 1 },
        { args: [5], expected: 8 },
        { args: [10], expected: 89 },
        { label: 'большой тест: n = 30', args: [30], expected: oClimb(30) }
      ];
    }
  };

  // ---------- min-cost-climbing-stairs ----------
  function oMinCost(cost) {
    var n = cost.length, f = [0, 0];
    for (var i = 2; i <= n; i++) f.push(Math.min(f[i - 1] + cost[i - 1], f[i - 2] + cost[i - 2]));
    return f[n];
  }
  NC_TESTS['min-cost-climbing-stairs'] = {
    fn: 'minCostClimbingStairs',
    starter: 'function minCostClimbingStairs(cost) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(100, 0, 100, 7);
      var all = range(100, function () { return 100; });
      return [
        { args: [[1, 2, 3]], expected: 2 },
        { args: [[1, 2, 1, 2, 1, 1, 1]], expected: 4 },
        { args: [[0, 0]], expected: 0 },
        { args: [[10, 15, 20]], expected: 15 },
        { args: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], expected: 6 },
        { label: 'большой тест: 100 случайных цен', args: [rnd], expected: oMinCost(rnd) },
        { label: 'большой тест: 100 ступеней по 100', args: [all], expected: 5000 }
      ];
    }
  };

  // ---------- house-robber ----------
  function oRob(a) {
    var n = a.length, dp = [0, a[0]];
    for (var i = 2; i <= n; i++) dp.push(Math.max(dp[i - 1], dp[i - 2] + a[i - 1]));
    return dp[n];
  }
  NC_TESTS['house-robber'] = {
    fn: 'rob',
    starter: 'function rob(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(100, 0, 100, 11);
      return [
        { args: [[1, 1, 3, 3]], expected: 4 },
        { args: [[2, 9, 8, 3, 6]], expected: 16 },
        { args: [[5]], expected: 5 },
        { args: [[2, 1, 1, 2]], expected: 4 },
        { args: [[0, 0, 0]], expected: 0 },
        { label: 'большой тест: 100 случайных домов', args: [rnd], expected: oRob(rnd) },
        { label: 'большой тест: 100 домов по 100', args: [range(100, function () { return 100; })], expected: 5000 }
      ];
    }
  };

  // ---------- house-robber-ii ----------
  function oRob2(a) {
    var n = a.length;
    if (n === 1) return a[0];
    return Math.max(oRob(a.slice(0, n - 1)), oRob(a.slice(1)));
  }
  NC_TESTS['house-robber-ii'] = {
    fn: 'rob',
    starter: 'function rob(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(100, 0, 100, 13);
      var rnd2 = randInts(99, 0, 100, 17);
      return [
        { args: [[3, 4, 3]], expected: 4 },
        { args: [[2, 9, 8, 3, 6]], expected: 15 },
        { args: [[5]], expected: 5 },
        { args: [[1, 2]], expected: 2 },
        { args: [[1, 2, 3, 1]], expected: 4 },
        { args: [[0, 0, 0]], expected: 0 },
        { label: 'большой тест: 100 случайных домов по кругу', args: [rnd], expected: oRob2(rnd) },
        { label: 'большой тест: 99 случайных домов по кругу', args: [rnd2], expected: oRob2(rnd2) }
      ];
    }
  };

  // ---------- longest-palindromic-substring ----------
  function isPal(t) {
    for (var i = 0, j = t.length - 1; i < j; i++, j--) if (t.charAt(i) !== t.charAt(j)) return false;
    return true;
  }
  function oLongestPal(s) {
    var best = '';
    for (var c = 0; c < 2 * s.length - 1; c++) {
      var l = c >> 1, r = l + (c & 1);
      while (l >= 0 && r < s.length && s.charAt(l) === s.charAt(r)) { l--; r++; }
      if (r - l - 1 > best.length) best = s.substring(l + 1, r);
    }
    return best;
  }
  function oCountPal(s) {
    var cnt = 0;
    for (var c = 0; c < 2 * s.length - 1; c++) {
      var l = c >> 1, r = l + (c & 1);
      while (l >= 0 && r < s.length && s.charAt(l) === s.charAt(r)) { cnt++; l--; r++; }
    }
    return cnt;
  }
  NC_TESTS['longest-palindromic-substring'] = {
    fn: 'longestPalindrome',
    starter: 'function longestPalindrome(s) {\n  // твой код\n}\n',
    cmp: function (res, args, exp) {
      var s = args[0];
      return typeof res === 'string' && res.length === exp.length && s.indexOf(res) >= 0 && isPal(res);
    },
    tests: function () {
      var half = randStr(300, ALNUM, 21);
      var mirrored = half + half.split('').reverse().join('');
      var embedded = randStr(200, ALNUM, 22) + mirrored + randStr(200, ALNUM, 23);
      var rnd = randStr(1000, ALNUM, 24);
      var ab = range(1000, function (i) { return i % 2 ? 'b' : 'a'; }).join('');
      var a1000 = rep('a', 1000);
      return [
        { args: ['ababd'], expected: 'bab' },
        { args: ['abbc'], expected: 'bb' },
        { args: ['a'], expected: 'a' },
        { args: ['ac'], expected: 'a' },
        { args: ['cbbd'], expected: 'bb' },
        { args: ['forgeeksskeegfor'], expected: 'geeksskeeg' },
        { label: 'большой тест: 1000 одинаковых символов', args: [a1000], expected: a1000 },
        { label: 'большой тест: палиндром длины 600 внутри случайной строки', args: [embedded], expected: oLongestPal(embedded) },
        { label: 'большой тест: случайная строка из 1000 символов', args: [rnd], expected: oLongestPal(rnd) },
        { label: 'большой тест: abab... из 1000 символов', args: [ab], expected: oLongestPal(ab) }
      ];
    }
  };

  // ---------- palindromic-substrings ----------
  NC_TESTS['palindromic-substrings'] = {
    fn: 'countSubstrings',
    starter: 'function countSubstrings(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randStr(1000, 'abc', 31);
      return [
        { args: ['abc'], expected: 3 },
        { args: ['aaa'], expected: 6 },
        { args: ['a'], expected: 1 },
        { args: ['abba'], expected: 6 },
        { args: ['aaaaa'], expected: 15 },
        { label: 'большой тест: 1000 букв a', args: [rep('a', 1000)], expected: 500500 },
        { label: 'большой тест: случайная строка из a, b, c', args: [rnd], expected: oCountPal(rnd) }
      ];
    }
  };

  // ---------- decode-ways ----------
  function oDecode(s) {
    var n = s.length, f = [1];
    for (var i = 1; i <= n; i++) {
      var v = 0;
      if (s.charAt(i - 1) !== '0') v += f[i - 1];
      if (i >= 2) {
        var two = parseInt(s.substring(i - 2, i), 10);
        if (s.charAt(i - 2) !== '0' && two <= 26) v += f[i - 2];
      }
      f.push(v);
    }
    return f[n];
  }
  NC_TESTS['decode-ways'] = {
    fn: 'numDecodings',
    starter: 'function numDecodings(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // длинные строки ограничены 70 цифрами, чтобы ответ не превышал 2^53
      var ones = rep('1', 70);
      var onesZero = rep('1', 60) + '0';
      var mix = randStr(100, '1230', 41);
      var mix2 = randStr(100, '0123456789', 42);
      return [
        { args: ['12'], expected: 2 },
        { args: ['01'], expected: 0 },
        { args: ['226'], expected: 3 },
        { args: ['0'], expected: 0 },
        { args: ['10'], expected: 1 },
        { args: ['27'], expected: 1 },
        { label: 'крайний случай: 2101', args: ['2101'], expected: 1 },
        { label: 'крайний случай: 100', args: ['100'], expected: 0 },
        { label: 'большой тест: 70 единиц', args: [ones], expected: oDecode(ones) },
        { label: 'большой тест: 60 единиц и нуль в конце', args: [onesZero], expected: oDecode(onesZero) },
        { label: 'большой тест: 100 цифр из 0–3', args: [mix], expected: oDecode(mix) },
        { label: 'большой тест: 100 случайных цифр', args: [mix2], expected: oDecode(mix2) }
      ];
    }
  };

  // ---------- coin-change ----------
  function oCoin(coins, amount) {
    var INF = 1e9, dp = [0];
    for (var a = 1; a <= amount; a++) {
      var b = INF;
      for (var k = 0; k < coins.length; k++) if (coins[k] <= a && dp[a - coins[k]] + 1 < b) b = dp[a - coins[k]] + 1;
      dp.push(b);
    }
    return dp[amount] >= INF ? -1 : dp[amount];
  }
  NC_TESTS['coin-change'] = {
    fn: 'coinChange',
    starter: 'function coinChange(coins, amount) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var evens = range(12, function (i) { return 2 * (i + 1) * 3; });
      var odd = [7, 13, 29, 101, 331, 1009, 4001];
      var many = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
      return [
        { args: [[1, 5, 10], 12], expected: 3 },
        { args: [[2], 3], expected: -1 },
        { args: [[1], 0], expected: 0 },
        { args: [[1, 3, 4], 6], expected: 2 },
        { args: [[2147483647], 10000], expected: -1 },
        { args: [[1, 2147483647], 7], expected: 7 },
        { label: 'большой тест: монеты 186, 419, 83, 408, сумма 6249', args: [[186, 419, 83, 408], 6249], expected: oCoin([186, 419, 83, 408], 6249) },
        { label: 'большой тест: 12 номиналов, сумма 9999', args: [many, 9999], expected: oCoin(many, 9999) },
        { label: 'большой тест: чётные монеты, нечётная сумма', args: [evens, 9999], expected: -1 },
        { label: 'большой тест: 7 больших простых номиналов', args: [odd, 9973], expected: oCoin(odd, 9973) }
      ];
    }
  };

  // ---------- maximum-product-subarray ----------
  function oMaxProd(a) {
    var best = a[0];
    for (var i = 0; i < a.length; i++) {
      var p = 1;
      for (var j = i; j < a.length; j++) { p *= a[j]; if (p > best) best = p; }
    }
    return best;
  }
  function bigProdArray(seed, zeros) {
    // в основном ±1, немного ±2 и ±3, чтобы произведение помещалось в 32 бита
    var r = lcg(seed), twos = 0, threes = 0;
    return range(1000, function (i) {
      var x = r(), sgn = r() < 0.5 ? -1 : 1;
      if (zeros && i > 0 && i % 331 === 0) return 0;
      if (x < 0.02 && twos < 12) { twos++; return sgn * 2; }
      if (x < 0.03 && threes < 4) { threes++; return sgn * 3; }
      return sgn;
    });
  }
  NC_TESTS['maximum-product-subarray'] = {
    fn: 'maxProduct',
    starter: 'function maxProduct(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var a = bigProdArray(51, false), b = bigProdArray(52, true);
      return [
        { args: [[1, 2, -3, 4]], expected: 4 },
        { args: [[-2, -1]], expected: 2 },
        { args: [[-2]], expected: -2 },
        { args: [[0, 2]], expected: 2 },
        { args: [[2, 3, -2, 4]], expected: 6 },
        { args: [[-2, 0, -1]], expected: 0 },
        { label: 'крайний случай: -2, 3, -4', args: [[-2, 3, -4]], expected: 24 },
        { label: 'крайний случай: четыре отрицательных', args: [[-1, -2, -9, -6]], expected: 108 },
        { label: 'большой тест: 1000 чисел, в основном ±1', args: [a], expected: oMaxProd(a) },
        { label: 'большой тест: 1000 чисел с нулями', args: [b], expected: oMaxProd(b) }
      ];
    }
  };

  // ---------- word-break ----------
  function oWordBreak(s, dict) {
    var ok = [true];
    for (var i = 1; i <= s.length; i++) {
      var v = false;
      for (var k = 0; k < dict.length && !v; k++) {
        var w = dict[k];
        if (w.length <= i && ok[i - w.length] && s.substring(i - w.length, i) === w) v = true;
      }
      ok.push(v);
    }
    return ok[s.length];
  }
  function randomDict(count, seed) {
    var r = lcg(seed), seen = {}, words = [];
    while (words.length < count) {
      var len = 1 + Math.floor(r() * 20), w = '';
      for (var i = 0; i < len; i++) w += r() < 0.5 ? 'a' : 'b';
      if (!seen[w]) { seen[w] = 1; words.push(w); }
    }
    return words;
  }
  NC_TESTS['word-break'] = {
    fn: 'wordBreak',
    starter: 'function wordBreak(s, wordDict) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var d1 = range(20, function (i) { return rep('a', i + 1); });
      var dict = randomDict(100, 61), r = lcg(62), s = '';
      while (true) {
        var w = dict[Math.floor(r() * dict.length)];
        if (s.length + w.length > 200) break;
        s += w;
      }
      var s2 = s.substring(0, s.length - 1) + (s.charAt(s.length - 1) === 'a' ? 'b' : 'a');
      var s3 = rep('a', 150) + 'b' + rep('a', 49);
      return [
        { args: ['neetcode', ['neet', 'code']], expected: true },
        { args: ['applepenapple', ['apple', 'pen', 'ape']], expected: true },
        { args: ['catsincars', ['cats', 'cat', 'sin', 'in', 'car']], expected: false },
        { args: ['a', ['a']], expected: true },
        { args: ['cars', ['car', 'ca', 'rs']], expected: true },
        { args: ['aaaaaaa', ['aaaa', 'aaa']], expected: true },
        { label: 'большой тест: 199 букв a и b в конце', args: [rep('a', 199) + 'b', d1], expected: false },
        { label: 'большой тест: строка из слов словаря (100 слов)', args: [s, dict], expected: oWordBreak(s, dict) },
        { label: 'большой тест: последняя буква заменена', args: [s2, dict], expected: oWordBreak(s2, dict) },
        { label: 'большой тест: b посреди 200 букв a', args: [s3, d1], expected: false }
      ];
    }
  };

  // ---------- longest-increasing-subsequence ----------
  function oLis(a) {
    var best = [], mx = 0;
    for (var i = 0; i < a.length; i++) {
      var v = 1;
      for (var j = 0; j < i; j++) if (a[j] < a[i] && best[j] + 1 > v) v = best[j] + 1;
      best.push(v);
      if (v > mx) mx = v;
    }
    return mx;
  }
  NC_TESTS['longest-increasing-subsequence'] = {
    fn: 'lengthOfLIS',
    starter: 'function lengthOfLIS(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(1000, -10000, 10000, 71);
      var inc = range(1000, function (i) { return -10000 + i * 20; });
      var dec = inc.slice().reverse();
      var saw = range(1000, function (i) { return (i % 10) * 7 - 30 + Math.floor(i / 10); });
      return [
        { args: [[9, 1, 4, 2, 3, 3, 7]], expected: 4 },
        { args: [[0, 3, 1, 3, 2, 3]], expected: 4 },
        { args: [[1]], expected: 1 },
        { args: [[5, 4, 3, 2, 1]], expected: 1 },
        { args: [[2, 2, 2]], expected: 1 },
        { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
        { label: 'большой тест: 1000 случайных чисел', args: [rnd], expected: oLis(rnd) },
        { label: 'большой тест: 1000 по возрастанию', args: [inc], expected: 1000 },
        { label: 'большой тест: 1000 по убыванию', args: [dec], expected: 1 },
        { label: 'большой тест: пила из 1000 чисел', args: [saw], expected: oLis(saw) }
      ];
    }
  };

  // ---------- partition-equal-subset-sum ----------
  function oPartition(a) {
    var sum = 0, i;
    for (i = 0; i < a.length; i++) sum += a[i];
    if (sum % 2) return false;
    var half = sum / 2, reach = {};
    reach[0] = true;
    var sums = [0];
    for (i = 0; i < a.length; i++) {
      var len = sums.length;
      for (var k = 0; k < len; k++) {
        var t = sums[k] + a[i];
        if (t <= half && !reach[t]) { reach[t] = true; sums.push(t); }
      }
    }
    return !!reach[half];
  }
  NC_TESTS['partition-equal-subset-sum'] = {
    fn: 'canPartition',
    starter: 'function canPartition(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var hundreds = range(99, function () { return 100; }).concat([1, 1]);
      var rnd = randInts(100, 1, 100, 81);
      var rnd2 = randInts(100, 1, 100, 82);
      var odd = rnd2.slice(); // подправим сумму до чётной
      var s = 0;
      for (var i = 0; i < odd.length; i++) s += odd[i];
      if (s % 2) odd[0] = odd[0] === 100 ? 99 : odd[0] + 1;
      var evens = range(100, function (i) { return 2 * (1 + (i * 7) % 50); });
      return [
        { args: [[1, 2, 3, 4]], expected: true },
        { args: [[1, 2, 3, 4, 5]], expected: false },
        { args: [[1, 5, 11, 5]], expected: true },
        { args: [[1, 2, 5]], expected: false },
        { args: [[2]], expected: false },
        { args: [[1, 1]], expected: true },
        { label: 'большой тест: 99 сотен и две единицы, сумма чётная, но разбить нельзя', args: [hundreds], expected: oPartition(hundreds) },
        { label: 'большой тест: 100 случайных чисел', args: [rnd], expected: oPartition(rnd) },
        { label: 'большой тест: 100 случайных чисел с чётной суммой', args: [odd], expected: oPartition(odd) },
        { label: 'большой тест: 100 чётных чисел', args: [evens], expected: oPartition(evens) }
      ];
    }
  };

  // ---------- count-paths ----------
  function oPaths(m, n) {
    var g = [], i, j;
    for (i = 0; i < m; i++) { g.push([]); for (j = 0; j < n; j++) g[i].push(i === 0 || j === 0 ? 1 : g[i - 1][j] + g[i][j - 1]); }
    return g[m - 1][n - 1];
  }
  NC_TESTS['count-paths'] = {
    fn: 'uniquePaths',
    starter: 'function uniquePaths(m, n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      return [
        { args: [3, 6], expected: 21 },
        { args: [3, 3], expected: 6 },
        { args: [1, 1], expected: 1 },
        { args: [7, 3], expected: 28 },
        { args: [3, 7], expected: 28 },
        { label: 'крайний случай: сетка 1×100', args: [1, 100], expected: 1 },
        { label: 'крайний случай: сетка 100×1', args: [100, 1], expected: 1 },
        { label: 'крайний случай: сетка 100×2', args: [100, 2], expected: 100 },
        { label: 'большой тест: сетка 17×18', args: [17, 18], expected: oPaths(17, 18) },
        { label: 'большой тест: сетка 23×12', args: [23, 12], expected: oPaths(23, 12) }
      ];
    }
  };

  // ---------- longest-common-subsequence ----------
  function oLcs(a, b) {
    var t = [], i, j;
    for (i = 0; i <= a.length; i++) { t.push(new Array(b.length + 1)); for (j = 0; j <= b.length; j++) t[i][j] = 0; }
    for (i = a.length - 1; i >= 0; i--)
      for (j = b.length - 1; j >= 0; j--)
        t[i][j] = a.charAt(i) === b.charAt(j) ? 1 + t[i + 1][j + 1] : Math.max(t[i + 1][j], t[i][j + 1]);
    return t[0][0];
  }
  NC_TESTS['longest-common-subsequence'] = {
    fn: 'longestCommonSubsequence',
    starter: 'function longestCommonSubsequence(text1, text2) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var a = randStr(1000, LOWER, 91), b = randStr(1000, LOWER, 92);
      var c = randStr(1000, 'ab', 93), d = randStr(1000, 'ab', 94);
      return [
        { args: ['cat', 'crabt'], expected: 3 },
        { args: ['abcd', 'abcd'], expected: 4 },
        { args: ['abc', 'def'], expected: 0 },
        { args: ['a', 'a'], expected: 1 },
        { args: ['abcde', 'ace'], expected: 3 },
        { args: ['bsbininm', 'jmjkbkjkv'], expected: 1 },
        { label: 'большой тест: две случайные строки по 1000 букв', args: [a, b], expected: oLcs(a, b) },
        { label: 'большой тест: случайные строки из a и b', args: [c, d], expected: oLcs(c, d) },
        { label: 'большой тест: одинаковые строки из 1000 букв', args: [rep('a', 1000), rep('a', 1000)], expected: 1000 }
      ];
    }
  };

  // ---------- buy-and-sell-crypto-with-cooldown ----------
  function oCooldown(p) {
    var n = p.length, f = [], i;
    for (i = 0; i < n + 2; i++) f.push([0, 0]); // f[i][h]: лучшая прибыль с дня i, h = 1 если держим акцию
    for (i = n - 1; i >= 0; i--) {
      f[i][0] = Math.max(f[i + 1][0], f[i + 1][1] - p[i]);
      f[i][1] = Math.max(f[i + 1][1], f[i + 2][0] + p[i]);
    }
    return f[0][0];
  }
  NC_TESTS['buy-and-sell-crypto-with-cooldown'] = {
    fn: 'maxProfit',
    starter: 'function maxProfit(prices) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(5000, 0, 1000, 101);
      var saw = range(5000, function (i) { return (i % 4) * 300; });
      var inc = range(5000, function (i) { return Math.floor(i / 5); });
      return [
        { args: [[1, 3, 4, 0, 4]], expected: 6 },
        { args: [[1]], expected: 0 },
        { args: [[1, 2, 3, 0, 2]], expected: 3 },
        { args: [[5, 4, 3, 2, 1]], expected: 0 },
        { args: [[6, 1, 3, 2, 4, 7]], expected: 6 },
        { args: [[2, 1, 4]], expected: 3 },
        { label: 'большой тест: 5000 случайных цен', args: [rnd], expected: oCooldown(rnd) },
        { label: 'большой тест: пила из 5000 цен', args: [saw], expected: oCooldown(saw) },
        { label: 'большой тест: цена медленно растёт, 5000 дней', args: [inc], expected: oCooldown(inc) }
      ];
    }
  };

  // ---------- coin-change-ii ----------
  // ответы в больших тестах подобраны так, чтобы не превышать 2^53
  function oChange(coins, amount) {
    var dp = [1], a;
    for (a = 1; a <= amount; a++) dp.push(0);
    for (var k = 0; k < coins.length; k++)
      for (a = coins[k]; a <= amount; a++) dp[a] += dp[a - coins[k]];
    return dp[amount];
  }
  NC_TESTS['coin-change-ii'] = {
    fn: 'change',
    starter: 'function change(coins, amount) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var big = range(300, function (i) { return 1000 + i * 7; });
      var brit = [1, 2, 5, 10, 20, 50, 100, 200];
      var few = [3, 7, 11, 13, 29, 37, 41, 43];
      return [
        { args: [[1, 2, 3], 4], expected: 4 },
        { args: [[2], 3], expected: 0 },
        { args: [[5], 0], expected: 1 },
        { args: [[1, 2, 5], 5], expected: 4 },
        { args: [[10], 10], expected: 1 },
        { args: [[3, 5, 7, 8, 9, 10, 11], 500], expected: oChange([3, 5, 7, 8, 9, 10, 11], 500) },
        { label: 'большой тест: 300 номиналов, сумма 5000', args: [big, 5000], expected: oChange(big, 5000) },
        { label: 'большой тест: номиналы 1…200, сумма 600', args: [brit, 600], expected: oChange(brit, 600) },
        { label: 'большой тест: 8 номиналов, сумма 5000', args: [few, 5000], expected: oChange(few, 5000) }
      ];
    }
  };

  // ---------- target-sum ----------
  function oTarget(nums, target) {
    var cur = {}, i, k;
    cur[0] = 1;
    for (i = 0; i < nums.length; i++) {
      var nxt = {};
      for (k in cur) {
        var s = Number(k);
        nxt[s + nums[i]] = (nxt[s + nums[i]] || 0) + cur[k];
        nxt[s - nums[i]] = (nxt[s - nums[i]] || 0) + cur[k];
      }
      cur = nxt;
    }
    return cur[target] || 0;
  }
  NC_TESTS['target-sum'] = {
    fn: 'findTargetSumWays',
    starter: 'function findTargetSumWays(nums, target) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(20, 0, 1000, 111);
      var ones = range(20, function () { return 1; });
      var zeros = range(20, function () { return 0; });
      var mixed = randInts(20, 0, 50, 112);
      return [
        { args: [[2, 2, 2], 2], expected: 3 },
        { args: [[1], 1], expected: 1 },
        { args: [[1, 1, 1, 1, 1], 3], expected: 5 },
        { args: [[0, 0, 0, 0, 0, 0, 0, 0, 1], 1], expected: 256 },
        { args: [[1], 2], expected: 0 },
        { args: [[0], 0], expected: 2 },
        { label: 'крайний случай: отрицательная цель', args: [[100], -100], expected: 1 },
        { label: 'крайний случай: все знаки минус', args: [[1, 2, 3], -6], expected: 1 },
        { label: 'большой тест: 20 нулей', args: [zeros, 0], expected: 1048576 },
        { label: 'большой тест: 20 единиц, цель 0', args: [ones, 0], expected: 184756 },
        { label: 'большой тест: 20 случайных чисел до 1000', args: [rnd, 1000], expected: oTarget(rnd, 1000) },
        { label: 'большой тест: 20 случайных чисел до 50', args: [mixed, -10], expected: oTarget(mixed, -10) }
      ];
    }
  };

  // ---------- interleaving-string ----------
  function oInter(a, b, c) {
    if (a.length + b.length !== c.length) return false;
    // множество достижимых i (взято символов из a) после k символов c
    var cur = {};
    cur[0] = true;
    for (var k = 0; k < c.length; k++) {
      var nxt = {};
      for (var key in cur) {
        var i = Number(key), j = k - i;
        if (i < a.length && a.charAt(i) === c.charAt(k)) nxt[i + 1] = true;
        if (j < b.length && b.charAt(j) === c.charAt(k)) nxt[i] = true;
      }
      cur = nxt;
    }
    return cur[a.length] === true;
  }
  NC_TESTS['interleaving-string'] = {
    fn: 'isInterleave',
    starter: 'function isInterleave(s1, s2, s3) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(121), x = randStr(20, 'ab', 122), y = randStr(20, 'ab', 123), z = '', i = 0, j = 0;
      while (i < 20 || j < 20) {
        if (j >= 20 || (i < 20 && r() < 0.5)) z += x.charAt(i++); else z += y.charAt(j++);
      }
      var z2 = z.substring(0, 39) + (z.charAt(39) === 'a' ? 'b' : 'a');
      var q = randStr(40, 'ab', 124);
      return [
        { args: ['aaaa', 'bbbb', 'aabbbbaa'], expected: true },
        { args: ['', '', ''], expected: true },
        { args: ['abc', 'xyz', 'abxzcy'], expected: false },
        { args: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true },
        { args: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false },
        { label: 'крайний случай: s2 пустая, символы разные', args: ['a', '', 'b'], expected: false },
        { label: 'крайний случай: s1 и s2 пустые, s3 не пустая', args: ['', '', 'a'], expected: false },
        { label: 'крайний случай: s1 пустая', args: ['', 'abc', 'abc'], expected: true },
        { label: 'большой тест: 20 + 20 букв a, s3 из 39 a и b', args: [rep('a', 20), rep('a', 20), rep('a', 39) + 'b'], expected: false },
        { label: 'большой тест: случайное чередование двух строк по 20', args: [x, y, z], expected: true },
        { label: 'большой тест: чередование с испорченным последним символом', args: [x, y, z2], expected: oInter(x, y, z2) },
        { label: 'большой тест: случайная s3 из a и b', args: [x, y, q], expected: oInter(x, y, q) }
      ];
    }
  };

  // ---------- longest-increasing-path-in-matrix ----------
  function oLip(m) {
    var R = m.length, C = m[0].length, i, j, d;
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    var out = [], layer = [];
    for (i = 0; i < R; i++) {
      out.push([]);
      for (j = 0; j < C; j++) {
        var c = 0;
        for (d = 0; d < 4; d++) {
          var a = i + dirs[d][0], b = j + dirs[d][1];
          if (a >= 0 && a < R && b >= 0 && b < C && m[a][b] > m[i][j]) c++;
        }
        out[i].push(c);
        if (c === 0) layer.push([i, j]);
      }
    }
    var layers = 0;
    while (layer.length) {
      layers++;
      var next = [];
      for (var t = 0; t < layer.length; t++) {
        var ci = layer[t][0], cj = layer[t][1];
        for (d = 0; d < 4; d++) {
          var p = ci + dirs[d][0], q = cj + dirs[d][1];
          if (p >= 0 && p < R && q >= 0 && q < C && m[p][q] < m[ci][cj]) {
            out[p][q]--;
            if (out[p][q] === 0) next.push([p, q]);
          }
        }
      }
      layer = next;
    }
    return layers;
  }
  NC_TESTS['longest-increasing-path-in-matrix'] = {
    fn: 'longestIncreasingPath',
    starter: 'function longestIncreasingPath(matrix) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(131);
      var diag = range(200, function (i) { return range(200, function (j) { return i + j; }); });
      var rnd = range(200, function () { return range(200, function () { return Math.floor(r() * 2147483648); }); });
      var small = range(200, function () { return range(200, function () { return Math.floor(r() * 4); }); });
      var flat = range(200, function () { return range(200, function () { return 7; }); });
      var snake = range(40, function (i) { return range(40, function (j) { return i * 40 + (i % 2 ? 39 - j : j); }); });
      return [
        { args: [[[5, 5, 3], [2, 3, 6], [1, 1, 1]]], expected: 4 },
        { args: [[[1, 2, 3], [2, 1, 4], [7, 6, 5]]], expected: 7 },
        { args: [[[1]]], expected: 1 },
        { args: [[[3, 4, 5], [3, 2, 6], [2, 2, 1]]], expected: 4 },
        { args: [[[1, 1], [1, 1]]], expected: 1 },
        { label: 'крайний случай: один столбец', args: [[[9], [8], [7], [10]]], expected: 3 },
        { label: 'крайний случай: значение 2³¹ − 1', args: [[[0, 2147483647]]], expected: 2 },
        { label: 'большой тест: матрица 200×200, значение i + j', args: [diag], expected: 399 },
        { label: 'большой тест: матрица 200×200 со случайными значениями', args: [rnd], expected: oLip(rnd) },
        { label: 'большой тест: матрица 200×200 из чисел 0–3', args: [small], expected: oLip(small) },
        { label: 'большой тест: матрица 200×200 из одинаковых чисел', args: [flat], expected: 1 },
        { label: 'большой тест: змейка 40×40', args: [snake], expected: 1600 }
      ];
    }
  };

  // ---------- count-subsequences ----------
  NC_TESTS['count-subsequences'] = {
    fn: 'numDistinct',
    starter: 'function numDistinct(s, t) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // ответы вычислены по построению и не превышают 2^53
      var groups = rep('a', 200) + rep('b', 200) + rep('c', 200) + rep('d', 200) + rep('e', 200);
      var rnd = randStr(1000, LETTERS, 141);
      var two = rep('a', 500) + rep('b', 500);
      var g3 = rep('a', 250) + rep('b', 250) + rep('c', 250) + rep('d', 250);
      return [
        { args: ['caat', 'cat'], expected: 2 },
        { args: ['xxyxy', 'xy'], expected: 5 },
        { args: ['a', 'a'], expected: 1 },
        { args: ['abc', 'abcd'], expected: 0 },
        { args: ['rabbbit', 'rabbit'], expected: 3 },
        { args: ['babgbag', 'bag'], expected: 5 },
        { label: 'крайний случай: регистр важен (aA)', args: ['aA', 'A'], expected: 1 },
        { label: 'крайний случай: регистр важен (Aa)', args: ['Aa', 'a'], expected: 1 },
        { label: 'большой тест: 5 блоков по 200 букв, t = abcde', args: [groups, 'abcde'], expected: 200 * 200 * 200 * 200 * 200 },
        { label: 'большой тест: 1000 букв a, t = aaa', args: [rep('a', 1000), 'aaa'], expected: 1000 * 999 * 998 / 6 },
        { label: 'большой тест: s и t совпадают, 1000 случайных букв', args: [rnd, rnd], expected: 1 },
        { label: 'большой тест: t на одну букву короче s', args: [two, rep('a', 499) + rep('b', 500)], expected: 500 },
        { label: 'большой тест: 4 блока по 250, t = abcd', args: [g3, 'abcd'], expected: 250 * 250 * 250 * 250 }
      ];
    }
  };

  // ---------- edit-distance ----------
  function oEdit(a, b) {
    var n = a.length, m = b.length, memo = [], i, j;
    for (i = 0; i <= n; i++) { memo.push([]); for (j = 0; j <= m; j++) memo[i].push(0); }
    for (i = 0; i <= n; i++) memo[i][0] = i;
    for (j = 0; j <= m; j++) memo[0][j] = j;
    for (i = 1; i <= n; i++)
      for (j = 1; j <= m; j++)
        memo[i][j] = Math.min(memo[i - 1][j] + 1, memo[i][j - 1] + 1, memo[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    return memo[n][m];
  }
  NC_TESTS['edit-distance'] = {
    fn: 'minDistance',
    starter: 'function minDistance(word1, word2) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var a = randStr(500, 'abcd', 151), b = randStr(500, 'abcd', 152);
      var c = randStr(500, LOWER, 153);
      var d = c.substring(0, 100) + 'zz' + c.substring(103, 300) + c.substring(310);
      return [
        { args: ['monkeys', 'money'], expected: 2 },
        { args: ['horse', 'ros'], expected: 3 },
        { args: ['', ''], expected: 0 },
        { args: ['', 'abc'], expected: 3 },
        { args: ['abc', ''], expected: 3 },
        { args: ['abc', 'abc'], expected: 0 },
        { label: 'крайний случай: intention → execution', args: ['intention', 'execution'], expected: 5 },
        { label: 'крайний случай: kitten → sitting', args: ['kitten', 'sitting'], expected: 3 },
        { label: 'большой тест: две случайные строки по 500 из abcd', args: [a, b], expected: oEdit(a, b) },
        { label: 'большой тест: 500 букв a и 500 букв b', args: [rep('a', 500), rep('b', 500)], expected: 500 },
        { label: 'большой тест: строка и её слегка изменённая копия', args: [c, d], expected: oEdit(c, d) },
        { label: 'большой тест: пустая и строка из 500', args: ['', c], expected: 500 }
      ];
    }
  };

  // ---------- burst-balloons ----------
  function oBurst(nums) {
    var a = [1].concat(nums, [1]), n = a.length, memo = new Float64Array(n * n).fill(-1);
    function go(l, r) { // лопаем всё строго между l и r
      if (r - l < 2) return 0;
      var key = l * n + r;
      if (memo[key] >= 0) return memo[key];
      var best = 0;
      for (var k = l + 1; k < r; k++) {
        var v = go(l, k) + go(k, r) + a[l] * a[k] * a[r];
        if (v > best) best = v;
      }
      memo[key] = best;
      return best;
    }
    return go(0, n - 1);
  }
  NC_TESTS['burst-balloons'] = {
    fn: 'maxCoins',
    starter: 'function maxCoins(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randInts(300, 0, 100, 161);
      var full = range(300, function () { return 100; });
      var rnd2 = randInts(250, 0, 100, 162);
      var zerosOnes = randInts(300, 0, 1, 163);
      return [
        { args: [[3, 1, 5, 8]], expected: 167 },
        { args: [[1, 5]], expected: 10 },
        { args: [[5]], expected: 5 },
        { args: [[0]], expected: 0 },
        { args: [[9, 76, 64, 21, 97, 60]], expected: 1086136 },
        { args: [[0, 0, 7, 0]], expected: 7 },
        { label: 'большой тест: 300 случайных шариков', args: [rnd], expected: oBurst(rnd) },
        { label: 'большой тест: 300 шариков по 100', args: [full], expected: oBurst(full) },
        { label: 'большой тест: 250 случайных шариков', args: [rnd2], expected: oBurst(rnd2) },
        { label: 'большой тест: 300 нулей и единиц', args: [zerosOnes], expected: oBurst(zerosOnes) }
      ];
    }
  };

  // ---------- regular-expression-matching ----------
  function oRegex(s, p) { return new RegExp('^(?:' + p + ')$').test(s); }
  NC_TESTS['regular-expression-matching'] = {
    fn: 'isMatch',
    starter: 'function isMatch(s, p) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var cases = [
        ['aab', 'c*a*b'], ['mississippi', 'mis*is*p*.'], ['a', 'ab*'], ['ab', '.*c'],
        ['aaa', 'a*a'], ['aaa', 'ab*a*c*a'], ['abcd', 'd*'], ['a', '.*..a*'],
        ['bbbba', '.*a*a'], ['aaaaaaaaaaaaaaaaaaab', 'a*a*a*a*a*a*a*a*a*c']
      ];
      var out = [
        { args: ['aa', 'a'], expected: false },
        { args: ['aa', 'a*'], expected: true },
        { args: ['ab', '.*'], expected: true }
      ];
      cases.forEach(function (c) { out.push({ args: [c[0], c[1]], expected: oRegex(c[0], c[1]) }); });
      out = out.slice(0, 6).concat([
        { label: 'большой тест: 19 букв a и b, шаблон a*, повторённый 10 раз', args: [rep('a', 19) + 'b', rep('a*', 10)], expected: false },
        { label: 'большой тест: 20 букв a, шаблон из девяти a* и b', args: [rep('a', 20), rep('a*', 9) + 'b'], expected: false },
        { label: 'большой тест: 20 букв a, шаблон .* десять раз', args: [rep('a', 20), rep('.*', 10)], expected: true },
        { label: 'большой тест: сложный шаблон на 20 символах', args: ['aaaaaaaaaaaaaaaaaaab', 'a*a*a*a*a*a*a*a*a*c'], expected: false },
        { label: 'большой тест: смесь точек и звёздочек', args: ['abababababababababab', 'a*b*.*a*b*.*c*.*b'], expected: oRegex('abababababababababab', 'a*b*.*a*b*.*c*.*b') }
      ]);
      return out;
    }
  };
})();
