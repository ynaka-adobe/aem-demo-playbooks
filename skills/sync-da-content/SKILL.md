---
name: sync-da-content
description: Sync full DA config + credentials from da-demo-kit to target repos. Syncs all config sheets (data, library, apps, prepare) plus Adobe Target and Workfront credentials. Use when an end user says "sync content from da-demo-kit", "set up my repo config", or "populate my site with default config".
---

# Sync Content from da-demo-kit to Your DA Repo

Automatically populate your target DA repo with complete default configuration from `ynaka-adobe/da-demo-kit`, including all config sheets and integration credentials.

## What Gets Synced

**Full Configuration:**
- **data** — Tool configuration (Send to Adobe Target, Send to Marketo, Change Target Offer, Send for Approval)
- **library** — Blocks, Templates, Icons, Generate Variations, Adobe Target, Adobe Workfront, CMC Management Tool
- **apps** — Content Syndication, Site Creator, Demo App
- **prepare** — Preparation workflow configuration

**Credentials & Config:**
- `.da/adobe-target.json` — Adobe Target clientId, clientSecret, tenant
- `.da/adobe-workfront.json` — Adobe Workfront configuration
- `metadata.json` — Site metadata
- `.da/aem-permission-requests.json` — Permission request templates

## Prerequisites

Your target DA repo must already be connected to your Claude instance. If you haven't done this yet, run the `eds-readiness` playbook first to set up your environment.

## One-time setup: authorize config writes (per target org)

Config sheets are written with a **`PUT` to `admin.da.live/config`**, which needs an **IMS Bearer token**. A helix
Site Admin key does **not** work here — different auth realm (verified: it returns **401** on `admin.da.live`). So
each target org authorizes config writes once, using an **IMS Server-to-Server (S2S)** identity granted `write` in
the org's DA **`permissions`** sheet:

1. Create an **IMS S2S** credential in the Adobe Developer Console (one time, reused across orgs).
2. In the **target org's** `da.live/config` → **`permissions`** sheet, add **four rows** granting `write` to **both
   IMS orgs** the sync identity resolves through, then **Save**:

   | path | groups | actions | comments |
   |---|---|---|---|
   | `CONFIG` | `21BD487E5F2280130A495ECC` | `write` | ACS Customer Solutions Services Marketing (Yuji) |
   | `/ + **` | `21BD487E5F2280130A495ECC` | `write` | ACS Customer Solutions Services Marketing (Yuji) |
   | `CONFIG` | `EE9332B3547CC74E0A4C98A1` | `write` | Adobe Inc. |
   | `/ + **` | `EE9332B3547CC74E0A4C98A1` | `write` | Adobe Inc. |

   **Both** IMS orgs are required (ACS Marketing **and** Adobe Inc.) — one alone is not enough. `groups` holds **IMS
   org IDs**, not emails. This exact grant took the live test from **403 → 201**.

   ![DA config permissions — CONFIG + content write for both IMS orgs](assets/da-config-permissions.png)

3. The sync mints a token from the S2S credential and uses it as the Bearer for the config `PUT`.

**Full details (Console steps, token minting, verify step):** see `actions/PROVISIONING.md` in `da-demo-kit`.

> **Content, `.da/*.json`, and `docs/library` don't need this** — they're DA content sources the connector writes
> with your own session. Only the **config store** (data / library / apps / prepare) needs the S2S token.

## How to Use

**Two options:**

### Option 1: Full Config Sync (Recommended)
Syncs all default configuration in one call:
```
https://da-demo-kit.hlx.live/actions/sync-config?targetOrg=your-org&targetRepo=your-site
```

### Option 2: Individual Sheet Sync
Sync specific sheets as needed:
```
https://da-demo-kit.hlx.live/actions/sync-da-sheet?targetOrg=your-org&targetRepo=your-site&sheetPath=.da/adobe-target.json
```

## Web UI Alternative

Navigate to: `https://da-demo-kit.hlx.live/sync-content`

Fill in:
- **Organization** — your GitHub org
- **Repository** — your site name
- **What to Sync** — Full Config or Single Sheet

## After Sync

Your target repo will have:
- ✅ All config tabs ready in DA workspace
- ✅ Target and Workfront credentials configured
- ✅ Library sheets with blocks, templates, icons
- ✅ App integrations ready to use

View your config at: `https://da.live/config#/your-org/your-site/`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Access denied" | Confirm you have write access to the target DA repo |
| Config tabs not showing | Hard refresh (Cmd+Shift+R) the DA config page |
| Credentials sheet empty | Verify the source sheets exist in da-demo-kit |
| Action returns 401 (config PUT) | The config write needs an **IMS S2S** Bearer, and the target org's `permissions` sheet must grant that identity `write` on `CONFIG` — see "One-time setup" above. A helix Site Admin key won't work here. |

## Next Steps

- **View your config:** `https://da.live/config#/your-org/your-site/`
- **Use the credentials:** Reference sheets in your DA content or integrations
- **Customize:** Edit sheets in DA UI to customize for your needs

## API Reference

**Endpoint:** `https://admin.da.live/config/{org}/{repo}/`

**Method:** PUT

**Auth:** IMS Bearer token — from an S2S technical account granted `write` in the org's `permissions` sheet (see "One-time setup"). Not a helix Site Admin key.

**Payload:** Config JSON structure from source

See `SYNC_README.md` in da-demo-kit for complete API documentation.
