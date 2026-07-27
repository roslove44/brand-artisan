// Surface publique du moteur : ce qu'un template importe, et ce qu'un projet
// consommateur obtient de `import { … } from "brand-artisan"`.
//
// Grace a `exports` dans package.json, ce nom se resout aussi bien depuis
// node_modules chez un tiers que depuis templates/ ici (self-reference Node).
// Une seule ligne d'import a apprendre, la meme partout.
export type { Template } from "./template";
export { brand } from "./brand";
export { root } from "./root";
export { toPng, renderToFile } from "./render";
