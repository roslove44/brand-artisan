#!/usr/bin/env node
// Seul fichier du paquet ecrit en JavaScript : c'est celui que node doit pouvoir
// lire sans transformation. Il enregistre tsx une fois pour toutes, ce qui rend
// lisibles a la fois le moteur (.ts) et les templates du projet (.tsx). Ces
// derniers sont charges a l'execution, donc un moteur precompile aurait quand
// meme besoin de ce chargeur : d'ou du .ts livre tel quel, sans etape de build.
import { register } from "tsx/esm/api";

register();
await import("../src/cli.ts");
