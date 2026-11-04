// Photos in the stack at the top of the About page. The first one starts on
// top. To add one: put a square 800px .webp in src/assets/photos/, plus
// 220px and 440px copies ending in -220 and -440 (made with cwebp -resize
// and -metadata none), import all three below, and add an entry.

import memorialUnionTerrace from '../assets/photos/memorial-union-terrace.webp'
import memorialUnionTerrace220 from
  '../assets/photos/memorial-union-terrace-220.webp'
import memorialUnionTerrace440 from
  '../assets/photos/memorial-union-terrace-440.webp'
import pokemonTcgChampion from '../assets/photos/pokemon-tcg-champion.webp'
import pokemonTcgChampion220 from
  '../assets/photos/pokemon-tcg-champion-220.webp'
import pokemonTcgChampion440 from
  '../assets/photos/pokemon-tcg-champion-440.webp'
import smashTournament from '../assets/photos/smash-tournament.webp'
import smashTournament220 from '../assets/photos/smash-tournament-220.webp'
import smashTournament440 from '../assets/photos/smash-tournament-440.webp'

export interface Photo {
  src: string // the full 800px photo
  // The same photo at each width, so the browser can download the smallest
  // one that still looks sharp on the visitor's screen
  srcSet: string
  alt: string // describes the photo for screen readers and if it fails to load
}

// Lists the three widths of one photo in the format srcSet expects
function widths(small: string, medium: string, full: string) {
  return `${small} 220w, ${medium} 440w, ${full} 800w`
}

export const photos: Photo[] = [
  {
    src: memorialUnionTerrace,
    srcSet: widths(
      memorialUnionTerrace220,
      memorialUnionTerrace440,
      memorialUnionTerrace,
    ),
    alt: 'Ankit smiling on the Memorial Union Terrace at sunset, with Lake Mendota behind him',
  },
  {
    src: smashTournament,
    srcSet: widths(smashTournament220, smashTournament440, smashTournament),
    alt: 'Ankit in headphones, focused on a Super Smash Bros. Ultimate match at a tournament',
  },
  {
    src: pokemonTcgChampion,
    srcSet: widths(
      pokemonTcgChampion220,
      pokemonTcgChampion440,
      pokemonTcgChampion,
    ),
    alt: 'Ankit smiling and holding up a Pokémon TCG champion playmat at a game store',
  },
]
