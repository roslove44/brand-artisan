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

- **Logotype principal — le wordmark `rostand.dev`** (minuscules, sans point
  d'accent visuel). C'est déjà la signature de fait, affichée en tête du site.
- **Icône / favicon — le monogramme `RM`** sur une tuile à coins arrondis (même
  principe que le favicon ComptaOpen : un mark compact, lisible à 16 px, là où le
  wordmark deviendrait illisible). **Cette icône n'existe pas encore** : c'est la
  création à produire (voir §2 et §4).

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

**Mode sombre** : le site propose une bascule clair/sombre, mais la palette
sombre n'a pas été relevée précisément — `_(à définir)_` (encre claire + accent
bleu éclairci, à confirmer sur le site avant usage).

---

## 2. Variantes

### Logotype — `logo/`

Le wordmark **`rostand.dev`** en Geist. Les fichiers ne sont **pas encore
produits** ; jeu de variantes cible `_(à définir)_` (au minimum : fond clair,
fond sombre, monochrome). Déposer les fichiers dans `logo/` ici, ou les générer
via la skill `brand-assets`.

### Favicon et icône — `favicon/`

Concept **arrêté**, design **à produire** : monogramme **`RM`** (Geist, graisse à
caler) sur une **tuile à coins arrondis**. Direction de couleur proposée, par
cohérence avec le site et le favicon ComptaOpen : **RM blanc sur tuile bleue
`#2563eb`** — `_(à confirmer)_`. Géométrie exacte (crénage des deux lettres,
rayon de la tuile, version sur transparent) `_(à définir lors de la génération)_`.

> Aujourd'hui, l'« icône » du site est une **photo** de Rostand emballée dans un
> SVG (`icon.svg`) — ce n'est pas un mark. Le monogramme RM la remplacera.

---

## 3. Règles d'usage

**Zone de protection.** Garder autour du wordmark un vide au moins égal à la
hauteur d'une minuscule du mot. Rien n'entre dans cette zone.

**Taille minimale.** En deçà d'une lisibilité confortable du wordmark, préférer le
monogramme **RM** seul.

**Fonds.** Sur fond clair, encre `#111827` et accent `#2563eb`. Sur fond sombre,
utiliser les variantes claires `_(à définir)_`. Sur photo ou aplat bleu, préférer
une version monochrome `_(à définir)_`.

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

Le monogramme RM et les déclinaisons du wordmark sont à produire via la skill
`brand-assets` (toolchain Python dans `src/tools/`, socle `src/tools/brandkit/`),
puis à promouvoir vers `logo/` et `favicon/` ici. Tant que la toolchain
`src/tools/rostand-migan/` n'existe pas, c'est `brand-assets` qui la met en place.
