# BrandArtisan

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
http://localhost:4000/                   → liste les projets
http://localhost:4000/calame/og          → page d'aperçu (re-rendue à chaque refresh)
http://localhost:4000/calame/og?raw      → le PNG brut
```

`npm run build` exporte le tout dans `out/<projet>/`, prêt à uploader.

Trois règles Satori à connaître :

- **Tout élément à plusieurs enfants doit être en `display: flex`** : c'est la
  cause n°1 d'erreur de rendu.
- **Les polices sont explicites** : dépose `<Famille>-<graisse>.ttf` dans
  `fonts/` (ex. `Sora-700.ttf`), c'est tout ce qu'il faut pour l'enregistrer.
- Une image s'inclut en data URI (`<img src="data:image/svg+xml;base64,…">`),
  pas par chemin de fichier.

## Avec un agent IA

BrandArtisan livre des **skills** qui encodent les dimensions officielles des
plateformes, les zones sûres et la discipline « rien hors charte ». Elles
s'installent dans l'agent que tu utilises :

```bash
npx skills add roslove44/brand-artisan -s "*"
```

`-s "*"` prend tout le jeu ; sans lui, une liste te laisse choisir. Le
[CLI `skills`](https://github.com/vercel-labs/skills) sait où Claude Code,
Cursor, Copilot et une vingtaine d'autres agents rangent les leurs, et note la
source dans `skills-lock.json` pour qu'un collègue les installe dans le sien.
Sous Claude Code, on peut aussi ajouter ce dépôt comme marketplace de plugins :
`/plugin marketplace add roslove44/brand-artisan`.

```text
/new-project ma-marque       pose la charte (brand.md) par interview
/import-reference            dérive la charte de tes visuels existants, mesurés au pixel
/og-image ma-marque          image Open Graph 1200×630
/linkedin-post, /facebook-post, /x-post…    visuels aux specs de chaque plateforme
/campagne ma-marque          kit multi-plateformes à partir d'un seul brief
/brand-assets ma-marque      génère logo, favicon et déclinaisons
```

L'agent lit ta charte, pose les questions manquantes, et produit des `.tsx`
vérifiables (`npm run typecheck`, `npm run build`). Tout reste faisable à la
main : l'IA est un accélérateur, pas un prérequis.

## Un projet = une charte

Chaque marque est un projet : sa référence dans `brands/<projet>/` (`brand.md` :
palette, logo, typographie ; `project.md` : ton, public, claims), ses visuels
dans `templates/<projet>/`. **`brand.md` est bloquant** : pas de visuel sans
charte, c'est ce qui empêche (humain comme IA) d'inventer des couleurs ou de
recomposer un logo au jugé.

Une toolchain à part (`tools/<projet>/`) génère les assets que le rendu ne sait
pas produire : logotype en SVG tracé depuis les glyphes de la police, favicons
multi-tailles, `.ico`. Détails :
[`tools/README.md`](https://github.com/roslove44/brand-artisan/blob/main/tools/README.md).

## La CLI

```text
brand-artisan dev                       serveur de rendu sur http://localhost:4000
brand-artisan build                     exporte templates/ dans out/
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
palette).

## Contribuer

Setup, commandes du dépôt, filet de tests et conventions :
[`CONTRIBUTING.md`](https://github.com/roslove44/brand-artisan/blob/main/CONTRIBUTING.md).

## Licence

[MIT](https://github.com/roslove44/brand-artisan/blob/main/LICENSE), avec deux
exceptions : les **polices** de `fonts/` sont sous SIL Open Font License 1.1
([`fonts/NOTICE.md`](https://github.com/roslove44/brand-artisan/blob/main/fonts/NOTICE.md)),
et les **marques d'exemple du dépôt** relèvent du droit des marques : elles
illustrent la méthode, elles ne sont pas réutilisables. Calame, la marque
fictive du squelette généré, est l'exception voulue : elle est là pour servir
de point de départ.
