---
name: x-page
description: Crée les visuels de profil X / Twitter (photo de profil et header / bannière) aux dimensions officielles X. À utiliser quand l'utilisateur veut une "photo de profil X/Twitter", un "header Twitter", une "bannière X" ou "l'avatar X" pour un projet. Produit un ou deux templates .tsx aux tailles imposées par X (profil 400x400, header 1500x500), alignés sur la charte, rendus en PNG via le moteur du projet. Nécessite un projet avec sa brand.md en place.
---

# x-page : visuels de profil X / Twitter

Objectif : produire les **assets PNG** d'un profil X (Twitter) aux dimensions
**officielles** (source : aide X « customize your profile »), alignés sur la
charte. Deux visuels possibles, indépendants :

- **photo de profil** : la marque, 400×400, rognée en cercle ;
- **header / bannière** : 1500×500 (3:1).

C'est une spécialisation de `new-template` avec les contraintes X en dur. Mêmes
conventions : contrat `Template`, assets via `brand()`, polices chargées dans
`render.ts`, `export default ... satisfies Template`.

## 0. Prérequis (bloquant)

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `templates/<projet>/` **et** `brands/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer

- **Quel(s) visuel(s) ?** Demander : profil, header, ou les deux.
- Slugs par défaut : `x-profil` (400×400), `x-header` (1500×500). Vérifier que le
  `.tsx` cible n'existe pas.
- Lire `brands/<projet>/brand.md` : palette, typo, **variantes de logo /
  favicon** et leurs règles selon le fond, et les **à ne pas faire**.
- S'il y a déjà un `.tsx` dans le projet, le lire comme référence de style.

## 2. Contraintes X (à respecter)

| Visuel | Taille | Ratio | Notes |
|---|---|---|---|
| Photo de profil | **400×400** | 1:1 | rognée en **cercle** |
| Header / bannière | **1500×500** | 3:1 | recadrée sur mobile (bords) |

- **Format** : PNG ou JPG. Fond **opaque**. X ne documente pas de poids max pour
  ces deux visuels (le 5 Mo officiel concerne les images de tweet).
- **Profil** : carré, **marque centrée**, rien d'important dans les coins (affiché
  en cercle). 400×400 est la taille officielle ; `scale: 2` conseillé pour la
  netteté. Pour une organisation, préférer la **marque seule / le favicon** au
  wordmark, illisible en petit. Suivre brand.md.
- **Header (1500×500)** : sur mobile, X **rogne les côtés** → garder le contenu
  important centré, marges latérales confortables.
- **Zone morte bas-gauche (photo de profil)** : sur la page profil, l'avatar
  recouvre le bas-gauche du header : tout texte/logo qui y tombe est **masqué**.
  La laisser libre : marge gauche **~2,5 %** de la largeur, boîte **~23 % L ×
  ~35 % H** ancrée en bas-gauche. Sur 1500×500 : env. **x 38→388, y 325→500**.

## 3. Écrire le(s) template(s)

`templates/<projet>/<slug>.tsx`, couleurs en constantes tirées de la charte
(ne rien inventer). Choisir `SIZE` selon le visuel :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../src/template";
import { brand } from "../../src/brand";
// import { readFile } from "node:fs/promises"; // si tu charges le mark

// Choisir selon le visuel :
const SIZE = { width: 400, height: 400 };   // Profil 1:1 (scale:2 conseille)
// const SIZE = { width: 1500, height: 500 };  // Header 3:1

// Palette charte <Projet> (depuis brands/<projet>/brand.md).
const INK = "#......";

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* marque centree (profil) OU lockup + accroche centres (header) */}
		</div>
	);
}

export default { size: SIZE, title: "<Titre humain>", render } satisfies Template;
```

Conventions communes : assets via `brand("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
manquante » de `new-template`, jamais en silence.

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler chaque PNG : **dimensions exactes** (400×400 / 1500×500), fond opaque.
- Profil : vérifier le **rognage en cercle** (rien dans les coins).
- Header : rien d'important dans le **coin bas-gauche** (photo de profil) ni trop
  près des **bords latéraux** (crop mobile).
- Preview : `npm run dev` puis `/<projet>/<slug>`.

**Critère de succès** : PNG aux dimensions X exactes, opaques, marque centrée et
lisible pour le profil, zone sûre respectée pour le header, et uniquement des
couleurs/typo de `brand.md`.
