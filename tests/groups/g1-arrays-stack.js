(function () {

  // ---------- общие помощники ----------
  function randInts(n, lo, hi, seed) {
    var r = lcg(seed);
    return range(n, function () { return lo + Math.floor(r() * (hi - lo + 1)); });
  }
  function randStr(n, alphabet, seed) {
    var r = lcg(seed), s = '';
    for (var i = 0; i < n; i++) s += alphabet.charAt(Math.floor(r() * alphabet.length));
    return s;
  }

  // Первые 5 тестов остаются «примерами» (кнопка «Запустить»), остальные получают метку и идут только в «Отправить».
  function finish(slug) {
    var orig = NC_TESTS[slug].tests;
    NC_TESTS[slug].tests = function () {
      var arr = orig();
      arr.forEach(function (t, i) {
        if (i >= 5 && !t.label) t.label = 'крайний случай: ' + JSON.stringify(t.args).slice(0, 48);
      });
      return arr;
    };
  }

  // ---------- string-encode-and-decode ----------
  NC_TESTS['string-encode-and-decode'] = {
    fn: 'encode',
    starter: 'function encode(strs) {\n  // твой код: список строк -> одна строка\n}\n\nfunction decode(s) {\n  // твой код: одна строка -> исходный список строк\n}\n',
    cmp: 'exact',
    wrap: 'function __t(strs) { var e = encode(strs); if (typeof e !== "string") throw new Error("encode должна вернуть строку, а вернула " + typeof e); return decode(e); }',
    tests: function () {
      var r = lcg(77), all256 = '';
      for (var c = 0; c < 256; c++) all256 += String.fromCharCode(c);
      var big = range(99, function (k) {
        var s = '', len = 150 + Math.floor(r() * 50);
        for (var i = 0; i < len; i++) s += String.fromCharCode(Math.floor(r() * 256));
        return s;
      });
      var hashy = range(99, function (k) { return k % 3 === 0 ? '#' : (k % 3 === 1 ? '12#' + k : ''); });
      return [
        { args: [['neet', 'code', 'love', 'you']], expected: ['neet', 'code', 'love', 'you'] },
        { args: [['we', 'say', ':', 'yes']], expected: ['we', 'say', ':', 'yes'] },
        { args: [[]], expected: [] },
        { args: [['']], expected: [''] },
        { args: [['', '']], expected: ['', ''] },
        { args: [['4#neet', '#', '##', '5#', ',', ';', ':;', '0#']], expected: ['4#neet', '#', '##', '5#', ',', ';', ':;', '0#'] },
        { args: [[all256.slice(0, 199), all256.slice(57)]], expected: [all256.slice(0, 199), all256.slice(57)] },
        { label: 'большой тест: 99 строк по ~175 произвольных символов', args: [big], expected: big },
        { label: 'большой тест: 99 строк из «#», пустых и «12#k»', args: [hashy], expected: hashy }
      ];
    }
  };

  // ---------- products-of-array-discluding-self ----------
  NC_TESTS['products-of-array-discluding-self'] = {
    fn: 'productExceptSelf',
    starter: 'function productExceptSelf(nums) {\n  // твой код\n}\n',
    cmp: function (r, args, exp) {
      if (!Array.isArray(r) || r.length !== exp.length) return false;
      for (var i = 0; i < exp.length; i++) if (r[i] !== exp[i]) return false; // -0 === 0, так что допустимо
      return true;
    },
    tests: function () {
      function brute(nums) {
        return nums.map(function (_, i) {
          var p = 1;
          for (var j = 0; j < nums.length; j++) if (j !== i) p *= nums[j];
          return p === 0 ? 0 : p;
        });
      }
      var r = lcg(5);
      // 1000 элементов из {1, -1}, три двойки: все частичные произведения малы
      var big = range(1000, function () { return r() < 0.5 ? 1 : -1; });
      big[10] = 2; big[500] = 2; big[999] = 3;
      var withZero = big.slice(); withZero[300] = 0;
      var twoZeros = big.slice(); twoZeros[300] = 0; twoZeros[301] = 0;
      return [
        { args: [[1, 2, 4, 6]], expected: [48, 24, 12, 8] },
        { args: [[-1, 0, 1, 2, 3]], expected: [0, -6, 0, 0, 0] },
        { args: [[2, 3]], expected: [3, 2] },
        { args: [[0, 0]], expected: [0, 0] },
        { args: [[0, 4, 5]], expected: [20, 0, 0] },
        { args: [[-20, 20, -20, 20]], expected: [-8000, 8000, -8000, 8000] },
        { label: 'большой тест: 1000 чисел ±1', args: [big], expected: brute(big) },
        { label: 'большой тест: 1000 чисел с одним нулём', args: [withZero], expected: brute(withZero) },
        { label: 'большой тест: 1000 чисел с двумя нулями', args: [twoZeros], expected: brute(twoZeros) }
      ];
    }
  };

  // ---------- valid-sudoku ----------
  NC_TESTS['valid-sudoku'] = {
    fn: 'isValidSudoku',
    starter: 'function isValidSudoku(board) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function copy(b) { return b.map(function (row) { return row.slice(); }); }
      function grid(f) { return range(9, function (r) { return range(9, function (c) { return f(r, c); }); }); }
      var base = [
        ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
        ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
        ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
        ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
        ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
        ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
        ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
        ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
        ['.', '.', '.', '.', '8', '.', '.', '7', '9']
      ];
      var rowDup = copy(base); rowDup[0][8] = '5';          // две пятёрки в строке 0
      var colDup = copy(base); colDup[0][2] = '8';          // две восьмёрки в столбце 2 (строки 0 и 2)
      var boxDup = copy(base); boxDup[0][2] = '6';          // «6» уже есть в блоке (клетка [1][0]), но не в строке и не в столбце
      var solved = grid(function (r, c) { return String(((r % 3) * 3 + Math.floor(r / 3) + c) % 9 + 1); });
      var empty = grid(function () { return '.'; });
      var latin = grid(function (r, c) { return String((r + c) % 9 + 1); });  // строки и столбцы верны, блоки нарушены
      var swapped = copy(solved); var t = swapped[0][0]; swapped[0][0] = swapped[0][1]; swapped[0][1] = t; // строки верны, столбцы нет
      var r = lcg(11);
      var sparse = grid(function (rr, c) { return r() < 0.5 ? solved[rr][c] : '.'; });
      var one = empty.map(function (row) { return row.slice(); }); one[4][4] = '9';
      var diag = copy(empty); diag[0][0] = '1'; diag[1][3] = '1'; diag[4][8] = '1'; // одинаковые цифры без общих строк, столбцов и блоков
      var farCol = copy(empty); farCol[0][4] = '7'; farCol[8][4] = '7';
      var corner = copy(empty); corner[2][2] = '3'; corner[0][0] = '3';   // один блок
      var otherBoxSame = copy(empty); otherBoxSame[2][2] = '3'; otherBoxSame[3][3] = '3'; // соседние блоки по диагонали, разные строки и столбцы
      return [
        { args: [base], expected: true },
        { args: [rowDup], expected: false },
        { args: [colDup], expected: false },
        { args: [boxDup], expected: false },
        { args: [empty], expected: true },
        { args: [solved], expected: true },
        { args: [latin], expected: false },
        { args: [swapped], expected: false },
        { args: [sparse], expected: true },
        { args: [one], expected: true },
        { args: [diag], expected: true },
        { args: [farCol], expected: false },
        { args: [corner], expected: false },
        { args: [otherBoxSame], expected: true }
      ];
    }
  };

  // ---------- two-integer-sum-ii ----------
  NC_TESTS['two-integer-sum-ii'] = {
    fn: 'twoSum',
    starter: 'function twoSum(numbers, target) {\n  // твой код\n}\n',
    cmp: function (r, args, exp) {
      var n = args[0], t = args[1];
      return Array.isArray(r) && r.length === 2 && Number.isInteger(r[0]) && Number.isInteger(r[1]) &&
        r[0] >= 1 && r[1] <= n.length && r[0] < r[1] && n[r[0] - 1] + n[r[1] - 1] === t;
    },
    tests: function () {
      var big = range(1000, function (i) { return -1000 + 2 * i; }); // -1000, -998, ..., 998
      var bigT = big[1] + big[998];                                    // -998 + 996 = -2
      var dupes = range(1000, function (i) { return i < 500 ? -7 : 8; });
      return [
        { args: [[1, 2, 3, 4], 3], expected: [1, 2] },
        { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
        { args: [[-1, 0], -1], expected: [1, 2] },
        { args: [[3, 3], 6], expected: [1, 2] },
        { args: [[-5, -3, 0, 3, 8, 12], 15], expected: [4, 6] },
        { args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
        { args: [[-1000, 1000], 0], expected: [1, 2] },
        { label: 'большой тест: 1000 чисел, сумма в середине', args: [big, bigT], expected: [2, 999] },
        { label: 'большой тест: 1000 чисел с повторами', args: [dupes, 1], expected: [1, 1000] }
      ];
    }
  };

  // ---------- three-integer-sum ----------
  NC_TESTS['three-integer-sum'] = {
    fn: 'threeSum',
    starter: 'function threeSum(nums) {\n  // твой код\n}\n',
    cmp: 'setOfSets',
    tests: function () {
      // независимый способ: перебор пар различных значений a <= b и поиск c = -a-b по таблице количеств
      function brute(nums) {
        var cnt = {};
        nums.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; });
        var vals = Object.keys(cnt).map(Number).sort(function (a, b) { return a - b; });
        var out = [];
        for (var i = 0; i < vals.length; i++) {
          for (var j = i; j < vals.length; j++) {
            var a = vals[i], b = vals[j], c = -a - b;
            if (c < b || cnt[c] === undefined) continue;
            var need = {}; need[a] = 1; need[b] = (need[b] || 0) + 1; need[c] = (need[c] || 0) + 1;
            if (need[a] <= cnt[a] && need[b] <= cnt[b] && need[c] <= cnt[c]) out.push([a, b, c]);
          }
        }
        return out;
      }
      var zeros = range(1000, function () { return 0; });
      var wide = randInts(1000, -100000, 100000, 21);
      var narrow = randInts(1000, -60, 60, 22);
      var nonNeg = randInts(500, 1, 100000, 23).concat([0, 0]);
      return [
        { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
        { args: [[0, 1, 1]], expected: [] },
        { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
        { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
        { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
        { args: [[-100000, 0, 100000, 100000, -100000]], expected: [[-100000, 0, 100000]] },
        { args: [[3, -1, -2]], expected: [[-2, -1, 3]] },
        { args: [[1, 2, 3]], expected: [] },
        { label: 'большой тест: 1000 нулей', args: [zeros], expected: [[0, 0, 0]] },
        { label: 'большой тест: 1000 чисел от −100 000 до 100 000', args: [wide], expected: brute(wide) },
        { label: 'большой тест: 1000 чисел от −60 до 60 (много троек)', args: [narrow], expected: brute(narrow) },
        { label: 'большой тест: только положительные и два нуля', args: [nonNeg], expected: [] }
      ];
    }
  };

  // ---------- max-water-container ----------
  NC_TESTS['max-water-container'] = {
    fn: 'maxArea',
    starter: 'function maxArea(height) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(h) {
        var best = 0;
        for (var i = 0; i < h.length; i++) for (var j = i + 1; j < h.length; j++) {
          var v = (j - i) * Math.min(h[i], h[j]); if (v > best) best = v;
        }
        return best;
      }
      var rnd = randInts(1000, 0, 1000, 31);
      var inc = range(1000, function (i) { return i; });
      var dec = range(1000, function (i) { return 1000 - i; });
      var mid = range(1000, function (i) { return i === 400 || i === 900 ? 1000 : 1; });
      return [
        { args: [[1, 7, 2, 5, 4, 7, 3, 6]], expected: 36 },
        { args: [[2, 2, 2]], expected: 4 },
        { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
        { args: [[0, 0]], expected: 0 },
        { args: [[1000, 1000]], expected: 1000 },
        { args: [[5, 1, 1, 1, 1]], expected: 4 },
        { args: [[0, 9, 0, 0, 0, 1]], expected: 4 },
        { label: 'большой тест: 1000 случайных высот', args: [rnd], expected: brute(rnd) },
        { label: 'большой тест: возрастающие высоты', args: [inc], expected: brute(inc) },
        { label: 'большой тест: убывающие высоты', args: [dec], expected: brute(dec) },
        { label: 'большой тест: две высокие линии среди низких', args: [mid], expected: brute(mid) }
      ];
    }
  };

  // ---------- trapping-rain-water ----------
  NC_TESTS['trapping-rain-water'] = {
    fn: 'trap',
    starter: 'function trap(height) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(h) {
        var total = 0;
        for (var i = 0; i < h.length; i++) {
          var l = 0, r = 0, a, b;
          for (a = 0; a <= i; a++) if (h[a] > l) l = h[a];
          for (b = i; b < h.length; b++) if (h[b] > r) r = h[b];
          total += Math.min(l, r) - h[i];
        }
        return total;
      }
      var rnd = randInts(1000, 0, 1000, 41);
      var valley = range(1000, function (i) { return Math.abs(i - 500); });
      var inv = range(1000, function (i) { return 1000 - Math.abs(i - 500) * 2 > 0 ? 1000 - Math.abs(i - 500) * 2 : 0; });
      var wall = range(1000, function (i) { return i === 0 || i === 999 ? 1000 : 0; });
      return [
        { args: [[0, 2, 0, 3, 1, 0, 1, 3, 2, 1]], expected: 9 },
        { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
        { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
        { args: [[5]], expected: 0 },
        { args: [[3, 0, 3]], expected: 3 },
        { args: [[0, 0, 0]], expected: 0 },
        { args: [[1, 2, 3, 4]], expected: 0 },
        { args: [[4, 3, 2, 1]], expected: 0 },
        { args: [[5, 0, 0, 0, 2]], expected: 6 },
        { label: 'большой тест: 1000 случайных высот', args: [rnd], expected: brute(rnd) },
        { label: 'большой тест: долина', args: [valley], expected: brute(valley) },
        { label: 'большой тест: две стенки по краям', args: [wall], expected: 998 * 1000 },
        { label: 'большой тест: пик посередине', args: [inv], expected: brute(inv) }
      ];
    }
  };

  // ---------- buy-and-sell-crypto ----------
  NC_TESTS['buy-and-sell-crypto'] = {
    fn: 'maxProfit',
    starter: 'function maxProfit(prices) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(p) {
        var best = 0;
        for (var i = 0; i < p.length; i++) for (var j = i + 1; j < p.length; j++) if (p[j] - p[i] > best) best = p[j] - p[i];
        return best;
      }
      var rnd = randInts(100, 0, 100, 51);
      var rnd2 = randInts(100, 0, 100, 52);
      var dec = range(100, function (i) { return 100 - i; });
      var zeros = range(100, function () { return 0; });
      return [
        { args: [[10, 1, 5, 6, 7, 1]], expected: 6 },
        { args: [[10, 8, 7, 5, 2]], expected: 0 },
        { args: [[7]], expected: 0 },
        { args: [[5, 5, 5]], expected: 0 },
        { args: [[0, 100]], expected: 100 },
        { args: [[100, 0]], expected: 0 },
        { args: [[2, 4, 1]], expected: 2 },
        { args: [[3, 2, 6, 5, 0, 3]], expected: 4 },
        { args: [[1, 100, 0, 50]], expected: 99 },
        { label: 'большой тест: 100 случайных цен (1)', args: [rnd], expected: brute(rnd) },
        { label: 'большой тест: 100 случайных цен (2)', args: [rnd2], expected: brute(rnd2) },
        { label: 'большой тест: цена только падает', args: [dec], expected: brute(dec) },
        { label: 'большой тест: сто нулей', args: [zeros], expected: 0 }
      ];
    }
  };

  // ---------- longest-substring-without-duplicates ----------
  NC_TESTS['longest-substring-without-duplicates'] = {
    fn: 'lengthOfLongestSubstring',
    starter: 'function lengthOfLongestSubstring(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(s) {
        var best = 0;
        for (var i = 0; i < s.length; i++) {
          var seen = {};
          for (var j = i; j < s.length; j++) {
            if (seen[s.charAt(j)]) break;
            seen[s.charAt(j)] = true;
            if (j - i + 1 > best) best = j - i + 1;
          }
        }
        return best;
      }
      var printable = ''; for (var c = 32; c < 127; c++) printable += String.fromCharCode(c);
      var s1 = randStr(1000, printable, 61);
      var s2 = randStr(1000, 'abc', 62);
      var s3 = randStr(1000, printable.slice(0, 40), 63);
      var oneRun = 'a'.repeat(500) + printable + 'b'.repeat(405);
      return [
        { args: ['zxyzxyz'], expected: 3 },
        { args: ['xxxx'], expected: 1 },
        { args: [''], expected: 0 },
        { args: [' '], expected: 1 },
        { args: ['abba'], expected: 2 },
        { args: ['dvdf'], expected: 3 },
        { args: ['tmmzuxt'], expected: 5 },
        { args: ['pwwkew'], expected: 3 },
        { args: ['a b c a'], expected: 3 },
        { args: ['abcdefg'], expected: 7 },
        { label: 'большой тест: 1000 печатных символов', args: [s1], expected: brute(s1) },
        { label: 'большой тест: 1000 символов из трёх букв', args: [s2], expected: brute(s2) },
        { label: 'большой тест: алфавит из 40 символов', args: [s3], expected: brute(s3) },
        { label: 'большой тест: длинный участок без повторов в середине', args: [oneRun], expected: brute(oneRun) }
      ];
    }
  };

  // ---------- longest-repeating-substring-with-replacement ----------
  NC_TESTS['longest-repeating-substring-with-replacement'] = {
    fn: 'characterReplacement',
    starter: 'function characterReplacement(s, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // для каждого начала растим окно; максимум частоты не убывает, окно годится, пока длина − max ≤ k
      function brute(s, k) {
        var best = 0;
        for (var i = 0; i < s.length; i++) {
          var cnt = {}, mx = 0;
          for (var j = i; j < s.length; j++) {
            var ch = s.charAt(j);
            cnt[ch] = (cnt[ch] || 0) + 1;
            if (cnt[ch] > mx) mx = cnt[ch];
            if (j - i + 1 - mx > k) break;
            if (j - i + 1 > best) best = j - i + 1;
          }
        }
        return best;
      }
      var up = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var a = randStr(1000, 'AB', 71), b = randStr(1000, up, 72), c = randStr(1000, 'ABC', 73);
      return [
        { args: ['XYYX', 2], expected: 4 },
        { args: ['AAABABB', 1], expected: 5 },
        { args: ['A', 0], expected: 1 },
        { args: ['ABAB', 0], expected: 1 },
        { args: ['ABAB', 2], expected: 4 },
        { args: ['AABABBA', 1], expected: 4 },
        { args: ['ABCDE', 5], expected: 5 },
        { args: ['ABCDE', 1], expected: 2 },
        { args: ['AAAA', 0], expected: 4 },
        { label: 'большой тест: A и B, k = 50', args: [a, 50], expected: brute(a, 50) },
        { label: 'большой тест: 26 букв, k = 100', args: [b, 100], expected: brute(b, 100) },
        { label: 'большой тест: A, B, C, k = 0', args: [c, 0], expected: brute(c, 0) },
        { label: 'большой тест: A, B, C, k = 1000', args: [c, 1000], expected: 1000 }
      ];
    }
  };

  // ---------- permutation-string ----------
  NC_TESTS['permutation-string'] = {
    fn: 'checkInclusion',
    starter: 'function checkInclusion(s1, s2) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(s1, s2) {
        var key = s1.split('').sort().join('');
        for (var i = 0; i + s1.length <= s2.length; i++)
          if (s2.substr(i, s1.length).split('').sort().join('') === key) return true;
        return false;
      }
      var low = 'abcdefghijklmnopqrstuvwxyz';
      var s2 = randStr(1000, low, 81);
      var p = shuffled(s2.substr(300, 400).split(''), 5).join('');
      var s1no = p.slice(0, 399) + (p.charAt(399) === 'a' ? 'b' : 'a');
      var s2ab = randStr(1000, 'ab', 82);
      var s1ab = 'a'.repeat(300) + 'b'.repeat(300);
      return [
        { args: ['abc', 'lecabee'], expected: true },
        { args: ['abc', 'lecaabee'], expected: false },
        { args: ['ab', 'eidbaooo'], expected: true },
        { args: ['ab', 'eidboaoo'], expected: false },
        { args: ['a', 'a'], expected: true },
        { args: ['a', 'b'], expected: false },
        { args: ['abc', 'ab'], expected: false },
        { args: ['abc', 'cba'], expected: true },
        { args: ['aab', 'abaaa'], expected: true },
        { args: ['adc', 'dcda'], expected: true },
        { args: ['hello', 'ooolleoooleh'], expected: false },
        { label: 'большой тест: перестановка из 400 букв внутри 1000', args: [p, s2], expected: true },
        { label: 'большой тест: 400 букв, одна заменена', args: [s1no, s2], expected: brute(s1no, s2) },
        { label: 'большой тест: только a и b, 300 + 300', args: [s1ab, s2ab], expected: brute(s1ab, s2ab) }
      ];
    }
  };

  // ---------- minimum-window-with-characters ----------
  NC_TESTS['minimum-window-with-characters'] = {
    fn: 'minWindow',
    starter: 'function minWindow(s, t) {\n  // твой код\n}\n',
    // проверяем длину, вхождение в s и покрытие t с учётом количества (на случай нескольких окон одной длины)
    cmp: function (res, args, exp) {
      if (typeof res !== 'string' || res.length !== exp.length) return false;
      if (exp === '') return true;
      var s = args[0], t = args[1];
      if (s.indexOf(res) < 0) return false;
      var cnt = {}, i;
      for (i = 0; i < res.length; i++) cnt[res.charAt(i)] = (cnt[res.charAt(i)] || 0) + 1;
      for (i = 0; i < t.length; i++) { if (!cnt[t.charAt(i)]) return false; cnt[t.charAt(i)]--; }
      return true;
    },
    tests: function () {
      function brute(s, t) {
        var need = {}, i, j;
        for (i = 0; i < t.length; i++) need[t.charAt(i)] = (need[t.charAt(i)] || 0) + 1;
        var best = null;
        for (i = 0; i < s.length; i++) {
          var have = {}, miss = t.length;
          for (j = i; j < s.length; j++) {
            var ch = s.charAt(j);
            if (need[ch] && (have[ch] || 0) < need[ch]) miss--;
            have[ch] = (have[ch] || 0) + 1;
            if (miss === 0) { if (best === null || j - i + 1 < best.length) best = s.substr(i, j - i + 1); break; }
          }
        }
        return best === null ? '' : best;
      }
      var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var s1 = randStr(1000, letters, 91), t1 = 'aZq';
      var s2 = randStr(1000, 'abc', 92), t2 = 'abc'.repeat(30);
      var s3 = randStr(1000, letters, 93), t3 = s3.substr(100, 200).split('').sort().join('');
      var s4 = 'a'.repeat(1000);
      return [
        { args: ['OUZODYXAZV', 'XYZ'], expected: 'YXAZ' },
        { args: ['xyz', 'xyz'], expected: 'xyz' },
        { args: ['x', 'xy'], expected: '' },
        { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
        { args: ['a', 'a'], expected: 'a' },
        { args: ['aa', 'aa'], expected: 'aa' },
        { args: ['a', 'aa'], expected: '' },
        { args: ['abcabdebac', 'cda'], expected: 'cabd' },
        { args: ['Aa', 'a'], expected: 'a' },
        { args: ['bba', 'ab'], expected: 'ba' },
        { label: 'большой тест: 1000 букв, t из трёх букв', args: [s1, t1], expected: brute(s1, t1) },
        { label: 'большой тест: a, b, c, t из 90 символов', args: [s2, t2], expected: brute(s2, t2) },
        { label: 'большой тест: t из 200 символов', args: [s3, t3], expected: brute(s3, t3) },
        { label: 'большой тест: t длиннее нужного количества', args: [s4, 'a'.repeat(1000)], expected: s4 },
        { label: 'большой тест: символа нет', args: [s4, 'ab'], expected: '' }
      ];
    }
  };

  // ---------- sliding-window-maximum ----------
  NC_TESTS['sliding-window-maximum'] = {
    fn: 'maxSlidingWindow',
    starter: 'function maxSlidingWindow(nums, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(nums, k) {
        var out = [];
        for (var i = 0; i + k <= nums.length; i++) {
          var m = nums[i];
          for (var j = i; j < i + k; j++) if (nums[j] > m) m = nums[j];
          out.push(m);
        }
        return out;
      }
      var rnd = randInts(1000, -10000, 10000, 101);
      var inc = range(1000, function (i) { return i - 500; });
      var dec = range(1000, function (i) { return 500 - i; });
      return [
        { args: [[1, 2, 1, 0, 4, 2, 6], 3], expected: [2, 2, 4, 4, 6] },
        { args: [[1], 1], expected: [1] },
        { args: [[1, -1], 1], expected: [1, -1] },
        { args: [[9, 11], 2], expected: [11] },
        { args: [[4, 3, 2, 1], 2], expected: [4, 3, 2] },
        { args: [[-7, -8, 7, 5, 7, 1, 6, 0], 4], expected: [7, 7, 7, 7, 7] },
        { args: [[-10000, -10000, -10000], 3], expected: [-10000] },
        { label: 'большой тест: 1000 случайных, k = 10', args: [rnd, 10], expected: brute(rnd, 10) },
        { label: 'большой тест: 1000 случайных, k = 500', args: [rnd, 500], expected: brute(rnd, 500) },
        { label: 'большой тест: возрастающие, k = 100', args: [inc, 100], expected: brute(inc, 100) },
        { label: 'большой тест: убывающие, k = 100', args: [dec, 100], expected: brute(dec, 100) },
        { label: 'большой тест: k = длина массива', args: [rnd, 1000], expected: brute(rnd, 1000) }
      ];
    }
  };

  // ---------- validate-parentheses ----------
  NC_TESTS['validate-parentheses'] = {
    fn: 'isValid',
    starter: 'function isValid(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // независимый способ: пока есть соседняя пара «()», «[]» или «{}», вычёркиваем её
      function brute(s) {
        var prev;
        do { prev = s; s = s.replace('()', '').replace('[]', '').replace('{}', ''); } while (s !== prev);
        return s === '';
      }
      var open = '([{', close = ')]}';
      // правильная случайная последовательность
      function validSeq(len, seed) {
        var r = lcg(seed), st = [], out = '';
        for (var i = 0; i < len; i++) {
          var left = len - i;
          if (st.length === left || (st.length > 0 && r() < 0.5)) out += close.charAt(st.pop());
          else { var k = Math.floor(r() * 3); st.push(k); out += open.charAt(k); }
        }
        return out;
      }
      var good = validSeq(1000, 111);
      var bad = good.slice(0, 500) + (good.charAt(500) === ')' ? ']' : ')') + good.slice(501);
      var deep = '('.repeat(500) + ')'.repeat(500);
      var deepBad = '('.repeat(500) + ')'.repeat(499) + ']';
      var flat = '()[]{}'.repeat(166) + '()[]';
      var rnd = randStr(1000, '()[]{}', 112);
      return [
        { args: ['[]'], expected: true },
        { args: ['([{}])'], expected: true },
        { args: ['[(])'], expected: false },
        { args: ['()[]{}'], expected: true },
        { args: ['('], expected: false },
        { args: [')'], expected: false },
        { args: ['(('], expected: false },
        { args: ['))(('], expected: false },
        { args: ['{[]}'], expected: true },
        { args: ['([)]'], expected: false },
        { args: ['(]'], expected: false },
        { args: ['((()))]'], expected: false },
        { label: 'большой тест: случайная правильная последовательность', args: [good], expected: brute(good) },
        { label: 'большой тест: одна неверная скобка', args: [bad], expected: brute(bad) },
        { label: 'большой тест: 500 вложенных скобок', args: [deep], expected: true },
        { label: 'большой тест: вложенные, последняя скобка не того типа', args: [deepBad], expected: false },
        { label: 'большой тест: подряд идущие пары', args: [flat], expected: true },
        { label: 'большой тест: случайная строка', args: [rnd], expected: brute(rnd) }
      ];
    }
  };

  // ---------- minimum-stack ----------
  NC_TESTS['minimum-stack'] = {
    fn: 'MinStack',
    starter: 'class MinStack {\n  constructor() {\n    // твой код\n  }\n\n  push(val) {\n    // твой код\n  }\n\n  pop() {\n    // твой код\n  }\n\n  top() {\n    // твой код\n  }\n\n  getMin() {\n    // твой код\n  }\n}\n',
    // push и pop считаем void: их результат не проверяем (на LeetCode pop ничего не возвращает)
    cmp: function (r, args, exp) {
      var ops = args[0];
      if (!Array.isArray(r) || r.length !== exp.length) return false;
      for (var i = 0; i < exp.length; i++) {
        if (ops[i] === 'MinStack' || ops[i] === 'push' || ops[i] === 'pop') continue;
        if (r[i] !== exp[i]) return false;
      }
      return true;
    },
    wrap: 'function __t(ops, args) { return __H.runDesign(MinStack, ops, args); }',
    tests: function () {
      // длинный сценарий: 50 000 push, затем 50 000 пар (getMin, pop); минимум префикса считаем накопительно
      var N = 50000, ops = ['MinStack'], args = [[]], exp = [null], vals = [], pm = [], i;
      for (i = 0; i < N; i++) {
        var v = (i * 7919) % 10007 - 5003;
        vals.push(v);
        pm.push(i === 0 ? v : Math.min(pm[i - 1], v));
        ops.push('push'); args.push([v]); exp.push(null);
      }
      for (i = N - 1; i >= 0; i--) {
        ops.push('getMin'); args.push([]); exp.push(pm[i]);
        ops.push('pop'); args.push([]); exp.push(null);
      }
      // случайный сценарий на 6000 операций с наивным стеком и линейным поиском минимума
      var r = lcg(121), st = [], o2 = ['MinStack'], a2 = [[]], e2 = [null];
      for (i = 0; i < 6000; i++) {
        var p = r();
        if (st.length === 0 || p < 0.4) {
          var x = Math.floor(r() * 21) - 10; st.push(x); o2.push('push'); a2.push([x]); e2.push(null);
        } else if (p < 0.6) {
          st.pop(); o2.push('pop'); a2.push([]); e2.push(null);
        } else if (p < 0.8) {
          o2.push('top'); a2.push([]); e2.push(st[st.length - 1]);
        } else {
          var m = st[0]; for (var q = 1; q < st.length; q++) if (st[q] < m) m = st[q];
          o2.push('getMin'); a2.push([]); e2.push(m);
        }
      }
      return [
        { args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [1], [2], [0], [], [], [], []]], expected: [null, null, null, null, 0, null, 2, 1] },
        { args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin'], [[], [0], [1], [0], [], [], []]], expected: [null, null, null, null, 0, null, 0] },
        { args: [['MinStack', 'push', 'getMin', 'top', 'pop', 'push', 'getMin'], [[], [-5], [], [], [], [7], []]], expected: [null, null, -5, -5, null, null, 7] },
        { args: [['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin'], [[], [-2147483648], [2147483647], [], [], []]], expected: [null, null, null, -2147483648, null, -2147483648] },
        { args: [['MinStack', 'push', 'push', 'push', 'pop', 'getMin', 'pop', 'getMin', 'top'], [[], [3], [2], [1], [], [], [], [], []]], expected: [null, null, null, null, null, 2, null, 3, 3] },
        { label: 'большой тест: 50 000 push, затем getMin и pop', args: [ops, args], expected: exp },
        { label: 'большой тест: 6000 случайных операций', args: [o2, a2], expected: e2 }
      ];
    }
  };

  // ---------- evaluate-reverse-polish-notation ----------
  NC_TESTS['evaluate-reverse-polish-notation'] = {
    fn: 'evalRPN',
    starter: 'function evalRPN(tokens) {\n  // твой код\n}\n',
    cmp: function (r, args, exp) { return typeof r === 'number' && r === exp; }, // -0 === 0
    tests: function () {
      // строим случайное дерево выражения и считаем значение по дереву (а не по токенам)
      function gen(leaves, rnd) {
        if (leaves === 1) { var v = Math.floor(rnd() * 21) - 10; return { t: [String(v)], v: v }; }
        var lc = 1 + Math.floor(rnd() * (leaves - 1));
        var L = gen(lc, rnd), R = gen(leaves - lc, rnd);
        var ops = ['+', '-', '*', '/'], op = ops[Math.floor(rnd() * 4)], val;
        function calc(o) {
          if (o === '+') return L.v + R.v;
          if (o === '-') return L.v - R.v;
          if (o === '*') return L.v * R.v;
          return Math.trunc(L.v / R.v);
        }
        if (op === '/' && R.v === 0) op = '+';
        val = calc(op);
        if (Math.abs(val) > 1e9) { op = R.v !== 0 ? '/' : '+'; val = calc(op); }
        if (val === 0) val = 0; // убираем -0
        return { t: L.t.concat(R.t, [op]), v: val };
      }
      // вытянутое выражение: ((a op b) op c) op ...
      var g1 = gen(500, lcg(131)), g2 = gen(300, lcg(132)), g3 = gen(40, lcg(133));
      var chain = ['1'], cv = 1;
      for (var i = 2; i <= 400; i++) { chain.push(String(i % 7 + 1)); chain.push(i % 2 ? '-' : '+'); cv = i % 2 ? cv - (i % 7 + 1) : cv + (i % 7 + 1); }
      var deepStack = []; for (var j = 0; j < 450; j++) deepStack.push(String(j % 5 + 1));
      for (j = 0; j < 449; j++) deepStack.push('+');
      var deepSum = 0; for (j = 0; j < 450; j++) deepSum += j % 5 + 1;
      return [
        { args: [['1', '2', '+', '3', '*', '4', '-']], expected: 5 },
        { args: [['2', '1', '+', '3', '*']], expected: 9 },
        { args: [['4', '13', '5', '/', '+']], expected: 6 },
        { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
        { args: [['42']], expected: 42 },
        { args: [['-7']], expected: -7 },
        { args: [['3', '-4', '+']], expected: -1 },
        { args: [['4', '-13', '5', '/', '+']], expected: 2 },
        { args: [['-7', '2', '/']], expected: -3 },
        { args: [['7', '-2', '/']], expected: -3 },
        { args: [['1', '2', '-']], expected: -1 },
        { args: [['10', '3', '/']], expected: 3 },
        { args: [['0', '5', '-', '2', '/']], expected: -2 },
        { label: 'большой тест: выражение из 999 токенов', args: [g1.t], expected: g1.v },
        { label: 'большой тест: выражение из 599 токенов', args: [g2.t], expected: g2.v },
        { label: 'большой тест: выражение из 79 токенов', args: [g3.t], expected: g3.v },
        { label: 'большой тест: длинная цепочка + и −', args: [chain], expected: cv },
        { label: 'большой тест: 450 чисел, затем 449 сложений', args: [deepStack], expected: deepSum }
      ];
    }
  };

  // ---------- daily-temperatures ----------
  NC_TESTS['daily-temperatures'] = {
    fn: 'dailyTemperatures',
    starter: 'function dailyTemperatures(temperatures) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(t) {
        return t.map(function (v, i) {
          for (var j = i + 1; j < t.length; j++) if (t[j] > v) return j - i;
          return 0;
        });
      }
      var rnd = randInts(1000, 1, 100, 141);
      var dec = range(1000, function (i) { return 100 - Math.floor(i / 10); });
      var inc = range(1000, function (i) { return 1 + Math.floor(i / 10); });
      var flat = range(1000, function () { return 50; });
      var saw = range(1000, function (i) { return 1 + (i % 100); });
      return [
        { args: [[30, 38, 30, 36, 35, 40, 28]], expected: [1, 4, 1, 2, 1, 0, 0] },
        { args: [[22, 21, 20]], expected: [0, 0, 0] },
        { args: [[30, 60, 90]], expected: [1, 1, 0] },
        { args: [[50]], expected: [0] },
        { args: [[50, 50, 50]], expected: [0, 0, 0] },
        { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
        { args: [[1, 100]], expected: [1, 0] },
        { args: [[70, 70, 71]], expected: [2, 1, 0] },
        { label: 'большой тест: 1000 случайных температур', args: [rnd], expected: brute(rnd) },
        { label: 'большой тест: температура только падает (с повторами)', args: [dec], expected: brute(dec) },
        { label: 'большой тест: температура растёт (с повторами)', args: [inc], expected: brute(inc) },
        { label: 'большой тест: все дни одинаковые', args: [flat], expected: range(1000, function () { return 0; }) },
        { label: 'большой тест: пила', args: [saw], expected: brute(saw) }
      ];
    }
  };

  // ---------- car-fleet ----------
  NC_TESTS['car-fleet'] = {
    fn: 'carFleet',
    starter: 'function carFleet(target, position, speed) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // машина i возглавляет флот, если она приезжает строго позже каждой машины впереди (сравнение дробей без деления)
      function brute(T, pos, sp) {
        var cnt = 0;
        for (var i = 0; i < pos.length; i++) {
          var head = true;
          for (var j = 0; j < pos.length; j++)
            if (pos[j] > pos[i] && !((T - pos[i]) * sp[j] > (T - pos[j]) * sp[i])) { head = false; break; }
          if (head) cnt++;
        }
        return cnt;
      }
      var r = lcg(151);
      var pos = shuffled(range(1000, function (i) { return i; }), 152);        // 1000 разных позиций 0..999
      var sp = range(1000, function () { return 1 + Math.floor(r() * 100); });
      var sp2 = range(1000, function (i) { return 1; });
      var posAsc = range(1000, function (i) { return i; });
      var spDecAhead = range(1000, function (i) { return 1 + Math.floor(i / 10); }); // у передних машин скорость больше -> все отдельные флоты
      var spIncAhead = range(1000, function (i) { return 100 - Math.floor(i / 10); }); // передние медленнее -> всё сливается
      return [
        { args: [10, [1, 4], [3, 2]], expected: 1 },
        { args: [10, [4, 1, 0, 7], [2, 2, 1, 1]], expected: 3 },
        { args: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3 },
        { args: [10, [3], [3]], expected: 1 },
        { args: [10, [0, 2, 4], [2, 2, 2]], expected: 3 },
        { args: [100, [0, 10, 20], [10, 5, 1]], expected: 1 },
        { args: [10, [6, 8], [3, 2]], expected: 2 },
        { args: [10, [0, 4], [2, 1]], expected: 1 },
        { args: [10, [2, 0], [1, 3]], expected: 1 },
        { args: [1000, [5, 4, 3, 2, 1, 0], [1, 1, 1, 1, 1, 1]], expected: 6 },
        { args: [1000, [0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]], expected: 6 },
        { label: 'большой тест: 1000 машин со случайной скоростью', args: [1000, pos, sp], expected: brute(1000, pos, sp) },
        { label: 'большой тест: у всех скорость 1', args: [1000, pos, sp2], expected: 1000 },
        { label: 'большой тест: передние машины медленнее', args: [1000, posAsc, spIncAhead], expected: brute(1000, posAsc, spIncAhead) },
        { label: 'большой тест: передние быстрее', args: [1000, posAsc, spDecAhead], expected: brute(1000, posAsc, spDecAhead) }
      ];
    }
  };

  // ---------- largest-rectangle-in-histogram ----------
  NC_TESTS['largest-rectangle-in-histogram'] = {
    fn: 'largestRectangleArea',
    starter: 'function largestRectangleArea(heights) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(h) {
        var best = 0;
        for (var i = 0; i < h.length; i++) {
          var mn = h[i];
          for (var j = i; j < h.length; j++) {
            if (h[j] < mn) mn = h[j];
            if (mn * (j - i + 1) > best) best = mn * (j - i + 1);
          }
        }
        return best;
      }
      var rnd = randInts(1000, 0, 1000, 161);
      var inc = range(1000, function (i) { return i + 1 > 1000 ? 1000 : i + 1; });
      var dec = range(1000, function (i) { return 1000 - i; });
      var flat = range(1000, function () { return 1000; });
      var tooth = range(1000, function (i) { return i % 2 ? 1000 : 1; });
      var mid = range(1000, function (i) { return 500 + (i < 500 ? i : 999 - i); });
      return [
        { args: [[7, 1, 7, 2, 2, 4]], expected: 8 },
        { args: [[1, 3, 7]], expected: 7 },
        { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
        { args: [[0]], expected: 0 },
        { args: [[5]], expected: 5 },
        { args: [[2, 4]], expected: 4 },
        { args: [[5, 5, 5, 5]], expected: 20 },
        { args: [[0, 0, 0]], expected: 0 },
        { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 },
        { args: [[1, 0, 1]], expected: 1 },
        { label: 'большой тест: 1000 случайных высот', args: [rnd], expected: brute(rnd) },
        { label: 'большой тест: возрастающие высоты', args: [inc], expected: brute(inc) },
        { label: 'большой тест: убывающие высоты', args: [dec], expected: brute(dec) },
        { label: 'большой тест: все столбики по 1000', args: [flat], expected: 1000000 },
        { label: 'большой тест: зубцы', args: [tooth], expected: brute(tooth) },
        { label: 'большой тест: холм', args: [mid], expected: brute(mid) }
      ];
    }
  };

  ['string-encode-and-decode', 'products-of-array-discluding-self', 'valid-sudoku', 'two-integer-sum-ii', 'three-integer-sum',
    'max-water-container', 'trapping-rain-water', 'buy-and-sell-crypto', 'longest-substring-without-duplicates',
    'longest-repeating-substring-with-replacement', 'permutation-string', 'minimum-window-with-characters',
    'sliding-window-maximum', 'validate-parentheses', 'minimum-stack', 'evaluate-reverse-polish-notation',
    'daily-temperatures', 'car-fleet', 'largest-rectangle-in-histogram'].forEach(finish);

})();
