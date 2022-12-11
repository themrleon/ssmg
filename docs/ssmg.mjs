var C = Object.defineProperty;
var O = (i, t, s) => t in i ? C(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var o = (i, t, s) => (O(i, typeof t != "symbol" ? t + "" : t, s), s);
class w {
  constructor(t) {
    o(this, "N");
    o(this, "M");
    o(this, "MATRIX_A");
    o(this, "UPPER_MASK");
    o(this, "LOWER_MASK");
    o(this, "mt");
    o(this, "mti");
    o(this, "seed");
    this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, this.seed = t || new Date().getTime(), this.init_genrand(this.seed);
  }
  init_genrand(t) {
    for (this.mt[0] = t >>> 0, this.mti = 1; this.mti < this.N; this.mti++) {
      const s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti, this.mt[this.mti] >>>= 0;
    }
  }
  random() {
    let t;
    const s = new Array(0, this.MATRIX_A);
    if (this.mti >= this.N) {
      let e;
      for (this.mti == this.N + 1 && this.init_genrand(5489), e = 0; e < this.N - this.M; e++)
        t = this.mt[e] & this.UPPER_MASK | this.mt[e + 1] & this.LOWER_MASK, this.mt[e] = this.mt[e + this.M] ^ t >>> 1 ^ s[t & 1];
      for (; e < this.N - 1; e++)
        t = this.mt[e] & this.UPPER_MASK | this.mt[e + 1] & this.LOWER_MASK, this.mt[e] = this.mt[e + (this.M - this.N)] ^ t >>> 1 ^ s[t & 1];
      t = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ t >>> 1 ^ s[t & 1], this.mti = 0;
    }
    return t = this.mt[this.mti++], t ^= t >>> 11, t ^= t << 7 & 2636928640, t ^= t << 15 & 4022730752, t ^= t >>> 18, (t >>> 0) * (1 / 4294967296);
  }
}
var I = /* @__PURE__ */ ((i) => (i[i.Grass = 0] = "Grass", i[i.Sand = 1] = "Sand", i[i.Shore = 2] = "Shore", i[i.Ocean = 3] = "Ocean", i[i.Stone = 4] = "Stone", i[i.Tree = 5] = "Tree", i))(I || {});
class L {
  constructor({
    width: t = 100,
    height: s = 100,
    smoothLevel: e = 25,
    elevationMin: f = 0,
    elevationMax: d = 1e3,
    percentageStone: g = 0.3,
    percentageGrass: m = 0.3,
    percentageSand: a = 0.03,
    percentageShore: n = 0.08,
    seed: N = void 0
  }) {
    o(this, "tilemap");
    o(this, "metadata");
    o(this, "seed");
    const A = new w(N), S = () => A.random();
    this.seed = A.seed, this.tilemap = this.generateHeightMap(t, s, f, d, S);
    for (let h = 0; h < e; h++)
      this.smoothMap(this.tilemap);
    let c = d, u = f;
    for (let h = 0; h < this.tilemap.length; h++)
      for (let r = 0; r < this.tilemap[h].length; r++) {
        const l = this.tilemap[h][r];
        l < c && (c = l), l > u && (u = l);
      }
    const M = u - c;
    this.metadata = {
      elevationMin: c,
      elevationMax: u,
      elevationDelta: M,
      tilesCount: {
        stone: 0,
        grass: 0,
        sand: 0,
        shore: 0,
        ocean: 0,
        tree: 0
      }
    };
    for (let h = 0; h < this.tilemap.length; h++)
      for (let r = 0; r < this.tilemap[h].length; r++) {
        const l = this.tilemap[h][r], R = u - M * g, _ = R - M * m, P = _ - M * a, E = P - M * n, K = c;
        l >= R ? (this.tilemap[h][r] = 4, this.metadata.tilesCount.stone++) : l >= _ ? this.getRandInt(0, 20, S) === 0 ? (this.tilemap[h][r] = 5, this.metadata.tilesCount.tree++) : (this.tilemap[h][r] = 0, this.metadata.tilesCount.grass++) : l >= P ? (this.tilemap[h][r] = 1, this.metadata.tilesCount.sand++) : l >= E ? (this.tilemap[h][r] = 2, this.metadata.tilesCount.shore++) : l >= K && (this.tilemap[h][r] = 3, this.metadata.tilesCount.ocean++);
      }
  }
  getRandInt(t, s, e) {
    return s = Math.floor(s), Math.floor(e() * (s - t + 1)) + Math.ceil(t);
  }
  generateHeightMap(t, s, e, f, d) {
    let g = [], m = [];
    for (let a = 0; a < s; a++) {
      for (let n = 0; n < t; n++)
        m.push(this.getRandInt(e, f, d));
      g.push(m), m = [];
    }
    return g;
  }
  smoothMap(t) {
    for (let s = 0; s < t.length; s++)
      for (let e = 0; e < t[s].length; e++)
        t[s][e] = this.sumSurroundingValues(t, e, s, !0) / 9;
  }
  sumSurroundingValues(t, s, e, f) {
    let d = 0;
    for (let g = -1; g <= 1; g++)
      for (let m = -1; m <= 1; m++) {
        let a = s + m, n = e + g;
        if (f)
          n < 0 && (n += t.length), n > t.length - 1 && (n -= t.length), a < 0 && (a += t[n].length), a > t[n].length - 1 && (a -= t[n].length);
        else if (n < 0 || n > t.length - 1 || a < 0 || a > t[n].length - 1)
          continue;
        d += t[n][a];
      }
    return d;
  }
}
export {
  L as Map,
  I as mapTileType
};
