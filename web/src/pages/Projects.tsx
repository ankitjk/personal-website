import ProjectCard from '../components/ProjectCard.tsx'
import { projects } from '../data/projects.ts'
import { site } from '../data/site.ts'
import styles from './Page.module.css'

// Shown under the page's title in search results. A draft for Ankit to
// rewrite in his own words.
const description =
  "Some things I've built, from a computer vision tool that analyzes " +
  'Smash replays to an Apple Vision Pro app and a 3D game made in Unity.'

function Projects() {
  return (
    <>
      <title>{`Projects | ${site.name}`}</title>
      <meta name="description" content={description} />
      <h1 className={styles.heading}>Projects</h1>
      <p className={styles.lead}>Some things I've built.</p>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </>
  )
}

export default Projects
