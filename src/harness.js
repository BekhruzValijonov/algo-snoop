// Общий код для запуска тестов: работает и в браузере (внутри Web Worker), и в Node (проверка тестов).
// Содержимое функции makeH вшивается в страницу как текст и выполняется в воркере.
function makeH() {
  var H = {};
  H.ListNode = function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; };
  H.TreeNode = function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; };
  // массив -> односвязный список; pos >= 0 замыкает хвост на узел с индексом pos (цикл)
  H.arrToList = function (arr, pos) {
    var head = null, tail = null, nodes = [];
    for (var i = 0; i < arr.length; i++) {
      var n = new H.ListNode(arr[i], null); nodes.push(n);
      if (tail) tail.next = n; else head = n; tail = n;
    }
    if (pos !== undefined && pos !== null && pos >= 0 && tail) tail.next = nodes[pos];
    return head;
  };
  // список -> массив; если список длиннее limit (цикл), вернёт null
  H.listToArr = function (head, limit) {
    var out = [], max = limit || 100000;
    while (head) { out.push(head.val); head = head.next; if (out.length > max) return null; }
    return out;
  };
  // массив в порядке обхода по уровням (null для пустых мест) -> дерево
  H.arrToTree = function (arr) {
    if (!arr || !arr.length || arr[0] === null) return null;
    var root = new H.TreeNode(arr[0]), q = [root], i = 1;
    while (q.length && i < arr.length) {
      var n = q.shift();
      if (i < arr.length && arr[i] !== null) { n.left = new H.TreeNode(arr[i]); q.push(n.left); } i++;
      if (i < arr.length && arr[i] !== null) { n.right = new H.TreeNode(arr[i]); q.push(n.right); } i++;
    }
    return root;
  };
  // дерево -> массив по уровням, хвостовые null отброшены
  H.treeToArr = function (root) {
    if (!root) return [];
    var out = [], q = [root];
    while (q.length) {
      var n = q.shift();
      if (n === null || n === undefined) { out.push(null); continue; }
      out.push(n.val); q.push(n.left === undefined ? null : n.left); q.push(n.right === undefined ? null : n.right);
      if (out.length > 200000) return null;
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  };
  // Дизайн-задачи: ops — имена вызовов (первое — имя класса), args — аргументы каждого вызова.
  // Возвращает массив результатов; для void-методов вместо undefined кладётся null.
  H.runDesign = function (Cls, ops, args) {
    var res = [null], obj = new (Function.prototype.bind.apply(Cls, [null].concat(args[0] || [])))();
    for (var i = 1; i < ops.length; i++) {
      var r = obj[ops[i]].apply(obj, args[i] || []);
      res.push(r === undefined ? null : r);
    }
    return res;
  };
  // Собирает функцию из кода ученика и (необязательной) обёртки теста.
  // ListNode и TreeNode доступны ученику, если он не объявил их сам.
  H.build = function (code, wrap, fnName) {
    var body = code + '\n;' + (wrap || '') + '\n;return (typeof ' + fnName + ' === "function") ? ' + fnName + ' : undefined;';
    try { return new Function('__H', 'ListNode', 'TreeNode', body)(H, H.ListNode, H.TreeNode); }
    catch (e) {
      if (e && e.name === 'SyntaxError' && /already been declared/.test(e.message)) return new Function('__H', body)(H);
      throw e;
    }
  };
  return H;
}
if (typeof module !== 'undefined' && module.exports) module.exports = makeH;
