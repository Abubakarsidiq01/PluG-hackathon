import React from 'react';
import {Img, staticFile} from 'remotion';
import {appFont, Badge, c, Dashed, Mark, popP, prog} from './lib';

export const Phone: React.FC<{x?: number; y?: number; scale?: number; children: React.ReactNode}> = ({x = 1250, y = 62, scale = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 452, height: 950, transform: `scale(${scale})`, transformOrigin: 'center', background: c.ink, borderRadius: 66, padding: 12, boxSizing: 'border-box'}}>
    <div style={{position: 'relative', width: 428, height: 926, background: c.paper, borderRadius: 54, overflow: 'hidden', fontFamily: appFont, color: c.ink}}>
      {children}
      <div style={{position: 'absolute', top: 11, left: 152, width: 124, height: 36, borderRadius: 18, background: c.ink}} />
      <div style={{position: 'absolute', top: 17, left: 40, fontSize: 18, fontWeight: 600}}>9:41</div>
      <div style={{position: 'absolute', top: 19, right: 32, display: 'flex', gap: 5, alignItems: 'flex-end'}}>
        {[6, 9, 12, 15].map((h) => <div key={h} style={{width: 4, height: h, background: c.ink, borderRadius: 1}} />)}
        <div style={{width: 26, height: 13, marginLeft: 4, border: `1.5px solid ${c.ink}`, borderRadius: 4, padding: 1.5, boxSizing: 'border-box'}}><div style={{width: '80%', height: '100%', background: c.ink, borderRadius: 1.5}} /></div>
      </div>
    </div>
  </div>
);

const Ico: React.FC<{d: string; size?: number; fill?: boolean}> = ({d, size = 26, fill}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? c.ink : 'none'} stroke={c.ink} strokeWidth={fill ? 0 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
export const icons = {
  ask: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  inbox: 'M3 5h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 4v-4H3a0 0 0 0 1 0 0V5ZM18 9h3v9h-2v3l-3-3h-6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5H8',
  person: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 18c1.5-2.5 3.5-3 6-3s4.500.5 6 3',
  back: 'M15 5l-7 7 7 7',
  refresh: 'M20 12a8 8 0 1 1-2.500-5.800M20 3v4h-4',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  send: 'M21 3 3 10l7 3 3 8 8-18ZM10 13l5-5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM16 16l5 5',
  up: 'M12 20V5M6 11l6-6 6 6',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.5-4 3-5 6-5s5.500 1 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2 3 5',
};
export const TabBar: React.FC<{active: string; inbox?: number}> = ({active, inbox = 1}) => {
  const tabs = [['Ask', icons.ask], ...(inbox > 0 ? [['Inbox', icons.inbox]] : []), ['Activity', icons.clock], ['Profile', icons.person]];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: c.card, borderTop: `1px solid ${c.rule2}`, display: 'flex', justifyContent: 'space-around', paddingTop: 10, zIndex: 3}}>
      {tabs.map(([n, d]) => (
        <div key={n} style={{textAlign: 'center', fontSize: 13, fontWeight: n === active ? 700 : 500, color: n === active ? c.ink : c.ink6, transform: n === 'Inbox' ? `scale(${inbox})` : undefined, opacity: n === active ? 1 : 0.9}}>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 2}}><Ico d={d} fill={n === active && n === 'Ask'} /></div>{n}
        </div>
      ))}
    </div>
  );
};
export const NavBar: React.FC<{title: string}> = ({title}) => (
  <div style={{position: 'absolute', top: 58, left: 16, right: 16, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2}}>
    <div style={{width: 44, height: 44, borderRadius: 22, background: '#F9FBF8', display: 'grid', placeItems: 'center'}}><Ico d={icons.back} size={22} /></div>
    <div style={{fontSize: 19, fontWeight: 600}}>{title}</div>
    <div style={{width: 44, height: 44, borderRadius: 22, background: '#F9FBF8', display: 'grid', placeItems: 'center'}}><Ico d={icons.refresh} size={22} /></div>
  </div>
);
export const Screen: React.FC<{o?: number; x?: number; children: React.ReactNode}> = ({o = 1, x = 0, children}) => (
  <div style={{position: 'absolute', inset: 0, opacity: o, transform: `translateX(${x}px)`, background: c.paper}}>{children}</div>
);
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: c.card, borderRadius: 26, padding: 20, ...style}}>{children}</div>
);
const Pill: React.FC<{k: string; v: string}> = ({k, v}) => (
  <div style={{flex: 1, background: c.paper, borderRadius: 16, padding: '11px 14px'}}>
    <div style={{fontSize: 13, color: c.ink6}}>{k}</div><div style={{fontSize: 17, fontWeight: 600, marginTop: 3}}>{v}</div>
  </div>
);
const RequestRow: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', top: 124, left: 16, right: 16, display: 'flex', gap: 14, alignItems: 'center'}}>
    <div style={{width: 42, height: 42, flex: 'none', borderRadius: 12, background: c.sunk, display: 'grid', placeItems: 'center'}}><Ico d={icons.chat} size={22} /></div>
    <div><div style={{fontSize: 12.5, color: c.ink6}}>Your request</div><div style={{fontSize: 15.5, marginTop: 2, lineHeight: 1.25}}>{text}</div></div>
  </div>
);

