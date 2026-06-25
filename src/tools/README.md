# src/tools — toolchain de marque (Python)

Génération des **assets de marque** d'un projet (logo, favicon et leurs
déclinaisons). Monde séparé du moteur de composition TypeScript/Satori : ici on
**produit** les fichiers de `assets/<projet>/logo` et `/favicon` ; le moteur les
**consomme** via `asset()`.

## Organisation

```
src/tools/
  brandkit/            socle partagé réutilisable (skia SVG -> PNG, .ico, police)
  <projet>/            scripts propres à une marque (couleurs, géométrie en dur)
    build_logo.py
    build_favicon.py
    _sora.ttf
```

`brandkit/` n'est **pas installé** : les scripts l'importent via `sys.path`
(insertion de `src/tools/`). Les constantes et la géométrie d'une marque vivent
dans ses scripts, jamais dans `brandkit/`.

## Environnement

Géré par **uv**, épinglé à **Python 3.12** (`.python-version`) car `skia-python`
n'a pas toujours de wheels pour les Python les plus récents. Dépendances dans
`pyproject.toml` (`skia-python`, `pillow`, `fonttools`).

```bash
uv sync     # crée .venv (Python 3.12) et installe les deps
```

## Lancer

```bash
uv run python src/tools/comptaopen/build_logo.py
uv run python src/tools/comptaopen/build_favicon.py
```

## Sortie et promotion

Les scripts écrivent dans **`out/<projet>/withtool/`** (dossier `out/` ignoré par
git : artefacts éphémères). C'est volontaire : on ne réécrit pas les assets
commités à l'aveugle. Après revue, **promouvoir** les fichiers validés vers
`assets/<projet>/logo/` et `assets/<projet>/favicon/`.

Pour écrire directement dans les assets (régénération en place), pointer la
constante `OUT_BASE` d'un script vers `assets/<projet>` plutôt que
`out/<projet>/withtool`.

## Ajouter une marque

Créer `src/tools/<projet>/` avec ses scripts (s'inspirer de `comptaopen/`),
réutiliser `brandkit` pour la plomberie, et garder couleurs + géométrie locales.
