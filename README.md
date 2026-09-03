# AEM Demo Playbooks — Claude Code Plugin

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
| **merge-back-to-base-template** | Fold a completed integration into your base template so future demos inherit it. |

## The two forks

- **End of `create-eds-repo`:** Path A (**modernize-with-aemcoder**) or Path B (an integration like
  **add-adobe-target**).
- **Top of `modernize-with-aemcoder`:** first-time vs. returning aemcoder user.

Integration skills (Target today; Workfront/Journey later) each end with a **MANIFEST** that
**merge-back-to-base-template** consumes. Once merged, every new demo built from the base template already includes
the feature.

## Typical flow

1. **eds-readiness** (once) → 2. optionally **create-base-template** (once) → 3. **create-eds-repo** per demo →
4. **modernize-with-aemcoder** *or* **add-adobe-target** → 5. **merge-back-to-base-template** for anything reusable.

## Install

Accept the `.plugin` file when it appears in chat, or add it via your Claude Code plugin settings. Then just
describe what you want — e.g. "get me set up for EDS demos" or "start a new demo" — and the matching skill runs.

## Notes

- Internal to Adobe: references aemcoder.adobe.io, da-demo-kit, and the shared acsmarketing Target instance.
- A GitHub org / `-adobe` naming is **not** required — repos live under your personal account, and your demo admin
  is set in the AEM Code Sync bot wizard's **Users** step.
