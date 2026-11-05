// vite.config.ts also reads this file (to write a page file for each
// project), so it runs in Node during the build and can't import images or
// CSS. Put a project's screenshot in web/public/ instead, e.g.
// web/public/projects/<slug>.webp, and set
// imageUrl: '/projects/<slug>.webp'. Strip its metadata first with
// `cwebp -metadata none` (see CLAUDE.md).
//
// To add a project, copy one of the objects below and edit it.
// TypeScript will underline anything that doesn't match the `Project` shape.
// Projects show on the Projects page in this order.

export interface Project {
  slug: string // the end of the project's page address: /projects/<slug>
  title: string
  description: string // shown on the card and under the title on its page
  // On the card: the general areas the project covers, then its main language
  tags: string[]
  // The rest of the tech stack, shown after the tags on the project's page
  tech: string[]
  imageUrl?: string // the `?` means optional
  repoUrl?: string
  liveUrl?: string
  paperUrl?: string // a paper about the project, like its DOI link
  // The write-up on the project's page: one string per paragraph.
  // Write [text](https://...) for a link. A section left empty shows
  // "Coming soon."
  // Leave out `why` to hide the "Why I built it" section; an empty list
  // still shows "Coming soon."
  why?: string[]
  what: string[]
  how: string[]
}

