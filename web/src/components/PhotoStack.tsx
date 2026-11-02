import { useEffect, useState } from 'react'
import { photos } from '../data/photos.ts'
import styles from './PhotoStack.module.css'

// How long the top photo takes to flick out before it tucks in at the back.
// Matches the .leaving transition in PhotoStack.module.css.
const FLICK_MS = 220

// Square photos stacked like prints on a table: the top one sits flat and the
// ones underneath are turned slightly so their edges peek out. Tapping or
// clicking flicks the top photo out and tucks it in at the back.
function PhotoStack() {
  // order[0] is the photo on top; the rest follow underneath
  const [order, setOrder] = useState(() => photos.map((_, i) => i))
  // The photo currently flicking out, if any
  const [leaving, setLeaving] = useState<number | null>(null)

  useEffect(() => {
    if (leaving === null) return
    const timer = setTimeout(() => {
      setOrder(([top, ...rest]) => [...rest, top])
      setLeaving(null)
    }, FLICK_MS)
    return () => clearTimeout(timer)
  }, [leaving])

  function next() {
    if (leaving !== null) return
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      setOrder(([top, ...rest]) => [...rest, top])
    } else {
      setLeaving(order[0])
    }
  }

  return (
    <figure className={styles.figure}>
      <button type="button" className={styles.stack} onClick={next}>
        {photos.map((photo, i) => {
          const depth = order.indexOf(i) // 0 = on top
          return (
            <img
              key={photo.src}
              src={photo.src}
              // Only the top photo is described; the others are just edges
              alt={depth === 0 ? photo.alt : ''}
              width={800}
              height={800}
              className={styles.card}
              data-depth={depth}
              data-leaving={leaving === i || undefined}
              style={{ zIndex: photos.length - depth }}
            />
          )
        })}
        <span className={styles.srOnly}>Show next photo</span>
      </button>
      {/* A small counter so visitors can tell there's more than one photo */}
      <figcaption className={styles.count} aria-live="polite">
        {order[0] + 1} / {photos.length}
      </figcaption>
    </figure>
  )
}

export default PhotoStack
