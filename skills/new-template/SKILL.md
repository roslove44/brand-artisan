---
name: new-template
description: Scaffolde un nouveau visuel (.tsx) dans un projet BrandArtisan existant, aligné sur sa charte brand.md. À utiliser quand l'utilisateur veut créer une nouvelle image/couverture/bannière/OG dans un projet ("nouveau visuel", "ajoute une couverture pour X", "crée l'OG de Y"). Lit obligatoirement brands/<projet>/brand.md et refuse si absente.
---

# new-template : scaffold d'un visuel

Objectif : créer `templates/<projet>/<nom>.tsx` conforme au contrat
`Template` et **aligné sur la charte du projet**.

## 1. Résoudre `<projet>` et `<nom>`

Les prendre dans les arguments. Sinon les demander. `<nom>` est un slug
kebab-case (ex. `cover`, `og-home`, `banniere-linkedin`). Vérifier que
`templates/<projet>/<nom>.tsx` n'existe pas déjà.

## 2. Lire la charte (bloquant)

**Lire `brands/<projet>/brand.md`.** Si le fichier n'existe pas -> **STOP** :
ne pas produire de visuel, dire à l'utilisateur de lancer `/new-project <projet>`
d'abord. C'est la règle de CLAUDE.md, sans exception.

En lisant la charte, extraire : palette (rôles + hex), typo/graisses, variantes
de logo/favicon et leurs règles, et les **à ne pas faire**.

## 3. S'appuyer sur l'existant

S'il y a déjà un `.tsx` dans `templates/<projet>/`, le lire comme référence
de style (ex. `cover.tsx`) et matcher ses conventions. Sinon, partir du squelette
ci-dessous.

## 4. Cadrer le visuel (demander, ne pas deviner)

Demander à l'utilisateur :

- **Dimensions** (px). Suggérer un défaut selon l'usage : OG ~1200×630,
  couverture sociale ~1500×500, bannière LinkedIn ~1584×396.
- **Message / contenu** (titre, tagline, éléments). Si
  `brands/<projet>/project.md` existe, le lire pour caler le ton et les claims
  (ne pas inventer de chiffres ni de promesses) ; sinon, demander le ton plutôt
  que de deviner.
- **Variante de logo** à utiliser (selon le fond, suivre les règles de la charte).

Plusieurs interprétations possibles du brief -> les présenter, ne pas choisir en
silence (principe #1 de CLAUDE.md).

## 5. Écrire le `.tsx`

Respecter le contrat `Template` (de `brand-artisan`) et les conventions du
projet :

- Couleurs en **constantes nommées tirées de la charte** : ne pas inventer de hex.
- Polices : celles présentes dans `fonts/`, découvertes automatiquement par
  le moteur. Le nom du fichier donne la famille et la graisse
  (`GeistMono-600.ttf` -> famille `Geist Mono`, graisse 600). Si la charte impose
  une autre police absente de `fonts/`, suivre la procédure **Police manquante**
  ci-dessous : ne jamais l'utiliser en silence.
- Assets via `brand("<projet>/...")` (jamais de chemin relatif au cwd ni de
  `../../..`).
- `scale` optionnel dans `size` si un rendu retina est voulu.
- Export par défaut `satisfies Template`.

Squelette de départ :

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // si le visuel charge un asset (SVG/PNG)

const SIZE = { width: 1200, height: 630 };

// Palette charte <Projet> (depuis brands/<projet>/brand.md).
const INK = "#......";

// Charger les assets au top-level (data-URI pour les <img> SVG).
// const markSvg = await readFile(brand("<projet>/favicon/icon.svg"));

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
de helper non demandé. Si un effet de fond (trame, glow) est répété, le factoriser
localement comme dans `cover.tsx`.

Satori ne couvre qu'un sous-ensemble de CSS : lire l'annexe **pièges Satori**
avant de positionner des calques ou de tenter un effet de texte.

## 6. Vérifier

- `npm run typecheck` -> vert.
- Rendu : `npm run build` (écrit le PNG) ou pointer l'utilisateur vers
  `npm run dev` puis `/<projet>/<nom>` pour la preview.

**Critère de succès** : le fichier typecheck, rend un PNG, et n'utilise que des
couleurs/typo issues de `brand.md`.

## Annexe : pièges Satori

Propriétés CSS que Satori ignore **silencieusement** (aucun warning, le calque
disparaît ou l'effet ne se produit pas) :

- **`inset` n'existe pas.** Un calque avec `position: "absolute", inset: 0`
  n'est jamais rendu. Écrire les quatre propriétés :
  `top: 0, right: 0, bottom: 0, left: 0`.
- **`color: "transparent"` ne rend aucun glyphe**, même combiné à un
  `WebkitTextStroke`. Pour un effet de texte en contour (outline), donner au
  texte un `color` de la couleur du fond : le stroke dessine le contour, le
  fill « troue » visuellement le glyphe.

## Annexe : police manquante

Si la charte impose une police qui n'est pas dans `fonts/` :

1. **Demander l'autorisation** de la récupérer : action réseau sortante, jamais
   en silence. Nommer la **source** et la **licence** avant de télécharger.
2. **Source fiable, format ttf/otf** (Satori ne lit pas le woff2) : le `.ttf`
   brut du repo officiel (`github.com/google/fonts`) ou un package
   `@fontsource/<police>`. La plupart des Google Fonts sont en OFL/Apache -> OK.
   Police propriétaire ou licence ambiguë -> **refuser** et demander à
   l'utilisateur de fournir le fichier lui-même.
3. **Télécharger** vers `fonts/<Famille>-<graisse>.ttf`, via
   `curl -L <url> -o ...` ou `Invoke-WebRequest -OutFile`. WebFetch ne convient
   pas (binaire). Le nom du fichier **fait foi** : il détermine la famille citée
   par les templates, en PascalCase (`GeistMono-600.ttf` -> `Geist Mono`, 600).
4. **Vérifier le fichier** : taille non nulle et en-tête de vraie police
   (`.ttf` commence par `00 01 00 00`, OpenType par `OTTO`), pas une page
   d'erreur HTML déguisée, qui ferait planter Satori à l'exécution.
5. **Documenter la licence** : déposer son texte dans `fonts/` et ajouter
   la ligne correspondante au tableau de `fonts/NOTICE.md`. Aucune
   déclaration de code n'est nécessaire : le moteur découvre le fichier au
   démarrage, à condition que son nom suive la convention de l'étape 3.
6. **Confirmer avant de commit** le `.ttf` (binaire) avec l'utilisateur.

Si l'utilisateur refuse le téléchargement -> ne pas utiliser la police ; lui
demander de déposer le fichier dans `fonts/`, ou rester sur une police
déjà présente dans `fonts/`.
