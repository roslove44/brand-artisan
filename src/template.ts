import type { ReactNode } from "react";

// Contrat d'un template : un fichier .tsx sous templates/ exporte ca par defaut.
// Il charge lui-meme ses assets (co-location), serve.ts/build.ts ne font que l'appeler.
export type Template = {
	size: { width: number; height: number };
	alt: string;
	render: () => ReactNode;
};
