# MakerSite — context for Claude Code

This is the source for **betrumaker.com**. Read this before making changes.

## Location
- This repo lives at `~/Developer/MakerSite` (moved OUT of Dropbox in June 2026 so git is not in cloud sync).
- Do NOT look for it in Dropbox anymore. Old paths like `~/Library/CloudStorage/Dropbox/Claude-cowork/MakerSite` or `.../TRU/MakerSite` are dead.

## What's in here
- `Makersite/` — the actual website files (index.html, about.html, workshops.html, resources.html, style.css, Assets/, etc.).
- `mobile/` — mobile versions of the games.

## How it goes live (current setup)
- Hosting: **Cloudflare Pages**, connected to the GitHub repo.
- Domain/DNS: **Cloudflare** (betrumaker.com, betrumedia.com).
- **Publishing = push to GitHub.** Cloudflare Pages auto-builds and deploys whenever new commits land on the `master` branch. There is no separate deploy command.
- Cloudflare Pages build/output settings live in the Cloudflare dashboard, not in this repo.

## Git
- Remote: `https://github.com/TrumanCho18/MakerSite` (private), branch `master`.
- Collaborators who push: **TrumanCho18** (Truman) and **minheecho74** (Minhee).
- Standard flow: edit files → `git add` → `git commit` → `git push`. Cloudflare deploys automatically after the push.
- Auth uses the Mac keychain (via GitHub Desktop login). The remote URL has NO embedded token.

## NOT used anymore
- **Netlify is abandoned.** The `.netlify/` folder is leftover junk and can be ignored. Do not deploy to Netlify.

## Security rules (important)
- Never put API tokens, keys, or passwords into any file in this repo or any command. They must never be committed or synced.
- Old GitHub and Netlify tokens were found embedded in synced files and are being revoked. Use keychain/login-based auth only.
