import { MersenneTwister } from './rng';
import { describe, expect, it, vitest } from 'vitest'

describe('RNG tests', () => {
  it('Should always return same results for same seed', () => {
    expect(new MersenneTwister(1234).random()).toEqual(0.19151945016346872);
    expect(new MersenneTwister(1234).random()).toEqual(0.19151945016346872);
  })

  it('Should always return different results for different seeds', () => {
    expect(new MersenneTwister(1234).random()).toEqual(0.19151945016346872);
    expect(new MersenneTwister(12345).random()).not.toEqual(0.19151945016346872);
  })

  it('Should always return the same sequence for same seed', () => {
    const rng1 = new MersenneTwister(1234)
    const rng2 = new MersenneTwister(1234)
    const f1 = rng1.random()
    expect(f1).toEqual(rng2.random());
    expect(f1).not.toEqual(rng2.random());
    rng1.random() // Catch up with rng 2
    expect(rng1.random()).toEqual(rng2.random());
    expect(rng1.random()).toEqual(rng2.random());
  })

  it('Should always return different results when no seed specified', () => {
    const rng1 = new MersenneTwister();
    // If both rngs are created at exact same timestamp they would be equal!
    vitest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01'));
    const rng2 = new MersenneTwister();
    expect(rng1.random()).not.toEqual(rng2.random());
  })
})
