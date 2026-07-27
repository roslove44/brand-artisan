# CLAUDE.md

Guide Claude Code pour **BrandArtisan**, un outil de construction d'images de marque (façon next/og).

## Principes

**1. Think before coding.** Expliciter les assumptions ; si doute → demander. Plusieurs interprétations → les présenter, ne pas choisir en silence. Approche plus simple dispo → le dire, push back quand justifié. Unclear → stop, nommer ce qui est flou, demander.

**2. Simplicity first.** Minimum de code qui résout le problème. Pas de features non demandées, pas d'abstraction pour du code single-use, pas de « flexibilité » non demandée, pas de handling d'erreurs impossibles. Si 200 lignes peuvent faire 50 → réécrire. Test : « un senior dirait que c'est overengineered ? » → simplifier.

**3. Surgical changes.** Toucher uniquement ce qui est nécessaire. Pas d'« amélioration » du code adjacent, des commentaires ou du formatting. Pas de refacto de ce qui n'est pas cassé. Matcher le style existant même si tu ferais autrement. Dead code non lié → le signaler, ne pas le supprimer. Orphans créés par tes changements → supprimer ; dead code préexistant → laisser. **Test : chaque ligne modifiée trace directement à la requête utilisateur.**

**4. Goal-driven execution.** Définir un critère de succès vérifiable, boucler jusqu'à validation. *Add validation* → écrire les tests pour inputs invalides, puis les faire passer. *Fix bug* → test qui reproduit, puis faire passer. *Refactor X* → tests verts avant ET après. Multi-step → plan bref `Step → verify: check`. Critères forts = autonomie ; critères faibles (« make it work ») = clarifications permanentes.

**5. Qualité : tolérance zéro.** Signaler **immédiatement** tout anti-pattern React 19+ : `useEffect` abusif, état dérivé inutile, state-flag relay, props drilling évitable, re-renders inutiles. Pas de « on verra plus tard ». `eslint-disable` = dernier recours absolu : épuiser toutes les alternatives (refacto, `key` prop, extraction de hook) avant ; justifier dans un commentaire si inévitable.

**6. Franchise absolue.** Être direct et franc sur les problèmes de code et autres que l'utilisateur présente. Pas besoin de prendre des gants ; priorité : qualité du projet.

## 7. Never change code you haven't read

## 8. Pour les rédactions en français, pense à bien respecter les accents et surtout la grammaire et l’orthographe

## 9. Exigence graphique : chaque visuel est composé, pas rempli

Un visuel n'est pas « du texte sur un fond ». Avant de rendre, vérifier :
- **Concept** : une idée visuelle porte le message (un motif, un cadrage, un jeu
  sur le logo), pas seulement un titre posé sur un dégradé.
- **Hiérarchie** : un seul point focal, contraste d'échelle fort entre titre,
  kicker et accroche. Si deux éléments se disputent l'œil → en subordonner un.
- **Composition** : vide et tension assumés (asymétrie, respiration). Ne pas
  centrer par défaut ; le centrage est un choix, pas un réflexe.
- **Retenue** : palette limitée, un seul moment d'accent. Toute déco qui ne sert
  pas le message → retirée.
Le tout **dans** la charte (`brand.md`), jamais contre elle : l'art est dans la
composition, pas dans des couleurs ou des polices inventées.
**Test : un directeur artistique le sortirait en l'état, ou ça fait « template » ?**

## Charte par projet

Chaque projet de visuels vit dans `templates/<projet>/` et s'appuie sur deux références, dans `brands/<projet>/` :

- **`brand.md`, identité visuelle (« à quoi ça ressemble »)** : palette, logotype, typographie, do/don't.
- **`project.md`, substance et voix (« qu'est-ce que ça dit, pour qui, sur quel ton »)** : pitch, produit, public cible, proposition de valeur, voix éditoriale, vocabulaire et claims autorisés.

**`brand.md` est bloquant.** Avant de créer ou modifier un visuel, lire son `brands/<projet>/brand.md` : s'aligner sur la palette et la typographie, ne pas inventer de couleurs ni recomposer le logo à la main. **S'il n'existe pas, ne pas poursuivre : demander qu'il soit mis en place d'abord.** Pas de visuel sans charte de référence.

**`project.md` est lu s'il existe.** Avant de rédiger du texte sur un visuel (titre, accroche, message), lire `brands/<projet>/project.md` pour caler le ton et ne pas inventer de chiffres ni de promesses. **S'il manque, demander le ton et les claims plutôt que de deviner** : ne pas fabriquer de copy au jugé.

**Briefs ponctuels.** Un projet peut avoir des briefs thématiques à côté de la paire (ex. `brands/comptaopen/donation.md` pour les visuels liés au don) : les lire quand le visuel demandé s'y rapporte. Ils précisent un besoin, ils ne remplacent ni `brand.md` ni `project.md`.

Exemples actuels : `comptaopen` (marque produit) et `rostand-migan` (marque personnelle), chacun avec sa paire `brand.md` / `project.md` dans `brands/<projet>/`.

## Toolchain Python

Le Python (`tools/`) sert à **générer les assets de marque** que le moteur JS ne sait pas produire : SVG à la géométrie exacte, icônes multi-tailles, `.ico`. Le moteur TS les **consomme** ensuite via `brand()`. Env et commandes : `tools/README.md` ; méthode : skill `brand-assets`.

## Skills

Les skills (`.claude/skills/`) décrivent *comment faire*, pas le code. Ils encodent des conventions du moteur (contrat `Template`, `brand()`, fonts chargées dans `render.ts`, structure de `brand.md`). **Faire évoluer le moteur → mettre les skills à jour en miroir** dans le même changement.

**Créer un visuel → invoquer le skill plateforme** (`og-image`, `new-template`, `linkedin-*`, `facebook-*`, `x-*`…) : il encode déjà la recette du moteur. Ne pas reverse-engineer en relisant `render.ts`, `build.ts` ou d'autres templates : le skill + `brand.md` (+ `project.md` pour le texte) suffisent. Pas de fichier de référence dupliquant `brand.md` ou les skills.

**L'utilisateur fournit des exemples visuels** (son logo, ses visuels existants, une image qui lui plaît) → invoquer `import-reference` : il encode comment mesurer (Pillow) plutôt que deviner, et le garde-fou composition-vient-de-l'exemple / habillage-vient-de-la-charte.

## Commands

Te référer à package.json
