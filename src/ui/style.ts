// Feuille de style du navigateur de visuels : fenêtre façon Finder macOS,
// thème clair/sombre suivant le système (prefers-color-scheme).
export const STYLE = `
	:root {
		--desktop: linear-gradient(150deg, #6f94c6 0%, #a9bcd9 48%, #d6cbe2 100%);
		--sidebar-bg: rgba(240, 238, 243, 0.78);
		--content-bg: #ffffff;
		--toolbar-bg: rgba(250, 250, 251, 0.92);
		--text: #1d1d1f;
		--text-2: #7c7c82;
		--accent: #0a7aff;
		--sel: #0a63e1;
		--hover: rgba(0, 0, 0, 0.05);
		--active-item: rgba(0, 0, 0, 0.08);
		--border: rgba(0, 0, 0, 0.09);
		--row-alt: #f5f5f7;
		--seg-bg: rgba(0, 0, 0, 0.06);
		--seg-active: #ffffff;
		--thumb-edge: rgba(0, 0, 0, 0.12);
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--desktop: linear-gradient(150deg, #26374d 0%, #171c29 52%, #2b2336 100%);
			--sidebar-bg: rgba(41, 39, 45, 0.74);
			--content-bg: #212125;
			--toolbar-bg: rgba(38, 38, 43, 0.92);
			--text: #f2f2f4;
			--text-2: #9a9aa1;
			--accent: #3f9bff;
			--sel: #1868d2;
			--hover: rgba(255, 255, 255, 0.06);
			--active-item: rgba(255, 255, 255, 0.11);
			--border: rgba(255, 255, 255, 0.1);
			--row-alt: rgba(255, 255, 255, 0.035);
			--seg-bg: rgba(255, 255, 255, 0.08);
			--seg-active: #5c5c62;
			--thumb-edge: rgba(255, 255, 255, 0.14);
		}
	}

	* { box-sizing: border-box; }
	body {
		margin: 0;
		height: 100vh;
		padding: 22px;
		background: var(--desktop) fixed;
		color: var(--text);
		font: 13px/1.45 -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	a { color: inherit; text-decoration: none; }

	/* ---- Fenêtre ---- */
	.window {
		display: grid;
		grid-template-columns: 210px 1fr;
		height: 100%;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 32px 90px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.22);
	}

	/* ---- Sidebar ---- */
	.sidebar {
		background: var(--sidebar-bg);
		backdrop-filter: blur(28px) saturate(1.6);
		border-right: 1px solid var(--border);
		padding: 0 10px 12px;
		overflow-y: auto;
	}
	.lights { display: flex; gap: 8px; padding: 20px 10px 18px; }
	.lights i { width: 12px; height: 12px; border-radius: 50%; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.2); }
	.lights .r { background: #ff5f57; }
	.lights .y { background: #febc2e; }
	.lights .g { background: #28c840; }
	.side-section {
		padding: 12px 10px 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-2);
	}
	.side-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 10px;
		border-radius: 6px;
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.side-item svg { flex: none; color: var(--accent); }
	.side-item:hover { background: var(--hover); }
	.side-item.active { background: var(--active-item); }

	/* ---- Panneau droit ---- */
	.pane { display: flex; flex-direction: column; min-width: 0; background: var(--content-bg); }
	.toolbar {
		display: flex;
		align-items: center;
		gap: 6px;
		flex: none;
		height: 52px;
		padding: 0 14px;
		background: var(--toolbar-bg);
		backdrop-filter: blur(28px) saturate(1.6);
		border-bottom: 1px solid var(--border);
	}
	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: 6px;
		background: none;
		color: var(--text-2);
		cursor: pointer;
	}
	.nav-btn:hover { background: var(--hover); color: var(--text); }
	.toolbar h1 { margin: 0 0 0 6px; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.spacer { flex: 1; }
	.segmented { display: flex; gap: 2px; padding: 2px; border-radius: 8px; background: var(--seg-bg); }
	.segmented a {
		display: flex;
		align-items: center;
		padding: 4px 11px;
		border-radius: 6px;
		color: var(--text-2);
	}
	.segmented a.active { background: var(--seg-active); color: var(--text); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18); }
	.tool-link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 11px;
		border-radius: 7px;
		background: var(--seg-bg);
		color: var(--text);
		font-size: 12.5px;
	}
	.tool-link:hover { background: var(--active-item); }

	.content { flex: 1; min-height: 0; overflow: auto; }
	.empty { padding: 48px; text-align: center; color: var(--text-2); }

	/* ---- Vue icônes ---- */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
		gap: 10px 4px;
		padding: 16px;
	}
	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
		padding: 12px 8px 10px;
		border-radius: 9px;
	}
	.cell:hover { background: var(--hover); }
	.cell .thumb { display: flex; align-items: center; justify-content: center; height: 96px; }
	.cell .thumb img {
		max-width: 124px;
		max-height: 92px;
		border-radius: 3px;
		box-shadow: 0 0 0 1px var(--thumb-edge), 0 2px 6px rgba(0, 0, 0, 0.2);
	}
	.cell .label {
		max-width: 100%;
		font-size: 12.5px;
		text-align: center;
		overflow-wrap: break-word;
	}
	.cell .meta { font-size: 11px; color: var(--text-2); }

	/* ---- Vue liste ---- */
	table.list { width: 100%; border-collapse: collapse; font-size: 13px; }
	table.list th {
		position: sticky;
		top: 0;
		padding: 7px 14px;
		background: var(--content-bg);
		border-bottom: 1px solid var(--border);
		color: var(--text-2);
		font-weight: 500;
		text-align: left;
	}
	table.list td { padding: 5px 14px; white-space: nowrap; }
	table.list tbody tr { cursor: default; }
	table.list tbody tr:nth-child(even) { background: var(--row-alt); }
	table.list tbody tr:hover { background: var(--hover); }
	.name-cell { display: flex; align-items: center; gap: 9px; min-width: 0; }
	.name-cell > svg, .name-cell > img { flex: none; }
	.name-cell img { max-height: 18px; max-width: 30px; border-radius: 2px; box-shadow: 0 0 0 1px var(--thumb-edge); }
	.name-cell .mini-fld { color: var(--accent); }
	td.dim, td.type { color: var(--text-2); }

	/* ---- Vue galerie ---- */
	.gallery { display: flex; flex-direction: column; height: 100%; }
	.stage { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; padding: 22px 22px 8px; }
	.slide { display: flex; align-items: center; justify-content: center; margin: 0; max-width: 100%; max-height: 100%; }
	.slide[hidden] { display: none; }
	.slide img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 4px;
		box-shadow: 0 0 0 1px var(--thumb-edge), 0 14px 40px rgba(0, 0, 0, 0.3);
	}
	.ginfo { flex: none; padding: 10px 16px 2px; text-align: center; }
	.ginfo .gmeta { color: var(--text-2); font-size: 12px; }
	.strip {
		flex: none;
		display: flex;
		gap: 8px;
		padding: 12px 16px 16px;
		overflow-x: auto;
		justify-content: safe center;
	}
	.gitem {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 66px;
		height: 54px;
		padding: 2px;
		border: 2px solid transparent;
		border-radius: 7px;
		background: none;
		cursor: pointer;
	}
	.gitem img { max-width: 56px; max-height: 44px; border-radius: 2px; box-shadow: 0 0 0 1px var(--thumb-edge); }
	.gitem.sel { border-color: var(--accent); }

	/* ---- Aperçu d'une image ---- */
	.preview-stage { display: flex; align-items: center; justify-content: center; height: 100%; padding: 26px; }
	.preview-stage img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 4px;
		box-shadow: 0 0 0 1px var(--thumb-edge), 0 18px 50px rgba(0, 0, 0, 0.32);
	}

	/* ---- Barre de chemin ---- */
	.pathbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex: none;
		height: 30px;
		padding: 0 14px;
		border-top: 1px solid var(--border);
		background: var(--toolbar-bg);
		font-size: 11.5px;
		color: var(--text-2);
	}
	.crumbs { display: flex; align-items: center; gap: 5px; min-width: 0; overflow: hidden; white-space: nowrap; }
	.crumbs svg { flex: none; color: var(--accent); }
	.crumbs a:hover { color: var(--text); }
	.crumbs .sep { opacity: 0.55; }
	.status { flex: none; }
`;
