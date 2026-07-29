# create-brand-artisan

Crée un projet de visuels [BrandArtisan](https://github.com/roslove44/brand-artisan)
prêt à rendre : charte, polices, toolchain de marque et un premier visuel. Le
squelette n'est pas vide, il embarque **Calame**, une marque de démonstration
fictive complète ; un `npm run build` juste après la création produit donc une
image.

```bash
npx create-brand-artisan mes-visuels
cd mes-visuels
npm run build   # rend l'exemple Calame dans out/
npm run dev     # serveur de rendu sur http://localhost:4000
```

Pendant la release candidate, préciser le tag : `npx create-brand-artisan@next mes-visuels`.

Usage : `npx create-brand-artisan [dossier] [--no-install]`. Sans dossier, le
projet est posé dans le dossier courant, qui doit être vide. `--no-install` pose
les fichiers sans lancer `npm install`.

Le moteur, [`brand-artisan`](https://www.npmjs.com/package/brand-artisan), est
installé en dépendance et se met à jour avec `npm update` : le projet généré ne
contient que ta marque. Toute la documentation (contrat de template, CLI,
toolchain de marque, skills pour agent IA) vit dans son README.

## Licence

MIT. Les polices du squelette (`fonts/`) sont sous SIL Open Font License 1.1,
voir `fonts/NOTICE.md`.
