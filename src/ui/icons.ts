// Icônes SVG inline du navigateur de visuels, dessinées à la main (style macOS).
// Les petites icônes héritent de currentColor ; le dossier a son dégradé bleu propre.

// Dossier macOS : languette arrière foncée, panneau avant en dégradé bleu clair.
export const folderIcon = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id="fld-back" x1="0" y1="9" x2="0" y2="22" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#3f8fe8"/><stop offset="1" stop-color="#2e77d4"/>
		</linearGradient>
		<linearGradient id="fld-front" x1="0" y1="17" x2="0" y2="55" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#8fc8fb"/><stop offset="1" stop-color="#4d9df0"/>
		</linearGradient>
	</defs>
	<path d="M5 14c0-2.8 2.2-5 5-5h12.6c1.3 0 2.6.5 3.5 1.5l3.6 3.5H54c2.8 0 5 2.2 5 5v4H5v-9z" fill="url(#fld-back)"/>
	<rect x="5" y="17" width="54" height="38" rx="5" fill="url(#fld-front)"/>
	<rect x="5" y="17" width="54" height="2.5" fill="#ffffff" opacity="0.35"/>
</svg>`;

// Mini dossier plein (sidebar, path bar, vue liste), teinté via currentColor.
export const folderMini = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
	<path d="M2 5.8C2 4.7 2.9 3.8 4 3.8h3.1c.5 0 1 .2 1.4.6l.9.9c.2.2.5.3.7.3h5.9c1.1 0 2 .9 2 2v6.6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5.8z"/>
</svg>`;

// « Tous les visuels » (racine) : quatre tuiles façon Launchpad.
export const rootMini = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
	<rect x="3" y="3" width="6.2" height="6.2" rx="1.8"/>
	<rect x="10.8" y="3" width="6.2" height="6.2" rx="1.8"/>
	<rect x="3" y="10.8" width="6.2" height="6.2" rx="1.8"/>
	<rect x="10.8" y="10.8" width="6.2" height="6.2" rx="1.8"/>
</svg>`;

// Fichier image générique (fallback quand un template ne se charge pas).
export const imageMini = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
	<circle cx="7.2" cy="8.2" r="1.4" fill="currentColor"/>
	<path d="M4.5 14.5l3.6-3.6c.4-.4 1-.4 1.4 0l1.8 1.8 2.1-2.1c.4-.4 1-.4 1.4 0l2.7 2.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export const chevron = (dir: "left" | "right") => `
<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path d="${dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Sélecteur de vue : grille d'icônes, liste, galerie.
export const viewIcons: Record<string, string> = {
	icons: `
<svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
	<rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5"/>
	<rect x="11" y="2.5" width="6.5" height="6.5" rx="1.5"/>
	<rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5"/>
	<rect x="11" y="11" width="6.5" height="6.5" rx="1.5"/>
</svg>`,
	list: `
<svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
	<circle cx="3.8" cy="4.5" r="1.4"/><rect x="7" y="3.5" width="10.5" height="2" rx="1"/>
	<circle cx="3.8" cy="10" r="1.4"/><rect x="7" y="9" width="10.5" height="2" rx="1"/>
	<circle cx="3.8" cy="15.5" r="1.4"/><rect x="7" y="14.5" width="10.5" height="2" rx="1"/>
</svg>`,
	gallery: `
<svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
	<rect x="2.5" y="2.5" width="15" height="10" rx="1.5"/>
	<rect x="2.5" y="15" width="4" height="2.5" rx="1"/>
	<rect x="8" y="15" width="4" height="2.5" rx="1"/>
	<rect x="13.5" y="15" width="4" height="2.5" rx="1"/>
</svg>`,
};

export const downloadIcon = `
<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5M4 16.5h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Marque BrandArtisan, favicon des pages du serveur : encodée en data URI dans
// le <head>, donc sur une ligne et sans attribut superflu.
export const brandMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#b45309"/><path d="M18 18 H58 V33 H33 V58 H18 Z M82 82 H42 V67 H67 V42 H82 Z" fill="#faf9f7"/></svg>`;

// Dossier introuvable : la même silhouette que folderIcon, mais vide et en
// pointillés (currentColor, pas le bleu des dossiers réels), et un point
// d'interrogation à la place du contenu.
export const missingIcon = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
	<path d="M5 23v-9c0-2.8 2.2-5 5-5h12.6c1.3 0 2.6.5 3.5 1.5l3.6 3.5H54c2.8 0 5 2.2 5 5v4"
		stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
	<rect x="6.5" y="23" width="51" height="31" rx="5" stroke="currentColor" stroke-width="3" stroke-dasharray="7 6"/>
	<path d="M27.6 34.6a4.9 4.9 0 1 1 5.4 5.7v2.6" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
	<circle cx="33" cy="48" r="2.1" fill="currentColor"/>
</svg>`;
