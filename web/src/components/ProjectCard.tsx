import type { Project } from '../data/projects.ts'
import styles from './ProjectCard.module.css'

// "Props" are the inputs a component receives, like arguments to a function.
interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      {project.imageUrl && (
        <img src={project.imageUrl} alt="" className={styles.image} />
      )}
      <div className={styles.body}>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tags}>
          {project.tech.map((t) => (
            <li key={t} className={styles.tag}>
              {t}
            </li>
          ))}
        </ul>
        <div className={styles.links}>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
