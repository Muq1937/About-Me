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
      linkedin: '',                // TODO: full LinkedIn URL
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

  // Shown when a live request fails. Snapshot taken 5 Nov 2026.
  fallback: {
    maklomthai: { totalMatches: 16108, totalPlayers: 1180, latestMatchDate: '2026-10-18', builtAt: '2026-11-05T05:09:47Z' },
    changelog: {
      "generated": "2026-11-04T23:46:13.275Z",
      "count": 22,
      "entries": [
        {
          "tag": "buff",
          "date": "2026-11-05",
          "time": "06:45",
          "title": "Petrol fuel prices buffed: -0.70 baht per liter from 5 November",
          "source": "Thai PBS",
          "url": "https://www.thaipbs.or.th/news/content/572196"
        },
        {
          "tag": "rebalance",
          "date": "2026-11-04",
          "time": "16:27",
          "title": "Diesel fuel subsidy rebalanced: 3.49 baht per liter effective 4 Nov",
          "source": "Matichon Online",
          "url": "https://www.matichon.co.th/economy/news_5960325"
        },
        {
          "tag": "rebalance",
          "date": "2026-11-03",
          "time": "19:02",
          "title": "Yi Peng festival update: Chiang Mai cancels 108 flights",
          "source": "Khaosod",
          "url": "https://www.khaosod.co.th/around-thailand/news_10459072"
        }
      ]
    },
  },

  // Count-up tiles under the hero. `live` names a value the checks refresh.
  telemetry: [
    { id: 'matches', value: 16108, label: 'match results tracked', source: 'MaklomThai', live: 'mt.totalMatches' },
    { id: 'players', value: 1180, label: 'Go players ranked', source: 'MaklomThai', live: 'mt.totalPlayers' },
    { id: 'loop', value: 576, of: 582, label: 'players in one loop of wins', source: 'Proven longest' },
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
      kicker: 'Thai Go rankings',
      status: 'operational',
      host: 'maklomthai.vercel.app',
      platform: 'Vercel',
      since: 'Feb 2026',
      role: 'Solo developer. Friends helped collect some of the data.',
      areas: ['fs', 'data', 'cloud'],
      tagline: 'Rankings, match history and tournament results for every dan-level Go (หมากล้อม) player in Thailand.',
      summary: [
        'MaklomThai turns the Thai dan registry, a stack of yearly spreadsheets going back to 2020, into a fast public site: rankings by GAT points, player profiles, head-to-head records and fun facts, in Thai and English.',
        'Behind it is an Express and MongoDB API on Vercel. Public reads never aggregate on request. After every write, the backend rebuilds precomputed read models and tells Next.js exactly which pages to refresh.',
        'I’m a 3-dan player myself and play in the tournaments it ranks, so its users are my own community.',
      ],
      built: [
        'A Next.js 15 frontend (App Router, React 18, TypeScript, Tailwind, zustand) with a bilingual Thai/English UI and a light/dark design system.',
        'An Express and MongoDB API on Vercel serverless, with integration tests on an in-memory MongoDB.',
        'Static pages that stay current: each write rebuilds hashed, precomputed read models and fires a webhook that refreshes only the pages that changed. An atomic counter blocks stale overwrites.',
        'A human-in-the-loop data pipeline: a nightly cron turns the official rating sheet into a reviewable proposal, with a safety brake and revert, that admins approve through a Discord bot.',
        'A nightly GitHub Action that finds the longest loop of wins with OR-Tools CP-SAT and stores it through the API.',
      ],
      stack: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'zustand', 'Express', 'MongoDB', 'Mongoose', 'Vercel', 'Vercel cron', 'Discord bot', 'Apps Script', 'GitHub Actions', 'OR-Tools', 'Neo4j'],
      metrics: [
        { value: 16108, label: 'match results', live: 'mt.totalMatches' },
        { value: 1180, label: 'players ranked', live: 'mt.totalPlayers' },
        { value: 576, label: 'player loop of wins' },
      ],
      links: { live: 'https://maklomthai.vercel.app', repo: '', repoNote: 'Code is private' },
      shots: [
        { src: 'assets/img/projects/maklomthai-rankings-{theme}.webp', alt: 'MaklomThai rankings page: a podium of the top three players above the full standings', caption: 'Rankings' },
        { src: 'assets/img/projects/maklomthai-funfacts-{theme}.webp', alt: 'MaklomThai fun facts page: 1,180 players, 16,108 matches and 670 active players', caption: 'Fun facts' },
      ],
      pipelines: ['maklomthai', 'winloop'],
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
      status: 'accepted',
      statusNote: 'Accepted at APSIPA ASC 2026, to appear',
      venue: 'APSIPA ASC 2026',
      host: 'APSIPA ASC 2026',
      platform: 'Python',
      when: 'field test Jun–Jul 2026', // shown instead of "since"
      role: 'First author',
      areas: ['data'],
      tagline: 'Reads river levels from the staff gauges that Thailand’s flood-monitoring cameras already film. Tested on five CCTV cameras in Phayao and Nan.',
      summary: [
        'Flood monitoring in Thailand still relies on people reading staff gauges off CCTV screens. This system reads them automatically: a YOLOv8n detector finds the gauge, its meter plate and the waterline, EfficientNet-B0 reads the plate’s digit, and the centimetres come from the gauge’s own markings instead of a learned scale.',
        'It ran on five cameras from 19 June to 7 July 2026 and was tested one camera at a time, each time with models that had never seen that camera. Daytime readings were within 5.7 cm of a human reader on average, with 91% within 10 cm, and unseen cameras did as well as familiar ones (6.11 vs 6.01 cm).',
        'The paper also reports where it fails. Most infrared night frames get no reading at all, and one camera was aimed so that the meter plate was cut off in 94% of frames. Both problems were hidden by the curated test set and only showed up in the full stream.',
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
        paper: '', // TODO: link to the paper once the proceedings are online
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
      schedule: 'nightly + on every write',
      summary: 'Rating changes wait for a person to approve them, and each write does its heavy lifting once, so every read stays fast.',
      nodes: [
        { label: 'Rating sheet', sub: 'official GAT sheet', kind: 'source', icon: 'sheet',
          text: 'The official rating sheet records GAT points, one workbook per year since 2020. An Apps Script keeps players’ names, dan levels and genders in step.',
          code: 'sheets/  2020 … 2026\napps-script/sync_players.gs' },
        { label: 'Nightly plan', sub: 'cron → proposal', kind: 'trigger', icon: 'clock',
          text: 'Every night a Vercel cron reads the sheet and plans the changes as a proposal. Nothing reaches the site until someone approves it, and unapproved proposals expire after a week.',
          code: 'GatProposal { ops, summary }' },
        { label: 'Discord review', sub: 'approve · reject · revert', kind: 'human', icon: 'check',
          text: 'Each proposal is posted to Discord with Approve, Reject and Revert buttons. Changes over a safety brake need a second confirmation, every button press is signature-checked, and an 8 pm reminder chases proposals that wait too long.',
          code: 'POST /api/discord/interactions\n// Ed25519-signed, answered within 3 s' },
        { label: 'Express API', sub: 'Vercel serverless', kind: 'api', icon: 'server', live: 'mtPing',
          text: 'An Express and Mongoose API, deployed on Vercel as a single function, with integration tests on an in-memory MongoDB. Writes need an API key and public reads are open.',
          code: 'api/index.ts → src/app.ts' },
        { label: 'MongoDB', sub: 'players · matches · Elo', kind: 'store', icon: 'database',
          text: 'Players, matches and tournaments live in MongoDB through Mongoose, with Elo ratings alongside the official GAT points.',
          code: 'src/models/' },
        { label: 'Snapshots', sub: 'precomputed reads', kind: 'job', icon: 'layers', live: 'mtBuilt',
          text: 'Public reads never aggregate on request. After every write the backend rebuilds every read model in one pass. Each document carries a hash, so only what changed is written, and an atomic counter stops a slow rebuild from overwriting a newer one.',
          code: 'snapshots: players · player:<id>\n           funfact · winloop · meta' },
        { label: 'Revalidate', sub: 'webhook → changed pages', kind: 'app', icon: 'window',
          text: 'Changed snapshot keys fire a webhook, and Next.js 15 refreshes only the pages behind them. Everything else stays prerendered.',
          code: "revalidateTag('player:<id>')" },
        { label: 'Vercel CDN', sub: 'to every visitor', kind: 'deploy', icon: 'globe',
          text: 'Served from Vercel’s edge network, with Vercel Analytics.',
          code: 'maklomthai.vercel.app' },
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
          text: 'Every winner→loser pair becomes an arrow. A loop can only use players who can all reach each other through wins (a strongly connected component), so the search keeps the largest one: 582 players. The same graph loads into Neo4j in Docker for exploring with Cypher.',
          code: '(:Player)-[:BEAT]->(:Player)' },
        { label: 'CP-SAT', sub: 'OR-Tools solver', kind: 'model', icon: 'cpu', paint: 'data',
          text: 'Longest cycle is NP-hard, so plain graph queries can’t find it. OR-Tools CP-SAT makes each player optional and requires one arrow in, one arrow out and a single circuit. It takes about two seconds.',
          code: 'model.AddCircuit(arcs)' },
        { label: 'Prove', sub: 'no longer loop', kind: 'check', icon: 'shield',
          text: '“Proven” means the solver showed that no longer loop exists: its upper bound equals the loop it found.',
          code: 'proven: true\nbound: 576' },
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
    title: 'One loop of 576 wins',
    lead: 'A beat B, B beat C, and so on, until the last player beat A. How long can that loop get across every Go match recorded in Thailand?',
    steps: [
      { k: 'Graph it', t: 'Every MaklomThai match becomes an arrow from winner to loser: 16,108 matches between the 670 players who have played.' },
      { k: 'Narrow it', t: 'A loop can only use players who can all reach each other through wins, a strongly connected component. The largest holds 582 players.' },
      { k: 'Solve it', t: 'Longest cycle is NP-hard, so plain graph queries can’t find it. OR-Tools CP-SAT picks players so that each has one arrow in and one out, in a single circuit.' },
      { k: 'Prove it', t: 'The solver found 576 and proved that no longer loop exists.' },
    ],
    note: 'Snapshot of the live loop from the MaklomThai API, solved 3 Nov 2026. One tick per player, in loop order. Longer, darker ticks are higher dan.',
    loop: {
      length: 576,
      proven: true,
      bound: 576,
      component: 582,
      matches: 16108,
      active: 670,
      solvedAt: "2026-11-03",
      dans: "211123222224441112112111424444444454442133233343343511333442212141211132444545655444114424321112111111111221111111121212214144444411111111112211121323231411111111131111111111111111112113221122211111111111111121112441111123112112132123345431221111134414461111111222123332333345411111211131313123445545321111231155554455111211144232111213311213222342323254142111111131455442334433331444645411411111111111314211111121111112211411111111111112111111111121215322244422323343211111211221123445445124421424441111122554543433333432114114444421111122332111111321221342241112211311114111",
      wins: "111111111111111111111111111111111111121111111111111111111111111121111111111111211111111122211111111111111211121111111111111111111111111111111111111111111111111111111111231111111111111111111221111111111111111111111111111111111111111111231111111111111111111111112211111111111211111121211111111111111121111211121112211111111111111111111111111111111111111122131111111111111211111111111111111111112111111111111211111111112112111111111111111111111111111111111111121111111111111111111112111111111111111112111111111111111111111221111111211112111111111111111111111111111211111111111111",
      losses: "00000000000000000000000100100000000000000010200010001000000000001100001000412d010000010000000000000000000000000000000001010000010000000000000000010000000000100000000000010000000100000010000300000000000000000100000000000000000000000000210000000001110001400000000000002000000001000011000010000002000000000100000030010000000000000100000000000000000100000200100000000000000000000000000000010000000000000000000000000000000000000000000000001100000000000110000000010000010000000000100000200100000020000000100000200000000000000200100000000000000002000000000000000101000000000000000001",
      years: "655565000006666654336665664333002255222342132122222000002300363334444422223532422220003336652224445564666566666666344402222222233435545555555666666623533224111033566666666666666663333224544556666666666666665554002222223452245555522660523333221112223302000222602303335622660205222440002332321002426622233222330160000000001220034433556563225532332222333350033566655633644244333331311330201111001003433344503266656502246565552666665566666666656656666666335554356235566245555566655666660253301112003323022433433533623356245320000004442444444365555554066666110036323442333333335666",
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
        { name: 'MongoDB · Mongoose', v: '8', used: ['maklomthai'] },
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
      ],
    },
    {
      area: 'cloud', title: 'Cloud & DevOps',
      items: [
        { name: 'Vercel', note: 'serverless · cron · ISR · analytics', used: ['maklomthai'] },
        { name: 'GitHub Actions', note: 'cron · cache · PRs', used: ['thai-changelog', 'maklomthai'] },
        { name: 'GitHub Pages', used: ['thai-changelog', 'site'] },
        { name: 'Docker', used: ['maklomthai'] },
        { name: 'Huawei Cloud', note: 'HCCDA certified', used: ['hccda'] },
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
    { date: '2026-10-28', tag: 'data', title: 'Automated the longest loop of wins', text: 'Built a script that turns every MaklomThai match into a who-beat-whom graph, finds the longest loop of wins with OR-Tools CP-SAT and proves no longer one exists. It runs every night and keeps the site up to date on its own. The current loop has 576 players.', service: 'maklomthai' },
    { date: '2026-10', tag: 'shipped', title: 'Thailand Changelog goes live', text: 'A news pipeline on GitHub Actions and Pages that turns Thai news into bilingual patch notes, checked twelve times a day.', service: 'thai-changelog' },
    { date: '2026-09', tag: 'cert', title: 'Huawei Cloud HCCDA – Tech Essentials', text: 'Certified Developer Associate, valid until September 2029.' },
    { date: '2026', tag: 'research', title: 'First-author paper accepted at APSIPA ASC 2026', text: '“CCTV Water-Level Reading from Staff Gauges via Object Detection and Geometric Scale Fusion”. YOLOv8n and EfficientNet-B0 read flood gauges on live CCTV, deployed on five cameras in Phayao and Nan with a 5.7 cm daytime error against human readers.', service: 'water-level' },
    { date: '2026-02', tag: 'shipped', title: 'MaklomThai launches', text: 'Thai Go rankings, match history and statistics, live on Vercel.', service: 'maklomthai' },
    { date: '2025-05', tag: 'work', title: 'Data Scientist Intern, EGG Digital (Ascend Group)', text: 'Three months in the Media Convergence division: automated campaign reporting with Google Apps Script, from campaign CSVs to KPI Sheets and finished Slides decks, plus influencer-campaign tracking and Raspberry Pi signage.' },
    { date: '2024', tag: 'edu', title: 'Started Computer Engineering at Chulalongkorn University', text: 'B.Eng. Computer Engineering & Digital Technology, Faculty of Engineering, expected 2028.' },
  ],
};
