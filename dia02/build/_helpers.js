const $=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,k)=>a+(b-a)*k;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const eio=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const eout=k=>1-Math.pow(1-k,3);
const back=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
// pop-in/out: returns {s,o}
function pop(t,t0,t1,dur=.28,out=.18){
  if(t<t0||t>t1+out)return{s:0,o:0};
  if(t<t0+dur){const k=seg(t,t0,t0+dur);return{s:back(k),o:clamp(k*3)}}
  if(t>t1){const k=seg(t,t1,t1+out);return{s:1-.4*k,o:1-k}}
  return{s:1,o:1};
}
function place(id,t,t0,t1,x,y,rot=0,extra=1){
  const el=$(id),p=pop(t,t0,t1);el.style.opacity=p.o;
  if(p.o<=0){el.style.display='none';return p}
  el.style.display='';
  const w=el.offsetWidth,h=el.offsetHeight;
  el.style.left=(x-w/2)+'px';el.style.top=(y-h/2)+'px';
  el.style.transform=`rotate(${rot}deg) scale(${p.s*extra})`;
  return p;
}
const FPS=30;
const lvl=t=>{const i=Math.floor(t*FPS);const a=LEVELS[i]||0,b=LEVELS[i-1]||0,c=LEVELS[i+1]||0;return (a*2+b+c)/4};

