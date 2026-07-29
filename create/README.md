# create-brand-artisan

[![npm](https://img.shields.io/npm/v/create-brand-artisan)](https://www.npmjs.com/package/create-brand-artisan)
[![CI](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml/badge.svg)](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml)

Crée un projet de visuels [BrandArtisan](https://github.com/roslove44/brand-artisan)
prêt à rendre : tu composes tes images en JSX (OG, posts et bannières LinkedIn,
Facebook, X), le moteur en fait des PNG. Sans Figma, sans navigateur.

```bash
npx create-brand-artisan mes-visuels
cd mes-visuels
npm run build   # rend l'exemple livré en PNG dans out/
npm run dev     # aperçu navigable sur http://localhost:4000
```

Le squelette n'est pas vide : il embarque **Calame**, une marque de démonstration
fictive complète (charte, voix, logo, favicon, toolchain, un visuel). La première
commande produit donc une image, avant que tu aies écrit quoi que ce soit.
Calame se remplace par ta marque, puis se supprime.

## Ce que la commande fait

1. Copie le squelette dans le dossier cible, qui doit être vide : chartes
   (`brands/`), visuels (`templates/`), scripts d'assets (`tools/`), polices
   (`fonts/`).
2. Lance `npm install` : le moteur
   [`brand-artisan`](https://www.npmjs.com/package/brand-artisan) arrive dans
   `node_modules`, comme Next chez un utilisateur de Next. Il se met à jour par
   `npm update`, ton projet ne contient que ta marque.
3. Pose les skills Claude Code dans `.claude/skills/` (`brand-artisan skills
   sync`) : `/new-project`, `/og-image`, `/linkedin-post`, `/campagne`… pour
   produire des visuels alignés sur ta charte avec un agent IA.

Usage : `npx create-brand-artisan [dossier] [--no-install]`. Sans dossier, le
projet est posé dans le dossier courant. `--no-install` copie les fichiers sans
lancer `npm install`.

Toute la documentation (CLI, contrat de template, API, toolchain de marque,
skills) vit dans le
[README de brand-artisan](https://github.com/roslove44/brand-artisan#readme).

## Licence

MIT. Les polices du squelette (`fonts/`) sont sous SIL Open Font License 1.1,
voir `fonts/NOTICE.md` dans le projet généré.
