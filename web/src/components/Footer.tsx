import { site } from '../data/site.ts'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          © {year} {site.name}
        </span>
        <div className={styles.links}>
          <a href={site.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
