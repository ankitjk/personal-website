# Development Log

A running record of what changed on the site and why, newest first. Add to it
with `/log-changes` after finishing a change, before committing.

**Last Updated:** November 4, 2026

---

## Next Up

- Add a screenshot or GIF to each project (`imageUrl`), especially GenModel and Space Runner
- Deploy the AWS stack and point ankitjk.com at it (steps in `infra/README.md`), then update README.md's "isn't online yet" wording and the site's own description in `projects.ts`

---

## Changelog

### November 4, 2026 - README Update, robots.txt and Agent Definitions

**Changes:**
- `infra/site.yaml`, `infra/README.md`, `.github/workflows/deploy.yml`, `CLAUDE.md` - AWS hosting, written but not deployed yet. One CloudFormation stack in us-east-1 (a new AWS account, and CloudFront only takes certificates made there) holds a private, encrypted S3 bucket that only the CloudFront distribution can read (via Origin Access Control), the certificate for ankitjk.com and www.ankitjk.com, the distribution (HTTPS only, TLS 1.2+, HTTP/2 and 3, the cheapest price class, AWS's managed caching and security-headers policies), a monthly cost budget that emails an address given at deploy time so it never lands in this public repo, and a role GitHub Actions can use. DNS stays at Porkbun rather than moving to Route 53, so the certificate is validated by adding its CNAME records at Porkbun by hand while the stack waits; `infra/README.md` walks through that and the rest of the first deploy in order. A small CloudFront Function redirects www to the bare domain and serves `index.html` for page addresses like `/about`, since the site uses react-router's BrowserRouter; missing files get a real 404 showing the site's "Page not found" page. No Content-Security-Policy header, because a strict one would block the inline dark-mode script in `index.html`. The workflow deploys on every push to `main`, signing in to AWS with GitHub's short-lived tokens (OIDC) rather than stored keys; the role only works for this repo's `main` branch and can only upload to the bucket and clear the CloudFront cache. Hashed files in `assets/` are cached for a year, everything else is checked on each visit. The workflow skips itself until the GitHub repo variables are set, so merging before the stack exists doesn't produce a failing run. CLAUDE.md now lists `infra/` and `.github/workflows/`.
- `.claude/agents/builder.md`, `.claude/agents/reviewer.md`, `.claude/agents/site-checker.md`, `CLAUDE.md` - three reusable agents, so each brief no longer has to repeat the same instructions. The builder turns one task into one pull request in its own worktree. The reviewer and site-checker are read-only, so checking stays separate from building: the reviewer judges a pull request against its task and CLAUDE.md and is given the change, not the builder's reasoning, so it doesn't just agree with it; the site-checker carries the browser rules worked out so far (light and dark, desktop and phone, never click mailto links, Lighthouse on a production build). Chosen over agents that message each other (backend, frontend, testing, QA): the site is small and static with no backend, its tasks are independent, and each extra hand-off costs tokens and loses detail. Worth revisiting if the site gains a backend. CLAUDE.md lists the three and when each runs.

**Minor:**
- `README.md` - brought up to date with the site, since it still described the starter project: photos are now listed as living in `web/src/assets/photos/` (via `web/src/data/photos.ts`) rather than `web/public/`, the project write-ups in `projects.ts` are explained (`why`/`what`/`how` paragraphs, `[text](url)` links, `tags` on the card versus `tech` on the project's page), it says plainly that the site isn't online yet, and a new "Making changes" section says every change goes through a pull request only Ankit merges, pointing to CLAUDE.md for the details.
- `web/public/robots.txt` - added, allowing search engines to read the whole site. A Lighthouse audit (all pages 100 for performance, accessibility and best practices, in light and dark mode) found it was the only failure: without the file, asking for `/robots.txt` returned the site's own page, which search engines can't read, costing the SEO score (91-92). The audit's other suggestions (smaller About photos, per-page descriptions, a softer home page fade-in) were left for later.

### November 3, 2026 - Project Pages and Write-Ups

Modeled loosely on the project write-ups at rohanjk.xyz, but kept short for now: each project gets three sections, why I built it, what it does, and how I made it. RunItBack and GenModel may get longer write-ups later, so each project has its own page from the start and its address won't change when that happens.

**Changes:**
- `web/src/data/projects.ts` - the "Example Project" placeholder is replaced by RunItBack, GenModel, Space Runner and this site, in that order. Each project now has a `slug` (its page address) and its write-up as `why`, `what` and `how`, one string per paragraph. The "What it does" and "How I made it" drafts come from each project's code and README (and RunItBack's own development log and the resume); the "Why I built it" sections are left empty to be written in my own words. This site's description no longer says it's hosted on AWS, since it isn't yet.
- `web/src/pages/Project.tsx`, `web/src/App.tsx`, `web/src/pages/Page.module.css` - new page for each project at `/projects/<slug>`: a link back to all projects, the title, description, tech tags and a "View code" link, then the three sections at a comfortable reading width. An empty section shows "Coming soon." At the bottom, a "Next project" link moves through the projects in order, wrapping from the last back to the first. An unknown project address shows the "Page not found" page.
- `web/src/components/ProjectCard.tsx`, `web/src/components/ProjectCard.module.css` - the whole card now opens the project's page (the title's link is stretched over the card, so it's one link rather than several), with a "Read more →" hint and a slight lift and clay border on hover. The card's Code and Live links moved to the project page, since links can't sit inside another link.
- `web/src/components/Navbar.tsx` - Projects in the navbar stays highlighted on each project's page, not just on `/projects` itself.
- `CLAUDE.md` - new file with the project's rules for Claude Code, which reads it at the start of every session: commands, where content lives, code and writing conventions, privacy rules (no phone number, strip photo metadata), browser-checking rules, and git rules. Written so agents working in the background, which don't see past conversations, follow the same rules. It's public along with the rest of the repo, so it describes the privacy rules without including anything private. Every change, from a session with Ankit or an agent working on its own, goes on a branch named for the task and reaches `main` through a pull request; only Ankit merges.
- `.claude/settings.json` - stops Claude Code from running `gh pr merge` in this project, so the "only Ankit merges" rule doesn't rest on instructions alone. Ankit still merges on GitHub or from his own terminal.
- GitHub ruleset "Protect main" (a repo setting, not a file) - `main` now only accepts changes through pull requests, and can't be force-pushed or deleted. No approvals are required, since GitHub doesn't let you approve your own pull request, and nobody can skip the rules: agents push with Ankit's login, so letting him skip them would let agents skip them too. Chosen over keeping direct pushes for sessions with Ankit, so there's one workflow for everyone and everything that reaches `main` (and later the live site) has been reviewed.
- `web/public/favicon.svg`, `web/public/apple-touch-icon.png`, `web/index.html` - the browser-tab icon is now the clay dot from beside the name, replacing Vite's purple lightning bolt, which came with the starter project and was never changed. Added a 180px version (the dot on oat paper) for when the site is saved to an iPhone or iPad home screen, since those don't use SVG icons.

**Minor:**
- `web/src/data/projects.ts` - RunItBack's "Why I built it" section written: competing in Smash, and wanting to cut down the time spent reviewing replays at quarter speed.
- `web/src/data/projects.ts` - GenModel's "Why I built it" section written: users of Holos' Learn in 3D app had to hunt for or commission niche 3D models, so GenModel lets them generate one instead.
- `web/src/data/projects.ts` - Space Runner's "Why I built it" section written: a small 3D take on Flappy Bird to learn Unity, with a Star Wars theme.
- `web/src/data/projects.ts` - this site's "Why I built it" section written: a place to share more about myself, my hobbies and my projects, not just my career like LinkedIn.
- `web/src/data/projects.ts`, `web/src/components/ProjectCard.tsx`, `web/src/pages/Project.tsx` - project cards now show only the general areas a project covers plus its main language (for example Computer Vision, Machine Learning, Python), so someone skimming sees what kind of work it is, and the cards are shorter and more even. The full tech stack follows those tags on the project's page. Each project's tags are split into `tags` (the card) and `tech` (the rest). Cards with more on their page end with an "and more" tag, lighter and dashed so it doesn't read as another technology; Space Runner's card has none since its two tools are already shown. GenModel uses Augmented Reality rather than also adding Spatial Computing, since the two overlap and AR is the more widely recognised term and the one the About page uses.
- `web/src/pages/Project.tsx`, `web/src/data/projects.ts` - write-up paragraphs can now include links, written `[text](url)` as in Markdown, and open in a new tab. Used to link Learn in 3D to its product page.

**Results:**
- Build and lint pass. Checked in headless Chrome in light mode at desktop and phone widths, and `/projects/nope` shows "Page not found".

### November 2, 2026 - Warm Minimalism Overhaul

The black-and-glass look felt cool and distant; the goal now is warm, friendly and informal but still smart. After comparing styles (classic warm minimalism, notebook, playful, sketchbook, neo-brutalism, and seven warm-minimal variations), the pick was classic warm's oat and clay colors with Japandi's links-down-the-side layout and a clay dot beside the name.

**Changes:**
- `web/src/index.css` - new site-wide colors and fonts. Light mode is oat paper with a clay accent; dark mode is "Evening" (espresso, cream, amber) so the site stays warm at night instead of turning cold black. Links use a darker clay than the dot so they're readable as text.
- `web/src/main.tsx`, `web/package.json` - Young Serif (headings and name) and Figtree (everything else) installed from Fontsource and bundled with the site, so they load fast and nothing depends on Google Fonts.
- `web/src/pages/Home.tsx`, `web/src/pages/Home.module.css` - rebuilt the home page: name with the clay dot and the personal line low on the left, About / Projects / LinkedIn / GitHub / Email stacked down the right like a table of contents. On phones the links move under the name. The glass bar, sliding highlight and grain are gone; the Email link keeps its copy-the-address behavior.
- `web/src/data/site.ts` - the line under the name is now personal rather than just a job title: "Designing and building software and machine learning systems. Way better at Super Smash Bros. Ultimate than I should be." Chosen over a "nasty at Smash" version because everyone understands it, gamers or not.
- `web/src/components/Navbar.tsx`, `web/src/components/Navbar.module.css`, `web/src/components/Footer.module.css`, `web/src/pages/Page.module.css`, `web/src/components/ProjectCard.module.css` - About, Projects and the 404 page restyled to match: the name with the dot in the navbar (it links home, so the "Home" item was dropped), Young Serif headings, and muted links that turn clay on hover.
- `web/public/photo.svg` - placeholder photo recolored from blue-grey to warm sand so it doesn't clash until a real photo is added.
- `web/src/components/ThemeToggle.tsx`, `web/src/components/ThemeToggle.module.css`, `web/src/index.css`, `web/index.html` - the site is now light by default instead of following the computer's dark mode, with a sun/moon button to switch. The choice is saved in the visitor's browser, and a small script in `index.html` applies it before the page draws so dark mode doesn't flash light first. Dark colors moved from a `prefers-color-scheme` media query to `:root[data-theme='dark']`.
- `web/src/pages/Home.tsx`, `web/src/pages/Home.module.css` - the links column now runs the full height of the screen, with the theme switch at the top and the links at the bottom, because the short column left the top of the page looking unused. Links are spaced slightly further apart. On phones the switch sits in the top-right corner.
- `web/src/components/PhotoStack.tsx`, `web/src/components/PhotoStack.module.css`, `web/src/data/photos.ts`, `web/src/assets/photos/`, `web/src/pages/About.tsx`, `web/src/pages/Page.module.css` - the About page's placeholder circle is replaced by a stack of three square photos (Memorial Union Terrace, a Smash tournament, a Pokémon TCG win), laid like prints with the ones underneath turned so their edges peek out. Tapping or clicking flicks the top photo out and tucks it in at the back; a small "1 / 3" counter underneath shows there's more (captions were tried and removed). Hovering lifts the top photo and fans the others. On phones the stack is centered so the peeking photos stay on screen. A sideways-scrolling "Life outside work" strip of the same photos was built first, but showing them twice was redundant, so the stack replaced it. Photos were resized to 800px and converted to WebP with all metadata removed (iPhone photos carry the date, phone model and possibly location, and the repo and site are public), about 55-95 KB each.
- `web/public/photo.svg` - deleted; the placeholder photo is no longer used.
- `web/public/resume.pdf`, `web/src/pages/Home.tsx` - added the resume and a "Resume ↓" link in the home page sidebar, between GitHub and Email, which downloads it as "Ankit Kulshrestha - Resume.pdf". A separate button under the name was considered but would compete with the name; as a sidebar item it's one click away and matches the other links. The About page's "View my resume" link now works too. This copy of the resume leaves out the phone number, since anything pushed to the public repo stays in its history.
- `web/src/components/Navbar.tsx`, `web/src/components/Navbar.module.css` - theme switch added next to About and Projects. On phones the spacing tightens so the name stays on one line; at 360px and below the links and switch wrap to a second row.

**Minor:**
- `web/index.html` - page title and description use the full name.
- `web/src/data/site.ts`, `web/src/data/projects.ts` - GitHub profile link and this site's Code link now point to the real github.com/ankitjk and the new public repo, instead of placeholders.
- `web/src/data/site.ts` - LinkedIn link and email address set to the real ones (were placeholders), so every link in site.ts now works. Dropped the file's note about TODO placeholders since none are left.
- `web/src/pages/About.tsx` - real bio replaces the placeholder text: work focus, UW-Madison, and life outside work, with RunItBack as the bridge between computer vision and competitive Smash. The "reach out" line with the email is kept as its own paragraph.
- `web/src/pages/About.tsx` - "View my resume" link now reads "View my resume!".
- `web/src/pages/About.tsx`, `web/src/pages/Page.module.css` - the starter skills list is replaced by the resume's Technical Skills, under a "Skills and Tech Stack" heading. Skills are grouped as on the resume (Languages, Developer Tools, Libraries, Other), each group's name beside its tags, or above them on phones.

**Results:**
- Build and lint pass. Checked in headless Chrome in light and dark mode at desktop and phone widths, and clicking Email still copies the address and shows "Copied".
- Theme switch checked in headless Chrome with the system set to dark: the site starts light, the switch turns it dark, the choice survives a reload and carries to the About page, and switching back works.

### November 2, 2026 - Clearer, More Glass-Like Button Bar

**Changes:**
- `web/src/pages/Home.module.css` - made the button bar look more transparent and glassy, closer to Apple's Liquid Glass. Over a black page there's nothing behind the glass to see through, so the effect now comes from how it catches light: a nearly clear fill with a faint sheen at the top, a 1px rim that's brightest at the top-left and bottom-right (a gradient layer with its middle masked out, since a plain border can't fade), a soft glow just inside the edge, and a crisp highlight along the top. The sliding highlight behind the selected button is built the same way, a little brighter.
- `web/src/pages/Home.module.css` - added a fine film grain over the black background: SVG noise written inline in the CSS (no image file), tiled behind the text and buttons. The glass blurs it, so the grain looks smoothed out inside the bar, a subtle frosted effect. This replaced a blue-to-violet glow tried first, which was dropped: as a glow behind the bar the blue spread onto the page, and kept inside the bar it still wasn't wanted.

