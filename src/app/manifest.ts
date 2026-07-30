import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "RowMotion Race — Gestion des compétitions d’aviron",
    short_name: "RowMotion Race",
    description:
      "Chronométrage, départs, résultats en direct et classements des compétitions d’aviron.",
    start_url: "/tableau-de-bord",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#03070d",
    theme_color: "#0077ff",
    lang: "fr-MA",
    dir: "ltr",
    categories: ["sports", "productivity", "utilities"],
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
        description: "Ouvrir le tableau de bord de compétition",
        url: "/tableau-de-bord",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Chronométrage",
        short_name: "Chrono",
        description: "Ouvrir le chronométrage de course",
        url: "/chronometrage",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Résultats",
        short_name: "Résultats",
        description: "Consulter les résultats de compétition",
        url: "/resultats",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
      }
    ]
  };
}
