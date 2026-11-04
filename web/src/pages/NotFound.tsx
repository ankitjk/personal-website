import { Link } from 'react-router'
import { site } from '../data/site.ts'
import styles from './Page.module.css'

function NotFound() {
  return (
    <section className={styles.hero}>
      <title>{`Page not found | ${site.name}`}</title>
      <meta name="description" content="That page doesn't exist." />
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.lead}>That page doesn't exist.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </section>
  )
}

export default NotFound
