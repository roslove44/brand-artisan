# BrandArtisan

Atelier dédié à la **fabrication d'images à partir de code** : couvertures
sociales, images Open Graph, bannières, carrousels, visuels de partage. Tu écris
une mise en page en JSX, tu obtiens un PNG. Aucun serveur, aucun navigateur,
aucune dépendance applicative.

C'est aussi un atelier pensé pour être **piloté par un agent IA** (Claude Code ou
autre) : les conventions du dépôt (charte par projet, skills, contrat de
template) sont écrites pour qu'un agent produise des visuels justes, dans ta
marque, sans rien inventer. Tu peux tout faire à la main ; l'IA est là comme
accélérateur, pas comme prérequis.

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

## Prérequis

**Node.js ≥ 22** et **npm**. C'est tout, et c'est volontaire : un seul
environnement pour composer des visuels comme pour générer les assets de marque.
Versions testées en CI : 22 et 24, sur Linux et Windows.

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
npm test           # tests : helpers purs + chaîne de rendu (node:test)
npm run check      # typecheck + tests, ce que lance la CI
npm run test:consumer  # installe le paquet dans un projet vierge et y rend un visuel

npx brand-artisan colors <image>  # palette d'une image : relever plutôt que deviner
```

`brand-artisan` est aussi la CLI du paquet (`dev`, `build`, `colors`) : c'est par
elle qu'un projet qui installe BrandArtisan lance son rendu.

Les commandes se lancent depuis n'importe quel sous-dossier du projet : les
dossiers de contenu (`brands/`, `templates/`, `fonts/`, `out/`) sont résolus
depuis la racine, celle qui porte le `package.json`.

### Mode dev (URLs, comme Next)

`npm run dev` lance un serveur sur `http://localhost:4000`. L'arborescence de
`templates/` est navigable, comme des routes Next imbriquées :

```
http://localhost:4000/                        → liste les projets
http://localhost:4000/rostand-migan           → liste images + sous-projets
http://localhost:4000/rostand-migan/linkedin-banner-fr     → page de preview
http://localhost:4000/rostand-migan/linkedin-banner-fr?raw → PNG brut (utilisable comme src)
http://localhost:4000/rostand-migan/linkedin-banner-fr?w=1245&h=527 → override de la taille
http://localhost:4000/rostand-migan/brand     → sortie de la toolchain de marque
```

Un projet dont les scripts de marque ont tourné expose un dossier **`brand`** à
côté de ses visuels : c'est `out/<projet>/brand/`, la sortie brute de la
toolchain (logos, favicons, `.ico`). Elle se navigue comme le reste, mais ces
fichiers sont servis tels quels, sans repasser par Satori. Le dossier n'apparaît
pas tant qu'aucun script n'a tourné.

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
`out/rostand-migan/banner-linkedin-rostand-migan-fr.png`. Prêts à uploader.

## Un projet = une charte

Chaque marque (un produit, un profil perso, un client) est un **projet**, avec
deux emplacements jumeaux :

- `brands/<projet>/` : la **référence**. `brand.md` (identité visuelle :
  palette, logotype, typographie, do/don't) et `project.md` (substance et voix :
  pitch, public, ton, claims autorisés), plus les fichiers logo/favicon.
- `templates/<projet>/` : les **visuels** (`.tsx`), qui appliquent la charte.

`brand.md` est **bloquant** : pas de visuel sans charte de référence. C'est ce
qui empêche (humain comme IA) d'inventer des couleurs ou de recomposer un logo
au jugé. Les règles complètes vivent dans [`CLAUDE.md`](CLAUDE.md).

## Travailler avec un agent IA

Le dépôt embarque des **skills** Claude Code (`.claude/skills/`) qui encodent la
recette de chaque livrable : dimensions officielles des plateformes, zones
sûres, contrat de template, discipline « rien hors charte ». Les principaux :

| Skill | Livrable |
|---|---|
| `/new-project` | Initialise un projet : interview, `brand.md`, `project.md` |
| `/import-reference` | Part de tes exemples : dérive une `brand.md` de tes visuels existants, ou reproduit la composition d'une image dans ta charte |
| `/new-template` | Scaffolde un visuel libre dans un projet existant |
| `/og-image` | Image Open Graph 1200×630 |
| `/facebook-page`, `/facebook-post`, `/facebook-carousel` | Visuels Facebook aux specs Meta |
| `/linkedin-page`, `/linkedin-post`, `/linkedin-carousel` | Visuels LinkedIn aux specs officielles |
| `/x-page`, `/x-post`, `/x-carousel` | Visuels X / Twitter |
| `/campagne` | Kit multi-plateformes cohérent à partir d'un seul brief |
| `/brand-assets` | Génère logo/favicon et déclinaisons (toolchain de marque) |

