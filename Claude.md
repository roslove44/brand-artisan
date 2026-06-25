# CLAUDE.md

Guide Claude Code pour **OgArtisan** — mon outil perso de construction d'image (NextJs og like)

## Principes

**1. Think before coding.** Expliciter les assumptions ; si doute → demander. Plusieurs interprétations → les présenter, ne pas choisir en silence. Approche plus simple dispo → le dire, push back quand justifié. Unclear → stop, nommer ce qui est flou, demander.

**2. Simplicity first.** Minimum de code qui résout le problème. Pas de features non demandées, pas d'abstraction pour du code single-use, pas de « flexibilité » non demandée, pas de handling d'erreurs impossibles. Si 200 lignes peuvent faire 50 → réécrire. Test : « un senior dirait que c'est overengineered ? » → simplifier.

**3. Surgical changes.** Toucher uniquement ce qui est nécessaire. Pas d'« amélioration » du code adjacent, des commentaires ou du formatting. Pas de refacto de ce qui n'est pas cassé. Matcher le style existant même si tu ferais autrement. Dead code non lié → le signaler, ne pas le supprimer. Orphans créés par tes changements → supprimer ; dead code préexistant → laisser. **Test : chaque ligne modifiée trace directement à la requête utilisateur.**

**4. Goal-driven execution.** Définir un critère de succès vérifiable, boucler jusqu'à validation. *Add validation* → écrire les tests pour inputs invalides, puis les faire passer. *Fix bug* → test qui reproduit, puis faire passer. *Refactor X* → tests verts avant ET après. Multi-step → plan bref `Step → verify: check`. Critères forts = autonomie ; critères faibles (« make it work ») = clarifications permanentes.

**5. Qualité — tolérance zéro.** Signaler **immédiatement** tout anti-pattern React 19+ : `useEffect` abusif, état dérivé inutile, state-flag relay, props drilling évitable, re-renders inutiles. Pas de « on verra plus tard ». `eslint-disable` = dernier recours absolu : épuiser toutes les alternatives (refacto, `key` prop, extraction de hook) avant ; justifier dans un commentaire si inévitable.

**6. Franchise absolue.** Être direct et franc sur les problèmes de code et autres que je présente. Pas besoin de prendre des gants avec moi — priorité : qualité du projet.

**7. Never change code you haven't read.**

## Charte par projet

Chaque projet de visuels vit dans `src/templates/<projet>/`, et sa charte graphique est décrite dans `assets/<projet>/brand.md` (palette, logotype, typographie, do/don't).

**Avant de créer ou modifier un visuel d'un projet, lire son `assets/<projet>/brand.md`.** C'est la référence de base : s'aligner sur la palette et la typographie, ne pas inventer de couleurs ni recomposer le logo à la main. Exemple actuel : `assets/comptaopen/brand.md` pour le projet `comptaopen`.

**S'il n'existe pas, ne pas poursuivre : demander qu'il soit mis en place d'abord.** Pas de visuel produit sans charte de référence.

## Commands

Te référer à package.json
