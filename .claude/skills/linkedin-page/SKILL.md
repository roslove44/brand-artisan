---
name: linkedin-page
description: Crée les visuels d'un profil ou d'une Page LinkedIn (photo de profil, banner perso, logo entreprise, cover entreprise) aux dimensions officielles LinkedIn. À utiliser quand l'utilisateur veut une "photo de profil LinkedIn", un "banner LinkedIn", une "bannière de page entreprise", un "logo de page LinkedIn" ou une "cover LinkedIn" pour un projet. Produit un ou plusieurs templates .tsx aux tailles imposées par LinkedIn, alignés sur la charte, rendus en PNG via le moteur du projet. Nécessite un projet avec sa brand.md en place.
---

# linkedin-page — visuels d'un profil / Page LinkedIn

Objectif : produire les **assets PNG** d'un profil personnel ou d'une Page
entreprise LinkedIn, aux dimensions **officielles** (source : help LinkedIn
a563309 / a568217 / a549049), alignés sur la charte. Quatre visuels possibles,
indépendants :

- **photo de profil** (perso) : la marque, 400×400, rognée en cercle ;
- **banner perso** : l'arrière-plan de profil, 1584×396 (4:1) ;
- **logo entreprise** (Page) : 400×400 ;
- **cover entreprise** (Page) : la bannière haute, 4200×700 (6:1).

C'est une spécialisation de `new-template` avec les contraintes LinkedIn en dur.
Mêmes conventions : contrat `Template` (`src/template.ts`), assets via
`asset()`, polices chargées dans `render.ts`, `export default ... satisfies
Template`.

## 0. Prérequis — bloquant

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer

- **Quel(s) visuel(s) ?** Demander : profil, banner perso, logo entreprise,
  cover entreprise. Ne pas deviner.
- Slugs par défaut : `linkedin-profil`, `linkedin-banner`, `linkedin-logo`,
  `linkedin-cover`. Vérifier que le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette, typo, **variantes de logo /
  favicon** et leurs règles selon le fond, et les **à ne pas faire**.
- S'il y a déjà un `.tsx` dans le projet, le lire comme référence de style.

## 2. Contraintes LinkedIn (à respecter)

| Visuel | Taille | Ratio | Poids | Notes |
|---|---|---|---|---|
| Photo de profil | **400×400** (min) | 1:1 | ≤ 8 Mo | rognée en **cercle** |
| Banner perso | **1584×396** | 4:1 | ≤ 8 Mo | photo de profil en **bas-gauche** |
| Logo entreprise | **400×400** | 1:1 | ≤ 3 Mo | posé sur blanc si transparent |
| Cover entreprise | **4200×700** | 6:1 | ≤ 3 Mo | peut être rognée pour s'adapter |

- **Format** : PNG ou JPG. Fond **opaque** (notre rendu n'est jamais transparent).
- **Profil & logo** : carré, **marque centrée**, rien d'important dans les coins
  (le profil est affiché en cercle). 400×400 est le **minimum** : `scale: 2`
  conseillé pour un rendu net. Pour une organisation, préférer la **marque seule /
  le favicon** au wordmark complet, illisible en petit. Suivre brand.md.
- **Zone morte bas-gauche (avatar / logo)** : sur la page, la photo de profil
  (perso) ou le logo (entreprise) recouvre le bas-gauche de la cover — tout
  texte/logo qui y tombe est **masqué**. **Mêmes proportions** dans les deux cas
  (marge gauche **~3,1 %** de la largeur, boîte **~16 % L × ~46 % H** ancrée en
  bas-gauche) ; seule la **forme du masque** change : **cercle** (rounded-full) en
  perso, **carré** en entreprise.
  - Banner perso 1584×396 : env. **x 49→305, y 214→396** (masque rond).
  - Cover entreprise 4200×700 : env. **x 130→808, y 378→700** (masque carré).
- **Cover entreprise** : LinkedIn peut aussi la **rogner** selon l'écran → garder
  le reste du contenu **centré**, marges larges.

## 3. Écrire le(s) template(s)

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirées de la charte
(ne rien inventer). Garder le code minimal (principe #2). Choisir `SIZE` selon le
visuel :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark

// Choisir selon le visuel :
const SIZE = { width: 400, height: 400 };   // Profil / logo (scale:2 conseille)
// const SIZE = { width: 1584, height: 396 };  // Banner perso 4:1
// const SIZE = { width: 4200, height: 700 };  // Cover entreprise 6:1

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const INK = "#......";

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* marque centree (profil/logo) OU logo + accroche dans la zone sure (banner/cover) */}
		</div>
	);
}

export default { size: SIZE, title: "<Titre humain>", render } satisfies Template;
```

Conventions communes : assets via `asset("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
manquante » de `new-template`, jamais en silence.

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler chaque PNG : **dimensions exactes** selon le visuel, fond opaque,
  poids sous la limite (≤ 8 Mo perso, ≤ 3 Mo entreprise — trivial en rendu flat).
- Profil/logo : vérifier le **rognage en cercle** (rien dans les coins).
- Banner : rien d'important dans le **coin bas-gauche** (photo de profil).
- Cover entreprise : contenu **centré** (rognage possible).
- Preview : `npm run dev` puis `/<projet>/<slug>`.

**Critère de succès** : PNG aux dimensions LinkedIn exactes, opaques, marque
centrée et lisible pour profil/logo, zone sûre respectée pour banner/cover, et
uniquement des couleurs/typo de `brand.md`.
