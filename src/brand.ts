import { root } from "./root";

// Independant de la profondeur de l'appelant : pas de "../../.." a compter.
const BRANDS = root("brands/");

/** brand("calame/favicon/icon.svg") -> URL absolue, prete pour readFile. */
export const brand = (path: string) => new URL(path, BRANDS);
