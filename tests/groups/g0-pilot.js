NC_TESTS['is-palindrome'] = {
  fn: 'isPalindrome',
  starter: 'function isPalindrome(s) {\n  // твой код\n}\n',
  cmp: 'exact',
  tests: function () {
    var long = range(100000, function (i) { return String.fromCharCode(97 + (i % 26)); });
    var pal = long.concat(long.slice().reverse()).join('');
    var almost = pal.slice(0, 100000) + 'Z' + pal.slice(100001);
    return [
      { args: ['Was it a car or a cat I saw?'], expected: true },
      { args: ['tab a cat'], expected: false },
      { args: [' '], expected: true },
      { args: ['0P'], expected: false },
      { args: ['A man, a plan, a canal: Panama'], expected: true },
      { label: 'большой тест: палиндром из 200 000 букв', args: [pal], expected: true },
      { label: 'большой тест: одна буква испорчена', args: [almost], expected: false }
    ];
  }
};

NC_TESTS['reverse-a-linked-list'] = {
  fn: 'reverseList',
  starter: '// class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }\n\nfunction reverseList(head) {\n  // твой код\n}\n',
  cmp: 'exact',
  wrap: 'function __t(arr) { return __H.listToArr(reverseList(__H.arrToList(arr))); }',
  tests: function () {
    var big = range(100000, function (i) { return i; });
    return [
      { args: [[0, 1, 2, 3]], expected: [3, 2, 1, 0] },
      { args: [[]], expected: [] },
      { args: [[5]], expected: [5] },
      { args: [[1, 2]], expected: [2, 1] },
      { label: 'большой тест: список из 100 000 узлов', args: [big], expected: big.slice().reverse() }
    ];
  }
};

NC_TESTS['lru-cache'] = {
  fn: 'LRUCache',
  starter: 'class LRUCache {\n  constructor(capacity) {\n    // твой код\n  }\n\n  get(key) {\n    // твой код\n  }\n\n  put(key, value) {\n    // твой код\n  }\n}\n',
  cmp: 'exact',
  wrap: 'function __t(ops, args) { return __H.runDesign(LRUCache, ops, args); }',
  tests: function () {
    var ops = ['LRUCache'], args = [[1000]], exp = [null];
    for (var i = 0; i < 50000; i++) { ops.push('put'); args.push([i, i * 2]); exp.push(null); }
    ops.push('get'); args.push([49999]); exp.push(99998);
    ops.push('get'); args.push([49000]); exp.push(98000);
    ops.push('get'); args.push([48999]); exp.push(-1);
    return [
      { args: [['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 10], [2, 20], [1], [3, 30], [2], [4, 40], [1], [3], [4]]], expected: [null, null, null, 10, null, -1, null, -1, 30, 40] },
      { args: [['LRUCache', 'put', 'put', 'get'], [[1], [2, 1], [2, 2], [2]]], expected: [null, null, null, 2] },
      { args: [['LRUCache', 'get', 'put', 'get'], [[2], [5], [5, 7], [5]]], expected: [null, -1, null, 7] },
      { label: 'большой тест: 50 000 операций put', args: [ops, args], expected: exp }
    ];
  }
};
