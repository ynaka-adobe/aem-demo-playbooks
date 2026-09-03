---
name: add-adobe-target
description: Path B integration — add Adobe Target to an EDS demo (enable at.js, author a target-offer block, create/verify an experience-targeting activity) using a shared demo runtime, no credentials or App Builder needed. Ends with a MANIFEST for merging into a base template. Use when someone says "add Adobe Target", "add personalization to my demo", "set up experience targeting", or "add a targeted hero/offer".
---

# Add Adobe Target to an EDS Demo (Path B example)

Help an Adobe XSC product specialist add Adobe Target to an EDS site whose base **does not already include Target**
(a standard boilerplate, or a base template before Target was merged in). Import the Target code/blocks/tools from
`da-demo-kit` (the canonical source) and wire them in. The site, its GitHub repo, and its DA content already exist.

## How to run this

- **Detect the starting point.** Check whether the repo already has `scripts/target.js` and `deps/at/`. If yes
  (built from `da-demo-kit`, or a base template that already has Target merged in), **skip Steps 1–2** and go to
  Step 3. If no, do them.
- Adapt to your environment: if you have file tools, fetch the da-demo-kit files and write them into the repo, edit
  `scripts.js`, and verify the preview yourself; otherwise give the user exact files/paths and edits.
- **Start with Step 0 (access provisioning)** — it can take time, so kick it off first.
- One step at a time; explain *why*. Guardrails: pushing code and publishing are outward-facing — get a "yes" first.
- **Prerequisite:** a working demo (repo + a preview URL that loads). If not, send the user to `create-eds-repo`.

## Step 0 — Get access to the shared demo Target instance (one-time)

The demo uses a shared Target instance on the **acsmarketing** org. Request access once:
```
https://acrs.adobe.com/go/6bff542e-f709-499f-8156-57e0fc914510
```
Kick it off now, then continue. It worked when the Target activity library (Step 6) loads for the user.

## Step 1 — Import the Target components from da-demo-kit

*(Skip if the site already has these.)* Copy from `da-demo-kit` into the **same paths**:

| From da-demo-kit | Into repo at | Why |
|---|---|---|
| `scripts/target.js` | `scripts/target.js` | Client module: reads `target` metas, loads at.js, page-load/hero-mbox logic. |
| `deps/at/` (`at.js` + `vendor-at.js`) | `deps/at/` | `at.js` is the loader; `vendor-at.js` is at.js 2.11.8 from the acsmarketing instance (the Target embed). |
| `blocks/target-offer/` (`.js`,`.css`,`metadata.json`) | `blocks/target-offer/` | Authorable Target offer block. |
| `tools/target/` | `tools/target/` | DA tool that lists/creates Target activities via the shared runtime. |
| `tools/sidekick/config.json` — the `target` **plugin entry** only | merge into your `tools/sidekick/config.json` | Sidekick **Target** deep-link. Merge into `plugins[]`, don't overwrite. |
| `ue/models/blocks/target-offer.json` | `ue/models/blocks/` | **Optional** — only if authoring in Universal Editor. |

The `target` sidekick plugin entry to merge:
```json
{
  "id": "target",
  "title": "Target",
  "url": "https://experience.adobe.com/#/@acsmarketing/target/activities/activityLibrary",
  "passConfig": true,
  "environments": ["preview", "live", "edit"],
  "includePaths": ["**"]
}
```
> **Do NOT import** `workers/website/handlers/target.js` — edge-worker infra a standard boilerplate doesn't use.

## Step 2 — Wire target.js into scripts/scripts.js

*(Skip if already wired.)* Add the import:
```js
import { loadTarget, applyTargetHeroMboxIfConfigured } from './target.js';
```
Then inside `loadPage()`, after the lazy phase and before `loadDelayed()`:
```js
  await loadTarget();                       // ← add
  await applyTargetHeroMboxIfConfigured();  // ← add
```

## Step 3 — Enable Target in head.html

