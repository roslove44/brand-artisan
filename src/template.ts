import type { ReactNode } from "react";
import { capitalize } from "./utils";

// Contrat d'un template : un fichier .tsx sous templates/ exporte ca par defaut.
// Il charge lui-meme ses assets (co-location), serve.ts/build.ts ne font que l'appeler.
// title : libelle humain du visuel ; si absent, fallback sur le nom de fichier capitalise.
export type Template = {
	size: { width: number; height: number };
	title?: string;
	render: () => ReactNode;
};

// Libelle resolu d'un visuel : son title, ou a defaut le nom de fichier capitalise.
// Source unique du nom, partagee par le serveur (titre de page) et le build (nom de PNG).
export const resolveTitle = (tpl: Template, name: string) => tpl.title ?? capitalize(name);
