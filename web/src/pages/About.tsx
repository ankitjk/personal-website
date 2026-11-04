import PhotoStack from '../components/PhotoStack.tsx'
import { pages } from '../data/pages.ts'
import { site } from '../data/site.ts'
import styles from './Page.module.css'

// Grouped the same way as the Technical Skills section of the resume
const skillGroups = [
  {
    label: 'Languages',
    skills: [
      'Python',
      'C#',
      'C',
      'Swift',
      'Java',
      'SQL',
      'R',
      'HTML',
      'CSS',
      'JavaScript',
    ],
  },
  {
    label: 'Developer Tools',
    skills: ['Git', 'Docker', 'Unity', 'AWS', 'Xcode', 'pytest', 'VS Code'],
  },
  {
    label: 'Libraries',
    skills: [
      'PyTorch',
      'OpenCV',
      'pandas',
      'NumPy',
      'Flask',
      'React',
      'SQLAlchemy',
      'Matplotlib',
      'PaddleOCR',
    ],
  },
  {
    label: 'Other',
    skills: ['Generative AI/LLMs', 'Prompt Engineering'],
  },
]

function About() {
  return (
    <>
      <title>{pages.about.title}</title>
      <meta name="description" content={pages.about.description} />
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
              View my resume!
            </a>
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Skills and Tech Stack</h2>
        <div className={styles.skillGroups}>
          {skillGroups.map((group) => (
            <div key={group.label} className={styles.skillGroup}>
              <h3 className={styles.skillLabel}>{group.label}</h3>
              <ul className={styles.skills}>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default About