// ---------- ESCENARIO (habitación) ----------
function room(){
  let s='';
  s+=`<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2150"/><stop offset="1" stop-color="#3d2d66"/></linearGradient>
  <radialGradient id="mon" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#7fd8ff" stop-opacity=".55"/><stop offset="1" stop-color="#7fd8ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>`;
  s+=`<rect x="-600" y="-400" width="2300" height="2000" fill="url(#wall)"/>`;
  for(let i=-6;i<20;i++)s+=`<rect x="${i*90}" y="-400" width="8" height="1970" fill="#000" opacity=".08"/>`;
  // ventana
  s+=`<g transform="translate(70,470)"><rect x="-14" y="-14" width="328" height="408" rx="16" fill="#1a1230"/><rect width="300" height="380" fill="#16234a"/>
   <circle cx="210" cy="90" r="46" fill="#fff6c9"/><circle cx="232" cy="74" r="44" fill="#16234a"/>
   ${[[40,60],[90,150],[150,40],[60,260],[250,220],[180,300],[120,90]].map(([x,y])=>`<path d="M${x} ${y-9}l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#fff" opacity=".9"/>`).join('')}
   <rect x="143" width="14" height="380" fill="#1a1230"/><rect y="183" width="300" height="14" fill="#1a1230"/>
   <rect x="-40" y="380" width="380" height="26" rx="8" fill="#5a3d2b"/></g>`;
  // póster
  s+=`<g transform="translate(400,420) rotate(-3)"><rect width="210" height="270" rx="10" fill="#1f8f6a" stroke="#14101f" stroke-width="8"/>
   <rect x="45" y="60" width="120" height="76" rx="34" fill="#fff"/><circle cx="80" cy="98" r="12" fill="#14101f"/><circle cx="132" cy="90" r="8" fill="#ff4757"/><circle cx="146" cy="106" r="8" fill="#3d7bff"/>
   <text x="105" y="200" text-anchor="middle" font-family="L" font-size="40" fill="#ffd93b">NOOB</text><text x="105" y="240" text-anchor="middle" font-family="L" font-size="30" fill="#fff">LVL 1</text></g>`;
  // calendario
  s+=`<g transform="translate(690,450) rotate(4)"><rect width="170" height="190" rx="12" fill="#fff" stroke="#14101f" stroke-width="7"/><rect width="170" height="48" rx="10" fill="#ff4757"/>
   ${Array.from({length:12},(_,i)=>`<path d="M${22+(i%4)*36} ${70+Math.floor(i/4)*36}l18 18m0-18l-18 18" stroke="#ff4757" stroke-width="5"/>`).join('')}</g>`;
  // puerta
  s+=`<g id="doorg" transform="translate(880,560)"><rect x="-12" y="-12" width="224" height="830" fill="#1a1230"/><rect width="200" height="810" fill="#0e0a1c"/>
   <g id="mom"></g>
   <g id="doorpanel"><rect width="200" height="810" fill="#7a4f33" stroke="#14101f" stroke-width="7"/><rect x="28" y="40" width="144" height="300" rx="8" fill="none" stroke="#5c3a24" stroke-width="7"/><rect x="28" y="420" width="144" height="320" rx="8" fill="none" stroke="#5c3a24" stroke-width="7"/><circle cx="30" cy="420" r="13" fill="#ffd93b" stroke="#14101f" stroke-width="5"/></g></g>`;
  // escritorio
  s+=`<g transform="translate(600,1020)"><ellipse cx="130" cy="40" rx="190" ry="140" fill="url(#mon)"/><rect x="30" y="-60" width="210" height="140" rx="12" fill="#14101f"/><rect x="42" y="-48" width="186" height="116" rx="6" fill="#2a7bd6"/>
   ${[0,1,2,3,4].map(i=>`<rect x="${62+i*32}" y="${40-[20,44,30,62,50][i]}" width="20" height="${[20,44,30,62,50][i]}" fill="#5cf08a"/>`).join('')}
   <rect x="115" y="80" width="40" height="40" fill="#14101f"/><rect x="-40" y="118" width="360" height="30" rx="8" fill="#6b4630" stroke="#14101f" stroke-width="6"/>
   <rect x="-20" y="148" width="22" height="260" fill="#4e3222"/><rect x="290" y="148" width="22" height="260" fill="#4e3222"/>
   <rect x="250" y="70" width="28" height="48" rx="6" fill="#32d0a0" stroke="#14101f" stroke-width="5"/><rect x="-10" y="76" width="28" height="42" rx="6" fill="#ff4757" stroke="#14101f" stroke-width="5"/></g>`;
  // suelo
  s+=`<rect x="-600" y="1430" width="2300" height="900" fill="#5a3b2a"/>`;
  for(let i=0;i<8;i++)s+=`<rect x="-600" y="${1470+i*70}" width="2300" height="5" fill="#000" opacity=".15"/>`;
  s+=`<rect x="-600" y="1420" width="2300" height="18" fill="#3e2a1e"/>`;
  s+=`<ellipse cx="540" cy="1600" rx="420" ry="80" fill="#8c2f45"/><ellipse cx="540" cy="1600" rx="360" ry="58" fill="none" stroke="#b44a62" stroke-width="6" stroke-dasharray="20 14"/>`;
  // cajas de pizza y latas
  s+=`<g transform="translate(60,1480)">${[0,1,2,3].map(i=>`<g transform="translate(${i*6-10},${-i*30}) rotate(${[2,-3,4,-2][i]})"><rect width="230" height="34" rx="5" fill="#e9d5b0" stroke="#14101f" stroke-width="5"/><circle cx="60" cy="17" r="8" fill="#ff4757"/></g>`).join('')}</g>`;
  s+=`<g transform="translate(860,1560) rotate(80)"><rect width="34" height="60" rx="8" fill="#32d0a0" stroke="#14101f" stroke-width="5"/></g><g transform="translate(300,1700) rotate(-60)"><rect width="34" height="60" rx="8" fill="#ff4757" stroke="#14101f" stroke-width="5"/></g>`;
  s+=`<path d="M780 1700c20-30 60-10 80-20 10 20-30 40-60 40z" fill="#f2f2f2" stroke="#14101f" stroke-width="5"/>`;
  return s;
}
const ROOM=room();