**Minor:**
- `web/src/data/site.ts` - name set to the full name, Ankit Kulshrestha (was a placeholder), so it shows in the page title, navbar and footer.

**Results:**
- Checked by driving headless Chrome: hover shows the highlight, it slides between buttons, and clicking Email swaps the label to "Copied", puts the address on the clipboard, and resets after 2 seconds.

### October 29, 2026 - Minimalist Home Page

**Changes:**
- `web/src/pages/Home.tsx`, `web/src/pages/Home.module.css` - replaced the game-style menu with a minimalist page in the style of Apple's current "liquid glass" look, because the menu ended up looking tacky. The page is just the name, the tagline, and About / Projects / LinkedIn / GitHub buttons in one frosted-glass bar over soft, slowly drifting color. A glass highlight follows the hovered or keyboard-focused button and springs between buttons. It follows the visitor's light/dark setting and stops moving for visitors who ask for reduced motion.
- `web/src/pages/Home.tsx`, `web/src/pages/Home.module.css` - added an Email button, chosen over a Contact page because a contact form would need a backend that static S3 + CloudFront hosting doesn't have. Clicking it opens the mail app and also copies the address (label briefly reads "Copied"), for visitors with no mail app set up; hovering shows the address. Both labels share one spot so the button's width, and the glass highlight, don't jump. Screen readers get the address in the button's label and hear "Email address copied".
- `web/src/pages/Home.module.css` - on screens up to 480px wide, tighter button spacing and no ↗ marks on the outside links (with one more step below 375px), so all five buttons stay on one line down to 360px. At 320px Email wraps to a second row.

