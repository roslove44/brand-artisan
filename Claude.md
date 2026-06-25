# CLAUDE.md

Guide Claude Code pour **OgArtisan** — mon outil perso de construction d'image (NextJs og like)

## Principes

**1. Think before coding.** Expliciter les assumptions ; si doute → demander. Plusieurs interprétations → les présenter, ne pas choisir en silence. Approche plus simple dispo → le dire, push back quand justifié. Unclear → stop, nommer ce qui est flou, demander.

**2. Simplicity first.** Minimum de code qui résout le problème. Pas de features non demandées, pas d'abstraction pour du code single-use, pas de « flexibilité » non demandée, pas de handling d'erreurs impossibles. Si 200 lignes peuvent faire 50 → réécrire. Test : « un senior dirait que c'est overengineered ? » → simplifier.

**3. Surgical changes.** Toucher uniquement ce qui est nécessaire. Pas d'« amélioration » du code adjacent, des commentaires ou du formatting. Pas de refacto de ce qui n'est pas cassé. Matcher le style existant même si tu ferais autrement. Dead code non lié → le signaler, ne pas le supprimer. Orphans créés par tes changements → supprimer ; dead code préexistant → laisser. **Test : chaque ligne modifiée trace directement à la requête utilisateur.**

**4. Goal-driven execution.** Définir un critère de succès vérifiable, boucler jusqu'à validation. *Add validation* → écrire les tests pour inputs invalides, puis les faire passer. *Fix bug* → test qui reproduit, puis faire passer. *Refactor X* → tests verts avant ET après. Multi-step → plan bref `Step → verify: check`. Critères forts = autonomie ; critères faibles (« make it work ») = clarifications permanentes.

**5. Qualité — tolérance zéro.** Signaler **immédiatement** tout anti-pattern React 19+ : `useEffect` abusif, état dérivé inutile, state-flag relay, props drilling évitable, re-renders inutiles. Pas de « on verra plus tard ». `eslint-disable` = dernier recours absolu : épuiser toutes les alternatives (refacto, `key` prop, extraction de hook) avant ; justifier dans un commentaire si inévitable.

**6. Franchise absolue.** Être direct et franc sur les problèmes de code et autres que je présente. Pas besoin de prendre des gants avec moi — priorité : qualité du projet.

## 7. Never change code you haven't read

## 8. Pour les rédactions en français, pense à bien respecter les accents et surtout la grammaire et l’orthographe

## Charte par projet

Chaque projet de visuels vit dans `src/templates/<projet>/` et s'appuie sur deux références, dans `assets/<projet>/` :

- **`brand.md` — identité visuelle (« à quoi ça ressemble »)** : palette, logotype, typographie, do/don't.
- **`project.md` — substance et voix (« qu'est-ce que ça dit, pour qui, sur quel ton »)** : pitch, produit, public cible, proposition de valeur, voix éditoriale, vocabulaire et claims autorisés.

**`brand.md` est bloquant.** Avant de créer ou modifier un visuel, lire son `assets/<projet>/brand.md` : s'aligner sur la palette et la typographie, ne pas inventer de couleurs ni recomposer le logo à la main. **S'il n'existe pas, ne pas poursuivre : demander qu'il soit mis en place d'abord.** Pas de visuel sans charte de référence.

**`project.md` est lu s'il existe.** Avant de rédiger du texte sur un visuel (titre, accroche, message), lire `assets/<projet>/project.md` pour caler le ton et ne pas inventer de chiffres ni de promesses. **S'il manque, demander le ton et les claims plutôt que de deviner** — ne pas fabriquer de copy au jugé.

Exemple actuel : `assets/comptaopen/brand.md` et `assets/comptaopen/project.md` pour le projet `comptaopen`.

## Skills

Les skills (`.claude/skills/`) décrivent *comment faire*, pas le code. Ils encodent des conventions du moteur (contrat `Template`, `asset()`, fonts chargées dans `render.ts`, structure de `brand.md`). **Faire évoluer le moteur → mettre les skills à jour en miroir** dans le même changement.

## Commands

Te référer à package.json