// ---------- DANI ----------
const OL='#2a1a12', SK='#f3c6a5', HD='#6f7d3c', HD2='#5a6630';
function limb(pts,w,col){const d='M'+pts.map(p=>p.join(' ')).join(' L');
  return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w+16}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`}
function hand(x,y,r=36){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}" stroke="${OL}" stroke-width="8"/>`}
function bottle(x,y,rot=0,s=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <rect x="-48" y="-150" width="96" height="76" rx="10" fill="#f4efe6" stroke="${OL}" stroke-width="7"/>
  <path d="M-36 -138l30 30M-18 -144l40 40M4 -144l34 34M-40 -116l22 22" stroke="#c9bfae" stroke-width="7" stroke-linecap="round"/>
  <rect x="-56" y="-76" width="112" height="106" rx="12" fill="#a8461c" stroke="${OL}" stroke-width="8"/>
  <path d="M-46 -60l36 36M-30 -66l50 50M-8 -66l52 52M-46 -30l30 30" stroke="#c96a2c" stroke-width="7" stroke-linecap="round"/>
  <path d="M-44 -66v80" stroke="#ffd29a" stroke-width="8" stroke-linecap="round" opacity=".55"/>
  <rect x="-20" y="-24" width="40" height="34" rx="4" fill="#e6b422" stroke="${OL}" stroke-width="4"/><path d="M-12 -12h24M-10 0h20" stroke="#7a5a12" stroke-width="3"/></g>`}
function dani(o){
  const m=o.mouth||0, ex=o.expr||'tired', arms=o.arms||'down', TC=o.teeth||'#e0b53a';
  let s='';
  // sombra
  s+=`<ellipse cx="0" cy="0" rx="210" ry="30" fill="#000" opacity=".25"/>`;
  const _t=o.t||0,_k=o.mouth||0;
  s+=`<g transform="rotate(${Math.sin(_t*1.6)*1.8} 0 -60) translate(0,${-Math.abs(Math.sin(_t*5.5))*_k*14})">`;
  // zapatillas
  for(const sx of[-1,1])s+=`<g transform="translate(${sx*78},-28)"><path d="M-78 10c0-40 20-56 60-56h40c38 0 56 26 56 56z" fill="#3c3f46" stroke="${OL}" stroke-width="8"/><rect x="-80" y="4" width="160" height="24" rx="12" fill="#ece5d2" stroke="${OL}" stroke-width="7"/><path d="M-20 -40l30 12M-24 -26l30 12" stroke="#ece5d2" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="-10" r="6" fill="#8a6a3a" opacity=".7"/></g>`;
  // pantalones
  s+=`<path d="M-150 -330h300l-14 270h-108l-28-200-28 200h-108z" fill="#8a8d93" stroke="${OL}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M-120 -120c20 6 40 4 50-6M60 -200c20 10 40 8 50 0" fill="none" stroke="#6f7278" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-80" cy="-180" r="16" fill="#6c5a44" opacity=".55"/><circle cx="95" cy="-110" r="12" fill="#6c5a44" opacity=".55"/>`;
  // brazos traseros (según pose)
  const L=[-158,-500], R=[158,-500];
  let la,ra,lh,rh,bot='';
  if(arms==='down'){la=[L,[-205,-400],[-205,-300]];ra=[R,[205,-400],[205,-300]]}
  if(arms==='up'){la=[L,[-250,-590],[-230,-740]];ra=[R,[250,-590],[230,-740]]}
  if(arms==='hold'){la=[L,[-205,-400],[-205,-300]];ra=[R,[240,-420],[150,-470]];bot=(o.rays?rays(150,-540,o.t):'')+(o.item==='box'?stripbox(150,-540,1.05):bottle(150,-520,0,1.45))}
  if(arms==='spray'){la=[L,[-205,-400],[-205,-300]];ra=[R,[260,-560],[175,-640]];bot=bottle(170,-665,-28,1.05)}
  if(arms==='point'){la=[L,[-205,-400],[-205,-300]];ra=[R,[250,-430],[300,-300]];bot=bottle(-205,-330,0,.9)}
  if(arms==='wave'){la=[L,[-205,-400],[-205,-300]];ra=[R,[260,-560],[250+Math.sin((o.t||0)*12)*30,-720]]}
  // sudadera cuerpo
  s+=`<path d="M-170 -520Q-232 -380 -175 -300Q0 -255 175 -300Q232 -380 170 -520Q0 -580 -170 -520Z" fill="${HD}" stroke="${OL}" stroke-width="9"/>
      <path d="M-175 -300Q0 -255 175 -300l-6 34Q0 -224 -169 -266z" fill="${HD2}" stroke="${OL}" stroke-width="8"/>
      <path d="M-100 -415h200l-14 80h-172z" fill="${HD2}" stroke="${OL}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M-34 -525l-6 92M34 -525l6 92" stroke="#c9c9c9" stroke-width="9" stroke-linecap="round"/><circle cx="-40" cy="-428" r="9" fill="#c9c9c9"/><circle cx="40" cy="-428" r="9" fill="#c9c9c9"/>
      ${[[-110,-470,20],[90,-480,14],[-40,-370,12],[120,-380,18],[10,-460,9],[-130,-350,10],[60,-330,8]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#6b4b2a" opacity=".75"/>`).join('')}
      ${[[-70,-440],[70,-420],[0,-500],[-120,-420],[140,-450]].map(([x,y])=>`<rect x="${x}" y="${y}" width="9" height="7" fill="#e3b04b" transform="rotate(25 ${x} ${y})"/>`).join('')}`;
  // capucha detrás del cuello
  s+=`<path d="M-120 -520Q0 -470 120 -520Q100 -560 0 -566Q-100 -560 -120 -520Z" fill="${HD2}" stroke="${OL}" stroke-width="8"/>`;
  s+=limb(la,74,HD)+hand(...la[2])+limb(ra,74,HD)+(arms==='spray'||arms==='hold'?'':hand(...ra[2]));
  // cabeza
  const hy=-690;
  s+=`<g transform="translate(0,${hy}) rotate(${(o.tilt||0)+Math.sin(_t*2.3)*2.5+Math.sin(_t*9)*_k*4})">`;
  // pelo trasero
  s+=`<path d="M-200 30C-230 -140 -120 -215 0 -212C130 -215 230 -140 200 30C210 80 170 120 150 90L150 -20H-150V90C-170 120-210 80-200 30Z" fill="#3b2a1e" stroke="${OL}" stroke-width="8"/>`;
  s+=`<circle cx="0" cy="0" r="180" fill="${SK}" stroke="${OL}" stroke-width="9"/>`;
  // barba de 3 días
  s+=`<path d="M-150 60Q0 230 150 60Q150 150 0 178Q-150 150-150 60Z" fill="#7a5a44" opacity=".22"/>`;
  for(let i=0;i<46;i++){const a=Math.PI*(.12+.76*((i*37)%46)/46),r=120+((i*53)%40);s+=`<circle cx="${Math.cos(a)*r}" cy="${Math.sin(a)*r*0.92+20}" r="3.2" fill="#4a3324" opacity=".6"/>`}
  // granos
  s+=[[-110,40,9],[-130,5,6],[115,30,8],[95,70,6],[-60,-95,7],[40,-110,6],[140,-10,5],[-95,85,5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#e2574c"/><circle cx="${x-1.5}" cy="${y-2}" r="${r*.35}" fill="#ffd9c9"/>`).join('');
  // ojos
  const ey=-30, look=o.look||0;
  const blink=o.blink;
  for(const sx of[-1,1]){
    const x=sx*64;
    if(ex==='happy'||ex==='sniff'){
      s+=`<path d="M${x-34} ${ey+6}Q${x} ${ey-(ex==='happy'?34:6)} ${x+34} ${ey+6}" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/>`;
      if(ex==='happy')s+=`<ellipse cx="${x+sx*10}" cy="${ey+52}" rx="30" ry="16" fill="#ff8a9a" opacity=".6"/>`;
    }else if(ex==='shock'){
      s+=`<circle cx="${x}" cy="${ey}" r="${blink?4:48}" fill="#fff" stroke="${OL}" stroke-width="8"/>`;
      if(!blink)s+=`<circle cx="${x}" cy="${ey}" r="10" fill="${OL}"/>`;
    }else{
      const lid=ex==='determined'?.42:ex==='grin'?.2:.55;
      s+=`<ellipse cx="${x}" cy="${ey}" rx="40" ry="30" fill="#fff" stroke="${OL}" stroke-width="8"/>`;
      s+=`<circle cx="${x+look*10}" cy="${ey+10}" r="13" fill="${OL}"/>`;
      const lh=blink?1:lid;
      s+=`<path d="M${x-44} ${ey-34}H${x+44}V${ey-30+60*lh}H${x-44}Z" fill="${SK}"/><path d="M${x-40} ${ey-30+60*lh}H${x+40}" stroke="${OL}" stroke-width="8" stroke-linecap="round"/>`;
      s+=`<path d="M${x-30} ${ey+42}Q${x} ${ey+58} ${x+30} ${ey+42}" fill="none" stroke="#9a6a8e" stroke-width="7" stroke-linecap="round"/>`;
    }
    // cejas
    const by=ex==='shock'?ey-92:ex==='determined'?ey-48:ex==='happy'?ey-62:ey-56;
    const tilt=ex==='determined'?sx*16:ex==='sniff'?-sx*6:ex==='shock'?-sx*8:-sx*4;
    s+=`<path d="M${x-40} ${by-tilt}Q${x} ${by-14} ${x+40} ${by+tilt}" fill="none" stroke="#3b2a1e" stroke-width="17" stroke-linecap="round"/>`;
  }
  // nariz
  const ny=ex==='sniff'?22:35;
  s+=`<ellipse cx="0" cy="${ny}" rx="40" ry="34" fill="#e8705f" stroke="${OL}" stroke-width="8"/><ellipse cx="-12" cy="${ny-12}" rx="11" ry="8" fill="#fff" opacity=".5"/>`;
  // bigote
  s+=`<path d="M-50 82Q0 64 50 82" fill="none" stroke="#4a3324" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 7"/>`;
  // boca
  const my=112;
  if(ex==='happy'){
    s+=`<path d="M-70 ${my-14}Q0 ${my+62+m*55} 70 ${my-14}Z" fill="#5a1e24" stroke="${OL}" stroke-width="8" stroke-linejoin="round"/><path d="M-58 ${my-10}h116l-8 18h-100z" fill="${TC}"/>`;
  }else if(ex==='grin'){
    s+=grinMouth(o,TC,my);
  }else{
    const op=ex==='shock'?Math.max(m,.55):m;
    const h=6+op*78, w=ex==='shock'?40:56;
    s+=`<ellipse cx="0" cy="${my+h/2-6}" rx="${w-op*6}" ry="${h/2+4}" fill="#5a1e24" stroke="${OL}" stroke-width="8"/>`;
    if(op>.12)s+=`<path d="M${-w+12} ${my-6}h${(w-12)*2}v${12+op*6}h-${(w-12)*2*0.3}v-4h-${(w-12)*2*0.2}v6h-${(w-12)*2*0.5}z" fill="${TC}" stroke="${OL}" stroke-width="3"/>`;
  }
  // pelo delantero (flequillo)
  s+=`<path d="M-190 -10C-210 -150 -110 -200 0 -198C120 -200 215 -150 190 -10L172 -40 160 -90 128 -70 108 -120 74 -86 46 -128 14 -84 -22 -126 -50 -86 -86 -124 -112 -74 -146 -96 -168 -40Z" fill="#3b2a1e" stroke="${OL}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M-60 -170q30 -10 60 4M40 -165q30 -6 56 12" stroke="#5a4232" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  // cascos gamer
  s+=`<path d="M-188 -20C-200 -250 200 -250 188 -20" fill="none" stroke="${OL}" stroke-width="44" stroke-linecap="round"/><path d="M-188 -20C-200 -250 200 -250 188 -20" fill="none" stroke="#e46aa8" stroke-width="28" stroke-linecap="round"/>`;
  for(const sx of[-1,1])s+=`<ellipse cx="${sx*190}" cy="10" rx="52" ry="70" fill="#1f2a33" stroke="${OL}" stroke-width="8"/><ellipse cx="${sx*200}" cy="10" rx="40" ry="58" fill="#38b2a8" stroke="${OL}" stroke-width="7"/><ellipse cx="${sx*208}" cy="-8" rx="12" ry="20" fill="#9ff0e6" opacity=".7"/>`;
  s+=`<path d="M175 60Q150 120 70 118" fill="none" stroke="#1f2a33" stroke-width="12" stroke-linecap="round"/><circle cx="66" cy="118" r="13" fill="#1f2a33"/>`;
  s+=`</g>`;
  s+=bot;
  if(arms==='spray'||arms==='hold')s+=hand(...ra[2]);
  if(o.glint)s+=`<circle cx="0" cy="-560" r="${120+60*o.glint}" fill="#ffe45c" opacity="${.45*o.glint}"/>`+[0,1,2,3,4,5].map(i=>`<path transform="translate(0,-560) rotate(${i*60+o.glint*40})" d="M-10 0L0 -${150+120*o.glint}L10 0Z" fill="#ffe45c" opacity="${.8*o.glint}"/>`).join('');
  s+='</g>';
  return s;
}
function rays(x,y,t){let s='';for(let i=0;i<12;i++){const a=i*30+t*40;s+=`<path transform="translate(${x},${y}) rotate(${a})" d="M0 0L-28 -260L28 -260Z" fill="#fff6a8" opacity=".45"/>`}return s+`<circle cx="${x}" cy="${y}" r="120" fill="#fff6a8" opacity=".5"/>`}
// moscas
function fly(x,y,sc,t,ph,dead){
  const f=Math.sin(t*90+ph)*.5+.5;
  return `<g transform="translate(${x},${y}) scale(${sc}) rotate(${dead?160:Math.sin(t*7+ph)*15})">
   <ellipse cx="-8" cy="-14" rx="16" ry="${6+f*8}" fill="#e9f4ff" opacity=".85" stroke="#14101f" stroke-width="2.5" transform="rotate(-30 -8 -14)"/>
   <ellipse cx="8" cy="-14" rx="16" ry="${6+(1-f)*8}" fill="#e9f4ff" opacity=".85" stroke="#14101f" stroke-width="2.5" transform="rotate(30 8 -14)"/>
   <ellipse cx="0" cy="0" rx="14" ry="11" fill="#14101f"/><circle cx="-8" cy="-4" r="5" fill="#c0392b"/><circle cx="8" cy="-4" r="5" fill="#c0392b"/>
   ${dead?'<path d="M-12 -8l8 8m0-8l-8 8M4 -8l8 8m0-8l-8 8" stroke="#fff" stroke-width="2.5"/>':''}</g>`}
function stink(cx,cy,amt,t,col='#8fd14f'){
  if(amt<=0.01)return'';let s='';
  for(let i=0;i<6;i++){
    const ph=(t*.55+i/6)%1, x=cx+[-230,-170,180,240,-260,260][i]+Math.sin(t*2+i)*14, y=cy+[0,-140,-60,-200,-300,-330][i]-ph*220;
    const a=amt*Math.sin(ph*Math.PI)*.85;
    let d=`M${x} ${y}`;for(let k=1;k<=6;k++)d+=` Q${x+(k%2?30:-30)} ${y-k*28+14} ${x} ${y-k*28}`;
    s+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" opacity="${a}"/>`;
  }
  return s;
}
function sparkles(cx,cy,t,n=8,R=330){let s='';
  for(let i=0;i<n;i++){const a=i/n*6.283+t*.6, r=R+Math.sin(t*3+i)*30, k=.6+.4*Math.sin(t*6+i*1.7);
    const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*1.2;s+=`<path transform="translate(${x},${y}) scale(${k*1.6})" d="M0 -22l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="#fff6a8" stroke="#14101f" stroke-width="3"/>`}
  return s}
