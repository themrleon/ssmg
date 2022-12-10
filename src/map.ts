// Extracted and modified from https://github.com/goddtriffin/Oasis
/*
BSD 3-Clause License

Copyright (c) 2018, Todd Griffin
Copyright (c) 2022, Leonardo Ciocari
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import { MersenneTwister } from "./rng";

export enum mapTileType {
  Grass,
  Sand,
  Shore,
  Ocean,
  Stone,
  Tree
}

export interface mapOptions {
  width: number;
  height: number;
  smoothLevel?: number;
  elevationMin?: number;
  elevationMax?: number;
  percentageStone?: number;
  percentageGrass?: number;
  percentageSand?: number;
  percentageShore?: number;
  seed?: number;
}

export interface mapMetadata {
  elevationMin: number;
  elevationMax: number;
  elevationDelta: number;
  tilesCount: {
    stone: number;
    grass: number;
    sand: number;
    shore: number;
    ocean: number;
    tree: number;
  }
}

export class Map {
  tilemap: number[][];
  metadata: mapMetadata;
  seed: number;

  /**
   * Generates a map based on the following options:
   * @param width Width of the map
   * @param height Height of the map
   * @param smoothLevel How smooth the map will be, low values = smoother, high values = sharper
   * @param elevationMin Minimal elevation of the map, used for the ocean calculation
   * @param elevationMax Maximum elevation of the map, used for the ocean calculation
   * @param percentageGrass Percentage of the grass to be generated, float between 0 and 1
   * @param percentageStone Percentage of the stone to be generated, float between 0 and 1
   * @param percentageSand Percentage of the sand to be generated, float between 0 and 1
   * @param percentageShore Percentage of the shore to be generated, float between 0 and 1
   */
  constructor({
    width = 100,
    height = 100,
    smoothLevel = 25,
    elevationMin = 0,
    elevationMax = 1000,
    percentageStone = 0.30,
    percentageGrass = 0.30,
    percentageSand = 0.03,
    percentageShore = 0.08,
    seed = 0
  }: mapOptions) {
    const mersenneTwister = new MersenneTwister(seed)
    const rng = () => mersenneTwister.random();
    this.seed = mersenneTwister.seed;
    this.tilemap = this.generateHeightMap(width, height, elevationMin, elevationMax, rng);

    for (let i = 0; i < smoothLevel; i++) {
      this.smoothMap(this.tilemap);
    }

    let minHeight = elevationMax;
    let maxHeight = elevationMin;
    for (let y = 0; y < this.tilemap.length; y++) {
      for (let x = 0; x < this.tilemap[y].length; x++) {
        const height = this.tilemap[y][x];
        if (height < minHeight) {
          minHeight = height;
        }
        if (height > maxHeight) {
          maxHeight = height;
        }
      }
    }

    const deltaHeight = maxHeight - minHeight;
    this.metadata = {
      elevationMin: minHeight,
      elevationMax: maxHeight,
      elevationDelta: deltaHeight,
      tilesCount: {
        stone: 0,
        grass: 0,
        sand: 0,
        shore: 0,
        ocean: 0,
        tree: 0,
      }
    }

    for (let y = 0; y < this.tilemap.length; y++) {
      for (let x = 0; x < this.tilemap[y].length; x++) {
        const height = this.tilemap[y][x];
        const stonePercentage = maxHeight - (deltaHeight * percentageStone);
        const grassPercentage = stonePercentage - (deltaHeight * percentageGrass);
        const sandPercentage = grassPercentage - (deltaHeight * percentageSand);
        const shorePercentage = sandPercentage - (deltaHeight * percentageShore);
        const oceanPercentage = minHeight;

        if (height >= stonePercentage) {
          this.tilemap[y][x] = mapTileType.Stone;
          this.metadata.tilesCount.stone++;
        } else if (height >= grassPercentage) {
          if (this.getRandInt(0, 20, rng) === 0) {
            this.tilemap[y][x] = mapTileType.Tree;
            this.metadata.tilesCount.tree++;
          } else {
            this.tilemap[y][x] = mapTileType.Grass;
            this.metadata.tilesCount.grass++;
          }
        } else if (height >= sandPercentage) {
          this.tilemap[y][x] = mapTileType.Sand;
          this.metadata.tilesCount.sand++;
        } else if (height >= shorePercentage) {
          this.tilemap[y][x] = mapTileType.Shore;
          this.metadata.tilesCount.shore++;
        } else if (height >= oceanPercentage) {
          this.tilemap[y][x] = mapTileType.Ocean;
          this.metadata.tilesCount.ocean++;
        }
      }
    }
  }

  /**
   * Generates random height map based on the following options:
   * @param width Width of the map
   * @param height Height of the map
   * @param min Minimum height (inclusive)
   * @param max Maximum height (inclusive)
   * @param rng Random number generator function
   * @returns A random integer number
   */
  private getRandInt(min: number, max: number, rng: any): number {
    max = Math.floor(max);
    return Math.floor(rng() * (max - min + 1)) + Math.ceil(min);
  }

  /**
   * Generates random height map based on the following options:
   * @param width Width of the map
   * @param height Height of the map
   * @param min Minimum height (inclusive)
   * @param max Maximum height (inclusive)
   * @param rng Random number generator function
   * @returns 2D matrix of tile heights
   */
  private generateHeightMap(width: number, height: number, min: number, max: number, rng: any): number[][] {
    let map: number[][] = [];
    let column = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        column.push(this.getRandInt(min, max, rng));
      }
      map.push(column);
      column = []
    }
    return map;
  }

  /** 
   * Smooths a given map by setting all points' values as the average of all surrounding point values (including the one being looked at)
   * @param map Map object
   */
  private smoothMap(map: number[][]): void {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        map[y][x] = this.sumSurroundingValues(map, x, y, true) / 9;
      }
    }
  }

  /**
   * Returns the sum of all the values in the 3x3 grid surrounding the given point in the map
   * @param map Map object
   * @param x x coordinate of the point in the map
   * @param y y coordinate of the point in the map
   * @param worldWrap Wrap points outside the bounds of the map back into it ie: (-1,-1) will become (map.width-1, map.height-1)
   * @returns The sum of the surrounding values
   */
  private sumSurroundingValues(map: number[][], x: number, y: number, worldWrap: boolean): number {
    let sum: number = 0;
    for (let deltaY = -1; deltaY <= 1; deltaY++) {
      for (let deltaX = -1; deltaX <= 1; deltaX++) {
        let sumX = x + deltaX;
        let sumY = y + deltaY;
        if (worldWrap) {
          if (sumY < 0) {
            sumY += map.length;
          }
          if (sumY > map.length - 1) {
            sumY -= map.length;
          }
          if (sumX < 0) {
            sumX += map[sumY].length;
          }
          if (sumX > map[sumY].length - 1) {
            sumX -= map[sumY].length;
          }
        } else if (sumY < 0 || sumY > map.length - 1 || sumX < 0 || sumX > map[sumY].length - 1) {
          continue;
        }
        sum += map[sumY][sumX];
      }
    }
    return sum;
  }
}
