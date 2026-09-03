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
| Action returns 401 | Ensure auth token/session is valid |

## Next Steps

- **View your config:** `https://da.live/config#/your-org/your-site/`
- **Use the credentials:** Reference sheets in your DA content or integrations
- **Customize:** Edit sheets in DA UI to customize for your needs

## API Reference

**Endpoint:** `https://admin.da.live/config/{org}/{repo}/`

**Method:** PUT

**Auth:** Bearer token (DA/AEM session)

**Payload:** Config JSON structure from source

See `SYNC_README.md` in da-demo-kit for complete API documentation.