function mist(cx,cy,k,t){if(k<=0||k>=1)return'';let s='';
  for(let i=0;i<9;i++){const a=-2.2+i*.35, r=40+k*260*(0.6+.4*Math.sin(i*3));s+=`<circle cx="${cx+Math.cos(a)*r}" cy="${cy+Math.sin(a)*r*.7+k*60}" r="${18+k*50}" fill="#ffb3d6" opacity="${(1-k)*.75}"/>`}
  return s}
function mom(o){ // asomándose por la puerta
  return `<g transform="translate(${o},0)"><path d="M-10 260C-10 160 60 120 130 130C190 140 220 200 215 270L215 810H-10Z" fill="#9b59b6" stroke="${OL}" stroke-width="8"/>
   <circle cx="105" cy="220" r="95" fill="${SK}" stroke="${OL}" stroke-width="8"/><circle cx="110" cy="105" r="48" fill="#b8b8c8" stroke="${OL}" stroke-width="8"/>
   <path d="M15 200C20 120 190 110 200 200C170 160 60 160 15 200Z" fill="#b8b8c8" stroke="${OL}" stroke-width="7"/>
   <circle cx="75" cy="225" r="26" fill="#fff" stroke="${OL}" stroke-width="6"/><circle cx="140" cy="225" r="26" fill="#fff" stroke="${OL}" stroke-width="6"/><circle cx="80" cy="228" r="8" fill="${OL}"/><circle cx="145" cy="228" r="8" fill="${OL}"/>
   <path d="M101 225h14" stroke="${OL}" stroke-width="6"/><ellipse cx="108" cy="285" rx="20" ry="${12}" fill="#5a1e24" stroke="${OL}" stroke-width="6"/></g>`}

