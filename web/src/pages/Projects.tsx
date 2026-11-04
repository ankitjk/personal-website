import ProjectCard from '../components/ProjectCard.tsx'
import { projects } from '../data/projects.ts'
import { pages } from '../data/pages.ts'
import styles from './Page.module.css'

function Projects() {
  return (
    <>
      <title>{pages.projects.title}</title>
      <meta name="description" content={pages.projects.description} />
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
