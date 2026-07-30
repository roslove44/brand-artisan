import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1500, height: 500 }; // 3:1, format d'en-tete generique

// Palette charte Calame, variante fond sombre (brands/calame/brand.md).
const GROUND = "#1c1917"; // stone-900, l'encre servant de fond
const LIGHT = "#fafaf9"; // stone-50, l'encre claire exigee sur fond sombre
const MUTED = "#78716c"; // stone-500, reserve au filet : trop faible pour du texte ici

const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const logoSrc = await uri("calame/logo/logo-dark.svg"); // fond sombre -> variante eclaircie

// Concept : une banniere porte l'identite, pas un message. Hierarchie inverse de
// l'OG, ou le titre ecrasait le logotype : ici le logotype est le sujet et la
// phrase chuchote. Le filet part de l'accroche et fuit vers la droite, "dans le
// sens de l'ecriture" comme le dit la charte du mark : il occupe le vide au lieu
// de le laisser vide, sans ajouter un second accent (celui du mark suffit).
function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				padding: "0 120px",
				backgroundColor: GROUND,
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
				<img src={logoSrc} height={96} alt="calame" />

				<div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
					<div style={{ display: "flex", fontFamily: "Geist", fontWeight: 400, fontSize: 30, color: LIGHT }}>La doc suit le code</div>
					<div style={{ display: "flex", flex: 1, height: 1, marginLeft: 32, backgroundColor: MUTED }} />
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Bannière Calame", render } satisfies Template;
