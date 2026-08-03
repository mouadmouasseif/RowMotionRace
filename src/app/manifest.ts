import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "RowMotion Race - Gestion des competitions d'aviron",
    short_name: "RowMotion Race",
    description:
      "Chronometrage, departs, resultats en direct et classements des competitions d'aviron.",
    start_url: "/tableau-de-bord",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui", "browser"],
    orientation: "any",
    background_color: "#03070d",
    theme_color: "#0077ff",
    lang: "fr-MA",
    dir: "ltr",
    categories: ["sports", "productivity", "utilities"],
    screenshots: [
      {
        src: "/brand/rowmotion-race-mobile-showcase.png",
        sizes: "1536x1024",
        type: "image/png",
        form_factor: "wide",
        label: "Interface RowMotion Race pour la gestion de competition"
      },
      {
        src: "/brand/rowmotion-race-mobile-showcase.png",
        sizes: "1536x1024",
        type: "image/png",
        form_factor: "narrow",
        label: "RowMotion Race installe sur mobile"
      }
    ],
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/brand/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Tableau de bord",
        short_name: "Accueil",
        description: "Ouvrir le tableau de bord de competition",
        url: "/tableau-de-bord",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Chronometrage",
        short_name: "Chrono",
        description: "Ouvrir le chronometrage de course",
        url: "/chronometrage",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Resultats",
        short_name: "Resultats",
        description: "Consulter les resultats de competition",
        url: "/resultats",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      }
    ]
  };
}
