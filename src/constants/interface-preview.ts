export const previewAthletes = [
  { id: "lane-1", lane: 1, name: "Yassine El Amrani", club: "Club Nautique de Rabat", time: "02:18.254" },
  { id: "lane-2", lane: 2, name: "Omar Benali", club: "Club d’Aviron de Fès", time: "02:19.872" },
  { id: "lane-3", lane: 3, name: "Ilyass Aït Hamou", club: "Club Nautique de Casablanca", time: "02:21.103" },
  { id: "lane-4", lane: 4, name: "Amine Zahraoui", club: "Club d’Aviron de Tanger", time: "02:24.561" }
] as const;

export const previewProgramme = [
  { time: "10:00", name: "U19 Homme 1x — Qualification 1", heat: "Série 1/5", status: "TERMINÉE" },
  { time: "10:45", name: "U19 Homme 1x — Qualification 2", heat: "Série 2/5", status: "EN COURS" },
  { time: "11:30", name: "U19 Homme 1x — Qualification 3", heat: "Série 3/5", status: "À VENIR" },
  { time: "12:15", name: "U19 Homme 1x — Qualification 4", heat: "Série 4/5", status: "À VENIR" },
  { time: "14:00", name: "U19 Homme 1x — Demi-finale 1", heat: "Finales", status: "À VENIR" }
] as const;

export const previewClubRankings = [
  { rank: 1, club: "Club Nautique de Rabat", points: 125 },
  { rank: 2, club: "Club d’Aviron de Casablanca", points: 98 },
  { rank: 3, club: "Club d’Aviron de Tanger", points: 76 },
  { rank: 4, club: "Club d’Aviron de Fès", points: 64 },
  { rank: 5, club: "Club Nautique de Marrakech", points: 48 }
] as const;
