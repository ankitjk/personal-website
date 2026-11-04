import { Link } from 'react-router'
import { pages } from '../data/pages.ts'
import styles from './Page.module.css'

function NotFound() {
  return (
    <section className={styles.hero}>
      <title>{pages.notFound.title}</title>
      <meta name="description" content={pages.notFound.description} />
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.lead}>That page doesn't exist.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </section>
  )
}

export default NotFound
