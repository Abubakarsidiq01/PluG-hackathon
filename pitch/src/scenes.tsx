import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import timeline from '../timeline.json';
import {Badge, BAR, brand, c, Dashed, Designed, Fade, Line, Logotype, MARK, Pop, popP, prog, Sub, Title, typed, useT} from './lib';
import {AskHome, Counters, InboxScreen, OffersScreen, Phone, PlaceScreen, SkillScreen, UnknownScreen} from './phone';

const L = 120;
const Paper: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: c.paper, fontFamily: brand}}>{children}</AbsoluteFill>;
const Blue: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: c.blue, fontFamily: brand}}>{children}</AbsoluteFill>;
const drift = (t: number, dur: number) => 1 + 0.018 * (t / dur);

export const Hook: React.FC = () => {
  const t = useT();
  const maybes: [string, number, number][] = [
    ['Call for availability', 90, 110], ['Hours may differ', 690, 70], ['Prices vary', 1270, 130], ['Last updated 3 years ago', 1190, 270],
    ['Went to voicemail', 170, 280], ['4.8 stars, 312 reviews', 650, 225],
    ['Might be open', 110, 770], ['Message us for a quote', 500, 880], ['No reply in 2 days', 1300, 760], ['Usually busy around now?', 1120, 915],
  ];
  const gone = prog(t, 7.2, 0.9);
  return (
    <Paper>
      {maybes.map(([s, x, y], i) => {
        const at = (timeline.pops.hook as number[])[i];
        const p = popP(t, at);
        const fall = gone * (240 + i * 90);
        return (
          <div key={s} style={{position: 'absolute', left: x, top: y + Math.sin(t * 0.8 + i) * 7 + fall, opacity: Math.min(1, p * 2) * (1 - gone), transform: `scale(${0.8 + 0.2 * p}) rotate(${(i % 2 ? 1 : -1) * (1 + (i % 3)) * (1 + gone * 5)}deg)`, border: `2.5px dashed ${c.ink4}`, borderRadius: 18, padding: '20px 30px', fontSize: 38, fontWeight: 500, color: c.ink6, whiteSpace: 'nowrap'}}>{s}</div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center'}}>
        <Line t={t} at={3.9} out={6.0}><Title size={100}>Every local search ends the same way.</Title></Line>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 416, textAlign: 'center'}}>
        <Line t={t} at={6.3}><Title size={176}>You still don't know.</Title></Line>
      </div>
    </Paper>
  );
};

export const LogoScene: React.FC = () => {
  const t = useT();
  const m = popP(t, 0.25, 0.7);
  const lug = prog(t, 0.75, 0.7);
  return (
    <Blue>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center', transform: `scale(${drift(t, 4.8)})`}}>
        <div style={{transform: `scale(${0.55 + 0.45 * m})`, opacity: Math.min(1, m * 2)}}><Logotype h={250} color="#fff" lug={lug} /></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center'}}>
        <Line t={t} at={1.5}><Title size={84} color="#fff">Ask for what you need.</Title></Line>
        <Line t={t} at={2.1}><Title size={84} color="#fff">Get real, verified answers back.</Title></Line>
      </div>
    </Blue>
  );
};

const Field: React.FC<{k: string; v: string}> = ({k, v}) => (
  <div style={{background: c.card, borderRadius: 16, padding: '18px 24px', minWidth: 340}}>
    <div style={{fontSize: 24, color: c.ink6, fontWeight: 500}}>{k}</div><div style={{fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2}}>{v}</div>
  </div>
);
export const AskScene: React.FC = () => {
  const t = useT();
  const [a, b] = timeline.typing.ask;
  const s = 'Someone to do knotless braids, $120 max, Saturday morning';
  const fields: [string, string][] = [['You want', 'Braids'], ['Budget', '$120 max'], ['When', 'Saturday morning'], ['Kind of ask', 'A service']];
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 170}}>
        <Line t={t} at={0.2}><Title>One field.</Title></Line>
        <Line t={t} at={0.5}><Title>Your own words.</Title></Line>
        <Fade t={t} at={3.6} style={{marginTop: 34}}><Sub>Claude reads it and shows what it understood.</Sub></Fade>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 34}}>
          {fields.map(([k, v], i) => <Pop key={k} t={t} at={(timeline.pops.ask as number[])[i]}><Field k={k} v={v} /></Pop>)}
        </div>
      </div>
      <Phone scale={drift(t, 9.6)}><AskHome text={typed(s, t, a, b)} caret={t > a - 0.2 && t < 3.6} pressed={prog(t, 3.5, 0.15) * (1 - prog(t, 3.8, 0.2))} /></Phone>
      <Designed t={t} />
    </Paper>
  );
};

