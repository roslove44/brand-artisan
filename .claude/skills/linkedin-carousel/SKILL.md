---
name: linkedin-carousel
description: Crée les cartes d'un carousel ad LinkedIn (Campaign Manager) aux dimensions LinkedIn, comme une série de visuels 1:1 cohérents. À utiliser quand l'utilisateur veut un "carrousel LinkedIn", une "publicité carrousel LinkedIn" ou "plusieurs cartes qui défilent" pour un projet LinkedIn. Produit N templates .tsx (une carte = un PNG, ratio 1:1) dans un sous-dossier dédié, partageant une charte commune, alignés sur la brand.md. Nécessite un projet avec sa brand.md en place.
---

# linkedin-carousel : cartes d'un carousel ad LinkedIn

Objectif : produire les **assets PNG des N cartes** d'un **carousel ad** LinkedIn
(Campaign Manager / Sponsored Content), au format **1:1**, cohérents entre eux et
alignés sur la charte. Un carrousel n'est pas N images indépendantes : c'est une
**série** qui raconte quelque chose. La cohérence inter-cartes est le cœur du
livrable.

C'est une spécialisation de `new-template`. Mêmes conventions : contrat
`Template`, assets via `brand()`, polices chargées dans `render.ts`,
`export default ... satisfies Template`. Même modèle que `facebook-carousel`.

> **Carousel ad ≠ carrousel organique.** Ce que tu produis ici, ce sont les
> **cartes images 1:1** d'un *carousel ad* (publicité, Campaign Manager). Le
> « carrousel » **organique** du fil LinkedIn est un **document multi-pages
> (PDF)**, pas une série d'images : **hors périmètre** de ce moteur (qui sort du
> PNG).

## 0. Prérequis (bloquant)

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `templates/<projet>/` **et** `brands/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer (demander, ne pas deviner)

- **Nom du carrousel** : slug kebab-case, défaut `linkedin-carousel`. C'est le
  **sous-dossier** `templates/<projet>/<nom>/`. Vérifier qu'il n'existe pas.
- **Mécanique narrative** (voir §3) : story, une carte = un produit, top N, tuto,
  avant/après. Elle dicte le design.
- **Nombre de cartes** : 2 à 10, **sweet spot 3-5**.
- **Contenu de chaque carte** : message court + rôle (hook, développement, CTA).
- Lire `brands/<projet>/brand.md` : palette, typo, variantes de logo, **à ne pas
  faire**. S'il y a déjà un `.tsx` dans le projet, le lire comme référence.
- Lire `brands/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** des cartes (ne pas inventer de chiffres ni de promesses). Absent ->
  demander le ton et le message plutôt que de deviner.

## 2. Contraintes LinkedIn (à respecter)

| Point | Valeur | Statut |
|---|---|---|
| Nombre de cartes | 2 à 10 (sweet spot 3-5) | Officiel LinkedIn |
| Ratio | **1:1 uniquement** | Officiel LinkedIn |
| Taille / carte | **1080x1080** (max 4320x4320) | Officiel LinkedIn |
| Format | JPG ou PNG (GIF non animé) | Officiel LinkedIn |
| Poids / carte | ≤ 10 Mo | Officiel LinkedIn |
| Headline / carte | ≤ 45 caractères | Officiel LinkedIn |

- **Le 1:1 est imposé** : pas de 4:5 ni 9:16 en carousel ad LinkedIn (différence
  avec Facebook). Toutes les cartes au même format.
- Le **texte d'intro** et les headlines/liens se règlent dans Campaign Manager,
  **pas dans l'image** : une idée par carte.

## 3. L'esprit : agencer pour que ça pope

### Mécaniques narratives (choisir UNE)
- **Story séquentielle** : hook -> problème -> solution -> preuve -> CTA.
- **Une carte = un produit / une offre** : chaque carte lisible seule, fond et
  position constants.
- **Top N / tips** : carte 1 = titre, cartes 2..N = un item, dernière = CTA.
  Numéroter les cartes.
- **Tuto pas-à-pas** : une étape par carte, visuel auto-portant.
- **Avant / après** : contraste fort entre première et dernière carte.

### Carte 1 = hook
Seule pleinement visible avant le swipe : **un seul message**, fort contraste, un
élément qui crée la curiosité. Ne pas tout expliquer ici.

### Cohérence inter-cartes (le cœur)
Palette et typo identiques ; **logo en position fixe et discrète** ; placements
constants ; **fil conducteur visuel** (couleur ou repère de progression) ; chaque
carte lisible de façon autonome.

### Ton LinkedIn
Audience **professionnelle** : registre valeur ajoutée (insight, donnée, bénéfice
métier, preuve), CTA mesuré. Éviter le ton « promo agressive ».

### CTA croissant
Doux au début, **conversion sur la dernière carte**. Chaque carte a son propre
lien dans Campaign Manager.

## 4. Écrire les cartes

Structure : **un sous-dossier par carrousel**, **un `.tsx` par carte**, plus un
`theme.ts` partagé.

```
templates/<projet>/<nom>/
  theme.ts        <- palette + layout partages (TS pur, PAS de JSX)
  card-1.tsx      <- une carte = un PNG (1080x1080)
  card-2.tsx
  card-3.tsx
```

- **`theme.ts` factorise la cohérence** (palette, `SIZE`, marges). **TS pur sans
  JSX** : la découverte ne charge que les `.tsx`, donc `theme.ts` est ignoré.
  **Ne pas** créer de composant de cadre en `.tsx` dans ce dossier : il serait
  découvert comme une fausse carte et casserait le build. Le peu de JSX de cadre
  est répété dans chaque carte.
- **Nommage et ordre** : tri **lexical** -> `card-10` passe avant `card-2`. Dès
  10 cartes, **padder** : `card-01` … `card-10`.
- Couleurs depuis `theme.ts`, assets via `brand("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
  manquante » de `new-template`, jamais en silence.

### `theme.ts` (squelette)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // carousel ad LinkedIn, 1:1
export const TOTAL = 4; // nombre de cartes (index + progression)

// Palette charte <Projet> (depuis brands/<projet>/brand.md).
export const INK = "#......";
export const ACCENT = "#......";
export const PAPER = "#......";

// Cadre commun a toutes les cartes : meme fond, meme zone de securite.
export const frame: CSSProperties = {
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	padding: 90, // zone de securite
	backgroundColor: INK, // fond opaque, identique partout
};
```

### `card-1.tsx` (squelette)

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../../src/template";
import { SIZE, frame, PAPER, ACCENT } from "./theme";

function render(): ReactNode {
	return (
		<div style={frame}>
			{/* logo en position fixe (meme coin sur toutes les cartes) */}
			{/* hook : un seul message, fort contraste */}
			{/* repere de progression (ex. 1/4) */}
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
```

(Sans `title`, le PNG sort sous le nom du fichier : `out/<projet>/<nom>/card-1.png`.)

## 5. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<nom>/card-*.png`.
- Contrôler **chaque** PNG : **1080×1080** (1:1 partout), fond opaque, ≤ 10 Mo
  (trivial en rendu flat).
- Vérifier la **cohérence visuelle** (palette, typo, logo, fil conducteur) et que
  **chaque carte est lisible seule**.
- Preview : `npm run dev` puis `/<projet>/<nom>`.

**Critère de succès** : N cartes (2-10) en 1:1 1080×1080, opaques, visuellement
cohérentes, carte 1 accrocheuse, dernière carte porteuse du CTA, ton
professionnel, et n'utilisant que des couleurs/typo de `brand.md`.
