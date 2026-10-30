// Original score and sound design, generated from timeline.json so every hit lands on its cut.
import fs from 'node:fs';
const tl = JSON.parse(fs.readFileSync(new URL('../timeline.json', import.meta.url)));
const SR = 44100, BEAT = 60 / tl.bpm, BAR = BEAT * 4;
let cur = 0; const at = {};
for (const s of tl.scenes) { at[s.id] = cur; cur += s.bars * BAR; }
const TAIL = 0.05, N = Math.ceil((cur + TAIL) * SR);
const mk = () => [new Float32Array(N), new Float32Array(N)];
const dry = mk(), wet = mk();
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function put(buf, i, l, r) { if (i >= 0 && i < N) { buf[0][i] += l; buf[1][i] += r; } }
function note(t, dur, f, {gain = 0.2, atk = 0.005, rel = 0.3, pan = 0, send = 0.2, kind = 'pluck', cutoff = 4000} = {}) {
  const s0 = Math.floor(t * SR), len = Math.floor((dur + rel) * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const x = i / SR;
    const env = Math.min(1, x / atk) * (x < dur ? (kind === 'pluck' ? Math.exp(-x * 5) : 1) : (kind === 'pluck' ? Math.exp(-dur * 5) : 1) * Math.exp(-(x - dur) / (rel / 4)));
    const w = 2 * Math.PI * f * x;
    let v;
    if (kind === 'pad') v = Math.sin(w) + 0.5 * Math.sin(w * 1.003 + 1) + 0.35 * Math.sin(w * 2.001) + 0.14 * Math.sin(w * 3.002);
    else if (kind === 'bass') v = Math.sin(w) + 0.25 * Math.sin(2 * w);
    else if (kind === 'bell') v = (Math.sin(w) + 0.45 * Math.sin(w * 2.76) * Math.exp(-x * 9) + 0.2 * Math.sin(w * 5.4) * Math.exp(-x * 16)) * Math.exp(-x * 2.6);
    else v = Math.sin(w) + 0.4 * Math.sin(2 * w) * Math.exp(-x * 7) + 0.18 * Math.sin(3 * w) * Math.exp(-x * 10);
    const a = 1 - Math.exp(-2 * Math.PI * cutoff / SR); lp += a * (v - lp);
    const o = lp * env;
    put(dry, s0 + i, o * gl, o * gr);
    if (send) put(wet, s0 + i, o * gl * send, o * gr * send);
  }
}
function kick(t, g = 0.8) { const s = Math.floor(t * SR); let ph = 0; for (let i = 0; i < 0.3 * SR; i++) { const x = i / SR; const f = 44 + 120 * Math.exp(-x * 34); ph += 2 * Math.PI * f / SR; const v = Math.sin(ph) * Math.exp(-x * 11) * g; put(dry, s + i, v, v); } }
function noise(t, dur, {gain = 0.1, hp = 0.85, decay = 30, pan = 0, send = 0.1} = {}) { const s = Math.floor(t * SR); let last = 0; for (let i = 0; i < dur * SR; i++) { const x = i / SR; const n = rnd(); const h = n - hp * last; last = n; const v = h * Math.exp(-x * decay) * gain; put(dry, s + i, v * (1 - pan * .5), v * (1 + pan * .5)); put(wet, s + i, v * send, v * send); } }
function whoosh(t, dur = 0.62, g = 0.16) { const s = Math.floor((t - dur / 2) * SR), L = dur * SR; let lp = 0; for (let i = 0; i < L; i++) { const x = i / L; const a = 0.008 + 0.28 * Math.sin(Math.PI * x) ** 2; lp += a * (rnd() - lp); const e = Math.sin(Math.PI * x) ** 2 * g * 2; put(dry, s + i, lp * e * (1 - x), lp * e * x); put(wet, s + i, lp * e * .25, lp * e * .25); } }
function riser(t, dur, g = 0.08) { const s = Math.floor(t * SR), L = dur * SR; let lp = 0; for (let i = 0; i < L; i++) { const x = i / L; const a = 0.004 + 0.2 * x * x; lp += a * (rnd() - lp); const v = lp * x * x * g * 3; put(dry, s + i, v, v); put(wet, s + i, v * .5, v * .5); } }

// Am9, Fmaj7, C, G6: warm and forward.
const prog = [[45, [57, 60, 64, 67, 71]], [41, [57, 60, 64, 65, 69]], [48, [55, 60, 64, 67, 71]], [43, [55, 59, 62, 64, 67]]];
const arpNotes = [[69, 72, 76, 79], [69, 72, 76, 81], [67, 72, 76, 79], [67, 71, 74, 79]];
// Energy per scene: [pad, kick, hats, bass, arp]. The unknown scene drops out on purpose.
const energy = {hook: [.5, 0, .5, 0, 0], logo: [1, 0, 0, 1, .4], ask: [1, .6, .6, 1, 1], street: [1, 1, 1, 1, 1], offers: [1, 1, 1, 1, 1], place: [1, .6, .8, 1, 1], unknown: [1, 0, .4, 0, .3], provider: [1, 1, 1, 1, 1], reputation: [1, 1, 1, 1, 1], claude: [1, .6, 1, 1, .5], built: [1, 1, 1, 1, 1], roadmap: [1, 1, 1, 1, 1], end: [1, 0, 0, 1, .5]};

