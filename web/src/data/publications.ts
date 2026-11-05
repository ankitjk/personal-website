// Papers shown in the Publications section of the About page, newest first.
//
// To add one, copy the object below and edit it. Write the authors the way
// the paper lists them, surname then initials. Your own name (`me` below)
// is shown in bold so it's easy to spot.

export interface Publication {
  title: string
  authors: string[] // in the order the paper lists them
  venue: string // the journal or conference, shown in italics
  volume?: string // the `?` means optional
  article?: string // the article number, for journals that use them
  year: number
  url: string // a permanent link, like https://doi.org/...
}

// How your name appears in the author lists above
export const me = 'Kulshrestha A'

export const publications: Publication[] = [
  {
    title:
      'A graphical user interface for wrmXpress 2.0 streamlines helminth phenotypic screening',
    authors: [
      'Caterer Z',
      'Horejsi RV',
      'Weber C',
      'Mathisen B',
      'Nelson CN',
      'Bagatta M',
      'Coughlin I',
      'Wettstein M',
      'Kulshrestha A',
      'Lee HSB',
      'Nunn LR',
      'Zamanian M',
      'Wheeler NJ',
    ],
    venue: 'International Journal for Parasitology: Drugs and Drug Resistance',
    volume: '27',
    article: '100588',
    year: 2025,
    url: 'https://doi.org/10.1016/j.ijpddr.2025.100588',
  },
]
