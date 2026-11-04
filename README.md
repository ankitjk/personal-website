# personal-website

Source for Ankit Kulshrestha's personal website, built with React + TypeScript
(Vite). It's live at https://d3um1rwtt4xdwd.cloudfront.net (no domain yet),
hosted on AWS with S3 and CloudFront. Every merge into `main` publishes it
automatically; [infra/README.md](infra/README.md) explains the AWS setup.

## Run locally

```sh
npm install     # first time only
npm run dev     # then open http://localhost:5173
```

## Edit content

- `web/src/data/site.ts`: name, tagline, email, social links
- `web/src/data/projects.ts`: the projects, in the order they're shown, and
  their write-ups
- `web/src/pages/About.tsx`: bio and skills
- `web/src/data/photos.ts`: the About page photos, which live in
  `web/src/assets/photos/`
- `web/public/`: files served as-is, like `resume.pdf` and the icons

Each project in `projects.ts` gets its own page with three sections, `why`,
`what` and `how`, one string per paragraph. A paragraph can include a link
written `[text](url)`. `tags` are the general areas and main language shown on
the project's card; `tech` is the rest of the stack, shown on its page.

## Other commands

- `npm run build`: type-check, then build into `web/dist/`
- `npm run lint`: check code for common mistakes

## Making changes

Every change reaches `main` through a pull request, and only Ankit merges them
(GitHub enforces this on `main`). See [CLAUDE.md](CLAUDE.md) for the workflow
and project conventions, and [DEVELOPMENT.md](DEVELOPMENT.md) for the log of
what changed and why.