let bar = 0;
for (const sc of tl.scenes) {
  const [pad, kk, hat, bass, arp] = energy[sc.id];
  for (let b = 0; b < sc.bars; b++, bar++) {
    const t = at[sc.id] + b * BAR, [root, chord] = prog[bar % 4], ar = arpNotes[bar % 4];
    chord.forEach((m, i) => note(t, BAR, midi(m), {kind: 'pad', gain: 0.03 * pad, atk: 0.35, rel: 1.4, pan: (i - 2) * .3, send: .5, cutoff: sc.id === 'hook' ? 500 + b * 350 : 1600}));
    if (bass) for (const o of [0, 1.5, 2.5, 3.5]) note(t + o * BEAT, BEAT * .7, midi(root), {kind: 'bass', gain: 0.17 * bass, rel: .15, send: 0, cutoff: 500});
    for (let q = 0; q < 4; q++) {
      if (kk) kick(t + q * BEAT, 0.62 * kk);
      if (hat) { noise(t + (q + .5) * BEAT, .08, {gain: .05 * hat, decay: 42, pan: .3}); if (q % 2 && kk) noise(t + q * BEAT, .22, {gain: .1 * kk, hp: .6, decay: 16, send: .25}); }
    }
    if (arp) for (let i = 0; i < 8; i++) { const m = ar[(i * 3 + (i >> 1)) % 4]; note(t + i * BEAT / 2, .25, midi(m), {gain: .07 * arp, pan: i % 2 ? .45 : -.45, send: .4, rel: .35, cutoff: 3200}); }
  }
}
// Sound design tied to the picture.
for (const id of tl.wipesBefore) whoosh(at[id]);
riser(at.logo - 2.4, 2.4); riser(at.end - BAR, BAR, .07);
for (const t of [at.logo, at.end]) { kick(t, 1); [45, 57, 64, 69, 72, 76].forEach((m, i) => note(t, 2.2, midi(m), {kind: 'bell', gain: .1, pan: (i - 2.5) * .22, send: .7, rel: 1.8, cutoff: 6000})); }
for (const [id, [a, b]] of Object.entries(tl.typing)) for (let t = a; t < b; t += 0.055 + 0.03 * Math.abs(rnd())) noise(at[id] + t, .025, {gain: .13, hp: .92, decay: 150, pan: rnd() * .3, send: .03});
for (const [id, ts] of Object.entries(tl.pops)) ts.forEach((t, i) => note(at[id] + t, .05, midi(79 + [0, 3, 7, 10][i % 4]), {gain: .08, rel: .15, send: .35, cutoff: 5000}));
for (const [id, ts] of Object.entries(tl.dings)) ts.forEach((t) => { note(at[id] + t, .5, midi(84), {kind: 'bell', gain: .15, rel: .8, send: .55, cutoff: 8000}); note(at[id] + t + .09, .5, midi(91), {kind: 'bell', gain: .11, rel: .8, send: .55, cutoff: 8000}); });
for (const [id, ts] of Object.entries(tl.denied)) ts.forEach((t) => [60, 58].forEach((m, i) => note(at[id] + t + i * .13, .14, midi(m), {gain: .14, rel: .2, send: .3, cutoff: 1400})));
// The dashed card drawing itself: soft ticks, like a pen.
for (let i = 0; i < 18; i++) noise(at.unknown + 2.2 + i * (1 / 18), .02, {gain: .05, hp: .9, decay: 180, send: .2});
// Reputation count-up.
for (let i = 0; i < 26; i++) noise(at.reputation + 1.2 + 2.2 * (1 - (1 - i / 26) ** 2), .018, {gain: .07, hp: .95, decay: 200, send: .05});

// Reverb: a small stereo comb and allpass network.
function reverb(x, off) {
  const out = new Float32Array(N), combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => d + off);
  for (const d of combs) { const b = new Float32Array(d); let p = 0, lp = 0; for (let i = 0; i < N; i++) { const y = b[p]; lp = y * .55 + lp * .45; b[p] = x[i] + lp * .86; p = (p + 1) % d; out[i] += y / 6; } }
  for (const d of [225, 556].map((v) => v + off)) { const b = new Float32Array(d); let p = 0; for (let i = 0; i < N; i++) { const y = b[p], v = out[i]; b[p] = v + y * .5; out[i] = y - v * .5; p = (p + 1) % d; } }
  return out;
}
const rv = [reverb(wet[0], 0), reverb(wet[1], 23)];
const pcm = Buffer.alloc(N * 4);
let peak = 0, sum = 0;
const OUT = 2.4; // the final bar fades, so the last chord rings out inside the picture
for (let i = 0; i < N; i++) {
  const t = i / SR, fade = Math.min(1, t / .4, (cur - t) / OUT);
  for (let ch = 0; ch < 2; ch++) {
    let v = (dry[ch][i] + rv[ch][i] * .9) * 1.25 * Math.max(0, fade);
    v = Math.tanh(v * 1.05) * .88;
    peak = Math.max(peak, Math.abs(v)); sum += v * v;
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 4 + ch * 2);
  }
}
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVEfmt ', 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22);
hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(new URL('../public/score.wav', import.meta.url), Buffer.concat([hdr, pcm]));
console.log(`score: ${cur.toFixed(1)}s, peak ${peak.toFixed(3)}, rms ${Math.sqrt(sum / (N * 2)).toFixed(3)}`);
