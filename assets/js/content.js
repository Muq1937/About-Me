/* =====================================================================
   SITE CONTENT: the only file you need to edit to update the portfolio.
   ---------------------------------------------------------------------
   Everything on the page renders from this object. Anything marked
   "TODO" is placeholder content, so swap in your real details.

   Images  → drop files in assets/img/ and reference them, e.g.
             image: "assets/img/projects/pr-review.png"
   Videos  → a YouTube link ("https://youtu.be/VIDEO_ID") or a file
             in assets/video/ ("assets/video/pr-review.mp4")
   Covers  → projects without an image get generated cover art:
             kind:    "terminal" | "browser" | "chat" | "chart" | "doc" | "nodes" | "poster"
             palette: "violet" | "blue" | "peach" | "pink" | "mint" | "teal" | "amber" | "lemon"
   ===================================================================== */
window.SITE = {
  profile: {
    name: "Muq",                                   // TODO: your display name
    handle: "Muq1937",                             // GitHub username
    role: "AI Engineer",
    status: "Open to work",
    statusDetail: "AI Engineer & full-stack roles", // TODO
    location: "Remote-friendly",                    // TODO: e.g. "Bangkok, Thailand"
    avatar: "",                                     // TODO: e.g. "assets/img/avatar.jpg" (square). Empty = initials
    email: "hello@example.com",                     // TODO
    bio: [
      "Hi, I'm Muq. I make AI agents genuinely useful: I build the Skills, Plugins and MCP servers that give coding agents new abilities, and the full-stack apps that put them in front of people.",
      "I care about clear instructions, honest evals and interfaces that feel good to use.", // TODO
    ],
    now: "Building agent Skills & Plugins",         // TODO
    links: {
      github: "https://github.com/Muq1937",
      linkedin: "",                                 // TODO: full URL
      resume: "",                                   // TODO: e.g. "assets/resume.pdf"
    },
  },

  // Count-up tiles in the hero. TODO: use your real numbers.
  heroStats: [
    { value: 12, suffix: "+", label: "Projects" },
    { value: 8, label: "Agent skills" },
    { value: 3, label: "Plugins" },
    { value: 2, suffix: "+", label: "Years building" },
  ],

  // Scrolling tech strip under the showcase heading.
  stack: [
    "Python", "TypeScript", "Claude API", "Agent Skills", "Model Context Protocol", "React",
    "Next.js", "Node.js", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions",
    "PyTorch", "RAG", "Evals", "Tailwind CSS", "Bash", "Vercel",
  ],

  /* -------------------------------------------------------------------
     SHOWCASE: one "hat" per category. As visitors scroll, the profile
     frame swaps to show that category's stats, tags and projects.
     ------------------------------------------------------------------- */
  categories: [
    {
      id: "skills",
      label: "Agent Skills",
      poster: "AGENT SKILLS",
      colors: { from: "#1C1450", to: "#6C4DFF", ink: "#DCD3FF" }, palette: "violet",
      bio: "I write Skills that teach coding agents new, repeatable abilities: tight triggers, clear steps and evals that prove they work.",
      stats: [["8", "Skills"], ["1.2k", "Runs"], ["94%", "Eval pass"], ["4", "Teams"]], // TODO
      tags: ["SKILL.md", "Prompt design", "Trigger evals"],
      viewAll: "#lab",
      highlights: [
        { title: "Demo: /pr-review on a real pull request", type: "video", meta: "Video · 2:31", project: "pr-review" },
        { title: "How I write skill descriptions that actually trigger", type: "article", meta: "Write-up · 6 min read" },
        { title: "Trigger eval results, before vs. after", type: "report", meta: "Report · 94% pass", project: "eval-harness" },
      ],
      stack: [["Claude Code", "daily driver"], ["Markdown + YAML", "skill format"], ["Python", "helper scripts"], ["Bash", "tooling"], ["GitHub CLI", "PR automation"], ["Evals", "trigger tests"]],
      about: "A skill is just a folder: a SKILL.md with instructions, plus scripts and references the agent loads on demand. The hard part is the description, because it decides when the skill fires. I iterate on it with trigger tests until it fires when it should and stays quiet when it shouldn't.",
    },
    {
      id: "plugins",
      label: "Plugins & MCP",
      poster: "PLUGINS & MCP",
      colors: { from: "#4A0E1E", to: "#FF4F6E", ink: "#FFD6DE" }, palette: "pink",
      bio: "I package skills, slash commands, hooks and MCP servers into plugins that a whole team can install in one line.",
      stats: [["3", "Plugins"], ["9", "MCP tools"], ["120", "Installs"], ["0", "Incidents"]], // TODO
      tags: ["MCP servers", "Hooks", "Slash commands"],
      viewAll: "#lab",
      highlights: [
        { title: "Demo: installing team-toolkit in 10 seconds", type: "video", meta: "Video · 1:48", project: "team-toolkit" },
        { title: "Designing safe, read-only MCP tools", type: "article", meta: "Write-up · 8 min read" },
        { title: "db-explorer MCP server", type: "repo", meta: "Repo · Python", project: "db-explorer" },
      ],
      stack: [["MCP", "tool servers"], ["TypeScript", "plugins"], ["Python", "FastMCP"], ["JSON Schema", "tool inputs"], ["Hooks", "guardrails"], ["SQL", "read-only access"]],
      about: "Plugins bundle everything a team needs (skills, commands, subagents, hooks and MCP servers) behind a single install. I design MCP tools to be narrow and safe by default: read-only first, clear schemas and errors an agent can recover from.",
    },
    {
      id: "apps",
      label: "Full-stack Apps",
      poster: "FULL STACK",
      colors: { from: "#04302C", to: "#12B39E", ink: "#C9FFF4" }, palette: "teal",
      bio: "I ship AI-powered web apps end to end: interface, APIs, data and deploys.",
      stats: [["6", "Apps"], ["3", "Live"], ["99.9%", "Uptime"], ["<1s", "P95 load"]], // TODO
      tags: ["React", "FastAPI", "PostgreSQL"],
      viewAll: "https://github.com/Muq1937",
      highlights: [
        { title: "Walkthrough: Study Buddy from notes to quiz", type: "video", meta: "Video · 3:05", project: "study-buddy" },
        { title: "This portfolio: hand-built, no framework", type: "repo", meta: "Repo · HTML/CSS/JS", project: "portfolio" },
        { title: "Shipping a FastAPI + React app on a student budget", type: "article", meta: "Write-up · 7 min read" },
      ],
      stack: [["React", "UI"], ["Next.js", "web apps"], ["FastAPI", "APIs"], ["PostgreSQL", "data"], ["Docker", "packaging"], ["GitHub Actions", "CI/CD"]],
      about: "I like owning a feature from the first sketch to the production deploy. Most of my apps put an AI capability behind a calm, fast interface, and do the boring parts properly: auth, tests, monitoring and docs.",
    },
    {
      id: "ml",
      label: "ML & Evals",
      poster: "EVALS & ML",
      colors: { from: "#3B2300", to: "#F29A0B", ink: "#FFE9BE" }, palette: "amber",
      bio: "I measure models and prompts before I trust them, with evals, benchmarks and dashboards that make every change a measured bet.",
      stats: [["40+", "Eval suites"], ["5", "Models"], ["+38%", "Avg. lift"], ["92%", "Best F1"]], // TODO
      tags: ["Evals", "RAG", "PyTorch"],
      viewAll: "https://github.com/Muq1937",
      highlights: [
        { title: "Eval harness: catching prompt regressions in CI", type: "report", meta: "Report · 40 suites", project: "eval-harness" },
        { title: "RAG Q&A with citations, live demo", type: "video", meta: "Video · 2:12", project: "rag-qa" },
        { title: "What I learned fine-tuning a small classifier", type: "article", meta: "Write-up · 9 min read", project: "review-classifier" },
      ],
      stack: [["PyTorch", "training"], ["scikit-learn", "baselines"], ["pandas", "analysis"], ["Embeddings", "retrieval"], ["Jupyter", "experiments"], ["Matplotlib", "reporting"]],
      about: "Good AI products start with good measurement. I build small, sharp eval suites, track them over time and wire them into CI so a prompt tweak can't quietly break something that used to work.",
    },
  ],

  /* -------------------------------------------------------------------
     PROJECTS: shown in the showcase grid and opened in a detail modal.
     TODO: replace these examples with your real projects.
     ------------------------------------------------------------------- */
  projects: [
    {
      id: "pr-review", title: "PR Review Skill", category: "skills", year: "2026",
      summary: "A skill that reviews pull requests like a senior engineer: risks first, then tests, then style.",
      details: ["Reads the full files around every hunk, not just the diff", "Runs the tests that cover changed code before commenting", "Posts one summary plus inline comments tied to file and line"],
      stack: ["Agent Skills", "GitHub CLI", "Bash"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "terminal", palette: "violet" }, shape: "tall",
    },
    {
      id: "release-notes", title: "Release Notes Skill", category: "skills", year: "2026",
      summary: "Turns merged PRs into clean, user-facing release notes and a changelog entry.",
      details: ["Groups changes into features, fixes and breaking changes", "Links every line back to its PR", "Shows the diff before anything is committed"],
      stack: ["Agent Skills", "Git", "Markdown"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "doc", palette: "blue" }, shape: "square",
    },
    {
      id: "test-writer", title: "Test Writer Agent", category: "skills", year: "2025",
      summary: "A subagent that writes focused unit tests and keeps iterating until they pass.",
      details: ["Targets uncovered branches from the coverage report", "Never edits source files, only tests", "Explains each test in one line"],
      stack: ["Subagents", "pytest", "Jest"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "chart", palette: "mint" }, shape: "wide",
    },
    {
      id: "team-toolkit", title: "Team Toolkit Plugin", category: "plugins", year: "2026",
      summary: "One install that bundles a team's skills, slash commands, subagents and hooks.",
      details: ["2 skills, 1 command, 1 subagent and a format-on-save hook", "Versioned and distributed through a plugin marketplace", "Onboards a new teammate's agent in seconds"],
      stack: ["Plugins", "Hooks", "Slash commands"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "nodes", palette: "peach" }, shape: "tall",
    },
    {
      id: "db-explorer", title: "DB Explorer MCP", category: "plugins", year: "2026",
      summary: "An MCP server that lets agents safely explore and query a Postgres database.",
      details: ["Read-only by design: only SELECT, capped rows", "Schema discovery tools so the agent writes correct SQL", "Errors phrased so the agent can self-correct"],
      stack: ["MCP", "Python", "PostgreSQL"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "terminal", palette: "pink" }, shape: "square",
    },
    {
      id: "docs-search", title: "Docs Search MCP", category: "plugins", year: "2025",
      summary: "Gives agents semantic search over internal docs, with sources attached.",
      details: ["Chunked, embedded and refreshed nightly", "Returns passages with links, never raw dumps", "Works in any MCP-capable client"],
      stack: ["MCP", "Embeddings", "TypeScript"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "doc", palette: "amber" }, shape: "wide",
    },
    {
      id: "study-buddy", title: "Study Buddy", category: "apps", year: "2025",
      summary: "A web app that turns lecture notes into quizzes and flashcards, with an AI tutor on call.",
      details: ["Upload notes, get a quiz in under ten seconds", "Spaced repetition schedule for flashcards", "Tutor answers cite the exact page of your notes"],
      stack: ["React", "FastAPI", "PostgreSQL"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "chat", palette: "mint" }, shape: "tall",
    },
    {
      id: "portfolio", title: "This Portfolio", category: "apps", year: "2026",
      summary: "Hand-built, animated and data-driven, with no framework and no build step. Hosted on GitHub Pages.",
      details: ["All content lives in one file (content.js)", "Scroll-driven showcase, live terminal demos, command palette (press /)", "Respects reduced-motion and dark-mode preferences"],
      stack: ["HTML", "CSS", "JavaScript"],
      links: { repo: "https://github.com/Muq1937/About-Me", live: "", video: "" },
      image: "", cover: { kind: "browser", palette: "teal" }, shape: "square",
    },
    {
      id: "ops-dashboard", title: "Ops Dashboard", category: "apps", year: "2025",
      summary: "A real-time dashboard for deploys, errors and cloud costs in one calm screen.",
      details: ["Live updates over WebSockets", "Cost anomalies flagged automatically", "Keyboard-first navigation"],
      stack: ["Next.js", "WebSockets", "Postgres"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "chart", palette: "blue" }, shape: "wide",
    },
    {
      id: "eval-harness", title: "Eval Harness", category: "ml", year: "2026",
      summary: "Benchmarks prompts, skills and models side by side, and fails CI on regressions.",
      details: ["40+ suites with golden answers and rubric graders", "Compares models and prompt versions in one report", "Runs on every pull request"],
      stack: ["Python", "Evals", "GitHub Actions"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "chart", palette: "amber" }, shape: "tall",
    },
    {
      id: "rag-qa", title: "RAG Q&A", category: "ml", year: "2025",
      summary: "Retrieval-augmented Q&A over course materials, where every answer carries citations.",
      details: ["Hybrid search: keywords + embeddings", "Answers refuse when sources are missing", "Measured with a groundedness eval"],
      stack: ["Embeddings", "FastAPI", "Evals"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "chat", palette: "lemon" }, shape: "square",
    },
    {
      id: "review-classifier", title: "Review Classifier", category: "ml", year: "2024",
      summary: "Fine-tuned a small transformer to classify product reviews, reaching 92% F1.",
      details: ["Cleaned and labelled 18k reviews", "Beat the TF-IDF baseline by 11 points", "Served behind a tiny FastAPI endpoint"],
      stack: ["PyTorch", "Transformers", "pandas"],
      links: { repo: "", live: "", video: "" },
      image: "", cover: { kind: "poster", palette: "peach", text: "F1 92%" }, shape: "wide",
    },
  ],

  /* -------------------------------------------------------------------
     SKILLS & PLUGINS LAB: each item gets a live terminal demo, its
     source and an optional video. Demo step types:
       prompt  → typed by the "user"        skill → skill loads
       tool    → a tool call with a result   h     → bold heading line
       list    → "type|text" rows (warn, info, ok, feat, fix, break)
       done    → final success line
     ------------------------------------------------------------------- */
  skills: [
    {
      id: "pr-review", command: "/pr-review", kind: "Skill",
      summary: "Reviews a PR like a senior dev: risks, tests, style.",
      project: "pr-review",
      video: "", // TODO: "https://youtu.be/..." or "assets/video/pr-review.mp4"
      files: ["pr-review/", "├── SKILL.md", "├── checklist.md", "└── scripts/", "    └── diff_stats.py"],
      lang: "md",
      source: [
        "---",
        "name: pr-review",
        "description: Reviews a GitHub pull request like a senior engineer. Use when the user asks to review a PR, check a diff, or wants feedback before merging.",
        "---",
        "",
        "# PR Review",
        "",
        "## Steps",
        "1. Fetch the diff with `gh pr diff <number>`.",
        "2. Read every changed file in full, not just the hunks.",
        "3. Run the tests that cover the changed code.",
        "4. Check against `checklist.md`: correctness, security, tests, style.",
        "5. Post one summary comment plus inline comments.",
        "",
        "## Rules",
        "- Lead with risks, then suggestions. Skip nitpicks a linter catches.",
        "- Every comment points to a file and a line.",
      ].join("\n"),
      demo: [
        { t: "prompt", text: "/pr-review 128" },
        { t: "skill", text: "pr-review" },
        { t: "tool", name: "Bash", arg: "gh pr diff 128", out: "+214 −37 · 6 files" },
        { t: "tool", name: "Read", arg: "src/auth/session.ts", out: "182 lines" },
        { t: "tool", name: "Bash", arg: "npm test -- session", out: "24 passed" },
        { t: "h", text: "Review summary" },
        { t: "list", items: ["warn|`session.ts:42`: refresh token can race across two tabs", "info|`api/user.ts:88`: validate `email` before the DB call", "ok|New branch logic is covered by tests"] },
        { t: "done", text: "Posted review to PR #128 · 1 risk, 1 suggestion · 41s" },
      ],
    },
    {
      id: "release-notes", command: "/release-notes", kind: "Skill",
      summary: "Drafts release notes and a changelog from merged PRs.",
      project: "release-notes",
      video: "",
      files: ["release-notes/", "├── SKILL.md", "└── templates/", "    └── notes.md"],
      lang: "md",
      source: [
        "---",
        "name: release-notes",
        "description: Drafts release notes and a CHANGELOG entry from PRs merged since the last tag. Use when preparing a release or when asked what changed.",
        "---",
        "",
        "# Release Notes",
        "",
        "## Steps",
        "1. Find the last tag with `git describe --tags --abbrev=0`.",
        "2. List PRs merged since then with `gh pr list --state merged`.",
        "3. Group changes: Features, Fixes, Breaking, Internal.",
        "4. Write user-facing notes in plain language and link every PR.",
        "5. Update `CHANGELOG.md` and show the diff before committing.",
      ].join("\n"),
      demo: [
        { t: "prompt", text: "/release-notes v2.4.0" },
        { t: "skill", text: "release-notes" },
        { t: "tool", name: "Bash", arg: "git describe --tags --abbrev=0", out: "v2.3.1" },
        { t: "tool", name: "Bash", arg: "gh pr list --state merged", out: "17 PRs" },
        { t: "tool", name: "Edit", arg: "CHANGELOG.md", out: "+42 lines" },
        { t: "h", text: "v2.4.0 highlights" },
        { t: "list", items: ["feat|Dark mode for the dashboard (#212)", "fix|CSV export keeps non-ASCII names intact (#219)", "break|`/v1/report` removed, use `/v2/report` (#224)"] },
        { t: "done", text: "Drafted notes for v2.4.0 · 17 PRs in 3 sections" },
      ],
    },
    {
      id: "team-toolkit", command: "team-toolkit", kind: "Plugin",
      summary: "Skills, commands, a subagent and hooks in one install.",
      project: "team-toolkit",
      video: "",
      files: ["team-toolkit/", "├── .claude-plugin/", "│   └── plugin.json", "├── skills/", "│   ├── pr-review/SKILL.md", "│   └── release-notes/SKILL.md", "├── commands/standup.md", "├── agents/test-writer.md", "└── hooks/hooks.json"],
      lang: "json",
      source: [
        "{",
        "  \"name\": \"team-toolkit\",",
        "  \"version\": \"1.2.0\",",
        "  \"description\": \"Our team's skills, commands and hooks in one install.\",",
        "  \"author\": { \"name\": \"Muq\" },",
        "  \"keywords\": [\"review\", \"release\", \"standup\"]",
        "}",
      ].join("\n"),
      demo: [
        { t: "prompt", text: "/plugin install team-toolkit" },
        { t: "tool", name: "Plugin", arg: "team-toolkit@1.2.0", out: "installed" },
        { t: "h", text: "Added to this session" },
        { t: "list", items: ["ok|`/pr-review`: skill", "ok|`/release-notes`: skill", "ok|`/standup`: command", "ok|`test-writer`: subagent", "ok|`format-on-save`: hook"] },
        { t: "prompt", text: "/standup" },
        { t: "tool", name: "Bash", arg: "git log --since=yesterday", out: "6 commits" },
        { t: "done", text: "Standup drafted from 6 commits · ready to post" },
      ],
    },
    {
      id: "db-explorer", command: "db-explorer", kind: "MCP server",
      summary: "Lets agents safely explore and query Postgres.",
      project: "db-explorer",
      video: "",
      files: ["db-explorer/", "├── server.py", "├── pyproject.toml", "└── README.md"],
      lang: "py",
      source: [
        "from mcp.server.fastmcp import FastMCP",
        "",
        "mcp = FastMCP(\"db-explorer\")",
        "",
        "@mcp.tool()",
        "def describe_table(name: str) -> dict:",
        "    \"\"\"Columns, types and row count for a table.\"\"\"",
        "    return db.describe(name)",
        "",
        "@mcp.tool()",
        "def run_query(sql: str) -> list[dict]:",
        "    \"\"\"Run a read-only SELECT (max 200 rows).\"\"\"",
        "    if not is_read_only(sql):",
        "        raise ValueError(\"Only SELECT statements are allowed\")",
        "    return db.fetch(sql, limit=200)",
      ].join("\n"),
      demo: [
        { t: "prompt", text: "Which customers churned last month?" },
        { t: "tool", name: "db-explorer", arg: "describe_table(\"customers\")", out: "12 cols · 48,210 rows" },
        { t: "tool", name: "db-explorer", arg: "run_query(\"SELECT … churned_at\")", out: "214 rows" },
        { t: "h", text: "214 customers churned in October (−9% vs. September)" },
        { t: "list", items: ["info|Top reason: pricing (38%)", "info|Most churn came from the Starter plan", "ok|Read-only query, capped at 200 rows"] },
        { t: "done", text: "Answered with 2 MCP tool calls · 1.8s" },
      ],
    },
  ],

  // Sticky notes in the dark section: the problems your work solves.
  notes: [
    { text: "It keeps ignoring our code style.", color: "mint" },
    { text: "PR reviews take forever…", color: "lavender" },
    { text: "Can it read our database? Safely??", color: "peach" },
    { text: "It doesn't know our internal tools.", color: "butter" },
    { text: "Every release, same manual checklist.", color: "aqua" },
  ],

  // About → journey timeline. TODO: replace with your real history.
  timeline: [
    { when: "Now", title: "Building agent Skills & Plugins", org: "Independent", text: "Designing, testing and shipping skills, plugins and MCP servers for coding agents.", icon: "sparkles" },
    { when: "20XX – 20XX", title: "Your most recent role", org: "Company · Lab · University", text: "One or two lines on what you did and the impact it had.", icon: "briefcase" },
    { when: "20XX", title: "A project or award you're proud of", org: "Hackathon · Research · Open source", text: "Whatever best shows how you think and work.", icon: "trophy" },
    { when: "20XX – 20XX", title: "Your degree", org: "Your university", text: "Major, relevant coursework, honours.", icon: "graduation" },
  ],

  // About → toolbox chips.
  toolbox: [
    ["AI & agents", ["Claude API", "Agent Skills", "Plugins", "MCP", "RAG", "Evals", "Prompt design"]],
    ["Languages", ["Python", "TypeScript", "SQL", "Bash"]],
    ["Web", ["React", "Next.js", "Node.js", "FastAPI", "Tailwind CSS"]],
    ["Infra", ["Docker", "GitHub Actions", "PostgreSQL", "Vercel"]],
  ],
};
