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
range les siennes ailleurs, et `npx skills add roslove44/brand-artisan` connaît
leurs dossiers mieux que nous. Pour travailler dessus, les charger depuis ta
copie de travail plutôt que depuis `main` : sous Claude Code,
`/plugin marketplace add ./` puis `/plugin install brand-artisan@brand-artisan`.

## Conventions

- Les règles de travail du dépôt (charte par projet, contrat de template,
  exigence graphique) vivent dans [`CLAUDE.md`](CLAUDE.md). Faire évoluer le
  moteur implique de mettre à jour les skills (`skills/`) en miroir,
  dans le même changement. `npm test` les valide (`test/skills.test.ts`) : c'est
  leur seul filet, puisqu'elles se publient hors des paquets.
- Commits en anglais, format [Conventional Commits](https://www.conventionalcommits.org/) :
  `feat(scope): …`, `fix(scope): …`.
- La marque de référence du dépôt est `rostand-migan` (`brands/`, `templates/`,
  `tools/`) : le parcours complet d'une marque, de la charte aux visuels.
