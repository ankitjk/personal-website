import { Link, useParams } from 'react-router'
import { projects } from '../data/projects.ts'
import { site } from '../data/site.ts'
import NotFound from './NotFound.tsx'
import styles from './Page.module.css'

// The parts of every write-up, in order
const sections = [
  { key: 'why', heading: 'Why I built it' },
  { key: 'what', heading: 'What it does' },
  { key: 'how', heading: 'How I made it' },
] as const

// Turns each [text](url) in a paragraph into a link that opens in a new tab,
// the same way Markdown writes links
function withLinks(paragraph: string) {
  return paragraph.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!link) return part
    return (
      <a key={i} href={link[2]} target="_blank" rel="noreferrer">
        {link[1]}
      </a>
    )
  })
}

// One project's page, at /projects/<slug>
function Project() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <NotFound />

  const project = projects[index]
  // The last project's "Next" link wraps around to the first
  const next = projects[(index + 1) % projects.length]

  return (
    <article className={styles.writeup}>
      <title>{`${project.title} | ${site.name}`}</title>
      <Link to="/projects" className={styles.back}>
        ← All projects
      </Link>
      <h1 className={styles.heading}>{project.title}</h1>
      <p className={styles.lead}>{project.description}</p>
      <ul className={styles.skills}>
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className={styles.projectLinks}>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            View code ↗
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            Visit ↗
          </a>
        )}
      </div>
      {project.imageUrl && (
        <img src={project.imageUrl} alt="" className={styles.projectImage} />
      )}

      {sections.map(({ key, heading }) => (
        <section key={key} className={styles.section}>
          <h2>{heading}</h2>
          {project[key].length > 0 ? (
            project[key].map((paragraph) => (
              <p key={paragraph}>{withLinks(paragraph)}</p>
            ))
          ) : (
            <p className={styles.comingSoon}>Coming soon.</p>
          )}
        </section>
      ))}

      {projects.length > 1 && (
        <Link to={`/projects/${next.slug}`} className={styles.next}>
          <span className={styles.nextLabel}>Next project</span>
          {next.title} →
        </Link>
      )}
    </article>
  )
}

export default Project
