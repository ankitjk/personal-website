import ProjectCard from '../components/ProjectCard.tsx'
import { projects } from '../data/projects.ts'
import { site } from '../data/site.ts'
import styles from './Page.module.css'

function Projects() {
  return (
    <>
      <title>{`Projects | ${site.name}`}</title>
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
