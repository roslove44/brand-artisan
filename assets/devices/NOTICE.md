# Châssis d'appareils

Gabarits de terminaux (téléphones, tablettes, portables, TV, quelques terminaux
métier) pour poser une maquette dans un visuel, avec les coordonnées exactes de
leur écran.

## Droits

> Les appareils représentés portent des marques déposées (Apple, Samsung, Google).
> Leur réutilisation dans un support diffusé n'est couverte par aucune licence
> accordée à ce projet. Le modèle `non-branded-android-smartphone` est le seul
> sans marque visible.

## Choisir un modèle

72 modèles, un dossier et une entrée de `catalog.ts` chacun ; le slug est le nom
du dossier. Chaque entrée porte un `category` (`smartphone`, `tablet`, `others`)
et un `brand`, de quoi parcourir le catalogue sans le lire :

```ts
import { devices } from "../../assets/devices/frame";

const tablettes = Object.entries(devices).filter(([, d]) => d.category === "tablet");
```

## Poser un châssis

**L'ordre compte.** La dalle du châssis est noire et opaque : le châssis
**d'abord**, le visuel **par-dessus**. Un visuel posé dessous ne se verrait pas.
L'encoche se retrouve alors recouverte, comme sur une vraie capture.

```tsx
import { frame } from "../../assets/devices/frame";

const f = await frame("apple-iphone-15-pro-2023", 300);

// Dans le render :
<div style={{ display: "flex", position: "relative", width: f.width, height: f.height }}>
  <img src={f.src} width={f.width} height={f.height} alt=""
       style={{ position: "absolute", left: 0, top: 0 }} />
  <div
    style={{
      position: "absolute",
      left: f.screen.x, top: f.screen.y,
      width: f.screen.width, height: f.screen.height,
      borderRadius: f.screen.radius,
      display: "flex",
      // ici le visuel : aplat, dégradé, ou une <img> de capture
    }}
  />
</div>
```

`frame(slug, width)` met tout à l'échelle de la largeur demandée, coordonnées
d'écran comprises : aucun calcul à faire.

### Rendre le template en `scale: 2`

Ces PNG sont **indexés en palette** et leur transparence ne compte que **4 à 16
niveaux d'alpha** selon le modèle, là où un bord lissé en demande 256. Posés
petits, ils subissent une forte réduction (un téléphone de 864 px rendu à 200,
c'est 4,3x) et resvg sous-échantillonne : le contour part en marches d'escalier
et en moucheture grise, très visible sur les bords courbes d'un téléphone.

Le remède tient en un champ :

```ts
const SIZE = { width: 1080, height: 1350, scale: 2 };
```

Le moteur rend alors en 2160 px et la réduction n'est plus que de 2,2x. Le bord
redevient propre. À réserver aux visuels qui contiennent un châssis : un
template purement vectoriel n'a pas ce problème et n'a rien à y gagner.

## Ajouter un modèle

Le catalogue et le contenu du dossier se répondent exactement, et cet accord est
la règle à tenir : un `device.png` sans son entrée n'a pas de coordonnées
d'écran. Deux gestes, dans cet ordre.

1. **Le châssis.** Déposer son `device.png` dans `assets/devices/<slug>/`,
   détouré sur l'extérieur, écran vide.
2. **Les mesures.** Ajouter son entrée dans `catalog.ts`, relevée sur la dalle
   sombre visible du châssis.

| Champ | Sens |
| --- | --- |
| `image` | dimensions de `device.png` |
| `viewport` | taille logique de la fenêtre, en px CSS |
| `screen` | zone d'écran **en pixels de l'image** : `x`, `y`, `width`, `height` |
| `screen.radius` | rayon des coins, en pixels de l'image, ou `null` |

**`viewport` et `screen` ne sont pas dans la même unité.** Le premier est la
taille logique de la page, le second des pixels de l'image, et les châssis sont
rendus en 2x : `screen` vaut donc le double de `viewport` sur tout le catalogue.
C'est `screen` qui sert à poser un visuel ; `viewport` ne fait que documenter la
définition simulée. `radius` vaut `0` sur les écrans droits (portables, iMac),
et `null` si aucun rayon unique ne se dégage : `frame` retombe alors sur 0, à
arrondir à vue.

**Vérifier plutôt que croire.** Ces nombres ont l'air crédibles même quand ils
sont faux, et rien dans le code ne les contredira. Le contrôle tient en un
rendu : poser un aplat de couleur vive à `f.screen` par-dessus le châssis, comme
dans l'exemple ci-dessus, puis ajuster jusqu'à ce que la couleur remplisse la
dalle sans déborder sur la lunette et que ses coins épousent l'arrondi. C'est
aussi comme ça qu'on trouve `radius` : on l'augmente jusqu'à ce que les angles
coïncident. Ce contrôle a déjà écarté un appareil à double dalle, qu'un seul
rectangle ne pouvait pas représenter ; tout modèle au `radius` indéterminé
mérite le même examen.
