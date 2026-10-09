(function () {
  // --- независимые помощники для вычисления ожидаемых ответов ---

  // Слияние интервалов разметкой клеток: точка x это клетка 2x, промежуток между x и x+1 это клетка 2x+1.
  function mergeByCells(list) {
    var maxC = 0, i, c;
    for (i = 0; i < list.length; i++) if (list[i][1] * 2 > maxC) maxC = list[i][1] * 2;
    var cov = new Uint8Array(maxC + 2);
    for (i = 0; i < list.length; i++) for (c = list[i][0] * 2; c <= list[i][1] * 2; c++) cov[c] = 1;
    var res = [];
    for (c = 0; c <= maxC; c++) {
      if (cov[c] && (c === 0 || !cov[c - 1])) {
        var e = c;
        while (e + 1 <= maxC && cov[e + 1]) e++;
        res.push([c / 2, e / 2]);
        c = e;
      }
    }
    return res;
  }

  // Максимальный набор непересекающихся интервалов: квадратичное ДП.
  function maxKeep(iv) {
    var a = iv.slice().sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; });
    var dp = [], best = 0;
    for (var i = 0; i < a.length; i++) {
      dp[i] = 1;
      for (var j = 0; j < i; j++) if (a[j][1] <= a[i][0] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
      if (dp[i] > best) best = dp[i];
    }
    return best;
  }

  // Минимум прыжков: квадратичное ДП.
  function jumpsDP(nums) {
    var n = nums.length, dp = [0], i, j;
    for (i = 1; i < n; i++) {
      dp[i] = Infinity;
      for (j = 0; j < i; j++) if (j + nums[j] >= i && dp[j] + 1 < dp[i]) dp[i] = dp[j] + 1;
    }
    return dp[n - 1];
  }

  // Достижимость последнего индекса: ДП с конца.
  function canJumpDP(nums) {
    var n = nums.length, ok = [], i, j;
    ok[n - 1] = true;
    for (i = n - 2; i >= 0; i--) {
      ok[i] = false;
      for (j = i + 1; j <= i + nums[i] && j < n; j++) if (ok[j]) { ok[i] = true; break; }
    }
    return ok[0];
  }

  // Лучшая сумма подмассива: перебор всех подмассивов.
  function maxSubBrute(nums) {
    var best = -Infinity;
    for (var i = 0; i < nums.length; i++) {
      var s = 0;
      for (var j = i; j < nums.length; j++) { s += nums[j]; if (s > best) best = s; }
    }
    return best;
  }

  // Заправки: сколько стартов позволяют объехать круг (полная симуляция).
  function gasStarts(gas, cost) {
    var n = gas.length, res = [];
    for (var s = 0; s < n; s++) {
      var tank = 0, ok = true;
      for (var k = 0; k < n; k++) {
        var i = (s + k) % n;
        tank += gas[i] - cost[i];
        if (tank < 0) { ok = false; break; }
      }
      if (ok) res.push(s);
    }
    return res;
  }

  // Скобочная строка со звёздочками: множество возможных балансов.
  function validStarBrute(s) {
    var set = { 0: true };
    for (var i = 0; i < s.length; i++) {
      var nx = {};
      for (var k in set) {
        var b = +k;
        if (s[i] === '(' || s[i] === '*') nx[b + 1] = true;
        if ((s[i] === ')' || s[i] === '*') && b > 0) nx[b - 1] = true;
        if (s[i] === '*') nx[b] = true;
      }
      set = nx;
    }
    return set[0] === true;
  }

  // Число переговорных: максимум одновременно идущих встреч в момент старта какой-то встречи.
  function roomsBrute(iv) {
    var best = 0;
    for (var i = 0; i < iv.length; i++) {
      var c = 0;
      for (var j = 0; j < iv.length; j++) if (iv[j][0] <= iv[i][0] && iv[i][0] < iv[j][1]) c++;
      if (c > best) best = c;
    }
    return best;
  }

  function attendBrute(iv) {
    for (var i = 0; i < iv.length; i++) for (var j = i + 1; j < iv.length; j++)
      if (iv[i][0] < iv[j][1] && iv[j][0] < iv[i][1]) return false;
    return true;
  }

  // Минимальный интервал для запросов: интервалы по возрастанию размера «закрашивают» ещё не отвеченные запросы (СНМ).
  function minIntervalPaint(intervals, queries) {
    var uniq = Array.from(new Set(queries)).sort(function (a, b) { return a - b; });
    var m = uniq.length, nxt = range(m + 1, function (i) { return i; });
    function find(x) { while (nxt[x] !== x) { nxt[x] = nxt[nxt[x]]; x = nxt[x]; } return x; }
    var ans = {};
    var order = intervals.slice().sort(function (a, b) { return (a[1] - a[0]) - (b[1] - b[0]); });
    for (var t = 0; t < order.length; t++) {
      var l = order[t][0], r = order[t][1], size = r - l + 1;
      var lo = 0, hi = m;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (uniq[mid] < l) lo = mid + 1; else hi = mid; }
      var p = find(lo);
      while (p < m && uniq[p] <= r) { ans[uniq[p]] = size; nxt[p] = p + 1; p = find(p + 1); }
    }
    return queries.map(function (q) { return ans[q] === undefined ? -1 : ans[q]; });
  }

  // ---------------------------------------------------------------

  NC_TESTS['maximum-subarray'] = {
    fn: 'maxSubArray',
    starter: 'function maxSubArray(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r1 = lcg(7), a = range(1000, function () { return Math.floor(r1() * 2001) - 1000; });
      var r2 = lcg(11), b = range(1000, function () { return -1 - Math.floor(r2() * 1000); });
      var r3 = lcg(5), c = range(1000, function (i) { return (i % 2 ? -1 : 1) * (500 + Math.floor(r3() * 501)); });
      return [
        { args: [[2, -3, 4, -2, 2, 1, -1, 4]], expected: 8 },
        { args: [[-1]], expected: -1 },
        { args: [[-3, -2, -5]], expected: -2 },
        { args: [[5]], expected: 5 },
        { args: [[1, 2, 3, 4]], expected: 10 },
        { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { label: 'большой тест: 1000 случайных чисел', args: [a], expected: maxSubBrute(a) },
        { label: 'большой тест: все числа отрицательные', args: [b], expected: maxSubBrute(b) },
        { label: 'большой тест: чередование знаков', args: [c], expected: maxSubBrute(c) }
      ];
    }
  };

  NC_TESTS['jump-game'] = {
    fn: 'canJump',
    starter: 'function canJump(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // Ловушка для перебора без запоминания: прыжки по 1-2, затем два нуля подряд, дальше обрыв.
      var trap = range(1000, function (i) { return i < 600 ? 2 : 0; });
      var r = lcg(21), rnd = range(1000, function () { return Math.floor(r() * 3); });
      rnd[0] = 2;
      var ok = range(1000, function (i) { return i === 500 ? 0 : 2; });
      return [
        { args: [[1, 2, 0, 1, 0]], expected: true },
        { args: [[1, 2, 1, 0, 1]], expected: false },
        { args: [[0]], expected: true },
        { args: [[0, 1]], expected: false },
        { args: [[2, 0, 0]], expected: true },
        { args: [[3, 2, 1, 0, 4]], expected: false },
        { label: 'большой тест: два нуля подряд посреди массива из 1000 элементов', args: [trap], expected: canJumpDP(trap) },
        { label: 'большой тест: случайные малые прыжки', args: [rnd], expected: canJumpDP(rnd) },
        { label: 'большой тест: одиночный ноль можно перепрыгнуть', args: [ok], expected: true }
      ];
    }
  };

  NC_TESTS['jump-game-ii'] = {
    fn: 'jump',
    starter: 'function jump(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var ones = range(1000, function () { return 1; });
      var r = lcg(33), mixed;
      for (var seed = 1; seed < 200; seed++) {
        r = lcg(seed);
        mixed = range(1000, function () { return r() < 0.2 ? 0 : 1 + Math.floor(r() * 100); });
        if (jumpsDP(mixed) < Infinity) break;
      }
      var r2 = lcg(77), small = range(1000, function () { return 1 + Math.floor(r2() * 3); });
      return [
        { args: [[2, 4, 1, 1, 1, 1]], expected: 2 },
        { args: [[2, 1, 2, 1, 0]], expected: 2 },
        { args: [[0]], expected: 0 },
        { args: [[1, 1, 1, 1]], expected: 3 },
        { args: [[5, 1, 1, 1, 1, 1]], expected: 1 },
        { args: [[2, 3, 1, 1, 4]], expected: 2 },
        { label: 'большой тест: 1000 единиц', args: [ones], expected: 999 },
        { label: 'большой тест: случайные прыжки с нулями', args: [mixed], expected: jumpsDP(mixed) },
        { label: 'большой тест: малые прыжки 1-3', args: [small], expected: jumpsDP(small) }
      ];
    }
  };

  NC_TESTS['gas-station'] = {
    fn: 'canCompleteCircuit',
    starter: 'function canCompleteCircuit(gas, cost) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // Большой случай с единственным решением: суммарный баланс ровно 0, уникальный минимум префиксных сумм.
      var gas, cost, found = null;
      for (var seed = 1; seed < 50 && !found; seed++) {
        var r = lcg(seed);
        gas = range(1000, function () { return Math.floor(r() * 1001); });
        cost = range(1000, function () { return Math.floor(r() * 1001); });
        var diff = gas.reduce(function (a, b) { return a + b; }, 0) - cost.reduce(function (a, b) { return a + b; }, 0);
        for (var i = 0; diff !== 0; i = (i + 1) % 1000) {
          if (diff > 0 && cost[i] < 1000) { cost[i]++; diff--; }
          else if (diff < 0 && cost[i] > 0) { cost[i]--; diff++; }
        }
        var st = gasStarts(gas, cost);
        if (st.length === 1) found = { gas: gas, cost: cost, ans: st[0] };
      }
      var gasNo = found.gas.slice();
      for (var k = 0; k < 1000; k++) if (gasNo[(found.ans + k) % 1000] > 0) { gasNo[(found.ans + k) % 1000]--; break; }
      return [
        { args: [[1, 2, 3, 4], [2, 2, 4, 1]], expected: 3 },
        { args: [[1, 2, 3], [2, 3, 2]], expected: -1 },
        { args: [[5], [4]], expected: 0 },
        { args: [[2], [3]], expected: -1 },
        { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
        { args: [[0], [0]], expected: 0 },
        { args: [[3, 1, 1], [1, 2, 2]], expected: 0 },
        { label: 'большой тест: 1000 заправок, единственный старт', args: [found.gas, found.cost], expected: found.ans },
        { label: 'большой тест: 1000 заправок, топлива не хватает на 1', args: [gasNo, found.cost], expected: -1 }
      ];
    }
  };

  NC_TESTS['hand-of-straights'] = {
    fn: 'isNStraightHand',
    starter: 'function isNStraightHand(hand, groupSize) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(3), cards = [];
      for (var g = 0; g < 100; g++) {
        var st = Math.floor(r() * 800);
        for (var k = 0; k < 10; k++) cards.push(st + k);
      }
      var good = shuffled(cards, 9);
      var bad = shuffled(cards.slice(0, 990).concat([1000]), 10); // 1000 одиноко: соседей нет
      var oneBig = range(1000, function (i) { return i; });
      return [
        { args: [[1, 2, 4, 2, 3, 5, 3, 4], 4], expected: true },
        { args: [[1, 2, 3, 3, 4, 5], 4], expected: false },
        { args: [[1], 1], expected: true },
        { args: [[5, 5, 5, 5], 1], expected: true },
        { args: [[1, 2, 3, 5], 2], expected: false },
        { args: [[3, 2, 1], 3], expected: true },
        { args: [[1, 1, 2, 2, 3, 3], 3], expected: true },
        { args: [[1, 2, 3, 4], 3], expected: false },
        { label: 'большой тест: 100 групп по 10, перемешаны', args: [good, 10], expected: true },
        { label: 'большой тест: одна карта без соседей', args: [bad, 10], expected: false },
        { label: 'большой тест: одна группа из 1000 карт', args: [shuffled(oneBig, 4), 1000], expected: true }
      ];
    }
  };

  NC_TESTS['merge-triplets-to-form-target'] = {
    fn: 'mergeTriplets',
    starter: 'function mergeTriplets(triplets, target) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var target = [500, 600, 700], r = lcg(8), big = [], i;
      // Три нужных тройки, каждая даёт одну координату, не превышая цель в остальных.
      big.push([500, 1 + Math.floor(r() * 600), 1 + Math.floor(r() * 700)]);
      big.push([1 + Math.floor(r() * 500), 600, 1 + Math.floor(r() * 700)]);
      big.push([1 + Math.floor(r() * 500), 1 + Math.floor(r() * 600), 700]);
      // Остальные: хотя бы одна координата превышает цель, поэтому использовать их нельзя.
      for (i = 0; i < 997; i++) {
        var t = [1 + Math.floor(r() * 1000), 1 + Math.floor(r() * 1000), 1 + Math.floor(r() * 1000)];
        if (t[0] <= 500 && t[1] <= 600 && t[2] <= 700) t[i % 3] = [501, 601, 701][i % 3] + Math.floor(r() * 300);
        big.push(t);
      }
      var yes = shuffled(big, 2);
      // Тройка, дающая вторую координату, теперь превышает цель по третьей.
      var no = big.map(function (t) { return t.slice(); });
      no[1][2] = 701;
      no = shuffled(no, 2);
      return [
        { args: [[[1, 2, 3], [7, 1, 1]], [7, 2, 3]], expected: true },
        { args: [[[2, 5, 6], [1, 4, 4], [5, 7, 5]], [5, 4, 6]], expected: false },
        { args: [[[1, 1, 1]], [1, 1, 1]], expected: true },
        { args: [[[3, 3, 3]], [1, 1, 1]], expected: false },
        { args: [[[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]], expected: true },
        { args: [[[1, 3, 4], [2, 5, 8]], [2, 5, 8]], expected: true },
        { args: [[[1, 1, 1], [2, 2, 2]], [3, 3, 3]], expected: false },
        { label: 'большой тест: 1000 троек, ответ да', args: [yes, target], expected: true },
        { label: 'большой тест: 1000 троек, ответ нет', args: [no, target], expected: false }
      ];
    }
  };

  NC_TESTS['partition-labels'] = {
    fn: 'partitionLabels',
    starter: 'function partitionLabels(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      // Собираем строку из 13 кусков: в каждом две своих буквы, куски не делятся (A B ... A B).
      var r = lcg(12), s = '', sizes = [], p, len = [8, 7, 9, 6, 10, 4, 12, 5, 8, 7, 9, 5, 10];
      for (p = 0; p < 13; p++) {
        var A = String.fromCharCode(97 + 2 * p), B = String.fromCharCode(98 + 2 * p), piece = A + B;
        for (var k = 0; k < len[p] - 4; k++) piece += r() < 0.5 ? A : B;
        piece += A + B;
        s += piece; sizes.push(piece.length);
      }
      var one = 'a'.repeat(100);
      var alpha = '';
      for (p = 0; p < 26; p++) alpha += String.fromCharCode(97 + p).repeat(1 + (p % 4));
      var alphaSizes = range(26, function (p) { return 1 + (p % 4); });
      return [
        { args: ['xyxxyzbzbbisl'], expected: [5, 5, 1, 1, 1] },
        { args: ['abcabc'], expected: [6] },
        { args: ['a'], expected: [1] },
        { args: ['abc'], expected: [1, 1, 1] },
        { args: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8] },
        { args: ['eccbbbbdec'], expected: [10] },
        { label: 'большой тест: 13 кусков по две буквы (100 символов)', args: [s], expected: sizes },
        { label: 'большой тест: сто одинаковых букв', args: [one], expected: [100] },
        { label: 'большой тест: все буквы алфавита блоками', args: [alpha], expected: alphaSizes }
      ];
    }
  };

  NC_TESTS['valid-parenthesis-string'] = {
    fn: 'checkValidString',
    starter: 'function checkValidString(s) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var strs = [];
      var r = lcg(41);
      for (var t = 0; t < 4; t++) {
        var q = '';
        for (var i = 0; i < 100; i++) { var x = r(); q += x < 0.4 ? '*' : (x < 0.7 ? '(' : ')'); }
        strs.push(q);
      }
      // Следим, чтобы случайные строки дали и «да», и «нет»; иначе заменяем одну на заведомо подходящую.
      var res = strs.map(validStarBrute);
      if (res.indexOf(true) < 0) { strs[0] = '(*'.repeat(50); res[0] = true; }
      if (res.indexOf(false) < 0) { strs[1] = ')' + '*'.repeat(99); res[1] = false; }
      return [
        { args: ['((**)'], expected: true },
        { args: ['(((*)'], expected: false },
        { args: ['*'], expected: true },
        { args: ['('], expected: false },
        { args: [')'], expected: false },
        { args: ['(*)'], expected: true },
        { args: ['*)('], expected: false },
        { args: [')('], expected: false },
        { args: ['(*))'], expected: true },
        { label: 'большой тест: 50 открывающих и 50 звёздочек', args: ['('.repeat(50) + '*'.repeat(50)], expected: true },
        { label: 'большой тест: 51 открывающая и 49 звёздочек', args: ['('.repeat(51) + '*'.repeat(49)], expected: false },
        { label: 'большой тест: случайная строка из 100 символов', args: [strs[0]], expected: res[0] },
        { label: 'большой тест: ещё одна случайная строка из 100 символов', args: [strs[1]], expected: res[1] }
      ];
    }
  };

  NC_TESTS['insert-new-interval'] = {
    fn: 'insert',
    starter: 'function insert(intervals, newInterval) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var many = range(333, function (i) { return [3 * i, 3 * i + 1]; });
      var ni1 = [100, 800], ni2 = [1, 1], ni3 = [998, 1000], ni4 = [0, 1000];
      var dense = range(250, function (i) { return [4 * i, 4 * i + 2]; });
      var ni5 = [301, 302];
      return [
        { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
        { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
        { args: [[], [5, 7]], expected: [[5, 7]] },
        { args: [[[3, 5]], [1, 2]], expected: [[1, 2], [3, 5]] },
        { args: [[[1, 2]], [5, 6]], expected: [[1, 2], [5, 6]] },
        { args: [[[1, 2], [4, 6]], [2, 4]], expected: [[1, 6]] },
        { args: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
        { args: [[[2, 3], [5, 6]], [0, 10]], expected: [[0, 10]] },
        { args: [[[1, 2], [5, 5], [8, 9]], [5, 5]], expected: [[1, 2], [5, 5], [8, 9]] },
        { label: 'большой тест: 333 интервала, вставка накрывает середину', args: [many, ni1], expected: mergeByCells(many.concat([ni1])) },
        { label: 'большой тест: вставка в начало', args: [many, ni2], expected: mergeByCells(many.concat([ni2])) },
        { label: 'большой тест: вставка в конец', args: [many, ni3], expected: mergeByCells(many.concat([ni3])) },
        { label: 'большой тест: вставка накрывает всё', args: [many, ni4], expected: [[0, 1000]] },
        { label: 'большой тест: 250 интервалов, вставка в зазор', args: [dense, ni5], expected: mergeByCells(dense.concat([ni5])) }
      ];
    }
  };

  NC_TESTS['merge-intervals'] = {
    fn: 'merge',
    starter: 'function merge(intervals) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(55), rnd = range(1000, function () { var s = Math.floor(r() * 1000); return [s, Math.min(1000, s + Math.floor(r() * 4))]; });
      var chain = shuffled(range(1000, function (i) { return [i, i + 1]; }), 6);
      var r2 = lcg(66), sparse = range(300, function () { var s = Math.floor(r2() * 1000); return [s, Math.min(1000, s + Math.floor(r2() * 2))]; });
      return [
        { args: [[[1, 3], [1, 5], [6, 7]]], expected: [[1, 5], [6, 7]] },
        { args: [[[1, 2], [2, 3]]], expected: [[1, 3]] },
        { args: [[[4, 5]]], expected: [[4, 5]] },
        { args: [[[8, 10], [1, 3], [2, 6], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
        { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
        { args: [[[2, 2], [2, 2]]], expected: [[2, 2]] },
        { args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
        { args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
        { label: 'большой тест: 1000 случайных коротких интервалов', args: [rnd], expected: mergeByCells(rnd) },
        { label: 'большой тест: цепочка из 1000 перемешанных интервалов', args: [chain], expected: [[0, 1000]] },
        { label: 'большой тест: редкие интервалы', args: [sparse], expected: mergeByCells(sparse) }
      ];
    }
  };

  NC_TESTS['non-overlapping-intervals'] = {
    fn: 'eraseOverlapIntervals',
    starter: 'function eraseOverlapIntervals(intervals) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function gen(seed, n, span, maxLen) {
        var r = lcg(seed);
        return range(n, function () { var s = Math.floor(r() * span) - 50000; return [s, Math.min(50000, s + 1 + Math.floor(r() * maxLen))]; });
      }
      var a = gen(1, 1000, 100001, 2000), b = gen(2, 1000, 100001, 200), c = gen(3, 1000, 5000, 3000);
      return [
        { args: [[[1, 2], [2, 4], [1, 4]]], expected: 1 },
        { args: [[[1, 2], [2, 4]]], expected: 0 },
        { args: [[[1, 2]]], expected: 0 },
        { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
        { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 },
        { args: [[[-3, -1], [-2, 0], [-1, 1]]], expected: 1 },
        { args: [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]], expected: 2 },
        { label: 'большой тест: 1000 случайных интервалов, длинные', args: [a], expected: a.length - maxKeep(a) },
        { label: 'большой тест: 1000 случайных интервалов, короткие', args: [b], expected: b.length - maxKeep(b) },
        { label: 'большой тест: 1000 интервалов на узком отрезке', args: [c], expected: c.length - maxKeep(c) }
      ];
    }
  };

  NC_TESTS['meeting-schedule'] = {
    fn: 'canAttendMeetings',
    starter: 'function canAttendMeetings(intervals) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var seq = range(500, function (i) { return [2000 * i, 2000 * i + 1999]; });
      var okAll = shuffled(seq, 5);
      var clash;
      clash = shuffled(seq.slice(0, 499).concat([[2000 * 123 + 1990, 2000 * 124 + 5]]), 6);
      return [
        { args: [[[0, 30], [5, 10], [15, 20]]], expected: false },
        { args: [[[7, 10], [2, 4]]], expected: true },
        { args: [[]], expected: true },
        { args: [[[1, 2]]], expected: true },
        { args: [[[5, 8], [1, 6]]], expected: false },
        { args: [[[1, 5], [5, 10]]], expected: true },
        { args: [[[1, 10], [3, 4]]], expected: false },
        { label: 'большой тест: 500 встреч подряд, перемешаны', args: [okAll], expected: attendBrute(okAll) },
        { label: 'большой тест: 500 встреч, одна заходит на соседнюю', args: [clash], expected: attendBrute(clash) }
      ];
    }
  };

  NC_TESTS['meeting-schedule-ii'] = {
    fn: 'minMeetingRooms',
    starter: 'function minMeetingRooms(intervals) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(91), rnd = range(500, function () { var s = Math.floor(r() * 900000); return [s, s + 1 + Math.floor(r() * 100000)]; });
      var same = range(500, function () { return [10, 1000000]; });
      var seq = shuffled(range(500, function (i) { return [2000 * i, 2000 * i + 2000]; }), 4);
      var stair = range(500, function (i) { return [i, 1000 + i]; });
      return [
        { args: [[[0, 40], [5, 10], [15, 20]]], expected: 2 },
        { args: [[[4, 9]]], expected: 1 },
        { args: [[]], expected: 0 },
        { args: [[[1, 5], [5, 10]]], expected: 1 },
        { args: [[[0, 10], [1, 20], [11, 12]]], expected: 2 },
        { args: [[[1, 4], [1, 4], [1, 4]]], expected: 3 },
        { args: [[[0, 30], [5, 10], [8, 12], [11, 40]]], expected: 3 },
        { label: 'большой тест: 500 случайных встреч', args: [rnd], expected: roomsBrute(rnd) },
        { label: 'большой тест: 500 одинаковых встреч', args: [same], expected: 500 },
        { label: 'большой тест: 500 встреч подряд, касаются концами', args: [seq], expected: 1 },
        { label: 'большой тест: лесенка из 500 пересекающихся встреч', args: [stair], expected: 500 }
      ];
    }
  };

  NC_TESTS['minimum-interval-including-query'] = {
    fn: 'minInterval',
    starter: 'function minInterval(intervals, queries) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(2024), N = 100000;
      var iv1 = range(N, function () { var l = 1 + Math.floor(r() * 9999000); return [l, l + Math.floor(r() * 1000000)]; });
      iv1 = iv1.map(function (x) { return [x[0], Math.min(10000000, x[1])]; });
      var q1 = range(N, function () { return 1 + Math.floor(r() * 10000000); });
      // Вложенные интервалы: любой запрос накрыт многими, лучший ищется среди тысяч кандидатов.
      var iv2 = shuffled(range(N, function (i) { return [i + 1, 200000 - i]; }), 3);
      var q2 = shuffled(range(N, function (i) { return i + 1; }).concat([150000, 199999, 200000, 200001, 10000000]), 4).slice(0, N);
      return [
        { args: [[[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]], expected: [3, 3, 1, 4] },
        { args: [[[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]], expected: [2, -1, 4, 6] },
        { args: [[[5, 5]], [5]], expected: [1] },
        { args: [[[5, 5]], [4, 6]], expected: [-1, -1] },
        { args: [[[1, 10], [1, 10]], [10, 10, 1]], expected: [10, 10, 10] },
        { args: [[[1, 10], [3, 4]], [3, 4, 5, 2]], expected: [2, 2, 10, 10] },
        { label: 'большой тест: 100 000 интервалов и 100 000 запросов', args: [iv1, q1], expected: minIntervalPaint(iv1, q1) },
        { label: 'большой тест: вложенные интервалы', args: [iv2, q2], expected: minIntervalPaint(iv2, q2) }
      ];
    }
  };
})();
