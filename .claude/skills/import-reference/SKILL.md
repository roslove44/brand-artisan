---
name: import-reference
description: Part des exemples visuels fournis par l'utilisateur (logo, screenshots de son site, visuels existants, image qui lui plaît, moodboard) pour en dériver une charte brand.md ou reproduire une composition en template .tsx dans la charte du projet. À utiliser quand l'utilisateur dit "voici mes visuels / mon logo / mon site", "déduis ma charte de ça", "fais pareil que cette image", "reproduis ce visuel", "je te donne un exemple", "inspire-toi de ça". Mesure les couleurs avec Pillow au lieu de les deviner ; ne copie jamais les couleurs ou la typo d'un exemple tiers dans un template : la composition vient de l'exemple, l'habillage vient de la charte.
---

# import-reference : partir des exemples de l'utilisateur

Objectif : transformer des **exemples visuels fournis par l'utilisateur** en
matière exploitable par le moteur, selon deux flux distincts :

- **Flux A : dériver une charte.** Les exemples sont la marque de l'utilisateur
  (son logo, son site, ses anciens visuels). On en extrait palette et règles
  pour amorcer `brands/<projet>/brand.md`, au lieu de l'interview à froid de
  `new-project`.
- **Flux B : reproduire un visuel.** L'exemple est une image dont l'utilisateur
  aime le rendu (la sienne ou celle d'un tiers). On en extrait la
  **composition**, jamais l'habillage, et on la retranscrit dans la charte du
  projet.

## 0. Cadrer : quel flux ?

La question qui tranche : **l'exemple appartient-il à la marque de
l'utilisateur ?** Oui (son logo, ses visuels) et pas encore de charte -> flux A.
Non (visuel admiré, référence externe) ou charte déjà en place -> flux B.
Ambigu -> demander, ne pas choisir en silence (principe #1 de CLAUDE.md).

## 1. Recueillir les exemples

- Demander les **fichiers** (chemins locaux) : PNG, JPG ou SVG. Pour un site
  web, demander des screenshots plutôt que de scraper.
- S'ils doivent rester consultables dans le repo (base d'une charte), proposer
  de les déposer dans `brands/<projet>/reference/`. Pour une simple référence
  de composition (flux B), n'importe quel chemin local suffit, rien à
  versionner.
- Ne jamais reproduire tel quel un visuel de marque tierce : on s'inspire de sa
  composition, on ne le clone pas (logo, mascotte, éléments de marque exclus).

## 2. Inspecter, ne pas deviner (commun aux deux flux)

Même discipline que `brand-assets` §2 : **mesurer avant d'affirmer**.

- **Couleurs et géométrie : à la machine.** Avec Pillow via
  `uv run python` (env : `uv sync`, voir `tools/README.md`) :
  - dimensions : `Image.open(p).size` ;
  - palette et proportions : `img.convert("RGBA").getcolors(30000)`, trié par
    effectif décroissant : le premier bloc est le fond, les blocs suivants les
    encres et accents ;
  - cadrage d'un élément : `img.getbbox()` ou un masque par couleur.
- **SVG : lire le source.** Les hex exacts sont dans le markup, aucune mesure
  nécessaire.
- **Composition et hiérarchie : à l'œil.** Regarder l'image (Read) pour le
  cadrage, le point focal, les contrastes d'échelle, la respiration. C'est le
  seul usage de la lecture d'image ; les couleurs, elles, se mesurent.
- **Typographie : ne s'identifie pas de façon fiable.** Demander à
  l'utilisateur la police (ou le fichier). À défaut, proposer 2-3 candidates
  plausibles et faire **confirmer** ; ne jamais l'affirmer d'après l'image.

## 3. Flux A : dériver `brands/<projet>/brand.md`

C'est une variante de `new-project` où les mesures remplacent une partie de
l'interview. Même sortie, mêmes règles.

- Résoudre `<projet>` (slug kebab-case) ; s'il existe déjà une
  `brands/<projet>/brand.md`, basculer en mise à jour, pas en création.
- Traduire les mesures en **rôles** : fond, encre, accent(s), en s'appuyant sur
  les proportions relevées. Arrondir les hex voisins issus de l'anticrénelage
  vers la couleur dominante du bloc.
- **Les mesures proposent, l'utilisateur dispose** : présenter la palette
  déduite (rôle, hex, où elle a été observée) et faire valider avant d'écrire.
- Écrire `brand.md` selon la structure de référence de `new-project` §3 ;
  marquer ce que les exemples ne montrent pas par `_(à définir)_`. Si une
  police doit être installée, suivre la procédure « police manquante » de
  `new-project`.
- `project.md` reste une interview (`new-project` §3 bis) : la substance et la
  voix ne se mesurent pas sur une image.

## 4. Flux B : reproduire un visuel dans la charte

- **Prérequis bloquant** : `brands/<projet>/brand.md` existe. Sinon STOP :
  flux A ou `/new-project` d'abord (règle CLAUDE.md, aucun visuel sans charte).
- Extraire de l'exemple la **composition seulement** : grille et placements,
  hiérarchie (point focal, contrastes d'échelle), proportion de vide, effets de
  fond (trame, dégradé, motif) décrits comme des principes.
- **Transposer, ne pas copier** : chaque rôle observé dans l'exemple (fond,
  titre, accent) est remplacé par le rôle équivalent de la charte ; typographie
  parmi celles présentes dans `fonts/`. Aucun hex, logo ou élément de
  marque de l'exemple ne passe dans le template.
- Produire le template via `new-template`, ou via le **skill plateforme** si le
  format en relève (`og-image`, `linkedin-post`, `facebook-post`…) : leur
  déléguer dimensions et contraintes, comme le fait `campagne`.
- Passer le résultat au crible du **principe #9** de CLAUDE.md (concept,
  hiérarchie, composition, retenue) : reproduire un exemple ne dispense pas
  d'exigence graphique.

## 5. Vérifier

- **Flux A** : `brand.md` suit la structure de référence ; chaque couleur
  provient d'une mesure ou de l'utilisateur, jamais d'une supposition ; les
  trous sont marqués `_(à définir)_` ; l'utilisateur a validé la palette.
- **Flux B** : `npm run typecheck` vert, `npm run build` sort le PNG ;
  comparaison côte à côte avec l'exemple : même squelette de composition,
  habillage 100 % charte (aucune couleur ni typo de l'exemple).

**Critère de succès** : l'exemple de l'utilisateur a produit soit une charte
mesurée et validée, soit un template dont la composition vient de l'exemple et
l'habillage exclusivement de `brand.md`.
