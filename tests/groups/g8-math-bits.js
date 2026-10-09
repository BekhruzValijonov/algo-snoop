(function () {

  // ---------- вспомогательные функции для расчёта ожидаемых ответов (независимые от эталона) ----------
  function bits(n) { return n.toString(2).split('').filter(function (c) { return c === '1'; }).length; }
  function cloneM(m) { return m.map(function (r) { return r.slice(); }); }

  NC_TESTS['rotate-matrix'] = {
    fn: 'rotate',
    starter: 'function rotate(matrix) {\n  // измени matrix на месте, ничего возвращать не нужно\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(matrix) { rotate(matrix); return matrix; }',
    tests: function () {
      // эталон по формуле: res[i][j] = m[n-1-j][i]
      function rot(m) {
        var n = m.length, res = [];
        for (var i = 0; i < n; i++) { res.push([]); for (var j = 0; j < n; j++) res[i].push(m[n - 1 - j][i]); }
        return res;
      }
      var g = lcg(8);
      function rnd(n) { return range(n, function () { return range(n, function () { return Math.floor(g() * 2001) - 1000; }); }); }
      var m4 = rnd(4), m5 = rnd(5), m20 = rnd(20);
      return [
        { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
        { args: [[[-1000]]], expected: [[-1000]] },
        { args: [cloneM(m4)], expected: rot(m4) },
        { args: [cloneM(m5)], expected: rot(m5) },
        { label: 'большой тест: матрица 20×20', args: [cloneM(m20)], expected: rot(m20) }
      ];
    }
  };

  NC_TESTS['spiral-matrix'] = {
    fn: 'spiralOrder',
    starter: 'function spiralOrder(matrix) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: симуляция движения с матрицей посещённых клеток
      function spiral(m) {
        var R = m.length, C = m[0].length, seen = range(R, function () { return range(C, function () { return false; }); });
        var dr = [0, 1, 0, -1], dc = [1, 0, -1, 0], r = 0, c = 0, d = 0, out = [];
        for (var k = 0; k < R * C; k++) {
          out.push(m[r][c]); seen[r][c] = true;
          var nr = r + dr[d], nc = c + dc[d];
          if (nr < 0 || nr >= R || nc < 0 || nc >= C || seen[nr][nc]) { d = (d + 1) % 4; nr = r + dr[d]; nc = c + dc[d]; }
          r = nr; c = nc;
        }
        return out;
      }
      var g = lcg(21);
      function rnd(R, C) { return range(R, function () { return range(C, function () { return Math.floor(g() * 201) - 100; }); }); }
      var a = rnd(1, 7), b = rnd(6, 1), c = rnd(3, 5), d = rnd(5, 3), e = rnd(10, 10);
      return [
        { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3] },
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
        { args: [[[7]]], expected: [7] },
        { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
        { args: [a], expected: spiral(a) },
        { args: [b], expected: spiral(b) },
        { label: 'случайная матрица 3×5 и 5×3', args: [c], expected: spiral(c) },
        { label: 'случайная матрица 5×3', args: [d], expected: spiral(d) },
        { label: 'большой тест: матрица 10×10', args: [e], expected: spiral(e) }
      ];
    }
  };

  NC_TESTS['set-zeroes-in-matrix'] = {
    fn: 'setZeroes',
    starter: 'function setZeroes(matrix) {\n  // измени matrix на месте, ничего возвращать не нужно\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(matrix) { setZeroes(matrix); return matrix; }',
    tests: function () {
      function zeroed(m) {
        var rows = {}, cols = {};
        m.forEach(function (row, i) { row.forEach(function (v, j) { if (v === 0) { rows[i] = true; cols[j] = true; } }); });
        return m.map(function (row, i) { return row.map(function (v, j) { return (rows[i] || cols[j]) ? 0 : v; }); });
      }
      var g = lcg(5);
      // матрица 100×100 с несколькими нулями и крайними значениями int32
      var big = range(100, function () { return range(100, function () { return g() < 0.5 ? 2147483647 : -2147483648; }); });
      big[3][40] = 0; big[77][12] = 0; big[50][99] = 0;
      var sparse = range(6, function () { return range(7, function () { return Math.floor(g() * 9) + 1; }); });
      sparse[2][3] = 0;
      return [
        { args: [[[0, 1], [1, 1]]], expected: [[0, 0], [0, 1]] },
        { args: [[[1, 2, 3], [4, 0, 5], [6, 7, 8]]], expected: [[1, 0, 3], [0, 0, 0], [6, 0, 8]] },
        { args: [[[1, 0, 3]]], expected: [[0, 0, 0]] },
        { args: [[[1, 2, 0], [0, 4, 5], [7, 8, 9]]], expected: [[0, 0, 0], [0, 0, 0], [0, 8, 0]] },
        { args: [[[5]]], expected: [[5]] },
        { label: 'одна колонка с нулём', args: [[[1], [0], [3]]], expected: [[0], [0], [0]] },
        { label: 'матрица 6×7 с одним нулём', args: [cloneM(sparse)], expected: zeroed(sparse) },
        { label: 'большой тест: матрица 100×100, значения до ±2³¹', args: [cloneM(big)], expected: zeroed(big) }
      ];
    }
  };

  NC_TESTS['non-cyclical-number'] = {
    fn: 'isHappy',
    starter: 'function isHappy(n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: симуляция с множеством уже виденных значений
      function happy(n) {
        var seen = {};
        while (n !== 1 && !seen[n]) {
          seen[n] = true;
          var s = 0;
          String(n).split('').forEach(function (ch) { s += ch * ch; });
          n = s;
        }
        return n === 1;
      }
      return [
        { args: [100], expected: happy(100) },
        { args: [101], expected: happy(101) },
        { args: [1], expected: happy(1) },
        { args: [19], expected: happy(19) },
        { args: [4], expected: happy(4) },
        { args: [999], expected: happy(999) },
        { label: 'n = 1000', args: [1000], expected: happy(1000) },
        { label: 'n = 989 (счастливое)', args: [989], expected: happy(989) }
      ];
    }
  };

  NC_TESTS['plus-one'] = {
    fn: 'plusOne',
    starter: 'function plusOne(digits) {\n  // верни массив цифр числа, увеличенного на 1\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: BigInt
      function bigPlus(d) { return (BigInt(d.join('')) + 1n).toString().split('').map(Number); }
      var g = lcg(13);
      var d100 = range(100, function (i) { return i === 0 ? 1 + Math.floor(g() * 9) : Math.floor(g() * 10); });
      d100[99] = 8;
      var nines = range(100, function () { return 9; });
      var tail9 = range(100, function (i) { return i === 0 ? 4 : 9; });
      return [
        { args: [[1, 2, 3, 4]], expected: [1, 2, 3, 5] },
        { args: [[9, 9, 9]], expected: [1, 0, 0, 0] },
        { args: [[0]], expected: [1] },
        { args: [[9]], expected: [1, 0] },
        { args: [[1, 9, 9]], expected: [2, 0, 0] },
        { args: [[8, 9]], expected: [9, 0] },
        { label: 'большой тест: число из 100 цифр', args: [d100], expected: bigPlus(d100) },
        { label: 'большой тест: 100 девяток', args: [nines], expected: bigPlus(nines) },
        { label: 'большой тест: 4 и 99 девяток', args: [tail9], expected: bigPlus(tail9) }
      ];
    }
  };

  NC_TESTS['pow-x-n'] = {
    fn: 'myPow',
    starter: 'function myPow(x, n) {\n  // верни x в степени n; n может быть отрицательным\n  // твой код\n}\n',
    cmp: 'float',
    tests: function () {
      return [
        { args: [2, 5], expected: 32 },
        { args: [2, -2], expected: 0.25 },
        { args: [-2, 3], expected: -8 },
        { args: [0.5, -10], expected: 1024 },
        { args: [5, 0], expected: 1 },
        { label: 'x = −1, n = 2³¹ − 1', args: [-1, 2147483647], expected: -1 },
        { label: 'x = −1, n = −2³¹', args: [-1, -2147483648], expected: 1 },
        { label: 'большой тест: 1.00001 в степени 100 000', args: [1.00001, 100000], expected: Math.pow(1.00001, 100000) },
        { label: 'большой тест: 2 в степени −2³¹', args: [2, -2147483648], expected: 0 }
      ];
    }
  };

  NC_TESTS['multiply-strings'] = {
    fn: 'multiply',
    starter: 'function multiply(num1, num2) {\n  // BigInt и перевод строк в числа целиком использовать нельзя\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: BigInt (только в файле тестов)
      function mul(a, b) { return (BigInt(a) * BigInt(b)).toString(); }
      var g = lcg(77);
      function digits(n) { return range(n, function (i) { return i === 0 ? 1 + Math.floor(g() * 9) : Math.floor(g() * 10); }).join(''); }
      var a = digits(200), b = digits(200), c = digits(150), d = '9'.repeat(200);
      return [
        { args: ['3', '4'], expected: '12' },
        { args: ['111', '222'], expected: '24642' },
        { args: ['0', '12345'], expected: '0' },
        { args: ['99', '99'], expected: '9801' },
        { args: ['1000', '1000'], expected: '1000000' },
        { label: 'большой тест: два числа по 200 цифр', args: [a, b], expected: mul(a, b) },
        { label: 'большой тест: 200 девяток на себя', args: [d, d], expected: mul(d, d) },
        { label: 'большой тест: 150 цифр на 200 цифр', args: [c, a], expected: mul(c, a) }
      ];
    }
  };

  NC_TESTS['count-squares'] = {
    fn: 'DetectSquares',
    starter: 'class DetectSquares {\n  constructor() {\n    // твой код\n  }\n\n  add(point) {\n    // point = [x, y]\n    // твой код\n  }\n\n  count(point) {\n    // point = [x, y]; верни количество квадратов\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(DetectSquares, ops, args); }',
    tests: function () {
      // большой тест: сетка 20×20, часть точек добавлена дважды; ожидаемые ответы считаем перебором по стороне и 4 направлениям
      var mult = {};
      function key(x, y) { return x + ',' + y; }
      var ops = ['DetectSquares'], args = [[]], exp = [null];
      for (var x = 0; x < 20; x++) for (var y = 0; y < 20; y++) {
        var m = ((x * 7 + y * 3) % 3 === 0) ? 2 : 1;
        for (var k = 0; k < m; k++) { ops.push('add'); args.push([[x * 5, y * 5]]); exp.push(null); }
        mult[key(x * 5, y * 5)] = m;
      }
      function cnt(px, py) {
        var res = 0, dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (var d = 5; d <= 100; d += 5) {
          dirs.forEach(function (s) {
            var a = mult[key(px + s[0] * d, py)] || 0, b = mult[key(px, py + s[1] * d)] || 0, c = mult[key(px + s[0] * d, py + s[1] * d)] || 0;
            res += a * b * c;
          });
        }
        return res;
      }
      var g = lcg(3), nQ = 0;
      while (nQ < 1500) {
        var qx = Math.floor(g() * 21) * 5, qy = Math.floor(g() * 21) * 5;
        ops.push('count'); args.push([[qx, qy]]); exp.push(cnt(qx, qy)); nQ++;
      }
      return [
        { args: [['DetectSquares', 'add', 'add', 'add', 'count', 'count', 'add', 'count'], [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]], expected: [null, null, null, null, 1, 0, null, 2] },
        { args: [['DetectSquares', 'add', 'add', 'add', 'count'], [[], [[1, 1]], [[1, 3]], [[3, 1]], [[3, 3]]]], expected: [null, null, null, null, 1] },
        { args: [['DetectSquares', 'count'], [[], [[4, 4]]]], expected: [null, 0] },
        { args: [['DetectSquares', 'add', 'add', 'add', 'add', 'count', 'count'], [[], [[0, 0]], [[0, 1]], [[1, 0]], [[1, 1]], [[0, 0]], [[5, 5]]]], expected: [null, null, null, null, null, 1, 0] },
        { args: [['DetectSquares', 'add', 'add', 'add', 'add', 'add', 'add', 'count', 'count'], [[], [[0, 0]], [[0, 5]], [[5, 5]], [[5, 5]], [[5, 0]], [[1000, 1000]], [[0, 0]], [[1000, 0]]]], expected: [null, null, null, null, null, null, null, 2, 0] },
        { label: 'большой тест: сетка 400 клеток, 1500 запросов count', args: [ops, args], expected: exp }
      ];
    }
  };

  NC_TESTS['single-number'] = {
    fn: 'singleNumber',
    starter: 'function singleNumber(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // по построению: пары + одно одиночное число
      function build(pairs, single, seed) {
        var arr = [];
        pairs.forEach(function (p) { arr.push(p, p); });
        arr.push(single);
        return shuffled(arr, seed);
      }
      var pairs = range(4999, function (i) { return i * 4 - 10000 + 2; });
      return [
        { args: [[3, 2, 3]], expected: 2 },
        { args: [[7, 6, 6, 7, 8]], expected: 8 },
        { args: [[-5]], expected: -5 },
        { args: [[-1, -1, -2]], expected: -2 },
        { args: [[0, 4, 4]], expected: 0 },
        { label: 'большой тест: 9 999 чисел', args: [build(pairs, -10000, 9)], expected: -10000 },
        { label: 'большой тест: одиночное число 10000', args: [build(pairs, 10000, 4)], expected: 10000 }
      ];
    }
  };

  NC_TESTS['number-of-one-bits'] = {
    fn: 'hammingWeight',
    starter: '// n — целое число от 0 до 2³² − 1 (32-битное беззнаковое)\n// В условии оно записано двоичной строкой, здесь приходит обычным числом.\n// В JS битовые операторы работают со знаковыми числами, учти это.\nfunction hammingWeight(n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      return [
        { args: [23], expected: 4 },
        { args: [4], expected: 1 },
        { args: [0], expected: 0 },
        { args: [2147483647], expected: bits(2147483647) },
        { label: 'n = 2863311530 (10101010101010101010101010101010)', args: [2863311530], expected: bits(2863311530) },
        { label: 'n = 4294967295 (32 единицы)', args: [4294967295], expected: 32 },
        { label: 'n = 2147483648 (10000000000000000000000000000000)', args: [2147483648], expected: 1 },
        { label: 'n = 4294967294 (11111111111111111111111111111110)', args: [4294967294], expected: 31 }
      ];
    }
  };

  NC_TESTS['counting-bits'] = {
    fn: 'countBits',
    starter: 'function countBits(n) {\n  // верни массив длины n + 1, где ans[i] — число единичных битов в i\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function table(n) { return range(n + 1, function (i) { return bits(i); }); }
      return [
        { args: [4], expected: [0, 1, 1, 2, 1] },
        { args: [5], expected: [0, 1, 1, 2, 1, 2] },
        { args: [0], expected: [0] },
        { args: [1], expected: [0, 1] },
        { args: [16], expected: table(16) },
        { label: 'большой тест: n = 100 000', args: [100000], expected: table(100000) }
      ];
    }
  };

  NC_TESTS['reverse-bits'] = {
    fn: 'reverseBits',
    starter: '// n — целое число от 0 до 2³² − 1 (32-битное беззнаковое)\n// В условии оно записано двоичной строкой, здесь приходит обычным числом.\n// Верни результат тоже обычным беззнаковым числом (в JS поможет >>> 0).\nfunction reverseBits(n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: строка из 32 символов, разворот, parseInt
      function rev(n) {
        var s = n.toString(2);
        while (s.length < 32) s = '0' + s;
        return parseInt(s.split('').reverse().join(''), 2);
      }
      return [
        { args: [21], expected: 2818572288 },
        { args: [0], expected: 0 },
        { args: [1], expected: 2147483648 },
        { args: [43261596], expected: 964176192 },
        { label: 'n = 2147483648 (старший бит)', args: [2147483648], expected: 1 },
        { label: 'n = 4294967293 (11111111111111111111111111111101)', args: [4294967293], expected: 3221225471 },
        { label: 'n = 2863311530 (10101010101010101010101010101010)', args: [2863311530], expected: rev(2863311530) },
        { label: 'n = 4294967295 (32 единицы)', args: [4294967295], expected: 4294967295 }
      ];
    }
  };

  NC_TESTS['missing-number'] = {
    fn: 'missingNumber',
    starter: 'function missingNumber(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // по построению: числа 0..n без одного, перемешанные
      function build(n, missing, seed) {
        var arr = [];
        for (var i = 0; i <= n; i++) if (i !== missing) arr.push(i);
        return shuffled(arr, seed);
      }
      return [
        { args: [[1, 2, 3]], expected: 0 },
        { args: [[0, 2]], expected: 1 },
        { args: [[0]], expected: 1 },
        { args: [[3, 0, 1]], expected: 2 },
        { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
        { label: 'большой тест: n = 1000, пропущено 0', args: [build(1000, 0, 1)], expected: 0 },
        { label: 'большой тест: n = 1000, пропущено 1000', args: [build(1000, 1000, 2)], expected: 1000 },
        { label: 'большой тест: n = 1000, пропущено 537', args: [build(1000, 537, 3)], expected: 537 }
      ];
    }
  };

  NC_TESTS['sum-of-two-integers'] = {
    fn: 'getSum',
    starter: 'function getSum(a, b) {\n  // нельзя использовать операторы + и −\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var g = lcg(31);
      var cases = [[1, 1], [4, 7], [-1, 1], [-5, -7], [0, 0], [13, -20]];
      var edge = [[1000, 1000], [-1000, -1000], [-1000, 1000], [0, -9]];
      var extra = range(5, function () { return [Math.floor(g() * 2001) - 1000, Math.floor(g() * 2001) - 1000]; });
      var t = cases.map(function (p) { return { args: [p[0], p[1]], expected: p[0] + p[1] }; });
      edge.concat(extra).forEach(function (p) { t.push({ label: 'a = ' + p[0] + ', b = ' + p[1], args: [p[0], p[1]], expected: p[0] + p[1] }); });
      return t;
    }
  };

  NC_TESTS['reverse-integer'] = {
    fn: 'reverse',
    starter: 'function reverse(x) {\n  // если результат вышел за диапазон [−2³¹, 2³¹ − 1], верни 0\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // эталон: разворот строки, проверка диапазона через Number
      function rev(x) {
        var neg = x < 0, s = String(Math.abs(x)).split('').reverse().join('');
        var v = Number(s) * (neg ? -1 : 1);
        return (v < -2147483648 || v > 2147483647) ? 0 : v;
      }
      var plain = [123, -123, 120, 0, 5, -901000];
      var edge = [1000000003, 1534236469, -2147483648, 2147483647, 1463847412, -1463847412, 2147447412, 1563847412, -1563847412];
      var t = plain.map(function (x) { return { args: [x], expected: rev(x) }; });
      edge.forEach(function (x) { t.push({ label: 'x = ' + x, args: [x], expected: rev(x) }); });
      return t;
    }
  };

})();
