// Pages HTML du serveur de dev : une fenêtre façon Finder macOS
// (sidebar, toolbar, vues icônes/liste/galerie, barre de chemin).
import { esc, capitalize, last } from "../utils";
import { STYLE } from "./style";
import { folderIcon, folderMini, rootMini, imageMini, chevron, viewIcons, downloadIcon, brandMark } from "./icons";

const PROJECT_NAME = "BrandArtisan";

export const VIEWS = ["icons", "list", "gallery"] as const;
export type View = (typeof VIEWS)[number];

// Un enfant d'un dossier. broken = template qui ne charge pas. `ext` renseigne =
// fichier deja sur disque (sortie d'outil), servi tel quel : sa vignette est lui-meme.
export type Entry =
	| { kind: "dir"; name: string; rel: string }
	| { kind: "image"; name: string; rel: string; title: string; width: number; height: number; broken?: boolean; ext?: string };

// La vue courante est conservée pour les dossiers ("icons" = défaut, sans query).
const dirHref = (rel: string, view: View) => `/${esc(rel)}${view === "icons" ? "" : `?view=${view}`}`;
const imgHref = (rel: string) => `/${esc(rel)}`;
// Vignette : rendu a la largeur voulue pour un template, fichier brut sinon.
const thumbSrc = (e: Entry & { kind: "image" }, w: number) =>
	e.ext ? `/${esc(e.rel)}?raw` : `/${esc(e.rel)}?thumb=${w}`;

const dims = (e: Entry) => (e.kind === "image" && !e.broken && e.width ? `${e.width}×${e.height}` : "");

// Petit JS partagé : lignes cliquables (vue liste) + sélection/clavier de la galerie.
const SCRIPT = `
	document.addEventListener("click", (e) => {
		const row = e.target.closest("[data-href]");
		if (row && !e.target.closest("a") && !row.classList.contains("gitem")) location.href = row.dataset.href;
	});
	const gallery = document.querySelector(".gallery");
	if (gallery) {
		const slides = [...gallery.querySelectorAll(".slide")];
		const items = [...gallery.querySelectorAll(".gitem")];
		const label = gallery.querySelector(".glabel");
		const meta = gallery.querySelector(".gmeta");
		let sel = 0;
		const show = (i) => {
			sel = (i + items.length) % items.length;
			slides.forEach((s, j) => (s.hidden = j !== sel));
			items.forEach((b, j) => b.classList.toggle("sel", j === sel));
			label.textContent = items[sel].dataset.label;
			meta.textContent = items[sel].dataset.meta;
			items[sel].scrollIntoView({ inline: "nearest", block: "nearest" });
		};
		items.forEach((b, i) => {
			b.addEventListener("click", () => show(i));
			b.addEventListener("dblclick", () => (location.href = b.dataset.href));
		});
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight") show(sel + 1);
			else if (e.key === "ArrowLeft") show(sel - 1);
			else if (e.key === "Enter" && items.length) location.href = items[sel].dataset.href;
		});
		if (items.length) show(0);
	}
	const stage = document.querySelector(".preview-stage");
	if (stage) {
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft" && stage.dataset.prev) location.href = stage.dataset.prev;
			else if (e.key === "ArrowRight" && stage.dataset.next) location.href = stage.dataset.next;
		});
		stage.querySelector("img").addEventListener("click", () => {
			const zoomed = stage.classList.toggle("zoomed");
			if (zoomed) {
				stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
				stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
			}
		});
	}
`;

function sidebar(relPath: string, favorites: string[], view: View): string {
	const first = relPath.split("/")[0];
	const item = (href: string, icon: string, name: string, active: boolean) =>
		`<a class="side-item${active ? " active" : ""}" href="${href}">${icon}<span>${esc(name)}</span></a>`;
	return `
		<aside class="sidebar">
			<div class="lights"><i class="r"></i><i class="y"></i><i class="g"></i></div>
			<div class="side-section">Favorites</div>
			${item(dirHref("", view), rootMini(16), "All visuals", relPath === "")}
			<div class="side-section">Projects</div>
			${favorites.map((p) => item(dirHref(p, view), folderMini(16), p, p === first)).join("\n")}
		</aside>`;
}

