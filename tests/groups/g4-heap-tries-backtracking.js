(function () {
  // ---------- общие помощники ----------
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function L(label, t) { t.label = label; return t; }
  function numAsc(x, y) { return x - y; }
  function lowerBound(a, v) {
    var lo = 0, hi = a.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (a[m] < v) lo = m + 1; else hi = m; }
    return lo;
  }
  // сравнение результата дизайн-задачи с числами (null == null, числа с допуском)
  function seqFloat(r, args, exp) {
    if (!Array.isArray(r) || r.length !== exp.length) return false;
    for (var i = 0; i < exp.length; i++) {
      if (exp[i] === null) { if (r[i] !== null) return false; continue; }
      if (typeof r[i] !== 'number' || !isFinite(r[i]) || Math.abs(r[i] - exp[i]) > 1e-5 * Math.max(1, Math.abs(exp[i]))) return false;
    }
    return true;
  }

  // ---------- kth-largest-integer-in-a-stream ----------
  function kthSim(k, nums, adds) {
    var a = nums.slice().sort(numAsc), out = [null];
    adds.forEach(function (v) { a.splice(lowerBound(a, v), 0, v); out.push(a[a.length - k]); });
    return out;
  }
  function kthCase(k, nums, adds) {
    var ops = ['KthLargest'], args = [[k, nums]];
    adds.forEach(function (v) { ops.push('add'); args.push([v]); });
    return { args: [ops, args], expected: kthSim(k, nums, adds) };
  }
  NC_TESTS['kth-largest-integer-in-a-stream'] = {
    fn: 'KthLargest',
    starter: 'class KthLargest {\n  constructor(k, nums) {\n    // твой код\n  }\n\n  add(val) {\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(KthLargest, ops, args); }',
    tests: function () {
      var r = lcg(41);
      var nums = range(999, function () { return ri(r, -1000, 1000); });
      var adds = range(10000, function () { return ri(r, -1000, 1000); });
      var nums2 = range(100, function () { return ri(r, -50, 50); });
      var adds2 = range(3000, function () { return ri(r, -50, 50); });
      return [
        kthCase(3, [1, 2, 3, 3], [3, 5, 6, 7, 8]),
        kthCase(1, [], [-5, 3, 2, -10]),
        kthCase(4, [4, 5, 8, 2], [3, 5, 10, 9, 4]),
        kthCase(2, [5], [5, 5, -1, 6]),
        kthCase(2, [-1, -1], [-1, -2, -3, 0]),
        L('большой тест: k = 1000, 10 000 добавлений', kthCase(1000, nums, adds)),
        L('большой тест: много повторов, k = 101', kthCase(101, nums2, adds2))
      ];
    }
  };

  // ---------- last-stone-weight ----------
  function stoneSim(st) {
    var a = st.slice();
    while (a.length > 1) {
      a.sort(numAsc);
      var y = a.pop(), x = a.pop();
      if (y !== x) a.push(y - x);
    }
    return a.length ? a[0] : 0;
  }
  NC_TESTS['last-stone-weight'] = {
    fn: 'lastStoneWeight',
    starter: 'function lastStoneWeight(stones) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(7), big = range(20, function () { return ri(r, 1, 100); });
      var r2 = lcg(8), mid = range(20, function () { return ri(r2, 1, 6); });
      var cases = [[2, 3, 6, 2, 4], [1, 2], [1], [5, 5], [2, 2, 2], [1, 1, 1, 1]];
      var more = [[7, 6, 7, 6, 9], [100, 100, 1], [8, 3, 5, 1, 1]];
      var t = cases.map(function (c) { return { args: [c], expected: stoneSim(c) }; });
      more.forEach(function (c) { t.push(L('крайний случай: ' + JSON.stringify(c), { args: [c], expected: stoneSim(c) })); });
      t.push(L('большой тест: 20 камней до 100', { args: [big], expected: stoneSim(big) }));
      t.push(L('большой тест: 20 камней с повторами', { args: [mid], expected: stoneSim(mid) }));
      return t;
    }
  };

  // ---------- k-closest-points-to-origin ----------
  function d2(p) { return p[0] * p[0] + p[1] * p[1]; }
  function closestExp(points, k) {
    var s = points.slice().sort(function (a, b) { return d2(a) - d2(b); });
    return s.slice(0, k);
  }
  function closestCase(points, k) {
    // граница должна быть однозначной: (k+1)-я точка строго дальше k-й
    var s = points.map(d2).sort(numAsc);
    if (k < points.length && s[k - 1] === s[k]) throw new Error('неоднозначная граница в тесте');
    return { args: [points, k], expected: closestExp(points, k) };
  }
  NC_TESTS['k-closest-points-to-origin'] = {
    fn: 'kClosest',
    starter: 'function kClosest(points, k) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      var r = lcg(99), pts = range(1000, function () { return [ri(r, -1000, 1000), ri(r, -1000, 1000)]; });
      var s = pts.map(d2).sort(numAsc), k = 137;
      while (s[k - 1] === s[k]) k++;
      var pts2 = range(1000, function (i) { return [ri(r, -30, 30), ri(r, -30, 30)]; });
      var s2 = pts2.map(d2).sort(numAsc), k2 = 500;
      while (s2[k2 - 1] === s2[k2]) k2++;
      return [
        closestCase([[0, 2], [2, 2]], 1),
        closestCase([[0, 2], [2, 0], [2, 2]], 2),
        closestCase([[-5, 4]], 1),
        closestCase([[3, 3], [5, -1], [-2, 4]], 2),
        closestCase([[1, 1], [1, 1], [2, 2], [-3, 0]], 2),
        closestCase([[0, 0], [1000, 1000], [-1000, -1000], [0, 1]], 4),
        L('большой тест: 1000 точек', closestCase(pts, k)),
        L('большой тест: 1000 точек с повторами', closestCase(pts2, k2))
      ];
    }
  };

  // ---------- kth-largest-element-in-an-array ----------
  function kthArr(nums, k) { return nums.slice().sort(function (a, b) { return b - a; })[k - 1]; }
  NC_TESTS['kth-largest-element-in-an-array'] = {
    fn: 'findKthLargest',
    starter: 'function findKthLargest(nums, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(5), rnd = range(10000, function () { return ri(r, -1000, 1000); });
      var asc = range(10000, function (i) { return -1000 + (i % 2001); }).sort(numAsc);
      var same = range(10000, function () { return 7; });
      var neg = [-5, -3, -10, -3];
      return [
        { args: [[2, 3, 1, 5, 4], 2], expected: 4 },
        { args: [[2, 3, 1, 2, 4, 2], 3], expected: 2 },
        { args: [[1], 1], expected: 1 },
        { args: [neg, 4], expected: kthArr(neg, 4) },
        { args: [[5, 5, 5, 1], 3], expected: 5 },
        { args: [[-1, 2, 0], 3], expected: -1 },
        L('большой тест: 10 000 случайных чисел, k = 5000', { args: [rnd, 5000], expected: kthArr(rnd, 5000) }),
        L('большой тест: отсортированный массив, k = 1', { args: [asc, 1], expected: kthArr(asc, 1) }),
        L('большой тест: все числа равны', { args: [same, 5000], expected: 7 })
      ];
    }
  };

  // ---------- task-scheduling ----------
  function schedExp(tasks, n) {
    var c = {}, m = 0;
    tasks.forEach(function (t) { c[t] = (c[t] || 0) + 1; if (c[t] > m) m = c[t]; });
    var cnt = 0;
    for (var k in c) if (c[k] === m) cnt++;
    return Math.max(tasks.length, (m - 1) * (n + 1) + cnt);
  }
  NC_TESTS['task-scheduling'] = {
    fn: 'leastInterval',
    starter: 'function leastInterval(tasks, n) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var r = lcg(12), rnd = range(1000, function () { return String.fromCharCode(65 + ri(r, 0, 25)); });
      var skew = range(1000, function () { var x = r(); return x < 0.3 ? 'A' : x < 0.5 ? 'B' : String.fromCharCode(67 + ri(r, 0, 23)); });
      var allA = range(1000, function () { return 'A'; });
      function T(tasks, n) { return { args: [tasks, n], expected: schedExp(tasks, n) }; }
      return [
        { args: [['X', 'X', 'Y'], 2], expected: 4 },
        { args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8 },
        T(['A', 'A', 'B'], 0),
        T(['A'], 100),
        T(['A', 'B', 'C'], 5),
        T(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 2),
        L('крайний случай: четыре A, n = 3', T(['A', 'A', 'A', 'A', 'B', 'B', 'C'], 3)),
        L('крайний случай: три типа с максимальным числом', T(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E'], 2)),
        L('большой тест: 1000 одинаковых задач, n = 100', T(allA, 100)),
        L('большой тест: 1000 случайных задач, n = 100', T(rnd, 100)),
        L('большой тест: перекошенное распределение, n = 10', T(skew, 10))
      ];
    }
  };

  // ---------- design-twitter-feed ----------
  function twSim(ops, args) {
    var tw = [], fol = {}, out = [null];
    for (var i = 1; i < ops.length; i++) {
      var a = args[i], op = ops[i];
      if (op === 'postTweet') { tw.push([a[0], a[1]]); out.push(null); }
      else if (op === 'follow') { (fol[a[0]] = fol[a[0]] || {})[a[1]] = true; out.push(null); }
      else if (op === 'unfollow') { if (fol[a[0]]) delete fol[a[0]][a[1]]; out.push(null); }
      else {
        var u = a[0], feed = [];
        for (var j = tw.length - 1; j >= 0 && feed.length < 10; j--) {
          if (tw[j][0] === u || (fol[u] && fol[u][tw[j][0]])) feed.push(tw[j][1]);
        }
        out.push(feed);
      }
    }
    return out;
  }
  function twCase(calls) {
    var ops = ['Twitter'], args = [[]];
    calls.forEach(function (c) { ops.push(c[0]); args.push(c.slice(1)); });
    return { args: [ops, args], expected: twSim(ops, args) };
  }
  NC_TESTS['design-twitter-feed'] = {
    fn: 'Twitter',
    starter: 'class Twitter {\n  constructor() {\n    // твой код\n  }\n\n  postTweet(userId, tweetId) {\n    // твой код\n  }\n\n  getNewsFeed(userId) {\n    // твой код\n  }\n\n  follow(followerId, followeeId) {\n    // твой код\n  }\n\n  unfollow(followerId, followeeId) {\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(Twitter, ops, args); }',
    tests: function () {
      var r = lcg(2024), calls = [], nextId = 1;
      for (var i = 0; i < 3000; i++) {
        var x = r(), u = ri(r, 1, 30), v = ri(r, 1, 30);
        if (x < 0.35 && nextId <= 1000) { calls.push(['postTweet', u, nextId++]); }
        else if (x < 0.75) { calls.push(['getNewsFeed', u]); }
        else if (v === u) { calls.push(['getNewsFeed', u]); }
        else if (x < 0.9) { calls.push(['follow', u, v]); }
        else { calls.push(['unfollow', u, v]); }
      }
      var twelve = [];
      for (var t = 1; t <= 12; t++) twelve.push(['postTweet', 1, t * 10]);
      twelve.push(['getNewsFeed', 1]);
      return [
        twCase([['postTweet', 1, 10], ['postTweet', 2, 20], ['getNewsFeed', 1], ['follow', 1, 2], ['getNewsFeed', 1], ['unfollow', 1, 2], ['getNewsFeed', 1]]),
        twCase([['getNewsFeed', 5], ['follow', 5, 6], ['getNewsFeed', 5], ['unfollow', 5, 7], ['getNewsFeed', 5]]),
        twCase(twelve),
        twCase([['postTweet', 1, 1], ['postTweet', 2, 2], ['postTweet', 3, 3], ['follow', 1, 3], ['follow', 1, 2], ['postTweet', 1, 4], ['postTweet', 2, 5], ['getNewsFeed', 1], ['unfollow', 1, 3], ['getNewsFeed', 1], ['getNewsFeed', 3], ['follow', 1, 2], ['getNewsFeed', 1]]),
        twCase([['postTweet', 1, 0], ['follow', 2, 1], ['follow', 2, 1], ['getNewsFeed', 2], ['unfollow', 2, 1], ['getNewsFeed', 2], ['getNewsFeed', 1]]),
        twCase((function () {
          var c = [], id = 100;
          for (var q = 1; q <= 6; q++) { c.push(['follow', 100, q]); for (var z = 0; z < 3; z++) c.push(['postTweet', q, id++]); }
          c.push(['postTweet', 100, 1000]); c.push(['getNewsFeed', 100]);
          return c;
        })()),
        L('большой тест: 3000 случайных операций', twCase(calls))
      ];
    }
  };

  // ---------- find-median-in-a-data-stream ----------
  function medSim(seq) {
    var a = [], out = [null];
    seq.forEach(function (v) {
      if (v === null) { var n = a.length; out.push(n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2); }
      else { a.splice(lowerBound(a, v), 0, v); out.push(null); }
    });
    return out;
  }
  function medCase(seq) {
    var ops = ['MedianFinder'], args = [[]];
    seq.forEach(function (v) { if (v === null) { ops.push('findMedian'); args.push([]); } else { ops.push('addNum'); args.push([v]); } });
    return { args: [ops, args], expected: medSim(seq) };
  }
  NC_TESTS['find-median-in-a-data-stream'] = {
    fn: 'MedianFinder',
    starter: 'class MedianFinder {\n  constructor() {\n    // твой код\n  }\n\n  addNum(num) {\n    // твой код\n  }\n\n  findMedian() {\n    // твой код\n  }\n}\n',
    cmp: seqFloat,
    wrap: 'function __t(ops, args) { return __H.runDesign(MedianFinder, ops, args); }',
    tests: function () {
      var r = lcg(31), seq = [];
      for (var i = 0; i < 20000; i++) { seq.push(ri(r, -100000, 100000)); seq.push(null); }
      var seq2 = [];
      for (var j = 0; j < 5000; j++) { seq2.push(ri(r, -3, 3)); if (j % 3 === 0) seq2.push(null); }
      seq2.push(null);
      return [
        medCase([1, 2, null, 3, null]),
        medCase([-7, null]),
        medCase([5, 5, null, 5, null]),
        medCase([100000, -100000, null, 100000, null, -100000, null]),
        medCase([3, 1, 2, null, 10, null, -4, null, 0, null]),
        medCase([1, 2, 3, 4, 5, 6, null, 0, null]),
        L('большой тест: 20 000 чисел, медиана после каждого', medCase(seq)),
        L('большой тест: много повторов', medCase(seq2))
      ];
    }
  };

  // ---------- implement-prefix-tree ----------
  function trieCase(calls) {
    var ops = ['PrefixTree'], args = [[]];
    calls.forEach(function (c) { ops.push(c[0]); args.push([c[1]]); });
    var words = {}, pre = {}, out = [null];
    calls.forEach(function (c) {
      var w = c[1];
      if (c[0] === 'insert') {
        words[w] = true;
        for (var i = 0; i <= w.length; i++) pre[w.slice(0, i)] = true;
        out.push(null);
      } else if (c[0] === 'search') out.push(!!words[w]);
      else out.push(!!pre[w]);
    });
    return { args: [ops, args], expected: out };
  }
  NC_TESTS['implement-prefix-tree'] = {
    fn: 'PrefixTree',
    starter: 'class PrefixTree {\n  constructor() {\n    // твой код\n  }\n\n  insert(word) {\n    // твой код\n  }\n\n  search(word) {\n    // твой код\n  }\n\n  startsWith(prefix) {\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(PrefixTree, ops, args); }',
    tests: function () {
      var r = lcg(77), calls = [], alpha = 'abcde';
      function rw(a, b) { var n = ri(r, a, b), s = ''; for (var i = 0; i < n; i++) s += alpha[ri(r, 0, 4)]; return s; }
      var longs = range(3, function (k) { return range(1000, function (i) { return alpha[(i * (k + 2) + k) % 5]; }).join(''); });
      longs.forEach(function (w) { calls.push(['insert', w]); });
      for (var i = 0; i < 5000; i++) calls.push(['insert', rw(1, 12)]);
      for (var q = 0; q < 6000; q++) calls.push([q % 2 ? 'search' : 'startsWith', rw(1, 12)]);
      longs.forEach(function (w) {
        calls.push(['search', w]); calls.push(['startsWith', w]); calls.push(['search', w.slice(0, 999)]);
        calls.push(['startsWith', w.slice(0, 500)]); calls.push(['startsWith', w + 'a']); calls.push(['search', w + 'a']);
        calls.push(['startsWith', w.slice(0, 600) + (w[600] === 'a' ? 'b' : 'a')]);
      });
      return [
        trieCase([['insert', 'dog'], ['search', 'dog'], ['search', 'do'], ['startsWith', 'do'], ['insert', 'do'], ['search', 'do']]),
        trieCase([['search', 'a'], ['startsWith', 'a'], ['insert', 'a'], ['search', 'a'], ['startsWith', 'a'], ['search', 'ab'], ['startsWith', 'ab']]),
        trieCase([['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app'], ['insert', 'app'], ['search', 'app'], ['search', 'apples'], ['startsWith', 'apples']]),
        trieCase([['insert', 'cat'], ['insert', 'car'], ['startsWith', 'ca'], ['startsWith', 'cab'], ['search', 'ca'], ['search', 'car'], ['search', 'cart'], ['startsWith', 'dog']]),
        trieCase([['insert', 'abc'], ['insert', 'abc'], ['search', 'abc'], ['search', 'abd'], ['startsWith', 'abcd'], ['startsWith', 'b']]),
        L('большой тест: 5000 слов, слова длиной 1000 и 6000 запросов', trieCase(calls))
      ];
    }
  };

  // ---------- design-word-search-data-structure ----------
  function wdMatch(w, q) {
    if (w.length !== q.length) return false;
    for (var i = 0; i < q.length; i++) if (q[i] !== '.' && q[i] !== w[i]) return false;
    return true;
  }
  function wdCase(calls) {
    var ops = ['WordDictionary'], args = [[]], words = [], out = [null];
    calls.forEach(function (c) {
      ops.push(c[0]); args.push([c[1]]);
      if (c[0] === 'addWord') { words.push(c[1]); out.push(null); }
      else { var f = false; for (var i = 0; i < words.length && !f; i++) f = wdMatch(words[i], c[1]); out.push(f); }
    });
    return { args: [ops, args], expected: out };
  }
  NC_TESTS['design-word-search-data-structure'] = {
    fn: 'WordDictionary',
    starter: 'class WordDictionary {\n  constructor() {\n    // твой код\n  }\n\n  addWord(word) {\n    // твой код\n  }\n\n  search(word) {\n    // твой код\n  }\n}\n',
    cmp: 'exact',
    wrap: 'function __t(ops, args) { return __H.runDesign(WordDictionary, ops, args); }',
    tests: function () {
      var r = lcg(55), alpha = 'abcdef', words = [], calls = [];
      function rw(a, b) { var n = ri(r, a, b), s = ''; for (var i = 0; i < n; i++) s += alpha[ri(r, 0, 5)]; return s; }
      for (var i = 0; i < 12000; i++) { var w = rw(3, 12); words.push(w); calls.push(['addWord', w]); }
      for (var q = 0; q < 400; q++) {
        var base = q % 3 === 0 ? rw(3, 12) : words[ri(r, 0, words.length - 1)], s = base.split(''), dots = ri(r, 0, 2);
        for (var d = 0; d < dots; d++) s[ri(r, 0, s.length - 1)] = '.';
        if (q % 5 === 0) s.push(alpha[ri(r, 0, 5)]);
        calls.push(['search', s.join('')]);
      }
      return [
        wdCase([['addWord', 'day'], ['addWord', 'bay'], ['addWord', 'may'], ['search', 'say'], ['search', 'day'], ['search', '.ay'], ['search', 'b..']]),
        wdCase([['search', 'a'], ['search', '.'], ['addWord', 'a'], ['search', 'a'], ['search', '.'], ['search', 'b'], ['search', '..']]),
        wdCase([['addWord', 'day'], ['search', 'da'], ['search', 'days'], ['search', 'd.'], ['search', '...'], ['search', '....'], ['search', 'd.y']]),
        wdCase([['addWord', 'abc'], ['addWord', 'abd'], ['addWord', 'xbc'], ['search', '.bc'], ['search', 'ab.'], ['search', '..c'], ['search', '.b.'], ['search', 'a.d'], ['search', 'x.d']]),
        wdCase([['addWord', 'at'], ['addWord', 'and'], ['addWord', 'an'], ['addWord', 'add'], ['search', 'a'], ['search', '.at'], ['addWord', 'bat'], ['search', '.at'], ['search', 'an.'], ['search', 'a.d.'], ['search', 'b.'], ['search', 'a.d'], ['search', '.a']]),
        L('большой тест: 12 000 слов и 400 запросов с точками', wdCase(calls))
      ];
    }
  };

  // ---------- search-for-word-ii ----------
  function gridHas(board, word) {
    var m = board.length, n = board[0].length, seen = [];
    for (var i = 0; i < m; i++) seen.push(new Array(n).fill(false));
    function go(i, j, p) {
      if (i < 0 || j < 0 || i >= m || j >= n || seen[i][j] || board[i][j] !== word[p]) return false;
      if (p === word.length - 1) return true;
      seen[i][j] = true;
      var f = go(i + 1, j, p + 1) || go(i - 1, j, p + 1) || go(i, j + 1, p + 1) || go(i, j - 1, p + 1);
      seen[i][j] = false;
      return f;
    }
    for (var a = 0; a < m; a++) for (var b = 0; b < n; b++) if (go(a, b, 0)) return true;
    return false;
  }
  function wordsCase(board, words) {
    return { args: [board, words], expected: words.filter(function (w) { return gridHas(board, w); }) };
  }
  function randBoard(r, m, n, alpha) {
    return range(m, function () { return range(n, function () { return alpha[ri(r, 0, alpha.length - 1)]; }); });
  }
  function walkWord(r, board, len) {
    var m = board.length, n = board[0].length, i = ri(r, 0, m - 1), j = ri(r, 0, n - 1), seen = {}, s = board[i][j];
    seen[i * 100 + j] = true;
    while (s.length < len) {
      var cand = [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]].filter(function (c) {
        return c[0] >= 0 && c[1] >= 0 && c[0] < m && c[1] < n && !seen[c[0] * 100 + c[1]];
      });
      if (!cand.length) break;
      var c = cand[ri(r, 0, cand.length - 1)];
      i = c[0]; j = c[1]; seen[i * 100 + j] = true; s += board[i][j];
    }
    return s;
  }
  function uniqueWords(list) {
    var seen = {}, out = [];
    list.forEach(function (w) { if (!seen[w]) { seen[w] = true; out.push(w); } });
    return out;
  }
  NC_TESTS['search-for-word-ii'] = {
    fn: 'findWords',
    starter: 'function findWords(board, words) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      var r = lcg(1234);
      var b1 = randBoard(r, 12, 12, 'abcdefghijklmnopqrstuvwxyz'), w1 = [];
      for (var i = 0; i < 6000; i++) w1.push(walkWord(r, b1, ri(r, 1, 10)));
      while (w1.length < 40000) { var n = ri(r, 1, 10), s = ''; for (var k = 0; k < n; k++) s += String.fromCharCode(97 + ri(r, 0, 25)); w1.push(s); }
      w1 = uniqueWords(w1).slice(0, 30000);
      var b2 = randBoard(r, 12, 12, 'abc'), w2 = [];
      for (var i2 = 0; i2 < 5000; i2++) w2.push(walkWord(r, b2, ri(r, 4, 10)));
      for (var i3 = 0; i3 < 5000; i3++) { var n3 = ri(r, 4, 10), s3 = ''; for (var k3 = 0; k3 < n3; k3++) s3 += 'abc'[ri(r, 0, 2)]; w2.push(s3); }
      w2 = uniqueWords(w2);
      var b3 = range(12, function () { return range(12, function () { return 'a'; }); }), w3 = [];
      for (var l = 1; l <= 10; l++) { w3.push('a'.repeat(l)); w3.push('b' + 'a'.repeat(l)); w3.push('ab' + 'a'.repeat(l)); }
      var b3Exp = [];
      for (var l2 = 1; l2 <= 10; l2++) b3Exp.push('a'.repeat(l2));
      return [
        wordsCase([['a', 'b', 'c', 'd'], ['s', 'a', 'a', 't'], ['a', 'c', 'k', 'e'], ['a', 'c', 'd', 'n']], ['bat', 'cat', 'back', 'backend', 'stack']),
        wordsCase([['a']], ['a', 'b', 'aa']),
        wordsCase([['a', 'b'], ['c', 'd']], ['abdc', 'acdb', 'abcd', 'ad', 'dcab', 'abc']),
        wordsCase([['a', 'a']], ['aa', 'aaa']),
        wordsCase([['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']], ['oath', 'pea', 'eat', 'rain']),
        wordsCase([['a', 'b', 'c']], ['a', 'ab', 'abc', 'abcd', 'cb', 'cba', 'bca']),
        L('большой тест: поле 12×12, 30 000 слов', wordsCase(b1, w1)),
        L('большой тест: поле 12×12 из трёх букв', wordsCase(b2, w2)),
        L('большой тест: поле 12×12 из одной буквы', { args: [b3, w3], expected: b3Exp })
      ];
    }
  };

  // ---------- subsets ----------
  function subsetsExp(nums) {
    var out = [];
    for (var mask = 0; mask < (1 << nums.length); mask++) {
      var s = [];
      for (var i = 0; i < nums.length; i++) if (mask & (1 << i)) s.push(nums[i]);
      out.push(s);
    }
    return out;
  }
  NC_TESTS['subsets'] = {
    fn: 'subsets',
    starter: 'function subsets(nums) {\n  // твой код\n}\n',
    cmp: 'setOfSets',
    tests: function () {
      function T(a) { return { args: [a], expected: subsetsExp(a) }; }
      return [
        T([1, 2, 3]),
        T([7]),
        T([-10, 0, 10]),
        T([4, -1, 2, 9]),
        T([5, 3, 1, 2, 4]),
        L('большой тест: 10 чисел (1024 подмножества)', T([-10, -7, -3, -1, 0, 2, 4, 6, 9, 10]))
      ];
    }
  };

  // ---------- combination-target-sum ----------
  function combExp(nums, target) {
    var dp = [];
    for (var s = 0; s <= target; s++) dp.push([]);
    dp[0].push([]);
    nums.forEach(function (c) {
      for (var s2 = c; s2 <= target; s2++) {
        dp[s2 - c].forEach(function (combo) { dp[s2].push(combo.concat([c])); });
      }
    });
    return dp[target];
  }
  NC_TESTS['combination-target-sum'] = {
    fn: 'combinationSum',
    starter: 'function combinationSum(nums, target) {\n  // твой код\n}\n',
    cmp: 'setOfSets',
    tests: function () {
      function T(a, t) { return { args: [a, t], expected: combExp(a, t) }; }
      return [
        T([2, 5, 6, 9], 9),
        T([3, 4, 5], 16),
        T([6, 2, 9, 5], 9),
        T([7], 7),
        T([2], 1),
        L('крайний случай: ни одно число не подходит', T([5, 7], 3)),
        L('крайний случай: 15 двоек', T([2], 30)),
        L('большой тест: числа от 2 до 21, target = 30', T(range(20, function (i) { return i + 2; }), 30)),
        L('большой тест: числа от 2 до 11, target = 30', T([11, 2, 10, 3, 9, 4, 8, 5, 7, 6], 30))
      ];
    }
  };

  // ---------- combination-target-sum-ii ----------
  function comb2Exp(c, target) {
    var cnt = {};
    c.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
    var vals = Object.keys(cnt).map(Number).sort(numAsc), res = [];
    (function rec(i, rem, cur) {
      if (rem === 0) { res.push(cur.slice()); return; }
      if (i === vals.length) return;
      var v = vals[i];
      for (var k = 0; k <= cnt[v] && k * v <= rem; k++) {
        for (var q = 0; q < k; q++) cur.push(v);
        rec(i + 1, rem - k * v, cur);
        for (var q2 = 0; q2 < k; q2++) cur.pop();
      }
    })(0, target, []);
    return res;
  }
  NC_TESTS['combination-target-sum-ii'] = {
    fn: 'combinationSum2',
    starter: 'function combinationSum2(candidates, target) {\n  // твой код\n}\n',
    cmp: 'setOfSets',
    tests: function () {
      function T(a, t) { return { args: [a, t], expected: comb2Exp(a, t) }; }
      var r = lcg(61), rnd = range(100, function () { return ri(r, 1, 50); });
      var mixed = [];
      for (var i = 0; i < 50; i++) mixed.push(1);
      for (var j = 0; j < 30; j++) mixed.push(2);
      for (var k = 0; k < 20; k++) mixed.push(3);
      return [
        T([9, 2, 2, 4, 6, 1, 5], 8),
        T([1, 2, 3, 4, 5], 7),
        T([2, 4], 3),
        T([1, 1, 1, 1], 2),
        L('крайний случай: три единицы', T([1, 1, 1], 3)),
        L('крайний случай: повторы в середине', T([10, 1, 2, 7, 6, 1, 5], 8)),
        L('крайний случай: одно число', T([5], 5)),
        L('большой тест: 100 чисел до 50, target = 30', T(rnd, 30)),
        L('большой тест: 100 единиц', T(range(100, function () { return 1; }), 30)),
        L('большой тест: 50 единиц, 30 двоек, 20 троек', T(mixed, 30))
      ];
    }
  };

  // ---------- permutations ----------
  function permsExp(nums) {
    var idx = nums.map(function (_, i) { return i; }), out = [];
    for (;;) {
      out.push(idx.map(function (i) { return nums[i]; }));
      var i = idx.length - 2;
      while (i >= 0 && idx[i] > idx[i + 1]) i--;
      if (i < 0) break;
      var j = idx.length - 1;
      while (idx[j] < idx[i]) j--;
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
      for (var a = i + 1, b = idx.length - 1; a < b; a++, b--) { t = idx[a]; idx[a] = idx[b]; idx[b] = t; }
    }
    return out;
  }
  NC_TESTS['permutations'] = {
    fn: 'permute',
    starter: 'function permute(nums) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      function T(a) { return { args: [a], expected: permsExp(a) }; }
      return [
        T([1, 2, 3]),
        T([1]),
        T([0, -1]),
        T([5, -3, 8, 0]),
        T([3, 1, 2, 4, 5]),
        L('большой тест: 6 чисел (720 перестановок)', T([-10, 7, 0, 3, -4, 10]))
      ];
    }
  };

  // ---------- subsets-ii ----------
  function subsets2Exp(nums) {
    var cnt = {};
    nums.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
    var vals = Object.keys(cnt).map(Number), res = [];
    (function rec(i, cur) {
      if (i === vals.length) { res.push(cur.slice()); return; }
      for (var k = 0; k <= cnt[vals[i]]; k++) {
        for (var q = 0; q < k; q++) cur.push(vals[i]);
        rec(i + 1, cur);
        for (var q2 = 0; q2 < k; q2++) cur.pop();
      }
    })(0, []);
    return res;
  }
  NC_TESTS['subsets-ii'] = {
    fn: 'subsetsWithDup',
    starter: 'function subsetsWithDup(nums) {\n  // твой код\n}\n',
    cmp: 'setOfSets',
    tests: function () {
      function T(a) { return { args: [a], expected: subsets2Exp(a) }; }
      return [
        T([1, 2, 1]),
        T([7, 7]),
        T([0]),
        T([4, 4, 4, 1, 4]),
        T([-1, 2, -1, 2, 3]),
        T([5, 5, 5, 5, 5]),
        L('большой тест: 11 чисел с повторами', T([1, 1, 1, 2, 2, 3, 3, 3, 3, 4, 5])),
        L('большой тест: 11 разных чисел (2048 подмножеств)', T([-5, 9, 3, 0, -2, 7, 1, 4, 10, -10, 6]))
      ];
    }
  };

  // ---------- generate-parentheses ----------
  function parenExp(n) {
    var out = [];
    for (var mask = 0; mask < (1 << (2 * n)); mask++) {
      var bal = 0, ok = true, s = '';
      for (var i = 0; i < 2 * n && ok; i++) {
        if (mask & (1 << i)) { bal++; s += '('; } else { bal--; s += ')'; }
        if (bal < 0) ok = false;
      }
      if (ok && bal === 0) out.push(s);
    }
    return out;
  }
  NC_TESTS['generate-parentheses'] = {
    fn: 'generateParenthesis',
    starter: 'function generateParenthesis(n) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      function T(n) { return { args: [n], expected: parenExp(n) }; }
      return [
        T(1),
        T(3),
        T(2),
        T(4),
        T(5),
        L('большой тест: n = 7 (429 вариантов)', T(7))
      ];
    }
  };

  // ---------- search-for-word ----------
  NC_TESTS['search-for-word'] = {
    fn: 'exist',
    starter: 'function exist(board, word) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var abcd = [['A', 'B', 'C', 'D'], ['S', 'A', 'A', 'T'], ['A', 'C', 'A', 'E']];
      var classic = [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];
      var allA = range(6, function () { return range(6, function () { return 'A'; }); });
      var oneB = allA.map(function (row) { return row.slice(); });
      oneB[5][5] = 'B';
      // змейка: строка 0 слева направо, строка 1 справа налево, строка 2 слева направо (первые 15 клеток)
      var snake = range(6, function () { return range(6, function () { return 'Z'; }); });
      var path = 'ABCDEFGHIJKLMNO';
      for (var q = 0; q < 15; q++) {
        var row = Math.floor(q / 6), col = q % 6;
        snake[row][row % 2 ? 5 - col : col] = path[q];
      }
      return [
        { args: [abcd, 'CAT'], expected: true },
        { args: [abcd, 'BAT'], expected: false },
        { args: [[['a']], 'a'], expected: true },
        { args: [[['A', 'B']], 'ABA'], expected: false },
        { args: [classic, 'ABCCED'], expected: true },
        { args: [classic, 'ABCB'], expected: false },
        L('крайний случай: слово длиннее поля из одной клетки', { args: [[['a']], 'aa'], expected: false }),
        L('крайний случай: вертикальный ход', { args: [[['A'], ['B']], 'BA'], expected: true }),
        L('крайний случай: SEE', { args: [classic, 'SEE'], expected: true }),
        L('крайний случай: по диагонали ходить нельзя', { args: [[['A', 'B'], ['C', 'D']], 'AD'], expected: false }),
        L('крайний случай: обход по кругу', { args: [[['A', 'B'], ['C', 'D']], 'ACDB'], expected: true }),
        L('крайний случай: регистр букв важен (Aa)', { args: [[['a', 'A']], 'Aa'], expected: true }),
        L('крайний случай: регистр букв важен (AA)', { args: [[['a', 'A']], 'AA'], expected: false }),
        L('крайний случай: нужен откат назад', { args: [[['C', 'A', 'A'], ['A', 'A', 'A'], ['B', 'C', 'D']], 'AAB'], expected: true }),
        L('крайний случай: 10 букв на поле из 9 клеток', { args: [[['A', 'A', 'A'], ['A', 'A', 'A'], ['A', 'A', 'A']], 'AAAAAAAAAA'], expected: false }),
        L('большой тест: поле из A, одна B, слово из 14 A и B', { args: [oneB, 'AAAAAAAAAAAAAAB'], expected: true }),
        L('большой тест: поле из A без B, слово из 14 A и B', { args: [allA, 'AAAAAAAAAAAAAAB'], expected: false }),
        L('большой тест: путь змейкой из 15 разных букв', { args: [snake, path], expected: true }),
        L('большой тест: змейка, последняя буква не та', { args: [snake, 'ABCDEFGHIJKLMNX'], expected: false })
      ];
    }
  };

  // ---------- palindrome-partitioning ----------
  function palPartExp(s) {
    var n = s.length, pal = [];
    for (var i = 0; i < n; i++) { pal.push([]); for (var j = 0; j < n; j++) pal[i].push(false); }
    for (var a = 0; a < n; a++) for (var b = a; b < n; b++) {
      var l = a, r = b, ok = true;
      while (l < r) { if (s[l] !== s[r]) { ok = false; break; } l++; r--; }
      pal[a][b] = ok;
    }
    var out = [];
    for (var mask = 0; mask < (1 << (n - 1)); mask++) {
      var parts = [], start = 0, good = true;
      for (var k = 0; k < n; k++) {
        if (k === n - 1 || (mask & (1 << k))) {
          if (!pal[start][k]) { good = false; break; }
          parts.push(s.slice(start, k + 1)); start = k + 1;
        }
      }
      if (good) out.push(parts);
    }
    return out;
  }
  NC_TESTS['palindrome-partitioning'] = {
    fn: 'partition',
    starter: 'function partition(s) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      function T(s) { return { args: [s], expected: palPartExp(s) }; }
      return [
        T('aab'),
        T('a'),
        T('aaa'),
        T('abc'),
        T('racecar'),
        T('abbab'),
        L('большой тест: 16 букв a (32 768 разбиений)', T('aaaaaaaaaaaaaaaa')),
        L('большой тест: 16 букв со многими палиндромами', T('abacabadabacabaa'))
      ];
    }
  };

  // ---------- combinations-of-a-phone-number ----------
  var PHONE = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };
  function phoneExp(d) {
    if (!d.length) return [];
    var res = [''];
    for (var i = 0; i < d.length; i++) {
      var next = [];
      res.forEach(function (p) { PHONE[d[i]].split('').forEach(function (ch) { next.push(p + ch); }); });
      res = next;
    }
    return res;
  }
  NC_TESTS['combinations-of-a-phone-number'] = {
    fn: 'letterCombinations',
    starter: 'function letterCombinations(digits) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      function T(d) { return { args: [d], expected: phoneExp(d) }; }
      return [
        T('34'),
        T(''),
        T('2'),
        T('7'),
        T('79'),
        T('2345'),
        L('большой тест: 9999 (256 комбинаций)', T('9999')),
        L('большой тест: 7979 (256 комбинаций)', T('7979'))
      ];
    }
  };

  // ---------- n-queens ----------
  function queensExp(n) {
    var out = [], p = [], used = [];
    for (var i = 0; i < n; i++) used.push(false);
    (function rec() {
      if (p.length === n) {
        for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) if (Math.abs(p[a] - p[b]) === b - a) return;
        out.push(p.map(function (c) { return '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1); }));
        return;
      }
      for (var c = 0; c < n; c++) if (!used[c]) { used[c] = true; p.push(c); rec(); p.pop(); used[c] = false; }
    })();
    return out;
  }
  NC_TESTS['n-queens'] = {
    fn: 'solveNQueens',
    starter: 'function solveNQueens(n) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      function T(n) { return { args: [n], expected: queensExp(n) }; }
      return [
        T(4),
        T(1),
        T(2),
        T(3),
        T(5),
        T(6),
        L('большой тест: n = 7 (40 расстановок)', T(7)),
        L('большой тест: n = 8 (92 расстановки)', T(8))
      ];
    }
  };
})();
