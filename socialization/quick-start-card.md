# XSC AI Demos — Quick Start

**Build an AEM demo with Claude. No coding required. Works in Claude Code *or* claude.ai chat.**

### 1. First time only — get set up
Open this, paste it into Claude, say *"set me up."*
→ https://claude.ai/claude-code/onboard/qO5HVlt1cLoM

### 2. Build a demo
Open this, paste it into Claude, say *"walk me through creating my EDS repo."*
→ https://claude.ai/claude-code/onboard/AOeIi7qtej8k

Claude then asks which way you're going:
- **Path A — Modernize a real site** (migrate an existing website)
- **Path B — Start from sample pages** (build on demo content)

…and hands you the exact next link.

---

### Prefer the plugin? (Claude Code)
Install once, then just *say what you want* — no links to paste.
```
claude plugin marketplace add ynaka-adobe/aem-demo-playbooks
claude plugin install aem-demo-playbooks@ynaka-adobe
```
Restart Claude Code, then say *"get me set up"* or *"start a new demo."*

**Keeping it current:** say *"update the demo playbooks"* (or run the line below), then **restart Claude Code**.
```
claude plugin marketplace update ynaka-adobe && claude plugin update aem-demo-playbooks@ynaka-adobe
```
> Not seeing a new feature? Run the update + restart — the plugin doesn't auto-update.

---

**That's it.** Claude gives you one step at a time, the exact prompts to paste, and checks each step worked.

*Stuck? Drop a note in the channel — and share your live demo URL when you're done.*
Full index of playbooks: `xsc-ai-playbooks/README.md`
