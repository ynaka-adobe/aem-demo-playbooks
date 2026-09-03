# Email / One-Pager

*Wider-org announcement. Swap `[recording link]`, `[channel link]`, and `[your name]` before sending.
Keep it short — the point is to get people to click one link.*

---

**Subject:** Build an AEM demo with AI — no coding, ~an afternoon

Team,

We now have a set of **paste-into-Claude playbooks** that walk you through building an AEM Edge Delivery demo
end to end — modernizing a customer's site, or building on sample pages — **with no coding experience required.**
You copy a short guide, paste it into Claude, and it hands you one step at a time, the exact prompts, and checks
each step worked.

**Works in Claude Code *or* claude.ai chat** — you don't need any special setup to start.

**Start here (this is all most people need):**

1. **First time?** One-time setup (GitHub + tools): https://claude.ai/claude-code/onboard/qO5HVlt1cLoM
2. **Build a demo:** https://claude.ai/claude-code/onboard/AOeIi7qtej8k
   → Claude asks whether you're modernizing a real site (**Path A**) or starting from sample pages (**Path B**) and
   routes you from there.

**Prefer to install once (Claude Code)?** Add the plugin and just say what you want — no links to paste:
```
claude plugin marketplace add ynaka-adobe/aem-demo-playbooks
claude plugin install aem-demo-playbooks@ynaka-adobe
```
Restart Claude Code, then say "get me set up" or "start a new demo." **To update later:** say "update the demo
playbooks" (or run `claude plugin marketplace update ynaka-adobe && claude plugin update aem-demo-playbooks@ynaka-adobe`),
then restart — the plugin doesn't auto-update.

**See it in action:** [recording link] (~20 min — watch a demo built start to finish).

**Questions / share your results:** [channel link] — post your live demo URL when you're done; we're collecting them.

For the curious, there's more under the hood — reusable base templates, adding integrations like Adobe Target, and
folding your customizations back in so every future demo inherits them. The full index is in the repo README, but
you don't need any of that to build your first demo.

Give it a try on a real opportunity this week and tell me how it goes.

[your name]

---

## The playbooks (for the README / appendix)

| # | Playbook | When you use it |
|---|---|---|
| 1 | Readiness | Once — machine + GitHub setup |
| 2 | Create Your Own Repo Template | Once (optional) — your reusable base template |
| 3 | Create Your EDS Repo (base) | Each demo — repo + site, then pick Path A or B |
| 4 | Modernize with aemcoder (Path A) | Migrate a real customer site |
| 5 | Add Adobe Target (Path B example) | Add an integration to a demo |
| 6 | Merge Back to Base Template | Reuse a customization on future demos |
