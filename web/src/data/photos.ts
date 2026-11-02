// Photos in the stack at the top of the About page. The first one starts on
// top. To add one: put a square .webp or .jpg in src/assets/photos/, import
// it below, and add an entry.

import memorialUnionTerrace from '../assets/photos/memorial-union-terrace.webp'
import pokemonTcgChampion from '../assets/photos/pokemon-tcg-champion.webp'
import smashTournament from '../assets/photos/smash-tournament.webp'

export interface Photo {
  src: string
  alt: string // describes the photo for screen readers and if it fails to load
}

export const photos: Photo[] = [
  {
    src: memorialUnionTerrace,
    alt: 'Ankit smiling on the Memorial Union Terrace at sunset, with Lake Mendota behind him',
  },
  {
    src: smashTournament,
    alt: 'Ankit in headphones, focused on a Super Smash Bros. Ultimate match at a tournament',
  },
  {
    src: pokemonTcgChampion,
    alt: 'Ankit smiling and holding up a Pokémon TCG champion playmat at a game store',
  },
]
