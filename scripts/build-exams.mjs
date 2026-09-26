#!/usr/bin/env node
/**
 * Downloads the 23 CLF-C02 practice exams from
 * github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes (MIT License)
 * and converts them to src/data/exams.json.
 *
 * Usage:  npm run build:exams            (download from GitHub)
 *         npm run build:exams -- <dir>   (read practice-exam-N.md files from a local folder)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = 'https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/master/practice-exam';
const COUNT = 23;

function parse(md) {
  const questions = [];
  let cur = null;
  const push = () => {
    if (cur && cur.options.length >= 2 && cur.answer.length) questions.push(cur);
    else if (cur) console.warn(`  skipped: "${cur.question.slice(0, 60)}…"`);
  };
  for (const raw of md.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('<') || line.startsWith('#') || line === '---' || line.startsWith('layout:')) continue;
    let m;
    if ((m = raw.match(/^\d+\.\s+(.*)$/))) {
      push();
      cur = { question: m[1].trim(), options: [], answer: [], link: '' };
    } else if (!cur) {
      continue;
    } else if ((m = line.match(/^-\s*([A-F])\.\s*(.*)$/))) {
      cur.options.push(m[2].trim());
    } else if ((m = line.match(/^correct answers?:\s*([A-F](?:[\s,&]*[A-F])*)\b/i))) {
      cur.answer = m[1].toUpperCase().match(/[A-F]/g).map((l) => l.charCodeAt(0) - 65);
    } else if ((m = line.match(/^(?:explanation|reference):\s*<?(https?:\/\/[^>\s]+)>?/i))) {
      cur.link = m[1];
    } else if (!cur.options.length) {
      cur.question += ' ' + line;
    }
  }
  push();
  return questions.map((q) => ({ ...q, answer: q.answer.filter((i) => i < q.options.length) })).filter((q) => q.answer.length);
}

async function load(n, dir) {
  const name = `practice-exam-${n}.md`;
  if (dir) return fs.readFileSync(path.join(dir, name), 'utf8');
  const res = await fetch(`${RAW}/${name}`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.text();
}

const dir = process.argv[2];
const exams = [];
for (let n = 1; n <= COUNT; n++) {
  const questions = parse(await load(n, dir));
  console.log(`Practice Exam ${n}: ${questions.length} questions`);
  exams.push({ id: n, title: `Practice Exam ${n}`, questions });
}
const out = path.join(root, 'src', 'data', 'exams.json');
fs.writeFileSync(out, JSON.stringify(exams));
console.log(`\nWrote ${exams.reduce((s, e) => s + e.questions.length, 0)} questions → ${path.relative(root, out)}`);
