import ogImageSrc from "@images/reneterp_drum_medium.jpg";

export const SITE = {
  title: "Drum Machine",
  tagline: "Top-quality Drum Game Project",
  description:
    "My website offers a game, a set of pieces to touch and create music with sounds in a virtual drum.",
  description_short: "Drum machine, sounds buttons",
  url: "", // Replace with your GitHub Pages URL when available
  author: "Terry I.",
  socialMedia: {
    linkedin: "www.linkedin.com/in/terry-ildefonso-js",
  },
  contact: {
    github: "https://github.com/newHub25",
  },
  logoURL:
    "https://images.pexels.com/photos/542553/pexels-photo-542553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  yearFounded: 2024,
  keywords: ["drum", "project", "astro"],
  colors: {
    primary: "yellow",
    secondary: "black",
  },
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "en-US",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "en_US",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}: : Software Drum`,
  description:
    "Equip your projects with ScrewFast's top-quality hardware tools and expert construction services. Trusted by industry leaders, ScrewFast offers simplicity, affordability, and reliability. Experience the difference with user-centric design and cutting-edge tools. Start exploring now!",
  image: ogImageSrc,
  imageUrl:
    "https://images.pexels.com/photos/1327430/pexels-photo-1327430.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};
