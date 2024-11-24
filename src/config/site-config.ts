export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage: string
    links: {
      twitter: string
      github: string
    }
}

export const siteConfig: SiteConfig = {
  name: "PharmScribe",
  description:
    "An open source video conferencing platform. Connect, collaborate, and communicate via video calls with ease.",
  url: "https://callsquare.jaleelbennett.com",
  ogImage: "https://callsquare.jaleelbennett.com/web-shot.png",
  links: {
    twitter: "https://twitter.com/ankitbatra22",
    github: "https://github.com/ankitbatra22",
  },
}