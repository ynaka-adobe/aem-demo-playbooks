---
name: eds-readiness
description: One-time environment setup before building AEM Edge Delivery (EDS) demos — checks git/Node/AEM CLI, guides creating a GitHub account, and confirms readiness, then recommends the next step. Use when someone says "get me set up", "readiness check", "set up my machine for EDS demos", "am I ready to build a demo", or is starting EDS demo work for the first time.
---

# EDS Demo Readiness

Guide an Adobe XSC product specialist — possibly non-technical — so their machine and accounts are ready to build
AEM Edge Delivery demos. This is **setup only**; building a demo is the `create-eds-repo` skill.

## How to run this

- **MANDATORY — ask with clickable dialogs.** You MUST call the AskUserQuestion tool for these and NEVER present a numbered/bulleted prose option list. Whenever you need input or a choice from the user, ask via a clickable
  AskUserQuestion dialog — use the free-text box for open answers (like a site name) and options for choices —
  instead of prose questions.
- Adapt to your environment: if you have terminal/file tools, run the version checks yourself and report ✅ / ❌.
  If you can't run commands, ask the user to run each and paste the output, then interpret it. Give the fix for
  anything missing.
- Go one section at a time and confirm before moving on. Keep language plain.
- The user creates their own GitHub account themselves — you guide, you don't do it for them. Never ask the user to
  paste passwords or tokens into chat.
- At the end, give a short ✅ readiness summary, then recommend the next skill based on intent (see step 4).

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

## 2. Confirm your personal GitHub account

Using Adobe GHEC is fine, but **demo repositories must be created under the user's personal GitHub account or
personal organization, not in Adobe GHEC**. **Commits must use the personal account**, not the managed GHEC account.

1. Ask whether the user already has a personal GitHub account. If not, guide them to https://github.com →
   **Sign up** and let them create it themselves.
2. Confirm the personal username and intended repository owner (the personal account or a personal organization).
   An email address alone does not distinguish a personal account from a managed account.

> **No org or special naming needed.** Demo repos go directly under the personal GitHub account. The old
> `<username>-adobe` org convention is gone: the AEM Code Sync **setup bot** now lets you add your admin account
> directly (its **Users** step, in the `create-eds-repo` skill), which is what the org name used to be a workaround
> for. A personal GitHub org is optional; if used, any name works, but it must not be an Adobe GHEC organization.

### Check the account, destination, and commit identity

- If GitHub CLI is available, use `gh auth status --hostname github.com` and
  `gh api --hostname github.com user --jq .login` to check the active account. Adobe managed usernames follow
  `<userid>_adobe`; flag that suffix as a managed-account signal, not as the personal account to use for demos.
  A username without the suffix is not proof of personal ownership; confirm the destination with the user.
- If the active account is managed, guide the user to select or authenticate their personal account for demo
  operations. They do not need to remove their GHEC login. Confirm before changing authentication settings, and
  recheck the active account afterward.
- In an existing demo checkout, inspect the remote host and owner with `git remote -v`. Do not replace an
  existing remote automatically. For a new demo, carry the confirmed personal owner into `create-eds-repo`;
  readiness does not create a repository.
- In the demo checkout, inspect `git var GIT_AUTHOR_IDENT` and `git var GIT_COMMITTER_IDENT`. Both must use an
  email associated with the personal GitHub account, including its personal-account noreply email if preferred.
  Ask the user to confirm attribution; a configured name or email alone does not verify account ownership.
  If corrections are needed, confirm first and use repository-local configuration, not global configuration.
- Git commit attribution and GitHub authentication are separate. Before creating a demo repository or pushing,
  also confirm that the relevant browser, CLI, or Git credentials use the personal account; a successful `gh`
  check alone does not verify the account used by Git's SSH key or credential helper.

If tools are unavailable or the user skips confirmation, mark the account/destination or commit identity
**not verified**, as applicable. Do not mark GitHub readiness complete or proceed to repository creation,
committing, or pushing until the personal destination and relevant personal-account identities are confirmed.
For a new repository, explicitly defer the repository-local remote and commit checks until its checkout exists,
before the first commit or push.

## 3. Connect the AEM DA content tools (recommended)

Connect the **AEM DA** MCP so the assistant can read and seed **Document Authoring** content directly — e.g. copy default
content into a new demo, or seed a blank site — without manual browser steps.

- Server: **AEM DA - Prod** → `https://mcp.adobeaemcloud.com/adobe/mcp/da`
- Authenticate it via your **claude.ai connector settings** (or `/mcp` in an interactive Claude Code terminal).
  In GitHub Copilot, use **Customize > Installed > the affected MCP server > Sign in** for a globally installed
  server, or **Settings > the project > Repository customizations > MCP servers > Sign in** for a repository-defined
  server. The assistant can't run the sign-in flow for the user — direct them to the settings for their host.
- When it shows **connected**, the `da_*` tools (list / copy / create content) become available.

Optional but recommended: without it, content seeding falls back to the browser (`da.live`).

### Verify service connectivity (read-only)

Do not treat a registered server, discoverable tools, or a "connected" label as proof that DA requests work.

1. Discover the DA tools through the host's tool discovery mechanism, if needed, and confirm that
   `da_list_sources` is available. If it is unavailable, report that connectivity is **not verified** and guide
   the user to configure the MCP in their host.
2. Use a DA organization and repository already supplied by the user. Otherwise, ask for a `da.live` URL or
   organization/repository using the host's structured question dialog. Do not infer DA names from GitHub names.
   Allow the user to skip; a skipped check is **not verified**, not a pass.
3. Call `da_list_sources` with that `org` and `repo`, omitting `path` to list the root. This check must not create,
   copy, update, publish, or delete content.
4. Report **verified** only after a successful response, including an empty listing. This confirms service
   connectivity and read access to that repository, not write access or access to every DA repository.

If the call fails, report the actual server name and failure reason without exposing credentials:
- **Authentication required or expired:** direct the user to sign in using the host-specific settings above,
  then retry after they confirm. Never request passwords or tokens in chat.
- **Access denied or repository not found:** check the supplied DA names and the user's access. Do not assume
  that reconnecting will fix repository permissions.
- **Timeout, disconnected server, or other service error:** report connectivity as **not verified** and suggest
  checking the service or MCP connection before retrying. Do not label it an authentication failure without evidence.

If the user skips the check or it remains unsuccessful, continue only with DA connectivity explicitly marked
**not verified**; the optional browser fallback remains available.

## 4. Readiness check & next step

Confirm and summarize as a ✅ checklist:
- git, Node, and the AEM CLI are installed.
- A personal GitHub account and personal-account/personal-organization destination are confirmed, outside Adobe GHEC.
- Personal-account authentication and commit attribution are confirmed for an existing demo checkout, or the
  checkout-specific checks are explicitly deferred until before the first commit or push in a new repository.
- *(Recommended)* the AEM DA MCP connectivity and repository read access are verified by a successful
  `da_list_sources` call; otherwise mark this item **not verified** and state whether it was skipped or failed.

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
