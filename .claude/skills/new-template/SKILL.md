---
name: new-template
description: Scaffolde un nouveau visuel (.tsx) dans un projet OgArtisan existant, aligne sur sa charte brand.md. A utiliser quand l'utilisateur veut creer une nouvelle image/couverture/banniere/OG dans un projet ("nouveau visuel", "ajoute une couverture pour X", "cree l'OG de Y"). Lit obligatoirement assets/<projet>/brand.md et refuse si absente.
---

# new-template — scaffold d'un visuel

Objectif : creer `src/templates/<projet>/<nom>.tsx` conforme au contrat
`Template` et **aligne sur la charte du projet**.

## 1. Resoudre `<projet>` et `<nom>`

Les prendre dans les arguments. Sinon les demander. `<nom>` est un slug
kebab-case (ex. `cover`, `og-home`, `banniere-linkedin`). Verifier que
`src/templates/<projet>/<nom>.tsx` n'existe pas deja.

## 2. Lire la charte — bloquant

**Lire `assets/<projet>/brand.md`.** Si le fichier n'existe pas -> **STOP** :
ne pas produire de visuel, dire a l'utilisateur de lancer `/new-project <projet>`
d'abord. C'est la regle de CLAUDE.md, sans exception.

En lisant la charte, extraire : palette (roles + hex), typo/graisses, variantes
de logo/favicon et leurs regles, et les **a ne pas faire**.

## 3. S'appuyer sur l'existant

S'il y a deja un `.tsx` dans `src/templates/<projet>/`, le lire comme reference
de style (ex. `cover.tsx`) et matcher ses conventions. Sinon, partir du squelette
ci-dessous.

## 4. Cadrer le visuel (demander, ne pas deviner)

Demander a l'utilisateur :

- **Dimensions** (px). Suggerer un defaut selon l'usage : OG ~1200×630,
  couverture sociale ~1500×500, banniere LinkedIn ~1584×396.
- **Message / contenu** (titre, tagline, elements).
- **Variante de logo** a utiliser (selon le fond, suivre les regles de la charte).

Plusieurs interpretations possibles du brief -> les presenter, ne pas choisir en
silence (principe #1 de CLAUDE.md).

## 5. Ecrire le `.tsx`

Respecter le contrat (`src/template.ts`) et les conventions du projet :

- Couleurs en **constantes nommees tirees de la charte** — ne pas inventer de hex.
- Police : **Sora** uniquement par defaut (graisses 500/700 chargees dans
  `render.ts`). Si la charte impose une autre police absente d'`assets/fonts/`,
  suivre la procedure **Police manquante** ci-dessous — ne jamais l'utiliser en
  silence.
- Assets via `asset("<projet>/...")` (jamais de chemin relatif au cwd ni de
  `../../..`).
- `scale` optionnel dans `size` si un rendu retina est voulu.
- Export par defaut `satisfies Template`.

Squelette de depart :

```tsx
import type { ReactNode } from "react";
import type { Template } from "../../template";
import { asset } from "../../assets";
// import { readFile } from "node:fs/promises"; // si le visuel charge un asset (SVG/PNG)

const SIZE = { width: 1200, height: 630 };

// Palette charte <Projet> (depuis assets/<projet>/brand.md).
const INK = "#......";

// Charger les assets au top-level (data-URI pour les <img> SVG).
// const markSvg = await readFile(asset("<projet>/favicon/icon.svg"));

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* contenu aligne sur la charte */}
		</div>
	);
}

export default { size: SIZE, title: "<Titre humain>", render } satisfies Template;
```

Garder le code minimal (principe #2) : pas d'abstraction pour du single-use, pas
de helper non demande. Si un effet de fond (trame, glow) est repete, le factoriser
localement comme dans `cover.tsx`.

## 6. Verifier

- `npm run typecheck` -> vert.
- Rendu : `npm run build` (ecrit le PNG) ou pointer l'utilisateur vers
  `npm run dev` puis `/<projet>/<nom>` pour la preview.

**Critere de succes** : le fichier typecheck, rend un PNG, et n'utilise que des
couleurs/typo issues de `brand.md`.

## Annexe — police manquante

Si la charte impose une police qui n'est pas dans `assets/fonts/` :

1. **Demander l'autorisation** de la recuperer — action reseau sortante, jamais
   en silence. Nommer la **source** et la **licence** avant de telecharger.
2. **Source fiable, format ttf/otf** (Satori ne lit pas le woff2) : le `.ttf`
   brut du repo officiel (`github.com/google/fonts`) ou un package
   `@fontsource/<police>`. La plupart des Google Fonts sont en OFL/Apache -> OK.
   Police proprietaire ou licence ambigue -> **refuser** et demander a
   l'utilisateur de fournir le fichier lui-meme.
3. **Telecharger** vers `assets/fonts/<Police>-<graisse>.ttf` (convention de
   nommage existante), via `curl -L <url> -o ...` ou `Invoke-WebRequest -OutFile`.
   WebFetch ne convient pas (binaire).
4. **Verifier le fichier** : taille non nulle et entete de vraie police
   (`.ttf` commence par `00 01 00 00`, OpenType par `OTTO`) — pas une page
   d'erreur HTML deguisee, qui ferait planter Satori a l'execution.
5. **Enregistrer dans `src/render.ts`** : ajouter au tableau `fonts` une entree
   `{ name, weight, style, data: await readFile(asset("fonts/<fichier>")) }`.
   Sans cette declaration, le fichier sur disque est inutile.
6. **Confirmer avant de commit** le `.ttf` (binaire) avec l'utilisateur.

Si l'utilisateur refuse le telechargement -> ne pas utiliser la police ; lui
demander de deposer le fichier dans `assets/fonts/`, ou rester sur Sora.