export const AskHome: React.FC<{text: string; caret?: boolean; pressed?: number}> = ({text, caret, pressed = 0}) => (
  <Screen>
    <div style={{position: 'absolute', top: 72, left: 16}}><AppLogo /></div>
    <div style={{position: 'absolute', top: 135, left: 16, fontSize: 31, fontWeight: 700, letterSpacing: -0.6}}>Who can help you today?</div>
    <div style={{position: 'absolute', top: 176, left: 16, fontSize: 16, color: c.ink6}}>Local skills. Real connections.</div>
    <div style={{position: 'absolute', top: 212, left: 16, right: 16, minHeight: 68, background: c.card, border: `1.5px solid ${c.rule2}`, borderRadius: 26, display: 'flex', alignItems: 'center', padding: '10px 10px 10px 18px', gap: 10}}>
      <Ico d={icons.search} size={22} />
      <div style={{flex: 1, fontSize: 16, lineHeight: 1.3, color: text ? c.ink : c.ink6}}>{text || 'Tell us what you need...'}{caret && <span style={{display: 'inline-block', width: 2, height: 18, background: c.blue, verticalAlign: -3, marginLeft: 1}} />}</div>
      <div style={{width: 46, height: 46, flex: 'none', borderRadius: 14, background: pressed ? c.blue : c.ink, display: 'grid', placeItems: 'center', transform: `scale(${1 - pressed * 0.08})`}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={icons.up} /></svg>
      </div>
    </div>
    <div style={{position: 'absolute', top: 352, left: 16, right: 16, display: 'flex', justifyContent: 'space-between'}}>
      {([['Hair & beauty', 'M6 7a3 3 0 1 0 0-.1ZM6 17a3 3 0 1 0 0 .1ZM8.500 8.500 21 18M8.500 15.500 21 6'], ['Home help', 'M3 12l9-8 9 8M6 10v10h12V10M10 20v-6h4v6'], ['Tech', 'M5 6h14v10H5zM2 19h20'], ['Places', 'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 9v9M5 17c0 2 3 3 7 3s7-1 7-3']] as [string, string][]).map(([n, d]) => (
        <div key={n} style={{width: 92, textAlign: 'center', fontSize: 13, fontWeight: 600}}>
          <div style={{width: 62, height: 62, margin: '0 auto 8px', borderRadius: 18, background: c.sunk, display: 'grid', placeItems: 'center'}}><Ico d={d} size={30} /></div>{n}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 472, left: 16, fontSize: 18, fontWeight: 700}}>A little inspiration</div>
    <div style={{position: 'absolute', top: 506, left: 16, right: 16, height: 290, borderRadius: 26, overflow: 'hidden'}}>
      <Img src={staticFile('hero-a.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <TabBar active="Ask" inbox={0} />
  </Screen>
);
const AppLogo = () => (
  <div style={{display: 'flex', alignItems: 'flex-start', height: 42}}>
    <Mark h={42} color={c.ink} />
    <div style={{fontWeight: 800, fontSize: 35, lineHeight: '34px', letterSpacing: -0.5, marginLeft: 1}}>LUG</div>
  </div>
);

const Offer: React.FC<{p: number; init: string; name: string; score: React.ReactNode; price: string; when: string; away: string; style?: React.CSSProperties}> = ({p, init, name, score, price, when, away, style}) => (
  <Card style={{opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 90}px) scale(${0.96 + 0.04 * p})`, ...style}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{width: 58, height: 58, borderRadius: 29, background: c.sunk, display: 'grid', placeItems: 'center', fontSize: 21, fontWeight: 600, color: c.ink6}}>{init}</div>
      <div style={{flex: 1}}><div style={{fontSize: 17, fontWeight: 700}}>{name}</div><div style={{fontSize: 14, color: c.ink6, marginTop: 2}}>Braids</div></div>
      {score}
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0'}}>
      <div style={{fontSize: 40, fontWeight: 800, letterSpacing: -0.8}}>{price}</div><Badge kind="confirmed">Confirmed</Badge>
    </div>
    <div style={{display: 'flex', gap: 10}}><Pill k="Earliest" v={when} /><Pill k="Away" v={away} /></div>
  </Card>
);
export const OffersScreen: React.FC<{t: number}> = ({t}) => (
  <Screen>
    <NavBar title="Your ask" />
    <RequestRow text="Someone to do knotless braids, $120 max, Saturday morning" />
    <div style={{position: 'absolute', top: 188, left: 16, fontSize: 33, fontWeight: 800, letterSpacing: -0.6}}>{t < 1.5 ? '1 offer' : '2 offers'}</div>
    <div style={{position: 'absolute', top: 240, left: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
      <Offer p={popP(t, 0.7)} init="AK" name="Amara K." score={<div style={{textAlign: 'right'}}><div style={{fontSize: 27, fontWeight: 800, lineHeight: 1}}>94</div><div style={{fontSize: 11.500, color: c.ink6}}>Trust score</div></div>} price="$110" when="Sat 9:30 AM" away="1.2 mi" />
      <Offer p={popP(t, 1.5)} init="TB" name="Tolu's Braids" score={<span style={{fontSize: 13.500, fontWeight: 700, color: c.ink6, background: c.sunk, borderRadius: 8, padding: '5px 9px'}}>New</span>} price="$120" when="Sat 10:00 AM" away="0.8 mi" />
    </div>
    <TabBar active="Ask" />
  </Screen>
);
export const Counters: React.FC<{n: number; r: number; o: number; fs?: number}> = ({n, r, o, fs = 27}) => (
  <div style={{display: 'flex', gap: 10}}>
    {[['Notified', n], ['Replied', r], ['Offers', o]].map(([k, v]) => (
      <div key={k as string} style={{flex: 1, background: c.paper, borderRadius: 14, padding: '10px 12px'}}>
        <div style={{fontSize: fs * 0.5, color: c.ink6, fontWeight: 500}}>{k}</div><div style={{fontSize: fs, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums'}}>{v}</div>
      </div>
    ))}
  </div>
);
export const PlaceScreen: React.FC<{t: number}> = ({t}) => {
  const a = prog(t, 4.6, 0.5);
  const replied = t > 4.3 ? 3 : t > 3.9 ? 2 : t > 3.5 ? 1 : 0;
  return (
    <Screen>
      <NavBar title="Your ask" />
      <RequestRow text="How long is the line at the post office on Ben White?" />
      <Card style={{position: 'absolute', top: 196, left: 16, right: 16, opacity: 1 - a}}>
        <div style={{fontSize: 21, fontWeight: 700}}>Asking people nearby</div>
        <div style={{fontSize: 15, color: c.ink6, margin: '5px 0 14px'}}>Your question is out there. Answers land here.</div>
        <Counters n={3} r={replied} o={0} />
        <div style={{height: 5, borderRadius: 3, background: c.sunk, marginTop: 16}}><div style={{height: '100%', borderRadius: 3, width: `${(replied / 3) * 100}%`, background: c.ink}} /></div>
      </Card>
      <Card style={{position: 'absolute', top: 196, left: 16, right: 16, opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontSize: 19, fontWeight: 700}}>Post office on Ben White</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 12px'}}>
          <div style={{fontSize: 48, fontWeight: 800, letterSpacing: -1.2}}>12–15 min</div><Badge kind="confirmed" size={16}>Confirmed</Badge>
        </div>
        <div style={{fontSize: 16.500, lineHeight: 1.35}}>Three people nearby say the line is moving at the main counter.</div>
        <div style={{height: 1, background: c.rule2, margin: '14px 0'}} />
        <div style={{fontSize: 15, fontWeight: 700, marginBottom: 9}}>Who answered</div>
        <div style={{display: 'flex', gap: 8}}>
          {[['DM', '1 minute ago'], ['RK', '2 minutes ago'], ['AO', '3 minutes ago']].map(([n, w], i) => (
            <div key={n} style={{flex: 1, background: c.sunk, borderRadius: 10, padding: '8px 9px', transform: `scale(${0.8 + 0.2 * popP(t, 4.8 + i * 0.12)})`}}>
              <div style={{fontSize: 14.500, fontWeight: 700}}>{n}</div><div style={{fontSize: 12, color: c.ink6, marginTop: 2}}>{w}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize: 13.500, color: c.ink6, marginTop: 12}}>This answer stops being current at 10:59 AM.</div>
      </Card>
      <TabBar active="Ask" inbox={0} />
    </Screen>
  );
};
const DrawDashed: React.FC<{w: number; h: number; p: number}> = ({w, h, p}) => (
  <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
    <defs><mask id="dm"><rect x="1.500" y="1.500" width={w - 3} height={h - 3} rx="24" fill="none" stroke="#fff" strokeWidth="5" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /></mask></defs>
    <rect x="1.500" y="1.500" width={w - 3} height={h - 3} rx="24" fill="none" stroke={c.ink4} strokeWidth="2" strokeDasharray="9 7" mask="url(#dm)" />
  </svg>
);
export const UnknownScreen: React.FC<{t: number; webAt: number}> = ({t, webAt}) => {
  const w = prog(t, webAt + 0.5, 0.6);
  return (
    <Screen>
      <NavBar title="Your ask" />
      <RequestRow text="How long is the line at the post office on Ben White?" />
      <Card style={{position: 'absolute', top: 188, left: 16, right: 16, padding: 18}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 26, fontWeight: 800, letterSpacing: -0.5}}>No answers</div><Badge kind="unknown" size={15}>Unknown</Badge>
        </div>
        <div style={{fontSize: 16.500, fontWeight: 700, margin: '11px 0 7px'}}>Post office on Ben White</div>
        <div style={{fontSize: 15.500, color: c.ink6}}>No one nearby was able to check.</div>
        <div style={{fontSize: 14, color: c.ink6, marginTop: 9}}>3 people notified</div>
      </Card>
      <div style={{position: 'absolute', top: 386, left: 16, width: 396, height: 300}}>
        <DrawDashed w={396} h={300} p={prog(t, webAt, 1)} />
        <div style={{position: 'absolute', inset: 0, padding: 20, opacity: w}}>
          <div style={{fontSize: 15, fontWeight: 600, color: c.ink6}}>From the web</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '9px 0'}}>
            <div style={{fontSize: 18, fontWeight: 700}}>Usually busy at this hour</div><Dashed size={13.500}>Not verified</Dashed>
          </div>
          <div style={{fontSize: 15, lineHeight: 1.35}}>Popular-times data says lunchtime is the busiest. Nobody checked today.</div>
          <div style={{height: 1, background: c.rule2, margin: '12px 0'}} />
          <div style={{fontSize: 14, fontWeight: 700}}>Where this came from</div>
          <div style={{fontSize: 13.500, color: c.ink6, margin: '6px 0'}}>Web summary, read 2 minutes ago</div>
          <div style={{fontSize: 12.500, color: c.ink6}}>No person checked this. It is a pattern, not what is happening now.</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 706, left: 16, right: 16, height: 58, borderRadius: 18, background: c.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 17, fontWeight: 600}}>Ask something else</div>
      <TabBar active="Ask" inbox={0} />
    </Screen>
  );
};
const Chip: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p})`, border: `2px solid ${c.ink}`, borderRadius: 22, padding: '9px 15px', fontSize: 15, fontWeight: 700}}>✓ {children}</div>
);
export const SkillScreen: React.FC<{text: string; caret: boolean; t: number}> = ({text, caret, t}) => (
  <Screen>
    <div style={{position: 'absolute', top: 66, left: 0, right: 0, textAlign: 'center', fontSize: 19, fontWeight: 600}}>Offer a service</div>
    <div style={{position: 'absolute', top: 112, left: 16, fontSize: 16, color: c.ink6}}>Turn what you do into a local connection.</div>
    <Card style={{position: 'absolute', top: 150, left: 16, right: 16}}>
      <div style={{fontSize: 20, fontWeight: 700, marginBottom: 12}}>What do you do?</div>
      <div style={{minHeight: 56, border: `1.5px solid ${c.rule3}`, borderRadius: 12, padding: 12, fontSize: 16, lineHeight: 1.3}}>{text}{caret && <span style={{display: 'inline-block', width: 2, height: 18, background: c.blue, verticalAlign: -3, marginLeft: 1}} />}</div>
    </Card>
    <Card style={{position: 'absolute', top: 340, left: 16, right: 16}}>
      <div style={{fontSize: 20, fontWeight: 700, marginBottom: 5}}>Your skills</div>
      <div style={{fontSize: 14, color: c.ink6, marginBottom: 13}}>Keep the skills you offer. Tap to remove any others.</div>
      <div style={{display: 'flex', gap: 8}}>
        <Chip p={popP(t, 2.7)}>Braids</Chip><Chip p={popP(t, 2.95)}>Wig install</Chip><Chip p={popP(t, 3.2)}>Locs</Chip>
      </div>
    </Card>
    <Card style={{position: 'absolute', top: 530, left: 16, right: 16, opacity: prog(t, 3.5, 0.4)}}>
      <div style={{display: 'flex', gap: 10}}><Pill k="Travel area" v="3 mi" /><Pill k="Your hours" v="Sat 9 AM to 5 PM" /></div>
    </Card>
    <TabBar active="Profile" inbox={prog(t, 4.3, 0.5)} />
  </Screen>
);
export const InboxScreen: React.FC<{t: number; at: number}> = ({t, at}) => {
  const p = popP(t, at);
  return (
    <Screen>
      <div style={{position: 'absolute', top: 72, left: 16, fontSize: 36, fontWeight: 800, letterSpacing: -0.8}}>Inbox</div>
      <div style={{position: 'absolute', top: 120, left: 16, fontSize: 16, color: c.ink6}}>Requests you could actually serve.</div>
      <Card style={{position: 'absolute', top: 164, left: 16, right: 16, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -70}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14, color: c.ink6}}><span>New request</span><span>Just now</span></div>
        <div style={{fontSize: 21, fontWeight: 700, margin: '9px 0 12px', lineHeight: 1.2}}>Knotless braids, $120 max, Saturday morning</div>
        <div style={{display: 'flex', gap: 10}}><Pill k="Skill" v="Braids" /><Pill k="Away" v="1.2 mi" /></div>
        <div style={{display: 'flex', gap: 10, marginTop: 14}}>
          <div style={{flex: 2, height: 52, borderRadius: 16, background: c.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16.500, fontWeight: 600}}>Send an offer</div>
          <div style={{flex: 1, height: 52, borderRadius: 16, border: `1.5px solid ${c.rule3}`, display: 'grid', placeItems: 'center', fontSize: 16.500, fontWeight: 600}}>Decline</div>
        </div>
      </Card>
      <TabBar active="Inbox" />
    </Screen>
  );
};
