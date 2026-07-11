---
name: linkedin-post
description: Crée une image de publication LinkedIn (post image) aux dimensions LinkedIn, dans l'orientation choisie. À utiliser quand l'utilisateur veut une "image LinkedIn", un "post LinkedIn", un "visuel LinkedIn" ou une "publication LinkedIn" pour un projet. Demande l'orientation (portrait par défaut, carré, paysage) et produit un template .tsx au bon ratio, aligné sur la charte, rendu en PNG via le moteur du projet. Nécessite un projet avec sa brand.md en place.
---

# linkedin-post : image de publication LinkedIn

Objectif : produire l'**asset PNG** d'une image de post LinkedIn, au **ratio**
choisi, aligné sur la charte.

C'est une spécialisation de `new-template` avec les contraintes LinkedIn en dur.
Mêmes conventions : contrat `Template` (`src/template.ts`), assets via
`asset()`, polices chargées dans `render.ts`, `export default ... satisfies
Template`.

> **Statut des dimensions.** LinkedIn ne documente officiellement qu'un visuel à
> **1200×627 (1.91:1)**, pour l'aperçu de **lien** sur les Pages. Pour une image
> postée directement, LinkedIn ne publie **pas** de dimensions : le **carré
> 1080×1080** et le **portrait 1080×1350** sont des **conventions** (reprises des
> specs publicitaires), pas de la doc organique.

## 0. Prérequis (bloquant)

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer

- **Orientation ?** Demander. **Défaut : portrait** (4:5, prend le plus de
  hauteur dans le fil). Sinon carré (1:1) ou paysage (1.91:1).
- Slug par défaut `linkedin-post` (ou `linkedin-post-<orientation>` si plusieurs).
  Vérifier que le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette, typo, variantes de logo, **à ne pas
  faire**.
- Lire `assets/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** (ne pas inventer de chiffres ni de promesses). Absent -> demander
  le ton et le message plutôt que de deviner.
- Demander le **message** : titre court + accroche (1 phrase). Pas de paragraphe.
- S'il y a déjà un `.tsx` dans le projet, le lire comme référence de style.

## 2. Contraintes LinkedIn (à respecter)

| Orientation | Taille (px) | Ratio | Statut |
|---|---|---|---|
| **Portrait** (défaut) | **1080x1350** | 4:5 | Convention (specs ads) |
| **Carré** | **1080x1080** | 1:1 | Convention (specs ads) |
| **Paysage** | **1200x627** | 1.91:1 | Officiel LinkedIn (aperçu de lien) |

- **Format** : PNG ou JPG, fond **opaque**.
- **Texte du post** (corps, lien) : vit **hors image**, dans la publication :
  ne pas tout écrire dans le visuel. **Une idée par carte**.
- **Lisible en petit** : le fil LinkedIn s'affiche étroit sur mobile. Titre gros,
  accroche courte, fort contraste, **zone de sécurité ~80 px**.
- **Ton LinkedIn** : audience professionnelle. Privilégier une accroche à valeur
  ajoutée (insight, donnée, bénéfice métier) plutôt qu'un argumentaire agressif.

## 3. Écrire le template

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirées de la charte.
Choisir `SIZE` selon l'orientation. Squelette :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark

// Choisir selon l'orientation :
const SIZE = { width: 1080, height: 1350 }; // Portrait 4:5 (defaut)
// const SIZE = { width: 1080, height: 1080 }; // Carre 1:1
// const SIZE = { width: 1200, height: 627 };  // Paysage 1.91:1

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

export default { size: SIZE, title: "Post LinkedIn <Projet>", render } satisfies Template;
```

Conventions communes : assets via `asset("<projet>/...")`, les polices chargées dans `render.ts` ; police absente -> annexe « police
manquante » de `new-template`, jamais en silence. Garder le code minimal.

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler le PNG : **dimensions exactes** selon l'orientation, fond opaque,
  ratio correct (4:5 / 1:1 / 1.91:1).
- Preview : `npm run dev` puis `/<projet>/<slug>` ; vérifier la lisibilité réduit
  à la largeur d'un fil mobile.

**Critère de succès** : PNG aux dimensions de l'orientation choisie, opaque,
lisible en petit, ton professionnel, et n'utilisant que des couleurs/typo de
`brand.md`.
