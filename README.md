# OgArtisan

Atelier dédié à la **fabrication d'images à partir de code** : couvertures
sociales, images Open Graph, bannières, visuels de partage. Tu écris une mise en
page en JSX, tu obtiens un PNG. Aucun serveur, aucun navigateur, aucune dépendance
applicative.

C'est aussi un atelier : un endroit où essayer des compositions, garder les
versions qui marchent comme templates réutilisables, et exporter le PNG final
prêt à déposer où tu veux (un dépôt applicatif, les réseaux, etc.).

## Comment ça marche

Une image est juste du **JSX** (le même que tu écris dans un composant React),
transformé en PNG par deux librairies :

```
   ton JSX  ──►  Satori  ──►  SVG  ──►  resvg  ──►  PNG
                (layout)              (rasterisation)
```

C'est exactement le moteur interne de `next/og` / `ImageResponse`, mais sorti de
son emballage Next. Tu écris une mise en page en flexbox, tu obtiens un fichier.

`react` n'est présent que pour fournir le runtime JSX (`react/jsx-runtime`) ;
il n'y a ni `react-dom` ni rendu côté client.

## Installation

```bash
npm install
```

Si une version refuse de s'installer, repinner les libs de rendu au dernier
état : `npm install satori @resvg/resvg-js`.

## Usage

```bash
npm run dev        # serveur de rendu HTTP (arborescence navigable, comme Next)
npm run build      # export fichier : rend toute l'arborescence dans out/
npm run typecheck  # vérification TypeScript (tsc)
```

### Mode dev (URLs, comme Next)

`npm run dev` lance un serveur sur `http://localhost:4000`. L'arborescence de
`src/templates/` est navigable, comme des routes Next imbriquées :

```
http://localhost:4000/                     → liste les projets
http://localhost:4000/comptaopen           → liste images + sous-projets
http://localhost:4000/comptaopen/cover     → page de preview (titre parlant)
http://localhost:4000/comptaopen/cover?raw → PNG brut (utilisable comme src)
http://localhost:4000/comptaopen/cover?w=1245&h=527 → override de la taille
```

Le `<title>` de la page vient du `title` du template (libellé humain), ou à
défaut du nom de fichier capitalisé. Ce même libellé sert d'`alt` à l'`<img>`, et
sa version normalisée (slug) de nom de fichier quand tu télécharges le PNG (`?raw`),
pour que « enregistrer sous » propose un nom propre.

Modifie un template, sauvegarde, rafraîchis le navigateur : l'image est re-rendue
(le serveur réimporte le template à chaque requête).

### Mode build (export)

`npm run build` parcourt l'arborescence de `templates/` et écrit les PNG finaux
(à la taille exacte du template) dans `out/`, sous le dossier du projet et nommés
d'après le titre normalisé (même règle que le téléchargement du serveur) :
`out/comptaopen/couverture-sociale-comptaopen.png`. Prêts à uploader.

## Toolchain de marque (Python)

À côté du moteur TS (qui **compose** des visuels), une toolchain Python **génère
les assets de marque** d'un projet (logo, favicon et leurs déclinaisons), dans
`src/tools/`. Environnement géré par **uv** (Python épinglé à 3.12 pour
`skia-python`). Commandes, depuis la racine :

```bash
uv sync                                                # une seule fois : env + deps

uv run python src/tools/comptaopen/build_logo.py       # -> out/comptaopen/withtool/logo/
uv run python src/tools/comptaopen/build_favicon.py    # -> out/comptaopen/withtool/favicon/
uv run python src/tools/comptaopen/build_oauth.py      # -> out/comptaopen/withtool/favicon/oauth/ (120px Google OAuth)
```

La sortie va dans `out/<projet>/withtool/` (éphémère) ; promouvoir les fichiers
validés vers `assets/<projet>/`. Détails dans
[`src/tools/README.md`](src/tools/README.md).

## Structure

