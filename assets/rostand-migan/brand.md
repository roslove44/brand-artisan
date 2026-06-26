# Charte de marque — Rostand Migan

Référence de l'identité visuelle personnelle de **Rostand Migan** (développeur
full stack et fondateur). Elle sert toute la marque, pas seulement le portfolio
[rostand.dev](https://www.rostand.dev/) qui en est une vitrine. Les couleurs et
la typographie ci-dessous sont **relevées sur le site en ligne** (rendu réel),
pas inventées. Les fichiers logo/favicon vivront dans [`logo/`](logo/) et
[`favicon/`](favicon/), à côté de ce document.

---

## 1. Concept et signification

La marque est **personnelle** : c'est le nom et le travail de Rostand Migan, pas
un produit. L'esthétique de référence est celle de rostand.dev — **épurée, sobre,
technique**, fond blanc, beaucoup de respiration, un seul accent bleu.

Deux porteurs d'identité, à ne pas confondre :

- **Logotype principal — le wordmark `rostand.dev`** (minuscules). Déjà la
  signature de fait, affichée en tête du site. Découpé en deux registres :
  `rostand` en encre, `.dev` en accent bleu (la TLD mise en avant).
- **Icône / favicon — le monogramme `RM`** sur une tuile à coins arrondis (même
  principe que le favicon ComptaOpen : un mark compact, lisible à 16 px, là où le
  wordmark deviendrait illisible).

Les deux sont produits (voir §2 et §4) ; ils remplacent la photo qui servait
d'icône.

### Typographie

| | |
|---|---|
| Police | **Geist** (Vercel) |
| Graisses | **400** (Regular), **600** (SemiBold), **700** (Bold) |
| Police mono | **Geist Mono** (code, détails techniques) _(à fournir si besoin)_ |
| Source | Police variable Geist, instanciée en statiques 400/600/700 |
| Licence | SIL Open Font License (OFL) |

Geist est la police de tout rostand.dev. Elle est désormais chargée dans le
moteur (`src/render.ts`) en 400/600/700. **Geist Mono** n'est pas encore installée :
à récupérer (même source, OFL) au premier visuel qui en a besoin.

### Couleurs

Relevées sur le rendu de rostand.dev (mode clair).

| Rôle | Hex | Repère Tailwind | Usage |
|---|---|---|---|
| Encre principale | `#111827` | `gray-900` | Texte dominant, titres |
| Texte secondaire | `#6b7280` | `gray-500` | Texte atténué, légendes |
| Accent | `#2563eb` | `blue-600` | Liens, surbrillances, mark, CTA |
| Fond | `#ffffff` | `white` | Fond par défaut |

**Mode sombre** : le site propose une bascule clair/sombre. La palette sombre du
site n'a pas été relevée pixel par pixel ; les variantes sombres du logo
utilisent les contreparties Tailwind cohérentes — encre claire `#f8fafc`
(`slate-50`) et accent `#60a5fa` (`blue-400`). `_(à confirmer sur le site)_`.

---

## 2. Variantes

### Logotype — `logo/`

Le wordmark **`rostand.dev`** en **Geist 700**, `rostand` en encre et `.dev` en
bleu. Produit par `src/tools/rostand-migan/build_logo.py`.

| Fichier | Quand l'utiliser |
|---|---|
| `logo.svg` / `logo.png` | Par défaut, sur fond clair (encre + bleu) |
| `logo-dark.svg` / `logo-dark.png` | Sur fond sombre (couleurs éclaircies, fond transparent) |
| `logo-mono.svg` | Inline, hérite de `currentColor` (s'aligne sur la couleur de texte du contexte) |
| `logo-mono-dark.svg` | Tout en encre — impression N&B, fond clair |
| `logo-mono-white.svg` | Tout en blanc — aplat bleu, photo, fond sombre |
| `logo-white.png` | Raster sur fond blanc plein |

### Favicon et icône — `favicon/`

Le mark est le monogramme **`RM`** en **Geist 700**, centré sur une **tuile à
coins arrondis** (rayon 22 %). Couleur par défaut : **RM blanc sur tuile bleue
`#2563eb`**. Produit par `src/tools/rostand-migan/build_favicon.py`.

| Fichier | Détail |
|---|---|
| `icon.svg` | Source vectorielle, tuile bleue arrondie, RM blanc |
| `icon-square.svg` | Tuile bleue à coins droits, RM blanc |
| `icon-mark.svg` | RM seul, **bleu**, sur transparent (fonds clairs) |
| `icon-white-mark.svg` | RM seul, **blanc**, sur transparent (fonds sombres) |
| `icon-white.svg` | RM bleu sur fond blanc, coins arrondis |
| `icon-white-square.svg` | RM bleu sur fond blanc, coins droits |
| `icon-16/32/48/64/180/192/512.png` | Rasters par taille |
| `apple-icon.png` | 180 px, carré (Apple arrondit lui-même) |
| `favicon.ico` | Multi-résolution 16 / 32 / 48 |

> L'« icône » actuelle du site est une **photo** de Rostand emballée dans un SVG
> (`icon.svg` en ligne) — ce n'est pas un mark. Le monogramme RM la remplace.

---

## 3. Règles d'usage

**Zone de protection.** Garder autour du wordmark un vide au moins égal à la
hauteur d'une minuscule du mot. Rien n'entre dans cette zone.

**Taille minimale.** En deçà d'une lisibilité confortable du wordmark, préférer le
monogramme **RM** seul.

**Fonds.** Choisir la variante selon le contraste :

- fond clair → `logo.svg`
- fond sombre → `logo-dark.svg`
- photo / aplat bleu → `logo-mono-white.svg`

### À ne pas faire

- Ne pas **recomposer** le wordmark dans une autre police que **Geist**.
- Ne pas **déformer** (étirer, incliner) le logo ni le monogramme.
- Ne pas **recolorer** hors des couleurs de la charte.
- Ne pas ajouter **ombre, contour, dégradé** ni effet.
- Ne pas réutiliser la **photo** comme s'il s'agissait du logo de marque.
- Ne pas multiplier les accents : **un seul bleu** (`#2563eb`), le reste en
  encre et gris.

---

## 4. Régénération

Le logo et le favicon sont générés par la toolchain Python
`src/tools/rostand-migan/`, qui s'appuie sur le socle partagé
`src/tools/brandkit/`. Environnement géré par **uv** (voir `src/tools/README.md`).

```bash
uv sync                                                  # une fois : env Python + deps
uv run python src/tools/rostand-migan/build_logo.py      # -> out/rostand-migan/withtool/logo/    (wordmark + variantes + PNG)
uv run python src/tools/rostand-migan/build_favicon.py   # -> out/rostand-migan/withtool/favicon/ (icon*.svg + rasters)
```

Les deux scripts instancient Geist à `wght=700` et composent depuis les glyphes :
`build_logo.py` aligne le wordmark et le découpe en deux couleurs ;
`build_favicon.py` centre le monogramme `RM` dans la tuile et imprime une
validation pixel du favicon 32 px (coin = tuile bleue, centre = trait blanc).

La sortie va dans `out/rostand-migan/withtool/` (artefacts éphémères, non
commités). Après revue, **promouvoir** les fichiers validés vers `logo/` et
`favicon/` ici.
