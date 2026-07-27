# src/tools : toolchain de marque (Python)

Génération des **assets de marque** d'un projet (logo, favicon et leurs
déclinaisons). Monde séparé du moteur de composition TypeScript/Satori : ici on
**produit** les fichiers de `brands/<projet>/logo` et `/favicon` ; le moteur les
**consomme** via `brand()`.

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

Toutes les commandes se lancent **depuis la racine du repo**.

```bash
uv sync                                                # une seule fois : env + deps

uv run python src/tools/comptaopen/build_logo.py       # -> out/comptaopen/withtool/logo/        (logotype + variantes + PNG)
uv run python src/tools/comptaopen/build_favicon.py    # -> out/comptaopen/withtool/favicon/     (icon*.svg, favicon, apple-icon, .ico)
uv run python src/tools/comptaopen/build_oauth.py      # -> out/comptaopen/withtool/favicon/oauth/ (icones 120px Google OAuth ; apres build_favicon)
```

`uv run` utilise le venv géré automatiquement (pas besoin de l'activer).

## Sortie et promotion

Les scripts écrivent dans **`out/<projet>/withtool/`** (dossier `out/` ignoré par
git : artefacts éphémères). C'est volontaire : on ne réécrit pas les assets
commités à l'aveugle. Après revue, **promouvoir** les fichiers validés vers
`brands/<projet>/logo/` et `brands/<projet>/favicon/`.

Pour écrire directement dans les assets (régénération en place), pointer la
constante `OUT_BASE` d'un script vers `brands/<projet>` plutôt que
`out/<projet>/withtool`.

## Ajouter une marque

Créer `src/tools/<projet>/` avec ses scripts (s'inspirer de `comptaopen/`),
réutiliser `brandkit` pour la plomberie, et garder couleurs + géométrie locales.
