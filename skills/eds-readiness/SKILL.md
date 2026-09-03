---
name: eds-readiness
description: One-time environment setup before building AEM Edge Delivery (EDS) demos — checks git/Node/AEM CLI, guides creating a GitHub account, and confirms readiness, then recommends the next step. Use when someone says "get me set up", "readiness check", "set up my machine for EDS demos", "am I ready to build a demo", or is starting EDS demo work for the first time.
---

# EDS Demo Readiness

Guide an Adobe XSC product specialist — possibly non-technical — so their machine and accounts are ready to build
AEM Edge Delivery demos. This is **setup only**; building a demo is the `create-eds-repo` skill.

## How to run this

- **Ask with clickable dialogs.** Whenever you need input or a choice from the user, ask via a clickable
  AskUserQuestion dialog — use the free-text box for open answers (like a site name) and options for choices —
  instead of prose questions.
- Adapt to your environment: if you have terminal/file tools, run the version checks yourself and report ✅ / ❌.
  If you can't run commands, ask the user to run each and paste the output, then interpret it. Give the fix for
  anything missing.
- Go one section at a time and confirm before moving on. Keep language plain.
- The user creates their own GitHub account themselves — you guide, you don't do it for them. Never ask the user to
  paste passwords or tokens into chat.
- At the end, give a short ✅ readiness summary, then recommend the next skill based on intent (see step 3).

## 1. Check local tools

Run these and report ✅ / ❌ for each:
```bash
git --version
node --version
aem --version
```
Install anything missing:
- **Node.js** (includes npm) — LTS from https://nodejs.org
- **git** — https://git-scm.com
- **AEM CLI**: `sudo npm install -g @adobe/aem-cli`

## 2. Create your GitHub account

1. Go to https://github.com → **Sign up**.
2. Create the account. Using the **Adobe email** is recommended for identity/attribution, but not required — GitHub
   emails a code to validate it.

> **No org or special naming needed.** Demo repos go directly under the personal GitHub account. The old
> `<username>-adobe` org convention is gone: the AEM Code Sync **setup bot** now lets you add your admin account
> directly (its **Users** step, in the `create-eds-repo` skill), which is what the org name used to be a workaround
> for. A GitHub org is optional; if used, any name works.

## 3. Readiness check & next step

Confirm and summarize as a ✅ checklist:
- git, Node, and the AEM CLI are installed.
- A GitHub account exists (Adobe email recommended, not required).

Then ask what the user wants to do next and recommend:
- **"I just want to build a demo"** (most people) → the **`create-eds-repo`** skill.
- **"I want my own reusable base template first"** → the **`create-base-template`** skill (one-time), then
  `create-eds-repo` for each demo.

> Rule of thumb: if unsure, go straight to `create-eds-repo` — you can always make a base template later.

## Reference links

| Resource | Link |
|---|---|
| GitHub | https://github.com |
| Node.js | https://nodejs.org |
| AEM CLI (npm) | `@adobe/aem-cli` |
