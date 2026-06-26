---
name: x-post
description: Crée une image pour un post X / Twitter (image de tweet) aux ratios X, dans l'orientation choisie. À utiliser quand l'utilisateur veut une "image X", un "visuel Twitter", une "image de tweet" ou un "post X" pour un projet. Demande l'orientation (paysage 16:9 par défaut, carré, portrait) et produit un template .tsx au bon ratio, aligné sur la charte, rendu en PNG via le moteur du projet. Nécessite un projet avec sa brand.md en place.
---

# x-post — image de post X / Twitter

Objectif : produire l'**asset PNG** d'une image de tweet, au **ratio** choisi,
aligné sur la charte.

C'est une spécialisation de `new-template` avec les contraintes X en dur. Mêmes
conventions : contrat `Template`, assets via `asset()`, polices chargées dans
`render.ts`, `export default ... satisfies Template`.

> **Statut des dimensions.** X ne documente **aucune dimension** pour les images
> de tweet organiques — seul le **poids (5 Mo)** est officiel. Les tailles
> ci-dessous sont des **conventions** alignées sur les ratios que X liste pour
> ses formats publicitaires.

## 0. Prérequis — bloquant

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer

- **Orientation ?** Demander. **Défaut : paysage 16:9** (le format classique du
  fil X). Sinon carré (1:1) ou portrait (4:5).
- Slug par défaut `x-post` (ou `x-post-<orientation>` si plusieurs). Vérifier que
  le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette, typo, variantes de logo, **à ne pas
  faire**.
- Lire `assets/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** (ne pas inventer de chiffres ni de promesses). Absent -> demander
  le ton et le message plutôt que de deviner.
- Demander le **message** : titre court + accroche (1 phrase). Pas de paragraphe.

## 2. Contraintes X (à respecter)

| Orientation | Taille (px) | Ratio | Statut |
|---|---|---|---|
| **Paysage** (défaut) | **1600x900** | 16:9 | Convention (ratio ads X) |
| **Carré** | **1080x1080** | 1:1 | Convention (ratio ads X) |
| **Portrait** | **1080x1350** | 4:5 | Convention (ratio ads X) |

- **Format** : PNG ou JPG, fond **opaque**, **≤ 5 Mo** (limite officielle des
  images de tweet ; trivial en rendu flat).
- Le **texte du tweet** vit hors image, dans le post — ne pas tout écrire dans le
  visuel. **Une idée par image.**
- **Lisible en petit** : le fil X défile vite et étroit sur mobile. Titre gros,
  accroche courte, fort contraste, **zone de sécurité ~80 px**.
- **Ton X** : direct, percutant, concis. Le fil récompense l'accroche nette.

## 3. Écrire le template

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirées de la charte.
Choisir `SIZE` selon l'orientation. Squelette :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark

// Choisir selon l'orientation :
const SIZE = { width: 1600, height: 900 }; // Paysage 16:9 (defaut)
// const SIZE = { width: 1080, height: 1080 }; // Carre 1:1
// const SIZE = { width: 1080, height: 1350 }; // Portrait 4:5

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

export default { size: SIZE, title: "Post X <Projet>", render } satisfies Template;
```

Conventions communes : assets via `asset("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
manquante » de `new-template`, jamais en silence. Garder le code minimal.

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler le PNG : **dimensions exactes** selon l'orientation, fond opaque,
  ratio correct (16:9 / 1:1 / 4:5).
- Preview : `npm run dev` puis `/<projet>/<slug>` ; vérifier la lisibilité réduit
  à la largeur d'un fil mobile.

**Critère de succès** : PNG aux dimensions de l'orientation choisie, opaque,
lisible en petit, ton percutant, et n'utilisant que des couleurs/typo de
`brand.md`.