// Barre de chemin en bas : BrandArtisan › projet › visuel, + compteur d'éléments.
function pathbar(relPath: string, view: View, leafIsImage: boolean, status: string): string {
	const segs = relPath ? relPath.split("/") : [];
	const crumbs = [`${rootMini(12)}<a href="${dirHref("", view)}">${esc(PROJECT_NAME)}</a>`];
	let acc = "";
	segs.forEach((s, i) => {
		acc = acc ? `${acc}/${s}` : s;
		const isLeaf = i === segs.length - 1;
		const icon = isLeaf && leafIsImage ? imageMini(12) : folderMini(12);
		crumbs.push(isLeaf ? `${icon}<span>${esc(s)}</span>` : `${icon}<a href="${dirHref(acc, view)}">${esc(s)}</a>`);
	});
	return `
		<footer class="pathbar">
			<div class="crumbs">${crumbs.join(`<span class="sep">›</span>`)}</div>
			<div class="status">${esc(status)}</div>
		</footer>`;
}

// Squelette commun : fenêtre = sidebar + (toolbar / contenu / barre de chemin).
function windowShell(opts: {
	pageTitle: string;
	heading: string;
	relPath: string;
	view: View;
	favorites: string[];
	toolbarRight: string;
	content: string;
	leafIsImage: boolean;
	status: string;
}): string {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${esc(opts.pageTitle)}</title>
	<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(brandMark)}" />
	<style>${STYLE}</style>
</head>
<body>
	<main class="window">
		${sidebar(opts.relPath, opts.favorites, opts.view)}
		<section class="pane">
			<header class="toolbar">
				<button class="nav-btn" onclick="history.back()" title="Back">${chevron("left")}</button>
				<button class="nav-btn" onclick="history.forward()" title="Forward">${chevron("right")}</button>
				<h1>${esc(opts.heading)}</h1>
				<div class="spacer"></div>
				${opts.toolbarRight}
			</header>
			<div class="content">${opts.content}</div>
			${pathbar(opts.relPath, opts.view, opts.leafIsImage, opts.status)}
		</section>
	</main>
	<script>${SCRIPT}</script>
</body>
</html>`;
}

function viewSwitcher(relPath: string, view: View): string {
	const labels: Record<View, string> = { icons: "Icons", list: "List", gallery: "Gallery" };
	return `<nav class="segmented">${VIEWS.map(
		(v) => `<a class="${v === view ? "active" : ""}" href="${dirHref(relPath, v)}" title="${labels[v]}">${viewIcons[v]}</a>`,
	).join("")}</nav>`;
}

// Dossier bleu, vignette rendue, ou fallback si le template est cassé.
function entryIcon(e: Entry, folderSize: number, thumbWidth: number): string {
	if (e.kind === "dir") return folderIcon(folderSize);
	if (e.broken) return imageMini(Math.round(folderSize * 0.55));
	return `<img loading="lazy" src="${thumbSrc(e, thumbWidth)}" alt="${esc(e.name)}" />`;
}

function iconsView(entries: Entry[], view: View): string {
	const cells = entries.map((e) => {
		const href = e.kind === "dir" ? dirHref(e.rel, view) : imgHref(e.rel);
		const meta = dims(e);
		return `
			<a class="cell" href="${href}">
				<span class="thumb">${entryIcon(e, 78, 280)}</span>
				<span class="label">${esc(e.name)}</span>
				${meta ? `<span class="meta">${meta}</span>` : ""}
			</a>`;
	});
	return `<div class="grid">${cells.join("")}</div>`;
}

function listView(entries: Entry[], view: View): string {
	const rows = entries.map((e) => {
		const href = e.kind === "dir" ? dirHref(e.rel, view) : imgHref(e.rel);
		const icon = e.kind === "dir" ? `<span class="mini-fld">${folderMini(16)}</span>` : entryIcon(e, 30, 64);
		const type = e.kind === "dir" ? "Folder" : `${(e.ext ?? "png").toUpperCase()} image`;
		return `
			<tr data-href="${href}">
				<td><span class="name-cell">${icon}<a href="${href}">${esc(e.name)}</a></span></td>
				<td class="dim">${dims(e) || "--"}</td>
				<td class="type">${type}</td>
			</tr>`;
	});
	return `
		<table class="list">
			<thead><tr><th>Name</th><th>Dimensions</th><th>Type</th></tr></thead>
			<tbody>${rows.join("")}</tbody>
		</table>`;
}

function galleryView(entries: Entry[], view: View): string {
	const slides = entries.map(
		(e) => `<figure class="slide" hidden>${entryIcon(e, 150, 1000)}</figure>`,
	);
	const items = entries.map((e) => {
		const href = e.kind === "dir" ? dirHref(e.rel, view) : imgHref(e.rel);
		const meta = e.kind === "dir" ? "Folder · double-click to open" : `${dims(e) || "--"} · double-click to open`;
		return `
			<button class="gitem" type="button" data-href="${href}" data-label="${esc(e.name)}" data-meta="${esc(meta)}">
				${entryIcon(e, 40, 120)}
			</button>`;
	});
	return `
		<div class="gallery">
			<div class="stage">${slides.join("")}</div>
			<div class="ginfo"><div class="glabel"></div><div class="gmeta"></div></div>
			<div class="strip">${items.join("")}</div>
		</div>`;
}

// `pdf` = le PDF assemblé du dossier, quand il existe sur disque.
export function listingPage(opts: {
	relPath: string;
	view: View;
	entries: Entry[];
	favorites: string[];
	pdf?: { href: string; stale: boolean };
}): string {
	const { relPath, view, entries, favorites, pdf } = opts;
	const heading = relPath ? capitalize(last(relPath)) : PROJECT_NAME;
	const renderers: Record<View, (e: Entry[], v: View) => string> = {
		icons: iconsView,
		list: listView,
		gallery: galleryView,
	};
	const content = entries.length ? renderers[view](entries, view) : `<p class="empty">This folder is empty.</p>`;
	const pdfLink = pdf
		? `<a class="tool-link" href="${esc(pdf.href)}" title="${
				pdf.stale ? "Older than one of the slides: rerun npm run pdf" : "The folder's assembled PDF"
			}">${downloadIcon}<span>PDF${pdf.stale ? " out of date" : ""}</span></a>`
		: "";
	return windowShell({
		pageTitle: relPath ? `${heading} | ${PROJECT_NAME}` : PROJECT_NAME,
		heading,
		relPath,
		view,
		favorites,
		toolbarRight: `${pdfLink}${viewSwitcher(relPath, view)}`,
		content,
		leafIsImage: false,
		status: `${entries.length} item${entries.length === 1 ? "" : "s"}`,
	});
}

