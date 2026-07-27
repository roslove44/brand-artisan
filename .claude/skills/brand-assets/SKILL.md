---
name: brand-assets
description: Génère ou régénère les assets de marque d'un projet (logo, favicon et leurs déclinaisons) via la toolchain de marque, fidèlement. À utiliser quand l'utilisateur veut "régénérer le logo / le favicon", "ajouter une déclinaison d'icône ou de logo", "une nouvelle variante de marque", ou "mettre en place la toolchain de marque d'un projet". Travaille dans tools/<projet>/ en réutilisant src/brandkit.ts, sort dans out/<projet>/withtool/ puis promotion vers brands/<projet>/. Nécessite un projet avec sa brand.md en place.
---

# brand-assets : génération des assets de marque

Objectif : produire ou faire évoluer les **fichiers de marque** d'un projet
(logo, favicon, icônes, déclinaisons OAuth…) avec la **toolchain de marque**, de
façon **fidèle** à ce qui existe. Monde séparé du moteur TS/Satori : ici on
**produit** les fichiers que `brands/<projet>/logo` et `/favicon` contiennent ;
le moteur les consomme via `brand()`.

> **Env et commandes : voir [`tools/README.md`](../../../tools/README.md).**
> Cette skill ne duplique pas les commandes de lancement (`npx tsx tools/…`).
> Elle encode le **comment bien faire**.

## 0. Prérequis (bloquant)

- Résoudre `<projet>`. Vérifier `brands/<projet>/brand.md` (couleurs, géométrie,
  règles). Charte manquante -> **STOP** : `/new-project <projet>` d'abord.

## 1. Cadrer

Trois cas :
- **Régénérer** un asset existant (la charte ou la géométrie a changé).
- **Ajouter une déclinaison** d'un asset existant (nouvelle couleur, fond, taille,
  ex. les `oauth-120-*`).
- **Amorcer une nouvelle marque** (créer `tools/<projet>/`, voir annexe).

## 2. Discipline de reproduction fidèle (le cœur)

**Ne jamais deviner la géométrie d'un asset existant. L'inspecter d'abord.**
Pour chaque fichier de référence, relever avec `src/colors.ts` :

```bash
npx tsx src/colors.ts brands/<projet>/logo/logo.png
```

Il donne les **dimensions** et la **palette** triée par effectif : le premier
bloc est le fond (transparent ? blanc opaque ?), les suivants les encres et
accents. Pour l'échelle et les marges d'un élément, importer `decode()` et
parcourir les pixels : la **bounding box** de ce qui est peint se calcule en
quelques lignes.

Exemple vécu (déclinaisons OAuth) : la palette a révélé que `mark-white` = arcs
**bleus sur fond blanc** (pas des arcs blancs), et la bbox a donné l'échelle
exacte du bracket-O dans le cadre. C'est ce qui évite un visuel « à peu près ».

## 3. Construire

Dans `tools/<projet>/` (jamais ailleurs) :

- **Réutiliser `src/brandkit.ts`** pour la plomberie générique :
  - `renderSvg(svg, { width } | { height }, fond?)` : SVG -> PNG,
  - `renderPixels(svg, taille)` : mêmes pixels en RGBA, pour les contrôles,
  - `makeIco(images)` : `.ico` multi-résolution,
  - `loadInstanced(police, axes)` : accès aux glyphes (tracé, chasse, bbox).
- **Garder en local** (dans le script de la marque) les **couleurs**, la
  **géométrie** (paths, viewBox) et le **layout**, jamais dans `brandkit.ts`.
- Si une plomberie générique nouvelle est utile à toute marque, l'ajouter à
  `brandkit.ts` (et **mettre à jour `tools/README.md` en miroir**).
- La sortie va dans **`out/<projet>/withtool/`** via la constante `OUT` du
  script. Ne pas écrire directement dans `brands/` (voir §5).

## 4. Valider

Comparer chaque fichier régénéré (dans `out/<projet>/withtool/`) à sa référence
(dans `brands/<projet>/`) : **dimensions**, **bbox** et **palette** doivent
correspondre (de légers écarts d'anticrénelage de bord sont acceptables ; une
différence de couleur, de taille ou de cadrage ne l'est pas). Lancer aussi la
validation pixel intégrée quand elle existe (le favicon imprime un contrôle 32 px).

## 5. Promouvoir

`out/<projet>/withtool/` est **éphémère** (dossier `out/` gitignoré). Après revue
visuelle et validation, **copier** les fichiers retenus vers
`brands/<projet>/logo/` ou `/favicon/`, puis **mettre `brand.md` à jour** si la
liste des variantes change (placement, nouvelles déclinaisons).

**Critère de succès** : les assets régénérés sont fidèles (dimensions/bbox/palette
conformes), produits par un script qui réutilise `brandkit.ts`, et promus dans
`brands/<projet>/` avec une `brand.md` à jour.

## Annexe : amorcer une nouvelle marque

1. Créer `tools/<projet>/` ; s'inspirer de `tools/rostand-migan/`
   (`build-logo.ts`, `build-favicon.ts`).
2. Y déposer la police source si besoin (ex. `_geist.ttf`).
3. Importer le socle : `import { … } from "../../src/brandkit"`. Couleurs et
   géométrie tirées de `brand.md`, jamais inventées.
4. `OUT` -> `out/<projet>/withtool/`. Vérifier, valider, promouvoir.
