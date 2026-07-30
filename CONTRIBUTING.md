# Contribuer

Prérequis : **Node.js ≥ 22**.

```bash
git clone https://github.com/roslove44/brand-artisan.git
cd brand-artisan
npm install
```

## Commandes

```bash
npm run dev             # serveur de rendu sur les templates du dépôt
npm run build           # rend toute l'arborescence de templates/ dans out/
npm run check           # typecheck + tests, ce que lance la CI
npm run test:consumer   # empaquette, installe dans un projet vierge et y rend un visuel
npm run test:generator  # génère un projet depuis les tarballs et le rend de bout en bout
```

Les deux derniers sont le filet de publication : ils exercent le moteur depuis
`node_modules` et le squelette depuis le tarball, là où vivent les erreurs de
packaging qu'aucun test unitaire ne voit. La CI lance l'ensemble sur Linux et
Windows, Node 22 et 24, et rend réellement tous les templates du dépôt :
un visuel cassé échoue à l'exécution, pas au typecheck.

## Les deux paquets

Le dépôt publie deux paquets npm, toujours à la même version :

- **`brand-artisan`** (racine) : le moteur et sa CLI.
- **`create-brand-artisan`** (`create/`) : le générateur et son squelette,
  marque de démonstration Calame comprise.

Bumper les deux `package.json` ensemble ; `test:generator` refuse de démarrer
s'ils divergent.

Les skills (`skills/`) ne voyagent dans aucun des deux paquets : chaque agent IA
range les siennes ailleurs, et `npx skills` connaît leurs dossiers mieux que
nous. Pour travailler dessus, les charger depuis ta copie de travail plutôt que
depuis `main` : sous Claude Code, `/plugin marketplace add ./` puis
`/plugin install brand-artisan@brand-artisan`.

## Publier

La publication est automatique. Bumper les deux `package.json`, committer, puis
pousser un tag :

```bash
git tag v0.1.0 && git push origin v0.1.0
```

`.github/workflows/release.yml` fait le reste : il refuse si le tag ne pointe pas
un commit de `main` ou ne porte pas la version des deux paquets, rejoue la suite
complète, puis publie le moteur avant le générateur.

**Le déclencheur est le tag, pas la release GitHub**, et c'est délibéré : sur
`on: release`, la page serait le déclencheur, donc publique avant qu'un seul test
ait tourné, et un échec de publication laisserait une release qui annonce une
version absente de npm. Ici la page est créée en dernier, elle n'existe donc que
si npm a reçu les paquets, et un échec ne laisse qu'un tag à supprimer.

**Le dist-tag se déduit de la version**, il ne se choisit pas : une version qui
porte un suffixe de préversion (`0.1.0-rc.2`) part sur `next`, une version stable
sur `latest`. npm posant `latest` d'office sur toute version publiée sans `--tag`,
c'est ce calcul qui empêche une préversion de devenir la version par défaut.

**Aucun token npm n'existe dans ce dépôt.** L'authentification passe par
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) : GitHub
prouve l'identité du workflow, npm délivre un jeton valable le temps de la
publication, et l'**attestation de provenance est signée d'office** (le drapeau
`--provenance` est donc inutile). La configuration a été posée une fois par paquet :

```bash
npm trust github brand-artisan        --repo roslove44/brand-artisan --file release.yml --allow-publish
npm trust github create-brand-artisan --repo roslove44/brand-artisan --file release.yml --allow-publish
```

Deux conséquences à ne pas découvrir un jour de release : **renommer
`release.yml` casse la publication**, le nom du fichier faisant partie du contrat
de confiance ; et le job doit tourner en **Node 24**, Node 22 embarquant un npm
antérieur au 11.5.1 qu'exige le trusted publishing.

## Conventions

- Les règles de travail du dépôt (charte par projet, contrat de template,
  exigence graphique) vivent dans [`CLAUDE.md`](CLAUDE.md). Faire évoluer le
  moteur implique de mettre à jour les skills (`skills/`) en miroir,
  dans le même changement. `npm test` les valide (`test/skills.test.ts`) : c'est
  leur seul filet, puisqu'elles se publient hors des paquets.
- Commits en anglais, format [Conventional Commits](https://www.conventionalcommits.org/) :
  `feat(scope): …`, `fix(scope): …`.
- La marque de référence du dépôt est `calame` (`brands/`, `templates/`,
  `tools/`) : le parcours complet d'une marque, de la charte aux visuels. Elle
  est **fictive**, donc reprenable, contrairement à une marque réelle.
- **Calame existe en double**, à la racine et dans `create/template/`, parce
  qu'un paquet npm ne peut pas référencer de fichiers hors de son dossier.
  `test/calame.test.ts` compare les fichiers communs au hachage : toute
  divergence échoue. Les visuels en plus (`banner`, `card`) restent à la racine,
  le squelette généré gardant son unique OG.
