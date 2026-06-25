---
name: og-image
description: Crée une image Open Graph (aperçu de partage réseaux sociaux) optimisée pour OgArtisan. À utiliser quand l'utilisateur veut une "og image", une "image de partage", un aperçu "Open Graph / Twitter / LinkedIn / Discord" pour un projet. Produit un template .tsx en 1200x630 aligné sur la charte, rendu en PNG léger via le moteur Satori du projet. Nécessite un projet avec sa brand.md en place.
---

# og-image — image Open Graph optimisée

Objectif : produire l'**asset PNG** d'une image de partage (1200×630), via le
pipeline du projet (Satori -> resvg), aligné sur la charte. OgArtisan ne génère
**que l'image** ; les balises `og:`/`twitter:` vivent sur le site qui l'héberge
(voir annexe).

C'est une spécialisation de `new-template` avec les contraintes OG en dur. Mêmes
conventions : contrat `Template` (`src/template.ts`), assets via `asset()`,
police Sora chargée dans `render.ts`, `export default ... satisfies Template`.

## 0. Prérequis — bloquant

La chaîne **projet -> dossier de templates -> charte** doit exister avant de
commencer. Ne pas débuter tant que ce n'est pas le cas :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Si la charte ou le projet manque -> **STOP** : demander à l'utilisateur de
  lancer `/new-project <projet>` d'abord. Aucun visuel sans charte (règle
  CLAUDE.md).

## 1. Cadrer

- `<nom>` slug kebab-case, défaut `og` (ou `og-<page>` si plusieurs aperçus).
  Vérifier que `src/templates/<projet>/<nom>.tsx` n'existe pas.
- Lire `assets/<projet>/brand.md` : palette (hex), typo, variante de logo à
  utiliser selon le fond, et les **à ne pas faire**.
- Demander le **message** : titre court + tagline (1 phrase). Pas de paragraphe.

## 2. Contraintes OG (à respecter dans le template)

- **Taille exacte 1200×630** (ratio 1.91:1). Standard reconnu par Facebook,
  LinkedIn, Slack, Discord, X. Ne pas dévier ; minimum absolu 600×315.
- **Fond opaque**, jamais de transparence : les plateformes composent l'image
  sur des fonds variés.
- **Zone de sécurité** ~80 px de marge : garder logo et texte vers le centre.
  Les coins peuvent être rognés ou arrondis (Discord, X) — rien d'important dans
  les angles.
- **Lisible en petit** : l'aperçu s'affiche souvent ~400 px de large sur mobile.
  Titre gros (~60–90 px), tagline courte, fort contraste. Test mental : lisible
  une fois réduit à 400 px de large.
- **Poids léger** : viser **< 300 Ko**. Au-delà, certains consommateurs
  (WhatsApp notamment) ne génèrent pas l'aperçu. Le rendu flat du moteur est
  naturellement léger : privilégier le mark **SVG en data-URI** (comme
  `cover.tsx`), éviter d'embarquer de gros PNG raster, et **ne pas gonfler avec
  `scale`** — `scale` absent (= 1) suffit à 1200×630 pour de l'OG.
- **PNG** : c'est la sortie du moteur, idéal pour du texte net.

## 3. Écrire le template

`src/templates/<projet>/<nom>.tsx`, couleurs en constantes tirées de la charte
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
seulement s'il est répété.

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler le PNG : **dimensions 1200×630**, fond opaque, **poids < 300 Ko**
  (au-delà, alerter et alléger : retirer un raster lourd, baisser un `scale`).
- Preview : `npm run dev` puis `/<projet>/<nom>` ; vérifier la lisibilité en
  réduisant mentalement à ~400 px.

**Critère de succès** : PNG 1200×630, opaque, < 300 Ko, lisible en petit, et
n'utilisant que des couleurs/typo de `brand.md` sauf où avec autres indications de l'utilisateur.
