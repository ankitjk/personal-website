import { Link, NavLink } from 'react-router'
import { site } from '../data/site.ts'
import ThemeToggle from './ThemeToggle.tsx'
import styles from './Navbar.module.css'

// Your name on the left links back to the home page, so there's no "Home" item
const navItems = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
]

function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          {site.name}
        </Link>
        <div className={styles.right}>
          <ul className={styles.links}>
            {navItems.map((item) => (
              <li key={item.to}>
                {/* NavLink knows when its page is open, so we can highlight
                    it. Projects stays highlighted on each project's page. */}
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
