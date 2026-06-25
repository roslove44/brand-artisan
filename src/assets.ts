// Racine assets/ ancree sur ce module : independante du cwd ET de la profondeur de
// l'appelant (pas de "../../.." a compter). Meme principe que TEMPLATES dans discover.ts.
const ASSETS = new URL("../assets/", import.meta.url);

// asset("comptaopen/favicon/icon.svg") -> URL absolue vers le fichier, prete pour readFile.
export const asset = (path: string) => new URL(path, ASSETS);
