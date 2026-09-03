---
name: create-eds-repo
description: Create the base EDS demo repo — make a repo from a template, install AEM Code Sync, and complete the bot setup wizard (creates the content repo, EDS site, and admin user), then fork to modernization (Path A) or integrations (Path B). Use when someone says "create an EDS repo", "start a new demo", "build an EDS demo", "spin up a demo repo", or "set up a demo site".
---

# Create Your EDS Repo (Base)

Guide an Adobe XSC product specialist — possibly non-technical — through creating the **base EDS repo** every demo
builds on. The repo is created from a **base template** (the shared `ynaka-adobe/da-demo-kit`, or the user's own
from `create-base-template`). This skill **ends at a fork** — it does not migrate content or build integrations; it
hands off to Path A or Path B.

## How to run this

- **Ask with clickable dialogs.** Whenever you need input or a choice from the user (site name, template, owner,
  the Path A vs B fork), ask via a clickable AskUserQuestion dialog — use the free-text box for open answers (like a
  site name) and options for choices — instead of prose questions.
- Adapt to your environment: if you have terminal/browsing tools, run checks, create the repo with `gh`, and fetch
  the preview URL yourself (with a clear go-ahead); otherwise give exact browser clicks and have the user report.
- One step at a time; confirm before moving on. Explain *why* in one sentence.
- **Gather up front** (skip any you can infer): (1) customer/site name → repo name, lowercase, no spaces; (2) which
  base template — shared `ynaka-adobe/da-demo-kit` or the user's own `<owner>/<template-name>` (use it everywhere as
  `<TEMPLATE>`; default `ynaka-adobe/da-demo-kit`); (3) whether it's their first time.
- Guardrails: creating a repo and installing GitHub apps are outward-facing — summarize and get a clear "yes" first.
  Never have the user paste tokens into chat.

> **No GitHub org or `-adobe` naming is required.** Repos live under the user's personal GitHub account (an org is
> optional; any name works). The demo's **admin** is set by the AEM Code Sync bot wizard's **Users** step (Phase 3),
> not by an org name.

## Phase 1 — Prerequisites

The user needs `eds-readiness` done (a GitHub account). Confirm:
```bash
gh auth status
git --version
```
`gh` isn't required — everything can be done in the browser — but it lets you create the repo for them. Confirm the
template choice: shared `ynaka-adobe/da-demo-kit` or their own `<owner>/<template-name>` → that's `<TEMPLATE>`.

## Phase 2 — Create the repo from the template

**Browser:** open `https://github.com/<TEMPLATE>` → **Use this template → Create a new repository** → Name =
customer/site name (e.g. `southwest`) → Owner = the user's GitHub account (or any org) → Visibility **Public**.

**GitHub CLI (confirm first):**
```bash
gh repo create <owner>/<name> --template <TEMPLATE> --public
```

## Phase 3 — Install AEM Code Sync & complete the bot setup wizard

This replaces the old AEM publish server with the edge microservices **and** creates the content repository, EDS
site, and admin user.

1. Open https://github.com/apps/aem-code-sync → **Configure**.
2. Select the account/org → **Only select repositories** → pick the **new demo repo you just created** →
   **Install & Authorize**.
   > ⚠️ Install on the **demo repo only — NOT a base template repo.** A base template is just a source you stamp new
   > repos from; it's never previewed or published, so it never needs Code Sync. If the app is already installed,
   > just **add this new repo** to the selected repositories.
3. Installing redirects to a **multi-step setup wizard** at `tools.aem.live/bot/setup` (prefilled with your
   org/site/content URL). Complete all steps:

| Step | What the user does |
|---|---|
| **1 · Code** | Confirm AEM Code Sync is connected to the repo and **authorize** it. |
| **2 · Content** | Select **Document Authoring (DA)** as the source; confirm the content source URL (e.g. `https://content.da.live/<owner>/<site>/`). Adjust the suffix only if needed. |
| **3 · Users** | **Add your admin account here.** Add org-level users (all sites) and/or site-level users. This is what grants your admin access — it replaces the old `-adobe` org convention. |
| **4 · Finish** | Review → **Save** → "Your site is ready" with the content portal, **Preview** (`.aem.page`) and **Live** (`.aem.live`) URLs. |

> `da.live/start` is the fallback for wiring DA content if the wizard's Content step doesn't cover a case; normally
> the wizard is the primary path.

## Phase 4 — Fork: state your intention

The base is done. Ask which path the user wants:

### Path A — Modernize a real site
> Migrate an existing website's pages, design, and content into this repo.

➡️ Continue with the **`modernize-with-aemcoder`** skill. This skill ends here.

### Path B — Start from sample pages and build integrations
> Get a working sample site to build integrations on (Target, Workfront, etc.).

1. **Content gate** — check whether the site has content: list the DA sources and fetch the preview URL for a real
   page (HTTP 200), or ask the user. If content already exists, skip to step 4.
2. **Populate sample content** — walk `https://da.live/start` → enter the GitHub repo → **Go** → on step 2 select
   **AEM Block Collection** (do NOT use Author Kit with this template) → creates sample pages.
3. **Publish** the sample pages (Traverse → Bulk Operations → **Publish**; *confirm before publishing*).
4. ➡️ Continue with an integration skill (e.g. **`add-adobe-target`**). When it works, finish with
   **`merge-back-to-base-template`**.

## Troubleshooting

- **"Could not find admin" after the wizard** — add your admin account in the bot wizard's **Users** step (Phase 3).
  Re-run https://tools.aem.live/bot/setup if needed.
- **Preview won't load** — confirm the wizard's **Finish** saved, the last push to `main` succeeded, and (Path B)
  content was published. Re-check `https://main--{repo}--{owner}.aem.page/`.
- **Wizard didn't appear after install** — open it directly: `https://tools.aem.live/bot/setup`.

## Reference links

| Resource | Link |
|---|---|
| Shared base template (default) | https://github.com/ynaka-adobe/da-demo-kit |
| AEM Code Sync app | https://github.com/apps/aem-code-sync |
| Bot setup wizard | https://tools.aem.live/bot/setup |
| Document Authoring wizard (Path B) | https://da.live/start |
