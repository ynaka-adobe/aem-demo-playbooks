---
name: sync-da-content
description: Sync Adobe Target credentials sheet from da-demo-kit source to a target DA repo in any org/site. Reads the shared clientID/secret sheet and populates it to the target. Use when an end user says "sync content from da-demo-kit", "copy the Target sheet", or "populate my repo with shared credentials".
---

# Sync Content from da-demo-kit to Your DA Repo

Automatically copy the Adobe Target credentials sheet (`.da/adobe-target`) from the canonical source (`ynaka-adobe/da-demo-kit`) to your target DA repo in any org/site.

## Prerequisites

Your target DA repo must already be connected to your Claude instance. If you haven't done this yet, run the `eds-readiness` playbook first to set up your environment.

## How to use this playbook

**The playbook is fully automated** — you just provide your target org and site name, and it handles the rest:

1. Ask for the target **org** (GitHub organization) and **site** (repository name)
2. Fetch the Adobe Target sheet from the source (`ynaka-adobe/da-demo-kit/.da/adobe-target`)
3. Write it to your target repo at `.da/adobe-target`
4. Confirm the sync completed

## Step 1 — Provide your target repo details

You'll be asked for:
- **Org:** your GitHub organization (e.g., `my-company-org`)
- **Site:** your DA site repository name (e.g., `my-demo-site`)

Example: org=`my-company-org`, site=`my-demo-site` syncs to `https://da.live/sheet#/my-company-org/my-demo-site/.da/adobe-target.json`

## What gets copied

The `.da/adobe-target.json` sheet containing:
- Adobe Target `clientId`
- Adobe Target `clientSecret`
- Adobe Target `tenant` (acsmarketing)

**These are shared by all end users** — no per-user customization needed.

## After sync

Once the sheet is in your repo, you can:
- Reference it in your demo site using the DA sheet API
- Use the credentials in Target integrations, personalizations, or experiences
- Link to it in your site's DA workspace

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Target repo not connected" | Run `eds-readiness` first to set up your DA connection |
| Sync says "access denied" | Confirm you have write access to the target DA repo |
| Sheet doesn't appear after sync | Refresh your DA workspace, or check the target org/site name was correct |
| Credentials sheet is empty | The source (`ynaka-adobe/da-demo-kit/.da/adobe-target.json`) may not have content yet |

## Next steps

- **Use the sheet in your site:** reference `.da/adobe-target` in your DA content or code
- **Sync other content:** contact your admin if you need to sync additional sheets or pages

## For admins: Adding more content to sync

To expand what this playbook syncs, edit this file and add more paths to Step 2. Example:
```
- Source: ynaka-adobe/da-demo-kit/.da/adobe-workfront.json
- Target: [your-org]/[your-site]/.da/adobe-workfront.json
```
