import { Map, mapOptions, mapTileType } from './map'

const ctx: any = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
const tileColor = {
  [mapTileType.Grass]: 'green',
  [mapTileType.Sand]: 'yellow',
  [mapTileType.Shore]: 'cyan',
  [mapTileType.Ocean]: 'blue',
  [mapTileType.Stone]: 'gray',
  [mapTileType.Tree]: 'brown',
}
updateMap();

document.querySelector<any>('#button').addEventListener("click", function () {
  updateMap();
});

function getElementValueAsNumber(id: string) {
  return Number(document.querySelector<HTMLInputElement>(id)?.value)
}

function updateMap() {
  const width: number = getElementValueAsNumber('#width') || 100;
  const height: number = getElementValueAsNumber('#height') || 100;
  const smoothLevel: number = getElementValueAsNumber('#smoothLevel') || 25;
  const elevationMax: number = getElementValueAsNumber('#elevationMax') || 500;
  const elevationMin: number = getElementValueAsNumber('#elevationMin') || 0;
  const tilePixelSize: number = getElementValueAsNumber('#tilePixelSize') || 2;
  const percentageGrass: number = getElementValueAsNumber('#percentageGrass') || 0.3;
  const percentageStone: number = getElementValueAsNumber('#percentageStone') || 0.3;
  const percentageSand: number = getElementValueAsNumber('#percentageSand') || 0.03;
  const percentageShore: number = getElementValueAsNumber('#percentageShore') || 0.08;
  const seed: number = getElementValueAsNumber('#seed');
  const options: mapOptions = { width, height, smoothLevel, elevationMax, elevationMin, percentageGrass, percentageStone, percentageSand, percentageShore, seed };
  const map = new Map(options);
  (document.getElementById('json-input') as HTMLElement).innerHTML = `${JSON.stringify(options, null, 2)}`;
  (document.getElementById('json-output') as HTMLElement).innerHTML = `${JSON.stringify({ metadata: map.metadata, seed: map.seed, tilemap: "Check browser's console!" }, null, 2)}`

  console.log('--------------------------------');
  console.log('Map input object', options);
  console.log('Map output object\n', map);

  ctx.canvas.width = width * tilePixelSize;
  ctx.canvas.height = height * tilePixelSize;

  for (let y = 0; y < map.tilemap.length; y++) {
    for (let x = 0; x < map.tilemap[0].length; x++) {
      ctx.fillStyle = tileColor[map.tilemap[y][x] as mapTileType];
      ctx.fillRect(x * tilePixelSize, y * tilePixelSize, tilePixelSize, tilePixelSize)
    }
  }
}