```html
<meta name="target" content="1"/>
<meta name="target-at-js" content="/deps/at/vendor-at.js"/>
```
To target a block (e.g. the hero) add an mbox meta + selector (they must match a real element):
```html
<meta name="target-mbox-hero" content="eds-hero-mbox"/>
<meta name="target-mbox-hero-selector" content=".hero.block .hero-inner"/>
```
> If the site sets a Content-Security-Policy, `script-src` must allow at.js (da-demo-kit ships a permissive CSP).

## Step 4 — Push and confirm at.js loads

Push, reload the preview, confirm `/deps/at/vendor-at.js` loads (fetch the URL, or DevTools → Network). If not:
re-check `head.html` has `target=1`, `scripts.js` was wired (Step 2), and code was pushed.

## Step 5 — Author a Target offer (optional but recommended)

Add a **target-offer** block in DA on the page where you want the personalized offer — an authorable slot Target can
populate.

## Step 6 — Create or view the Target activity

Uses the shared acsmarketing instance (no credentials once Step 0 is provisioned).
- **DA Target tool:** open the **Target** tool in the site's DA workspace → create an XT activity — pick the mbox
  (e.g. `eds-hero-mbox`), an offer, an audience.
- **Sidekick:** the **Target** plugin deep-links to
  `https://experience.adobe.com/#/@acsmarketing/target/activities/activityLibrary`.
> Point the activity's mbox at the same name set in `head.html` (Step 3).

## Step 7 — Verify the targeted experience

Reload the preview; the targeted content should render where the selector points. The activity's mbox must match the
`target-mbox-*` name; the selector must match a real element; a hard reload helps.

## Troubleshooting

- **Nothing personalizes / `vendor-at.js` not loading** → `head.html` missing `target=1`, `scripts.js` not wired,
  `deps/at/` not imported, or code not pushed.
- **`loadTarget is not a function`** → `target.js` not imported into `scripts.js`, or wrong path.
- **at.js loads but no swap** → mbox name or selector mismatch.
- **Activity library empty** → Step 0 access not provisioned yet — complete it and wait.
- **Sidekick has no Target button** → the `target` plugin entry wasn't merged into `tools/sidekick/config.json`.

## Integration Manifest — Adobe Target

Portable definition of the Target integration. Hand it to `merge-back-to-base-template`. Paths are
`source path → same dest path` unless noted.

```
integration: adobe-target

files:
  - scripts/target.js                    # reads target metas, loads at.js, page-load/hero-mbox logic
  - deps/at/at.js                        # at.js loader target.js imports
  - deps/at/vendor-at.js                 # at.js 2.11.8 from the acsmarketing instance (the Target embed)
  - blocks/target-offer/                 # authorable Target offer block (.js, .css, metadata.json)
  - tools/target/                        # DA tool: lists/creates Target activities via the shared runtime

merge:                                   # add an entry, do NOT overwrite
  - tools/sidekick/config.json           # add the `target` plugin entry to plugins[]
  - DA library sheet                     # add the target-offer block row (authorable in DA)

optional:
  - ue/models/blocks/target-offer.json   # only if authoring in Universal Editor

notes:
  - head.html                            # add target=1 and target-at-js=/deps/at/vendor-at.js metas
  - CSP                                  # script-src must allow at.js
  - access                               # requires Step 0 access to the shared acsmarketing Target instance

exclude:
  - workers/website/handlers/target.js   # edge-worker infra — do NOT copy
```

## Reference links

| Resource | Link |
|---|---|
| Create your EDS repo (base) | the `create-eds-repo` skill |
| Merge this into your base template | the `merge-back-to-base-template` skill |
| Target access provisioning (Step 0) | https://acrs.adobe.com/go/6bff542e-f709-499f-8156-57e0fc914510 |
| Source: da-demo-kit | https://github.com/ynaka-adobe/da-demo-kit |
| Target activity library (demo tenant) | https://experience.adobe.com/#/@acsmarketing/target/activities/activityLibrary |
