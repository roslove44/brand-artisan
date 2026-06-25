---
name: facebook-page
description: Cree les visuels d'une Page Facebook (photo de profil = la marque, et photo de couverture) aux dimensions officielles Facebook. A utiliser quand l'utilisateur veut une "photo de profil Facebook", une "couverture Facebook", une "banniere de page Facebook" ou "le logo de la page FB" pour un projet. Produit un ou deux templates .tsx aux tailles imposees par Facebook (profil 320x320, couverture 851x315), alignes sur la charte, rendus en PNG via le moteur du projet. Necessite un projet avec sa brand.md en place.
---

# facebook-page — visuels d'une Page Facebook

Objectif : produire les **assets PNG** d'une Page Facebook aux dimensions
**officielles** (source : page d'aide Facebook 125379114252045), alignes sur la
charte. Deux visuels possibles, independants :

- **photo de profil** : pour une organisation, c'est la **marque** (320x320,
  rognee en cercle par Facebook) ;
- **photo de couverture** : la banniere haute de la Page (851x315).

C'est une specialisation de `new-template` avec les contraintes Facebook en dur.
Memes conventions : contrat `Template` (`src/template.ts`), assets via
`asset()`, police Sora chargee dans `render.ts`, `export default ... satisfies
Template`.

## 0. Prerequis — bloquant

La chaine **projet -> dossier de templates -> charte** doit exister avant de
commencer :

- Resoudre `<projet>` (arguments, sinon demander).
- Verifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
- Charte ou projet manquant -> **STOP** : demander `/new-project <projet>`
  d'abord. Aucun visuel sans charte (regle CLAUDE.md).

## 1. Cadrer

- **Quel(s) visuel(s) ?** Demander : profil, couverture, ou les deux. Ne pas
  deviner si l'utilisateur n'a pas precise.
- Slugs par defaut : `facebook-profil` (320x320) et `facebook-couverture`
  (851x315). Verifier que le `.tsx` cible n'existe pas.
- Lire `assets/<projet>/brand.md` : palette (hex), typo, **variantes de logo /
  favicon** et leurs regles selon le fond, et les **a ne pas faire**.
- S'il y a deja un `.tsx` dans le projet, le lire comme reference de style et
  matcher ses conventions (couleurs en constantes, effets de fond locaux).

## 2. Contraintes Facebook (a respecter dans le template)

Dimensions **officielles** Facebook (ne pas devier) :

### Photo de profil
- **Taille 320x320** (carre) pour une qualite optimale. `scale: 2` possible si on
  veut un rendu plus net (Facebook re-echantillonne de toute facon).
- **Rognee en cercle** par Facebook : le visuel est carre mais s'affiche en
  rond. **Rien d'important dans les coins** (ils sont coupes). Fond opaque
  **pleine page**, marque **centree**.
- S'affiche petit (176 px ordi, 196 px mobile, 36 px sur mobiles classiques) :
  pour une organisation, utiliser la **marque / le favicon** (ex. bracket-O),
  **pas le wordmark complet** qui deviendrait illisible. Suivre brand.md pour la
  variante et le fond.

### Photo de couverture
- **Taille 851x315** (recommandee, sRGB). Minimum absolu 400x150. Ne pas
  descendre en dessous.
- **Zone sure** : le centre. Facebook recadre les **cotes sur mobile** (format
  2.4:1 -> ~48 px rognes de chaque cote) et l'affichage **ordinateur** est en
  16:9. Garder texte et logo a l'interieur, avec une marge laterale d'au moins
  **~60 px**.
- **Coin bas-gauche libre** : la photo de profil **recouvre** cette zone
  (~40 px de chevauchement sur mobile, davantage sur ordinateur). Ne rien y
  placer d'important.
- **Fond opaque**, jamais de transparence.

### Format et poids (les deux)
- **PNG** : Facebook recommande le PNG des qu'il y a logo ou texte (plus net que
  le JPG) — c'est justement la sortie du moteur.
- **< 100 Ko** pour la couverture (chargement plus rapide). Le rendu flat est
  naturellement leger : privilegier le mark **SVG en data-URI**, eviter
  d'embarquer un gros PNG raster, ne pas gonfler avec `scale`.

## 3. Ecrire le(s) template(s)

`src/templates/<projet>/<slug>.tsx`, couleurs en constantes tirees de la charte
(ne rien inventer). Garder le code minimal (principe #2).

### Profil — squelette

```tsx
import { readFile } from "node:fs/promises";
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";

const SIZE = { width: 320, height: 320 }; // FB profil, rogne en cercle (scale:2 possible)

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const BRAND = "#......";

// Marque adaptee a un petit affichage rond (favicon / bracket-O), pas le wordmark.
const markSvg = await readFile(asset("<projet>/favicon/icon.svg"));
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: BRAND, // fond opaque pleine page (le cercle)
			}}
		>
			{/* marque centree, rien dans les coins (hors cercle) */}
			<img src={markSrc} width={188} height={188} alt="" />
		</div>
	);
}

export default { size: SIZE, title: "Photo de profil Facebook <Projet>", render } satisfies Template;
```

### Couverture — squelette

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si tu charges le mark

const SIZE = { width: 851, height: 315 }; // FB couverture (recommande)

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const INK = "#......";

// Zone sure : marge laterale ~60px (crop mobile 2.4:1), coin bas-gauche libre
// (la photo de profil le recouvre).
const SAFE_X = 60;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				paddingTop: 40,
				paddingBottom: 40,
				paddingLeft: 200, // laisse le coin bas-gauche a la photo de profil
				paddingRight: SAFE_X,
				backgroundColor: INK, // fond opaque
			}}
		>
			{/* logo + accroche courte, dans la zone sure */}
		</div>
	);
}

export default { size: SIZE, title: "Couverture Facebook <Projet>", render } satisfies Template;
```

Conventions communes : assets via `asset("<projet>/...")`, police **Sora**
uniquement (graisses 500/700 chargees dans `render.ts`) ; police absente ->
suivre l'annexe "police manquante" de `new-template`, jamais en silence.

## 4. Verifier

- `npm run typecheck` -> vert.
- `npm run build` -> ecrit `out/<projet>/<slug>.png`.
- Controler chaque PNG : **dimensions exactes** (320x320 / 851x315), fond
  opaque, **< 100 Ko** pour la couverture.
- Profil : verifier mentalement le **rognage en cercle** (rien d'important dans
  les coins) et la lisibilite a ~36 px.
- Couverture : verifier que rien d'important n'est dans le **coin bas-gauche**
  ni dans les **~60 px lateraux**.
- Preview : `npm run dev` puis `/<projet>/<slug>`.

**Critere de succes** : PNG aux dimensions Facebook exactes, opaques, couverture
< 100 Ko, marque (pas wordmark) lisible en petit pour le profil, zone sure
respectee pour la couverture, et uniquement des couleurs/typo de `brand.md`.

## Annexe — poser les visuels sur la Page

Hors perimetre du repo (OgArtisan ne fait que l'image). Cote Facebook :
- Photo de profil : Parametres de la Page -> Photo de profil ; verifier le rendu
  rond et le recadrage propose.
- Photo de couverture : ajouter la banniere ; Facebook propose de repositionner
  — confirmer que le texte reste visible sur mobile (cotes) et que la photo de
  profil ne masque rien d'important en bas a gauche.
