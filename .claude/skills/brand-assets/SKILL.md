---
name: brand-assets
description: Génère ou régénère les assets de marque d'un projet (logo, favicon et leurs déclinaisons) via la toolchain Python, fidèlement. À utiliser quand l'utilisateur veut "régénérer le logo / le favicon", "ajouter une déclinaison d'icône ou de logo", "une nouvelle variante de marque", ou "mettre en place la toolchain de marque d'un projet". Travaille dans src/tools/<projet>/ en réutilisant src/tools/brandkit/, sort dans out/<projet>/withtool/ puis promotion vers brands/<projet>/. Nécessite un projet avec sa brand.md en place.
---

# brand-assets : génération des assets de marque (Python)

Objectif : produire ou faire évoluer les **fichiers de marque** d'un projet
(logo, favicon, icônes, déclinaisons OAuth…) avec la **toolchain Python**, de
façon **fidèle** à ce qui existe. Monde séparé du moteur TS/Satori : ici on
**produit** les fichiers que `brands/<projet>/logo` et `/favicon` contiennent ;
le moteur les consomme via `brand()`.

> **Env et commandes : voir [`src/tools/README.md`](../../../src/tools/README.md).**
> Cette skill ne duplique pas le setup (`uv sync`) ni les commandes de lancement
> (`uv run python …`). Elle encode le **comment bien faire**.

## 0. Prérequis (bloquant)

- Résoudre `<projet>`. Vérifier `brands/<projet>/brand.md` (couleurs, géométrie,
  règles). Charte manquante -> **STOP** : `/new-project <projet>` d'abord.
- Env Python prêt (`uv sync`, voir README). Python épinglé à 3.12 (`skia-python`).

## 1. Cadrer

Trois cas :
- **Régénérer** un asset existant (la charte ou la géométrie a changé).
- **Ajouter une déclinaison** d'un asset existant (nouvelle couleur, fond, taille,
  ex. les `oauth-120-*`).
- **Amorcer une nouvelle marque** (créer `src/tools/<projet>/`, voir annexe).

## 2. Discipline de reproduction fidèle (le cœur)

**Ne jamais deviner la géométrie d'un asset existant. L'inspecter d'abord.**
Pour chaque fichier de référence, relever avec Pillow (via `uv run python`) :

- **dimensions** (`Image.size`),
- **palette** et proportions (`img.convert("RGBA").getcolors(30000)`) : pour lire
  les vraies couleurs et le fond (transparent ? blanc opaque ?),
- **bounding box** du contenu (`img.getbbox()`, ou un masque par couleur) : pour
  retrouver l'échelle et les marges exactes.

Exemple vécu (déclinaisons OAuth) : la palette a révélé que `mark-white` = arcs
**bleus sur fond blanc** (pas des arcs blancs), et la bbox a donné l'échelle
exacte du bracket-O dans le cadre. C'est ce qui évite un visuel « à peu près ».

## 3. Construire

Dans `src/tools/<projet>/` (jamais ailleurs) :

- **Réutiliser `src/tools/brandkit/`** pour la plomberie générique :
  - `raster.render_svg(svg_path, w, h, container_w, container_h, white_bg)` : SVG -> image PIL,
  - `raster.make_ico(svg_path, ico_path, sizes)`,
  - `fonts.load_instanced(font_path, axes)` et `fonts.glyph_path(glyphset, name)`.
- **Garder en local** (dans le script de la marque) les **couleurs**, la
  **géométrie** (paths, viewBox) et le **layout**, jamais dans `brandkit`.
- Si une plomberie générique nouvelle est utile à toute marque, l'ajouter à
  `brandkit` (et **mettre à jour `src/tools/README.md` en miroir**).
- La sortie va dans **`out/<projet>/withtool/`** via la constante `OUT_BASE` du
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
conformes), produits par un script qui réutilise `brandkit`, et promus dans
`brands/<projet>/` avec une `brand.md` à jour.

## Annexe : amorcer une nouvelle marque

1. Créer `src/tools/<projet>/` ; s'inspirer de `src/tools/comptaopen/`
   (`build_logo.py`, `build_favicon.py`).
2. Y déposer la police source si besoin (ex. `_sora.ttf`).
3. Importer `brandkit` via `sys.path` (insertion de `src/tools/`, comme les
   scripts comptaopen). Couleurs et géométrie tirées de `brand.md`, jamais
   inventées.
4. `OUT_BASE` -> `out/<projet>/withtool/`. Vérifier, valider, promouvoir.
