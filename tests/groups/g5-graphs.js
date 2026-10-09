(function () {
  var INF = 2147483647;

  // ---------- общие помощники (только для генерации тестов) ----------
  function mk(m, n, f) { return range(m, function (i) { return range(n, function (j) { return f(i, j); }); }); }
  function randGrid(m, n, p, seed, one, zero) { var r = lcg(seed); return mk(m, n, function () { return r() < p ? one : zero; }); }
  function clone2(g) { return g.map(function (row) { return row.slice(); }); }
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  // размеры компонент (4 соседа), обход итеративный
  function compSizes(g, one) {
    var m = g.length, n = g[0].length, seen = new Uint8Array(m * n), out = [];
    for (var i = 0; i < m; i++) for (var j = 0; j < n; j++) {
      if (g[i][j] !== one || seen[i * n + j]) continue;
      var st = [i * n + j], size = 0; seen[i * n + j] = 1;
      while (st.length) {
        var c = st.pop(), x = (c / n) | 0, y = c % n; size++;
        for (var d = 0; d < 4; d++) {
          var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx >= 0 && ny >= 0 && nx < m && ny < n && g[nx][ny] === one && !seen[nx * n + ny]) { seen[nx * n + ny] = 1; st.push(nx * n + ny); }
        }
      }
      out.push(size);
    }
    return out;
  }
  function adjFromEdges(n, edges) {
    var a = range(n, function () { return []; });
    edges.forEach(function (e) { a[e[0] - 1].push(e[1]); a[e[1] - 1].push(e[0]); });
    return a;
  }
  function sortedAdj(adj) { return adj.map(function (l) { return l.slice().sort(function (a, b) { return a - b; }); }); }
  // случайные различные пары (u, v), u != v; directed — ориентированные
  function randPairs(count, lo, hi, seed, directed, bannedTo) {
    var r = lcg(seed), seen = {}, out = [], guard = 0;
    while (out.length < count && guard++ < 200000) {
      var u = lo + Math.floor(r() * (hi - lo + 1)), v = lo + Math.floor(r() * (hi - lo + 1));
      if (u === v || v === bannedTo) continue;
      var key = directed ? u + ',' + v : Math.min(u, v) + ',' + Math.max(u, v);
      if (seen[key]) continue;
      seen[key] = 1; out.push([u, v]);
    }
    return out;
  }
  function compCount(n, edges) {
    // распространяем минимальную метку по рёбрам, пока что-то меняется
    var comp = range(n, function (i) { return i; }), ch = true;
    while (ch) {
      ch = false;
      edges.forEach(function (e) {
        var a = comp[e[0]], b = comp[e[1]];
        if (a < b) { comp[e[1]] = a; ch = true; } else if (b < a) { comp[e[0]] = b; ch = true; }
      });
    }
    var s = {}; comp.forEach(function (c) { s[c] = 1; });
    return Object.keys(s).length;
  }

  // =====================================================================
  NC_TESTS['count-number-of-islands'] = {
    fn: 'numIslands',
    starter: 'function numIslands(grid) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randGrid(100, 100, 0.5, 11, '1', '0');
      return [
        { args: [[['0', '1', '1', '1', '0'], ['0', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
        { args: [[['1', '1', '0', '0', '1'], ['1', '1', '0', '0', '1'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 4 },
        { args: [[['1']]], expected: 1 },
        { args: [[['0']]], expected: 0 },
        { args: [[['1', '0'], ['0', '1']]], expected: 2 },
        { args: [[['1', '1', '1'], ['0', '1', '0'], ['1', '1', '1']]], expected: 1 },
        { label: 'большой тест: шахматная доска 100×100', args: [mk(100, 100, function (i, j) { return (i + j) % 2 === 0 ? '1' : '0'; })], expected: 5000 },
        { label: 'большой тест: случайная сетка 100×100', args: [rnd], expected: compSizes(rnd, '1').length },
        { label: 'большой тест: сплошная суша 40×40', args: [mk(40, 40, function () { return '1'; })], expected: 1 }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['max-area-of-island'] = {
    fn: 'maxAreaOfIsland',
    starter: 'function maxAreaOfIsland(grid) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = randGrid(50, 50, 0.55, 5, 1, 0), sz = compSizes(rnd, 1);
      return [
        { args: [[[0, 1, 1, 0, 1], [1, 0, 1, 0, 1], [0, 1, 1, 0, 1], [0, 1, 0, 0, 1]]], expected: 6 },
        { args: [[[0]]], expected: 0 },
        { args: [[[1]]], expected: 1 },
        { args: [[[1, 0], [0, 1]]], expected: 1 },
        { args: [[[1, 1, 0], [0, 1, 0], [1, 0, 1]]], expected: 3 },
        { args: [[[0, 0, 0], [0, 0, 0]]], expected: 0 },
        { label: 'большой тест: сплошная суша 50×50', args: [mk(50, 50, function () { return 1; })], expected: 2500 },
        { label: 'большой тест: случайная сетка 50×50', args: [rnd], expected: Math.max.apply(null, sz) },
        { label: 'большой тест: шахматная доска 50×50', args: [mk(50, 50, function (i, j) { return (i + j) % 2; })], expected: 1 }
      ];
    }
  };

  // =====================================================================
  var CLONE_WRAP = [
    'function __t(adj) {',
    '  var n = adj.length, orig = [], i, j;',
    '  for (i = 0; i < n; i++) orig.push({ val: i + 1, neighbors: [] });',
    '  for (i = 0; i < n; i++) for (j = 0; j < adj[i].length; j++) orig[i].neighbors.push(orig[adj[i][j] - 1]);',
    '  var res = cloneGraph(n ? orig[0] : null);',
    '  if (!n) return { adj: res === null ? [] : null, deep: res === null };',
    '  if (!res || typeof res !== "object" || !Array.isArray(res.neighbors)) return { adj: null, deep: false };',
    '  var origSet = new Set(orig), byVal = {}, deep = true, bad = false, seen = new Set([res]), q = [res];',
    '  while (q.length) {',
    '    var u = q.pop();',
    '    if (origSet.has(u)) deep = false;',
    '    if (byVal[u.val] !== undefined && byVal[u.val] !== u) bad = true;',
    '    byVal[u.val] = u;',
    '    if (!Array.isArray(u.neighbors)) { bad = true; continue; }',
    '    for (var k = 0; k < u.neighbors.length; k++) {',
    '      var v = u.neighbors[k];',
    '      if (!v || typeof v !== "object") { bad = true; continue; }',
    '      if (!seen.has(v)) { seen.add(v); q.push(v); }',
    '    }',
    '    if (seen.size > 1000) { bad = true; break; }',
    '  }',
    '  for (i = 0; i < n; i++) {',
    '    if (orig[i].neighbors.length !== adj[i].length) deep = false;',
    '    else for (j = 0; j < adj[i].length; j++) if (orig[i].neighbors[j] !== orig[adj[i][j] - 1]) deep = false;',
    '  }',
    '  var out = [];',
    '  for (i = 1; i <= n; i++) {',
    '    var c = byVal[i];',
    '    if (!c || !Array.isArray(c.neighbors)) { bad = true; out.push(null); }',
    '    else out.push(c.neighbors.map(function (x) { return x && x.val; }).sort(function (a, b) { return a - b; }));',
    '  }',
    '  return { adj: bad ? null : out, deep: deep };',
    '}'
  ].join('\n');

  NC_TESTS['clone-graph'] = {
    fn: 'cloneGraph',
    starter: 'class Node {\n  constructor(val = 0, neighbors = []) {\n    this.val = val;\n    this.neighbors = neighbors;\n  }\n}\n\nfunction cloneGraph(node) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: CLONE_WRAP,
    tests: function () {
      var r = lcg(77), edges = [], seen = {};
      for (var i = 1; i <= 100; i++) { var nx = i % 100 + 1; edges.push([i, nx]); seen[Math.min(i, nx) + ',' + Math.max(i, nx)] = 1; }
      var tries = 0;
      while (edges.length < 220 && tries++ < 5000) {
        var a = 1 + Math.floor(r() * 100), b = 1 + Math.floor(r() * 100), key = Math.min(a, b) + ',' + Math.max(a, b);
        if (a === b || seen[key]) continue;
        seen[key] = 1; edges.push([a, b]);
      }
      var big = adjFromEdges(100, edges);
      var cases = [
        [[2], [1, 3], [2]],
        [[]],
        [],
        [[2], [1]],
        [[2, 3], [1, 3], [1, 2]],
        [[2, 4], [1, 3], [2, 4], [1, 3]],
        [[2, 3, 4, 5], [1], [1], [1], [1]]
      ];
      var out = cases.map(function (adj, i) { var t = { args: [adj], expected: { adj: sortedAdj(adj), deep: true } }; if (i === 6) t.label = 'крайний случай: звезда из 5 узлов'; return t; });
      out.push({ label: 'большой тест: граф из 100 узлов с циклами', args: [big], expected: { adj: sortedAdj(big), deep: true } });
      return out;
    }
  };

  // =====================================================================
  NC_TESTS['islands-and-treasure'] = {
    fn: 'islandsAndTreasure',
    starter: 'function islandsAndTreasure(grid) {\n  // изменяй grid на месте\n}\n',
    cmp: 'exact',
    wrap: 'function __t(grid) { islandsAndTreasure(grid); return grid; }',
    tests: function () {
      // змейка 99×100: чётные строки свободны, нечётные — стена с одним проходом; сокровище в (0,0)
      var R = 99, C = 100, grid = mk(R, C, function (i) { return i % 2 === 0 ? INF : -1; }), exp = mk(R, C, function (i) { return i % 2 === 0 ? INF : -1; });
      var d = 0;
      for (var i = 0; i < R; i++) {
        if (i % 2 === 0) {
          var fwd = (i % 4 === 0);
          for (var k = 0; k < C; k++) { var c = fwd ? k : C - 1 - k; exp[i][c] = d++; }
        } else {
          var gap = (i % 4 === 1) ? C - 1 : 0;
          grid[i][gap] = INF; exp[i][gap] = d++;
        }
      }
      grid[0][0] = 0;
      var big = mk(100, 100, function () { return INF; }); big[0][0] = 0;
      var bigExp = mk(100, 100, function (i, j) { return i + j; });
      return [
        { args: [[[INF, -1, 0, INF], [INF, INF, INF, -1], [INF, -1, INF, -1], [0, -1, INF, INF]]], expected: [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]] },
        { args: [[[0]]], expected: [[0]] },
        { args: [[[INF]]], expected: [[INF]] },
        { args: [[[-1, INF], [INF, -1]]], expected: [[-1, INF], [INF, -1]] },
        { args: [[[0, INF, -1, INF, 0]]], expected: [[0, 1, -1, 1, 0]] },
        { args: [[[INF, INF, INF], [INF, 0, INF], [INF, INF, INF]]], expected: [[2, 1, 2], [1, 0, 1], [2, 1, 2]] },
        { label: 'большой тест: сетка 100×100 с одним сокровищем', args: [big], expected: bigExp },
        { label: 'большой тест: змейка из стен 99×100', args: [grid], expected: exp }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['rotting-fruit'] = {
    fn: 'orangesRotting',
    starter: 'function orangesRotting(grid) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var split = mk(10, 10, function (i, j) { return j === 5 ? 0 : 1; }); split[0][0] = 2;
      var two = mk(10, 10, function () { return 1; }); two[0][0] = 2; two[9][9] = 2;
      var one = mk(10, 10, function () { return 1; }); one[0][0] = 2;
      return [
        { args: [[[1, 1, 0], [0, 1, 1], [0, 1, 2]]], expected: 4 },
        { args: [[[1, 0, 1], [0, 2, 0], [1, 0, 1]]], expected: -1 },
        { args: [[[0]]], expected: 0 },
        { args: [[[1]]], expected: -1 },
        { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
        { args: [[[0, 2]]], expected: 0 },
        { label: 'крайний случай: гнилые сверху, свежие снизу', args: [[[2, 2], [1, 1]]], expected: 1 },
        { label: 'сетка 10×10, один гнилой в углу', args: [one], expected: 18 },
        { label: 'сетка 10×10, гнилые в двух углах', args: [two], expected: 9 },
        { label: 'сетка 10×10, пустой столбец отрезает часть', args: [split], expected: -1 }
      ];
    }
  };

  // =====================================================================
  function pacAtl(h) {
    var m = h.length, n = h[0].length, out = [];
    for (var r = 0; r < m; r++) for (var c = 0; c < n; c++) {
      var seen = new Uint8Array(m * n), st = [[r, c]], pac = false, atl = false; seen[r * n + c] = 1;
      while (st.length) {
        var p = st.pop(), x = p[0], y = p[1];
        if (x === 0 || y === 0) pac = true;
        if (x === m - 1 || y === n - 1) atl = true;
        for (var d = 0; d < 4; d++) {
          var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx >= 0 && ny >= 0 && nx < m && ny < n && h[nx][ny] <= h[x][y] && !seen[nx * n + ny]) { seen[nx * n + ny] = 1; st.push([nx, ny]); }
        }
      }
      if (pac && atl) out.push([r, c]);
    }
    return out;
  }
  NC_TESTS['pacific-atlantic-water-flow'] = {
    fn: 'pacificAtlantic',
    starter: 'function pacificAtlantic(heights) {\n  // твой код\n}\n',
    cmp: 'setOfArrays',
    tests: function () {
      var rr = lcg(21), rnd = mk(15, 15, function () { return Math.floor(rr() * 10); });
      var diag = mk(100, 100, function (i, j) { return i + j; }), diagExp = [];
      for (var i = 0; i < 100; i++) for (var j = 0; j < 100; j++) if (i === 99 || j === 99) diagExp.push([i, j]);
      var flat = mk(50, 50, function () { return 7; }), flatExp = [];
      for (var a = 0; a < 50; a++) for (var b = 0; b < 50; b++) flatExp.push([a, b]);
      var ex5 = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]];
      return [
        { args: [[[4, 2, 7, 3, 4], [7, 4, 6, 4, 7], [6, 3, 5, 3, 6]]], expected: [[0, 2], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0]] },
        { args: [[[1]]], expected: [[0, 0]] },
        { args: [[[1, 1], [1, 1]]], expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
        { args: [ex5], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
        { args: [[[3], [2], [1]]], expected: [[0, 0], [1, 0], [2, 0]] },
        { args: [[[1, 2, 3], [8, 9, 4], [7, 6, 5]]], expected: pacAtl([[1, 2, 3], [8, 9, 4], [7, 6, 5]]) },
        { label: 'большой тест: высоты i+j, сетка 100×100', args: [diag], expected: diagExp },
        { label: 'большой тест: все высоты равны, 50×50', args: [flat], expected: flatExp },
        { label: 'большой тест: случайные высоты 15×15', args: [rnd], expected: pacAtl(rnd) }
      ];
    }
  };

  // =====================================================================
  function surroundExp(b) {
    var m = b.length, n = b[0].length, keep = new Uint8Array(m * n), st = [];
    for (var i = 0; i < m; i++) for (var j = 0; j < n; j++) if ((i === 0 || j === 0 || i === m - 1 || j === n - 1) && b[i][j] === 'O') { keep[i * n + j] = 1; st.push([i, j]); }
    while (st.length) {
      var p = st.pop();
      for (var d = 0; d < 4; d++) {
        var x = p[0] + DIRS[d][0], y = p[1] + DIRS[d][1];
        if (x >= 0 && y >= 0 && x < m && y < n && b[x][y] === 'O' && !keep[x * n + y]) { keep[x * n + y] = 1; st.push([x, y]); }
      }
    }
    return mk(m, n, function (i, j) { return keep[i * n + j] ? 'O' : 'X'; });
  }
  NC_TESTS['surrounded-regions'] = {
    fn: 'solve',
    starter: 'function solve(board) {\n  // изменяй board на месте\n}\n',
    cmp: 'exact',
    wrap: 'function __t(board) { solve(board); return board; }',
    tests: function () {
      var t5 = [['X', 'O', 'X', 'X', 'X'], ['X', 'O', 'X', 'O', 'X'], ['X', 'X', 'X', 'O', 'X'], ['X', 'O', 'O', 'X', 'X'], ['X', 'X', 'X', 'X', 'X']];
      var e5 = [['X', 'O', 'X', 'X', 'X'], ['X', 'O', 'X', 'X', 'X'], ['X', 'X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X', 'X']];
      var t6 = [['X', 'X', 'X'], ['X', 'O', 'X'], ['O', 'O', 'O']];
      // рамка из O по краю 200×200, внутри X, два одиночных O: один у рамки, один в глубине
      var frame = mk(200, 200, function (i, j) { return (i === 0 || j === 0 || i === 199 || j === 199) ? 'O' : 'X'; });
      frame[1][50] = 'O'; frame[100][100] = 'O';
      var frameExp = clone2(frame); frameExp[100][100] = 'X';
      var rnd = randGrid(200, 200, 0.5, 31, 'O', 'X');
      return [
        { args: [[['X', 'X', 'X', 'X'], ['X', 'O', 'O', 'X'], ['X', 'O', 'O', 'X'], ['X', 'X', 'X', 'O']]], expected: [['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'O']] },
        { args: [[['X']]], expected: [['X']] },
        { args: [[['O']]], expected: [['O']] },
        { args: [[['O', 'O'], ['O', 'O']]], expected: [['O', 'O'], ['O', 'O']] },
        { args: [t5], expected: e5 },
        { args: [t6], expected: t6 },
        { label: 'большой тест: рамка из O 200×200', args: [frame], expected: frameExp },
        { label: 'большой тест: случайная доска 200×200', args: [rnd], expected: surroundExp(rnd) }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['course-schedule'] = {
    fn: 'canFinish',
    starter: 'function canFinish(numCourses, prerequisites) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var chain = range(999, function (i) { return [i + 1, i]; });
      var cyc = chain.concat([[0, 999]]);
      var perm = shuffled(range(1000, function (i) { return i; }), 5);
      var chain2 = range(999, function (i) { return [perm[i + 1], perm[i]]; });
      // слои по 2 курса, каждый слой зависит от обоих курсов предыдущего (249 слоёв по 4 ребра)
      var layers = [];
      for (var l = 1; l < 250; l++) for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++) layers.push([2 * l + a, 2 * (l - 1) + b]);
      return [
        { args: [2, [[0, 1]]], expected: true },
        { args: [2, [[0, 1], [1, 0]]], expected: false },
        { args: [1, []], expected: true },
        { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false },
        { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
        { args: [5, [[1, 0], [3, 2]]], expected: true },
        { label: 'крайний случай: курс зависит сам от себя', args: [1, [[0, 0]]], expected: false },
        { label: 'большой тест: цепочка из 1000 курсов', args: [1000, chain], expected: true },
        { label: 'большой тест: цепочка из 1000 курсов, замкнутая в цикл', args: [1000, cyc], expected: false },
        { label: 'большой тест: перемешанная цепочка из 1000 курсов', args: [1000, chain2], expected: true },
        { label: 'большой тест: 250 слоёв по 2 курса', args: [500, layers], expected: true },
        { label: 'большой тест: 250 слоёв, цикл в конце', args: [500, layers.concat([[0, 499]])], expected: false }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['course-schedule-ii'] = {
    fn: 'findOrder',
    starter: 'function findOrder(numCourses, prerequisites) {\n  // твой код\n}\n',
    cmp: function (res, args, exp) {
      var n = args[0], pre = args[1];
      if (!Array.isArray(res)) return false;
      if (exp.length === 0) return res.length === 0;
      if (res.length !== n) return false;
      var pos = {}, i;
      for (i = 0; i < n; i++) {
        var v = res[i];
        if (!Number.isInteger(v) || v < 0 || v >= n || pos[v] !== undefined) return false;
        pos[v] = i;
      }
      for (i = 0; i < pre.length; i++) if (pos[pre[i][1]] > pos[pre[i][0]]) return false;
      return true;
    },
    tests: function () {
      var perm = shuffled(range(1000, function (i) { return i; }), 9);
      var chain = range(999, function (i) { return [perm[i + 1], perm[i]]; });
      var cyc = chain.concat([[perm[0], perm[999]]]);
      var wide = range(999, function (i) { return [i + 1, 0]; }); // всё зависит от курса 0
      return [
        { args: [3, [[1, 0]]], expected: [0, 1, 2] },
        { args: [2, [[0, 1], [1, 0]]], expected: [] },
        { args: [1, []], expected: [0] },
        { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: [0, 1, 2, 3] },
        { args: [5, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: [] },
        { args: [4, [[0, 3], [1, 3], [2, 3]]], expected: [3, 0, 1, 2] },
        { label: 'большой тест: перемешанная цепочка из 1000 курсов', args: [1000, chain], expected: perm },
        { label: 'большой тест: цепочка из 1000 курсов с циклом', args: [1000, cyc], expected: [] },
        { label: 'большой тест: 999 курсов зависят от одного', args: [1000, wide], expected: range(1000, function (i) { return i; }) }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['valid-tree'] = {
    fn: 'validTree',
    starter: 'function validTree(n, edges) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var path = range(99, function (i) { return [i, i + 1]; });
      var star = range(99, function (i) { return [0, i + 1]; });
      var full = []; for (var i = 0; i < 100; i++) for (var j = i + 1; j < 100; j++) full.push([i, j]);
      var r = lcg(3), rt = range(99, function (k) { return [k + 1, Math.floor(r() * (k + 1))]; });
      var mix = range(97, function (k) { return [k, k + 1]; }).concat([[0, 2], [98, 99]]);
      return [
        { args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true },
        { args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expected: false },
        { args: [1, []], expected: true },
        { args: [2, []], expected: false },
        { args: [4, [[0, 1], [2, 3]]], expected: false },
        { args: [4, [[0, 1], [1, 2], [2, 0]]], expected: false },
        { label: 'крайний случай: рёбра в обратном направлении', args: [3, [[2, 1], [1, 0]]], expected: true },
        { label: 'путь из 100 вершин', args: [100, path], expected: true },
        { label: 'звезда из 100 вершин', args: [100, star], expected: true },
        { label: 'случайное дерево из 100 вершин', args: [100, rt], expected: true },
        { label: 'полный граф из 100 вершин', args: [100, full], expected: false },
        { label: 'n−1 ребро, но есть цикл и отдельная часть', args: [100, mix], expected: false }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['count-connected-components'] = {
    fn: 'countComponents',
    starter: 'function countComponents(n, edges) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var e1 = randPairs(60, 0, 99, 8, false, -1).map(function (e) { return e; });
      var e2 = randPairs(150, 0, 99, 9, false, -1);
      var path = range(99, function (i) { return [i, i + 1]; });
      var full = []; for (var i = 0; i < 30; i++) for (var j = i + 1; j < 30; j++) full.push([i, j]);
      return [
        { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
        { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
        { args: [1, []], expected: 1 },
        { args: [4, []], expected: 4 },
        { args: [5, [[0, 1], [1, 2], [2, 0], [3, 4]]], expected: 2 },
        { args: [6, [[1, 0], [3, 2], [5, 4]]], expected: 3 },
        { label: 'путь из 100 вершин', args: [100, path], expected: 1 },
        { label: '100 вершин без рёбер', args: [100, []], expected: 100 },
        { label: 'случайный граф: 100 вершин, 60 рёбер', args: [100, e1], expected: compCount(100, e1) },
        { label: 'случайный граф: 100 вершин, 150 рёбер', args: [100, e2], expected: compCount(100, e2) },
        { label: 'полный граф на 30 вершинах и 70 одиноких', args: [100, full], expected: 71 }
      ];
    }
  };

  // =====================================================================
  function lastRedundant(edges, n) {
    function connected(skip) {
      var adj = range(n + 1, function () { return []; });
      edges.forEach(function (e, idx) { if (idx !== skip) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); } });
      var seen = new Uint8Array(n + 1), st = [1], cnt = 1; seen[1] = 1;
      while (st.length) {
        var u = st.pop();
        adj[u].forEach(function (v) { if (!seen[v]) { seen[v] = 1; cnt++; st.push(v); } });
      }
      return cnt === n;
    }
    for (var i = edges.length - 1; i >= 0; i--) if (connected(i)) return edges[i];
    return null;
  }
  function treePlusEdge(n, seed) {
    var r = lcg(seed), edges = [], seen = {};
    for (var v = 2; v <= n; v++) {
      var p = 1 + Math.floor(r() * (v - 1));
      edges.push(r() < 0.5 ? [p, v] : [v, p]);
      seen[Math.min(p, v) + ',' + Math.max(p, v)] = 1;
    }
    for (;;) {
      var a = 1 + Math.floor(r() * n), b = 1 + Math.floor(r() * n), key = Math.min(a, b) + ',' + Math.max(a, b);
      if (a === b || seen[key]) continue;
      edges.push([a, b]); break;
    }
    return shuffled(edges, seed + 1);
  }
  NC_TESTS['redundant-connection'] = {
    fn: 'findRedundantConnection',
    starter: 'function findRedundantConnection(edges) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var b1 = treePlusEdge(100, 4), b2 = treePlusEdge(100, 15), b3 = treePlusEdge(60, 99);
      var ring = range(99, function (i) { return [i + 1, i + 2]; }).concat([[100, 1]]);
      return [
        { args: [[[1, 2], [1, 3], [3, 4], [2, 4]]], expected: [2, 4] },
        { args: [[[1, 2], [2, 3], [1, 3]]], expected: [1, 3] },
        { args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], expected: [1, 4] },
        { args: [[[1, 4], [3, 4], [1, 3], [1, 2], [4, 5]]], expected: [1, 3] },
        { args: [[[4, 2], [1, 5], [3, 1], [3, 2], [5, 4]]], expected: [5, 4] },
        { label: 'кольцо из 100 вершин', args: [ring], expected: [100, 1] },
        { label: 'случайное дерево на 100 вершинах и лишнее ребро (1)', args: [b1], expected: lastRedundant(b1, 100) },
        { label: 'случайное дерево на 100 вершинах и лишнее ребро (2)', args: [b2], expected: lastRedundant(b2, 100) },
        { label: 'случайное дерево на 60 вершинах и лишнее ребро', args: [b3], expected: lastRedundant(b3, 60) }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['word-ladder'] = {
    fn: 'ladderLength',
    starter: 'function ladderLength(beginWord, endWord, wordList) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var chain = range(10, function (i) { return 'b'.repeat(i + 1) + 'a'.repeat(9 - i); }); // baaaaaaaaa ... bbbbbbbbbb
      var rr = lcg(41), noise = range(90, function () {
        return range(10, function () { return String.fromCharCode(97 + Math.floor(rr() * 26)); }).join('');
      });
      var list = shuffled(chain.concat(noise), 6);
      var listNoEnd = list.filter(function (w) { return w !== 'bbbbbbbbbb'; });
      return [
        { args: ['cat', 'sag', ['bat', 'bag', 'sag', 'dag', 'dot']], expected: 4 },
        { args: ['cat', 'sag', ['bat', 'bag', 'sat', 'dag', 'dot']], expected: 0 },
        { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
        { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
        { args: ['a', 'c', ['c']], expected: 2 },
        { args: ['red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee']], expected: 4 },
        { label: 'большой тест: цепочка из 10 шагов среди 100 слов', args: ['aaaaaaaaaa', 'bbbbbbbbbb', list], expected: 11 },
        { label: 'большой тест: конечного слова нет в списке', args: ['aaaaaaaaaa', 'bbbbbbbbbb', listNoEnd], expected: 0 }
      ];
    }
  };

  // =====================================================================
  function bellman(n, times, k) {
    var d = range(n + 1, function () { return Infinity; }); d[k] = 0;
    for (var it = 0; it < n; it++) times.forEach(function (e) { if (d[e[0]] + e[2] < d[e[1]]) d[e[1]] = d[e[0]] + e[2]; });
    var mx = 0; for (var v = 1; v <= n; v++) mx = Math.max(mx, d[v]);
    return mx === Infinity ? -1 : mx;
  }
  NC_TESTS['network-delay-time'] = {
    fn: 'networkDelayTime',
    starter: 'function networkDelayTime(times, n, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rw = lcg(52), t1 = randPairs(1000, 1, 100, 52, true, -1).map(function (e) { return [e[0], e[1], Math.floor(rw() * 101)]; });
      var t2 = randPairs(400, 1, 100, 53, true, 100).map(function (e) { return [e[0], e[1], 1 + Math.floor(rw() * 100)]; });
      var t3 = randPairs(700, 1, 100, 54, true, -1).map(function (e) { return [e[0], e[1], Math.floor(rw() * 101)]; });
      var chain = range(99, function (i) { return [i + 1, i + 2, 100]; });
      return [
        { args: [[[1, 2, 1], [2, 3, 1], [1, 4, 4], [3, 4, 1]], 4, 1], expected: 3 },
        { args: [[[1, 2, 1], [2, 3, 1]], 3, 2], expected: -1 },
        { args: [[[1, 2, 1]], 2, 1], expected: 1 },
        { args: [[[1, 2, 0], [2, 3, 0]], 3, 1], expected: 0 },
        { args: [[[1, 2, 10], [1, 3, 1], [3, 2, 1]], 3, 1], expected: 2 },
        { label: 'крайний случай: ребро идёт не в ту сторону', args: [[[2, 1, 1]], 2, 1], expected: -1 },
        { label: 'крайний случай: через промежуточные узлы дешевле', args: [[[1, 2, 2], [1, 3, 5], [2, 3, 1], [3, 4, 1], [2, 4, 10]], 4, 1], expected: 4 },
        { label: 'большой тест: цепочка из 100 узлов', args: [chain, 100, 1], expected: 9900 },
        { label: 'большой тест: 100 узлов, 1000 рёбер', args: [t1, 100, 1], expected: bellman(100, t1, 1) },
        { label: 'большой тест: 100 узлов, в узел 100 не ведёт ни одно ребро', args: [t2, 100, 3], expected: -1 },
        { label: 'большой тест: 100 узлов, 700 рёбер, старт с 50', args: [t3, 100, 50], expected: bellman(100, t3, 50) }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['reconstruct-flight-path'] = {
    fn: 'findItinerary',
    starter: 'function findItinerary(tickets) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var loops = []; for (var i = 0; i < 150; i++) { loops.push(['JFK', 'LAX']); loops.push(['LAX', 'JFK']); }
      var loopsExp = ['JFK']; for (i = 0; i < 150; i++) { loopsExp.push('LAX'); loopsExp.push('JFK'); }
      function nm(i) { return 'B' + String.fromCharCode(65 + Math.floor(i / 26)) + String.fromCharCode(65 + i % 26); }
      var t2 = [['JFK', 'AAA']], e2 = ['JFK'];
      for (i = 0; i < 99; i++) { t2.push(['JFK', nm(i)]); t2.push([nm(i), 'JFK']); e2.push(nm(i)); e2.push('JFK'); }
      e2.push('AAA');
      return [
        { args: [[['BUF', 'HOU'], ['HOU', 'SEA'], ['JFK', 'BUF']]], expected: ['JFK', 'BUF', 'HOU', 'SEA'] },
        { args: [[['HOU', 'JFK'], ['SEA', 'JFK'], ['JFK', 'SEA'], ['JFK', 'HOU']]], expected: ['JFK', 'HOU', 'JFK', 'SEA', 'JFK'] },
        { args: [[['JFK', 'KUL'], ['JFK', 'NRT'], ['NRT', 'JFK']]], expected: ['JFK', 'NRT', 'JFK', 'KUL'] },
        { args: [[['JFK', 'ATL']]], expected: ['JFK', 'ATL'] },
        { args: [[['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']]], expected: ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO'] },
        { args: [[['JFK', 'AAA'], ['JFK', 'BBB'], ['BBB', 'JFK']]], expected: ['JFK', 'BBB', 'JFK', 'AAA'] },
        { label: 'большой тест: 300 билетов JFK и LAX туда-обратно', args: [shuffled(loops, 2)], expected: loopsExp },
        { label: 'большой тест: 199 билетов, тупик AAA в самом конце', args: [shuffled(t2, 3)], expected: e2 }
      ];
    }
  };

  // =====================================================================
  function mstKruskal(pts) {
    var n = pts.length, es = [], i, j;
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) es.push([Math.abs(pts[i][0] - pts[j][0]) + Math.abs(pts[i][1] - pts[j][1]), i, j]);
    es.sort(function (a, b) { return a[0] - b[0]; });
    var par = range(n, function (k) { return k; });
    function find(x) { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
    var total = 0;
    es.forEach(function (e) { var a = find(e[1]), b = find(e[2]); if (a !== b) { par[a] = b; total += e[0]; } });
    return total;
  }
  NC_TESTS['min-cost-to-connect-points'] = {
    fn: 'minCostConnectPoints',
    starter: 'function minCostConnectPoints(points) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var line = shuffled(range(1000, function (i) { return [i * 3 - 1500, 7]; }), 4);
      var grid = shuffled(range(900, function (i) { return [(i % 30) * 2, Math.floor(i / 30) * 2]; }), 5);
      var r = lcg(61), seen = {}, rnd = [];
      while (rnd.length < 300) {
        var x = Math.floor(r() * 2000001) - 1000000, y = Math.floor(r() * 2000001) - 1000000;
        if (!seen[x + ',' + y]) { seen[x + ',' + y] = 1; rnd.push([x, y]); }
      }
      return [
        { args: [[[0, 0], [2, 2], [3, 3], [2, 4], [4, 2]]], expected: 10 },
        { args: [[[0, 0], [1, 1], [1, 0], [-1, 1]]], expected: 4 },
        { args: [[[0, 0]]], expected: 0 },
        { args: [[[0, 0], [1, 1]]], expected: 2 },
        { args: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18 },
        { args: [[[0, 0], [0, 10], [1, 0], [1, 10]]], expected: 12 },
        { label: 'большой тест: 1000 точек на прямой', args: [line], expected: 999 * 3 },
        { label: 'большой тест: сетка 30×30 с шагом 2', args: [grid], expected: 899 * 2 },
        { label: 'большой тест: 300 случайных точек, координаты до 10⁶', args: [rnd], expected: mstKruskal(rnd) }
      ];
    }
  };

  // =====================================================================
  function swimBrute(g) {
    var n = g.length;
    function can(t) {
      if (g[0][0] > t) return false;
      var seen = new Uint8Array(n * n), st = [0]; seen[0] = 1;
      while (st.length) {
        var c = st.pop(), x = (c / n) | 0, y = c % n;
        if (x === n - 1 && y === n - 1) return true;
        for (var d = 0; d < 4; d++) {
          var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx >= 0 && ny >= 0 && nx < n && ny < n && g[nx][ny] <= t && !seen[nx * n + ny]) { seen[nx * n + ny] = 1; st.push(nx * n + ny); }
        }
      }
      return false;
    }
    var lo = 0, hi = n * n - 1;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (can(mid)) hi = mid; else lo = mid + 1; }
    return lo;
  }
  NC_TESTS['swim-in-rising-water'] = {
    fn: 'swimInWater',
    starter: 'function swimInWater(grid) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var rnd = function (seed, n) {
        var flat = shuffled(range(n * n, function (i) { return i; }), seed);
        return mk(n, n, function (i, j) { return flat[i * n + j]; });
      };
      var g1 = rnd(7, 50), g2 = rnd(8, 50), g3 = rnd(9, 20);
      return [
        { args: [[[0, 1], [2, 3]]], expected: 3 },
        { args: [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]], expected: 16 },
        { args: [[[0]]], expected: 0 },
        { args: [[[3, 2], [0, 1]]], expected: 3 },
        { args: [[[0, 3, 4], [1, 8, 5], [2, 7, 6]]], expected: 6 },
        { args: [[[0, 2], [1, 3]]], expected: 3 },
        { label: 'большой тест: значения по порядку, 50×50', args: [mk(50, 50, function (i, j) { return i * 50 + j; })], expected: 2499 },
        { label: 'большой тест: случайная перестановка 50×50 (1)', args: [g1], expected: swimBrute(g1) },
        { label: 'большой тест: случайная перестановка 50×50 (2)', args: [g2], expected: swimBrute(g2) },
        { label: 'большой тест: случайная перестановка 20×20', args: [g3], expected: swimBrute(g3) }
      ];
    }
  };

  // =====================================================================
  NC_TESTS['foreign-dictionary'] = {
    fn: 'foreignDictionary',
    starter: 'function foreignDictionary(words) {\n  // твой код\n}\n',
    cmp: function (res, args, exp) {
      var words = args[0];
      if (typeof res !== 'string') return false;
      if (exp === '') return res === '';
      var letters = {}, i, j, cnt = 0;
      words.forEach(function (w) { for (var k = 0; k < w.length; k++) if (!letters[w[k]]) { letters[w[k]] = 1; cnt++; } });
      if (res.length !== cnt) return false;
      var pos = {};
      for (i = 0; i < res.length; i++) {
        if (!letters[res[i]] || pos[res[i]] !== undefined) return false;
        pos[res[i]] = i;
      }
      for (i = 0; i + 1 < words.length; i++) {
        var a = words[i], b = words[i + 1];
        for (j = 0; j < a.length && j < b.length && a[j] === b[j]; j++);
        if (j < a.length && j < b.length) { if (pos[a[j]] >= pos[b[j]]) return false; }
        else if (a.length > b.length) return false;
      }
      return true;
    },
    tests: function () {
      var letters = 'abcdefghijklmnopqrstuvwxyz'.split(''), P = shuffled(letters, 12), idx = {};
      P.forEach(function (c, i) { idx[c] = i; });
      var rr = lcg(13), words = range(100, function () {
        var len = 1 + Math.floor(rr() * 8);
        return range(len, function () { return P[Math.floor(rr() * 26)]; }).join('');
      });
      words.sort(function (a, b) {
        var i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i++;
        if (i === a.length || i === b.length) return a.length - b.length;
        return idx[a[i]] - idx[b[i]];
      });
      var used = {}; words.forEach(function (w) { w.split('').forEach(function (c) { used[c] = 1; }); });
      var expBig = P.filter(function (c) { return used[c]; }).join('');
      var long = range(100, function (i) { return 'a'.repeat(99) + P[i % 26]; });
      var longSorted = long.slice().sort(function (a, b) { return idx[a[99]] - idx[b[99]]; });
      return [
        { args: [['z', 'o']], expected: 'zo' },
        { args: [['hrn', 'hrf', 'er', 'enn', 'rfnn']], expected: 'hernf' },
        { args: [['wrt', 'wrf', 'er', 'ett', 'rftt']], expected: 'wertf' },
        { args: [['z', 'x', 'z']], expected: '' },
        { args: [['abc', 'ab']], expected: '' },
        { args: [['q', 'a', 'b', 'a']], expected: '' },
        { label: 'крайний случай: одно слово', args: [['a']], expected: 'a' },
        { label: 'крайний случай: часть букв не связана ограничениями', args: [['ab', 'cd']], expected: 'abcd' },
        { label: 'крайний случай: одинаковые слова', args: [['z', 'z']], expected: 'z' },
        { label: 'большой тест: 100 слов в случайном алфавите', args: [words], expected: expBig },
        { label: 'большой тест: тот же список, но в конце противоречие', args: [words.concat(['aa', 'ab', 'aa'])], expected: '' },
        { label: 'большой тест: слова длиной 100 с общим началом', args: [longSorted], expected: P.join('') }
      ];
    }
  };

  // =====================================================================
  function cheapestBack(n, flights, src, dst, k) {
    var adj = range(n, function () { return []; });
    flights.forEach(function (f) { adj[f[0]].push([f[1], f[2]]); });
    var memo = {};
    function go(v, left) { // минимальная цена из v в dst, ещё можно сделать left перелётов
      if (v === dst) return 0;
      if (left === 0) return Infinity;
      var key = v * 1000 + left;
      if (memo[key] !== undefined) return memo[key];
      var best = Infinity;
      adj[v].forEach(function (e) { var c = go(e[0], left - 1); if (e[1] + c < best) best = e[1] + c; });
      return (memo[key] = best);
    }
    var res = go(src, k + 1);
    return res === Infinity ? -1 : res;
  }
  NC_TESTS['cheapest-flight-path'] = {
    fn: 'findCheapestPrice',
    starter: 'function findCheapestPrice(n, flights, src, dst, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    tests: function () {
      var F = [[0, 1, 200], [1, 2, 100], [1, 3, 300], [2, 3, 100]];
      var trap = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
      var line = range(99, function (i) { return [i, i + 1, 1]; });
      var lineShort = line.concat([[0, 99, 10000]]);
      var rp = randPairs(1500, 0, 99, 71, true, -1), rw = lcg(72);
      var rf = rp.map(function (e) { return [e[0], e[1], 1 + Math.floor(rw() * 10000)]; });
      return [
        { args: [4, F, 0, 3, 1], expected: 500 },
        { args: [4, F, 0, 3, 2], expected: 400 },
        { args: [3, trap, 0, 2, 0], expected: 500 },
        { args: [3, trap, 0, 2, 1], expected: 200 },
        { args: [3, [[0, 1, 100]], 0, 2, 1], expected: -1 },
        { args: [3, [[0, 1, 5], [1, 2, 5]], 0, 2, 0], expected: -1 },
        { label: 'цепочка из 100 городов, ровно хватает пересадок', args: [100, line, 0, 99, 98], expected: 99 },
        { label: 'цепочка из 100 городов, пересадок не хватает', args: [100, line, 0, 99, 97], expected: -1 },
        { label: 'цепочка и прямой дорогой рейс, пересадок не хватает', args: [100, lineShort, 0, 99, 97], expected: 10000 },
        { label: 'случайный граф: 100 городов, 1500 рейсов, k = 0', args: [100, rf, 3, 40, 0], expected: cheapestBack(100, rf, 3, 40, 0) },
        { label: 'случайный граф: 100 городов, 1500 рейсов, k = 2', args: [100, rf, 3, 40, 2], expected: cheapestBack(100, rf, 3, 40, 2) },
        { label: 'случайный граф: 100 городов, 1500 рейсов, k = 50', args: [100, rf, 3, 40, 50], expected: cheapestBack(100, rf, 3, 40, 50) }
      ];
    }
  };
})();
