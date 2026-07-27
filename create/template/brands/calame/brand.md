# Charte de marque : Calame

Référence de l'identité visuelle de **Calame**. Les fichiers logo/favicon vivent
dans [`logo/`](logo/) et [`favicon/`](favicon/), à côté de ce document.

> **Marque de démonstration.** Calame n'existe pas : c'est l'exemple livré avec
> BrandArtisan, pour qu'un projet neuf produise une image dès la première
> commande. Sa charte est **écrite**, pas relevée sur un site réel. Remplace-la
> par la tienne (`/new-project`), ou repars de sa structure : elle montre ce
> qu'une charte doit contenir pour qu'un visuel puisse être composé sans deviner.

---

## 1. Concept et signification

Le **calame** est un roseau taillé en biseau, le plus vieil outil de tracé. Il
donne son nom à la marque et sa forme au mark : la marque parle d'un **geste
unique**, tracé d'un trait, dans une seule encre.

Deux porteurs d'identité :

- **Logotype : le mark suivi du wordmark `calame`** (minuscules). Le mark porte
  l'accent, le mot reste en encre : un seul moment de couleur.
- **Icône / favicon : le mark seul**, la plume taillée, sur une tuile à coins
  arrondis. Lisible à 16 px là où le wordmark ne le serait plus.

Le mark est une **géométrie tracée à la main** (quatre points), pas un glyphe :
un trait qui s'affine de la base vers la pointe, coupé net en haut et en bas
comme le biseau d'un calame. Il penche à droite, dans le sens de l'écriture.

### Typographie

| | |
|---|---|
| Police d'affichage | **Sora**, graisse **700** (wordmark, titres) |
| Police de texte | **Geist**, graisses **400** et **600** |
| Source | Statiques livrées dans `fonts/`, découvertes par le moteur |
| Licence | SIL Open Font License (OFL) pour les deux, voir [`fonts/NOTICE.md`](../../fonts/NOTICE.md) |

Sora porte l'identité (le mot `calame` et les titres). Geist porte le texte
courant : accroches, légendes, corps. Ne pas les intervertir.

### Couleurs

| Rôle | Hex | Repère Tailwind | Usage |
|---|---|---|---|
| Encre | `#1c1917` | `stone-900` | Wordmark, titres, texte dominant |
| Texte secondaire | `#78716c` | `stone-500` | Légendes, mentions, texte atténué |
| Accent | `#c2410c` | `orange-700` | Le mark, et **un seul** moment d'accent par visuel |
| Papier | `#fafaf9` | `stone-50` | Fond par défaut |

**Fonds sombres** : encre claire `#fafaf9` (`stone-50`) et accent éclairci
`#fb923c` (`orange-400`), pour tenir le contraste.

---

## 2. Variantes

### Logotype (`logo/`)

Le mark en accent, suivi du wordmark **`calame`** en **Sora 700** en encre.
Produit par `tools/calame/build-logo.ts`.

| Fichier | Quand l'utiliser |
|---|---|
| `logo.svg` / `logo.png` | Par défaut, sur fond clair (mark accent + mot encre) |
| `logo-dark.svg` / `logo-dark.png` | Sur fond sombre (couleurs éclaircies, fond transparent) |
| `logo-mono.svg` | Inline, hérite de `currentColor` |
| `logo-mono-dark.svg` | Tout en encre : impression N&B, fond clair |
| `logo-mono-white.svg` | Tout en blanc : aplat de couleur, photo, fond sombre |
| `logo-white.png` | Raster sur fond papier plein |

### Favicon et icône (`favicon/`)

Le mark seul, centré sur une **tuile à coins arrondis** (rayon 22 %). Couleur par
défaut : **mark papier sur tuile accent `#c2410c`**. Produit par
`tools/calame/build-favicon.ts`.

| Fichier | Détail |
|---|---|
| `icon.svg` | Source vectorielle, tuile accent arrondie, mark papier |
| `icon-square.svg` | Tuile accent à coins droits |
| `icon-mark.svg` | Mark seul, **accent**, sur transparent (fonds clairs) |
| `icon-white-mark.svg` | Mark seul, **papier**, sur transparent (fonds sombres) |
| `icon-white.svg` | Mark accent sur fond papier, coins arrondis |
| `icon-white-square.svg` | Mark accent sur fond papier, coins droits |
| `icon-16/32/48/64/180/192/512.png` | Rasters par taille |
| `apple-icon.png` | 180 px, carré (Apple arrondit lui-même) |
| `favicon.ico` | Multi-résolution 16 / 32 / 48 |

---

## 3. Règles d'usage

**Zone de protection.** Garder autour du logotype un vide au moins égal à la
hauteur du mark. Rien n'entre dans cette zone.

**Taille minimale.** En deçà d'une lisibilité confortable du mot, préférer le
**mark seul**.

**Fonds.** Choisir la variante selon le contraste :

- fond clair → `logo.svg`
- fond sombre → `logo-dark.svg`
- photo / aplat de couleur → `logo-mono-white.svg`

### À ne pas faire

- Ne pas **recomposer** le wordmark dans une autre police que **Sora 700**.
- Ne pas **déformer** (étirer, incliner davantage) le mark : sa pente fait partie
  du dessin.
- Ne pas **recolorer** hors des couleurs de la charte.
- Ne pas ajouter **ombre, contour, dégradé** ni effet.
- Ne pas mettre l'accent sur le mot : l'accent appartient au mark.
- Ne pas multiplier les accents : **un seul orange** (`#c2410c`) par visuel, le
  reste en encre et gris.

---

## 4. Régénération

Le logo et le favicon sont générés par la toolchain `tools/calame/`, qui
s'appuie sur le socle partagé `brand-artisan/brandkit`.

```bash
npx tsx tools/calame/build-logo.ts     # -> out/calame/brand/logo/    (mark + wordmark + variantes + PNG)
npx tsx tools/calame/build-favicon.ts  # -> out/calame/brand/favicon/ (icon*.svg + rasters + .ico)
```

`build-logo.ts` compose depuis les **glyphes** de Sora et place le mark à gauche ;
`build-favicon.ts` centre la **géométrie** du mark dans la tuile et imprime une
validation pixel du favicon 32 px. Les deux techniques de la toolchain sont donc
illustrées ici, une par script.

La sortie va dans `out/calame/brand/` (artefacts éphémères, non commités). Après
revue, **promouvoir** les fichiers validés vers `logo/` et `favicon/` ici.
