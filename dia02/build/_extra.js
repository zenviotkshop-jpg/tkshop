
function grinMouth(o,TC,my){
  const J=(o.strip?0:(o.mouth||0))*34;
  let s=`<rect x="-82" y="${my-24}" width="164" height="${74+J}" rx="34" fill="#5a1e24" stroke="${OL}" stroke-width="8"/>`;
  s+=`<rect x="-70" y="${my-16}" width="140" height="28" rx="8" fill="${TC}" stroke="${OL}" stroke-width="4"/><rect x="-62" y="${my+18+J}" width="124" height="22" rx="8" fill="${TC}" stroke="${OL}" stroke-width="4"/>`;
  for(const x of[-40,-14,14,40])s+=`<path d="M${x} ${my-14}v24M${x} ${my+20+J}v18" stroke="${OL}" stroke-width="3" opacity=".6"/>`;
  if(o.strip>=1)s+=`<rect x="-76" y="${my-20}" width="152" height="34" rx="10" fill="#9b5cff" opacity=".82" stroke="#5b2bb0" stroke-width="4"/>`;
  if(o.strip>=2)s+=`<rect x="-68" y="${my+14}" width="136" height="30" rx="10" fill="#9b5cff" opacity=".82" stroke="#5b2bb0" stroke-width="4"/>`;
  if(o.shine)for(const [x,y] of[[-46,my-6],[30,my+24],[56,my-8]])s+=`<path transform="translate(${x},${y}) scale(${o.shine})" d="M0 -16l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#fff"/>`;
  return s;
}
function stripbox(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})">
  <rect x="-80" y="-110" width="160" height="200" rx="16" fill="#8f4dff" stroke="${OL}" stroke-width="8"/>
  <rect x="-80" y="-110" width="160" height="44" rx="14" fill="#6a2fd6" stroke="${OL}" stroke-width="8"/>
  <path d="M-30 -20c10-14 22-6 30-4 8-2 20-10 30 4 8 12 0 34-4 46-3 10-6 20-12 20s-6-14-14-14-8 14-14 14-9-10-12-20c-4-12-12-34-4-46z" fill="#fff" stroke="${OL}" stroke-width="5"/>
  <path transform="translate(44,-50)" d="M0 -14l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff6a8"/>
  <rect x="-60" y="56" width="120" height="16" rx="8" fill="#c9a6ff"/></g>`}
function cashier(o){
  const g=o.glasses||0, m=o.mouth||0;let s='';
  s+=`<path d="M-150 0C-150 -150 -110 -200 0 -205C110 -200 150 -150 150 0Z" fill="#e4572e" stroke="${OL}" stroke-width="8"/>
   <path d="M-40 -200L0 -150 40 -200" fill="#fff" stroke="${OL}" stroke-width="6"/><rect x="50" y="-140" width="70" height="34" rx="6" fill="#fff" stroke="${OL}" stroke-width="5"/><text x="85" y="-115" text-anchor="middle" font-family="P" font-weight="900" font-size="20" fill="#14101f">MARI</text>`;
  s+=`<g transform="translate(0,-330)">`;
  s+=`<path d="M60 -80C150 -60 170 60 120 120C140 40 110 -10 70 -20Z" fill="#7a3b1e" stroke="${OL}" stroke-width="7"/>`;
  s+=`<circle r="125" fill="#f6c9a0" stroke="${OL}" stroke-width="8"/>`;
  s+=`<path d="M-128 -10C-140 -120 -40 -150 20 -140C90 -140 140 -90 128 -20C90 -80 20 -100 -60 -80C-90 -70 -110 -40 -128 -10Z" fill="#7a3b1e" stroke="${OL}" stroke-width="7"/>`;
  s+=`<path d="M-120 -70Q0 -190 120 -70L120 -96Q0 -210 -120 -96Z" fill="#2fa36b" stroke="${OL}" stroke-width="7"/><path d="M60 -96q70 -10 90 16l-40 10z" fill="#2fa36b" stroke="${OL}" stroke-width="6"/>`;
  for(const sx of[-1,1]){const x=sx*45;
    s+= o.heart?`<path transform="translate(${x},-5) scale(1.3)" d="M0 10C-26 -6 -14 -26 0 -12C14 -26 26 -6 0 10Z" fill="#ff4f8b" stroke="${OL}" stroke-width="3"/>`
      :`<ellipse cx="${x}" cy="-5" rx="22" ry="${o.scared?28:20}" fill="#fff" stroke="${OL}" stroke-width="6"/><circle cx="${x}" cy="-3" r="8" fill="${OL}"/>`;
    s+=`<path d="M${x-24} ${o.scared?-48:-38}q24 -12 48 0" fill="none" stroke="#7a3b1e" stroke-width="9" stroke-linecap="round"/>`}
  if(o.blush)s+=`<ellipse cx="-70" cy="40" rx="24" ry="13" fill="#ff7a9a" opacity=".7"/><ellipse cx="70" cy="40" rx="24" ry="13" fill="#ff7a9a" opacity=".7"/>`;
  s+=`<path d="M-8 10q8 22 16 0" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
  s+= o.scared?`<ellipse cx="0" cy="68" rx="22" ry="${14+m*18}" fill="#5a1e24" stroke="${OL}" stroke-width="6"/>`
     :`<path d="M-40 55Q0 ${85+m*20} 40 55" fill="${m>.1?'#5a1e24':'none'}" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>`;
  if(g>0){const gy=lerp(-170,-8,g);
    s+=`<g transform="translate(0,${gy})"><rect x="-92" y="-26" width="80" height="52" rx="20" fill="#14101f" stroke="${OL}" stroke-width="6"/><rect x="12" y="-26" width="80" height="52" rx="20" fill="#14101f" stroke="${OL}" stroke-width="6"/><path d="M-12 -6h24" stroke="#14101f" stroke-width="8"/><path d="M-80 -14l20 0M24 -14l20 0" stroke="#fff" stroke-width="6" opacity=".5"/></g>`}
  s+=`</g>`;
  return s;
}
function SUPER(){
  let s=`<rect x="-600" y="-400" width="2300" height="2000" fill="#f3ecdf"/><rect x="-600" y="-400" width="2300" height="560" fill="#e8dfcd"/>`;
  for(let i=-3;i<12;i++)s+=`<rect x="${i*160}" y="40" width="110" height="22" rx="11" fill="#fff"/>`;
  s+=`<g transform="translate(170,250)"><rect width="740" height="110" rx="20" fill="#2fa36b" stroke="#14101f" stroke-width="8"/><text x="370" y="80" text-anchor="middle" font-family="L" font-size="74" fill="#fff">SÚPER BARRIO</text></g>`;
  const cols=['#ff4757','#ffd93b','#3d7bff','#33d17a','#ff9f43','#a55eea','#ffffff'];
  for(const [x0,w] of [[-120,520],[640,560]]){
    s+=`<rect x="${x0}" y="430" width="${w}" height="760" fill="#cfc6b4" stroke="#14101f" stroke-width="8"/>`;
    for(let r=0;r<4;r++){const y=470+r*180;
      for(let k=0;k<Math.floor(w/62);k++){const c=cols[(k*3+r*5+Math.abs(x0))%7];const hh=90+((k*7+r*3)%4)*14;
        s+=`<rect x="${x0+12+k*62}" y="${y+140-hh}" width="52" height="${hh}" rx="6" fill="${c}" stroke="#14101f" stroke-width="4"/><rect x="${x0+20+k*62}" y="${y+150-hh}" width="36" height="14" rx="4" fill="#fff" opacity=".6"/>`}
      s+=`<rect x="${x0}" y="${y+140}" width="${w}" height="22" fill="#9d927c" stroke="#14101f" stroke-width="5"/>`}}
  s+=`<g transform="translate(760,520) rotate(6)"><rect width="190" height="80" rx="12" fill="#ff4757" stroke="#14101f" stroke-width="6"/><text x="95" y="56" text-anchor="middle" font-family="L" font-size="44" fill="#ffd93b">OFERTA</text></g>`;
  s+=`<rect x="-600" y="1190" width="2300" height="1000" fill="#e3ded3"/>`;
  for(let i=-8;i<20;i++)for(let j=0;j<10;j++)if((i+j)%2)s+=`<rect x="${i*110}" y="${1190+j*80}" width="110" height="80" fill="#d4cec1"/>`;
  return s;
}
function COUNTER(){
  return `<g transform="translate(560,1180)"><rect x="0" y="0" width="640" height="420" fill="#3d4a5c" stroke="#14101f" stroke-width="9"/>
   <rect x="-20" y="-40" width="680" height="54" rx="10" fill="#22262e" stroke="#14101f" stroke-width="8"/>
   <rect x="30" y="80" width="580" height="16" fill="#2fa36b"/><text x="320" y="230" text-anchor="middle" font-family="L" font-size="80" fill="#fff" opacity=".9">CAJA 2</text>
   <g transform="translate(470,-150)"><rect width="120" height="110" rx="10" fill="#14101f"/><rect x="12" y="12" width="96" height="56" rx="6" fill="#5cf08a"/></g></g>`}
const SUPERBG=SUPER();
