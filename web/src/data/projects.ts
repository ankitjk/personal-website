// To add a project, copy one of the objects below and edit it.
// TypeScript will underline anything that doesn't match the `Project` shape.

export interface Project {
  title: string
  description: string
  tech: string[]
  imageUrl?: string // the `?` means optional
  repoUrl?: string
  liveUrl?: string
}

export const projects: Project[] = [
  {
    title: 'Personal Website',
    description:
      'This site! Built with React and TypeScript, hosted on AWS with S3 and CloudFront.',
    tech: ['React', 'TypeScript', 'AWS'],
    repoUrl: 'https://github.com/your-username/personal-website', // TODO
  },
  {
    title: 'Example Project', // TODO: replace with a real project
    description: 'A short description of what it does and why you built it.',
    tech: ['Python'],
  },
]
