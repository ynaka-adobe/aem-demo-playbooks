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

> **MANDATORY — ask with clickable dialogs.** For EVERY question, choice, or input in this skill (site name,
> template, owner, **seeding method**, the Path A vs B fork), you MUST call the **AskUserQuestion** tool — options
> for choices, the free-text box for open answers like a site name. **NEVER** present choices as a numbered or
> bulleted prose list, and never ask the user to reply in plain text. If you are about to type "Option 1… Option 2…"
> in prose, stop and use AskUserQuestion instead.

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
| **3 · Users** | **Add your admin account** (org-level covers all your sites) — this grants your admin access and replaces the old `-adobe` org convention. **Also add `ynaka@adobe.com` as an admin** if you want the shared sync/publish tooling to reach this site: it needs admin on your org to provision a per-org key (see da-demo-kit `actions/PROVISIONING.md`). |
| **4 · Finish** | Review → **Save** → "Your site is ready" with the content portal, **Preview** (`.aem.page`) and **Live** (`.aem.live`) URLs. |

> `da.live/start` is the fallback for wiring DA content if the wizard's Content step doesn't cover a case; normally
> the wizard is the primary path.

## Phase 4 — Seed default content (from da-demo-kit)

Every new demo's content repo starts **empty**, so the preview is blank until seeded. Seed it with da-demo-kit's
sample content (homepage, nav, footer) so the demo renders immediately — Path A then migrates real content over it;
Path B builds integrations on it.

**Content gate** — first check whether content already exists (list the DA sources for the new site, or fetch the
preview URL for HTTP 200). If it already has content, skip this phase.

**Ask how to seed via an AskUserQuestion dialog** (never prose). Present these options, in this order:

1. **Copy from da-demo-kit via DA tools (Recommended)** — the default when the **AEM DA MCP is connected**. Because
   the copy is cross-org and `da_copy_content` only works *within* one site, do it as **read + write**: from
   `ynaka-adobe/da-demo-kit` read `index.html`, `nav.html`, `footer.html`, `metadata.json`, and the `docs/` folder
   (`da_list_sources` / `da_get_source`), then write each to `<owner>/<demo>` at the same path (`da_create_source`).
   If the DA MCP is connected, recommend this and offer to run it now yourself.
2. **da.live/start → AEM Block Collection** — browser wizard: `https://da.live/start` → enter the repo → **Go** →
   step 2 select **AEM Block Collection** (do NOT use Author Kit) → creates the same sample pages.
3. **Manual browser copy/paste** — in `da.live`, open `https://da.live/#/ynaka-adobe/da-demo-kit`, select the pages
   → **Copy** → open `https://da.live/#/<owner>/<demo>` → **Paste**.

> If the AEM DA MCP is **not** connected, still show option 1 but note it's unavailable until they connect it (see
> the `eds-readiness` skill), and default the recommendation to option 2.

After seeding, **publish** so preview/live render (*confirm first — it's public*), then **verify**
`https://main--<demo>--<owner>.aem.page/` returns HTTP 200 with the homepage. Two ways to publish (see
**Publishing** below):
- **Browser (default):** Sidekick or Traverse → **Bulk Operations → Publish** (works because you're logged in).
- **Admin API + token (automatable):** Claude can publish for the user, but only with a `publish` API key —
  unauthenticated admin calls return **401**.

## Publishing (admin API with a token)

The AEM admin service (`admin.hlx.page`) requires auth to publish — unauthenticated `POST`s return **401**, so a
headless publish needs a **`publish`-role API key**. Claude may run these **only if the key is in an environment
variable** (`$AEM_PUBLISH_KEY`); the raw key must **never** appear in chat, and the user creates it themselves.

One-time — create a key (needs an existing admin token; the key is shown **once**, so store it):
```bash
curl -X POST https://admin.hlx.page/config/<owner>/sites/<site>/apiKeys.json \
  -H "Authorization: token <your-admin-token>" -H 'content-type: application/json' \
  -d '{"description":"publish","roles":["publish"]}'
# then: export AEM_PUBLISH_KEY=…   (never paste the key into chat)
```

Publish each path — **preview then live** (root index = empty path):
```bash
for p in "" nav footer metadata.json; do
  curl -sf -X POST -H "X-Auth-Token: $AEM_PUBLISH_KEY" https://admin.hlx.page/preview/<owner>/<site>/main/$p
  curl -sf -X POST -H "X-Auth-Token: $AEM_PUBLISH_KEY" https://admin.hlx.page/live/<owner>/<site>/main/$p
done
```
For many pages, use the admin **bulk** job (`POST …/live/<owner>/<site>/main/*` with a paths payload) instead of a
loop. *Publishing is outward-facing — confirm before running it.*

## Phase 5 — Fork: state your intention

The base is done and the demo has default content. Ask which path the user wants:

### Path A — Modernize a real site
> Migrate an existing website's pages, design, and content into this repo.

➡️ Continue with the **`modernize-with-aemcoder`** skill. This skill ends here.

### Path B — Build tool integrations
> Build integrations (Target, Workfront, etc.) on the default content seeded in Phase 4.

➡️ Continue with an integration skill (e.g. **`add-adobe-target`**). When it works, finish with
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
