import PhotoStack from '../components/PhotoStack.tsx'
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
        <PhotoStack />
        <div>
          <p>
            Hi! I'm a software engineer working largely on machine learning,
            backend development, data analytics, computer vision, and augmented
            reality. I studied Computer Science and Data Science at the
            University of Wisconsin-Madison.
          </p>
          <p>
            Outside of building software, I play Super Smash Bros. Ultimate
            competitively, which is how I ended up building RunItBack, a
            computer vision tool that analyzes Smash replays and shows the user
            key game events and when they happened. I also enjoy playing and
            watching basketball, soccer, and the Pokémon Trading Card Game.
          </p>
          <p>
            If you're interested in my work, or just want to chat, reach out to
            me at <a href={`mailto:${site.email}`}>{site.email}</a>!
          </p>
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
