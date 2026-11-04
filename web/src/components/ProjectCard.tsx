import { Link } from 'react-router'
import type { Project } from '../data/projects.ts'
import styles from './ProjectCard.module.css'

// "Props" are the inputs a component receives, like arguments to a function.
interface ProjectCardProps {
  project: Project
}

// The whole card opens the project's page: the title's link is stretched
// over the card in the CSS, so there's one link rather than one per element.
function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      {project.imageUrl && (
        <img src={project.imageUrl} alt="" className={styles.image} />
      )}
      <div className={styles.body}>
        <h2 className={styles.title}>
          <Link to={`/projects/${project.slug}`} className={styles.link}>
            {project.title}
          </Link>
        </h2>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tags}>
          {project.tech.map((t) => (
            <li key={t} className={styles.tag}>
              {t}
            </li>
          ))}
        </ul>
        <span className={styles.more} aria-hidden="true">
          Read more →
        </span>
      </div>
    </article>
  )
}

export default ProjectCard
