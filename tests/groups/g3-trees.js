(function () {
  var TN = '// class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }\n\n';

  // --- помощники для построения ожидаемых ответов (не зависят от эталонов) ---
  // цепочка только из правых потомков: [v0, null, v1, null, v2, ...]
  function rightChain(vals) {
    var a = [vals[0]];
    for (var i = 1; i < vals.length; i++) { a.push(null); a.push(vals[i]); }
    return a;
  }
  // цепочка только из левых потомков: [v0, v1, null, v2, null, ..., v_last]
  function leftChain(vals) {
    var a = [vals[0]];
    for (var i = 1; i < vals.length; i++) { a.push(vals[i]); if (i < vals.length - 1) a.push(null); }
    return a;
  }
  // узел-объект {v,l,r} и обход по уровням в виде массива
  function N(v, l, r) { return { v: v, l: l || null, r: r || null }; }
  function lv(root) {
    var out = [], q = [root], h = 0;
    while (h < q.length) {
      var n = q[h++];
      if (!n) { out.push(null); continue; }
      out.push(n.v); q.push(n.l, n.r);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  }
  // сбалансированное дерево поиска со значениями lo..hi
  function bstOf(lo, hi) {
    if (lo > hi) return null;
    var m = (lo + hi) >> 1;
    return N(m, bstOf(lo, m - 1), bstOf(m + 1, hi));
  }
  function preorderVals(n, out) { if (!n) return out; out.push(n.v); preorderVals(n.l, out); preorderVals(n.r, out); return out; }
  function inorderVals(n, out) { if (!n) return out; inorderVals(n.l, out); out.push(n.v); inorderVals(n.r, out); return out; }

  NC_TESTS['invert-a-binary-tree'] = {
    fn: 'invertTree',
    starter: TN + 'function invertTree(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return __H.treeToArr(invertTree(__H.arrToTree(arr))); }',
    tests: function () {
      return [
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [1, 3, 2, 7, 6, 5, 4] },
        { args: [[3, 2, 1]], expected: [3, 1, 2] },
        { args: [[]], expected: [] },
        { args: [[1]], expected: [1] },
        { args: [[1, 2]], expected: [1, null, 2] },
        { args: [[1, null, 2, 3]], expected: [1, 2, null, null, 3] }
      ];
    }
  };

  NC_TESTS['depth-of-binary-tree'] = {
    fn: 'maxDepth',
    starter: TN + 'function maxDepth(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return maxDepth(__H.arrToTree(arr)); }',
    tests: function () {
      return [
        { args: [[1, 2, 3, null, null, 4]], expected: 3 },
        { args: [[]], expected: 0 },
        { args: [[1]], expected: 1 },
        { args: [[1, null, 2]], expected: 2 },
        { args: [[1, 2, 3, 4, null, null, 5, 6]], expected: 4 },
        { args: [rightChain(range(100, function (i) { return i - 50; }))], expected: 100 }
      ];
    }
  };

  NC_TESTS['binary-tree-diameter'] = {
    fn: 'diameterOfBinaryTree',
    starter: TN + 'function diameterOfBinaryTree(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return diameterOfBinaryTree(__H.arrToTree(arr)); }',
    tests: function () {
      return [
        { args: [[1, null, 2, 3, 4, 5]], expected: 3 },
        { args: [[1, 2, 3]], expected: 2 },
        { args: [[1]], expected: 0 },
        { args: [[1, 2]], expected: 1 },
        // самый длинный путь 6-5-3-2-4-7-8 не проходит через корень: 6 рёбер
        { args: [[1, 2, null, 3, 4, 5, null, 7, null, 6, null, 8]], expected: 6 },
        { args: [leftChain(range(100, function (i) { return i; }))], expected: 99 }
      ];
    }
  };

  NC_TESTS['balanced-binary-tree'] = {
    fn: 'isBalanced',
    starter: TN + 'function isBalanced(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return isBalanced(__H.arrToTree(arr)); }',
    tests: function () {
      return [
        { args: [[1, 2, 3, null, null, 4]], expected: true },
        { args: [[1, 2, 3, null, null, 4, null, 5]], expected: false },
        { args: [[]], expected: true },
        { args: [[1]], expected: true },
        { args: [[1, 2, null, 3]], expected: false },
        // у корня высоты поддеревьев равны, но узел 2 несбалансирован
        { args: [[1, 2, 3, 4, null, 6, 7, 5, null, 8]], expected: false },
        { label: 'большой тест: полное дерево из 1000 узлов', args: [range(1000, function (i) { return i; })], expected: true },
        { label: 'большой тест: цепочка из 1000 узлов', args: [rightChain(range(1000, function (i) { return i - 500; }))], expected: false }
      ];
    }
  };

  NC_TESTS['same-binary-tree'] = {
    fn: 'isSameTree',
    starter: TN + 'function isSameTree(p, q) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(a, b) { return isSameTree(__H.arrToTree(a), __H.arrToTree(b)); }',
    tests: function () {
      return [
        { args: [[1, 2, 3], [1, 2, 3]], expected: true },
        { args: [[4, 7], [4, null, 7]], expected: false },
        { args: [[1, 2, 3], [1, 3, 2]], expected: false },
        { args: [[], []], expected: true },
        { args: [[1], []], expected: false },
        { args: [[1, 2, 3], [1, 2, 4]], expected: false },
        { args: [[1, null, 2, null, 3], [1, null, 2, null, 3]], expected: true }
      ];
    }
  };

  NC_TESTS['subtree-of-a-binary-tree'] = {
    fn: 'isSubtree',
    starter: TN + 'function isSubtree(root, subRoot) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(a, b) { return isSubtree(__H.arrToTree(a), __H.arrToTree(b)); }',
    tests: function () {
      return [
        { args: [[1, 2, 3, 4, 5], [2, 4, 5]], expected: true },
        { args: [[1, 2, 3, 4, 5, null, null, 6], [2, 4, 5]], expected: false },
        { args: [[1], [1]], expected: true },
        { args: [[1, 1], [1]], expected: true },
        // у узла 2 есть лишний потомок 0, значит поддерево [4,1,2] не совпадает
        { args: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]], expected: false },
        { args: [[1, null, 1, null, 1, null, 1, null, 1], [1, null, 1, null, 1]], expected: true },
        { args: [[1, null, 1, null, 1, null, 1, null, 1], [1, null, 1, null, 1, null, 1, null, 1, null, 1]], expected: false }
      ];
    }
  };

  NC_TESTS['lowest-common-ancestor-in-binary-search-tree'] = {
    fn: 'lowestCommonAncestor',
    starter: TN + '// p и q — узлы дерева (TreeNode), верни узел-предок\nfunction lowestCommonAncestor(root, p, q) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr, p, q) { var root = __H.arrToTree(arr), a = null, b = null, st = [root]; while (st.length) { var n = st.pop(); if (!n) continue; if (n.val === p) a = n; if (n.val === q) b = n; st.push(n.left, n.right); } var r = lowestCommonAncestor(root, a, b); return r ? r.val : null; }',
    tests: function () {
      var T = [5, 3, 8, 1, 4, 7, 9, null, 2];
      return [
        { args: [T, 3, 8], expected: 5 },
        { args: [T, 3, 4], expected: 3 },
        { args: [T, 2, 4], expected: 3 },
        { args: [T, 7, 9], expected: 8 },
        { args: [T, 2, 1], expected: 1 },
        { args: [T, 1, 9], expected: 5 },
        { args: [[2, 1], 2, 1], expected: 2 },
        { args: [[0, -10, 10, -20, -5, 5, 20], -20, -5], expected: -10 }
      ];
    }
  };

  NC_TESTS['level-order-traversal-of-binary-tree'] = {
    fn: 'levelOrder',
    starter: TN + 'function levelOrder(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return levelOrder(__H.arrToTree(arr)); }',
    tests: function () {
      var wide = range(1000, function (i) { return i; }), wideExp = [];
      for (var l = 0; (1 << l) - 1 < 1000; l++) {
        var lo = (1 << l) - 1, hi = Math.min((1 << (l + 1)) - 2, 999);
        wideExp.push(range(hi - lo + 1, function (j) { return lo + j; }));
      }
      var vals = range(1000, function (i) { return i - 500; });
      return [
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1], [2, 3], [4, 5, 6, 7]] },
        { args: [[1]], expected: [[1]] },
        { args: [[]], expected: [] },
        { args: [[1, 2, 3, null, 4]], expected: [[1], [2, 3], [4]] },
        { args: [[1, null, 2]], expected: [[1], [2]] },
        { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
        { label: 'большой тест: полное дерево из 1000 узлов', args: [wide], expected: wideExp },
        { label: 'большой тест: цепочка из 1000 узлов', args: [rightChain(vals)], expected: vals.map(function (v) { return [v]; }) }
      ];
    }
  };

  NC_TESTS['binary-tree-right-side-view'] = {
    fn: 'rightSideView',
    starter: TN + 'function rightSideView(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return rightSideView(__H.arrToTree(arr)); }',
    tests: function () {
      return [
        { args: [[1, 2, 3]], expected: [1, 3] },
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [1, 3, 7] },
        { args: [[]], expected: [] },
        { args: [[1]], expected: [1] },
        // левое поддерево глубже правого
        { args: [[1, 2, 3, 4]], expected: [1, 3, 4] },
        { args: [[1, 2, null, 4]], expected: [1, 2, 4] },
        { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] }
      ];
    }
  };

  NC_TESTS['count-good-nodes-in-binary-tree'] = {
    fn: 'goodNodes',
    starter: TN + 'function goodNodes(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return goodNodes(__H.arrToTree(arr)); }',
    tests: function () {
      // полное дерево из 100 000 узлов; ожидаемое число считаем по индексам кучи
      var r = lcg(7), n = 100000;
      var v = range(n, function () { return Math.floor(r() * 20001) - 10000; });
      var pm = new Array(n), cnt = 1; pm[0] = v[0];
      for (var i = 1; i < n; i++) {
        var pmax = pm[(i - 1) >> 1];
        if (v[i] >= pmax) cnt++;
        pm[i] = v[i] > pmax ? v[i] : pmax;
      }
      var asc = range(3000, function (i) { return -9000 + 3 * i; });
      var desc = range(3000, function (i) { return 9000 - 3 * i; });
      return [
        { args: [[2, 1, 1, 3, null, 1, 5]], expected: 3 },
        { args: [[1, 2, -1, 3, 4]], expected: 4 },
        { args: [[3, 3, null, 4, 2]], expected: 3 },
        { args: [[1]], expected: 1 },
        { args: [[-1, -2, -3]], expected: 1 },
        { args: [[5, 5, 5]], expected: 3 },
        { args: [[9, null, 3, 6]], expected: 1 },
        { label: 'большой тест: полное дерево из 100 000 узлов', args: [v], expected: cnt },
        { label: 'большой тест: возрастающая цепочка из 3000 узлов', args: [rightChain(asc)], expected: 3000 },
        { label: 'большой тест: убывающая цепочка из 3000 узлов', args: [leftChain(desc)], expected: 1 }
      ];
    }
  };

  NC_TESTS['valid-binary-search-tree'] = {
    fn: 'isValidBST',
    starter: TN + 'function isValidBST(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return isValidBST(__H.arrToTree(arr)); }',
    tests: function () {
      var good = bstOf(-500, 499);
      var bad = bstOf(-500, 499);
      // самый правый лист левого поддерева корня: больше родителя, но больше и корня, а должен быть меньше
      var x = bad.l;
      while (x.r) x = x.r;
      x.v = bad.v + 1;
      return [
        { args: [[2, 1, 3]], expected: true },
        { args: [[1, 2, 3]], expected: false },
        { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
        { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
        { args: [[2, 2, 2]], expected: false },
        { args: [[1]], expected: true },
        { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true },
        { label: 'большой тест: корректное дерево поиска из 1000 узлов', args: [lv(good)], expected: true },
        { label: 'большой тест: одно нарушение глубоко в дереве', args: [lv(bad)], expected: false },
        { label: 'большой тест: возрастающая цепочка из 1000 узлов', args: [rightChain(range(1000, function (i) { return i - 500; }))], expected: true }
      ];
    }
  };

  NC_TESTS['kth-smallest-integer-in-bst'] = {
    fn: 'kthSmallest',
    starter: TN + 'function kthSmallest(root, k) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr, k) { return kthSmallest(__H.arrToTree(arr), k); }',
    tests: function () {
      var bal = lv(bstOf(0, 999));
      return [
        { args: [[2, 1, 3], 1], expected: 1 },
        { args: [[4, 3, 5, 2, null], 4], expected: 5 },
        { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
        { args: [[1], 1], expected: 1 },
        { args: [[0], 1], expected: 0 },
        { args: [[3, 1, 4, null, 2], 2], expected: 2 },
        { label: 'большой тест: сбалансированное дерево из 1000 узлов', args: [bal, 777], expected: 776 },
        { label: 'большой тест: левая цепочка из 1000 узлов', args: [leftChain(range(1000, function (i) { return 999 - i; })), 1000], expected: 999 },
        { label: 'большой тест: правая цепочка из 1000 узлов', args: [rightChain(range(1000, function (i) { return i; })), 1], expected: 0 }
      ];
    }
  };

  NC_TESTS['binary-tree-from-preorder-and-inorder-traversal'] = {
    fn: 'buildTree',
    starter: TN + 'function buildTree(preorder, inorder) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(pre, ino) { return __H.treeToArr(buildTree(pre, ino)); }',
    tests: function () {
      var vals = range(1000, function (i) { return i - 500; });
      var bal = bstOf(-500, 499);
      return [
        { args: [[1, 2, 3, 4], [2, 1, 3, 4]], expected: [1, 2, 3, null, null, null, 4] },
        { args: [[1], [1]], expected: [1] },
        { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
        { args: [[1, 2], [2, 1]], expected: [1, 2] },
        { args: [[1, 2], [1, 2]], expected: [1, null, 2] },
        { args: [[-1, -2, -3], [-3, -2, -1]], expected: [-1, -2, null, -3] },
        { label: 'большой тест: сбалансированное дерево из 1000 узлов', args: [preorderVals(bal, []), inorderVals(bal, [])], expected: lv(bal) },
        { label: 'большой тест: левая цепочка из 1000 узлов', args: [vals, vals.slice().reverse()], expected: leftChain(vals) },
        { label: 'большой тест: правая цепочка из 1000 узлов', args: [vals, vals], expected: rightChain(vals) }
      ];
    }
  };

  NC_TESTS['binary-tree-maximum-path-sum'] = {
    fn: 'maxPathSum',
    starter: TN + 'function maxPathSum(root) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { return maxPathSum(__H.arrToTree(arr)); }',
    tests: function () {
      // цепочка: путь = любой непрерывный отрезок, ответ считаем алгоритмом Кадане
      var r = lcg(11);
      var mixed = range(1000, function () { return Math.floor(r() * 2001) - 1000; });
      var best = mixed[0], cur = 0;
      for (var i = 0; i < mixed.length; i++) {
        cur = cur > 0 ? cur + mixed[i] : mixed[i];
        if (cur > best) best = cur;
      }
      var neg = range(1000, function () { return -1 - Math.floor(r() * 1000); });
      var mx = neg[0];
      for (var j = 1; j < neg.length; j++) if (neg[j] > mx) mx = neg[j];
      return [
        { args: [[1, 2, 3]], expected: 6 },
        { args: [[-15, 10, 20, null, null, 15, 5, -5]], expected: 40 },
        { args: [[-3]], expected: -3 },
        { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
        { args: [[2, -1]], expected: 2 },
        { args: [[-2, -1]], expected: -1 },
        { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 },
        { label: 'большой тест: цепочка из 1000 узлов, значения разных знаков', args: [rightChain(mixed)], expected: best },
        { label: 'большой тест: цепочка из 1000 отрицательных значений', args: [leftChain(neg)], expected: mx }
      ];
    }
  };

  NC_TESTS['serialize-and-deserialize-binary-tree'] = {
    fn: 'serialize',
    starter: TN + 'function serialize(root) {\n  // твой код\n}\n\nfunction deserialize(data) {\n  // твой код\n}\n',
    cmp: 'exact',
    wrap: 'function __t(arr) { var root = __H.arrToTree(arr); var s = serialize(root); if (typeof s !== "string") throw new Error("serialize должна вернуть строку"); var back = deserialize(s); if (root && back === root) throw new Error("deserialize должна построить новое дерево по строке"); return __H.treeToArr(back); }',
    tests: function () {
      var r = lcg(5);
      var chain = range(1000, function () { return Math.floor(r() * 2001) - 1000; });
      var full = range(1000, function (i) { return (i * 7) % 2001 - 1000; });
      return [
        { args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5] },
        { args: [[]], expected: [] },
        { args: [[1]], expected: [1] },
        { args: [[1, null, 2, null, 3]], expected: [1, null, 2, null, 3] },
        { args: [[0, 0, 0]], expected: [0, 0, 0] },
        { args: [[-1000, 1000, -1, null, 0]], expected: [-1000, 1000, -1, null, 0] },
        { label: 'большой тест: левая цепочка из 1000 узлов', args: [leftChain(chain)], expected: leftChain(chain) },
        { label: 'большой тест: полное дерево из 1000 узлов', args: [full], expected: full }
      ];
    }
  };
})();
