// Racine brands/ ancree sur ce module : independante du cwd ET de la profondeur de
// l'appelant (pas de "../../.." a compter). Meme principe que TEMPLATES dans discover.ts.
const BRANDS = new URL("../brands/", import.meta.url);

// brand("comptaopen/favicon/icon.svg") -> URL absolue vers le fichier, prete pour readFile.
export const brand = (path: string) => new URL(path, BRANDS);
