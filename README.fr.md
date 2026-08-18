# BrandArtisan

![JSX in, image out. Un fichier .tsx, une image : Open Graph, posts sociaux, bannières, carrousels.](https://raw.githubusercontent.com/roslove44/brand-artisan/main/.github/assets/github-social-preview.png)

[![npm](https://img.shields.io/npm/v/brand-artisan)](https://www.npmjs.com/package/brand-artisan)
[![CI](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml/badge.svg)](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml)
[![licence MIT](https://img.shields.io/badge/licence-MIT-blue)](https://github.com/roslove44/brand-artisan/blob/main/LICENSE)

> 🇬🇧 English version: [README.md](https://github.com/roslove44/brand-artisan#readme)

**Tu sais écrire un composant React ? Alors tu sais déjà produire tes visuels.**
BrandArtisan transforme du JSX en PNG : images Open Graph pour ton site, posts
et bannières LinkedIn, Facebook, X, carrousels. Pas de Figma, pas de navigateur,
pas de serveur : tes visuels sont du code, versionnés avec le reste.

```tsx
import type { Template } from "brand-artisan";

function render() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0e1a2b" }}>
      {/* ta mise en page, en flexbox */}
    </div>
  );
}

export default { size: { width: 1200, height: 630 }, title: "OG du site", render } satisfies Template;
```

Sous le capot, c'est le moteur de `next/og` (Satori + resvg) sorti de son
emballage Next : JSX → SVG → PNG. `react` ne fournit que le runtime JSX, il n'y
a ni `react-dom` ni rendu côté client.

## Démarrer

Prérequis : **Node.js ≥ 22**. Rien d'autre.

```bash
npx create-brand-artisan mes-visuels
cd mes-visuels
npm run dev      # aperçu navigable sur http://localhost:4000
npm run build    # exporte les PNG dans out/
```

Le projet créé ne contient **que ta marque** : chartes (`brands/`), visuels
(`templates/`), scripts d'assets (`tools/`), polices (`fonts/`). Le moteur vit dans `node_modules` et se met
à jour par `npm update`. Un exemple complet est livré (Calame, une marque
fictive) : la première commande produit une image, avant que tu aies écrit quoi
que ce soit.

## Écrire un visuel

Un fichier `.tsx` sous `templates/<projet>/` = une image. Il exporte un
`Template` par défaut (voir ci-dessus) ; la découverte est automatique, aucun
registre à éditer. En dev, chaque visuel a son URL, comme des routes Next :

```text
http://localhost:4000/                               → liste les projets
http://localhost:4000/calame/og                      → page d'aperçu (re-rendue à chaque refresh, fichiers importés compris)
http://localhost:4000/calame/og?raw                  → le PNG brut
http://localhost:4000/calame/linkedin-carousel?pdf   → le PDF assemblé d'un dossier, s'il existe
```

`npm run build` exporte le tout dans `out/<projet>/`, prêt à uploader.

Trois règles Satori à connaître :

- **Tout élément à plusieurs enfants doit être en `display: flex`** : c'est la
  cause n°1 d'erreur de rendu.
- **Les polices sont explicites** : dépose `<Famille>-<graisse>.ttf` dans
  `fonts/` (ex. `Sora-700.ttf`), c'est tout ce qu'il faut pour l'enregistrer.
- Une image s'inclut en data URI (`<img src="data:image/svg+xml;base64,…">`),
  pas par chemin de fichier.

## Carrousels : un dossier de slides, un PDF

Un carrousel est un sous-dossier de cartes qui partagent un thème, un `.tsx`
par slide :

```text
templates/calame/linkedin-carousel/
  theme.ts      palette et gabarit partagés (TS pur, non découvert)
  card-1.tsx    une slide = un PNG, et une page du PDF
  card-2.tsx
  …
```

`npm run build` rend chaque slide en PNG, ce que prend une **publicité**
carrousel (Campaign Manager, une image par carte). Le carrousel LinkedIn
**organique** est un autre animal : celui qui se swipe dans le fil est un *post
document*, et ce qu'on uploade est un unique PDF que LinkedIn pagine en slides.
Les mêmes images attachées directement à un post ressortent en mosaïque de
vignettes, pas en carrousel.

```bash
npm run pdf -- calame/linkedin-carousel    # → out/calame/linkedin-carousel.pdf
```

Une slide par page, chaque page à la taille exacte de sa slide, dans l'ordre
naturel (`card-2` avant `card-10`). La commande refuse d'assembler des slides
aux ratios mélangés : LinkedIn prend le ratio du document entier sur sa première
page, une page dissidente sortirait letterboxée. En dev, la page d'un dossier
propose son PDF dès qu'il existe, et le signale périmé (*out of date*) quand une
slide est plus récente.

## Châssis d'appareils

Le dépôt embarque **72 châssis d'appareils** (téléphones, tablettes, portables,
TV, quelques terminaux métier), chacun avec les coordonnées exactes de son
écran, pour poser une maquette dans un visuel. Ils ne voyagent pas avec le
moteur : copier
[`assets/devices/`](https://github.com/roslove44/brand-artisan/tree/main/assets/devices)
dans le projet, et `frame(slug, width)` met le châssis et sa zone d'écran à
l'échelle ensemble, sans aucun calcul à faire.

Lire d'abord
[`assets/devices/NOTICE.fr.md`](https://github.com/roslove44/brand-artisan/blob/main/assets/devices/NOTICE.fr.md) :
la notice couvre la pose du visuel dans l'écran, la règle du `scale: 2` qui garde
les bords propres, et les droits, puisque la plupart de ces appareils portent des
marques déposées.

## Un projet = une charte

Chaque marque est un projet : sa référence dans `brands/<projet>/` (`brand.md` :
palette, logo, typographie ; `project.md` : ton, public, claims), ses visuels
dans `templates/<projet>/`. **`brand.md` est bloquant** : pas de visuel sans
charte, c'est ce qui empêche (humain comme IA) d'inventer des couleurs ou de
recomposer un logo au jugé.

Une toolchain à part (`tools/<projet>/`) génère les assets que le rendu ne sait
pas produire : logotype en SVG tracé depuis les glyphes de la police, favicons
multi-tailles, `.ico`. `npm run build` ne les couvre pas : chaque script se lance
seul, et écrit dans `out/<projet>/brand/`.

```bash
npx tsx tools/calame/build-logo.ts     # → out/calame/brand/logo/
npx tsx tools/calame/build-favicon.ts  # → out/calame/brand/favicon/
```

Détails :
[`tools/README.md`](https://github.com/roslove44/brand-artisan/blob/main/tools/README.md).

## Avec un agent IA

BrandArtisan livre des **skills** qui encodent les dimensions officielles des
plateformes, les zones sûres et la discipline « rien hors charte ». Elles
s'installent dans l'agent que tu utilises :

```bash
npx skills add roslove44/brand-artisan -s "*" -y
```

`-s "*" -y` prend tout le jeu et l'installe dans les agents détectés sur ta
machine ; sans les drapeaux, une liste te laisse choisir les deux. Le
[CLI `skills`](https://github.com/vercel-labs/skills) sait où Claude Code,
Cursor, Copilot et une vingtaine d'autres agents rangent les leurs. Relance la
commande pour mettre à jour ; un collègue la lance une fois pour avoir le même
jeu.
Sous Claude Code, on peut aussi ajouter ce dépôt comme marketplace de plugins :
`/plugin marketplace add roslove44/brand-artisan`.

Ces skills lisent les fichiers que tu leur désignes, markup SVG compris, et
lancent les commandes du projet. `import-reference` va le plus loin, puisque son
entrée vient de l'extérieur du projet : le contenu d'un fichier y est de la
matière à mesurer, jamais des instructions.

```text
/new-project ma-marque       pose la charte (brand.md) par interview
/import-reference            dérive la charte de tes visuels existants, mesurés au pixel
/og-image ma-marque          image Open Graph 1200×630
/linkedin-post, /facebook-post, /x-post…    visuels aux specs de chaque plateforme
/campaign ma-marque          kit multi-plateformes à partir d'un seul brief
/brand-assets ma-marque      génère logo, favicon et déclinaisons
```

L'agent lit ta charte, pose les questions manquantes, et produit des `.tsx`
vérifiables (`npm run typecheck`, `npm run build`). Tout reste faisable à la
main : l'IA est un accélérateur, pas un prérequis.

## La CLI

```text
brand-artisan dev                       serveur de rendu sur http://localhost:4000
brand-artisan build                     exporte templates/ dans out/
brand-artisan pdf <dossier>             assemble un dossier de slides en PDF (post document LinkedIn)
brand-artisan colors <image> [nombre]   palette d'une image, mesurée plutôt que devinée
```

Les commandes marchent depuis n'importe quel sous-dossier du projet. Les skills
ne font pas partie du moteur : elles s'installent par agent (voir
[Avec un agent IA](#avec-un-agent-ia)) et `npx skills update` les rafraîchit.

## L'API

```ts
import { brand, root, toPng, renderToFile, type Template } from "brand-artisan";
```

| Export | Rôle |
| --- | --- |
| `type Template` | Le contrat d'un visuel : `{ size: { width, height, scale? }, title?, render }`. `scale: 2` pour du retina. |
| `brand(path)` | URL absolue vers `brands/<path>`, prête pour `readFile`. Ex. `brand("calame/logo/logo.svg")`. |
| `root(path)` | URL absolue depuis la racine du projet (le dossier du `package.json` le plus proche). |
| `toPng(node, size)` | JSX → PNG (`Buffer`). |
| `renderToFile(node, size & { out })` | Idem, écrit `out/<out>.png` et retourne le chemin. |

Deux sous-chemins pour l'outillage de marque : `brand-artisan/brandkit`
(contours de glyphes, SVG → PNG, `.ico`) et `brand-artisan/colors` (mesure de
palette et de zone peinte).

## Contribuer

Setup, commandes du dépôt, filet de tests et conventions :
[`CONTRIBUTING.md`](https://github.com/roslove44/brand-artisan/blob/main/CONTRIBUTING.md).

## Licence

[MIT](https://github.com/roslove44/brand-artisan/blob/main/LICENSE), avec une
exception : les **polices** de `fonts/` sont sous SIL Open Font License 1.1
([`fonts/NOTICE.md`](https://github.com/roslove44/brand-artisan/blob/main/fonts/NOTICE.md)).
Calame, la marque de démonstration du dépôt, est couverte par MIT comme le
reste : elle est fictive, et elle est là pour servir de point de départ.
