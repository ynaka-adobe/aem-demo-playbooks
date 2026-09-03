---
name: modernize-with-aemcoder
description: Path A — migrate a real website's pages, design, and content into an EDS repo using the Experience Modernization Agent (aemcoder.adobe.io). Hands the user exact prompts to paste into the aemcoder chat. Use when someone says "modernize <site>", "migrate a site with aemcoder", "migrate pages to EDS", "use the Experience Modernization Agent", or "convert a website to Edge Delivery".
---

# Modernize a Site with the Experience Modernization Agent (Path A)

Coach an Adobe XSC product specialist — possibly non-technical — through an EMA migration. You **cannot operate
aemcoder.adobe.io** — it is a hosted chat agent the user drives in their browser. Your job: verify setup, hand over
copy-paste prompts, confirm each step, and troubleshoot.

**Prerequisite:** the user has completed `create-eds-repo` — repo from template, **AEM Code Sync installed**
(https://github.com/apps/aem-code-sync), site provisioned. If not, send them there first.

## How to run this

- **MANDATORY — ask with clickable dialogs.** You MUST call the AskUserQuestion tool for these and NEVER present a numbered/bulleted prose option list. Whenever you need input or a choice from the user (source URL, page URLs,
  first-time vs returning, "migrate more pages?"), ask via a clickable AskUserQuestion dialog — free-text box for
  open answers, options for choices — instead of prose questions.
- One phase at a time; wait for confirmation. Explain *why* in one sentence. Put every URL and prompt in its own
  code block.
- **Pre-fill prompts.** Gather up front — (1) source site URL; (2) homepage URL; (3) any additional page URLs;
  (4) owner and repo; (5) any CSS selectors — then hand prompts with the **real values already filled in** (no
  `<...>` to edit), and show what you filled so the user can eyeball it.
- **EMA is conversational.** After a migrate prompt it often replies with **clarifying checkboxes** the user clicks
  in the aemcoder UI (they don't type the answer). In practice only the content-scope question does this.
- **Order gates:** migrate one page before any bulk import; complete site-wide design before per-block CSS.
- Guardrails: pushing code, uploading content, and publishing are outward-facing — get a clear "yes" first. Never
  have the user paste tokens (GitHub, Figma) into chat; tokens go only into the aemcoder/Figma **Settings** UI.

## Phase 1 — Prerequisite gate

Confirm the base is done: repo from template; **AEM Code Sync installed** (open
https://github.com/apps/aem-code-sync to confirm/repair); preview loads at `https://main--{repo}--{owner}.aem.page/`.
If not → send to `create-eds-repo`.

## Phase 2 — Connect to EMA (first-time vs returning)

Ask: first time using aemcoder, or used it before?

**First time:**
1. Open https://aemcoder.adobe.io/
2. Accept the **GitHub repository connection** popup → connect the new repo.
3. Run **Code Connector** and **Code Sync**, selecting the repo.

**Returning user (another site already registered):**
1. **Connect** — so a **fresh token is applied to the current site**.
2. Click **Switch Site** → add the **new EDS site URL** (`https://main--{repo}--{owner}.aem.page/`) → **Verify** to
   register the correct git repo + content repository.

## Phase 3 — Migrate content (SINGLE page first)

Paste (fill `<SITE_URL>`):
```
Migrate <SITE_URL> to EDS
```
> EMA replies with a scope question — **checkboxes** the user clicks: ☐ **Homepage only** · ☐ Specific pages ·
> ☐ Discover & catalog site · ☐ Other. **Check "Homepage only" and send.** One page first — it builds the import
> infrastructure any later bulk import depends on.

Then migrate the header and footer separately (page migration **excludes** them):
```
migrate header block
```
```
migrate footer block
```

### Refine a block (especially the header — expect to iterate)

The header is the hardest block; every site differs, so **don't expect one prompt to finish it.** Work **one change
at a time** and verify after each:
1. **Screen-grab the exact area** from the source site (shows EMA what "good" looks like).
2. **Describe the single change** precisely.
3. Send, check, repeat.

Prompt template:
```
update the <block> block. <the one change you want>.
here is the source for reference: <paste screenshot / SVG / URL>
```
Use the same screenshot-and-describe loop for navigation and any block later.

### Optional — more pages
Ask: "Do you want to migrate any other pages?" If yes (only then):
```
Migrate these pages: <URL1>, <URL2>, ... to EDS
```

## Phase 4 — Migrate design & tokens

**Tokens first** (the CSS variables the design references):
```
Migrate Design Tokens from <SOURCE_URL> to EDS
```
Then design (two steps — **site-wide design before per-block CSS**):
```
Migrate Design from <SOURCE_URL> to EDS
```
Step 1 → global palette/typography/spacing (`/styles/styles.css`). Step 2 → per-block CSS
(`/blocks/{name}/{name}.css`).

## Phase 5 — Polish: navigation & blocks

Use the Refine-a-block loop (screenshot source + describe one delta).
```
Setup navigation from <SOURCE_URL>
```
or
```
Fix Navigation Menu
```
Block enhancement (on `main`; real block name + source selector):
```
please make the first section dark, content match the element <CSS_SELECTOR> on <SOURCE_URL>
```
Figma → block (optional; token in aemcoder **Settings**, never chat):
```
Create new block <block-name> using figma file: <FIGMA_SELECTION_LINK>
```

## Phase 6 — Sync back

**Code → GitHub:** left menu **Code → Workspace changes** → stage with **+** → **Push** (main, or a `pr-xxxx`
branch). *Confirm first.* **Content → DA:** **Content → Upload Content**; include the header only if you edited it,
else **index only**.

## Phase 7 — Validate & publish

Check `https://main--{repo}--{owner}.aem.page/` (HTTP 200; unstyled header/footer before Phase 5 is expected).
Publish (live domain uses `.aem.live`) two ways:
- **Browser (default):** **Traverse** to list URLs → **Bulk Operations** → **Publish**.
- **Admin API + token (automatable):** the admin API needs a `publish` API key (unauthenticated = **401**). Create a
  key once (`POST https://admin.hlx.page/config/<owner>/sites/<site>/apiKeys.json` with `{"roles":["publish"]}`),
  store it in `$AEM_PUBLISH_KEY` (never in chat), then `POST` `preview` then `live` for each path with
  `-H "X-Auth-Token: $AEM_PUBLISH_KEY"` (or the admin bulk job for many pages).

*Publishing is outward-facing/public — confirm before publishing.*

## Troubleshooting

- **"Could not find admin"** — add your admin account in the AEM Code Sync bot wizard's **Users** step (see
  `create-eds-repo`, Phase 3).
- **Returning user: aemcoder still points at the old site** — redo Phase 2 returning steps: **Connect** (fresh
  token) → **Switch Site** → new EDS site URL → **Verify**.
- **Preview won't load** — confirm AEM Code Sync is installed, the last push to `main` succeeded, and content was
  uploaded to DA.
- **Universal Editor doesn't work** — da-demo-kit uses DA with a custom `ak.js` framework, so UE isn't wired by
  default. Prompt `Setup UE support for this project`, read the reply, then `continue`.

## Reference links

| Resource | Link |
|---|---|
| Prerequisite | the `create-eds-repo` skill |
| Experience Modernization Agent | https://aemcoder.adobe.io/ |
| AEM Code Sync app | https://github.com/apps/aem-code-sync |
| da-demo-kit template | https://github.com/ynaka-adobe/da-demo-kit |
