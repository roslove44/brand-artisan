---
name: new-project
description: Initialise un nouveau projet de visuels BrandArtisan en posant sa charte de référence. À utiliser quand l'utilisateur veut créer/ajouter un nouveau projet, démarrer une nouvelle marque ou charte graphique ("nouveau projet", "ajoute le projet X", "initialise la marque Y"). Crée brands/<projet>/brand.md (obligatoire avant tout visuel) et le dossier templates/<projet>/.
---

# new-project : bootstrap d'un projet de visuels

Objectif : poser les **deux références** d'un nouveau projet dans
`brands/<projet>/` : `brand.md` (identité visuelle, **bloquant** : aucun visuel
sans lui) et `project.md` (substance et voix, pour rédiger les textes). Règle de
CLAUDE.md.

## 1. Déterminer le slug `<projet>`

Le prendre dans les arguments. Sinon le demander. C'est un slug kebab-case
(ex. `rostand-migan`, `mon-app`). Vérifier qu'il n'existe pas déjà :
`brands/<projet>/` ou `templates/<projet>/`. S'il existe -> stop, le signaler.

## 2. Recueillir la charte (ne rien inventer)

Interviewer l'utilisateur. **Ne jamais inventer couleurs, typo ou logo** :
c'est le cœur de la règle projet. Recueillir au minimum :

- **Concept / signification** du logo et du nom.
- **Typographie** : police, graisse, source. Note : les familles et graisses
  disponibles sont celles présentes dans `fonts/`, découvertes automatiquement
  par le moteur. Si la charte impose une autre police absente de `fonts/`,
  suivre la procédure **Police manquante** ci-dessous : proposer de la
  pré-installer maintenant, ou laisser `/new-template` la récupérer au premier
  visuel qui en a besoin.
- **Palette** : pour chaque rôle, le hex (+ repère Tailwind si connu) et l'usage.
- **Variantes de logo / favicon** disponibles et quand les utiliser.
- **Règles d'usage** et **à ne pas faire** (do/don't).

Recueillir aussi la **substance** (pour `project.md`) : pitch en une phrase,
ce que fait le produit, public cible et langue, proposition de valeur, voix
éditoriale (registre, tutoiement/vouvoiement), vocabulaire (nom exact, URL) et
**claims interdits** (ne pas inventer de chiffres).

Si l'utilisateur n'a pas encore tout, écrire ce qui est connu et marquer les
trous par `_(à définir)_` plutôt que de combler au hasard.

## 3. Écrire `brands/<projet>/brand.md`

Calquer la **structure** de `brands/rostand-migan/brand.md` (c'est la référence) :

1. Titre `# Charte de marque : <Projet>` + intro courte.
2. `## 1. Concept et signification` (avec sous-sections Typographie, Couleurs).
3. `## 2. Variantes` (logotype, favicon/icônes) si applicable.
4. `## 3. Règles d'usage` (zone de protection, taille mini, fonds, **À ne pas faire**).
5. `## 4. Régénération` seulement si des assets sont générés par script.

Les fichiers logo/favicon vivent à côté, dans `brands/<projet>/logo/` et
`brands/<projet>/favicon/`. Ne pas créer de faux assets : si l'utilisateur a des
fichiers, lui dire où les déposer. S'ils doivent être **générés par script**
(comme ceux de rostand-migan), c'est le rôle de la skill `brand-assets`.

## 3 bis. Écrire `brands/<projet>/project.md`

Calquer la **structure** de `brands/rostand-migan/project.md` (c'est la référence) :

1. `# Projet : <Projet>` + intro courte (rôle du fichier).
2. `## 1. En une phrase` (le pitch).
3. `## 2. Le produit` (ce que ça fait, différenciateur).
4. `## 3. Public cible` (personas, marché, langue).
5. `## 4. Proposition de valeur` (bénéfices, par priorité).
6. `## 5. Voix éditoriale` (registre, tutoiement/vouvoiement, format, do/don't).
7. `## 6. Vocabulaire & claims` (nom exact, URL, accroches validées, **claims
   interdits** : pas de chiffres inventés).

Mêmes règles que pour `brand.md` : ne rien inventer, marquer les trous par
`_(à définir)_` ou `_(à confirmer)_`.

## 4. Créer l'arbo des templates

Créer le dossier `templates/<projet>/` (il accueillera les `.tsx`).

## 5. Conclure

Récapituler ce qui a été créé et ce qui reste `_(à définir)_` dans la charte.
Pointer la suite : `/new-template <projet> <nom>` pour le premier visuel.

**Critère de succès** : `brands/<projet>/brand.md` **et**
`brands/<projet>/project.md` existent, suivent la structure de référence, et ne
contiennent ni couleur/typo ni claim inventés (trous marqués `_(à définir)_`).

## Police manquante (procédure)

Si la charte impose une police qui n'est pas dans `fonts/` :

1. **Demander l'autorisation** de la récupérer : action réseau sortante, jamais
   en silence. Nommer la **source** et la **licence** avant de télécharger.
2. **Source fiable, format ttf/otf** (Satori ne lit pas le woff2) : le `.ttf`
   brut du repo officiel (`github.com/google/fonts`) ou un package
   `@fontsource/<police>`. La plupart des Google Fonts sont en OFL/Apache -> OK.
   Police propriétaire ou licence ambiguë -> **refuser** et demander à
   l'utilisateur de fournir le fichier lui-même.
3. **Télécharger** vers `fonts/<Famille>-<graisse>.ttf`, via
   `curl -L <url> -o ...` ou `Invoke-WebRequest -OutFile`. WebFetch ne convient
   pas (binaire). Le nom du fichier **fait foi** : il détermine la famille citée
   par les templates, en PascalCase (`GeistMono-600.ttf` -> `Geist Mono`, 600).
4. **Vérifier le fichier** : taille non nulle et en-tête de vraie police
   (`.ttf` commence par `00 01 00 00`, OpenType par `OTTO`), pas une page
   d'erreur HTML déguisée.
5. **Documenter la licence** : déposer son texte dans `fonts/` et ajouter
   la ligne correspondante au tableau de `fonts/NOTICE.md`. Aucune
   déclaration de code : le moteur découvre le fichier au démarrage, si
   son nom suit la convention `<Famille>-<graisse>.ttf` de l'étape 3.
6. **Confirmer avant de commit** le `.ttf` (binaire) avec l'utilisateur.

Si l'utilisateur refuse -> ne pas pré-installer ; noter dans la charte que la
police est `_(à fournir)_` et laisser `/new-template` reposer la question.
