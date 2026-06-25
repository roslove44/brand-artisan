---
name: campagne
description: Orchestre la production d'un kit de visuels cohérent sur plusieurs plateformes à partir d'un seul brief. À utiliser quand l'utilisateur veut "une campagne", "décliner sur Facebook/LinkedIn/X", "un kit de visuels", "tous les visuels d'un lancement" ou "la même annonce sur tous les réseaux". Mène l'interview une seule fois, consolide le message depuis project.md, puis délègue aux skills plateforme (facebook-*, linkedin-*, x-*, og-image). Nécessite un projet avec sa brand.md (et idéalement sa project.md) en place.
---

# campagne — kit de visuels multi-plateformes

Objectif : produire un **ensemble cohérent** de visuels pour **plusieurs
plateformes** à partir d'**un seul brief**. Cette skill ne crée pas les images
elle-même : elle **mène l'interview une fois**, consolide le message, puis
**délègue** aux skills plateforme. C'est le chef d'orchestre ; les briques
restent `og-image`, `facebook-*`, `linkedin-*`, `x-*`.

> **Garde-fou — ne pas dupliquer.** Cette skill ne réécrit **jamais** les
> dimensions, ratios ou contraintes d'une plateforme : elle renvoie à la skill
> concernée et la laisse appliquer ses propres specs. Son seul périmètre propre
> est le **brief** et la **cohérence** de l'ensemble.

## 0. Prérequis — bloquant

- Résoudre `<projet>` (arguments, sinon demander).
- Vérifier `src/templates/<projet>/` **et** `assets/<projet>/brand.md`.
  Manquant -> **STOP** : `/new-project <projet>` d'abord (règle CLAUDE.md).
- Lire `assets/<projet>/brand.md` (identité visuelle) **et**
  `assets/<projet>/project.md` (substance, voix, claims). `project.md` est le
  socle du brief : s'il manque, demander le ton et les claims plutôt que
  d'inventer.

## 1. Interview (le cœur — tirer le meilleur de l'utilisateur)

Mener une seule fois, en s'appuyant sur `project.md` pour proposer plutôt que
faire deviner :

1. **Objectif** de la campagne : lancement, promo d'un outil, annonce,
   recrutement, événement… (un objectif clair = un message clair).
2. **Plateformes cibles** : Facebook, LinkedIn, X, OG générique (et combinaisons).
3. **Formats voulus** par plateforme : profil/header, post, carrousel — ou
   laisser les défauts de chaque skill plateforme.
4. **Message clé** : proposer **2-3 angles** tirés de `project.md` (produit réel,
   proposition de valeur), faire **choisir et affiner**. Ne jamais inventer de
   chiffre ni de promesse hors `project.md`.
5. **Mécanique des carrousels** s'il y en a : story, une carte = un produit,
   top N, tuto, avant/après (voir les skills `*-carousel`).

Présenter les choix manquants, ne pas trancher en silence (principe #1 CLAUDE.md).

## 2. Brief consolidé

Écrire un **message maître** unique (titre + accroche), puis sa **déclinaison de
ton par plateforme** — même fond, registre adapté. Repère par défaut (à ajuster
selon `project.md`) :

| Plateforme | Registre |
|---|---|
| **LinkedIn** | Professionnel, valeur ajoutée (insight, bénéfice métier) |
| **X** | Direct, percutant, concis |
| **Facebook** | Accessible, grand public |
| **OG** (partage) | Neutre, descriptif, va à l'essentiel |

Le message maître et toutes ses déclinaisons restent dans les **claims
autorisés** par `project.md`.

## 3. Fan-out — déléguer aux skills plateforme

Pour chaque couple (plateforme, format) retenu, appliquer la **skill
correspondante** en lui passant le **message déjà décliné** et le projet. Ne pas
re-cadrer les dimensions : la skill plateforme s'en charge.

| Besoin | Skill à appliquer |
|---|---|
| Aperçu de partage générique | `og-image` |
| Profil / bannière Facebook | `facebook-page` |
| Post Facebook | `facebook-post` |
| Carrousel Facebook | `facebook-carousel` |
| Profil / bannière LinkedIn | `linkedin-page` |
| Post LinkedIn | `linkedin-post` |
| Carrousel LinkedIn | `linkedin-carousel` |
| Profil / header X | `x-page` |
| Post X | `x-post` |
| Carrousel X | `x-carousel` |

Cohérence inter-plateformes (le rôle propre de `campagne`) :

- **Même message maître** partout, seul le ton et le cadrage changent.
- **Mêmes partis pris visuels** quand c'est pertinent (même fond clair ou sombre,
  même variante de logo) — dans le respect de `brand.md`.
- Slugs cohérents : préfixer par la campagne si utile
  (ex. `lancement-facebook-post`, `lancement-x-post`) pour regrouper la sortie.

## 4. Vérifier et récapituler

- `npm run typecheck` -> vert ; `npm run build` -> écrit tous les PNG.
- Contrôler **chaque** visuel via le critère de sa skill plateforme (dimensions,
  poids, fond opaque).
- **Cohérence du kit** : relire l'ensemble côte à côte — message aligné, ton
  adapté sans rupture de marque, claims conformes à `project.md`.
- **Récap** : lister les PNG produits **par plateforme**, et rappeler le message
  maître retenu.

**Critère de succès** : un kit multi-plateformes où chaque visuel respecte les
specs de sa plateforme (déléguées), porté par **un message maître cohérent**
décliné par ton, et **entièrement ancré dans `brand.md` et `project.md`**.
