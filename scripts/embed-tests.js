// Вшивает в src/app.html: общий харнес (src/harness.js) и тесты задач (tests/groups/*.js).
// Запуск: node scripts/embed-tests.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let s = fs.readFileSync(path.join(root, 'src', 'app.html'), 'utf8');

function swap(startMarker, endMarker, body) {
  const a = s.indexOf(startMarker), b = s.indexOf(endMarker, a);
  if (a < 0 || b < 0) throw new Error('Нет маркеров ' + startMarker);
  s = s.slice(0, a + startMarker.length) + '\n' + body.trim() + '\n' + s.slice(b);
}

const harness = fs.readFileSync(path.join(root, 'src', 'harness.js'), 'utf8').replace(/\nif \(typeof module[^\n]*\n?/, '\n');
swap('// HARNESS_START', '// HARNESS_END', harness);

const dir = path.join(root, 'tests', 'groups');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
const body = 'var NC_TESTS = {};\n' + files.map((f) => '// ---- ' + f + '\n' + fs.readFileSync(path.join(dir, f), 'utf8').trim()).join('\n');
swap('// TESTS_START', '// TESTS_END', body);

fs.writeFileSync(path.join(root, 'src', 'app.html'), s);
console.log('вшито групп с тестами:', files.length);
