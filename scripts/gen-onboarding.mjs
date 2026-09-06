#!/usr/bin/env node
/**
 * Generate the paste-in playbooks (xsc-ai-playbooks) from the canonical plugin
 * skills (aem-demo-playbooks/skills). The plugin skills are the single source of
 * truth; this keeps the paste-in channel from drifting.
 *
 * For each skill it emits, into the xsc-ai-playbooks repo root:
 *   - <topic>.md    the paste-in markdown (copy into Claude; also used for share links)
 *   - <topic>.html  a rendered GitHub Pages page with a "Copy for Claude" button
 * plus a single index.html listing every playbook.
 *
 * Usage:
 *   node scripts/gen-onboarding.mjs            # write into ../xsc-ai-playbooks
 *   node scripts/gen-onboarding.mjs --out DIR  # write into DIR (preview/dry-run)
 *   node scripts/gen-onboarding.mjs --check     # exit 1 if any output would change
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');
const DEFAULT_OUT = resolve(PLUGIN_ROOT, '..', 'xsc-ai-playbooks');

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const OUT_ROOT = outFlag !== -1 ? resolve(args[outFlag + 1]) : DEFAULT_OUT;
const CHECK = args.includes('--check');

// skill dir (source of truth) -> paste-in page name (generated). Order = display order.
// `update-aem-playbooks` is intentionally excluded: it's about updating the installed
// plugin, meaningless when pasting markdown into chat.
const MAP = {
  'eds-readiness': 'readiness',
  'create-base-template': 'create-repo-template',
  'create-eds-repo': 'create-eds-repo',
  'modernize-with-aemcoder': 'modernize-with-aemcoder',
  'add-adobe-target': 'add-target',
  'sync-da-content': 'sync-da-content',
  'merge-back-to-base-template': 'merge-back-to-base-template',
};

const TOKEN_RENAMES = Object.entries(MAP).filter(([s, p]) => s !== p);

const BANNER = (title) =>
  `> **▶ Claude — this file _is_ the task.** If it was just pasted into our conversation, don't treat it as
> background reference and don't wait for a separate instruction — **start now**: follow the steps below and guide
> the user through them one at a time, beginning with the first phase. (Human: you can just say "walk me through
> this" — but Claude should begin even if you don't.)
>
> _This playbook is auto-generated from the \`${title}\` plugin skill. Edit the skill, not this file._`;

function stripFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return { fm, body: src.slice(m[0].length) };
}

function transform(skillName, src) {
  const { fm, body } = stripFrontmatter(src);
  let out = body;
  for (const [skill, page] of TOKEN_RENAMES) out = out.replaceAll(skill, page);
  out = out.replace(/\bskill\b/g, 'playbook').replace(/\bskills\b/g, 'playbooks');

  const h1 = out.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : (fm.name || skillName);

  const banner = BANNER(skillName);
  if (h1) out = out.replace(/^#\s+.+$/m, (line) => `${line}\n\n${banner}`);
  else out = `# ${title}\n\n${banner}\n\n${out}`;

  const md = out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  return { md, title };
}

// Embed markdown as a JS string safe for inline <script> (escape < so no tag can close).
const jsString = (s) => JSON.stringify(s).replace(/</g, '\\u003c');

function htmlPage(title, md) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — XSC AI Playbooks</title>
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
<header class="bar">
  <a class="back" href="index.html">← All playbooks</a>
  <button id="copy" class="copy">Copy for Claude</button>
</header>
<p class="hint">Click <b>Copy for Claude</b>, then paste into <b>Claude Code</b> or <b>claude.ai chat</b> — it starts
walking you through automatically.</p>
<main id="content" class="markdown-body"></main>
<script id="src" type="application/json">${jsString(md)}</script>
<script>
  const md = JSON.parse(document.getElementById('src').textContent);
  document.getElementById('content').innerHTML = marked.parse(md);
  const btn = document.getElementById('copy');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(md); btn.textContent = 'Copied ✓'; }
    catch (e) { btn.textContent = 'Press ⌘/Ctrl+C'; }
    setTimeout(() => (btn.textContent = 'Copy for Claude'), 2000);
  });
</script>
</body>
</html>
`;
}

function indexPage(items) {
  const cards = items
    .map(
      ({ page, title }, i) =>
        `  <li><a href="${page}.html"><span class="n">${i + 1}</span><span class="t">${title}</span>
      <code>${page}.md</code></a></li>`
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>XSC AI Playbooks</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>XSC AI Playbooks</h1>
<p class="hint">Paste-into-Claude guides for building AEM Edge Delivery demos. Open one, click <b>Copy for
Claude</b>, paste it into Claude Code or claude.ai chat — Claude walks you through it. <b>No coding required.</b></p>
<ul class="list">
${cards}
</ul>
<p class="foot">Auto-generated from the <code>aem-demo-playbooks</code> plugin skills — do not hand-edit.</p>
</body>
</html>
`;
}

const CSS = `:root{--fg:#1a1a1a;--muted:#6b7280;--line:#e5e7eb;--accent:#1473e6;--bg:#fff;--code:#f5f5f7}
*{box-sizing:border-box}body{margin:0;padding:2rem 1rem 4rem;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--fg);background:var(--bg);max-width:820px;margin-inline:auto}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--bg);padding:.5rem 0;border-bottom:1px solid var(--line);margin-bottom:1rem}
.back{font-weight:600}
.copy{cursor:pointer;border:0;background:var(--accent);color:#fff;font-weight:600;font-size:.95rem;padding:.5rem 1rem;border-radius:8px}
.copy:hover{filter:brightness(1.05)}
.hint{color:var(--muted);font-size:.95rem;background:var(--code);padding:.75rem 1rem;border-radius:8px}
.list{list-style:none;padding:0;margin:1.5rem 0}
.list li{margin:.5rem 0}
.list a{display:flex;align-items:center;gap:.9rem;padding:.9rem 1rem;border:1px solid var(--line);border-radius:10px;color:var(--fg)}
.list a:hover{border-color:var(--accent);text-decoration:none;background:var(--code)}
.list .n{flex:0 0 1.8rem;height:1.8rem;display:grid;place-items:center;background:var(--accent);color:#fff;border-radius:50%;font-size:.85rem;font-weight:700}
.list .t{font-weight:600;flex:1}
.list code,.foot code{background:var(--code);padding:.15rem .4rem;border-radius:5px;font-size:.85em;color:var(--muted)}
.foot{color:var(--muted);font-size:.85rem;margin-top:2rem;border-top:1px solid var(--line);padding-top:1rem}
.markdown-body h1{font-size:1.9rem;margin:.2rem 0 1rem}
.markdown-body h2{font-size:1.35rem;margin-top:2rem;border-bottom:1px solid var(--line);padding-bottom:.3rem}
.markdown-body h3{font-size:1.1rem;margin-top:1.5rem}
.markdown-body code{background:var(--code);padding:.15rem .4rem;border-radius:5px;font-size:.88em}
.markdown-body pre{background:var(--code);padding:1rem;border-radius:10px;overflow:auto}
.markdown-body pre code{background:none;padding:0}
.markdown-body blockquote{margin:1rem 0;padding:.5rem 1rem;border-left:4px solid var(--accent);background:var(--code);border-radius:0 8px 8px 0;color:#333}
.markdown-body table{border-collapse:collapse;width:100%;margin:1rem 0}
.markdown-body th,.markdown-body td{border:1px solid var(--line);padding:.5rem .7rem;text-align:left;font-size:.92rem}
.markdown-body img{max-width:100%}
`;

function writeIfChanged(path, content, results) {
  const prev = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const rel = path.slice(OUT_ROOT.length + 1);
  if (prev === content) {
    results.unchanged.push(rel);
    return false;
  }
  results.changed.push(rel);
  if (!CHECK) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  return true;
}

const results = { changed: [], unchanged: [] };
const items = [];

for (const [skill, page] of Object.entries(MAP)) {
  const srcPath = join(PLUGIN_ROOT, 'skills', skill, 'SKILL.md');
  if (!existsSync(srcPath)) {
    console.error(`! missing skill: ${srcPath}`);
    process.exitCode = 1;
    continue;
  }
  const { md, title } = transform(skill, readFileSync(srcPath, 'utf8'));
  items.push({ page, title });
  writeIfChanged(join(OUT_ROOT, `${page}.md`), md, results);
  writeIfChanged(join(OUT_ROOT, `${page}.html`), htmlPage(title, md), results);
}

writeIfChanged(join(OUT_ROOT, 'index.html'), indexPage(items), results);
writeIfChanged(join(OUT_ROOT, 'style.css'), CSS, results);

for (const f of results.changed) console.log(`${CHECK ? '✗ stale' : '✓ wrote'}: ${f}`);
if (process.env.VERBOSE) for (const f of results.unchanged) console.log(`= ${f}`);

if (CHECK && results.changed.length) {
  console.error(`\n${results.changed.length} file(s) out of date — run: node scripts/gen-onboarding.mjs`);
  process.exit(1);
}
console.log(
  `\n${CHECK ? 'checked' : 'generated'} ${items.length} playbook(s) (md + html) + index → ${OUT_ROOT}`
);
