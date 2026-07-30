import { root } from "./root";

// Racine brands/ du projet : independante de la profondeur de l'appelant (pas de
// "../../.." a compter). Meme principe que TEMPLATES dans discover.ts.
const BRANDS = root("brands/");

// brand("calame/favicon/icon.svg") -> URL absolue vers le fichier, prete pour readFile.
export const brand = (path: string) => new URL(path, BRANDS);
