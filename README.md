# About-Me: portfolio

A hand-built, animated portfolio for showing my projects and the AI agent Skills and Plugins I make. It is plain HTML, CSS and JavaScript, with no framework and no build step, so it runs on GitHub Pages as-is.

**Live:** https://muq1937.github.io/About-Me/

## Editing content

Everything a visitor reads comes from **[`assets/js/content.js`](assets/js/content.js)**. Lines marked `TODO` are placeholders.

| What | Key in `content.js` |
|---|---|
| Name, role, email, links, avatar | `profile` |
| Count-up numbers in the hero | `heroStats` |
| Scrolling tech strip | `stack` |
| Scroll-through profile frame (one "hat" per category) | `categories` |
| Projects (grid tiles and the detail pop-up) | `projects` |
| Skills & plugins lab (terminal demo, source, video) | `skills` |
| Sticky notes | `notes` |
| Timeline and toolbox | `timeline`, `toolbox` |

Section headings and copy are in `index.html`. If you change your name, also update `<title>` and the `og:` tags at the top of `index.html`.

**Images.** Put screenshots in `assets/img/` and set `image: "assets/img/projects/my-project.png"` on a project. Projects without an image get generated cover art, chosen with `cover.kind` and `cover.palette`.

**Videos.** Set `links.video` on a project, or `video` on a skill. The value can be a YouTube link (unlisted works) or an `.mp4` in `assets/video/`. Keep MP4 files small: GitHub rejects files over 100 MB, so use YouTube for anything long.

**Terminal demos.** Each skill's `demo` is a list of steps that the terminal replays:

```js
{ t: "prompt", text: "/pr-review 128" }                          // typed by the user
{ t: "skill",  text: "pr-review" }                               // skill loads
{ t: "tool",   name: "Bash", arg: "npm test", out: "24 passed" } // tool call and its result
{ t: "h",      text: "Review summary" }                          // bold line
{ t: "list",   items: ["warn|risk…", "ok|tests pass"] }          // warn, info, ok, feat, fix, break
{ t: "done",   text: "Posted review · 41s" }                     // final success line
```

**Link preview.** `assets/img/og.png` (1200×630) is the image shown when the link is shared. Replace it when the hero changes.

## Previewing locally

Open `index.html` in a browser. For behaviour identical to GitHub Pages, serve the folder instead:

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## Deploying to GitHub Pages

1. Push to `main`.
2. On GitHub, go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`, and save.
3. About a minute later the site is live at `https://muq1937.github.io/About-Me/`. Each later push redeploys it.

## What's inside

- A scroll-driven showcase: the profile frame swaps category as you scroll, and switches to tabs on smaller screens.
- A Skills & Plugins lab that replays agent sessions and shows each item's source (SKILL.md, plugin manifest or MCP server).
- A command palette: press `/` or `Ctrl K` anywhere.
- A light/dark theme toggle that is remembered per browser.
- Support for `prefers-reduced-motion`.
- Responsive layouts from phones up to wide desktops.

```
index.html
assets/
  css/styles.css     design tokens, components, layouts
  js/content.js      ← your content
  js/main.js         rendering and animations
  img/               favicon, og.png, your images
.nojekyll            tells GitHub Pages to serve files as-is
```
