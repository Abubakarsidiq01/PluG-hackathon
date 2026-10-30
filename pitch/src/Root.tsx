import React from 'react';
import {AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timeline from '../timeline.json';
import {BAR, c} from './lib';
import {sceneMap} from './scenes';

const {fps, scenes, wipesBefore} = timeline;
const frames = (s: number) => Math.round(s * fps);
let cursor = 0;
const placed = scenes.map((s) => {
  const from = cursor;
  cursor += frames(s.bars * BAR);
  return {...s, from, dur: frames(s.bars * BAR)};
});
const total = cursor;
const WIPE = 0.62;

const Wipes: React.FC = () => {
  const f = useCurrentFrame();
  const hit = placed.find((s) => wipesBefore.includes(s.id) && Math.abs(f - s.from) < frames(WIPE / 2));
  if (!hit) return null;
  const x = interpolate(f, [hit.from - frames(WIPE / 2), hit.from + frames(WIPE / 2)], [-125, 125]);
  return <AbsoluteFill style={{background: c.blue, width: '130%', left: '-15%', transform: `translateX(${x * 1.3}%) skewX(-8deg)`}} />;
};

const Film: React.FC = () => (
  <AbsoluteFill style={{background: c.paper}}>
    {placed.map((s) => {
      const Scene = sceneMap[s.id];
      return <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}><Scene /></Sequence>;
    })}
    <Wipes />
    <Audio src={staticFile('score.wav')} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <Composition id="PlugPitch" component={Film} durationInFrames={total} fps={fps} width={1920} height={1080} />
);
