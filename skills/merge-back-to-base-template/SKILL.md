---
name: merge-back-to-base-template
description: Fold a completed integration (e.g. Adobe Target) from a demo repo into your base template using the integration's MANIFEST, so every future demo inherits it. Use when someone says "merge my integration back", "add this feature to my base template", "make this reusable for future demos", or has finished building an integration on a demo and wants it in the template.
---

# Merge Back to Base Template

Help an Adobe XSC product specialist merge a **completed integration** from a **demo repo** into their **base
template** (the shared `ynaka-adobe/da-demo-kit`, or their own `<owner>/<template-name>`), using the integration's
**MANIFEST** (the artifact list at the end of each integration skill, e.g. `add-adobe-target`).

## How to run this

- **MANDATORY — ask with clickable dialogs.** You MUST call the AskUserQuestion tool for these and NEVER present a numbered/bulleted prose option list. Whenever you need input or a choice from the user (which integration, demo repo,
  base template), ask via a clickable AskUserQuestion dialog — free-text box for open answers, options for choices —
  instead of prose questions.
- Adapt to your environment: if you have terminal/file tools, clone the base template, copy the manifest's
  artifacts, apply the merge entries, and open the PR yourself (with the user's go-ahead); otherwise give exact
  file/paths and `git` commands.
- The **MANIFEST is the contract.** It lists **files** (source path → same dest path), **merge** entries (config
  files where you add an entry rather than overwrite — sidekick `plugins[]`, the DA library sheet), **optional**
  artifacts, **notes** (CSP, `head.html` metas), and **exclude** (do NOT copy).
- Keep it **generic**: strip customer content, names, URLs, demo data before merging.
- Guardrails: opening a PR / pushing / merging is outward-facing — summarize and get a clear "yes" first. Never have
  the user paste tokens into chat.

## Step 1 — Gather inputs

- Which integration (e.g. Target) and its **MANIFEST**.
- The **demo repo** it was built in: `<owner>/<demo-repo>`.
- The **base template** repo: `<owner>/<template-name>` (default `ynaka-adobe/da-demo-kit`).
- Confirm GitHub access: `gh auth status`.

## Step 2 — Clone the base template and branch

```bash
git clone https://github.com/<owner>/<template-name>.git
cd <template-name>
git checkout -b add-<integration-name>
git remote add demo https://github.com/<owner>/<demo-repo>.git
git fetch demo
```

## Step 3 — Copy artifacts per the MANIFEST

- **files** — copy each `source path → dest path`. Method A: cherry-pick the commit(s) (`git cherry-pick <sha>`).
  Method B (best for a self-contained folder like `/blocks/<name>/` or `/tools/<name>/`): copy the folder over.
- **merge** — for files you add to (not overwrite), splice in only the integration's entry (sidekick `plugins[]`,
  DA library sheet row), preserving what's there.
- **optional** — include only if wanted (e.g. a UE model).
- **notes** — apply required companions (e.g. `head.html` metas; ensure CSP `script-src` allows the scripts).
- **exclude** — do NOT copy anything the manifest excludes.

## Step 4 — Genericize

Strip customer-specific content, names, hard-coded URLs, sample data. The base template must start clean.

## Step 5 — Commit, PR, merge

```bash
git add -A
git commit -m "Add <integration-name> integration to base template"
git push -u origin add-<integration-name>
```
Open a PR on the base template and merge it. *Confirm with the user first — outward-facing.*

**Cherry-pick conflicts?** Resolve the listed files, `git add`, then `git cherry-pick --continue`. If messy, prefer
method B (copy the self-contained folder).

## Step 6 — Verify

- The base template now contains every **files** and **merge** artifact from the manifest.
- Nothing customer-specific leaked in.
- The next demo created from the base template (via `create-eds-repo`) will already include the feature.