| Chemin | Rôle |
|---|---|
| `src/render.ts` | Cœur du rendu. `toPng(node, size)` fait JSX -> SVG -> PNG (buffer) ; `renderToFile(...)` écrit dans `out/`. Rend à la taille exacte (`scale: 1`) par défaut ; passer `scale: 2` pour du retina. |
| `src/discover.ts` | Auto-découverte : scanne `templates/` (dossier = projet, `.tsx` = image), résout une URL en noeud, charge un template. |
| `src/template.ts` | Le type `Template` : ce que chaque `.tsx` exporte par défaut (`{ size, title?, render }`). |
| `src/utils.ts` | Helpers purs partagés (échappement HTML, capitalize, slug, manipulation de chemin). |
| `src/serve.ts` | Serveur de dev HTTP : routing récursif sur l'arbre, pages de listing + preview (`npm run dev`). |
| `src/templates/` | Arborescence des visuels. Un dossier = un projet/groupe, un `.tsx` = une image. Chaque `.tsx` exporte `{ size, title?, render }` par défaut et charge ses propres assets. |
| `src/build.ts` | Export fichier : parcourt l'arbre, écrit chaque PNG dans `out/<projet>/<slug-du-titre>.png` (`npm run build`). |
| `assets/fonts/` | Polices fournies en dur (Satori n'accède à aucune police système). |
| `out/` | PNG générés. Ignoré par git (rien à versionner ici). |

## Ajouter un nouveau visuel

1. Créer le fichier sous le projet voulu, p.ex. `src/templates/comptaopen/og.tsx`
   (un nouveau dossier sous `templates/` = un nouveau projet, et il peut contenir
   des sous-dossiers).
2. Exporter le template par défaut, qui charge lui-même ses assets :
   ```tsx
   import type { Template } from "../../template";

   const SIZE = { width: 1200, height: 630 };

   function render() {
     return ( /* ton JSX */ );
   }

   export default { size: SIZE, title: "Nom lisible du visuel", render } satisfies Template;
   ```
3. C'est tout : `http://localhost:4000/comptaopen/og` en dev, et `npm run build`
   le sort dans `out/comptaopen/<slug-du-titre>.png`. Aucun registre à éditer, la
   découverte est automatique.

## Formats de référence

| Usage | Dimensions | Ratio |
|---|---|---|
| Couverture panoramique | 1500 x 500 | 3:1 |
| Open Graph / partage de lien | 1200 x 630 | 1.91:1 |
| Header X (Twitter) | 1500 x 500 | 3:1 |
| Bannière LinkedIn (profil) | 1584 x 396 | 4:1 |
| Couverture Facebook | 820 x 312 | 2.63:1 |

Les plateformes recadrent différemment : garder le contenu important dans une
**zone centrale safe**, jamais collé aux bords.

## À savoir sur Satori

- **Polices obligatoires et explicites** : aucune font système, d'où `assets/fonts/`.
- **Tout élément avec plusieurs enfants doit être en `display: flex`** (Satori ne
  supporte pas le flux de blocs normal). C'est la cause n°1 d'erreur de rendu.
- Une image s'inclut via `<img src="data:image/svg+xml;base64,...">` (chemin
  éprouvé), pas via un chemin de fichier.
- Satori ne mesure pas finement le texte : pour un titre à longueur variable, on
  choisit la taille de police par paliers plutôt que de compter sur l'auto-fit.

## Templates existants

### `cover` (ComptaOpen)

Premier visuel de l'atelier : la couverture sociale de ComptaOpen (1500 x 500).
Pour le projet ComptaOpen, la charte de marque (couleurs, logotype, police Sora,
règles d'usage) fait référence à
[`assets/comptaopen/brand.md`](assets/comptaopen/brand.md), appliquée directement
dans `src/templates/comptaopen/cover.tsx`. Repère rapide :

| Rôle | Hex | Usage |
|---|---|---|
| Encre | `#0f172a` | Texte sombre, fonds profonds |
| Bleu | `#1d4ed8` | Couleur d'action, accent principal |
| Bleu clair | `#60a5fa` | « Open » et accents sur fond sombre |
| Papier | `#f8fafc` | Texte clair sur fond sombre |

Police **Sora** (700 titres, 500 texte courant). L'orange/amber reste un accent
secondaire, jamais un fond saturé.