const NEIGHBOURHOOD = 'M0 120h384M14 120V86h34v34M10 86l21-16 21 16M24 120v-16h12v16M24 92h5m7 0h5M60 120V48h38v72M66 48v-8h26v8M68 58h6v8h-6zm16 0h6v8h-6zM68 78h6v8h-6zm16 0h6v8h-6zM68 98h6v8h-6zm16 0h6v8h-6zM112 120V78h48v42M108 78h56l-7-14h-42l-7 14ZM118 92h13v15h-13zM140 120V92h13v28M171 120V57h33v63M177 57V40h21v17M182 40V30h11v10M180 68h5v8h-5zm12 0h5v8h-5zM180 88h5v8h-5zm12 0h5v8h-5zM180 120v-13h15v13M218 120V94h40v26M214 94l24-21 24 21M228 120v-17h10v17M246 102h5v7h-5zM272 120V66h44v54M276 66V54h36v12M282 78h8v9h-8zm16 0h8v9h-8zM282 98h8v9h-8zm16 0h8v9h-8zM339 120v-18m0-31c-13 0-18 8-15 15-10 7-4 18 6 18h20c10 0 15-11 6-18 2-8-5-15-17-15ZM360 120V96h24M371 103v9m8-9v9';
export const StreetScene: React.FC = () => {
  const t = useT();
  const O = [233, 52];
  const ring = prog(t, 1.0, 1.0);
  const R = 76;
  const providers = [
    {x: 160, y: 58, match: true, at: 1.5, reply: 4.3},
    {x: 294, y: 47, match: true, at: 1.7, reply: 5.1},
    {x: 240, y: 84, match: true, at: 1.9, reply: -1},
  ];
  const out = [{x: 79, y: 34, label: 'Too far'}, {x: 187, y: 24, label: 'Different skill'}, {x: 366, y: 88, label: 'Too far'}];
  const n = t > 1.9 ? 3 : t > 1.7 ? 2 : t > 1.5 ? 1 : 0;
  const r = t > 5.1 ? 2 : t > 4.3 ? 1 : 0;
  return (
    <Paper>
      <svg viewBox="0 0 384 128" style={{position: 'absolute', left: 0, bottom: 0, width: 1920, height: 640, overflow: 'visible'}}>
        <path d={NEIGHBOURHOOD} fill="none" stroke={c.rule3} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, 0, 1.6)} />
        <circle cx={O[0]} cy={O[1]} r={R * ring} fill={c.blue} fillOpacity={0.05} stroke={c.blue} strokeWidth="0.5" strokeDasharray="2.5 2" />
        {[0, 1].map((i) => {
          const w = ((t - 1.0 + i * 0.6) % 1.2) / 1.2;
          return t > 1.0 && t < 2.6 ? <circle key={i} cx={O[0]} cy={O[1]} r={w * R} fill="none" stroke={c.blue} strokeWidth="0.6" opacity={1 - w} /> : null;
        })}
        {providers.map((p) => {
          const mx = (O[0] + p.x) / 2;
          const my = Math.min(O[1], p.y) - 16;
          const d = `M${O[0]} ${O[1]}Q${mx} ${my} ${p.x} ${p.y}`;
          const go = prog(t, p.at - 0.35, 0.35);
          const back = p.reply > 0 ? prog(t, p.reply - 0.5, 0.5) : 0;
          const lit = popP(t, p.at, 0.4);
          const replied = p.reply > 0 && t > p.reply;
          return (
            <g key={p.x}>
              <path d={d} fill="none" stroke={c.blue} strokeWidth="0.7" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - go} opacity={0.5} />
              {back > 0 && back < 1 && <path d={d} fill="none" stroke={c.ink} strokeWidth="1" pathLength={1} strokeDasharray="0.14 1" strokeDashoffset={-(1 - back) * 0.9} />}
              <circle cx={p.x} cy={p.y} r={3.6 * lit} fill={replied ? c.ink : c.blue} />
              {replied && <circle cx={p.x} cy={p.y} r={3.6 + 9 * prog(t, p.reply, 0.6)} fill="none" stroke={c.ink} strokeWidth="0.5" opacity={1 - prog(t, p.reply, 0.6)} />}
            </g>
          );
        })}
        {out.map((o) => {
          const f = prog(t, 2.2, 0.5);
          return (
            <g key={o.x} opacity={f}>
              <circle cx={o.x} cy={o.y} r={3} fill={c.paper} stroke={c.ink4} strokeWidth="0.8" />
              <text x={o.x} y={o.y - 6} textAnchor="middle" fontSize="5.200" fontWeight="600" fill={c.ink6} fontFamily={brand}>{o.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${O[0] - 16} ${O[1] - 16 - 8 * (1 - popP(t, 0.5))}) scale(${0.4})`} opacity={prog(t, 0.5, 0.3)}>
          <path fill={c.blue} fillRule="evenodd" d={MARK} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: L, top: 80}}>
        <Line t={t} at={0.15}><Title size={96}>Only people who can</Title></Line>
        <Line t={t} at={0.4}><Title size={96}>actually do it.</Title></Line>
        <Fade t={t} at={1.0} style={{marginTop: 22}}><Sub>Right skill. Inside their own travel radius. Opted in.</Sub></Fade>
      </div>
      <Fade t={t} at={1.3} style={{position: 'absolute', right: 110, top: 86, width: 500}}>
        <div style={{background: c.card, borderRadius: 24, padding: 22}}>
          <Counters n={n} r={r} o={r} fs={46} />
          <div style={{height: 8, borderRadius: 4, background: c.sunk, marginTop: 18}}><div style={{height: '100%', borderRadius: 4, width: `${(r / 3) * 100}%`, background: c.ink}} /></div>
          <div style={{fontSize: 22, color: c.ink6, marginTop: 12, fontWeight: 500}}>The bar moves on replies, never on a timer.</div>
        </div>
      </Fade>
    </Paper>
  );
};

export const OffersScene: React.FC = () => {
  const t = useT();
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 210}}>
        <Line t={t} at={0.15}><Title size={150}>Real offers.</Title></Line>
        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', gap: 12}}>
          {['A price they sent.', 'A time they can do.', 'A score they earned.'].map((s, i) => <Line key={s} t={t} at={1.5 + i * 0.5}><Title size={68} style={{fontWeight: 700}}>{s}</Title></Line>)}
        </div>
        <Fade t={t} at={4.2} style={{marginTop: 44}}><Sub>Nothing is booked until you choose.</Sub></Fade>
      </div>
      <Phone scale={drift(t, 7.2)}><OffersScreen t={t} /></Phone>
      <Designed t={t} />
    </Paper>
  );
};

export const PlaceScene: React.FC = () => {
  const t = useT();
  const [a, b] = timeline.typing.place;
  const s = 'How long is the line at the post office on Ben White?';
  const sw = prog(t, 2.8, 0.3);
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 230, width: 1100}}>
        <Line t={t} at={0.15}><Title size={100}>Or ask what's</Title></Line>
        <Line t={t} at={0.4}><Title size={100}>happening right now.</Title></Line>
        <Fade t={t} at={2.9} style={{marginTop: 36}}><Sub>Same field. People nearby go and look.</Sub></Fade>
        <Fade t={t} at={5.4} style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 24}}>
          <Title size={66} style={{fontWeight: 700}}>12–15 min, not 13.</Title>
        </Fade>
        <Fade t={t} at={6.1} style={{marginTop: 14}}><Sub>They gave a range, so PLUG shows a range. And it says when the answer expires.</Sub></Fade>
      </div>
      <Phone scale={drift(t, 9.6)}>
        <AskHome text={typed(s, t, a, b)} caret={t > a - 0.2 && t < 2.6} pressed={prog(t, 2.5, 0.15)} />
        <div style={{position: 'absolute', inset: 0, opacity: sw, transform: `translateX(${(1 - sw) * 60}px)`}}><PlaceScreen t={t} /></div>
      </Phone>
      <Designed t={t} />
    </Paper>
  );
};

export const UnknownScene: React.FC = () => {
  const t = useT();
  const kinds: ['confirmed' | 'recent' | 'estimated' | 'unknown', string][] = [['confirmed', 'Confirmed'], ['recent', 'Recent'], ['estimated', 'Estimated'], ['unknown', 'Unknown']];
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 170, width: 1100}}>
        <Line t={t} at={0.15}><Title size={92}>And when nobody knows?</Title></Line>
        <Line t={t} at={1.2}><Title size={92} style={{marginTop: 8}}>PLUG says so.</Title></Line>
        <Fade t={t} at={3.8} style={{marginTop: 56, display: 'flex', gap: 14}}>
          {kinds.map(([k, s]) => <Badge key={k} kind={k} size={32}>{s}</Badge>)}
        </Fade>
        <Fade t={t} at={4.2} style={{marginTop: 16}}><Sub size={44} color={c.ink}>Filled means a person checked.</Sub></Fade>
        <Fade t={t} at={5.4} style={{marginTop: 42}}><Dashed size={32}>Not verified</Dashed></Fade>
        <Fade t={t} at={5.6} style={{marginTop: 16}}><Sub size={44} color={c.ink}>Dashed means nobody did. It never gets promoted.</Sub></Fade>
      </div>
      <Phone scale={drift(t, 9.6)}><UnknownScreen t={t} webAt={2.2} /></Phone>
      <Designed t={t} />
    </Paper>
  );
};

export const ProviderScene: React.FC = () => {
  const t = useT();
  const [a, b] = timeline.typing.provider;
  const s = 'I do knotless braids, wig installs and crochet locs';
  const sw = prog(t, 5.0, 0.35);
  const lines = ['No business sign-up.', 'No second login.', 'Add a skill and an Inbox appears.'];
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 200}}>
        <Line t={t} at={0.15}><Title size={100}>Customer on Tuesday.</Title></Line>
        <Line t={t} at={0.6}><Title size={100}>Provider on Saturday.</Title></Line>
        <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', gap: 10}}>
          {lines.map((l, i) => <Fade key={l} t={t} at={2.7 + i * 0.5}><Sub size={46} color={c.ink}>{l}</Sub></Fade>)}
        </div>
        <Fade t={t} at={6.6} style={{marginTop: 44}}><Sub>Declining is free. Only silence costs you.</Sub></Fade>
      </div>
      <Phone scale={drift(t, 9.6)}>
        <SkillScreen text={typed(s, t, a, b)} caret={t > a - 0.2 && t < 2.6} t={t} />
        <div style={{position: 'absolute', inset: 0, opacity: sw, transform: `translateX(${(1 - sw) * 60}px)`}}><InboxScreen t={t} at={6.0} /></div>
      </Phone>
      <Designed t={t} />
    </Paper>
  );
};

export const ReputationScene: React.FC = () => {
  const t = useT();
  const rows: [string, number][] = [['Customer rating', 40], ['Completion', 25], ['Reliability', 15], ['Responsiveness', 10], ['Standing', 10]];
  const score = Math.round(interpolate(prog(t, 1.2, 2.2), [0, 1], [0, 94]));
  const notes = ['New, never a zero.', 'Verified takes 92 or above, held for 60 days.', 'Placement is never for sale.'];
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 96}}>
        <Line t={t} at={0.15}><Title size={92}>A score built only from finished work.</Title></Line>
      </div>
      <div style={{position: 'absolute', left: L, top: 240, fontWeight: 800, fontSize: 400, lineHeight: 1, letterSpacing: '-0.05em', color: c.blue, fontVariantNumeric: 'tabular-nums', opacity: prog(t, 1.0, 0.3)}}>{score}</div>
      <div style={{position: 'absolute', left: 860, right: 120, top: 250, display: 'flex', flexDirection: 'column', gap: 22}}>
        <Fade t={t} at={1.0}><Sub size={32}>What goes into it, out of 100</Sub></Fade>
        {rows.map(([n, w], i) => {
          const p = prog(t, 1.2 + i * 0.35, 0.8);
          return (
            <div key={n} style={{opacity: Math.min(1, p * 2)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 600, marginBottom: 7}}><span>{n}</span><span style={{color: c.ink6, fontVariantNumeric: 'tabular-nums'}}>{w}</span></div>
              <div style={{height: 14, borderRadius: 7, background: c.sunk}}><div style={{height: '100%', borderRadius: 7, width: `${(w / 40) * 100 * p}%`, background: c.ink}} /></div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: L, right: 100, bottom: 126, display: 'flex', gap: 56}}>
        {notes.map((n, i) => <Fade key={n} t={t} at={5.0 + i * 0.8} style={{flex: i === 1 ? 1.25 : 1}}><Sub size={38} color={c.ink} style={{fontWeight: 700}}>{n}</Sub></Fade>)}
      </div>
      <Designed t={t} />
    </Paper>
  );
};

export const ClaudeScene: React.FC = () => {
  const t = useT();
  const does = ['Works out what you are asking', 'Pulls out skill, budget and time', 'Summarises what people said'];
  const never = ['Invents a price', 'Sets a score', 'Decides a truth label', 'Books anything'];
  const bad = prog(t, 1.0, 0.4);
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 76}}>
        <Line t={t} at={0.1}><Title>Claude reads. People answer.</Title></Line>
      </div>
      <div style={{position: 'absolute', left: L, top: 240, width: 800}}>
        <Fade t={t} at={0.6}><Title size={52} style={{fontWeight: 700}}>Claude does</Title></Fade>
        <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
          {does.map((s, i) => <Fade key={s} t={t} at={0.9 + i * 0.3}><Sub size={42} color={c.ink}>{s}</Sub></Fade>)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 980, top: 240}}>
        <Fade t={t} at={3.8}><Title size={52} style={{fontWeight: 700}}>Claude never</Title></Fade>
        <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
          {never.map((s, i) => {
            const at = (timeline.pops.claude as number[])[i];
            return (
              <Fade key={s} t={t} at={at - 0.1} style={{position: 'relative', alignSelf: 'flex-start'}}>
                <Sub size={42} color={c.ink6}>{s}</Sub>
                <div style={{position: 'absolute', left: -6, right: -6, top: '54%', height: 3, background: c.ink, transformOrigin: 'left', transform: `scaleX(${prog(t, at + 0.15, 0.3)})`}} />
              </Fade>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: L, bottom: 110, opacity: bad, transform: `translateY(${(1 - bad) * 20}px)`, background: c.alert[1], border: `2px solid ${c.alert[2]}`, borderRadius: 20, padding: '26px 36px', right: 120, boxSizing: 'border-box'}}>
        <div style={{fontSize: 34, fontWeight: 600, color: c.alert[0], lineHeight: 1.2}}>PLUG cannot help with this request. Nobody was contacted.</div>
        <div style={{fontSize: 26, color: c.ink6, marginTop: 10, fontWeight: 500}}>If an ask can't be cleared as safe, it is refused, not routed.</div>
      </div>
    </Paper>
  );
};

const Cap: React.FC<{src: string; w: number}> = ({src, w}) => {
  const ratio = src === 'cap-console.png' ? 900 / 1280 : 2778 / 1284;
  return (
  <div style={{width: w, height: w * ratio, borderRadius: 30, overflow: 'hidden', background: c.card, border: `8px solid ${c.ink}`, boxSizing: 'border-box', flex: 'none'}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
  </div>
  );
};
export const BuiltScene: React.FC = () => {
  const t = useT();
  const facts: [string, string][] = [
    ['3 of 8', 'gates signed by both engineers, each after a connected demo'],
    ['40 of 40', 'labelled test asks read correctly by Claude and rules, 1.0 s on average'],
    ['115', 'skills in the vocabulary, plus any lawful skill in your own words'],
  ];
  const stack = ['SwiftUI', 'Spring Boot', 'PostgreSQL + PostGIS', 'Next.js', 'Claude'];
  const col = (srcs: string[], speed: number, phase: number, x: number) => (
    <div style={{position: 'absolute', left: x, top: phase - t * speed, display: 'flex', flexDirection: 'column', gap: 22}}>
      {[...srcs, ...srcs].map((s, i) => <Cap key={i} src={s} w={290} />)}
    </div>
  );
  return (
    <Paper>
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 960, overflow: 'hidden', background: c.sunk}}>
        <div style={{opacity: prog(t, 0.1, 0.5)}}>
          {col(['cap-ask.png', 'cap-web.png'], 70, 40, 16)}
          {col(['cap-skills.png', 'cap-console.png', 'cap-offer.png'], -50, -1000, 330)}
          {col(['cap-inbox.png', 'cap-activity.png'], 60, -120, 644)}
        </div>
        <div style={{position: 'absolute', left: 24, bottom: 28, opacity: prog(t, 1, 0.4)}}><Badge kind="confirmed" size={26}>Real captures from the build</Badge></div>
      </div>
      <div style={{position: 'absolute', left: 100, top: 96, width: 800}}>
        <Line t={t} at={0.1}><Title size={92}>It already runs</Title></Line>
        <Line t={t} at={0.35}><Title size={92}>on a real iPhone.</Title></Line>
        <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', gap: 30}}>
          {facts.map(([k, v], i) => (
            <Pop key={k} t={t} at={(timeline.pops.built as number[])[i]}>
              <div style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: c.blue}}>{k}</div>
              <Sub size={32} style={{marginTop: 6}}>{v}</Sub>
            </Pop>
          ))}
        </div>
        <Fade t={t} at={6.5} style={{marginTop: 42, display: 'flex', flexWrap: 'wrap', gap: 10}}>
          {stack.map((s) => <span key={s} style={{fontSize: 26, fontWeight: 600, background: c.card, borderRadius: 10, padding: '9px 15px'}}>{s}</span>)}
        </Fade>
      </div>
    </Paper>
  );
};

export const RoadmapScene: React.FC = () => {
  const t = useT();
  const phases = ['Foundations', 'Identity and consent', 'Two ask types and matching', 'Provider inbox, offers, SMS', 'Place answers, web fallback', 'Reviews, verification, admin', 'Beta hardening', 'One-zone beta launch'];
  const W = 1680 / 8;
  const fund = prog(t, 4.0, 0.7);
  return (
    <Paper>
      <div style={{position: 'absolute', left: L, top: 96}}>
        <Line t={t} at={0.1}><Title size={124}>Three gates signed.</Title></Line>
        <Line t={t} at={2.6}><Title size={124}>Five to go.</Title></Line>
      </div>
      <svg width="1920" height="200" style={{position: 'absolute', left: 0, top: 456}}>
        <line x1={L + W / 2} x2={L + W * 2.5} y1="100" y2="100" stroke={c.ink} strokeWidth="6" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, 0.4, 1)} />
        <line x1={L + W * 2.5} x2={L + W * 7.5} y1="100" y2="100" stroke={fund > 0.5 ? c.blue : c.ink4} strokeWidth="4" strokeDasharray="14 12" opacity={prog(t, 1.4, 0.6)} />
      </svg>
      {phases.map((p, i) => {
        const at = (timeline.pops.roadmap as number[])[i];
        const a = popP(t, at);
        const done = i < 3;
        const col = !done && fund > 0.5 ? c.blue : c.ink4;
        return (
          <div key={p} style={{position: 'absolute', left: L + W * i, top: 516, width: W - 12, textAlign: 'left', opacity: Math.min(1, a * 2)}}>
            <div style={{width: 80, height: 80, marginLeft: W / 2 - 46, borderRadius: 40, boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 800, background: done ? c.ink : c.paper, color: done ? '#fff' : col, border: done ? 'none' : `3px dashed ${col}`, transform: `scale(${a})`}}>P{i}</div>
            <div style={{fontSize: 27, fontWeight: 600, lineHeight: 1.2, marginTop: 20, textAlign: 'center', color: done ? c.ink : c.ink6, padding: '0 8px'}}>{p}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: L + W * 3, width: W * 5 - 12, top: 750, opacity: fund}}>
        <div style={{height: 26, borderLeft: `4px solid ${c.blue}`, borderRight: `4px solid ${c.blue}`, borderBottom: `4px solid ${c.blue}`, borderRadius: '0 0 10px 10px', transform: `scaleX(${fund})`}} />
        <div style={{textAlign: 'center', marginTop: 24}}><Title size={68} color={c.blue}>This is what your funding builds.</Title></div>
      </div>
    </Paper>
  );
};

export const EndScene: React.FC = () => {
  const t = useT();
  return (
    <Blue>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', transform: `scale(${drift(t, 7.2)})`}}>
        <Logotype h={210} color="#fff" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center'}}>
        <Line t={t} at={0.5}><Title size={84} color="#fff">Real-time truth.</Title></Line>
        <Line t={t} at={0.95}><Title size={84} color="#fff">Better local decisions.</Title></Line>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `scale(${popP(t, 1.9)})`, opacity: prog(t, 1.9, 0.2), background: '#fff', color: c.blue, fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', padding: '26px 54px', borderRadius: 22}}>Fund the first city zone</div>
      </div>
      <Fade t={t} at={3.2} y={0} style={{position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center'}}>
        <Sub size={24} color="#DCE6FB">Flows marked as designed use sample data. Build status as of October 2026.</Sub>
      </Fade>
    </Blue>
  );
};
export const sceneMap: Record<string, React.FC> = {hook: Hook, logo: LogoScene, ask: AskScene, street: StreetScene, offers: OffersScene, place: PlaceScene, unknown: UnknownScene, provider: ProviderScene, reputation: ReputationScene, claude: ClaudeScene, built: BuiltScene, roadmap: RoadmapScene, end: EndScene};
export const barSeconds = BAR;
