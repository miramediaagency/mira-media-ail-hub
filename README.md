# AIL Account Hub

A lightweight, branded client portal for AIL — tasks, optimization log, and reporting — hosted for free on GitHub Pages.

## How it works

- `index.html` / `styles.css` / `script.js` — the page itself. You shouldn't need to touch these day to day.
- `data/tasks.json` — open tasks (both "AIL to do" and "Mira to do")
- `data/optimizations.json` — running log of changes made across accounts
- `data/reporting.json` — monthly/quarterly report summaries

The page reads those three JSON files and renders them automatically. **To update the site, you only ever edit the JSON files** — no code changes needed.

## Publishing it (one-time setup)

1. Create a new GitHub repo (e.g. `mira-media/ail-hub`). Make it **private** if AIL's data shouldn't be public — GitHub Pages supports private repos with GitHub Pro/Team/Enterprise, or you can use a free-tier public repo with an unguessable name if that's acceptable for the sensitivity of this data.
2. Upload these files, keeping the folder structure intact (`data/` stays a subfolder).
3. In the repo, go to **Settings → Pages**, set **Source** to the `main` branch, root folder.
4. GitHub will publish it at `https://[org].github.io/[repo-name]/` within a minute or two.
5. Optional: add a custom domain (e.g. `hub.miramedia.ca`) under Settings → Pages if you want a branded URL instead of the github.io one.

## Updating content going forward

Go to the file in GitHub (e.g. `data/optimizations.json`), click the pencil icon to edit, add a new entry following the same shape as the ones already there, and commit. The live site updates within about a minute — no local setup, no pull requests required, though you can require review via PRs later if you want a second set of eyes before client-facing changes go live.

### Entry formats

**Task:**
```json
{
  "id": "unique-id",
  "title": "Short title",
  "description": "One or two sentences of context.",
  "owner": "AIL" or "Mira",
  "status": "Needs Client Input" | "In Progress" | "Complete",
  "due": "YYYY-MM-DD"
}
```

**Optimization:**
```json
{
  "id": "unique-id",
  "date": "YYYY-MM-DD",
  "channel": "Google Ads" | "Meta" | "LinkedIn" | etc.,
  "title": "Short title",
  "description": "What changed and why.",
  "impact": "Result or expected result — plain text"
}
```

**Report:**
```json
{
  "id": "unique-id",
  "period": "August 2026",
  "title": "Monthly Performance Report",
  "summary": "A few sentences of narrative.",
  "metrics": [{ "label": "Total Spend", "value": "$18,400" }],
  "link": "https://link-to-full-pdf-report (optional, leave empty string if none)"
}
```

## Notes

- All sample data currently in the JSON files is placeholder — swap it out for AIL's real data whenever you're ready.
- Status and channel filter buttons on the page are generated automatically from whatever values appear in the data, so you can introduce a new status or channel just by using it in an entry.
- No backend, database, or hosting cost — it's fully static and free on GitHub Pages.
