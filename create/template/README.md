# Visuels

Projet de visuels [BrandArtisan](https://github.com/roslove44/brand-artisan) :
des images (couvertures, OG, bannières) composées en JSX et rendues en PNG.

```bash
npm run build   # rend tout templates/ dans out/
npm run dev     # serveur de rendu sur http://localhost:4000
```

## Ce qu'il y a dedans

| Chemin | Rôle |
|---|---|
| `brands/<projet>/brand.md` | **Charte, bloquante** : palette, typographie, logo. Aucun visuel ne se compose sans elle. |
| `brands/<projet>/project.md` | Substance et voix : pitch, public, ton, claims autorisés. Sert à **rédiger** les textes. |
| `brands/<projet>/logo`, `/favicon` | Les assets de la marque, consommés par `brand()`. |
| `templates/<projet>/*.tsx` | Un fichier = une image. Il exporte `{ size, title?, render }` par défaut. |
| `tools/<projet>/*.ts` | Scripts qui **produisent** les assets de marque (logo, favicon, `.ico`). |
| `fonts/` | Les polices, avec leurs licences ([`NOTICE.md`](fonts/NOTICE.md)). Satori n'accède à aucune police système. |
| `out/` | Les PNG générés. Ignoré par git. |

## Calame, l'exemple livré

`calame` est une **marque de démonstration** : elle n'existe pas. Elle est là
pour que la première commande produise quelque chose, et pour montrer à quoi
ressemblent une charte complète et un visuel composé. Regarde
`brands/calame/brand.md`, puis `templates/calame/og.tsx`.

Quand tu n'en as plus besoin, supprime `brands/calame/`, `templates/calame/` et
`tools/calame/`.

## Ta marque

Avec un agent IA, les skills font le travail :

```
/new-project ma-marque      # pose brands/ma-marque/brand.md (bloquant) et project.md
/og-image ma-marque         # un visuel de partage aligné sur la charte
/linkedin-post ma-marque    # idem pour LinkedIn, Facebook, X…
/brand-assets ma-marque     # génère logo et favicon par la toolchain
```

Si tu les as passées à la création du projet, elles s'installent quand tu veux,
dans l'agent que tu utilises :

```bash
npx skills add roslove44/brand-artisan
```

Et `npx skills update` les met à jour ensuite.