Le flux type : `/new-project ma-marque` (pose la charte), puis
`/og-image ma-marque` ou `/campagne ma-marque`. L'agent lit `brand.md` et
`project.md`, pose les questions manquantes, et produit des `.tsx` vérifiables
(`npm run typecheck`, `npm run build`).

Si ta marque existe déjà en dehors du code (logo, site, anciens visuels),
commence plutôt par `/import-reference` : l'agent mesure tes exemples (palette
au pixel, composition à l'œil) et en amorce la charte, au lieu de te
faire tout décrire de mémoire.

## Projet d'exemple

**`rostand-migan`** est la marque de référence du dépôt : une marque
personnelle, complète de bout en bout. Elle sert d'exemple à imiter, pas de
gabarit à copier.

| Où | Quoi |
|---|---|
| [`brands/rostand-migan/`](brands/rostand-migan/) | La charte : `brand.md`, `project.md`, logo et favicon |
| [`templates/rostand-migan/`](templates/rostand-migan/) | Les visuels : bannières LinkedIn FR et EN |
| [`tools/rostand-migan/`](tools/rostand-migan/) | Les scripts qui produisent son logotype et son monogramme |

C'est le parcours complet d'une marque dans l'outil : une charte écrite, des
assets générés, des visuels composés. Un second projet, `comptaopen` (marque
produit), montre le même schéma à plus grande échelle : carrousels, OG, posts.

Pour démarrer la tienne : `/new-project <ta-marque>`, ou imite cette structure à
la main. La palette et les règles de chaque marque vivent dans sa `brand.md`,
jamais ailleurs.

## Toolchain de marque

À côté du moteur qui **compose** des visuels, une toolchain **génère les assets
de marque** d'un projet : logo, favicon et leurs déclinaisons, dans `tools/`.
Elle produit ce qu'un template ne sait pas faire : des SVG à la géométrie exacte
(logotype tracé depuis les glyphes de la police), des icônes multi-tailles, des
`.ico`.

```bash
npx tsx tools/rostand-migan/build-logo.ts     # -> out/rostand-migan/brand/logo/
npx tsx tools/rostand-migan/build-favicon.ts  # -> out/rostand-migan/brand/favicon/
```

La sortie va dans `out/<projet>/brand/` (éphémère) ; promouvoir les fichiers
validés vers `brands/<projet>/`. Détails dans
[`tools/README.md`](tools/README.md).

## Structure

