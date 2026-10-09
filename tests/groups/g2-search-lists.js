(function () {
  var LN = '// class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }\n\n';
  // Прокси, считающий чтение элементов по индексу: так отсекается линейный просмотр там, где нужен бинарный поиск.
  var CNT = 'function __cnt(a, c) { return new Proxy(a, { get: function (t, k, r) { if (typeof k === "string" && /^\\d+$/.test(k)) c.n++; return Reflect.get(t, k, r); } }); }\n';
  function J() { return Array.prototype.join.call(arguments, '\n'); }
  function sortedRand(seed, n, lo, hi) {
    var r = lcg(seed);
    return range(n, function () { return lo + Math.floor(r() * (hi - lo + 1)); }).sort(function (a, b) { return a - b; });
  }
  function rot(a, k) { return a.slice(k).concat(a.slice(0, k)); }

  // ---------- binary-search ----------
  NC_TESTS['binary-search'] = {
    fn: 'search',
    starter: 'function search(nums, target) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: CNT + J(
      'function __t(nums, target) {',
      '  var c = { n: 0 }, a = nums.length >= 500 ? __cnt(nums, c) : nums;',
      '  var r = search(a, target);',
      '  if (c.n > 100) return "слишком много обращений к массиву: " + c.n + " (нужен бинарный поиск)";',
      '  return r;',
      '}'),
    tests: function () {
      var big = range(10000, function (i) { return 2 * i - 9999; });
      return [
        { args: [[-1, 0, 2, 4, 6, 8], 4], expected: 3 },
        { args: [[-1, 0, 2, 4, 6, 8], 3], expected: -1 },
        { args: [[5], 5], expected: 0 },
        { args: [[5], -5], expected: -1 },
        { args: [[1, 3], 3], expected: 1 },
        { args: [[-9999, -3, 7, 100], -10], expected: -1 },
        { label: 'большой тест: 10 000 чисел, цель в середине', args: [big, big[7777]], expected: 7777 },
        { label: 'большой тест: 10 000 чисел, цели нет', args: [big, 5556], expected: -1 },
        { label: 'большой тест: 10 000 чисел, цель последняя', args: [big, 9999], expected: 9999 }
      ];
    }
  };

  // ---------- search-2d-matrix ----------
  NC_TESTS['search-2d-matrix'] = {
    fn: 'searchMatrix',
    starter: 'function searchMatrix(matrix, target) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: CNT + J(
      'function __t(matrix, target) {',
      '  var c = { n: 0 }, big = matrix.length * matrix[0].length >= 500;',
      '  var m = big ? matrix.map(function (row) { return __cnt(row, c); }) : matrix;',
      '  var r = searchMatrix(m, target);',
      '  if (c.n > 100) return "слишком много обращений к элементам: " + c.n + " (нужен бинарный поиск)";',
      '  return r;',
      '}'),
    tests: function () {
      var M = [[1, 2, 4, 8], [10, 11, 12, 13], [14, 20, 30, 40]];
      var big = range(100, function (i) { return range(100, function (j) { return i * 200 + 2 * j - 9999; }); });
      return [
        { args: [M, 10], expected: true },
        { args: [M, 15], expected: false },
        { args: [M, 12], expected: true },
        { args: [[[1]], 1], expected: true },
        { args: [[[1]], 0], expected: false },
        { args: [[[-7, 1, 3]], 1], expected: true },
        { label: 'большой тест: матрица 100×100, число есть', args: [big, 1527], expected: true },
        { label: 'большой тест: матрица 100×100, числа нет', args: [big, 1528], expected: false },
        { label: 'большой тест: матрица 100×100, последний элемент', args: [big, 9999], expected: true }
      ];
    }
  };

  // ---------- eating-bananas ----------
  NC_TESTS['eating-bananas'] = {
    fn: 'minEatingSpeed',
    starter: 'function minEatingSpeed(piles, h) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      function brute(piles, h) {
        for (var k = 1; ; k++) {
          var t = 0;
          for (var i = 0; i < piles.length; i++) t += Math.ceil(piles[i] / k);
          if (t <= h) return k;
        }
      }
      function hours(piles, k) { var t = 0; for (var i = 0; i < piles.length; i++) t += Math.ceil(piles[i] / k); return t; }
      function bs(piles, h) {
        var lo = 1, hi = 0, i;
        for (i = 0; i < piles.length; i++) if (piles[i] > hi) hi = piles[i];
        while (lo < hi) { var mid = Math.floor((lo + hi) / 2); if (hours(piles, mid) <= h) hi = mid; else lo = mid + 1; }
        return lo;
      }
      var small = [[1, 4, 3, 2], 9], small2 = [[3, 6, 7, 11], 8], small3 = [[30, 11, 23, 4, 20], 5], small4 = [[30, 11, 23, 4, 20], 6], small5 = [[312884470], 312884469];
      var many = range(1000, function () { return 1000000000; });
      var r = lcg(77), rnd = range(1000, function () { return 1 + Math.floor(r() * 1000000000); });
      return [
        { args: small, expected: 2 },
        { args: [[25, 10, 23, 4], 4], expected: 25 },
        { args: [[1], 1], expected: 1 },
        { args: small2, expected: brute(small2[0], small2[1]) },
        { args: small3, expected: 30 },
        { args: small5, expected: 2 },
        { label: 'большой тест: 1000 куч по 10⁹, h = 1000', args: [many, 1000], expected: 1000000000 },
        { label: 'большой тест: 1000 куч по 10⁹, h = 10⁹', args: [many, 1000000000], expected: 1000 },
        { label: 'большой тест: одна куча 10⁹, h = 1', args: [[1000000000], 1], expected: 1000000000 },
        { label: 'большой тест: 1000 случайных куч до 10⁹, h = 5000', args: [rnd, 5000], expected: bs(rnd, 5000) }
      ];
    }
  };

  // ---------- find-minimum-in-rotated-sorted-array ----------
  NC_TESTS['find-minimum-in-rotated-sorted-array'] = {
    fn: 'findMin',
    starter: 'function findMin(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: CNT + J(
      'function __t(nums) {',
      '  var c = { n: 0 }, a = nums.length >= 500 ? __cnt(nums, c) : nums;',
      '  var r = findMin(a);',
      '  if (c.n > 60) return "слишком много обращений к массиву: " + c.n + " (нужен бинарный поиск)";',
      '  return r;',
      '}'),
    tests: function () {
      var base = range(1000, function (i) { return 2 * i - 1000; });
      return [
        { args: [[3, 4, 5, 6, 1, 2]], expected: 1 },
        { args: [[4, 5, 0, 1, 2, 3]], expected: 0 },
        { args: [[4, 5, 6, 7]], expected: 4 },
        { args: [[1]], expected: 1 },
        { args: [[2, 1]], expected: 1 },
        { args: [[-2, -1, -5, -4, -3]], expected: -5 },
        { label: 'большой тест: 1000 чисел, сдвиг 337', args: [rot(base, 337)], expected: -1000 },
        { label: 'большой тест: 1000 чисел, без сдвига', args: [base], expected: -1000 },
        { label: 'большой тест: 1000 чисел, сдвиг 999', args: [rot(base, 999)], expected: -1000 }
      ];
    }
  };

  // ---------- find-target-in-rotated-sorted-array ----------
  NC_TESTS['find-target-in-rotated-sorted-array'] = {
    fn: 'search',
    starter: 'function search(nums, target) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: CNT + J(
      'function __t(nums, target) {',
      '  var c = { n: 0 }, a = nums.length >= 500 ? __cnt(nums, c) : nums;',
      '  var r = search(a, target);',
      '  if (c.n > 100) return "слишком много обращений к массиву: " + c.n + " (нужен бинарный поиск)";',
      '  return r;',
      '}'),
    tests: function () {
      var base = range(1000, function (i) { return 2 * i - 999; });
      var R = rot(base, 613);
      return [
        { args: [[3, 4, 5, 6, 1, 2], 1], expected: 4 },
        { args: [[3, 5, 6, 0, 1, 2], 4], expected: -1 },
        { args: [[1], 1], expected: 0 },
        { args: [[1], 0], expected: -1 },
        { args: [[3, 1], 1], expected: 1 },
        { args: [[5, 1, 3], 3], expected: 2 },
        { label: 'большой тест: 1000 чисел, цель в левой части', args: [R, R[100]], expected: 100 },
        { label: 'большой тест: 1000 чисел, цель в правой части', args: [R, R[900]], expected: 900 },
        { label: 'большой тест: 1000 чисел, цели нет', args: [R, 0], expected: -1 }
      ];
    }
  };

  // ---------- time-based-key-value-store ----------
  NC_TESTS['time-based-key-value-store'] = {
    fn: 'TimeMap',
    starter: 'class TimeMap {\n  constructor() {\n    // твой код\n  }\n\n  set(key, value, timestamp) {\n    // твой код\n  }\n\n  get(key, timestamp) {\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(TimeMap, ops, args); }',
    tests: function () {
      var N = 60000, ops = ['TimeMap'], args = [[]], exp = [null], i;
      for (i = 0; i < N; i++) { ops.push('set'); args.push(['k', 'v' + i, 2 * i + 1]); exp.push(null); }
      var r = lcg(5);
      for (i = 0; i < N; i++) {
        var idx = Math.floor(r() * N), ts = 2 * idx + 1 + (r() < 0.5 ? 0 : 1);
        ops.push('get'); args.push(['k', ts]); exp.push('v' + idx);
      }
      ops.push('get'); args.push(['k', 0]); exp.push('');
      ops.push('get'); args.push(['k', 10000000]); exp.push('v' + (N - 1));
      return [
        { args: [['TimeMap', 'set', 'get', 'get', 'set', 'get', 'get'], [[], ['alice', 'happy', 1], ['alice', 1], ['alice', 2], ['alice', 'sad', 3], ['alice', 3], ['alice', 2]]], expected: [null, null, 'happy', 'happy', null, 'sad', 'happy'] },
        { args: [['TimeMap', 'get', 'set', 'get'], [[], ['a', 5], ['a', 'x', 10], ['a', 9]]], expected: [null, '', null, ''] },
        { args: [['TimeMap', 'set', 'set', 'set', 'get', 'get', 'get', 'get'], [[], ['a', 'a1', 1], ['b', 'b1', 2], ['a', 'a5', 5], ['a', 4], ['b', 100], ['a', 5], ['c', 3]]], expected: [null, null, null, null, 'a1', 'b1', 'a5', ''] },
        { args: [['TimeMap', 'set', 'set', 'set', 'get', 'get', 'get', 'get'], [[], ['k', 'p', 10], ['k', 'q', 20], ['k', 'r', 30], ['k', 25], ['k', 20], ['k', 9], ['k', 31]]], expected: [null, null, null, null, 'q', 'q', '', 'r'] },
        { label: 'большой тест: 60 000 set и 60 000 get по одному ключу', args: [ops, args], expected: exp }
      ];
    }
  };

  // ---------- median-of-two-sorted-arrays ----------
  NC_TESTS['median-of-two-sorted-arrays'] = {
    fn: 'findMedianSortedArrays',
    starter: 'function findMedianSortedArrays(nums1, nums2) {\n  // твой код\n}\n',
    cmp: 'float',
    wrap: CNT + J(
      'function __t(nums1, nums2) {',
      '  var c = { n: 0 }, big = nums1.length + nums2.length >= 1000;',
      '  var r = findMedianSortedArrays(big ? __cnt(nums1, c) : nums1, big ? __cnt(nums2, c) : nums2);',
      '  if (c.n > 200) return "слишком много обращений к массивам: " + c.n + " (нужно O(log(m + n)))";',
      '  return r;',
      '}'),
    tests: function () {
      function med(a, b) {
        var m = a.concat(b).sort(function (x, y) { return x - y; }), n = m.length;
        return n % 2 ? m[(n - 1) / 2] : (m[n / 2 - 1] + m[n / 2]) / 2;
      }
      var A = sortedRand(1, 1000, -1000000, 1000000), B = sortedRand(2, 1000, -1000000, 1000000);
      var lowB = range(1000, function (i) { return -1000000 + i; }), highA = range(1000, function (i) { return 500000 + 3 * i; });
      return [
        { args: [[1, 2], [3]], expected: 2 },
        { args: [[1, 3], [2, 4]], expected: 2.5 },
        { args: [[], [1]], expected: 1 },
        { args: [[2], []], expected: 2 },
        { args: [[-5, -3], [-4, -1]], expected: -3.5 },
        { args: [[10, 20], [1, 2, 3]], expected: 3 },
        { label: 'большой тест: два массива по 1000 случайных чисел', args: [A, B], expected: med(A, B) },
        { label: 'большой тест: все числа второго массива меньше', args: [highA, lowB], expected: med(highA, lowB) },
        { label: 'большой тест: пустой массив и 1000 чисел', args: [[], A], expected: med([], A) }
      ];
    }
  };

  // ---------- merge-two-sorted-linked-lists ----------
  NC_TESTS['merge-two-sorted-linked-lists'] = {
    fn: 'mergeTwoLists',
    starter: LN + 'function mergeTwoLists(list1, list2) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: J(
      'function __t(a, b) {',
      '  var l1 = __H.arrToList(a), l2 = __H.arrToList(b), seen = new Set(), p;',
      '  for (p = l1; p; p = p.next) seen.add(p);',
      '  for (p = l2; p; p = p.next) seen.add(p);',
      '  var r = mergeTwoLists(l1, l2), out = [];',
      '  for (p = r; p; p = p.next) {',
      '    if (!seen.has(p)) return out.concat(["лишний или повторный узел: нужны те же узлы"]);',
      '    seen.delete(p); out.push(p.val);',
      '  }',
      '  if (seen.size) return out.concat(["потеряно узлов: " + seen.size]);',
      '  return out;',
      '}'),
    tests: function () {
      var a = sortedRand(10, 50, -100, 100), b = sortedRand(11, 50, -100, 100);
      return [
        { args: [[1, 2, 4], [1, 3, 5]], expected: [1, 1, 2, 3, 4, 5] },
        { args: [[], []], expected: [] },
        { args: [[], [1, 2]], expected: [1, 2] },
        { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
        { args: [[-3, -3, 0], [-3, 7, 7]], expected: [-3, -3, -3, 0, 7, 7] },
        { args: [[1, 2, 3], [10, 20]], expected: [1, 2, 3, 10, 20] },
        { label: 'большой тест: два списка по 50 узлов', args: [a, b], expected: a.concat(b).sort(function (x, y) { return x - y; }) }
      ];
    }
  };

  // ---------- linked-list-cycle-detection ----------
  NC_TESTS['linked-list-cycle-detection'] = {
    fn: 'hasCycle',
    starter: LN + 'function hasCycle(head) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr, pos) { return hasCycle(__H.arrToList(arr, pos)); }',
    tests: function () {
      var big = range(1000, function (i) { return i % 7; });
      return [
        { args: [[1, 2, 3, 4], 1], expected: true },
        { args: [[1, 2], -1], expected: false },
        { args: [[1], -1], expected: false },
        { args: [[1], 0], expected: true },
        { args: [[1, 1, 1], -1], expected: false },
        { args: [[1, 2], 0], expected: true },
        { label: 'большой тест: 1000 узлов, цикл на узел 500', args: [big, 500], expected: true },
        { label: 'большой тест: 1000 узлов, цикла нет', args: [big, -1], expected: false },
        { label: 'большой тест: 1000 узлов, хвост на голову', args: [big, 0], expected: true }
      ];
    }
  };

  // ---------- reorder-linked-list ----------
  NC_TESTS['reorder-linked-list'] = {
    fn: 'reorderList',
    starter: LN + 'function reorderList(head) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: J(
      'function __t(arr) {',
      '  var head = __H.arrToList(arr), nodes = [], p, i;',
      '  for (p = head; p; p = p.next) nodes.push(p);',
      '  var vals = nodes.map(function (x) { return x.val; }), n = nodes.length;',
      '  reorderList(head);',
      '  var order = [], lo = 0, hi = n - 1;',
      '  while (lo <= hi) { order.push(nodes[lo++]); if (lo <= hi) order.push(nodes[hi--]); }',
      '  var out = [], bad = false;',
      '  for (p = head, i = 0; p && i <= n; p = p.next, i++) { out.push(p.val); if (order[i] !== p) bad = true; }',
      '  var want = order.map(function (x) { return vals[nodes.indexOf(x)]; });',
      '  for (i = 0; i < n; i++) if (nodes[i].val !== vals[i]) bad = true;',
      '  if (bad && JSON.stringify(out) === JSON.stringify(want)) return out.concat(["значения менять нельзя, только указатели"]);',
      '  return out;',
      '}'),
    tests: function () {
      function exp(a) { var n = a.length; return range(n, function (i) { return i % 2 === 0 ? a[i / 2] : a[n - 1 - (i - 1) / 2]; }); }
      var big = range(1000, function (i) { return (i * 37) % 1000 + 1; });
      return [
        { args: [[2, 4, 6, 8]], expected: [2, 8, 4, 6] },
        { args: [[2, 4, 6, 8, 10]], expected: [2, 10, 4, 8, 6] },
        { args: [[7]], expected: [7] },
        { args: [[1, 2]], expected: [1, 2] },
        { args: [[1, 2, 3]], expected: [1, 3, 2] },
        { args: [[5, 5, 5, 1, 1, 1]], expected: [5, 1, 5, 1, 5, 1] },
        { label: 'большой тест: 1000 узлов', args: [big], expected: exp(big) }
      ];
    }
  };

  // ---------- remove-node-from-end-of-linked-list ----------
  NC_TESTS['remove-node-from-end-of-linked-list'] = {
    fn: 'removeNthFromEnd',
    starter: LN + 'function removeNthFromEnd(head, n) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr, n) { return __H.listToArr(removeNthFromEnd(__H.arrToList(arr), n)); }',
    tests: function () {
      var a30 = range(30, function (i) { return (i * 3) % 101; });
      function rm(a, n) { var b = a.slice(); b.splice(b.length - n, 1); return b; }
      return [
        { args: [[1, 2, 3, 4], 2], expected: [1, 2, 4] },
        { args: [[5], 1], expected: [] },
        { args: [[1, 2], 2], expected: [2] },
        { args: [[1, 2, 3, 4, 5], 5], expected: [2, 3, 4, 5] },
        { args: [a30, 1], expected: rm(a30, 1) },
        { args: [a30, 30], expected: rm(a30, 30) },
        { label: 'большой тест: 30 узлов, удаляется 17-й с конца', args: [a30, 17], expected: rm(a30, 17) }
      ];
    }
  };

  // ---------- copy-linked-list-with-random-pointer ----------
  NC_TESTS['copy-linked-list-with-random-pointer'] = {
    fn: 'copyRandomList',
    starter: '// class Node { constructor(val = 0, next = null, random = null) { this.val = val; this.next = next; this.random = random; } }\n// (можно объявить его самому или использовать ListNode и дописать поле random)\n\nfunction copyRandomList(head) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: J(
      'function __t(pairs) {',
      '  var N = __H.ListNode, i;',
      '  var nodes = pairs.map(function (p) { var n = new N(p[0], null); n.random = null; return n; });',
      '  for (i = 0; i < nodes.length; i++) {',
      '    nodes[i].next = nodes[i + 1] || null;',
      '    nodes[i].random = pairs[i][1] === null ? null : nodes[pairs[i][1]];',
      '  }',
      '  var orig = new Set(nodes), c = copyRandomList(nodes[0] || null);',
      '  var idx = new Map(), list = [], p, deep = true;',
      '  for (p = c; p && !idx.has(p) && list.length <= nodes.length + 5; p = p.next) { idx.set(p, list.length); list.push(p); }',
      '  var out = list.map(function (q) {',
      '    if (orig.has(q)) deep = false;',
      '    var r = q.random;',
      '    if (r === null || r === undefined) return [q.val, null];',
      '    if (orig.has(r)) deep = false;',
      '    return [q.val, idx.has(r) ? idx.get(r) : -1];',
      '  });',
      '  var intact = true;',
      '  for (i = 0; i < nodes.length; i++) {',
      '    var wantR = pairs[i][1] === null ? null : nodes[pairs[i][1]];',
      '    if (nodes[i].next !== (nodes[i + 1] || null) || nodes[i].random !== wantR || nodes[i].val !== pairs[i][0]) intact = false;',
      '  }',
      '  return { list: out, deep: deep, intact: intact };',
      '}'),
    tests: function () {
      function ok(p) { return { list: p, deep: true, intact: true }; }
      var r = lcg(21);
      var rnd = range(100, function (i) { return [Math.floor(r() * 201) - 100, r() < 0.2 ? null : Math.floor(r() * 100)]; });
      var ex = [[3, null], [7, 3], [4, 0], [5, 1]];
      var self = [[1, 0]], two = [[1, 1], [2, 0]], same = [[-5, null], [-5, 1], [-5, 0]];
      var allNull = [[1, null], [2, null], [3, null]], toLast = [[1, 2], [2, 2], [3, 2]];
      return [
        { args: [ex], expected: ok(ex) },
        { args: [[]], expected: ok([]) },
        { args: [[[1, null]]], expected: ok([[1, null]]) },
        { args: [self], expected: ok(self) },
        { args: [two], expected: ok(two) },
        { args: [same], expected: ok(same) },
        { label: 'большой тест: 100 узлов со случайными random', args: [rnd], expected: ok(rnd) }
      ];
    }
  };

  // ---------- add-two-numbers ----------
  NC_TESTS['add-two-numbers'] = {
    fn: 'addTwoNumbers',
    starter: LN + 'function addTwoNumbers(l1, l2) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(a, b) { return __H.listToArr(addTwoNumbers(__H.arrToList(a), __H.arrToList(b))); }',
    tests: function () {
      function add(a, b) {
        var x = BigInt(a.slice().reverse().join('')) + BigInt(b.slice().reverse().join(''));
        return x.toString().split('').reverse().map(Number);
      }
      var r = lcg(31);
      function digits(n) { var d = range(n, function () { return Math.floor(r() * 10); }); if (d[n - 1] === 0) d[n - 1] = 7; return d; }
      var A = digits(100), B = digits(100), C = digits(60), nines = range(100, function () { return 9; });
      return [
        { args: [[1, 2, 3], [4, 5, 6]], expected: [5, 7, 9] },
        { args: [[9], [9]], expected: [8, 1] },
        { args: [[0], [0]], expected: [0] },
        { args: [[9, 9, 9], [1]], expected: [0, 0, 0, 1] },
        { args: [[5, 6], [4, 3, 2, 1]], expected: [9, 9, 2, 1] },
        { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
        { label: 'большой тест: два числа по 100 цифр', args: [A, B], expected: add(A, B) },
        { label: 'большой тест: 100 девяток плюс единица', args: [nines, [1]], expected: add(nines, [1]) },
        { label: 'большой тест: числа из 100 и 60 цифр', args: [B, C], expected: add(B, C) }
      ];
    }
  };

  // ---------- find-duplicate-integer ----------
  NC_TESTS['find-duplicate-integer'] = {
    fn: 'findDuplicate',
    starter: 'function findDuplicate(nums) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: J(
      'function __t(nums) {',
      '  var copy = nums.slice(), r = findDuplicate(nums);',
      '  for (var i = 0; i < copy.length; i++) if (copy[i] !== nums[i]) return "массив изменён: так нельзя";',
      '  return r;',
      '}'),
    tests: function () {
      var perm = shuffled(range(10000, function (i) { return i + 1; }), 3);
      var withDup = perm.slice(); withDup.splice(4321, 0, 777);
      var first = [10000].concat(range(9999, function (i) { return i + 1; })); first.push(10000);
      var triple = shuffled(range(9998, function (i) { return (i + 1 >= 5000) ? i + 2 : i + 1; }).concat([5000, 5000, 5000]), 8);
      return [
        { args: [[1, 2, 3, 2, 2]], expected: 2 },
        { args: [[1, 2, 3, 4, 4]], expected: 4 },
        { args: [[1, 1]], expected: 1 },
        { args: [[2, 2, 2, 2, 2]], expected: 2 },
        { args: [[3, 1, 3, 4, 2]], expected: 3 },
        { args: [[5, 3, 1, 2, 4, 3]], expected: 3 },
        { label: 'большой тест: 10 001 число, повтор в случайном месте', args: [withDup], expected: 777 },
        { label: 'большой тест: повторы на концах массива', args: [first], expected: 10000 },
        { label: 'большой тест: число встречается три раза', args: [triple], expected: 5000 }
      ];
    }
  };

  // ---------- merge-k-sorted-linked-lists ----------
  NC_TESTS['merge-k-sorted-linked-lists'] = {
    fn: 'mergeKLists',
    starter: LN + 'function mergeKLists(lists) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(lists) { return __H.listToArr(mergeKLists(lists.map(function (a) { return __H.arrToList(a); })), 1000000); }',
    tests: function () {
      function flat(ls) { return [].concat.apply([], ls).sort(function (a, b) { return a - b; }); }
      var many = range(10000, function (i) { return sortedRand(1000 + i, 20, -10000, 10000); });
      var wide = range(100, function (i) { return sortedRand(5000 + i, 500, -10000, 10000); });
      return [
        { args: [[[1, 2, 4], [1, 3, 5], [3, 6]]], expected: [1, 1, 2, 3, 3, 4, 5, 6] },
        { args: [[]], expected: [] },
        { args: [[[]]], expected: [] },
        { args: [[[], []]], expected: [] },
        { args: [[[], [1], []]], expected: [1] },
        { args: [[[-5, -1], [-3], [0, 0], [-10, 10]]], expected: [-10, -5, -3, -1, 0, 0, 10] },
        { label: 'большой тест: 10 000 списков по 20 узлов', args: [many], expected: flat(many) },
        { label: 'большой тест: 100 списков по 500 узлов', args: [wide], expected: flat(wide) }
      ];
    }
  };

  // ---------- reverse-nodes-in-k-group ----------
  NC_TESTS['reverse-nodes-in-k-group'] = {
    fn: 'reverseKGroup',
    starter: LN + 'function reverseKGroup(head, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: J(
      'function __t(arr, k) {',
      '  var head = __H.arrToList(arr), nodes = [], p, i, j;',
      '  for (p = head; p; p = p.next) nodes.push(p);',
      '  var vals = nodes.map(function (x) { return x.val; }), n = nodes.length;',
      '  var r = reverseKGroup(head, k), order = [];',
      '  for (i = 0; i + k <= n; i += k) for (j = i + k - 1; j >= i; j--) order.push(nodes[j]);',
      '  for (; i < n; i++) order.push(nodes[i]);',
      '  var out = [], bad = false;',
      '  for (p = r, i = 0; p && i <= n; p = p.next, i++) { out.push(p.val); if (order[i] !== p) bad = true; }',
      '  for (i = 0; i < n; i++) if (nodes[i].val !== vals[i]) bad = true;',
      '  var want = order.map(function (x) { return vals[nodes.indexOf(x)]; });',
      '  if (bad && JSON.stringify(out) === JSON.stringify(want)) return out.concat(["значения менять нельзя, только указатели"]);',
      '  return out;',
      '}'),
    tests: function () {
      function exp(a, k) {
        var out = [], i = 0;
        while (i + k <= a.length) { out = out.concat(a.slice(i, i + k).reverse()); i += k; }
        return out.concat(a.slice(i));
      }
      var a100 = range(100, function (i) { return (i * 13) % 101; });
      var seq = function (n) { return range(n, function (i) { return i + 1; }); };
      return [
        { args: [[1, 2, 3, 4, 5, 6], 3], expected: [3, 2, 1, 6, 5, 4] },
        { args: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
        { args: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
        { args: [[1, 2, 3, 4, 5], 5], expected: [5, 4, 3, 2, 1] },
        { args: [seq(7), 3], expected: exp(seq(7), 3) },
        { args: [[0], 1], expected: [0] },
        { label: 'большой тест: 100 узлов, k = 7', args: [a100, 7], expected: exp(a100, 7) },
        { label: 'большой тест: 100 узлов, k = 100', args: [a100, 100], expected: a100.slice().reverse() }
      ];
    }
  };
})();