export type PreviewNav = { prev: string | null; next: string | null; index: number; count: number };

export function previewPage(opts: {
	relPath: string;
	title: string;
	width: number;
	height: number;
	imgSrc: string;
	favorites: string[];
	nav: PreviewNav;
	ext?: string;
}): string {
	const { relPath, title, width, height, imgSrc, favorites, nav } = opts;
	const arrow = (dir: "left" | "right", href: string | null) =>
		href ? `<a class="pv-nav ${dir}" href="${esc(href)}" title="${dir === "left" ? "Previous image" : "Next image"}">${chevron(dir)}</a>` : "";
	const position = nav.index >= 0 && nav.count > 1 ? `${nav.index + 1} of ${nav.count} · ` : "";
	// Largeur de fit : taille naturelle, plafonnée par le viewport du stage (marges
	// comprises) en largeur comme en hauteur, ratio préservé via le ratio connu.
	// Dimensions inconnues (fichier au format non mesuré) -> on se contente du cadre.
	const fitWidth = width && height
		? `min(${width}px, 100cqw - 128px, calc((100cqh - 52px) * ${(width / height).toFixed(4)}))`
		: `calc(100cqw - 128px)`;
	const size = width && height ? `${width}×${height}` : (opts.ext ?? "").toUpperCase();
	return windowShell({
		pageTitle: `${title} | ${PROJECT_NAME} · ${size}`,
		heading: title,
		relPath,
		view: "icons",
		favorites,
		toolbarRight: `<a class="tool-link" href="${esc(imgSrc)}" download>${downloadIcon}<span>${(opts.ext ?? "png").toUpperCase()}</span></a>`,
		content: `
			<style>.preview-stage img { width: ${fitWidth}; }</style>
			<div class="preview">
				<div class="preview-stage"${nav.prev ? ` data-prev="${esc(nav.prev)}"` : ""}${nav.next ? ` data-next="${esc(nav.next)}"` : ""}>
					<img src="${esc(imgSrc)}" alt="${esc(title)}"${width && height ? ` width="${width}" height="${height}"` : ""} />
				</div>
				${arrow("left", nav.prev)}
				${arrow("right", nav.next)}
			</div>`,
		leafIsImage: true,
		status: `${position}${title}${size ? ` · ${size}` : ""}`,
	});
}
