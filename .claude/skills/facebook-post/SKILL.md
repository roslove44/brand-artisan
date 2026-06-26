---
name: facebook-post
description: Crée une image de publication Facebook (post image / affiche / visuel publicitaire simple sur le fil) aux dimensions Meta, dans l'orientation choisie. À utiliser quand l'utilisateur veut une "image Facebook", un "post Facebook", une "affiche", un "visuel publicitaire" ou une "publication" pour un projet. Demande l'orientation (portrait par défaut, carré, paysage) et produit un template .tsx au bon ratio, aligné sur la charte, rendu en PNG via le moteur du projet. Nécessite un projet avec sa brand.md en place.
---

# facebook-post — image de publication Facebook

Objectif : produire l'**asset PNG** d'une image de post Facebook (publication
sur le fil, affiche, visuel publicitaire simple), au **ratio Meta** choisi,
aligné sur la charte.

C'est une spécialisation de `new-template` avec les contraintes Facebook en dur.
Mêmes conventions : contrat `Template` (`src/template.ts`), assets via
`asset()`, polices chargées dans `render.ts`, `export default ... satisfies
Template`.

> **Statut des dimensions.** Meta ne publie **aucune** spec de dimensions pour
> les *posts organiques* : les chiffres ci-dessous viennent des specs du
> **Gestionnaire de publicités** (Ads Guide + pages de placement). Le moteur de
> rendu du fil étant le même, c'est la meilleure référence. Les **ratios** sont
> officiels Meta ; pour le **paysage**, les px sont une convention (Meta ne
> documente pas de résolution pour ce ratio).

## 0. Prérequis — bloquant

La chaîne **projet -> dossier de templates -> charte** doit exister :

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (règle CLAUDE.md).

## 1. Cadrer

- **Orientation ?** Demander. **Défaut : portrait** (4:5, le plus performant sur
  le fil). Sinon carré (1:1) ou paysage (1.91:1).
- Slug par défaut `facebook-post` (ou `facebook-post-<orientation>` si plusieurs
  variantes). Vérifier que le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette (hex), typo, variantes de logo selon
  le fond, et les **à ne pas faire**.
- Lire `assets/<projet>/project.md` s'il existe : caler le **ton** et les
  **claims** (ne pas inventer de chiffres ni de promesses). Absent -> demander
  le ton et le message plutôt que de deviner.
- Demander le **message** : titre court + accroche (1 phrase). Pas de paragraphe.
- S'il y a déjà un `.tsx` dans le projet, le lire comme référence de style.

## 2. Contraintes Facebook (à respecter dans le template)

### Dimensions par orientation

| Orientation | Taille (px) | Ratio | Statut |
|---|---|---|---|
| **Portrait** (défaut) | **1440x1800** | 4:5 | Résolution cible Meta (min 1080x1350) |
| **Carré** | **1080x1080** | 1:1 | Minimum officiel Meta |
| **Paysage** | **1080x566** | 1.91:1 | Ratio officiel ; px de convention (alt 1200x628) |

- **Ne pas utiliser le 16:9** en paysage : il n'est **pas** pris en charge sur le
  Fil Facebook. Le paysage supporté est **1.91:1**.
- Largeur minimale officielle : **600 px**. Ne pas descendre en dessous.
- `scale: 2` possible pour un rendu plus net ; inutile aux tailles ci-dessus.

### Mise en page

- **Fond opaque**, jamais de transparence.
- **Zone de sécurité** ~80 px de marge : garder logo et texte vers le centre, le
  fil peut rogner légèrement et arrondir les coins selon le contexte.
- **Lisible en petit** : le fil s'affiche souvent étroit sur mobile. Titre gros,
  accroche courte, fort contraste.
- L'ancienne **règle des 20 % de texte** de Meta est **abandonnée** : pas de
  limite de texte, mais garder une affiche aérée et lisible.

### Format et poids

- **PNG** (ou JPG) : le moteur sort du PNG, net pour le texte/logo.
- Poids max Meta : **30 Mo** — le rendu flat est très loin de cette limite, rien
  à optimiser de particulier.

## 3. Écrire le template

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirées de la charte
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

Conventions communes : assets via `asset("<projet>/...")`, les polices chargées dans `render.ts` ; police absente ->
suivre l'annexe "police manquante" de `new-template`, jamais en silence. Garder
le code minimal (principe #2).

## 4. Vérifier

- `npm run typecheck` -> vert.
- `npm run build` -> écrit `out/<projet>/<slug>.png`.
- Contrôler le PNG : **dimensions exactes** selon l'orientation, fond opaque,
  ratio correct (4:5 / 1:1 / 1.91:1).
- Preview : `npm run dev` puis `/<projet>/<slug>` ; vérifier la lisibilité réduit
  à la largeur d'un fil mobile.

**Critère de succès** : PNG aux dimensions Meta de l'orientation choisie,
opaque, lisible en petit, et n'utilisant que des couleurs/typo de `brand.md`.
