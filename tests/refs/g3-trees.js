module.exports = {
  'invert-a-binary-tree': {
    ref: `function invertTree(root) { if (!root) return null; const l = invertTree(root.left), r = invertTree(root.right); root.left = r; root.right = l; return root; }`,
    wrong: `function invertTree(root) { if (!root) return null; const t = root.left; root.left = root.right; root.right = t; return root; }`
  },
  'depth-of-binary-tree': {
    ref: `function maxDepth(root) { if (!root) return 0; return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); }`,
    wrong: `function maxDepth(root) { if (!root) return 0; return 1 + maxDepth(root.left); }`
  },
  'binary-tree-diameter': {
    ref: `function diameterOfBinaryTree(root) { let best = 0; function h(n) { if (!n) return 0; const l = h(n.left), r = h(n.right); if (l + r > best) best = l + r; return 1 + Math.max(l, r); } h(root); return best; }`,
    wrong: `function diameterOfBinaryTree(root) { function h(n) { if (!n) return 0; return 1 + Math.max(h(n.left), h(n.right)); } if (!root) return 0; return h(root.left) + h(root.right); }`
  },
  'balanced-binary-tree': {
    ref: `function isBalanced(root) { function h(n) { if (!n) return 0; const l = h(n.left); if (l < 0) return -1; const r = h(n.right); if (r < 0 || Math.abs(l - r) > 1) return -1; return 1 + Math.max(l, r); } return h(root) >= 0; }`,
    wrong: `function isBalanced(root) { function h(n) { if (!n) return 0; return 1 + Math.max(h(n.left), h(n.right)); } if (!root) return true; return Math.abs(h(root.left) - h(root.right)) <= 1; }`
  },
  'same-binary-tree': {
    ref: `function isSameTree(p, q) { if (!p && !q) return true; if (!p || !q || p.val !== q.val) return false; return isSameTree(p.left, q.left) && isSameTree(p.right, q.right); }`,
    wrong: `function isSameTree(p, q) { const f = (n, o) => { if (n) { o.push(n.val); f(n.left, o); f(n.right, o); } return o; }; return f(p, []).join(",") === f(q, []).join(","); }`
  },
  'subtree-of-a-binary-tree': {
    ref: `function isSubtree(root, subRoot) { function same(a, b) { if (!a && !b) return true; if (!a || !b || a.val !== b.val) return false; return same(a.left, b.left) && same(a.right, b.right); } if (!subRoot) return true; if (!root) return false; return same(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot); }`,
    wrong: `function isSubtree(root, subRoot) { if (!root) return false; if (root.val === subRoot.val) return true; return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot); }`
  },
  'lowest-common-ancestor-in-binary-search-tree': {
    ref: `function lowestCommonAncestor(root, p, q) { let n = root; while (n) { if (p.val < n.val && q.val < n.val) n = n.left; else if (p.val > n.val && q.val > n.val) n = n.right; else return n; } return null; }`,
    wrong: `function lowestCommonAncestor(root, p, q) { let n = root; while (n) { if (p.val <= n.val && q.val <= n.val) n = n.left; else if (p.val > n.val && q.val > n.val) n = n.right; else return n; } return null; }`
  },
  'level-order-traversal-of-binary-tree': {
    ref: `function levelOrder(root) { if (!root) return []; const res = []; let level = [root]; while (level.length) { res.push(level.map((n) => n.val)); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; } return res; }`,
    wrong: `function levelOrder(root) { if (!root) return []; const out = [], q = [root]; let i = 0; while (i < q.length) { const n = q[i++]; out.push(n.val); if (n.left) q.push(n.left); if (n.right) q.push(n.right); } return [out]; }`
  },
  'binary-tree-right-side-view': {
    ref: `function rightSideView(root) { if (!root) return []; const res = []; let level = [root]; while (level.length) { res.push(level[level.length - 1].val); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; } return res; }`,
    wrong: `function rightSideView(root) { const res = []; while (root) { res.push(root.val); root = root.right; } return res; }`
  },
  'count-good-nodes-in-binary-tree': {
    ref: `function goodNodes(root) { function go(n, mx) { if (!n) return 0; const good = n.val >= mx ? 1 : 0; const m = Math.max(mx, n.val); return good + go(n.left, m) + go(n.right, m); } return go(root, -Infinity); }`,
    wrong: `function goodNodes(root) { function go(n, mx) { if (!n) return 0; const good = n.val > mx ? 1 : 0; const m = Math.max(mx, n.val); return good + go(n.left, m) + go(n.right, m); } return go(root, -Infinity); }`
  },
  'valid-binary-search-tree': {
    ref: `function isValidBST(root) { function go(n, lo, hi) { if (!n) return true; if (n.val <= lo || n.val >= hi) return false; return go(n.left, lo, n.val) && go(n.right, n.val, hi); } return go(root, -Infinity, Infinity); }`,
    wrong: `function isValidBST(root) { if (!root) return true; if (root.left && root.left.val >= root.val) return false; if (root.right && root.right.val <= root.val) return false; return isValidBST(root.left) && isValidBST(root.right); }`
  },
  'kth-smallest-integer-in-bst': {
    ref: `function kthSmallest(root, k) { const st = []; let n = root; while (n || st.length) { while (n) { st.push(n); n = n.left; } n = st.pop(); if (--k === 0) return n.val; n = n.right; } return -1; }`,
    wrong: `function kthSmallest(root, k) { const out = []; (function go(n) { if (!n) return; go(n.left); out.push(n.val); go(n.right); })(root); return out[k]; }`
  },
  'binary-tree-from-preorder-and-inorder-traversal': {
    ref: `function buildTree(preorder, inorder) { const pos = new Map(); inorder.forEach((v, i) => pos.set(v, i)); let pi = 0; function go(lo, hi) { if (lo > hi) return null; const v = preorder[pi++]; const node = new TreeNode(v); const m = pos.get(v); node.left = go(lo, m - 1); node.right = go(m + 1, hi); return node; } return go(0, inorder.length - 1); }`,
    wrong: `function buildTree(preorder, inorder) { if (!preorder.length) return null; const root = new TreeNode(preorder[0]); const i = inorder.indexOf(preorder[0]); root.left = buildTree(preorder.slice(1, i), inorder.slice(0, i)); root.right = buildTree(preorder.slice(i + 1), inorder.slice(i + 1)); return root; }`
  },
  'binary-tree-maximum-path-sum': {
    ref: `function maxPathSum(root) { let best = -Infinity; function gain(n) { if (!n) return 0; const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right)); if (n.val + l + r > best) best = n.val + l + r; return n.val + Math.max(l, r); } gain(root); return best; }`,
    wrong: `function maxPathSum(root) { let best = 0; function gain(n) { if (!n) return 0; const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right)); if (n.val + l + r > best) best = n.val + l + r; return n.val + Math.max(l, r); } gain(root); return best; }`
  },
  'serialize-and-deserialize-binary-tree': {
    ref: `function serialize(root) { const out = []; (function go(n) { if (!n) { out.push("#"); return; } out.push(n.val); go(n.left); go(n.right); })(root); return out.join(","); }
function deserialize(data) { const t = data.split(","); let i = 0; function go() { const s = t[i++]; if (s === "#") return null; const n = new TreeNode(Number(s)); n.left = go(); n.right = go(); return n; } return go(); }`,
    wrong: `function serialize(root) { const out = []; (function go(n) { if (!n) return; out.push(n.val); go(n.left); go(n.right); })(root); return out.join(","); }
function deserialize(data) { if (!data) return null; let root = null; for (const s of data.split(",")) { const v = Number(s); const node = new TreeNode(v); if (!root) { root = node; continue; } let c = root; while (true) { if (v < c.val) { if (c.left) c = c.left; else { c.left = node; break; } } else { if (c.right) c = c.right; else { c.right = node; break; } } } } return root; }`
  }
};
