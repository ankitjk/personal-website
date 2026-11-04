import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { pages, projectPage, type PageInfo } from './src/data/pages.ts'
import { projects } from './src/data/projects.ts'

// GitHub Pages only serves files that exist; it can't send every address to
// index.html the way the app's router would like. So the build writes a copy
// of index.html for each page, each with that page's own title and
// description. React then takes over in the browser as usual.
//
// GitHub Pages serves /about from about.html. A folder is different: /projects
// with only projects/index.html redirects to /projects/ first. So each page is
// <address>.html, except Projects, which needs the projects/ folder for the
// project pages. (projects.html next to a projects/ folder could be read
// either way, so it's avoided.) 404.html is what GitHub Pages sends, with a
// real 404 status, for any address that doesn't exist, and the app shows its
// "Page not found" page there.
const pageFiles: Record<string, PageInfo> = {
  'index.html': pages.home,
  'about.html': pages.about,
  'projects/index.html': pages.projects,
  ...Object.fromEntries(
    projects.map((p) => [`projects/${p.slug}.html`, projectPage(p)]),
  ),
  '404.html': pages.notFound,
}

// Makes text safe to put inside HTML, so a " can't end content="..." early
function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

// Swaps one tag in the built index.html, and stops the build if it's missing,
// so a change to index.html can't quietly leave every page with the same text
function replaceTag(html: string, tag: RegExp, replacement: string) {
  if (!tag.test(html)) throw new Error(`page-files: no ${tag} in index.html`)
  // A function, so a $ in the text isn't treated as a special pattern
  return html.replace(tag, () => replacement)
}

// index.html with one page's title and description. og:title and
// og:description are what link previews (in messages and posts) show.
function withPageInfo(html: string, page: PageInfo) {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  return replaceTag(
    html,
    /<meta name="description"[^>]*>/,
    [
      `<meta name="description" content="${description}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
    ].join('\n    '),
  )
}

// Runs at the end of `vite build`, after index.html has been built
function pageFilesPlugin(): Plugin {
  return {
    name: 'page-files',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') {
        throw new Error('page-files: index.html missing from the build')
      }
      const html =
        typeof index.source === 'string'
          ? index.source
          : new TextDecoder().decode(index.source)

      for (const [fileName, page] of Object.entries(pageFiles)) {
        const source = withPageInfo(html, page)
        if (fileName === 'index.html') index.source = source
        else this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pageFilesPlugin()],
})