// ---------- CAPTIONS ----------
const KEY=['dientes.','dientes','queso','curado.','tiras','blanqueadoras','moradas.','morado','amarillo...','ciencia.','arriba...','abajo...','treinta','minutos','dientes!?','pantalla','carrito','naranja,','vayáis,','súper.','cajera.','número.','mensaje','pelo,','granos...','ropa?','encuesta.','tres!','bolsa.','contenedor...','espera...','fuerte','ahora.','Khamrah','Lattafa.','vainilla','canela...','noche','olía.','moscas','seguidores.','ex...','casa?','treinta','días!?','ducharme.','cuatro.','glow','up.','persona.','perfume','TikTok','Shop.','van!','verdad!','¿éxito?','carrito','naranja.','ventana.','2019.','historia.','dientes,','pelo...','granos?','encuesta.','dos!','espray...','acabó.'];
const RED=['sonreído.','ex?','Espera...','queso','curado.','ex...','casa?','treinta','días!?','2019.','historia.','cuatro.'];
const chunks=[];{let cur=[];WORDS.forEach((w,i)=>{cur.push(i);const end=/[.,!?:]$/.test(w[2])||/\.\.\.$/.test(w[2]);const gap=WORDS[i+1]?WORDS[i+1][0]-w[1]:9;if(cur.length>=3||end||gap>.35){chunks.push(cur);cur=[]}});if(cur.length)chunks.push(cur)}
function caption(t){
  let html='';
  for(let c=0;c<chunks.length;c++){const ch=chunks[c],a=WORDS[ch[0]][0]-.05,nx=chunks[c+1]?WORDS[chunks[c+1][0]][0]-.05:99,b=Math.min(nx,WORDS[ch[ch.length-1]][1]+.6);
    if(t>=a&&t<b){
      const k=seg(t,a,a+.12);
      html=`<div style="transform:scale(${.7+.3*back(k)})">`+ch.map(i=>{const w=WORDS[i];const said=t>=w[0]-.03;const now=t>=w[0]-.03&&t<w[1]+.08;
        const col=RED.includes(w[2])?'#ff5a6e':KEY.includes(w[2])?'#ffd93b':'#fff';
        return `<span style="color:${col};opacity:${said?1:.35};transform:scale(${now?1.12:1})">${w[2].replace('...','…')}</span>`}).join(' ')+'</div>';break}}
  $('cap').innerHTML=html;
}


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
