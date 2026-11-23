/* =====================================================================
   SITE CONTENT: the one file to edit when something changes.
   ---------------------------------------------------------------------
   Every word, number and link on the page renders from window.SITE.
   Lines marked TODO are placeholders or guesses waiting for you.
   On the page, TODO items show a small dashed "TODO" tag so they are
   easy to spot. Empty strings ('') hide a link or show a placeholder.

   Live data: the overview console asks two public endpoints for fresh
   numbers when the page loads (see `checks`). If a request fails, the
   numbers written here are shown instead, so keep them roughly current.
   ===================================================================== */
window.SITE = {
  profile: {
    name: 'Supanut Udompataikul',
    short: 'Supanut',
    initials: 'SU',
    handle: 'Muq1937',
    host: 'supanut.status',
    role: 'Full-stack, data and cloud developer',
    // {word|area} highlights a word in the headline in that area's colour.
    headline: 'I build {full-stack|fs} products and the {data|data} pipelines behind them, and run them in the {cloud|cloud}.',
    lead: 'This portfolio is a status page for the things I’ve built and still run. The checks are real: your browser is asking my services how they are, right now.',
    status: 'Computer Engineering student at Chulalongkorn · open to internships, co-op and part-time roles',
    location: 'Bangkok, Thailand',
    timezone: 'Asia/Bangkok',
    tzLabel: 'UTC+7',
    email: 'muqkung@gmail.com',
    links: {
      github: 'https://github.com/Muq1937',
      linkedin: 'https://www.linkedin.com/in/supanut-udompataikul-320557341/',
      // The résumé is kept off this site on purpose (it has a phone number). It links here instead.
    },
  },

  // The three focus areas. Colours live in styles.css (--a-fs, --a-data, --a-cloud).
  areas: [
    { id: 'fs', label: 'Full-stack' },
    { id: 'data', label: 'Data' },
    { id: 'cloud', label: 'Cloud' },
  ],

  /* -------------------------------------------------------------------
     LIVE CHECKS: run from the visitor's browser by the overview console.
     Both endpoints are public and send Access-Control-Allow-Origin: *.
     ------------------------------------------------------------------- */
  checks: {
    maklomthai: {
      label: 'MaklomThai API',
      path: 'GET /api/meta',
      url: 'https://thaigotracker-backend.vercel.app/api/meta',
      every: 30, // seconds between pings while the console is on screen
    },
    changelog: {
      label: 'Thailand Changelog',
      path: 'GET /entries.json',
      url: 'https://muq1937.github.io/ThaiChangelog/entries.json',
      // news-check.yml runs on cron "17 */2 * * *" (UTC)
      cron: { minute: 17, everyHours: 2 },
    },
  },

  // Shown when a live request fails. Snapshot taken 22 Nov 2026.
  fallback: {
    maklomthai: { totalMatches: 16582, totalPlayers: 1186, latestMatchDate: '2026-11-15', builtAt: '2026-11-21T14:44:24Z' },
    changelog: {
      "generated": "2026-11-21T12:47:35.338Z",
      "count": 36,
      "entries": [
        { "tag": "nerf", "date": "2026-11-21", "time": "19:46", "title": "Prachim Ratthaya Expressway toll nerfed: Up to 185 baht", "source": "Khaosod", "url": "https://www.khaosod.co.th/economics/news_10480028" },
        { "tag": "buff", "date": "2026-11-20", "time": "10:28", "title": "Chiang Mai EV tram launched: Bus route 5 returns after 20 years", "source": "Khaosod", "url": "https://www.khaosod.co.th/economics/news_10478411" },
        { "tag": "news", "date": "2026-11-19", "time": "07:30", "title": "Song Wat Road buffed: Named world's coolest street for 2026", "source": "Thaiger", "url": "https://thethaiger.com/news/bangkok/bangkok-song-wat-road-worlds-coolest-street-2026" }
      ]
    },
  },

  // Count-up tiles under the hero. `live` names a value the checks refresh.
  telemetry: [
    { id: 'matches', value: 16582, label: 'match results tracked', source: 'MaklomThai', live: 'mt.totalMatches' },
    { id: 'players', value: 1186, label: 'Go players ranked', source: 'MaklomThai', live: 'mt.totalPlayers' },
    { id: 'loop', value: 577, of: 583, label: 'players in one loop of wins', source: 'Proven longest' },
    { id: 'runs', value: 12, label: 'pipeline runs a day', source: 'Thailand Changelog' },
  ],

  /* -------------------------------------------------------------------
     SERVICES: the projects. status: 'operational' | 'accepted' (a paper) | 'archived'
     Screenshots use {theme}, swapped for 'light' or 'dark' to match the page.
     Optional: when (replaces "since …"), statusNote, facts (extra spec rows),
     cover + coverCaption (generated art when there are no screenshots).
     ------------------------------------------------------------------- */
  services: [
    {
      id: 'maklomthai',
      name: 'MaklomThai',
      native: 'หมากล้อมไทย',
      kicker: 'Go in Thailand',
      status: 'operational',
      host: 'maklomthai.vercel.app',
      platform: 'Vercel · Fly.io · Oracle Cloud',
      since: 'Feb 2026',
      role: 'Solo developer. Friends helped collect some of the data.',
      areas: ['fs', 'data', 'cloud'],
      tagline: 'A home for Go (หมากล้อม) in Thailand: rankings and match history for every dan-level player, lessons for beginners, and an app for running tournaments.',
      summary: [
        'MaklomThai began as Thai Go Tracker, which turns the Thai dan registry, a stack of yearly spreadsheets going back to 2020, into rankings by GAT points, player profiles, head-to-head records and fun facts. It is now a home for Go in Thailand, with a blog and beginner lessons, in Thai and English.',
        'It runs across several clouds: the site and its Express API on Vercel, the data in MongoDB Atlas, a separate tournament app on Fly.io, board photos in Cloudflare R2, and a scorer on an Oracle Cloud VM, with Fly.io as its fallback.',
        'Rating updates now publish themselves. When the official sheet changes, the backend plans the update, publishes it unless a person needs to look, and tells players on LINE.',
        'I’m a 3-dan player myself and play in the tournaments it ranks, so its users are my own community.',
      ],
      built: [
        'A Next.js 15 frontend (App Router, React 18, TypeScript, Tailwind v4) with a bilingual Thai/English UI, a light/dark design system, a blog, and beginner lessons with step-through SGF boards and practice problems.',
        'An Express and MongoDB API on Vercel. Each write rebuilds hashed, precomputed read models and fires a webhook that refreshes only the pages that changed, so public pages stay static and never wait for the database.',
        'Self-publishing rating updates: an Apps Script watches the official sheet every 5 minutes, the backend publishes the change unless it needs a person (who approves it on Discord), then broadcasts it through a LINE Official Account.',
        'A LINE bot for players: send a dan ID or a name and get the player’s card with rank and GAT points, or the top 10.',
        'MaklomThai Tournaments, a separate Next.js app with its own database, on Fly.io in Singapore: registration, Swiss and knockout pairings, live results for phones, result entry for referees with Google or LINE sign-in, MacMahon import and export, and results sent to the rankings once an admin approves them.',
        'A board-photo scorer: a referee photographs a finished board, the photo goes to Cloudflare R2, and my go_image_to_score package with KataGo counts it. It runs on an Oracle Cloud VM (Podman, Caddy HTTPS, systemd) and falls back to a private Fly.io app that runs only while photos come in.',
        'Guard rails: CI on the frontend and backend with a contract test between them, a production smoke test every 3 hours that opens an issue when it fails, and nightly encrypted backups of both databases.',
        'A nightly GitHub Action that finds the longest loop of wins with OR-Tools CP-SAT and stores it through the API.',
      ],
      stack: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'Express', 'MongoDB Atlas', 'Mongoose', 'Vercel', 'Fly.io', 'Oracle Cloud', 'Docker · Podman', 'Cloudflare R2', 'KataGo', 'LINE Messaging API', 'Discord bot', 'Apps Script', 'GitHub Actions', 'OR-Tools'],
      metrics: [
        { value: 16582, label: 'match results', live: 'mt.totalMatches' },
        { value: 1186, label: 'players ranked', live: 'mt.totalPlayers' },
        { value: 577, label: 'player loop of wins' },
      ],
      links: { live: 'https://maklomthai.vercel.app', repo: '', repoNote: 'Code is private' },
      shots: [
        { src: 'assets/img/projects/maklomthai-home-{theme}.webp', alt: 'MaklomThai home page: Thai Go Tracker, fun facts and Learn Go cards above the top 10 and the latest articles', caption: 'Home' },
        { src: 'assets/img/projects/maklomthai-rankings-{theme}.webp', alt: 'Thai Go Tracker rankings: every dan-level player ranked by GAT points', caption: 'Rankings' },
        { src: 'assets/img/projects/maklomthai-learn-{theme}.webp', alt: 'Learn Go: the beginner lessons, from the rules to counting the score', caption: 'Lessons' },
      ],
      pipelines: ['maklomthai', 'scorer', 'winloop'],
    },
    {
      id: 'thai-changelog',
      name: 'Thailand Changelog',
      kicker: 'Scheduled news pipeline',
      status: 'operational',
      host: 'muq1937.github.io/ThaiChangelog',
      platform: 'GitHub Actions + Pages',
      since: 'Oct 2026',
      role: 'Solo project',
      areas: ['data', 'cloud'],
      tagline: 'Real news from Thailand, rewritten as video-game patch notes in Thai and English. Checked every two hours.',
      summary: [
        'A scheduled pipeline that reads Thai news, keeps only the stories people are really talking about, and publishes them as bilingual patch notes: BUFF, NERF, REBALANCE, EVENT and more.',
        'It runs entirely on GitHub. Actions does the work twelve times a day, the Actions cache remembers what was already judged, and Pages serves the site and two RSS feeds.',
      ],
      built: [
        'An ETL job in Node.js: 10 RSS feeds from five publishers plus Google Trends for Thailand, filtered by age, a seen-links cache and a Thai and English keyword blocklist before any model call.',
        'Scoring with Gemini in batches of 60 headlines for public attention (1–10). Every story scoring 8 or more is written up in English and Thai.',
        'Safety rules enforced in code, not only in the prompt: each reply is validated for score, tab, tags, lengths, language and the blocklist again.',
        'Free-tier quota engineering: a run at :17 every two hours, usually one request each, inside the limit of 20 requests per model per day, with a fallback list of models.',
        'A review mode that opens a pull request for a person to merge, or an auto mode that commits straight to main. A build step renders the site, entries.json and both feeds.',
      ],
      stack: ['Node.js 22', 'JavaScript', 'GitHub Actions', 'Actions cache', 'GitHub Pages', 'Gemini API', 'RSS', 'Google Trends'],
      metrics: [
        { value: 12, label: 'runs a day' },
        { value: 22, label: 'patch notes so far', live: 'tc.count' },
        { value: 2, label: 'languages' },
      ],
      links: {
        live: 'https://muq1937.github.io/ThaiChangelog/',
        repo: 'https://github.com/Muq1937/ThaiChangelog',
        feeds: [
          { label: 'RSS (English)', url: 'https://muq1937.github.io/ThaiChangelog/feed.xml' },
          { label: 'RSS (Thai)', url: 'https://muq1937.github.io/ThaiChangelog/feed-th.xml' },
        ],
      },
      shots: [
        { src: 'assets/img/projects/thai-changelog-{theme}.webp', alt: 'Thailand Changelog: the latest day of news written as patch notes, with BUFF and NERF filters', caption: 'Changelog' },
        { src: 'assets/img/projects/thai-changelog-feed-{theme}.webp', alt: 'Thailand Changelog: patch notes grouped by date, each linking to its source', caption: 'Feed' },
      ],
      pipelines: ['thai-changelog'],
    },
    {
      id: 'water-level',
      name: 'CCTV Water-Level Reader',
      kicker: 'First-author research paper',
      status: 'presented',
      statusNote: 'Presented at APSIPA ASC 2026, Bangkok, 9–12 Nov 2026',
      venue: 'APSIPA ASC 2026',
      host: 'APSIPA ASC 2026',
      platform: 'Python',
      when: 'presented Nov 2026', // shown instead of "since"
      role: 'First author',
      areas: ['data'],
      tagline: 'Reads river levels from the staff gauges that Thailand’s flood-monitoring cameras already film. Tested on five CCTV cameras in Phayao and Nan.',
      summary: [
        'Flood monitoring in Thailand still relies on people reading staff gauges off CCTV screens. This system reads them automatically: a YOLOv8n detector finds the gauge, its meter plate and the waterline, EfficientNet-B0 reads the plate’s digit, and the centimetres come from the gauge’s own markings instead of a learned scale.',
        'It ran on five cameras from 19 June to 7 July 2026 and was tested one camera at a time, each time with models that had never seen that camera. Daytime readings were within 5.7 cm of a human reader on average, with 91% within 10 cm, and unseen cameras did as well as familiar ones (6.11 vs 6.01 cm).',
        'I presented it at the 18th APSIPA Annual Summit and Conference in Bangkok in November 2026. The paper also reports where it fails. Most infrared night frames get no reading at all, and one camera was aimed so that the meter plate was cut off in 94% of frames. Both problems were hidden by the curated test set and only showed up in the full stream.',
      ],
      built: [
        'A CCTV-to-water-level pipeline: YOLOv8n detects the gauge, the meter plate and the waterline, EfficientNet-B0 reads the meter digit (262 of 265 test crops right), and geometry gives the level.',
        'OCR-free scale recovery that cross-checks the 2 cm strips against the 10 cm marks. Fusing the two cut the error from 5.88 to 5.31 cm and raised readings within 10 cm from 90.8% to 94.9%.',
        'Perspective correction for poles that lean away from the camera, and physical rules that reject impossible waterlines. Without the rules, the worst error on the annotated set rose from 42.8 to 149.1 cm.',
        'A screen-capture adapter for cameras with no API or video stream. Frames go to cloud storage, and every reading is logged to a cloud database with its camera, time and image.',
        'Fast enough for cheap hardware: 75 ms a frame on a desktop CPU, using the smallest YOLOv8 and EfficientNet models.',
      ],
      stack: ['Python', 'Ultralytics YOLOv8n', 'EfficientNet-B0', 'OpenCV'],
      metrics: [
        { value: 5.7, dec: 1, suffix: ' cm', label: 'mean daytime error' },
        { value: 91, suffix: '%', label: 'within 10 cm by day' },
        { value: 75, suffix: ' ms', label: 'per frame on a CPU' },
      ],
      links: {
        live: '',
        repo: '',
        paper: 'https://drive.google.com/file/d/1iRISnQQyFtKl8I54WmXM5fZR7zR3NlCO/view',
        certificate: 'apsipa', // opens the certificate of presentation
      },
      facts: [
        ['Paper', '“CCTV Water-Level Reading from Staff Gauges via Object Detection and Geometric Scale Fusion”'],
        ['Authors', 'Supanut Udompataikul, Sukhum Sattaratnamai, Winai Kaewlamun, Thanarat H. Chalidabhongse'],
        ['Field test', '19 Jun – 7 Jul 2026 · 5 cameras in Phayao and Nan'],
      ],
      cover: 'gauge', // no screenshots, so the card shows generated art
      coverCaption: 'Illustration of what the reader looks for in each frame: the staff gauge, its meter plate and the waterline.',
      pipelines: ['water-level'],
    },
  ],

  /* -------------------------------------------------------------------
     PIPELINES: one linear flow per tab.
     kind sets the colour: trigger, source, filter, model, check, git,
     deploy, api, store, job, app, human, transform.
     drop: share of the animated dots that stop at this step (illustration only).
     paint: dots change to this colour after the step ('ok', 'data', 'fs', 'cloud').
     live: a fresh value shown in the inspector ('nextRun', 'feed', 'mtPing', 'mtBuilt').
     mine: true marks your part of a team project.
     area: the colour of the pipeline's tab ('fs', 'data' or 'cloud').
     ------------------------------------------------------------------- */
  pipelines: [
    {
      id: 'thai-changelog',
      service: 'thai-changelog',
      area: 'cloud',
      title: 'Thailand Changelog',
      file: '.github/workflows/news-check.yml',
      schedule: 'every 2 hours',
      summary: 'Twelve runs a day. Most publish nothing, which is the point: only stories with real public attention get through.',
      nodes: [
        { label: 'Schedule', sub: 'every 2h at :17', kind: 'trigger', icon: 'clock', live: 'nextRun',
          text: 'GitHub Actions starts a run every two hours, at 17 minutes past because GitHub delays runs scheduled on the hour. Twelve runs a day keep within Gemini’s free tier of 20 requests per model per day, with room for retries.',
          code: 'on:\n  schedule:\n    - cron: "17 */2 * * *"' },
        { label: 'Ingest', sub: '10 feeds + Trends', kind: 'source', icon: 'rss',
          text: 'Reads 10 RSS feeds from five publishers (Thaiger, Khaosod English, Khaosod, Matichon and Sanook) plus Google Trends for Thailand: what people are searching for right now, with linked articles.',
          code: 'FEEDS        // 10 feeds, 5 publishers\nTRENDS_URL   // trending/rss?geo=TH' },
        { label: 'Filter', sub: 'seen · 36h · blocklist', kind: 'filter', icon: 'filter', drop: 0.45,
          text: 'Drops links already judged (remembered for 21 days in the Actions cache, not in git), stories older than 36 hours, and every hard-no topic on a Thai and English keyword blocklist, all before the model sees anything.',
          code: 'maxAgeHours: 36,\nseenDays: 21,' },
        { label: 'Score', sub: 'Gemini · batches of 60', kind: 'model', icon: 'gauge', drop: 0.8, paint: 'ok',
          text: 'New headlines go to Gemini in batches of 60, with trending searches and nearby headlines as context. It scores public attention from 1 to 10: is it trending, widely covered, the kind of thing people forward?',
          code: 'batchSize: 60,\ncontextHours: 48,' },
        { label: 'Write', sub: 'EN + TH patch notes', kind: 'model', icon: 'pen',
          text: 'Every story scoring 8 or more becomes a patch note in English and Thai, with a tab and a tag such as BUFF, NERF or REBALANCE. There’s no cap.',
          code: 'minAttention: 8,' },
        { label: 'Validate', sub: 'rules in code', kind: 'check', icon: 'shield',
          text: 'Code checks every reply: the score, tab, tags, lengths and language, and the blocklist again. Each story is saved as its own JSON file.',
          code: 'data/entries/2026-11-05-0645-1.json' },
        { label: 'Publish', sub: 'review PR or commit', kind: 'git', icon: 'git',
          text: 'In review mode the run opens a pull request and a person merges it. In auto mode it commits straight to main.',
          code: 'PUBLISH_MODE=review   # or auto' },
        { label: 'Deploy', sub: 'site · JSON · RSS', kind: 'deploy', icon: 'globe', live: 'feed',
          text: 'build.mjs renders the static site, entries.json and the English and Thai RSS feeds, then deploy.yml publishes them to GitHub Pages.',
          code: 'site/index.html\nentries.json\nfeed.xml  feed-th.xml' },
      ],
    },
    {
      id: 'maklomthai',
      service: 'maklomthai',
      area: 'fs',
      title: 'MaklomThai',
      file: 'Backend/src · MaklomThai/app',
      schedule: 'sheet checked every 5 min',
      summary: 'Rating updates publish themselves unless a person needs to look, and each write does its heavy lifting once, so every read stays fast.',
      nodes: [
        { label: 'Rating sheet', sub: 'official GAT sheet', kind: 'source', icon: 'sheet',
          text: 'The association’s rating sheet records GAT points, one workbook per year since 2020. We don’t own it, so nothing is written into it.',
          code: 'รวม tab: one column per GAT update\none tab per update, with its tournaments' },
        { label: 'Sheet watcher', sub: 'Apps Script · every 5 min', kind: 'trigger', icon: 'clock',
          text: 'A standalone Apps Script checks the public sheet every 5 minutes, downloading only the header row and the newest columns (about 70 KB). When they change and then hold still for one check, it calls the backend. A nightly run plans the same way as a backstop.',
          code: 'POST /api/gat/sheet-updated\nx-gat-webhook-secret: …' },
        { label: 'Plan', sub: 'publish or ask', kind: 'check', icon: 'shield',
          text: 'The backend reads the sheet and plans the update as a proposal. It publishes it by itself unless a person is needed: a date with no matching tab, a tournament nobody has confirmed, or a change over the safety brake. Admin switches turn each automatic step off.',
          code: 'GatProposal { ops, summary }\napproved by: "Automatic (sheet update)"' },
        { label: 'Discord review', sub: 'approve · reject · revert', kind: 'human', icon: 'check',
          text: 'Anything that needs a person waits in Discord with Approve, Reject and Revert buttons. Every press is signature-checked, and a change over the safety brake needs a second confirmation.',
          code: 'POST /api/discord/interactions\n// Ed25519-signed, answered within 3 s' },
        { label: 'Express API', sub: 'Vercel serverless', kind: 'api', icon: 'server', live: 'mtPing',
          text: 'An Express and Mongoose API, deployed on Vercel as a single function. CI runs its tests and a contract test that every field the live frontend reads is still there.',
          code: 'api/index.ts → src/app.ts' },
        { label: 'MongoDB Atlas', sub: 'players · matches · GAT', kind: 'store', icon: 'database',
          text: 'Players, matches, tournaments and GAT history live in MongoDB Atlas. A GitHub Action backs up both databases every night, encrypted, and keeps 14 days.',
          code: 'backups.yml: nightly, AES-256, 14 days' },
        { label: 'Snapshots', sub: 'precomputed reads', kind: 'job', icon: 'layers', live: 'mtBuilt',
          text: 'Public reads never aggregate on request. After every write the backend rebuilds every read model in one pass. Each document carries a hash, so only what changed is written, and an atomic counter stops a slow rebuild from overwriting a newer one.',
          code: 'snapshots: players · player:<id>\n           funfact · winloop · meta' },
        { label: 'Vercel CDN', sub: 'refresh changed pages', kind: 'deploy', icon: 'globe',
          text: 'Changed snapshot keys fire a webhook, and Next.js refreshes only the pages behind them. Everything else stays prerendered on Vercel’s edge network.',
          code: "revalidateTag('player:<id>')" },
        { label: 'LINE', sub: 'one message to players', kind: 'app', icon: 'mail',
          text: 'Every friend of the MaklomThai LINE Official Account gets one message per update: its dates and tournaments, how many players changed and were promoted, and a link to the rankings.',
          code: 'src/line/gatNotify.ts  // one broadcast' },
      ],
    },
    {
      id: 'scorer',
      service: 'maklomthai',
      area: 'cloud',
      title: 'Board-photo scorer',
      file: 'scorer/ · Oracle Cloud + Fly.io',
      schedule: 'when a referee takes a photo',
      summary: 'A referee photographs a finished board and gets a count to check their own against. The free Oracle Cloud VM answers first, and Fly.io takes over when it can’t.',
      nodes: [
        { label: 'Photo', sub: 'referee’s phone', kind: 'source', icon: 'window',
          text: 'On the tournament app’s referee page, under a game’s result buttons, a referee takes or uploads a photo of the finished board. The phone shrinks it to 1,600 px and drops its EXIF data first.',
          code: '1600 px JPEG · no EXIF' },
        { label: 'Cloudflare R2', sub: 'signed upload', kind: 'store', icon: 'upload',
          text: 'The photo goes straight from the phone to a private Cloudflare R2 bucket through a 5-minute signed link, so it never passes through the app. R2 deletes photos after 90 days.',
          code: 'PUT photos/…  (5-minute signed URL)\nlifecycle: delete after 90 days' },
        { label: 'Tournament app', sub: 'Next.js on Fly.io', kind: 'api', icon: 'server',
          text: 'The tournament app, one small Fly.io machine in Singapore with its own MongoDB Atlas database, gives the scorer a 10-minute signed link to the photo.',
          code: 'SCORER_FIRST_URL, then SCORER_URL' },
        { label: 'Oracle Cloud VM', sub: 'asked first · free', kind: 'deploy', icon: 'cpu',
          text: 'An always-on Oracle Cloud VM runs the scorer in Podman behind Caddy for HTTPS, as systemd services that start with the VM. It is asked first because it costs nothing.',
          code: 'podman · caddy (HTTPS) · systemd' },
        { label: 'Fly.io fallback', sub: 'private, on demand', kind: 'deploy', icon: 'layers',
          text: 'When the VM is down, busy (a photo would wait over 20 s) or fails, the app asks a private Fly.io scorer with no public address. It starts on demand and stops 2 minutes after the last photo: about $3 for a 256-player event day.',
          code: 'private flycast address\nstops 2 min after the last photo' },
        { label: 'Count', sub: 'go_image_to_score + KataGo', kind: 'model', icon: 'gauge', paint: 'data',
          text: 'My go_image_to_score package reads the stones from the photo, and KataGo counts the position: Chinese area scoring, komi 7.5. About 2.4 s to read and 2.5 s to score on 4 CPUs.',
          code: 'area scoring · komi 7.5\n~2.4 s read + 2.5 s score' },
        { label: 'Cross-check', sub: 'beside the result', kind: 'check', icon: 'check',
          text: 'The count appears next to the result buttons so the referee can check their own. It never sets a result. The app keeps the reading, about 2 KB a photo.',
          code: 'MongoDB: score + reading (~2 KB)' },
      ],
    },
    {
      id: 'winloop',
      service: 'maklomthai',
      area: 'data',
      title: 'Win-loop solver',
      file: '.github/workflows/win-loop.yml',
      schedule: 'nightly',
      summary: 'An NP-hard question, answered and proven every night.',
      nodes: [
        { label: 'Nightly', sub: 'GitHub Action', kind: 'trigger', icon: 'clock',
          text: 'A GitHub Action runs the solver every night on the backend’s main branch.',
          code: '.github/workflows/win-loop.yml' },
        { label: 'Read', sub: 'public API only', kind: 'source', icon: 'download',
          text: 'It reads every match and player through the public API, so it never touches the database directly.',
          code: 'GET /api/matches\nGET /api/players' },
        { label: 'Graph', sub: 'who beat whom', kind: 'transform', icon: 'graph', drop: 0.13,
          text: 'Every winner→loser pair becomes an arrow. A loop can only use players who can all reach each other through wins (a strongly connected component), so the search keeps the largest one: 583 players. The same graph loads into Neo4j in Docker for exploring with Cypher.',
          code: '(:Player)-[:BEAT]->(:Player)' },
        { label: 'CP-SAT', sub: 'OR-Tools solver', kind: 'model', icon: 'cpu', paint: 'data',
          text: 'Longest cycle is NP-hard, so plain graph queries can’t find it. OR-Tools CP-SAT makes each player optional and requires one arrow in, one arrow out and a single circuit. It takes about two seconds.',
          code: 'model.AddCircuit(arcs)' },
        { label: 'Prove', sub: 'no longer loop', kind: 'check', icon: 'shield',
          text: '“Proven” means the solver showed that no longer loop exists: its upper bound equals the loop it found.',
          code: 'proven: true\nbound: 577' },
        { label: 'Store', sub: 'PUT only if better', kind: 'api', icon: 'upload',
          text: 'The loop is saved with PUT /api/funfact/loop only when the stored one is broken or a longer one exists, so the page doesn’t reshuffle for nothing. Every rebuild re-checks it against the current matches.',
          code: 'PUT /api/funfact/loop' },
      ],
    },
    {
      id: 'water-level',
      service: 'water-level',
      area: 'data',
      title: 'Water-level reader',
      file: 'the paper · Fig. 2',
      schedule: '4 capture windows a day',
      summary: 'One CCTV frame in, one water level out. Only two small models are learned. The centimetres come from the gauge’s own markings, which is why it held up on cameras it had never seen.',
      nodes: [
        { label: 'Capture', sub: 'screen → cloud storage', kind: 'source', icon: 'window',
          text: 'Some cameras and video recorders have no API or RTSP stream, so an adapter captures the picture shown in the monitoring client and uploads it to cloud storage with the camera ID and the time. It works with any vendor’s system.',
          code: '19 Jun – 7 Jul 2026\n5 cameras · 3,395 frames' },
        { label: 'Detect', sub: 'YOLOv8n · 3 classes', kind: 'model', icon: 'search',
          text: 'One YOLOv8n detector finds the staff gauge, the meter plate and the waterline. It runs on every frame, because operators pan and zoom the cameras. YOLOv8n is the smallest YOLOv8, chosen so it can run on Raspberry Pi–class hardware at unattended sites.',
          code: 'classes: staff gauge · meter plate · waterline\nmAP@0.5 = 0.870 ± 0.040 on unseen cameras' },
        { label: 'Read digit', sub: 'EfficientNet-B0', kind: 'model', icon: 'cpu',
          text: 'EfficientNet-B0 reads the red digit on the meter plate. The level at the plate’s top edge is that digit minus one, in metres, which gives the whole metres. Trained on 1,800 synthetic and 952 real crops, it read 262 of 265 held-out crops correctly.',
          code: 'm_a = d − 1    // metres at the plate’s top edge\naccuracy 98.87% (262 / 265)' },
        { label: 'Scale', sub: '2 cm strips × 10 cm marks', kind: 'transform', icon: 'layers',
          text: 'The scale comes from the gauge itself. Its 1 cm black strips repeat every 2 cm, so autocorrelation finds their pitch in pixels, and the 10 cm marks give a second estimate. When the two agree they are averaged. When they don’t, the way they disagree shows which one failed, and two plates a metre apart are the last resort.',
          code: 's = 50 × p_strip    // pixels per metre\naverage if 0.8 ≤ 5·p_strip / p_decade ≤ 1.25' },
        { label: 'Check', sub: 'perspective · physics', kind: 'check', icon: 'shield', drop: 0.36,
          text: 'A pole that leans away from the camera looks squashed lower down, so two visible plates give a scale that changes row by row. Physical rules reject impossible answers, such as a waterline above a plate that is visibly dry. Across the field test, 64.2% of frames got a reading. Most misses came from one camera that cut off the plate and from infrared night frames, where giving no reading beats giving a wrong one.',
          code: 'waterline must be below the lowest dry plate\nΔ = ∫ dy / (s_u + A(y − y_u)), from y_p to y_w' },
        { label: 'Level', sub: 'L = mₐ − Δ', kind: 'transform', icon: 'gauge', paint: 'data',
          text: 'The level is the plate’s value minus the distance from its top edge down to the waterline, converted from pixels with the scale. By day, readings were within 5.7 cm of a human reader on average, and 91% were within 10 cm.',
          code: 'L = m_a − (y_w − y_p) / s' },
        { label: 'Smooth', sub: 'causal median of 5', kind: 'filter', icon: 'filter',
          text: 'Water rises slowly, so a median over the current frame and the four before it, from the same camera, removes one-off errors. It only looks back, so an early-warning system can use each reading the moment it arrives. It resets after gaps longer than 45 minutes and never fills in frames it couldn’t read.',
          code: 'L̂_t = median(L_t, L_t−1, …, L_t−4)\nreset after gaps > 45 min' },
        { label: 'Log', sub: 'cloud database', kind: 'store', icon: 'database',
          text: 'Each reading is stored in a cloud database with the camera, the time, the level and a link to the image. The whole reader takes 75.5 ms a frame on an AMD Ryzen 7 5700G CPU, about 13 frames a second.',
          code: 'camera · time · level · image' },
      ],
    },
  ],

  /* -------------------------------------------------------------------
     ANALYSIS: the longest loop of wins in MaklomThai's match records.
     `loop` is a snapshot of GET /api/funfact/loop with names left out:
     one character per player in loop order. dans = dan level;
     wins / losses = head-to-head against the next player (base 36);
     years = year of the last win, minus 2020.
     ------------------------------------------------------------------- */
  analysis: {
    title: 'One loop of 577 wins',
    lead: 'A beat B, B beat C, and so on, until the last player beat A. How long can that loop get across every Go match recorded in Thailand?',
    steps: [
      { k: 'Graph it', t: 'Every MaklomThai match becomes an arrow from winner to loser: 16,582 matches between the 675 players who have played.' },
      { k: 'Narrow it', t: 'A loop can only use players who can all reach each other through wins, a strongly connected component. The largest holds 583 players.' },
      { k: 'Solve it', t: 'Longest cycle is NP-hard, so plain graph queries can’t find it. OR-Tools CP-SAT picks players so that each has one arrow in and one out, in a single circuit.' },
      { k: 'Prove it', t: 'The solver found 577 and proved that no longer loop exists.' },
    ],
    note: 'Snapshot of the live loop from the MaklomThai API, solved 16 Nov 2026. One tick per player, in loop order. Longer, darker ticks are higher dan.',
    loop: {
      length: 577,
      proven: true,
      bound: 577,
      component: 583,
      matches: 16582,
      active: 675,
      solvedAt: "2026-11-16",
      dans: "4141121111112111222111111121112231222431111322341111111212355451244441223112131321211111122544232122111111111111213141333112334445556454313233313221434434424422442131211121112111111123434444411111111113111133235454443344454444442332314212111222232233335321144335411121111111111111121111112245454454211442111111121211332111112313334433434411122111111121112111111211231325554443442211114111114245211111115111111224234334344113244565654444411144441114112234442112242321111111213141111111121111324511121111131211211214112343521111111211232334422321212411111111111111133135441211111",
      wins: "1111111112111111111111111111111111111111111111111211111111111111121721111111111111111111111111111131111111111111111111111111111112111111111111111111111111122111111111111111121111111111111111111111111111111121111122211111111111211123111211111111211111111111111111111111111111111111111111111111112211111111111121111111111111211111211111111112121111121111111111111111111111111111111111111111111211111111111111111111111111121111112161111122111211121111121111111112121111111111111111211111121111111111111111111112111111111111311111111121111111111111112111111111111111111111111111112",
      losses: "00000010000000000000000000100100000000000100001000000000001014000002011100000000000000000001001000002000010000000000000000010000100d0000000000010001010002002000200001000010000001000000000100000000000100000000022000000011001000000000100000000000010000000000000100000000000000000001000000000000100510001000000011101000000000001002000000000000000000000000000000000000100000000000000000000000000000000101000100000020020010000001002710000000000000000000001010000000010000000000000000100000000001011000000000000001000000000100000000000002000000000000000000000000000000000021000000010",
      years: "2233000136565555554455556666666624543212301333556666663446562311231300242245536640343555562634433566666666666566332123632256626660023333332266003422223334235000622346666665566666665660333422002226024113334456655054333322032230022220223000033000333340002222130001122244444465666666655564666464352503012200322440422444555554412332200003503234466666666666650222333334433135233202300010002355556240363342450001333350022222000002222152242222222325233333003334445545666666666665453355566666666666625000122333366655666530223222555566666666634333335556522222401033566655653204111100022",
    },
  },

  /* ------------------------------------------------------------------- */
  certifications: [
    {
      id: 'hccda',
      issuer: 'Huawei Cloud',
      program: 'Developer Certification',
      name: 'HCCDA – Tech Essentials',
      level: 'Certified Developer Associate',
      validUntil: '2029-09-22',
      issued: '2026-09-22',
      number: 'HWENDCTEDA00264658004', // shown as the credential ID; set to '' to hide it
      image: 'assets/img/certs/huawei-hccda.webp',
      thumb: 'assets/img/certs/huawei-hccda-thumb.webp',
    },
    // The first certificate is the featured one (seal, validity bar, console row).
    // The rest show as cards under it. w/h are the full image's size.
    {
      id: 'aws-cf',
      issuer: 'AWS Academy',
      name: 'Cloud Foundations',
      level: 'AWS Academy Graduate · 20 hours',
      issued: '2026-11-15',
      verify: 'https://www.credly.com/go/vdyvSZWF',
      image: 'assets/img/certs/aws-cloud-foundations.webp', w: 1600, h: 1236,
      thumb: 'assets/img/certs/aws-cloud-foundations-thumb.webp',
    },
    {
      id: 'claude-code',
      issuer: 'Claude Academy',
      name: 'Claude Code in Action',
      level: 'Course completion badge',
      issued: '2026-11-22',
      verify: 'https://academy.claude.com/verify/ac83500f70c0c614f3d65337f5c89c27',
      image: 'assets/img/certs/claude-code-in-action.webp', w: 1600, h: 1091,
      thumb: 'assets/img/certs/claude-code-in-action-thumb.webp',
    },
    {
      id: 'claude-101',
      issuer: 'Claude Academy',
      name: 'Claude 101',
      level: 'Course completion badge',
      issued: '2026-11-22',
      verify: 'https://academy.claude.com/verify/b5ff95430d3bdb025fc2a290b4fd35fd',
      image: 'assets/img/certs/claude-101.webp', w: 1600, h: 1091,
      thumb: 'assets/img/certs/claude-101-thumb.webp',
    },
    {
      id: 'claude-fluency',
      issuer: 'Claude Academy',
      name: 'AI Fluency: Framework and Foundations',
      level: 'Course completion badge',
      issued: '2026-11-22',
      verify: 'https://academy.claude.com/verify/9e50bdfbd4c08d97ef18a42fac496bcc',
      image: 'assets/img/certs/claude-ai-fluency.webp', w: 1600, h: 1091,
      thumb: 'assets/img/certs/claude-ai-fluency-thumb.webp',
    },
    {
      id: 'apsipa',
      issuer: 'APSIPA ASC 2026',
      name: 'Certificate of Presentation',
      level: 'For the water-level paper, Bangkok',
      issued: '2026-11', // 9–12 Nov; the certificate itself has no date
      image: 'assets/img/certs/apsipa-presentation.webp', w: 1100, h: 1556,
      thumb: 'assets/img/certs/apsipa-presentation-thumb.webp',
    },
  ],

  /* -------------------------------------------------------------------
     STACK: tools grouped by area. `used` lists service ids ('site' = this
     page, 'hccda' = the certificate).
     ------------------------------------------------------------------- */
  stack: [
    {
      area: 'fs', title: 'Full-stack',
      items: [
        { name: 'TypeScript', used: ['maklomthai'] },
        { name: 'React', v: '18', used: ['maklomthai'] },
        { name: 'Next.js', v: '15', used: ['maklomthai'] },
        { name: 'Tailwind CSS', v: '4', used: ['maklomthai'] },
        { name: 'zustand', used: ['maklomthai'] },
        { name: 'Node.js', v: '22', used: ['maklomthai', 'thai-changelog'] },
        { name: 'Express', v: '4', used: ['maklomthai'] },
        { name: 'MongoDB Atlas · Mongoose', v: '8', used: ['maklomthai'] },
        { name: 'HTML, CSS, JavaScript', used: ['thai-changelog', 'site'] },
        { name: 'SQL · Java · C/C++' },
      ],
    },
    {
      area: 'data', title: 'Data',
      items: [
        { name: 'Python', used: ['water-level', 'maklomthai'] },
        { name: 'YOLOv8 · EfficientNet · OpenCV', used: ['water-level'] },
        { name: 'pandas · PySpark · Databricks' },
        { name: 'Neo4j · Cypher', v: '5', used: ['maklomthai'] },
        { name: 'OR-Tools CP-SAT', used: ['maklomthai'] },
        { name: 'RSS ingestion (ETL)', used: ['thai-changelog'] },
        { name: 'Google Sheets · Apps Script', used: ['maklomthai', 'EGG Digital internship'] },
        { name: 'Gemini API', used: ['thai-changelog'] },
        { name: 'KataGo', used: ['maklomthai'] },
        { name: 'LINE · Discord bots', used: ['maklomthai'] },
      ],
    },
    {
      area: 'cloud', title: 'Cloud & DevOps',
      items: [
        { name: 'Vercel', note: 'serverless · cron · ISR · analytics', used: ['maklomthai'] },
        { name: 'GitHub Actions', note: 'cron · cache · PRs', used: ['thai-changelog', 'maklomthai'] },
        { name: 'GitHub Pages', used: ['thai-changelog', 'site'] },
        { name: 'Fly.io', note: 'Docker · private networking', used: ['maklomthai'] },
        { name: 'Oracle Cloud', note: 'VM · Podman · Caddy · systemd', used: ['maklomthai'] },
        { name: 'Cloudflare R2', note: 'signed uploads', used: ['maklomthai'] },
        { name: 'Docker', used: ['maklomthai'] },
        { name: 'Huawei Cloud', note: 'HCCDA certified', used: ['hccda'] },
        { name: 'AWS', note: 'Cloud Foundations', used: ['aws-cf'] },
        { name: 'Git · pull-request review', used: ['maklomthai', 'thai-changelog'] },
      ],
    },
  ],

  /* -------------------------------------------------------------------
     CHANGELOG: the timeline, newest first.
     tag: shipped | data | research | cert | course | edu | work
     todo: a note shown with a TODO tag until you fill the entry in.
     ------------------------------------------------------------------- */
  changelog: [
    { date: '2026-11-22', tag: 'cert', title: 'Claude Academy: Claude Code in Action, Claude 101 and AI Fluency', text: 'Three course badges from Anthropic’s Claude Academy, each with its own verification link.' },
    { date: '2026-11-21', tag: 'shipped', title: 'A board-photo scorer on Oracle Cloud and Fly.io', text: 'Referees can photograph a finished board and get KataGo’s count to check theirs against. It runs on a free Oracle Cloud VM first, with a private Fly.io app as the fallback.', service: 'maklomthai' },
    { date: '2026-11-17', tag: 'shipped', title: 'MaklomThai Tournaments moves to Fly.io', text: 'The tournament app (registration, pairings, live results and result entry) runs as one small machine in Singapore with its own MongoDB Atlas database, and sends finished games to the rankings for approval.', service: 'maklomthai' },
    { date: '2026-11-15', tag: 'cert', title: 'AWS Academy Graduate: Cloud Foundations', text: 'A 20-hour AWS Academy course, verified on Credly.' },
    { date: '2026-11-15', tag: 'data', title: 'Rating updates publish themselves', text: 'When the official GAT sheet changes, MaklomThai plans the update, publishes it unless a person needs to approve it on Discord, and tells players through a LINE Official Account.', service: 'maklomthai' },
    { date: '2026-11-14', tag: 'shipped', title: 'MaklomThai becomes a home for Go in Thailand', text: 'The rankings moved under Thai Go Tracker, next to a new home page, a blog and beginner lessons with interactive boards, plus CI, a smoke test every 3 hours and nightly encrypted backups.', service: 'maklomthai' },
    { date: '2026-11', tag: 'research', title: 'Presented my first-author paper at APSIPA ASC 2026', text: '“CCTV Water-Level Reading from Staff Gauges via Object Detection and Geometric Scale Fusion”, at the 18th APSIPA Annual Summit and Conference in Bangkok, 9–12 November. YOLOv8n and EfficientNet-B0 read flood gauges on live CCTV, with a 5.7 cm daytime error against human readers.', service: 'water-level' },
    { date: '2026-10-28', tag: 'data', title: 'Automated the longest loop of wins', text: 'Built a script that turns every MaklomThai match into a who-beat-whom graph, finds the longest loop of wins with OR-Tools CP-SAT and proves no longer one exists. It runs every night and keeps the site up to date on its own. The current loop has 577 players.', service: 'maklomthai' },
    { date: '2026-10', tag: 'shipped', title: 'Thailand Changelog goes live', text: 'A news pipeline on GitHub Actions and Pages that turns Thai news into bilingual patch notes, checked twelve times a day.', service: 'thai-changelog' },
    { date: '2026-09', tag: 'cert', title: 'Huawei Cloud HCCDA – Tech Essentials', text: 'Certified Developer Associate, valid until September 2029.' },
    { date: '2026-02', tag: 'shipped', title: 'MaklomThai launches', text: 'Thai Go rankings, match history and statistics, live on Vercel.', service: 'maklomthai' },
    { date: '2025-05', tag: 'work', title: 'Data Scientist Intern, EGG Digital (Ascend Group)', text: 'Three months in the Media Convergence division: automated campaign reporting with Google Apps Script, from campaign CSVs to KPI Sheets and finished Slides decks, plus influencer-campaign tracking and Raspberry Pi signage.' },
    { date: '2024', tag: 'edu', title: 'Started Computer Engineering at Chulalongkorn University', text: 'B.Eng. Computer Engineering & Digital Technology, Faculty of Engineering, expected 2027.' },
  ],
};
