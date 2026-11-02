# personal-website

Source for ankitjk.com, built with React + TypeScript (Vite). AWS hosting comes in a later phase.

## Run locally

```sh
npm install     # first time only
npm run dev     # then open http://localhost:5173
```

## Edit content

- `web/src/data/site.ts`: name, tagline, email, social links
- `web/src/data/projects.ts`: the project list on the Projects page
- `web/src/pages/About.tsx`: bio and skills
- `web/public/`: static files like your photo and `resume.pdf`

## Other commands

- `npm run build`: production build into `web/dist/`
- `npm run lint`: check code for common mistakes
