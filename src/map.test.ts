import { describe, expect, it, vitest } from 'vitest'
import { Map } from './map'

describe('Map generation tests', () => {
  it('Should accept just width and height', () => {
    expect(new Map({ width: 10, height: 10 })).toBeDefined()
  })

  it('Should return random map if no seed specified', () => {
    const map = new Map({ width: 10, height: 10 })
    // If both maps are created at exact same timestamp they would be equal!
    vitest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01'));
    expect(
      map
    ).not.toMatchObject(
      new Map({ width: 10, height: 10 })
    );
  })

  it('Should return same map for same seed', () => {
    expect(
      new Map({ width: 10, height: 10, seed: 123 })
    ).toMatchObject(
      new Map({ width: 10, height: 10, seed: 123 })
    );
  })

  it('Should return map with the requested dimensions', () => {
    const map = new Map({ width: 100, height: 100 })
    expect(map.tilemap.length).toEqual(100)
    expect(map.tilemap[0].length).toEqual(100)
  })

  it('Should generate known map scenario', () => {
    expect(
      new Map({ width: 100, height: 100, seed: 456 }).metadata
    ).toMatchObject({
      "elevationMin": 465.55372231640536,
      "elevationMax": 539.1652840841607,
      "elevationDelta": 73.61156176775535,
      "tilesCount": { "stone": 1242, "grass": 5956, "sand": 513, "shore": 1042, "ocean": 976, "tree": 271 }
    })
  })

  it('Should respect elevation constraints', () => {
    const map = new Map({ width: 10, height: 10, elevationMax: 10, elevationMin: 0 })
    expect(map.metadata.elevationMin).toBeGreaterThanOrEqual(0)
    expect(map.metadata.elevationMax).toBeLessThanOrEqual(10)
  })

  it('Should have the correct elevation delta calculation', () => {
    const map = new Map({ width: 10, height: 10, elevationMax: 10, elevationMin: 0 })
    expect(map.metadata.elevationDelta).toEqual(map.metadata.elevationMax - map.metadata.elevationMin)
  })

  it('Should generate mostly ocean map', () => {
    const map = new Map({ width: 100, height: 100, elevationMax: 5, elevationMin: 0, percentageStone: 0 })
    expect(map.metadata.tilesCount.ocean).toBeGreaterThan(map.metadata.tilesCount.grass)
    expect(map.metadata.tilesCount.ocean).toBeGreaterThan(map.metadata.tilesCount.sand)
    expect(map.metadata.tilesCount.ocean).toBeGreaterThan(map.metadata.tilesCount.shore)
    expect(map.metadata.tilesCount.ocean).toBeGreaterThan(map.metadata.tilesCount.tree)
  })

  it('Should generate ocean map', () => {
    const map = new Map({ width: 100, height: 100, percentageStone: -1 })
    expect(map.metadata.tilesCount.ocean).toBeGreaterThan(1000)
  })
})