- `web/src/pages/Home.module.css` - background changed to solid black, trying out a starker look. The drifting color blobs are gone, and the page is black with light text in both light and dark mode, using the dark-mode glass colors throughout.

**Minor:**
- `web/src/App.tsx` - comment no longer calls Home a menu.

**Left open:**
- The About and Projects pages still use the original plain navbar and styling, so they don't match the new glass look yet.

### October 27, 2026 - Initial Site Scaffold and Menu Home Page

**Changes:**
- `web/src/pages/Home.tsx`, `web/src/pages/Home.module.css` - Home is now a full-screen, game-style main menu (inspired by fighting-game menu screens, with original artwork): the name in a circle at the center, and four angled tiles in the corners for About, Projects, Contact Me (mailto) and LinkedIn. Hovering or focusing a tile highlights it, dims the others and shows a one-line description in a bar at the bottom. Animations are turned off for visitors who ask for reduced motion.
- `web/src/App.tsx` - the home route moved outside `Layout` so the menu fills the screen without the navbar and footer; other pages keep them so there's always a way back.
- `web/src/pages/Page.module.css` - removed the old hero button styles, which only the previous Home page used.
- `package.json`, `web/` - React + TypeScript site built with Vite, set up as an npm workspace so `npm run dev`/`build`/`lint` work from the repo root.
- `web/src/App.tsx`, `web/src/components/` - Home, About, Projects and 404 routes, all inside a shared `Layout` with navbar and footer.
- `web/src/data/site.ts`, `web/src/data/projects.ts` - personal info and the project list kept in data files so content can be edited without touching page code.
- `.claude/skills/log-changes/`, `DEVELOPMENT.md` - a lighter version of RunItBack's `/log-changes` skill and this log, to keep track of what changes as work on the site goes on.

---
