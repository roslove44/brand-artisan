---
name: facebook-carousel
description: Crée les cartes d'une publicité carrousel Facebook (carousel ad) aux dimensions Meta, comme une série de visuels cohérents. À utiliser quand l'utilisateur veut un "carrousel Facebook", une "publicité carrousel", un "carousel ad" ou "plusieurs cartes qui défilent" pour un projet. Produit N templates .tsx (une carte = un PNG) dans un sous-dossier dédié, partageant une charte commune, alignés sur la brand.md. Nécessite un projet avec sa brand.md en place.
---

# facebook-carousel : cartes d'un carrousel Facebook

Objectif : produire les **assets PNG des N cartes** d'un carrousel publicitaire
Facebook, au **ratio Meta** choisi, **cohérents entre eux** et alignés sur la
charte. Un carrousel n'est pas N images indépendantes : c'est une **série** qui
raconte quelque chose. La cohérence inter-cartes est le cœur du livrable.

C'est une spécialisation de `new-template`. Mêmes conventions : contrat
`Template` (`src/template.ts`), assets via `brand()`, polices chargées dans
`render.ts`, `export default ... satisfies Template`.

> **Statut des dimensions.** Les specs viennent du **Gestionnaire de publicités**
> Meta (Ads Guide + pages d'aide carrousel) ; il n'existe pas de spec de post
> organique. Les ratios sont officiels Meta ; le « 1080×1080 » est une
> convention (Meta documente 1024×1024 comme minimum recommandé en 1:1).

## 0. Prérequis (bloquant)

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `templates/<projet>/` **et** `brands/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer (demander, ne pas deviner)

- **Nom du carrousel** : slug kebab-case, défaut `carousel`. C'est le
  **sous-dossier** `templates/<projet>/<nom>/`. Vérifier qu'il n'existe pas.
- **Mécanique narrative** (voir §3) : story, une carte = un produit, top N,
  tuto, avant/après, ou seamless. Elle dicte tout le design.
- **Nombre de cartes** : 2 à 10, **sweet spot 3-5**. Si une carte n'ajoute rien,
  la retirer.
- **Ratio** : défaut **1:1 (1080×1080)**. Sinon 4:5 (1080×1350) ou 9:16
  (1080×1920). **Le même pour toutes les cartes** (obligatoire).
- **Contenu de chaque carte** : message court + rôle dans la série (hook,
  développement, CTA). Plus le **CTA** final.
- Lire `brands/<projet>/brand.md` : palette, typo, variantes de logo, **à ne pas
  faire**. S'il y a déjà un `.tsx` dans le projet, le lire comme référence.
- Lire `brands/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** des cartes (ne pas inventer de chiffres ni de promesses). Absent ->
  demander le ton et le message plutôt que de deviner.

## 2. Contraintes Facebook (à respecter)

| Point | Valeur | Statut |
|---|---|---|
| Nombre de cartes | 2 à 10 (sweet spot 3-5) | Officiel Meta |
| Ratio (identique partout) | 1:1, 4:5 ou 9:16 (tolérance 3 %) | Officiel Meta |
| Taille 1:1 | **1080x1080** (min reco Meta 1024) | Convention / Meta |
| Taille 4:5 | 1080x1350 | Officiel Meta |
| Taille 9:16 | 1080x1920 | Officiel Meta |
| Format | PNG ou JPG | Officiel Meta |
| Poids / image | ≤ 30 Mo (viser < 1 Mo) | Officiel Meta |
| Headline / carte | ≤ 40 car. (≤ 25 sans troncature) | Officiel Meta |
| Texte principal | ≤ 125 car. (vit **hors image**) | Officiel Meta |

- **Même ratio sur toutes les cartes** : mélanger 1:1 et 4:5 n'est pas supporté.
- Le **texte principal** et le **headline/lien** se règlent dans le Gestionnaire
  de publicités, **pas dans l'image** : ne pas tout écrire dans le visuel.
- L'ancienne **règle des 20 % de texte** est abandonnée (2021), mais une carte
  surchargée reste illisible sur mobile : **une idée par carte**.

## 3. L'esprit : agencer pour que ça pope

### Mécaniques narratives (choisir UNE)
- **Story séquentielle** : hook -> problème -> solution -> preuve -> CTA. Chaque
  carte fait avancer le récit.
- **Une carte = un produit** : catalogue, gamme, variantes. Position du produit
  et fond constants ; chaque carte lisible seule.
- **Top N / tips** : carte 1 = titre de la liste, cartes 2..N = un item chacune,
  dernière = CTA. Numéroter les cartes.
- **Tuto pas-à-pas** : une étape par carte, visuel auto-portant (compréhensible
  sans lire le texte).
- **Avant / après** : contraste fort entre la première et la dernière carte.
- **Seamless (panoramique)** : voir l'avertissement dédié plus bas.

### Carte 1 = hook (décisive)
Seule visible avant le premier swipe. **Un seul message**, 3-5 mots, fort
contraste, un élément qui crée la curiosité (chiffre sans contexte, visuel qui
« déborde », question). Ne pas tout expliquer ici : ça tue le swipe.

### Cohérence inter-cartes (le cœur)
- **Palette et typo identiques** sur toutes les cartes (un seul accent qui varie
  au besoin).
- **Logo en position fixe et discrète** (même coin partout), jamais en pièce
  maîtresse : l'agrandir sur chaque carte est une erreur fréquente.
- **Placements constants** : si le titre est en bas, il est toujours en bas.
- **Fil conducteur visuel** : élément ou couleur qui relie les cartes ; une
  nuance qui évolue de carte en carte signale la progression.
- **Chaque carte lisible de façon autonome** (un utilisateur peut entrer au
  milieu).

### CTA croissant
Doux au début (« Découvrir »), direct ensuite, **conversion sur la dernière
carte** (« Demander un devis »). Chaque carte a son propre lien dans Meta.

### Erreurs à éviter
Carte 1 trop explicative ; cartes en silo sans fil conducteur ; répéter le même
message ; texte trop dense ; mélanger les ratios ; logo trop gros.

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

- **`theme.ts` factorise la cohérence** : palette tirée de la charte, ratio/SIZE,
  marges. Du **TS pur sans JSX** : la découverte ne charge que les `.tsx`, donc
  `theme.ts` est ignoré comme template. **Ne pas** créer de composant de cadre en
  `.tsx` dans ce dossier : il serait découvert comme une fausse carte et
  casserait le build. La cohérence passe par les constantes ; le peu de JSX de
  cadre est répété dans chaque carte (elles diffèrent de toute façon).
- **Nommage et ordre** : la découverte trie les fichiers en ordre **lexical**,
  donc `card-10` passerait avant `card-2`. Dès qu'on atteint 10 cartes, **padder
  à deux chiffres** : `card-01` … `card-10`.
- Couleurs en constantes (depuis `theme.ts`), assets via `brand("<projet>/...")`,
  les polices chargées dans `render.ts` ; police absente -> annexe
  « police manquante » de `new-template`, jamais en silence.

### `theme.ts` (squelette)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // carrousel 1:1

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
	padding: 96, // zone de securite (~10%)
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
			{/* repere de progression (ex. 1/3) */}
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
```

(Sans `title`, le PNG sort sous le nom du fichier : `out/<projet>/<nom>/card-1.png`.)

### Avertissement : mode seamless (panoramique)

Facebook insère des **gouttières** (bordure + ombre) entre les cartes : une image
panoramique n'est **jamais** parfaitement continue à l'écran. Si l'utilisateur
veut du seamless avec ce modèle (N fichiers) :
- Concevoir mentalement une fresque de `N×1080 × 1080`, et **décaler le fond** de
  `-1080*(i-1)` px dans la carte `i` (chaque carte rend sa tranche).
- **Aucun élément critique** (texte, visage, logo) à moins de **~100 px** d'un
  bord gauche/droit : la gouttière le couperait.
- Dans le Gestionnaire de publicités, **désactiver l'optimisation automatique**
  (« montrer les meilleures cartes en premier ») et importer **de gauche à
  droite**, sinon Meta réordonne et détruit la fresque.
Le seamless est exigeant : par défaut, préférer une mécanique par carte (produit,
story, top N) qui tolère les gouttières.

## 5. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<nom>/card-*.png`.
- Contrôler **chaque** PNG : dimensions exactes selon le ratio choisi, **même
  ratio partout**, fond opaque.
- Vérifier la **cohérence visuelle** sur la série (palette, typo, position du
  logo, fil conducteur) et que **chaque carte est lisible seule**.
- Preview : `npm run dev` puis `/<projet>/<nom>` (liste les cartes du carrousel).

**Critère de succès** : N cartes (2-10) au même ratio Meta, opaques, visuellement
cohérentes, carte 1 accrocheuse, dernière carte porteuse du CTA, et n'utilisant
que des couleurs/typo de `brand.md`.
