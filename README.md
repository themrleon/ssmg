# SSMG - Simple Seedable Map Generator
Simple library to generate maps, with seed support. The output is a JSON object containing an array of tile types and the map metadata!

<img src="https://github.com/themrleon/ssmg/blob/71970a7c724faad531571cda30cf2e52e3e8ea16/map.png" />

## Features  
* Simple: Just one `Map` class, one input, one output
* Tiles: Ocean, shore, sand, grass, stone and tree
* Seed: Optional seed otherwise map will be random
* ESM format: Same file works on NodeJS and Browser
* Portable: The library is about data only, no rendering involved
* Built with TypeScript and JSDoc syntax
* No external dependencies
* Sandbox: [Demo](https://themrleon.github.io/ssmg/) page to test the map parameters and see the results instantly

## Usage
The file `ssmg.mjs` is an ES module and can be used by both Browser and NodeJS:
* Browser:
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script src="ssmg.mjs" type="module"></script>
    <script type="module">
      import { Map } from "ssmg.mjs";
      const map = new Map({ width: 100, height: 100 });
      console.log(map);
    </script>
  </body>
</html>
```
* NodeJS:
```node
import { Map } from "ssmg.mjs";
const map = new Map({ width: 100, height: 100 });
console.log(map);
```
## Map Constructor (Input)
The only required options are `width` and `height`, the rest are optional and have the default:
```json
{
  "width": 100,
  "height": 100,
  "smoothLevel": 25,
  "elevationMax": 500,
  "elevationMin": 0,
  "percentageGrass": 0.3,
  "percentageStone": 0.3,
  "percentageSand": 0.03,
  "percentageShore": 0.08,
  "seed": 0
}
```
## Map Object (Output)
This is the returned `Map` object:
```json
{
  "metadata": {
    "elevationMin": 294.3039998981517,
    "elevationMax": 294.304000077964,
    "elevationDelta": 1.798123321350431e-7,
    "tilesCount": {
      "stone": 8,
      "grass": 7,
      "sand": 0,
      "shore": 5,
      "ocean": 5,
      "tree": 0
    }
  },
  "seed": 1670705228634,
  "tilemap": [[3,3,3,3,3],[0,0,0,0,0],[4,4,4,4,4],[4,4,4,0,0],[2,2,2,2,2]]
```
The `tilemap` will be a large 2d array (example above was a tiny 5x5 map), each element represents a tile from 0 (Grass) to 5 (Tree):
```typescript
enum mapTileType {
  Grass,
  Sand,
  Shore,
  Ocean,
  Stone,
  Tree
}
```
## The Library File
The library is a module, in the ES format. You can use the file directly from `dist/ssmg.mjs` or build locally with `npm run build`.

## NPM Package
Run `npm i ssmg` and import like this:
```javascript
import { Map } from "ssmg";
console.log(new Map({width: 100, height: 100}))
```
Note: Make sure to add `"type": "module"` to your `package.json`!

## Demo Page
The library is just about the map generation, there is no rendering involved! however I put a [demo](https://themrleon.github.io/ssmg/) page whereas you can play with the map parameters to instantly see the results, using HTML canvas. The options ranges are just a suggestion. To run locally: `npm run demo`
