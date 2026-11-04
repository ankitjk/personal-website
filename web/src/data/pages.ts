// Each page's title (shown in the browser tab) and description (shown under
// the title in search results and link previews). The pages use these in
// their <title> and <meta> tags, and the build (vite.config.ts) also writes
// them into each page's own HTML file, so link previews and search engines
// that don't run JavaScript see the right text too.
import type { Project } from './projects.ts'
import { site } from './site.ts'

export interface PageInfo {
  title: string
  description: string
}

export const pages = {
  home: {
    title: site.name,
    // A draft for Ankit to rewrite in his own words
    description:
      "Hi, I'm Ankit! I design and build software and machine learning " +
      "systems, and I'm way better at Super Smash Bros. Ultimate than I " +
      'should be.',
  },
  about: {
    title: `About | ${site.name}`,
    description:
      "I'm a software engineer working mostly on machine learning, backend, " +
      'computer vision, data analytics, and augmented reality. I studied at ' +
      'UW-Madison, and I play Smash competitively.',
  },
  projects: {
    title: `Projects | ${site.name}`,
    // A draft for Ankit to rewrite in his own words
    description:
      "Some things I've built, from a computer vision tool that analyzes " +
      'Smash replays to an Apple Vision Pro app and a 3D game made in Unity.',
  },
  notFound: {
    title: `Page not found | ${site.name}`,
    description: "That page doesn't exist.",
  },
} satisfies Record<string, PageInfo>

// A project's page reuses the one-line summary from its card
export function projectPage(project: Project): PageInfo {
  return {
    title: `${project.title} | ${site.name}`,
    description: project.description,
  }
}