export const projects: Project[] = [
  {
    slug: 'runitback',
    title: 'RunItBack',
    description:
      'Watches a Super Smash Bros. Ultimate set on YouTube and reports what happened: who played, when each stock was lost, and who had the upper hand.',
    tags: ['Computer Vision', 'Machine Learning', 'Python'],
    tech: ['PyTorch', 'OpenCV', 'PaddleOCR', 'ONNX', 'Gemini'],
    repoUrl: 'https://github.com/ankitjk/RunItBack',
    why: [
      "Like many people in tech spaces, I'm big on gaming. So much so that I compete in Super Smash Bros. Ultimate tournaments regularly and was even ranked #1 on the University of Wisconsin-Madison power rankings.",
      'As a competitive player, I spent hours reviewing my replays at quarter speed, painstakingly pointing out every interaction I lost and trying to understand why. A single 15-minute set could take an hour to review. Most of that time went into finding those moments rather than learning from them. That gave me the idea for RunItBack: if a tool could find every moment something went wrong, I could spend my review time on the part that actually helps me improve.',
    ],
    what: [
      'RunItBack is a command-line tool. Give it a YouTube link to a tournament set and it finds where each game starts and ends, which characters are playing, when each stock was lost, and how much time each player spent in neutral, advantage and disadvantage. It then lists the biggest moments with timestamps, so you can jump straight to them.',
      "It works from the broadcast video alone, with no game data or replay files, so it has to cope with stream overlays, camera zooms and effects covering the screen. On six hand-labeled tournament sets, it catches 83% of stock losses within five seconds of when they happened.",
    ],
    how: [
      "It's written in Python. It downloads the video with yt-dlp and looks at a frame every half second with OpenCV. Each frame goes through a few separate checks: the GO! and GAME! screens mark where games start and end, PaddleOCR reads each player's damage percentage, and Gemini identifies the characters.",
      "To tell what's happening on screen, like a player being offstage, on the ledge or respawning, I trained a ConvNeXt-Tiny image classifier in PyTorch. There wasn't labeled Smash footage to train it on, so I built a PyQt5 app for labeling video and organized a Discord community of about 70 people to help. The classifier is 92% accurate across 7 kinds of scene.",
      "No single signal is reliable on its own. The damage reading breaks under particle effects, for example, so a stock loss only counts when the signals agree: high damage first, then the number resetting or the player respawning. The last stock of each game was the hardest, since nobody respawns. Counting the stock icons was right only once in 14 checks, but I noticed that on the GAME! screen the loser's damage number disappears while the winner's stays. Checking for that got 11 of 14 game endings right, with none wrong.",
    ],
  },
  {
    slug: 'wrmxpress',
    title: 'wrmXpress',
    description:
      "The Zamanian Lab's computer vision tool for analyzing images and videos of worms, used to screen for new drugs against parasitic diseases.",
    tags: ['Computer Vision', 'Image Processing', 'Python'],
    tech: ['OpenCV', 'NumPy', 'SciPy', 'Pillow', 'Matplotlib', 'Docker'],
    repoUrl: 'https://github.com/zamanianlab/wrmXpress',
    paperUrl: 'https://doi.org/10.1016/j.ijpddr.2025.100588',
    what: [
      "wrmXpress is the Zamanian Lab's open-source tool for analyzing microscope images and videos of worms, both parasitic and free-living. It's used for drug screening: worms are imaged in multi-well plates, as still images or videos, and wrmXpress measures what's happening in each well, like how much the worms are moving and where each worm is in the picture.",
      "wrmXpress 2.0 added a point-and-click interface that runs in the web browser of an ordinary computer, so researchers don't need a powerful remote server or the command line to use it. The lab described it in a 2025 paper in the [International Journal for Parasitology: Drugs and Drug Resistance](https://doi.org/10.1016/j.ijpddr.2025.100588), and I'm one of its co-authors, credited for the software.",
    ],
    how: [
      'wrmXpress belongs to the Zamanian Lab at UW-Madison, and I worked on it as part of the team while I was a software engineer there, from June 2023 to May 2024.',
      "A big part of my job was working directly with the lab's researchers, the people who used wrmXpress every day. I talked with them to understand what their experiments needed, turned those non-technical requirements into technical specifications for the software, and explained the technical side back to them in plain terms.",
      "I developed image and video processing pipelines in Python with OpenCV for the lab's high-throughput drug screening across 24–96 well plates and videos of up to 500 frames. I wrote wrmXpress's preprocessing code, which reads an experiment's settings and the microscope's plate files, crops each image into its wells, stitches multi-site images together and converts videos. I also wrote its optical flow pipeline, which measures how much worms move, and its diagnostics, which make whole-plate images and videos to check a run.",
      "Building these as separate preprocessing and pipeline stages, in place of the older modules, was part of refactoring wrmXpress's architecture, which made its processing about 30% more efficient. That structure became the core of wrmXpress 2.0.",
    ],
  },
  {
    slug: 'genmodel',
    title: 'GenModel',
    description:
      'An Apple Vision Pro app that turns a description or a photo into a 3D model you can place in the room around you.',
    tags: ['Generative AI', 'Augmented Reality', 'Swift'],
    tech: ['SwiftUI', 'RealityKit', 'visionOS', 'Replicate'],
    repoUrl: 'https://github.com/ankitjk/GenModel',
    why: [
      "At Holos, I helped develop [Learn in 3D](https://www.holos.io/product/learn), an Apple Vision Pro app for building interactive 3D training courses. Users filled their scenes with 3D models from their own library or Holos' default one. If they needed something more niche, they had to hunt for it online or pay someone to make it, which was slow and expensive.",
      "I figured that if users couldn't find the model they wanted, they should be able to create it. So, on my own initiative, I built GenModel and pitched it to the team as a feature for Learn in 3D.",
    ],
    what: [
      'Type a description, like "a wooden rocking chair", and pick an art style such as cartoon or low-poly, or choose a photo instead. About a minute later you get a 3D model you can turn around in a window, place in front of you at full scale, or save to the Files app.',
      'Each model costs about 1 to 5 cents to generate, with no subscription.',
    ],
    how: [
      "It's written in Swift with SwiftUI and RealityKit. The models themselves come from machine learning models hosted on Replicate: OpenAI's Shap-E for descriptions and Microsoft's TRELLIS for photos. I started out with the Meshy.ai API and switched to Replicate, which charges per model.",
      'Generating a model takes 30 to 90 seconds, so the app sends the request and then checks back on it, every second at first and slowing to every five seconds, giving up after about ten minutes. You can cancel at any point and everything in progress stops cleanly.',
      "Models can come back in different file formats, so I wrote a loader that turns GLB, USDZ, OBJ, PLY and STL files into something RealityKit can show. 28 tests cover the app's state, its data types and reading the responses from Replicate. Models from descriptions are still rough by today's standards; photos through TRELLIS come out much better.",
    ],
  },
  {
    slug: 'space-runner',
    title: 'Space Runner',
    description:
      'A short 3D flying game made in Unity: steer a plane through an asteroid field with an enemy on your tail, and survive as long as you can.',
    tags: ['Game Development', 'C#', 'Unity'],
    tech: [],
    repoUrl: 'https://github.com/ankitjk/space-runner',
    why: [
      "I wanted to create a little Flappy Bird-esque game but in 3D to learn Unity! Also, I'm a bit of a Star Wars nerd so it lines up thematically.",
    ],
    what: [
      'You fly a plane through space with full flight controls: roll, pitch and yaw, plus Space and Left Shift to speed up and slow down. Asteroids keep appearing ahead of you and an enemy plane chases you through the field. Your score is how long you last, and hitting an asteroid ends the run.',
    ],
    how: [
      "I built it in Unity with five C# scripts. The plane is a physics object, so the controls push and twist it rather than moving it directly, which makes it feel like flying instead of steering a cursor.",
      "Asteroids appear 100 units ahead of you in a small random area, at most 50 at a time, and are removed once they're behind you. That keeps the field going forever without slowing the game down. The enemy plane turns smoothly toward you, tries to stay between 5 and 15 units away, and looks ahead to swerve around asteroids. The asteroid models and explosion effects come from the Asteroids Pack and SimpleFX asset packs.",
    ],
  },
  {
    slug: 'personal-website',
    title: 'Personal Website',
    description:
      "This site! A warm, minimal home for who I am, what I've built and how to reach me.",
    tags: ['Web Development', 'TypeScript', 'React'],
    tech: ['Vite', 'CSS', 'GitHub Pages', 'GitHub Actions'],
    repoUrl: 'https://github.com/ankitjk/personal-website',
    why: [
      "I wanted a place to share more about myself, my hobbies and my projects: something that's holistically about me, not just my career like LinkedIn.",
    ],
    what: [
      "It's where my bio, photos, resume and projects live, with links to my LinkedIn and GitHub. It has a light theme and a warm evening theme, and it works just as well on a phone.",
    ],
    how: [
      "It's built with React, TypeScript and Vite. It took three designs to get here: first a home page modeled on a video game menu, then a minimal black page with Apple-style frosted glass. The black glass felt cold, so I compared about a dozen warmer styles side by side and landed on this one: oat and clay colors, a serif for headings, and the links running down the side of the home page.",
      'Some details I cared about: the site starts in light mode and remembers if you switch, without flashing the wrong colors when the page loads. The photos on the About page had their location and camera details removed before going online, and the resume here leaves out my phone number.',
      "I built it with Claude Code, keeping a development log of every change and why it was made. It's hosted on GitHub Pages, and every change I merge on GitHub goes live on its own through GitHub Actions.",
    ],
  },
]
