# ankitjk.com

Ankit Kulshrestha's personal website: React 19 + TypeScript + Vite, in a warm
minimal style. The repo is public on GitHub (ankitjk/personal-website), so
everything committed, including this file, is public.

[DEVELOPMENT.md](DEVELOPMENT.md) is the running log of what changed and why,
plus a **Next Up** list of what's left. Read it before starting work.

## Commands

Run from the repo root (an npm workspace; the app is in `web/`):

```sh
npm run dev     # http://localhost:5173
npm run build   # type-checks, then builds into web/dist/
npm run lint    # oxlint
```

A change is done when `build` and `lint` both pass.

## Where things live

- `web/src/data/site.ts` - name, tagline, email, links
- `web/src/data/projects.ts` - projects and their write-ups (`tags` show on
  the card, `tech` is the rest of the stack, shown on the project's page)
- `web/src/data/pages.ts` - each page's title and description, used by the
  pages and written into each page's HTML file by the build
- `web/src/data/photos.ts`, `web/src/assets/photos/` - About page photos
- `web/src/index.css` - colors and fonts as CSS variables, light and dark
- `web/public/` - files served as-is (`resume.pdf`, icons)
- `web/vite.config.ts` - also writes a copy of `index.html` for each page
  (`about.html`, `projects/<slug>.html`, `404.html`...), since GitHub Pages
  only serves files that exist
- `.github/workflows/pages.yml` - GitHub Actions; publishes the site to
  GitHub Pages (https://ankitjk.com) on every push to `main`

## Code conventions

- CSS Modules per component; use the color variables in `index.css`, never
  hard-coded colors, so dark mode keeps working.
- Dark mode is `:root[data-theme='dark']`, set by the theme switch. The site
  is light by default and does not follow the computer's setting.
- Respect `prefers-reduced-motion` for any animation.
- Keep lines under 80 columns, single quotes, no semicolons.
- Comments are plain English for someone still learning React; match the
  existing ones.
- Ask before adding a dependency.

## Writing for the site

- Ankit's voice: first person, warm, casual, plain language.
- Never invent facts about Ankit (motivations, results, roles). Draft only
  from his repos, resume and what he has said, and mark anything unsure.
- When he supplies text, use it as given; suggest edits separately.

## Privacy

- Never commit his phone number. `web/public/resume.pdf` is the copy without
  it; don't replace it with another version.
- Strip all metadata (location, date, phone model) from photos before
  adding them: convert with `cwebp -metadata none`, then confirm with
  `webpinfo`. iPhone photos may be stored sideways; rotate the pixels first.
- Some photos show other people; ask before adding new ones.

## Checking changes in a browser

- Check desktop and phone widths, in light and dark mode.
- Never click `mailto:` links in automated tests; it opens Ankit's mail app.

## Agents

Three agents are defined in `.claude/agents/`, each with one job:

- **builder** - turns one task into one pull request, in its own worktree.
- **reviewer** - reviews a pull request against the task and this file.
  Read-only; it's given the change, not the builder's reasoning.
- **site-checker** - checks pages in a browser (light/dark, desktop/phone)
  and runs Lighthouse when asked. Read-only.

Any change goes builder, then reviewer (plus site-checker if it's visible),
then Ankit. Text-only changes can skip the reviewer.

## Git

- One feature per commit. Before committing, add the change to
  DEVELOPMENT.md with `/log-changes`.
- Commits use the GitHub noreply email set in the repo's git config; don't
  change it.
- Every change reaches `main` through a pull request that Ankit merges.
  GitHub enforces this: direct pushes, force-pushes and deleting `main` are
  refused for everyone.
  - Start each task from an up-to-date `main` (`git switch main && git
    pull`), then create a branch named for the task (e.g. `readme-update`).
  - Commit and push to that branch, then open a pull request with
    `gh pr create`. Say in it what changed, why, and how you checked it.
  - Never merge a pull request, yours or anyone else's. Only Ankit merges.
- When working with Ankit in a session, commit and push only when he asks,
  then give him the pull request's link. Background and cloud agents given a
  task may commit, push and open a pull request without asking.
