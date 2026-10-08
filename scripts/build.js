// Собирает самостоятельную страницу index.html из src/app.html.
// src/app.html — это тело страницы в формате Claude Artifact (без <!doctype>, <html>, <head>, <body>).
// Запуск: node scripts/build.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src', 'app.html'), 'utf8');

const split = src.indexOf('<div class="shell"');
if (split < 0) throw new Error('В src/app.html не найден <div class="shell">');

const head = src.slice(0, split).trim();
const body = src.slice(split).trim();

const out = [
  '<!doctype html>',
  '<html lang="ru">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<style>html,body{margin:0}</style>',
  head,
  '</head>',
  '<body>',
  body,
  '</body>',
  '</html>',
  ''
].join('\n');

fs.writeFileSync(path.join(root, 'index.html'), out);
console.log('index.html собран: ' + out.length + ' байт');
