# Charte de marque : ComptaOpen

Référence du logo ComptaOpen : sa signification, ses variantes et ses règles
d'usage. Les fichiers vivent dans [`logo/`](logo/) et [`favicon/`](favicon/),
à côté de ce document.

---

## 1. Concept et signification

Le logotype s'écrit **COMPTA · bracket-O · PEN**. Le « O » de *Open* n'est pas une
lettre : c'est un **bracket-O**, deux arcs en miroir à bouts arrondis séparés
par un interstice central.

```
COMPTA ( ) PEN
        ↑
   le bracket-O
```

Cette forme porte trois lectures simultanées, voulues :

- **Un « O »** : on lit naturellement « ComptaOpen » sans effort.
- **Une parenthèse ouverte/fermée `( )`** : le geste de la comptabilité (les
  écritures s'ouvrent et se soldent) et celui du code.
- **L'ouverture** : l'interstice au centre dit *Open*. Le savoir fiscal et
  comptable rendu accessible, pas verrouillé.

Le mot est volontairement coupé en deux registres de couleur : **COMPTA** en
encre neutre (le métier, le socle) et **PEN** + le bracket-O en bleu (l'action,
le numérique, l'ouverture).

### Typographie

| | |
|---|---|
| Police | **Sora** |
| Graisse | **700** (Bold) |
| Source | Police variable Sora, instanciée à `wght=700` |
| Crénage | resserré (`-30` unités) pour un mot compact |

Sora est une grotesque géométrique : elle donne au mot une assise technique
sans froideur. Elle n'est utilisée **que** pour le logo ; elle ne définit pas la
typographie de l'interface.

### Couleurs

| Rôle | Hex | Repère Tailwind | Usage |
|---|---|---|---|
| Encre (COMPTA) | `#0f172a` | `slate-900` | Texte du logo sur fond clair |
| Bleu (PEN + brackets) | `#1d4ed8` | `blue-700` | Accent principal, tuile favicon |
| Encre claire (dark) | `#f8fafc` | `slate-50` | Texte du logo sur fond sombre |
| Bleu clair (dark) | `#60a5fa` | `blue-400` | Accent sur fond sombre |

Le bleu est la couleur d'action de toute la plateforme ; l'orange/amber reste un
**accent secondaire** réservé à l'interface et n'apparaît jamais dans le logo.

---

## 2. Variantes

### Logotype (`logo/`)

| Fichier | Quand l'utiliser |
|---|---|
| `logo.svg` / `logo.png` | Par défaut, sur fond clair |
| `logo-dark.svg` / `logo-dark.png` | Sur fond sombre (couleurs éclaircies, fond transparent) |
| `logo-mono.svg` | Inline, hérite de `currentColor` (s'aligne sur la couleur de texte du contexte) |
| `logo-mono-dark.svg` | Tout en encre : fond clair, impression N&B |
| `logo-mono-white.svg` | Tout en blanc : aplat bleu, photo, fond sombre |
| `logo-white.png` | Raster sur fond blanc plein |

### Favicon et icônes d'app (`favicon/`)

Le favicon est le **bracket-O seul**, en blanc, centré sur une tuile bleue
(`#1d4ed8`) à coins arrondis (rayon ≈ 22 %). Réduit au wordmark, le mot
deviendrait illisible à 16 px ; le bracket-O reste reconnaissable.

| Fichier | Détail |
|---|---|
| `icon.svg` | Source vectorielle, tuile bleue arrondie, bracket blanc |
| `icon-square.svg` | Tuile bleue à coins droits, bracket blanc |
| `icon-mark.svg` | Bracket-O seul, **bleu**, sur transparent (fonds clairs) |
| `icon-white-mark.svg` | Bracket-O seul, **blanc**, sur transparent (fonds sombres) |
| `icon-white.svg` | Bracket-O bleu sur fond blanc, coins arrondis |
| `icon-white-square.svg` | Bracket-O bleu sur fond blanc, coins droits |
| `icon-16/32/48/64/180/192/512.png` | Rasters par taille |
| `apple-icon.png` | 180 px, carré (Apple arrondit lui-même) |
| `favicon.ico` | Multi-résolution 16 / 32 / 48 |

**Fichiers de production** : `favicon.ico`, `apple-icon.png`, `icon.svg`
(présents dans `favicon/`).

Le sous-dossier `favicon/oauth/` contient chaque variante d'icône rendue en
**120 px** (taille recommandée par Google) pour les écrans de consentement OAuth,
générées par `build-oauth.ts`.

---

## 3. Règles d'usage

**Zone de protection.** Garder autour du logo un vide au moins égal à la **demi-
hauteur du bracket-O**. Rien (texte, bord, autre logo) n'entre dans cette zone.

**Taille minimale.**

- Logotype : **24 px de hauteur** en numérique (en deçà, préférer le bracket-O
  seul).
- Favicon : déjà validé à **16 px** (arcs blancs distincts, interstice bleu net).

**Fonds.** Choisir la variante selon le contraste :

- fond clair → `logo.svg`
- fond sombre → `logo-dark.svg`
- aplat bleu / photo → `logo-mono-white.svg`

### À ne pas faire

- Ne pas **recolorer** le logo hors des variantes fournies.
- Ne pas **déformer** (étirer, comprimer, incliner) : conserver le ratio.
- Ne pas **séparer** le bracket-O des mots dans le logotype, ni recomposer
  manuellement `COMPTA O PEN` avec un vrai « O ».
- Ne pas ajouter **ombre, contour, dégradé** ni d'effet.
- Ne pas poser le logo couleur sur un fond qui **écrase le contraste** (utiliser
  une variante mono).
- Ne pas **reconstituer** le wordmark dans une autre police que Sora 700.

---

## 4. Régénération

Les fichiers de `logo/` et `favicon/` sont générés par les scripts de la
toolchain `tools/comptaopen/`, qui s'appuient sur le socle partagé
`src/brandkit.ts` (voir `tools/README.md`).

```bash
npx tsx tools/comptaopen/build-logo.ts     # -> out/comptaopen/withtool/logo/
npx tsx tools/comptaopen/build-favicon.ts  # -> out/comptaopen/withtool/favicon/ (icon*.svg + rasters)
npx tsx tools/comptaopen/build-oauth.ts    # -> out/comptaopen/withtool/favicon/oauth/ (icones 120px Google OAuth)
```

`build-oauth.ts` rend chaque `icon*.svg` en PNG 120 px (taille recommandée par
Google) ; le lancer **après** `build-favicon.ts`.

`build-logo.ts` lit la police `_sora.ttf` (instanciée à `wght=700`) et compose le
logotype depuis ses glyphes ; les couleurs et la géométrie restent locales aux
scripts. `build-favicon.ts` imprime en fin de course une validation pixel du
favicon 32 px (coin transparent, arcs blancs, interstice bleu).
