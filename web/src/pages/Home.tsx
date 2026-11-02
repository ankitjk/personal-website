import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ThemeToggle from '../components/ThemeToggle.tsx'
import { site } from '../data/site.ts'
import styles from './Home.module.css'

// Links stacked down the right side. Pages on this site use `to`; outside
// links use `href`. Email comes last and is written out separately, since it
// also copies the address.
const links = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'LinkedIn', href: site.links.linkedin },
  { label: 'GitHub', href: site.links.github },
]

function Home() {
  // True for a couple of seconds after the email address is copied
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  // Runs alongside the mailto link opening the mail app, for visitors who
  // don't have one set up. Clipboard access only works over HTTPS or localhost.
  function copyEmail() {
    navigator.clipboard?.writeText(site.email).then(
      () => setCopied(true),
      () => {},
    )
  }

  return (
    <main className={styles.screen}>
      <title>{site.name}</title>
      <div className={styles.intro}>
        <h1 className={styles.name}>
          <span className={styles.dot} aria-hidden="true" />
          {site.name}
        </h1>
        <p className={styles.blurb}>{site.tagline}</p>
      </div>
      {/* Full-height column: theme switch at the top, links at the bottom */}
      <div className={styles.side}>
        <div className={styles.theme}>
          <ThemeToggle />
        </div>
        <nav className={styles.links} aria-label="Main">
          {links.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className={styles.link}>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {link.label}
                <span className={styles.external} aria-hidden="true">
                  ↗
                </span>
              </a>
            ),
          )}
          <a
            href={`mailto:${site.email}`}
            className={styles.link}
            title={site.email}
            aria-label={`Email ${site.email}`}
            onClick={copyEmail}
          >
            <span className={styles.swap}>
              <span data-hidden={copied}>Email</span>
              <span data-hidden={!copied}>Copied</span>
            </span>
          </a>
        </nav>
      </div>
      <span className={styles.srOnly} role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </main>
  )
}

export default Home
