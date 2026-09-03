---
name: create-base-template
description: Guide creating your own reusable EDS base template repo — copy a starter (e.g. da-demo-kit) into your GitHub account and mark it as a template so every future demo starts from it. Use when someone says "create my own base template", "make a reusable template repo", "set up a demo base template", or wants a template they can accumulate custom demo features in over time.
---

# Create Your Own Base Template

Guide an Adobe XSC product specialist — possibly non-technical — through creating their **own reusable base
template repository** for AEM Edge Delivery (EDS) demos. The base template is the launch point for every demo; over
time the user merges demo customizations back into it so it accumulates reusable functionality.

**Lifecycle (state it plainly if the user is unsure why they're here):**
1. **This skill** → create a base template repo (once).
2. **`create-eds-repo`** → for each customer, create a demo repo *from* the base template.
3. **Customize** → build something new in the demo (e.g. a Target integration).
4. **`merge-back-to-base-template`** → fold that customization into the base template so the next demo inherits it.

## How to run this

- Adapt to your environment: if you have terminal tools, run checks and (with a clear go-ahead) create the repo with
  `gh`; otherwise give exact browser clicks and have the user report back.
- One step at a time; confirm before moving on. Explain *why* in one sentence.
- Guardrails: creating a repo and marking it a template are outward-facing — summarize and get a clear "yes" first.
  Never have the user paste tokens into chat.

## Step 0 — Prerequisites

The user needs the `eds-readiness` setup done (a GitHub account). Confirm:
```bash
gh auth status
```
If `gh` isn't installed, every step here can be done in the browser.

## Step 1 — Pick a starter

| Starter | Best when | Repo |
|---|---|---|
| **da-demo-kit** (recommended) | Want demo functionality wired up (Target, Workfront, Send-to-Workfront, the `ak.js` framework). | `https://github.com/ynaka-adobe/da-demo-kit` |
| **aem-boilerplate** | Want a clean, minimal EDS start and to add your own functionality. | `https://github.com/adobe/aem-boilerplate` |
| An existing repo of your own | You've already built something to standardize on. | your repo |

## Step 2 — Copy the starter (copy, don't fork)

**Copy as a template — do not fork.** A *copy* gives a clean, independent repo with no upstream tie and a fresh
history, so you fully own it, can mark it as a template, and merge your own work in freely. A *fork* stays linked
upstream, is capped at one per account, and can't cleanly become a template repo.

**Browser:** open the starter → **Use this template → Create a new repository** → Owner = your GitHub account (or
any org) → Name = your base template name (e.g. `<username>-demo-kit`) → Visibility **Public** → create.

**GitHub CLI (confirm first):**
```bash
gh repo create <owner>/<template-name> --template ynaka-adobe/da-demo-kit --public
```

## Step 3 — Mark the repo as a template

**Browser:** repo → **Settings** → **General** → check **✅ Template repository**.
**CLI (confirm first):** `gh repo edit <owner>/<template-name> --template`
Verify: `gh repo view <owner>/<template-name> --json isTemplate` → expect `{"isTemplate": true}`.

## Step 4 — Confirm and record

- ✅ Repo `<owner>/<template-name>` exists, is **Public**, marked **Template repository**.
- 📌 Have the user note the template as `<owner>/<template-name>` — they'll give it to `create-eds-repo` in place of
  `ynaka-adobe/da-demo-kit` for each demo.

## Step 5 — Later: grow the base template

When a demo produces something reusable, fold it back into the base template with the `merge-back-to-base-template`
skill (driven by that integration's MANIFEST). Keep base-template changes **generic** — strip customer content,
names, and URLs before merging.

## Reference links

| Resource | Link |
|---|---|
| Reference base template (da-demo-kit) | https://github.com/ynaka-adobe/da-demo-kit |
| Clean EDS starter (aem-boilerplate) | https://github.com/adobe/aem-boilerplate |
| GitHub "create a repo from a template" | https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template |
