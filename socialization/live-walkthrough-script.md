# Live Walkthrough — Run Sheet (~20 min, recordable)

**Goal:** show a skeptical, non-technical XSC that they can build a working AEM demo by pasting a guide into Claude.
**Prove three things:** (1) no coding, (2) works in the browser / chat, (3) it checks its own work.

**Before you hit record**
- Have a **GitHub `-adobe` org** ready and be logged in.
- Pick a **real, simple source site** for Path A (homepage that isn't IP-blocked).
- Open Claude (Claude Code *or* claude.ai chat — mention you can use either).
- Have the **Quick Start card** on screen to start.
- Optional: pre-run Readiness so you don't spend recording time installing tools.

---

## 0:00 — Hook (1 min)
- "By the end of this you'll have a live AEM demo URL, and I won't write a line of code."
- Show the Quick Start card. "Two links. That's the whole thing."

## 1:00 — Setup, briefly (2 min)
- Open the **Readiness** link, paste into Claude, say *"set me up."*
- Don't grind through it live — show that Claude checks tools + walks GitHub setup, then say "I've done this once already; you only do it once." Skip ahead.

## 3:00 — Create the base repo (5 min)
- Open **Create Your EDS Repo**, paste, say *"walk me through creating my EDS repo."*
- Show Claude: gathering the site name + org, creating the repo **from the template**, installing **AEM Code Sync**.
- **Land the key beat:** the **bot setup wizard** (`tools.aem.live/bot/setup`) — Code → Content (DA) → Users → Finish → *"Your site is ready"* with preview + live URLs. "That one wizard created the content repo, the site, and my admin access."
- Claude hits the **fork** and asks: Path A or Path B.

## 8:00 — Path A: modernize a real site (7 min)
- Choose Path A → Claude opens **Modernize with aemcoder**.
- Show the aemcoder chat. Paste the pre-filled prompt: `Migrate <site> to EDS`.
- **Show EMA asking a question back** — the scope checkboxes — and pick **Homepage only**. Narrate: *"one page first, always."*
- After it lands: `migrate header block`, then `migrate footer block`. Mention header takes iteration — show the **screenshot-the-source + describe-one-change** loop once.
- Fast-forward through design/tokens + nav (say "same pattern"). Don't wait on long runs — cut.

## 15:00 — See it live (2 min)
- Open the **preview URL** (`https://main--{repo}--{org}.aem.page/`). Show the migrated page rendering.
- "That's a real, shareable demo."

## 17:00 — What's beyond the first demo (2 min)
- One sentence each, no deep dive:
  - **Path B** — start from sample pages to build integrations (e.g. **Add Adobe Target**).
  - **Base template + Merge Back** — build a customization once, and every future demo inherits it.
- "You don't need any of that today — but it's there when you want to go faster."

## 19:00 — Call to action (1 min)
- "Try it on a real opportunity this week. Post your live URL in [channel]. Ping me if you get stuck."
- Show the Quick Start card again as the closing frame.

---

**Editing notes**
- Cut every long aemcoder run to a few seconds — nobody needs to watch a progress bar.
- Keep the **fork moment** and the **EMA scope question** in full — those are the "oh, it's guiding me" beats.
- Total watchable length after cuts: aim for 12–15 min even if the live run took longer.

**Links to have on screen**
- Readiness: https://claude.ai/claude-code/onboard/qO5HVlt1cLoM
- Create Your EDS Repo: https://claude.ai/claude-code/onboard/AOeIi7qtej8k
- Modernize with aemcoder: https://claude.ai/claude-code/onboard/MAGwJBquc7YJ
- Add Adobe Target: https://claude.ai/claude-code/onboard/CqpTPeWfx1YY
