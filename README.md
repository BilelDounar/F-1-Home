# 🏎️ F1 HOME

> **Le direct de la Formule 1 et l'intégralité des archives — course par course, saison par saison. Sans jamais quitter la page.**

Application web **React + TypeScript** qui diffuse le flux F1 en direct et permet d'explorer les replays de courses classés par saison, dans une interface au parti pris fort : **brutalisme éditorial motorsport** — rouge Formule 1 sur fond quasi-noir, typographie surdimensionnée et mouvement cinétique.

---

## ✨ Fonctionnalités

- **📡 Direct intégré** — le flux live de la F1 dans un lecteur encadré, sans redirection.
- **🗂️ Archives par saison** — sélectionnez une saison via des tuiles ; chaque course est scrappée puis reliée à son lecteur vidéo.
- **🏁 Index calendrier** — les courses d'une saison sont triées **chronologiquement par manche** et affichées en index (numéro de manche + Grand Prix), avec un lecteur en vedette qui se déploie au clic.
- **⚡ Scraping parallèle** — les lecteurs de chaque course sont résolus en parallèle avec une barre de progression en direct et une gestion d'erreurs claire.
- **📱 Responsive** — pensé mobile-first, du petit écran au desktop.
- **♿ Accessible** — contrastes soignés, focus visibles, et respect de `prefers-reduced-motion`.

---

## 🎨 Identité visuelle

| | |
|---|---|
| **Couleurs** | Rouge Formule 1 `#E10600` · fond quasi-noir `#0A0A0B` · off-white `#F4F4EF` |
| **Typographie** | `Anton` (display poster) · `Space Grotesk` (interface) · `Space Mono` (données / labels) |
| **Signatures** | Motif damier, grain filmique, marquee infini, cadres « double-bezel », numéros tabulaires |
| **Mouvement** | Reveal au scroll (IntersectionObserver), transitions à courbes personnalisées, marquee — désactivés sous `prefers-reduced-motion` |

Le système de design vit dans `src/index.css` (tokens de couleur et de police via `@theme` de Tailwind v4) et les primitives réutilisables dans `src/ui.tsx`.

---

## 🛠️ Stack technique

- **⚛️ React 19 + Vite** — interface rapide et build moderne
- **🧠 TypeScript** — typage statique de bout en bout
- **💨 Tailwind CSS v4** — design system par tokens (`@theme`), composants sur mesure
- **🌐 React Router DOM** — navigation SPA (accueil ↔ lecteur)
- **🕷️ Axios + Cheerio** — scraping des archives et extraction des lecteurs

---

## 📁 Structure

```
src/
├── App.tsx          Shell : navbar flottante, grain, footer, routes
├── MainScraper.tsx  Accueil : hero live + sélecteur de saison
├── VideoViewer.tsx  Lecteur : index des courses par manche + lecteur en vedette
├── scraper.ts       Logique de scraping (saisons, courses, lecteurs)
├── types.ts         Types partagés (RaceVideo…)
├── ui.tsx           Primitives : Reveal, Marquee, Grain, Frame, icônes
└── index.css        Système de design (thème, utilitaires, animations)
```

---

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

---

## 💡 Objectif

Centraliser le direct et les archives de la Formule 1 dans une expérience unique, immersive et rapide — une plateforme évolutive qui suit l'actualité des Grands Prix.
