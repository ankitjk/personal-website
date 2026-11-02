import { site } from '../data/site.ts'
import styles from './Page.module.css'

// TODO: replace with your own skills
const skills = ['TypeScript', 'React', 'Node.js', 'AWS', 'Python']

function About() {
  return (
    <>
      <title>{`About | ${site.name}`}</title>
      <h1 className={styles.heading}>About Me</h1>
      <div className={styles.about}>
        {/* TODO: put your photo in web/public/ (e.g. photo.jpg) and update src */}
        <img src="/photo.svg" alt={site.name} className={styles.photo} />
        <div>
          {/* TODO: write your bio */}
          <p>
            I'm a developer based in [your city]. I enjoy [what you like
            working on], and I'm currently [what you're doing now].
          </p>
          <p>
            Outside of coding, I like [hobbies]. Feel free to reach out at{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          {/* TODO: add your resume as web/public/resume.pdf */}
          <p>
            <a href="/resume.pdf" target="_blank" rel="noreferrer">
              View my resume
            </a>
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Skills</h2>
        <ul className={styles.skills}>
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default About
