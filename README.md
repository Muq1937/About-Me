# About-Me: portfolio (v3, supanut.status)

My portfolio for full-stack, data and cloud roles, built as a live **status page**. Projects are "services" with real health checks, each data flow is an animated pipeline, the Huawei Cloud certificate is a compliance badge, and the timeline reads as release notes.

Plain HTML, CSS and JavaScript, with no framework and no build step, so GitHub Pages serves it as-is.

**Live (once Pages is enabled):** https://muq1937.github.io/About-Me/

## What's live and what's fixed

The overview console sends real requests from the visitor's browser when the page loads:

| Check | Endpoint | Used for |
|---|---|---|
| MaklomThai API | `GET https://thaigotracker-backend.vercel.app/api/meta` | round-trip time, total matches and players, last rebuild time. Pinged again every 30 s while the console is on screen (at most 40 times). |
| Thailand Changelog | `GET https://muq1937.github.io/ThaiChangelog/entries.json` | the latest patch note, the number of notes and when the feed was built |

Both endpoints are public and send `Access-Control-Allow-Origin: *`. If a request fails, the page says so and shows the snapshot in `fallback` instead. The next Changelog run is calculated from the workflow's cron (`17 */2 * * *`, UTC).

Two things are snapshots and need refreshing by hand:

- **The win-loop dial** (`analysis.loop`): taken from `GET /api/funfact/loop` on 3 Nov 2026. The API response is 260 KB and includes player names, so the page embeds only what the dial needs: one character per player for dan level, head-to-head and last-win year. No names.
- **Numbers written into the copy**, such as 576, 582 and 670.

## Editing content

Everything a visitor reads comes from **[`assets/js/content.js`](assets/js/content.js)** (`window.SITE`). Lines marked `TODO` are placeholders or guesses. Most of them also show a dashed `TODO` tag on the page, so they're easy to find.

| What | Key |
|---|---|
| Name, headline, email, links, time zone | `profile` (headline keywords use `{word\|area}`) |
| The three focus areas and their colours | `areas` (colours in `styles.css`: `--a-fs`, `--a-data`, `--a-cloud`) |
| Live check URLs and the cron schedule | `checks` |
| Numbers shown when a check fails | `fallback` |
| Count-up tiles under the hero | `telemetry` |
| Projects: cards and the detail sheet | `services` |
| Pipeline tabs, steps, config snippets | `pipelines` |
| The longest-loop story and dial data | `analysis` |
| The certificate | `certifications` |
| Tools by area | `stack` |
| Timeline | `changelog` |

### Services

```js
{
  id: 'maklomthai', name: 'MaklomThai', native: 'หมากล้อมไทย', kicker: 'Thai Go rankings',
  status: 'operational',            // or 'archived'
  host, platform, since, role,
  areas: ['fs', 'data', 'cloud'],
  tagline, summary: [], built: [], stack: [],
  metrics: [{ value: 16108, label: 'match results', live: 'mt.totalMatches' }], // prefix/suffix optional
  links: { live, repo, repoLabel, repoNote, feeds: [{ label, url }] },
  shots: [{ src: 'assets/img/projects/maklomthai-rankings-{theme}.webp', alt, caption }],
  cover: 'forecast',                // generated art when there are no shots
  pipelines: ['maklomthai', 'winloop'],
  confirm: ['since', 'role'],       // fields shown with a TODO tag
}
```

`{theme}` in a screenshot path is replaced with `light` or `dark`, so each project needs both files. `live` names a value the checks refresh: `mt.totalMatches`, `mt.totalPlayers` or `tc.count`.

### Pipelines

Each tab is one linear flow. A step has `label`, `sub`, `kind` (sets the colour: `trigger`, `source`, `filter`, `model`, `check`, `git`, `deploy`, `api`, `store`, `job`, `app`, `human`, `transform`), `icon`, `text` and `code`. Optional fields:

- `drop`: the share of the animated dots that stop at that step;
- `paint`: the colour dots turn after it;
- `live`: a fresh value for the inspector (`nextRun`, `feed`, `mtPing` or `mtBuilt`);
- `mine: true`: marks my part of a team project.

The dots and their counts are an illustration, and the page says so.

## Images

- `assets/img/projects/*.webp`: 1200×750 screenshots of the live sites, in light and dark.
- `assets/img/certs/huawei-hccda.webp` and `-thumb.webp`: the certificate. Its number is also shown as the credential ID, from `certifications[0].number`. Set that to `''` to hide it.
- `assets/img/og.png`: the 1200×630 link preview. Regenerate it if the headline changes.

## Résumé

The résumé is deliberately not on this site, because it includes a phone number. It lives outside the repo and points here instead, with a link and a QR code.

## Previewing locally

```bash
python -m http.server 8000 --bind 127.0.0.1   # then open http://127.0.0.1:8000
```

Opening `index.html` directly also works. The live checks still run, because both endpoints allow any origin.

## Deploying to GitHub Pages

1. Merge to `main` and push.
2. On GitHub, go to **Settings → Pages**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`.
3. The site appears at `https://muq1937.github.io/About-Me/`, and each push redeploys it.

## What's inside

- The overview console: live checks, a sparkline of response times, today's 12 scheduled runs and an event log.
- Services with theme-matched screenshots, a highlight filter by area, and a detail sheet for each project.
- Animated pipelines: the path draws in, and dots flow, drop out at filters and change colour at model steps. Click a step to inspect it.
- A canvas dial of the 576-player loop of wins. Hover over it, or focus it and use the arrow keys, to walk the loop step by step.
- A certificate badge with a 36-month validity bar, plus release notes with TODO markers.
- A command palette (press `/` or `Ctrl K`) and a light/dark switch with a circle reveal, remembered per browser.
- Full `prefers-reduced-motion` support: no moving dots, no count-ups, and the dial shows its final state.

```
index.html
assets/
  css/styles.css   tokens (light-dark()), components, layouts
  js/content.js    ← all content
  js/main.js       rendering, live checks, pipelines, dial, dialogs
  img/             favicon, og.png, project screenshots, certificate
.nojekyll          tells GitHub Pages to serve files as-is
```
