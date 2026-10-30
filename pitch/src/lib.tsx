import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import timeline from '../timeline.json';

loadFont({family: 'Public Sans', url: staticFile('public-sans.woff2'), weight: '100 900'});

export const BAR = (60 / timeline.bpm) * 4;
export const c = {
  paper: '#F1F3F0', card: '#FFFFFF', sunk: '#E8EBE6', ink: '#161A17', ink6: '#4D544E', ink4: '#7C8480',
  rule2: '#DCE0DA', rule3: '#C7CDC4', blue: '#0B57E3',
  confirmed: ['#1A6B3C', '#E3EFE6', '#B5D4BF'], recent: ['#0E6E78', '#DFEDEF', '#AFD0D4'],
  estimated: ['#8A5A14', '#F5EDDC', '#E0CCA2'], unknown: ['#5F6660', '#E9ECE8', '#CBD1C9'],
  alert: ['#B4311C', '#F8E7E3', '#EBC0B7'],
};
export const brand = "'Public Sans', sans-serif";
export const appFont = "-apple-system, 'SF Pro Text', system-ui, sans-serif";

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
const ease = Easing.bezier(0.2, 0, 0, 1);
const back = Easing.bezier(0.34, 1.5, 0.64, 1);
export const prog = (t: number, s: number, d = 0.6) =>
  interpolate(t, [s, s + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const popP = (t: number, s: number, d = 0.45) =>
  interpolate(t, [s, s + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: back});

// A line of type rising out of its own baseline.
export const Line: React.FC<{t: number; at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, at, out, children, style}) => {
  const p = prog(t, at, 0.7);
  const q = out === undefined ? 0 : prog(t, out, 0.4);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 110 - q * 110}%)`, willChange: 'transform'}}>{children}</div>
    </div>
  );
};
export const Title: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size = 112, color = c.ink, children, style}) => (
  <div style={{fontFamily: brand, fontWeight: 800, fontSize: size, lineHeight: 1.03, letterSpacing: '-0.035em', color, ...style}}>{children}</div>
);
export const Sub: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size = 40, color = c.ink6, children, style}) => (
  <div style={{fontFamily: brand, fontWeight: 500, fontSize: size, lineHeight: 1.28, letterSpacing: '-0.012em', color, ...style}}>{children}</div>
);
export const Fade: React.FC<{t: number; at: number; d?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, at, d = 0.6, y = 24, children, style}) => {
  const p = prog(t, at, d);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}>{children}</div>;
};
export const Pop: React.FC<{t: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, at, children, style}) => {
  const p = popP(t, at);
  return <div style={{opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'left center', ...style}}>{children}</div>;
};

export const MARK = 'M14 4H36a24 24 0 0 1 0 48h-8v8c0 12-7 19-19 20V68c5-1 7-4 7-9v-7h-2a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8Zm6 14v20h16a10 10 0 0 0 0-20H20Z';
export const Mark: React.FC<{h: number; color: string}> = ({h, color}) => (
  <svg width={(h * 64) / 80} height={h} viewBox="0 0 64 80" style={{display: 'block'}}><path fill={color} fillRule="evenodd" d={MARK} /></svg>
);
// The app's logotype: the designed P stands in for the letter, then LUG.
export const Logotype: React.FC<{h: number; color: string; lug?: number}> = ({h, color, lug = 1}) => {
  const fs = h * 0.83;
  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'flex-start', height: h}}>
      <Mark h={h} color={color} />
      <div style={{overflow: 'hidden', width: `${lug * fs * 2.1}px`, height: h * 0.72}}>
        <div style={{fontFamily: brand, fontWeight: 800, fontSize: fs, lineHeight: 1, letterSpacing: '-0.02em', color, marginTop: h * -0.075, marginLeft: h * 0.01, whiteSpace: 'nowrap'}}>LUG</div>
      </div>
    </div>
  );
};

export const Badge: React.FC<{kind: 'confirmed' | 'recent' | 'estimated' | 'unknown'; size?: number; children: React.ReactNode}> = ({kind, size = 15, children}) => {
  const [fg, bg, bd] = c[kind];
  return <span style={{display: 'inline-block', fontFamily: 'inherit', fontWeight: 700, fontSize: size, lineHeight: 1, color: fg, background: bg, border: `1.5px solid ${bd}`, borderRadius: size * 0.55, padding: `${size * 0.42}px ${size * 0.72}px`, whiteSpace: 'nowrap'}}>{children}</span>;
};
export const Dashed: React.FC<{size?: number; color?: string; children: React.ReactNode}> = ({size = 15, color = c.ink6, children}) => (
  <span style={{display: 'inline-block', fontWeight: 700, fontSize: size, lineHeight: 1, color, border: `1.5px dashed ${color}`, borderRadius: size * 0.55, padding: `${size * 0.42}px ${size * 0.72}px`, whiteSpace: 'nowrap'}}>{children}</span>
);

// Every scene that shows a flow not yet shipped carries this, in the product's own dashed language.
export const Designed: React.FC<{t: number}> = ({t}) => (
  <Fade t={t} at={0.3} y={0} style={{position: 'absolute', left: 120, bottom: 56, fontFamily: brand}}>
    <span style={{background: c.paper, display: 'inline-block', borderRadius: 11}}>
      <Dashed size={20}>Designed flow with sample data</Dashed>
    </span>
  </Fade>
);
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
