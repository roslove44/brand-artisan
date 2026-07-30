import type { ReactNode } from "react";
import { capitalize } from "./utils";

// Contrat d'un template : un .tsx sous templates/ exporte ca par defaut. Il
// charge lui-meme ses assets (co-location), serve.ts et build.ts ne font que
// l'appeler.
export type Template = {
	size: { width: number; height: number; scale?: number };
	title?: string;
	render: () => ReactNode;
};

// Source unique du nom, partagee par le serveur (titre de page) et le build (nom de PNG).
export const resolveTitle = (tpl: Template, name: string) => tpl.title ?? capitalize(name);
