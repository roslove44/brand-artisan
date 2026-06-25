---
name: og-image
description: Cree une image Open Graph (apercu de partage reseaux sociaux) optimisee pour OgArtisan. A utiliser quand l'utilisateur veut une "og image", une "image de partage", un apercu "Open Graph / Twitter / LinkedIn / Discord" pour un projet. Produit un template .tsx en 1200x630 aligne sur la charte, rendu en PNG leger via le moteur Satori du projet. Necessite un projet avec sa brand.md en place.
---

# og-image — image Open Graph optimisee

Objectif : produire l'**asset PNG** d'une image de partage (1200×630), via le
pipeline du projet (Satori -> resvg), aligne sur la charte. OgArtisan ne genere
**que l'image** ; les balises `og:`/`twitter:` vivent sur le site qui l'heberge
(voir annexe).

C'est une specialisation de `new-template` avec les contraintes OG en dur. Memes
conventions : contrat `Template` (`src/template.ts`), assets via `asset()`,
police Sora chargee dans `render.ts`, `export default ... satisfies Template`.

## 0. Prerequis — bloquant

La chaine **projet -> dossier de templates -> charte** doit exister avant de
commencer. Ne pas debuter tant que ce n'est pas le cas :

- Resoudre `<projet>` (arguments, sinon demander).
- Verifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Si la charte ou le projet manque -> **STOP** : demander a l'utilisateur de
  lancer `/new-project <projet>` d'abord. Aucun visuel sans charte (regle
  CLAUDE.md).

## 1. Cadrer

- `<nom>` slug kebab-case, defaut `og` (ou `og-<page>` si plusieurs apercus).
  Verifier que `src/templates/<projet>/<nom>.tsx` n'existe pas.
- Lire `assets/<projet>/brand.md` : palette (hex), typo, variante de logo a
  utiliser selon le fond, et les **a ne pas faire**.
- Demander le **message** : titre court + tagline (1 phrase). Pas de paragraphe.

## 2. Contraintes OG (a respecter dans le template)

- **Taille exacte 1200×630** (ratio 1.91:1). Standard reconnu par Facebook,
  LinkedIn, Slack, Discord, X. Ne pas devier ; minimum absolu 600×315.
- **Fond opaque**, jamais de transparence : les plateformes composent l'image
  sur des fonds varies.
- **Zone de securite** ~80 px de marge : garder logo et texte vers le centre.
  Les coins peuvent etre rognes ou arrondis (Discord, X) — rien d'important dans
  les angles.
- **Lisible en petit** : l'apercu s'affiche souvent ~400 px de large sur mobile.
  Titre gros (~60–90 px), tagline courte, fort contraste. Test mental : lisible
  une fois reduit a 400 px de large.
- **Poids leger** : viser **< 300 Ko**. Au-dela, certains consommateurs
  (WhatsApp notamment) ne generent pas l'apercu. Le rendu flat du moteur est
  naturellement leger : privilegier le mark **SVG en data-URI** (comme
  `cover.tsx`), eviter d'embarquer de gros PNG raster, et **ne pas gonfler avec
  `scale`** — `scale` absent (= 1) suffit a 1200×630 pour de l'OG.
- **PNG** : c'est la sortie du moteur, ideal pour du texte net.

## 3. Ecrire le template

`src/templates/<projet>/<nom>.tsx`, couleurs en constantes tirees de la charte
(ne rien inventer). Squelette :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark (SVG/PNG)

const SIZE = { width: 1200, height: 630 }; // OG standard, pas de scale

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const INK = "#......";

// const markSvg = await readFile(asset("<projet>/favicon/icon.svg"));

function render(): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80, // zone de securite
        backgroundColor: INK, // fond opaque
      }}
    >
      {/* logo + titre gros + tagline courte, fort contraste */}
    </div>
  );
}

export default { size: SIZE, title: "<Titre humain>", render } satisfies Template;
```

Garder le code minimal (principe #2) : factoriser localement un effet de fond
seulement s'il est repete.

## 4. Verifier

- `npm run typecheck` -> vert.
- `npm run build` -> ecrit `out/<projet>/<slug>.png`.
- Controler le PNG : **dimensions 1200×630**, fond opaque, **poids < 300 Ko**
  (au-dela, alerter et alleger : retirer un raster lourd, baisser un `scale`).
- Preview : `npm run dev` puis `/<projet>/<nom>` ; verifier la lisibilite en
  reduisant mentalement a ~400 px.

**Critere de succes** : PNG 1200×630, opaque, < 300 Ko, lisible en petit, et
n'utilisant que des couleurs/typo de `brand.md` sauf ou avec autres indications de l'utilisateur.
