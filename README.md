# kiruthikportfolio.com

Personal portfolio of Kiruthikkumaar Radhakrishnan, with an interactive demo of the **Enterprise Agentic RAG Engine**.
Plain HTML/CSS/JS (no build step), hosted on GitHub Pages.

```
index.html              portfolio (hero, featured project, case study, about, skills, contact)
assets/css, assets/js   styles, 3D hero (Three.js, vendored), counters and reveals
assets/img              screenshots of the real system (scripts/capture_screens.py in the project repo)
assets/results.json     evaluation numbers shown in the results table
demo/                   interactive replay of the company portal (see below)
CNAME                   custom domain for GitHub Pages
```

## Before publishing: fill in your details

Every element with `class="ph"` in `index.html` is a placeholder (shown with a dashed amber underline):
headline role, bio, education/experience, location, email, LinkedIn, GitHub, CV link.
Replace the text, delete `class="ph"`, and optionally add `assets/Kiruthik_CV.pdf` and `assets/img/portrait.jpg`.

## Publish on GitHub Pages

1. Create a **public** repository on GitHub, e.g. `kiruthikportfolio` (Pages is free for public repos).
2. Upload this folder's contents to it (GitHub web UI: *Add file → Upload files*, or with git):
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/KiruthikkumaarR/kiruthikportfolio.git
   git push -u origin main
   ```
3. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
4. Still in **Settings → Pages**, set **Custom domain** to `kiruthikportfolio.com` (the `CNAME` file already contains it).

## Point the Squarespace domain at GitHub Pages

In Squarespace: **Domains → kiruthikportfolio.com → DNS → DNS settings → Custom records**. Remove any existing
Squarespace default `A`/`CNAME` records for `@` and `www`, then add:

| Host | Type  | Data |
|------|-------|------|
| `@`  | A     | 185.199.108.153 |
| `@`  | A     | 185.199.109.153 |
| `@`  | A     | 185.199.110.153 |
| `@`  | A     | 185.199.111.153 |
| `www`| CNAME | `kiruthikkumaarr.github.io` |

DNS can take from a few minutes up to 24 hours. Once GitHub shows the domain as verified, tick **Enforce HTTPS**
in Settings → Pages.

## About the demo

`demo/` is the real portal frontend (3D sign-in, assistant, document library, knowledge galaxy, dashboards,
reports) running against a **replay layer** (`demo/js/replay.js`) instead of the server. Every answer, chart,
dashboard, document preview, PDF page and PowerPoint/Excel report was recorded from the actual running system
(`scripts/record_portfolio_demo.py` in the project repository). Nothing is generated in the browser, and the demo
says so on screen. Questions that were not recorded receive an explicit message rather than an invented answer.

The demo's company, people and figures are entirely fictional (synthetic data generated for the project), and the
demo accounts only exist inside this static replay.

To refresh the demo after changing the system: start the portal, then run
`scripts/record_portfolio_demo.py`, `scripts/build_portfolio_demo.py` and `scripts/capture_screens.py`.
