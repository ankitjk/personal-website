# Development Log

A running record of what changed on the site and why, newest first. Add to it
with `/log-changes` after finishing a change, before committing.

**Last Updated:** November 2, 2026

---

## Next Up

- Replace the `TODO` placeholders in `web/src/data/site.ts` and `web/src/data/projects.ts` (name, email, GitHub/LinkedIn links, real projects)
- Replace the placeholder `web/public/photo.svg` and add `resume.pdf`
- Host on AWS (S3 + CloudFront) and point ankitjk.com at it

---

## Changelog

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
- `web/src/components/Navbar.tsx`, `web/src/components/Navbar.module.css` - theme switch added next to About and Projects. On phones the spacing tightens so the name stays on one line; at 360px and below the links and switch wrap to a second row.

**Minor:**
- `web/index.html` - page title and description use the full name.
- `web/src/data/site.ts`, `web/src/data/projects.ts` - GitHub profile link and this site's Code link now point to the real github.com/ankitjk and the new public repo, instead of placeholders.
- `web/src/data/site.ts` - LinkedIn link and email address set to the real ones (were placeholders), so every link in site.ts now works. Dropped the file's note about TODO placeholders since none are left.

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
