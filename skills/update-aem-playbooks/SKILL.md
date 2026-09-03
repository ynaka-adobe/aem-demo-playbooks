---
name: update-aem-playbooks
description: Update the aem-demo-playbooks plugin to the latest published version — refreshes the marketplace and updates the local install, then tells the user to restart. Use when someone says "update the demo playbooks", "update aem-demo-playbooks", "get the latest playbooks", "am I on the latest plugin", or reports that a new skill/feature isn't showing up.
---

# Update the AEM Demo Playbooks plugin

Bring this plugin up to the latest published version and tell the user to restart. Use when the user asks to update,
or reports that a new skill/feature isn't showing.

## Run these

Run both commands (safe — they refresh the catalog and update the install):
```bash
claude plugin marketplace update ynaka-adobe
claude plugin update aem-demo-playbooks@ynaka-adobe
```

Then check the installed version:
```bash
claude plugin list | grep -A1 aem-demo-playbooks
```

## Tell the user

- **If it updated** (version changed): "Updated to **vX.Y.Z**. **Restart Claude Code** to load the new skills —
  skills load at startup, so the restart is required."
- **If already latest** ("no update available" / same version): "You're already on the latest (**vX.Y.Z**) — nothing
  to do."

Always end by reminding them a **restart is required** for changes to take effect. You cannot restart Claude Code
for them.

## Notes

- This updates the **plugin only** — it does not touch any demo content, DA repos, or GitHub repos.
- If a command errors:
  - The plugin CLI needs an **interactive Claude Code session**.
  - If the marketplace isn't added yet: `claude plugin marketplace add ynaka-adobe/aem-demo-playbooks`, then retry.
