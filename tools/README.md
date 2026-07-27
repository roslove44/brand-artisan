# tools : toolchain de marque

Génération des **assets de marque** d'un projet (logo, favicon et leurs
déclinaisons). Monde séparé du moteur de composition : ici on **produit** les
fichiers de `brands/<projet>/logo` et `/favicon` ; le moteur les **consomme**
via `brand()`.

## Organisation

```
src/brandkit.ts        socle partagé (police -> contours, SVG -> PNG, .ico)
tools/
  <projet>/            scripts propres à une marque (couleurs, géométrie en dur)
    build-logo.ts
    build-favicon.ts
    _geist.ttf         police source, instanciée par le script
```

Le socle vit avec le moteur, dans `src/` : il est générique. Les scripts par
marque sont du **contenu**, ils vivent ici. Les constantes et la géométrie d'une
marque vivent dans ses scripts, jamais dans `brandkit.ts`.

## Ce que fait le socle

| Fonction | Rôle |
|---|---|
| `loadInstanced(police, axes)` | Charge une police, instanciée sur ses axes si elle est variable, et donne accès aux glyphes : tracé SVG, chasse, encombrement. |
| `renderSvg(svg, taille, fond?)` | Rasterise en PNG à la largeur ou à la hauteur voulue. Le vecteur est mis à l'échelle, rien n'est rogné. |
| `renderPixels(svg, taille)` | Même rendu, en pixels RGBA bruts. Sert aux contrôles de couleur des scripts. |
| `makeIco(images)` | Écrit un `.ico` multi-résolution : en-tête, répertoire, PNG collés. |

Ces quatre primitives suffisent à composer un logotype depuis les glyphes d'une
police, une tuile d'icône, et toutes leurs déclinaisons.

## Lancer

Toutes les commandes se lancent depuis n'importe quel dossier du projet.

```bash
npx tsx tools/rostand-migan/build-logo.ts     # -> out/rostand-migan/brand/logo/
npx tsx tools/rostand-migan/build-favicon.ts  # -> out/rostand-migan/brand/favicon/
```

Une marque peut avoir des scripts en plus des deux standards, propres à son
besoin : `tools/comptaopen/build-oauth.ts` produit par exemple les icônes 120 px
exigées par Google OAuth. Chaque `brand.md` liste les siens dans sa section
« Régénération ».

## Sortie et promotion

Les scripts écrivent dans **`out/<projet>/brand/`** (dossier `out/` ignoré par
git : artefacts éphémères). C'est volontaire : on ne réécrit pas les assets
commités à l'aveugle. L'arborescence y est le miroir exact de
`brands/<projet>/`, si bien que la **promotion** des fichiers validés vers
`brands/<projet>/logo/` et `brands/<projet>/favicon/` est une simple copie.

Pour la revue, `npm run dev` expose cette sortie : le projet gagne un dossier
`brand` à côté de ses visuels (`http://localhost:4000/<projet>/brand`), où
les fichiers produits s'affichent tels quels. Plus besoin d'ouvrir l'explorateur.

Pour écrire directement dans les assets (régénération en place), pointer la
constante `OUT` d'un script vers `brands/<projet>` plutôt que
`out/<projet>/brand`.

## Tests

Le socle est couvert par `test/brandkit.test.ts`, lancé par `npm test` et en CI :
mise à l'échelle du rendu, fond optionnel, structure du `.ico`, extraction de
glyphes. Les scripts par marque n'y figurent pas : la CI ne doit pas dépendre du
contenu présent dans le dépôt.

## Ajouter une marque

Créer `tools/<projet>/` avec ses scripts (s'inspirer de `rostand-migan/`),
réutiliser `src/brandkit.ts` pour la plomberie, et garder couleurs et géométrie
locales.
