---
name: facebook-post
description: Cree une image de publication Facebook (post image / affiche / visuel publicitaire simple sur le fil) aux dimensions Meta, dans l'orientation choisie. A utiliser quand l'utilisateur veut une "image Facebook", un "post Facebook", une "affiche", un "visuel publicitaire" ou une "publication" pour un projet. Demande l'orientation (portrait par defaut, carre, paysage) et produit un template .tsx au bon ratio, aligne sur la charte, rendu en PNG via le moteur du projet. Necessite un projet avec sa brand.md en place.
---

# facebook-post — image de publication Facebook

Objectif : produire l'**asset PNG** d'une image de post Facebook (publication
sur le fil, affiche, visuel publicitaire simple), au **ratio Meta** choisi,
aligne sur la charte.

C'est une specialisation de `new-template` avec les contraintes Facebook en dur.
Memes conventions : contrat `Template` (`src/template.ts`), assets via
`asset()`, police Sora chargee dans `render.ts`, `export default ... satisfies
Template`.

> **Statut des dimensions.** Meta ne publie **aucune** spec de dimensions pour
> les *posts organiques* : les chiffres ci-dessous viennent des specs du
> **Gestionnaire de publicites** (Ads Guide + pages de placement). Le moteur de
> rendu du fil etant le meme, c'est la meilleure reference. Les **ratios** sont
> officiels Meta ; pour le **paysage**, les px sont une convention (Meta ne
> documente pas de resolution pour ce ratio).

## 0. Prerequis — bloquant

La chaine **projet -> dossier de templates -> charte** doit exister :

- Resoudre `<projet>` (arguments, sinon demander).
- Verifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (regle CLAUDE.md).

## 1. Cadrer

- **Orientation ?** Demander. **Defaut : portrait** (4:5, le plus performant sur
  le fil). Sinon carre (1:1) ou paysage (1.91:1).
- Slug par defaut `facebook-post` (ou `facebook-post-<orientation>` si plusieurs
  variantes). Verifier que le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette (hex), typo, variantes de logo selon
  le fond, et les **a ne pas faire**.
- Demander le **message** : titre court + accroche (1 phrase). Pas de paragraphe.
- S'il y a deja un `.tsx` dans le projet, le lire comme reference de style.

## 2. Contraintes Facebook (a respecter dans le template)

### Dimensions par orientation

| Orientation | Taille (px) | Ratio | Statut |
|---|---|---|---|
| **Portrait** (defaut) | **1440x1800** | 4:5 | Resolution cible Meta (min 1080x1350) |
| **Carre** | **1080x1080** | 1:1 | Minimum officiel Meta |
| **Paysage** | **1080x566** | 1.91:1 | Ratio officiel ; px de convention (alt 1200x628) |

- **Ne pas utiliser le 16:9** en paysage : il n'est **pas** pris en charge sur le
  Fil Facebook. Le paysage supporte est **1.91:1**.
- Largeur minimale officielle : **600 px**. Ne pas descendre en dessous.
- `scale: 2` possible pour un rendu plus net ; inutile aux tailles ci-dessus.

### Mise en page

- **Fond opaque**, jamais de transparence.
- **Zone de securite** ~80 px de marge : garder logo et texte vers le centre, le
  fil peut rogner legerement et arrondir les coins selon le contexte.
- **Lisible en petit** : le fil s'affiche souvent etroit sur mobile. Titre gros,
  accroche courte, fort contraste.
- L'ancienne **regle des 20 % de texte** de Meta est **abandonnee** : pas de
  limite de texte, mais garder une affiche aeree et lisible.

### Format et poids

- **PNG** (ou JPG) : le moteur sort du PNG, net pour le texte/logo.
- Poids max Meta : **30 Mo** — le rendu flat est tres loin de cette limite, rien
  a optimiser de particulier.

## 3. Ecrire le template

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirees de la charte
(ne rien inventer). Choisir `SIZE` selon l'orientation. Squelette :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark (SVG/PNG)

// Choisir selon l'orientation :
const SIZE = { width: 1440, height: 1800 }; // Portrait 4:5 (defaut)
// const SIZE = { width: 1080, height: 1080 }; // Carre 1:1
// const SIZE = { width: 1080, height: 566 };  // Paysage 1.91:1

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const INK = "#......";

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
			{/* logo + titre gros + accroche courte, fort contraste */}
		</div>
	);
}

export default { size: SIZE, title: "Post Facebook <Projet>", render } satisfies Template;
```

Conventions communes : assets via `asset("<projet>/...")`, police **Sora**
uniquement (graisses 500/700 chargees dans `render.ts`) ; police absente ->
suivre l'annexe "police manquante" de `new-template`, jamais en silence. Garder
le code minimal (principe #2).

## 4. Verifier

- `npm run typecheck` -> vert.
- `npm run build` -> ecrit `out/<projet>/<slug>.png`.
- Controler le PNG : **dimensions exactes** selon l'orientation, fond opaque,
  ratio correct (4:5 / 1:1 / 1.91:1).
- Preview : `npm run dev` puis `/<projet>/<slug>` ; verifier la lisibilite reduit
  a la largeur d'un fil mobile.

**Critere de succes** : PNG aux dimensions Meta de l'orientation choisie,
opaque, lisible en petit, et n'utilisant que des couleurs/typo de `brand.md`.
