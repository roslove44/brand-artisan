---
name: x-carousel
description: Crée les cartes d'un carousel ad X / Twitter aux dimensions X, comme une série de visuels cohérents. À utiliser quand l'utilisateur veut un "carrousel X", une "publicité carrousel Twitter" ou "plusieurs cartes qui défilent" pour un projet X. Produit N templates .tsx (une carte = un PNG) dans un sous-dossier dédié, partageant une charte commune, alignés sur la brand.md. Nécessite un projet avec sa brand.md en place.
---

# x-carousel : cartes d'un carousel ad X / Twitter

Objectif : produire les **assets PNG des N cartes** d'un **carousel ad** X
(Twitter Ads), au ratio choisi, cohérents entre eux et alignés sur la charte. Un
carrousel n'est pas N images indépendantes : c'est une **série** qui raconte
quelque chose. La cohérence inter-cartes est le cœur du livrable.

C'est une spécialisation de `new-template`. Mêmes conventions : contrat
`Template`, assets via `brand()`, polices chargées dans `render.ts`,
`export default ... satisfies Template`. Même modèle que `facebook-carousel`.

> **Carousel ad.** X n'a pas de « carrousel organique » : un tweet ne porte que
> **1 à 4 images** affichées en mosaïque (non documentée). Ce que cette skill
> produit, ce sont les **cartes d'un carousel publicitaire** (X Ads).

## 0. Prérequis (bloquant)

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `templates/<projet>/` **et** `brands/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer (demander, ne pas deviner)

- **Nom du carrousel** : slug kebab-case, défaut `x-carousel`. C'est le
  **sous-dossier** `templates/<projet>/<nom>/`. Vérifier qu'il n'existe pas.
- **Ratio** : **1:1 (1080×1080)** ou **1.91:1 (1200×628)**. Le **même pour toutes
  les cartes** (obligatoire).
- **Mécanique narrative** (voir §3) : story, une carte = un produit, top N, tuto,
  avant/après.
- **Nombre de cartes** : **2 à 6** (limite X).
- **Contenu de chaque carte** : message court + rôle (hook, développement, CTA).
- Lire `brands/<projet>/brand.md` : palette, typo, variantes de logo, **à ne pas
  faire**.
- Lire `brands/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** des cartes (ne pas inventer de chiffres ni de promesses). Absent ->
  demander le ton et le message plutôt que de deviner.
- S'il y a déjà un `.tsx` dans le projet, le lire comme référence.

## 2. Contraintes X (à respecter)

| Point | Valeur | Statut |
|---|---|---|
| Nombre de cartes | **2 à 6** | Officiel X |
| Ratio | 1:1 **ou** 1.91:1, **homogène** | Officiel X |
| Taille 1:1 | **1080x1080** (X recommande 800x800) | Officiel X |
| Taille 1.91:1 | **1200x628** (X recommande 800x418) | Officiel X |
| Format | PNG ou JPG | Officiel X |
| Poids / carte | ≤ 5 Mo | Officiel X |

- **Ratios homogènes** : interdiction de mélanger 1:1 et 1.91:1 dans un même
  carrousel.
- Le **texte du tweet** et les titres de carte se règlent dans X Ads, **pas dans
  l'image** : une idée par carte.

## 3. L'esprit : agencer pour que ça pope

### Mécaniques narratives (choisir UNE)
- **Story séquentielle** : hook -> problème -> solution -> CTA.
- **Une carte = un produit / une offre** : chaque carte lisible seule.
- **Top N / tips** : carte 1 = titre, cartes 2..N = un item, dernière = CTA.
- **Tuto pas-à-pas** : une étape par carte, visuel auto-portant.
- **Avant / après** : contraste fort entre première et dernière carte.

### Carte 1 = hook
Seule pleinement visible avant le swipe : **un seul message**, fort contraste, un
élément qui crée la curiosité. Ne pas tout expliquer ici.

### Cohérence inter-cartes (le cœur)
Palette et typo identiques ; **logo en position fixe et discrète** ; placements
constants ; **fil conducteur visuel** (couleur ou repère de progression) ; chaque
carte lisible de façon autonome.

### Ton X
Direct, percutant, concis. CTA croissant : doux au début, **conversion sur la
dernière carte**. Chaque carte a son propre lien dans X Ads.

## 4. Écrire les cartes

Structure : **un sous-dossier par carrousel**, **un `.tsx` par carte**, plus un
`theme.ts` partagé.

```
templates/<projet>/<nom>/
  theme.ts        <- palette + layout partages (TS pur, PAS de JSX)
  card-1.tsx      <- une carte = un PNG
  card-2.tsx
  card-3.tsx
```

- **`theme.ts` factorise la cohérence** (palette, `SIZE`, marges). **TS pur sans
  JSX** : la découverte ne charge que les `.tsx`, donc `theme.ts` est ignoré.
  **Ne pas** créer de composant de cadre en `.tsx` dans ce dossier : il serait
  découvert comme une fausse carte et casserait le build.
- **Nommage et ordre** : tri **lexical**. Avec 6 cartes max, `card-1` … `card-6`
  reste correctement ordonné (pas besoin de padding).
- Couleurs depuis `theme.ts`, assets via `brand("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
  manquante » de `new-template`, jamais en silence.

### `theme.ts` (squelette)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // 1:1 (ou 1200x628 pour 1.91:1)
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
- Contrôler **chaque** PNG : dimensions exactes selon le ratio, **même ratio
  partout**, fond opaque, ≤ 5 Mo (trivial en rendu flat).
- Vérifier la **cohérence visuelle** (palette, typo, logo, fil conducteur) et que
  **chaque carte est lisible seule**.
- Preview : `npm run dev` puis `/<projet>/<nom>`.

**Critère de succès** : 2 à 6 cartes au même ratio (1:1 ou 1.91:1), opaques,
visuellement cohérentes, carte 1 accrocheuse, dernière carte porteuse du CTA, et
n'utilisant que des couleurs/typo de `brand.md`.
