# AEM Demo Playbooks — Claude Code Plugin

> # ⚠️ MOVED / DEPRECATED
> This repo has been superseded by the **XSC AI Playbooks monorepo**, where it now lives as the
> **`aem-edge-delivery`** plugin (one of several product toolsets, alongside an `xsc` concierge and, later,
> `aem-assets` / `aem-guides`).
>
> **New home:** https://github.com/ynaka-adobe/xsc-ai-playbooks
> **Install now:**
> ```bash
> claude plugin marketplace add ynaka-adobe/xsc-ai-playbooks
> claude plugin install xsc@ynaka-adobe
> claude plugin install aem-edge-delivery@ynaka-adobe
> ```
> The old `ynaka-adobe/aem-demo-playbooks` marketplace/plugin is no longer maintained. Catalog:
> https://ynaka-adobe.github.io/xsc-ai-playbooks/

Guided playbooks for building **AEM Edge Delivery (EDS) demos**, packaged as install-once skills. No more copying
`.md` files into chat — install the plugin, then trigger a playbook by slash command or by describing what you want
("help me build a demo"). **No coding experience required.**

## Skills

| Skill | What it does |
|---|---|
| **eds-readiness** | One-time setup: check git/Node/AEM CLI, create a GitHub account, confirm readiness. |
| **create-base-template** | Copy a starter (e.g. da-demo-kit) into your GitHub account as a reusable template repo. Optional, once. |
| **create-eds-repo** | Base for every demo: repo from template → AEM Code Sync → bot setup wizard (content repo + site + admin) → **fork** to Path A or B. |
| **modernize-with-aemcoder** | **Path A:** migrate a real site's pages, design & content with the Experience Modernization Agent (aemcoder.adobe.io). |
| **add-adobe-target** | **Path B example:** add Adobe Target to a demo. Ends with a MANIFEST for reuse. |
| **sync-da-content** | Sync the Adobe Target credentials sheet from da-demo-kit to your target DA repo. Automated one-click population. |
| **merge-back-to-base-template** | Fold a completed integration into your base template so future demos inherit it. |
| **update-aem-playbooks** | Update this plugin to the latest version — say "update the demo playbooks", then restart. |

## The two forks

- **End of `create-eds-repo`:** Path A (**modernize-with-aemcoder**) or Path B (an integration like
  **add-adobe-target**).
- **Top of `modernize-with-aemcoder`:** first-time vs. returning aemcoder user.

Integration skills (Target today; Workfront/Journey later) each end with a **MANIFEST** that
**merge-back-to-base-template** consumes. Once merged, every new demo built from the base template already includes
the feature.

## Typical flow

1. **eds-readiness** (once) → 2. optionally **create-base-template** (once) → 3. **create-eds-repo** per demo →
4. **sync-da-content** (populate shared content) → 5. **modernize-with-aemcoder** *or* **add-adobe-target** → 6. **merge-back-to-base-template** for anything reusable.

## Install (one time)

In an interactive Claude Code terminal, run:

```bash
claude plugin marketplace add ynaka-adobe/aem-demo-playbooks
claude plugin install aem-demo-playbooks@ynaka-adobe
```

Then **restart Claude Code**. After that, just describe what you want — e.g. "get me set up for EDS demos" or
"start a new demo" — and the matching skill runs.

## Updating (when a new version ships)

Installing does **not** auto-update. When you hear a new skill/feature is out but you don't see it, run:

```bash
claude plugin marketplace update ynaka-adobe && claude plugin update aem-demo-playbooks@ynaka-adobe
```

Then **restart Claude Code**. That's it — refresh the catalog, update the plugin, restart. (Skills load at startup,
so the restart is required.)

## Notes

- Internal to Adobe: references aemcoder.adobe.io, da-demo-kit, and the shared acsmarketing Target instance.
- A GitHub org / `-adobe` naming is **not** required — repos live under your personal account, and your demo admin
  is set in the AEM Code Sync bot wizard's **Users** step.

## Contributing / versioning

Every change must bump the version in `.claude-plugin/plugin.json`, or `claude plugin update` won't pick it up.
This repo automates that with a **pre-commit hook** that increments the patch version on each commit. Enable it once
after cloning:

```bash
git config core.hooksPath .githooks
```

Then the loop is: **edit → `git commit`** (version auto-bumps) **→ `./sync.sh`** → **restart Claude Code**.

`./sync.sh` does the three easy-to-forget steps in one shot: `git push`, refresh the marketplace, and update your
local install. Restart is the only manual step after it (skills load at startup). Teammates who just consume the
plugin update the same way: `claude plugin marketplace update ynaka-adobe && claude plugin update aem-demo-playbooks@ynaka-adobe`, then restart.
