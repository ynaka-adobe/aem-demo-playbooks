#!/usr/bin/env node
/**
 * Generate the paste-in `ONBOARDING.md` playbooks (xsc-ai-playbooks) from the
 * canonical plugin skills (aem-demo-playbooks/skills). The plugin skills are the
 * single source of truth; this keeps the two channels from drifting.
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

// skill dir (source of truth) -> paste-in dir (generated). Order = display order.
// `update-aem-playbooks` is intentionally excluded: it's about updating the
// installed plugin, which is meaningless when you're pasting markdown into chat.
const MAP = {
  'eds-readiness': 'readiness',
  'create-base-template': 'create-repo-template',
  'create-eds-repo': 'create-eds-repo',
  'modernize-with-aemcoder': 'modernize-with-aemcoder',
  'add-adobe-target': 'add-target',
  'sync-da-content': 'sync-da-content',
  'merge-back-to-base-template': 'merge-back-to-base-template',
};

// Skill-name tokens that differ from their paste-in page name — remapped globally
// (each is a unique, unambiguous slug, so a plain global replace is safe).
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

  // Cross-references: remap differing skill slugs to their paste-in page names.
  for (const [skill, page] of TOKEN_RENAMES) {
    out = out.replaceAll(skill, page);
  }
  // "skill" reads as "playbook" in the paste-in channel (whole word only).
  out = out.replace(/\bskill\b/g, 'playbook').replace(/\bskills\b/g, 'playbooks');

  // Pull the first H1 as the title; fall back to the frontmatter name.
  const h1 = out.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : (fm.name || skillName);

  // Insert the paste-in banner right after the H1 (or at the top if none).
  const banner = BANNER(skillName);
  if (h1) {
    out = out.replace(/^#\s+.+$/m, (line) => `${line}\n\n${banner}`);
  } else {
    out = `# ${title}\n\n${banner}\n\n${out}`;
  }
  return out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

let changed = 0;
for (const [skill, page] of Object.entries(MAP)) {
  const srcPath = join(PLUGIN_ROOT, 'skills', skill, 'SKILL.md');
  if (!existsSync(srcPath)) {
    console.error(`! missing skill: ${srcPath}`);
    process.exitCode = 1;
    continue;
  }
  const generated = transform(skill, readFileSync(srcPath, 'utf8'));
  // Flat, topic-named files at the repo root (e.g. create-eds-repo.md) so they're
  // distinguishable in Claude's file list — not seven identical ONBOARDING.md.
  const destPath = join(OUT_ROOT, `${page}.md`);
  const prev = existsSync(destPath) ? readFileSync(destPath, 'utf8') : null;

  if (prev !== generated) {
    changed++;
    if (CHECK) {
      console.error(`✗ stale: ${page}.md`);
    } else {
      mkdirSync(OUT_ROOT, { recursive: true });
      writeFileSync(destPath, generated);
      console.log(`✓ ${skill}  ->  ${page}.md`);
    }
  } else {
    console.log(`= ${page}.md (unchanged)`);
  }
}

if (CHECK && changed > 0) {
  console.error(`\n${changed} paste-in playbook(s) out of date — run: node scripts/gen-onboarding.mjs`);
  process.exit(1);
}
console.log(`\n${CHECK ? 'checked' : 'generated'} ${Object.keys(MAP).length} playbook(s) → ${OUT_ROOT}`);
