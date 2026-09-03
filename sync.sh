#!/bin/sh
# One-shot release/sync for the aem-demo-playbooks plugin.
# Run this AFTER you commit an edit (the pre-commit hook already bumped the version):
#   push to GitHub -> refresh the marketplace -> update your local install.
# Then restart Claude Code to load the new skills.
set -e

MARKETPLACE="ynaka-adobe"
PLUGIN="aem-demo-playbooks"

echo "→ Pushing to GitHub…"
git push

echo "→ Refreshing marketplace ($MARKETPLACE)…"
claude plugin marketplace update "$MARKETPLACE"

echo "→ Updating local plugin…"
claude plugin update "$PLUGIN@$MARKETPLACE"

echo ""
echo "✅ Done. Installed version:"
claude plugin list 2>/dev/null | grep -A1 "$PLUGIN" || true
echo ""
echo "⚠️  Restart Claude Code to load the new skills (skills load at startup)."
