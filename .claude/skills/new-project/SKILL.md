---
name: new-project
description: Initialise un nouveau projet de visuels OgArtisan en posant sa charte de reference. A utiliser quand l'utilisateur veut creer/ajouter un nouveau projet, demarrer une nouvelle marque ou charte graphique ("nouveau projet", "ajoute le projet X", "initialise la marque Y"). Cree assets/<projet>/brand.md (obligatoire avant tout visuel) et le dossier src/templates/<projet>/.
---

# new-project — bootstrap d'un projet de visuels

Objectif : poser la **charte de reference** d'un nouveau projet, parce qu'aucun
visuel ne peut etre produit sans `assets/<projet>/brand.md` (regle de CLAUDE.md).

## 1. Determiner le slug `<projet>`

Le prendre dans les arguments. Sinon le demander. C'est un slug kebab-case
(ex. `comptaopen`, `mon-app`). Verifier qu'il n'existe pas deja :
`assets/<projet>/` ou `src/templates/<projet>/`. S'il existe -> stop, le signaler.

## 2. Recueillir la charte (ne rien inventer)

Interviewer l'utilisateur. **Ne jamais inventer couleurs, typo ou logo** —
c'est le coeur de la regle projet. Recueillir au minimum :

- **Concept / signification** du logo et du nom.
- **Typographie** : police, graisse, source. Note : le moteur ne charge
  aujourd'hui que **Sora 500/700** (voir `src/render.ts`). Si la charte impose
  une autre police absente d'`assets/fonts/`, suivre la procedure **Police
  manquante** ci-dessous — proposer de la pre-installer maintenant, ou laisser
  `/new-template` la recuperer au premier visuel qui en a besoin.
- **Palette** : pour chaque role, le hex (+ repere Tailwind si connu) et l'usage.
- **Variantes de logo / favicon** disponibles et quand les utiliser.
- **Regles d'usage** et **a ne pas faire** (do/don't).

Si l'utilisateur n'a pas encore tout, ecrire ce qui est connu et marquer les
trous par `_(a definir)_` plutot que de combler au hasard.

## 3. Ecrire `assets/<projet>/brand.md`

Calquer la **structure** de `assets/comptaopen/brand.md` (c'est la reference) :

1. Titre `# Charte de marque — <Projet>` + intro courte.
2. `## 1. Concept et signification` (avec sous-sections Typographie, Couleurs).
3. `## 2. Variantes` (logotype, favicon/icones) si applicable.
4. `## 3. Regles d'usage` (zone de protection, taille mini, fonds, **A ne pas faire**).
5. `## 4. Regeneration` seulement si des assets sont generes par script.

Les fichiers logo/favicon vivent a cote, dans `assets/<projet>/logo/` et
`assets/<projet>/favicon/`. Ne pas creer de faux assets — si l'utilisateur a des
fichiers, lui dire ou les deposer.

## 4. Creer l'arbo des templates

Creer le dossier `src/templates/<projet>/` (il accueillera les `.tsx`).

## 5. Conclure

Recapituler ce qui a ete cree et ce qui reste `_(a definir)_` dans la charte.
Pointer la suite : `/new-template <projet> <nom>` pour le premier visuel.

**Critere de succes** : `assets/<projet>/brand.md` existe, suit la structure de
reference, et ne contient aucune couleur/typo inventee.

## Police manquante (procedure)

Si la charte impose une police qui n'est pas dans `assets/fonts/` :

1. **Demander l'autorisation** de la recuperer — action reseau sortante, jamais
   en silence. Nommer la **source** et la **licence** avant de telecharger.
2. **Source fiable, format ttf/otf** (Satori ne lit pas le woff2) : le `.ttf`
   brut du repo officiel (`github.com/google/fonts`) ou un package
   `@fontsource/<police>`. La plupart des Google Fonts sont en OFL/Apache -> OK.
   Police proprietaire ou licence ambigue -> **refuser** et demander a
   l'utilisateur de fournir le fichier lui-meme.
3. **Telecharger** vers `assets/fonts/<Police>-<graisse>.ttf`, via
   `curl -L <url> -o ...` ou `Invoke-WebRequest -OutFile`. WebFetch ne convient
   pas (binaire).
4. **Verifier le fichier** : taille non nulle et entete de vraie police
   (`.ttf` commence par `00 01 00 00`, OpenType par `OTTO`), pas une page
   d'erreur HTML deguisee.
5. **Enregistrer dans `src/render.ts`** : ajouter au tableau `fonts` une entree
   `{ name, weight, style, data: await readFile(asset("fonts/<fichier>")) }`.
6. **Confirmer avant de commit** le `.ttf` (binaire) avec l'utilisateur.

Si l'utilisateur refuse -> ne pas pre-installer ; noter dans la charte que la
police est `_(a fournir)_` et laisser `/new-template` reposer la question.
