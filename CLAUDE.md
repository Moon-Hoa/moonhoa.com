@AGENTS.md

# Branching convention

This repo is mid-rebuild (static site -> Next.js/Supabase/Vercel app, per
the Notion "Architecture & Phased Implementation Plan"). Until the rebuild
is stable:

- `main` is the live static site — do not target it.
- `newsite` is the integration branch. All rebuild work (every phase) PRs
  into `newsite`, not `main`.
- Once `newsite` is stable and ready to go live, it gets PR'd into `main`
  as the final cutover.