| Chemin | Rôle |
|---|---|
| `src/index.ts` | Surface publique du paquet : `Template`, `brand()`, `root()`, `toPng()`, `renderToFile()`. C'est ce que résout `import { … } from "brand-artisan"`, ici comme dans un projet qui installe le paquet. |
| `src/render.ts` | Cœur du rendu. `toPng(node, size)` fait JSX -> SVG -> PNG (buffer) ; `renderToFile(...)` écrit dans `out/`. Rend à la taille exacte (`scale: 1`) par défaut ; passer `scale: 2` pour du retina. Découvre aussi les polices de `fonts/` par leur nom de fichier. |
| `src/discover.ts` | Auto-découverte : scanne `templates/` (dossier = projet, `.tsx` = image), résout une URL en noeud, charge un template. |
| `src/template.ts` | Le type `Template` : ce que chaque `.tsx` exporte par défaut (`{ size, title?, render }`). |
| `src/root.ts` | `root("templates/")` : résout un dossier de contenu depuis la **racine du projet** (le dossier qui porte le `package.json`, trouvé en remontant depuis le répertoire courant). |
| `src/brand.ts` | `brand("<projet>/chemin")` : URL absolue vers `brands/`, indépendante de la profondeur de l'appelant. |
| `src/utils.ts` | Helpers purs partagés (échappement HTML, capitalize, slug, manipulation de chemin). |
| `src/serve.ts` | Serveur de dev HTTP : routing récursif sur l'arbre, pages de listing + preview (`npm run dev`). |
| `src/build.ts` | Export fichier : parcourt l'arbre, écrit chaque PNG dans `out/<projet>/<slug-du-titre>.png` (`npm run build`). |
| `templates/` | Arborescence des visuels. Un dossier = un projet/groupe, un `.tsx` = une image. Chaque `.tsx` exporte `{ size, title?, render }` par défaut et charge ses propres assets. |
| `src/brandkit.ts` | Socle de la toolchain de marque : contours de glyphes (fontkit), SVG -> PNG (resvg), écriture de `.ico`. |
| `src/colors.ts` | Mesure les couleurs d'une image (PNG, JPEG, SVG) : sert à relever une palette au lieu de la deviner. CLI : `npx brand-artisan colors <image>`. |
| `src/cli.ts` | Les commandes `dev`, `build` et `colors` de la CLI. |
| `bin/brand-artisan.js` | Point d'entrée de la CLI, seul fichier en JavaScript pur : il enregistre tsx, puis passe la main à `src/cli.ts`. |
| `tools/<projet>/` | Scripts d'une marque : géométrie et couleurs en dur, police source. |
| `brands/<projet>/` | Référence d'une marque : `brand.md`, `project.md`, logo, favicon. |
| `fonts/` | Polices fournies en dur (Satori n'accède à aucune police système), avec leurs licences : [`NOTICE.md`](fonts/NOTICE.md). |
| `test/` | Tests : helpers purs et chaîne de rendu (`npm test`), plus `consumer-check.ts` qui installe le paquet dans un projet vierge (`npm run test:consumer`). |
| `out/` | PNG générés. Ignoré par git (rien à versionner ici). |

## Ajouter un nouveau visuel

1. Créer le fichier sous le projet voulu, p.ex. `templates/rostand-migan/og.tsx`
   (un nouveau dossier sous `templates/` = un nouveau projet, et il peut contenir
   des sous-dossiers).
2. Exporter le template par défaut, qui charge lui-même ses assets :
   ```tsx
   import type { Template } from "brand-artisan";

   const SIZE = { width: 1200, height: 630 };

   function render() {
     return ( /* ton JSX */ );
   }

   export default { size: SIZE, title: "Nom lisible du visuel", render } satisfies Template;
   ```
3. C'est tout : `http://localhost:4000/rostand-migan/og` en dev, et `npm run build`
   le sort dans `out/rostand-migan/<slug-du-titre>.png`. Aucun registre à éditer, la
   découverte est automatique.

Avec Claude Code, `/new-template <projet> <nom>` fait la même chose en
s'assurant de la conformité à la charte.

## Formats de référence

| Usage | Dimensions | Ratio |
|---|---|---|
| Couverture panoramique | 1500 x 500 | 3:1 |
| Open Graph / partage de lien | 1200 x 630 | 1.91:1 |
| Header X (Twitter) | 1500 x 500 | 3:1 |
| Bannière LinkedIn (profil) | 1584 x 396 | 4:1 |
| Couverture Facebook | 851 x 315 | 2.7:1 |

Les plateformes recadrent différemment : garder le contenu important dans une
**zone centrale safe**, jamais collé aux bords. Les specs détaillées par
plateforme (zones mortes, poids, statut officiel ou convention) vivent dans les
skills correspondants (`.claude/skills/`).

## À savoir sur Satori

- **Polices obligatoires et explicites** : aucune font système, d'où `fonts/`.
- **Tout élément avec plusieurs enfants doit être en `display: flex`** (Satori ne
  supporte pas le flux de blocs normal). C'est la cause n°1 d'erreur de rendu.
- Une image s'inclut via `<img src="data:image/svg+xml;base64,...">` (chemin
  éprouvé), pas via un chemin de fichier.
- Satori ne mesure pas finement le texte : pour un titre à longueur variable, on
  choisit la taille de police par paliers plutôt que de compter sur l'auto-fit.

## Licence

Le code (moteur, outils, skills) est sous [licence MIT](LICENSE).

Deux exceptions, qui ne sont pas couvertes par le MIT :

- **Les polices** de `fonts/` sont sous SIL Open Font License 1.1, avec
  leur texte de licence à côté des fichiers :
  [`fonts/NOTICE.md`](fonts/NOTICE.md). Y ajouter une police impose
  d'y déposer aussi sa licence, et de vérifier qu'elle autorise la
  redistribution.
- **Les marques d'exemple** (logos, logotypes, chartes de `brands/<projet>/`)
  relèvent du droit des marques : elles illustrent la méthode, elles ne sont pas
  réutilisables.
