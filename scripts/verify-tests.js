// Проверяет тесты задач: эталонное решение обязано пройти все тесты за 5 секунд, заведомо неверное решение не должно.
// Запуск:  node scripts/verify-tests.js            (все группы)
//          node scripts/verify-tests.js g1-arrays   (одна группа, имя файла без .js)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'src', 'app.html'), 'utf8');
const scripts = [...html.matchAll(/<script id="(data|list)">([\s\S]*?)<\/script>/g)];
const ctx = {};
vm.createContext(ctx);
scripts.forEach((m) => vm.runInContext(m[2], ctx));
vm.runInContext('var NC_TESTS = {};', ctx);

const makeH = require(path.join(root, 'src', 'harness.js'));
const H = makeH();

const only = process.argv[2];
const groupsDir = path.join(root, 'tests', 'groups');
const refsDir = path.join(root, 'tests', 'refs');
const groups = fs.readdirSync(groupsDir).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).filter((g) => !only || g === only).sort();

const builtin = new Set(['duplicate-integer', 'is-anagram', 'two-integer-sum', 'anagram-groups', 'top-k-elements-in-list', 'longest-consecutive-sequence']);
let problems = 0, failures = 0;
const covered = new Set();

function runOne(slug, spec, source, label) {
  const tests = spec.tests();
  const cmp = typeof spec.cmp === 'function' ? spec.cmp : ctx.CMP[spec.cmp || 'exact'];
  if (!cmp) return { ok: false, msg: 'неизвестный компаратор ' + spec.cmp };
  let fn;
  try { fn = H.build(source, spec.wrap || '', spec.wrap ? '__t' : spec.fn); } catch (e) { return { ok: false, msg: label + ': не собралось: ' + e.message }; }
  if (!fn) return { ok: false, msg: label + ': функция ' + spec.fn + ' не найдена' };
  const t0 = Date.now();
  const bad = [];
  tests.forEach((t, i) => {
    let res, ok = false;
    try { res = fn.apply(null, JSON.parse(JSON.stringify(t.args))); ok = !!cmp(res, t.args, t.expected); } catch (e) { res = 'ERR ' + e.message; }
    if (!ok) bad.push({ i, label: t.label || JSON.stringify(t.args).slice(0, 60), got: JSON.stringify(res) === undefined ? 'undefined' : JSON.stringify(res).slice(0, 80), exp: JSON.stringify(t.expected).slice(0, 80) });
  });
  const ms = Date.now() - t0;
  return { ok: bad.length === 0, bad, ms, n: tests.length };
}

for (const g of groups) {
  vm.runInContext(fs.readFileSync(path.join(groupsDir, g + '.js'), 'utf8'), ctx, { filename: g + '.js' });
  const refFile = path.join(refsDir, g + '.js');
  if (!fs.existsSync(refFile)) { console.log('[' + g + '] нет файла эталонов tests/refs/' + g + '.js'); failures++; continue; }
  const refs = require(refFile);
  const slugs = Object.keys(vm.runInContext('NC_TESTS', ctx)).filter((s) => !covered.has(s));
  for (const slug of Object.keys(refs)) {
    const spec = ctx.NC_TESTS[slug];
    problems++; covered.add(slug);
    if (!spec) { console.log('FAIL', slug, ': в группе нет теста с таким slug'); failures++; continue; }
    if (builtin.has(slug)) { console.log('FAIL', slug, ': встроенная задача, у неё свои тесты'); failures++; continue; }
    for (const k of ['fn', 'starter', 'tests']) if (!spec[k]) { console.log('FAIL', slug, ': нет поля', k); failures++; }
    const good = runOne(slug, spec, refs[slug].ref, 'эталон');
    if (!good.ok) {
      failures++;
      console.log('FAIL', slug, '— эталон не прошёл:', good.msg || '');
      (good.bad || []).slice(0, 3).forEach((b) => console.log('    тест', b.i, b.label, '| получено', b.got, '| ожидалось', b.exp));
    } else if (good.ms > 4000) { failures++; console.log('FAIL', slug, '— эталон слишком медленный:', good.ms, 'мс'); }
    if (refs[slug].wrong) {
      const bad = runOne(slug, spec, refs[slug].wrong, 'неверное');
      if (bad.ok) { failures++; console.log('FAIL', slug, '— заведомо неверное решение прошло все тесты'); }
    } else { failures++; console.log('FAIL', slug, '— нет поля wrong'); }
    if (good.ok) console.log('ok  ', slug, good.n + ' тестов,', good.ms + ' мс');
  }
  for (const slug of slugs) if (!refs[slug]) { failures++; console.log('FAIL', slug, ': есть тесты, но нет эталона в tests/refs/' + g + '.js'); }
}

const all = ctx.NC_TESTS ? Object.keys(ctx.NC_TESTS) : [];
if (!only) {
  const need = ctx.NC_LIST.map((x) => x[1]).filter((s) => !builtin.has(s));
  const missing = need.filter((s) => !all.includes(s));
  console.log('\nпокрыто задач:', need.length - missing.length, 'из', need.length);
  if (missing.length) console.log('без тестов:', missing.join(', '));
}
console.log('\nпроверено задач:', problems, ', провалов:', failures);
process.exit(failures ? 1 : 0);
