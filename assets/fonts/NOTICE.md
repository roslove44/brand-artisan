# Polices fournies avec BrandArtisan

Satori n'accède à aucune police système : les fichiers doivent être présents dans
le dépôt. Ceux-ci sont **redistribués sous SIL Open Font License 1.1**, dont le
texte accompagne les fichiers comme l'OFL l'exige.

| Fichier | Famille | Auteurs | Licence | Source |
|---|---|---|---|---|
| `Geist-400.ttf`, `Geist-600.ttf`, `Geist-700.ttf` | Geist | The Geist Project Authors (Andrés Briganti, Mateo Zaragoza, Basement.studio, Vercel) | OFL 1.1, [`OFL-Geist.txt`](OFL-Geist.txt) | [vercel/geist-font](https://github.com/vercel/geist-font) |
| `GeistMono-400.ttf`, `GeistMono-600.ttf` | Geist Mono | idem | OFL 1.1, [`OFL-Geist.txt`](OFL-Geist.txt) | [vercel/geist-font](https://github.com/vercel/geist-font) |
| `Sora-500.ttf`, `Sora-700.ttf` | Sora | The Sora Project Authors | OFL 1.1, [`OFL-Sora.txt`](OFL-Sora.txt) | [google/fonts](https://github.com/google/fonts/tree/main/ofl/sora) |

Les fichiers Geist sont des **statiques instanciés** depuis la police variable
d'origine ; l'OFL couvre ces versions modifiées, à condition de ne pas réutiliser
le nom réservé de la police pour une version modifiée distribuée sous ce nom.

## Ajouter une police

Déposer le fichier ici suffit : `src/render.ts` scanne ce dossier au démarrage,
il n'y a aucune déclaration à écrire dans le code. Quatre conditions :

1. **Licence compatible avec la redistribution** (OFL, Apache 2.0, domaine
   public). Une police achetée sous licence propriétaire ne se commite pas dans
   un dépôt public : la garder hors dépôt.
2. **Format `.ttf` ou `.otf`.** Satori ne lit pas le `woff2`.
3. **Nom du fichier : `<Famille>-<graisse>.ttf`.** C'est lui qui fait foi, un
   fichier hors convention fait échouer le rendu au démarrage avec un message
   explicite. La famille s'écrit en PascalCase et les mots sont séparés à la
   lecture : `GeistMono-600.ttf` donne la famille `Geist Mono` en graisse 600,
   c'est-à-dire le nom exact à citer dans le `fontFamily` d'un template. Un nom
   qui contient déjà une espace est repris tel quel (`DM Sans-400.ttf`).
4. **Déposer le texte de licence ici** (`OFL-<Police>.txt` ou équivalent) et
   ajouter une ligne au tableau ci-dessus.

Seuls les `.ttf` et `.otf` sont lus : les fichiers de licence de ce dossier sont
ignorés par le scan.
