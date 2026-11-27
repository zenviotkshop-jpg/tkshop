const CONFIG={producto:'Tiras blanqueadoras moradas', precio:'', envio:''};
$('prodname').textContent=CONFIG.producto;$('precio').textContent=CONFIG.precio;$('envio').textContent=CONFIG.envio;
$('boxicon').innerHTML=stripbox(0,0,1);
const W=$('world');let TA=0;
const YEL='#e0b53a', WHT='#fbfaf2';
function mixc(a,b,k){const p=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')}
function shot(t){ // [t0,t1,scene,cx,cy,z0,z1]
  const S=[[-9,5.6,'super',540,1000,1.0,1.06],[5.6,9.58,'super',600,1000,1.06,1.12],[9.58,10.55,'super',330,985,2.3,2.4],[10.55,11.6,'super',850,930,2.4,2.5],
   [11.6,17.4,'room',540,1060,1.0,1.08],[17.4,20.0,'room',540,930,2.0,2.15],[20.0,25.8,'room',540,1020,1.15,1.22],[25.8,35.9,'room',540,930,2.15,2.35],
   [35.9,38.0,'split',0,0,1,1],[38.0,42.3,'room',540,1040,1.08,1.14],[42.3,47.4,'super',600,1000,1.05,1.15],[47.4,49.85,'super',600,1000,1.15,1.2],[49.85,99,'vote',0,0,1,1]];
  for(const s of S)if(t>=s[0]&&t<s[1])return{scene:s[2],cx:s[3],cy:s[4],z:lerp(s[5],s[6],seg(t,s[0],s[1])),t0:s[0]};
}
function teethCol(t){return t<32.4?YEL:mixc(YEL,WHT,eio(seg(t,32.4,33.6)))}
const inv=tn=>{const n=TMAP.n,o=TMAP.o;if(tn<=n[0])return o[0]+(tn-n[0]);for(let i=1;i<n.length;i++)if(tn<=n[i])return o[i-1]+(tn-n[i-1])*(o[i]-o[i-1])/(n[i]-n[i-1]);return o[o.length-1]+(tn-n[n.length-1])};
function render(tn){
  const t=inv(tn);TA=tn;const sh=shot(t);
  const L0=Math.min(1,lvl(tn)*1.2);const mouth=L0>0.08?L0*(0.5+0.5*Math.abs(Math.sin(TA*13))):0, tc=teethCol(t);
  let s='';
  // sacudidas
  let shk=0;for(const [a,amp] of [[10.0,24],[10.62,16],[33.68,14],[47.5,18],[13.9,10]]){if(t>=a&&t<a+.35)shk=Math.max(shk,amp*(1-seg(t,a,a+.35)))}
  const hx=Math.sin(TA*0.9)*7+Math.sin(TA*2.1)*3, hy=Math.cos(TA*0.7)*6;
  const cam=`translate(${540+Math.sin(t*95)*shk+hx},${960+Math.cos(t*80)*shk+hy}) scale(${sh.z*(1+0.012*Math.sin(TA*0.8))}) translate(${-sh.cx},${-sh.cy})`;
  if(sh.scene==='super'){
    const second=t>=42.3;
    // Dani
    let dx=330, bob=0; if(t<1.4){dx=lerp(-260,330,eout(seg(t,-0.3,1.4)));bob=-Math.abs(Math.sin(t*12))*18}
    let ex='happy',arms='down',glint=0,shine=0,grin=false;
    if(t>=5.6&&t<9.58)ex='happy';
    if(t>=9.58&&t<11.6){ex='grin';glint=t>=9.9&&t<10.6?Math.sin(seg(t,9.9,10.6)*Math.PI):0}
    if(second){ex=t<44.8?'determined':'grin';shine=t>=44.8?1+.2*Math.sin(TA*10):0;if(t>=46.6)arms='up'}
    const dopt={expr:ex,arms,mouth,blink:(TA%3.1)<.12,teeth:second?WHT:YEL,glint,shine,t:TA};
    // cajera
    let g=0,heart=false,blush=false,scared=false,cm=0;
    if(!second){if(t>=10.6){g=eout(seg(t,10.6,10.85));} if(t>=10.0&&t<10.6)scared=true; if(t>=7.9&&t<9.4)cm=.4+.3*Math.sin(TA*20)}
    else{g=1-eout(seg(t,45.0,45.3)); if(t>=45.3){heart=true;blush=true} if(t>=43.7&&t<44.7)cm=.4+.3*Math.sin(TA*20)}
    s+=`<g transform="${cam}">${SUPERBG}<g transform="translate(850,${1250-Math.abs(Math.sin(TA*3))*6}) rotate(${Math.sin(TA*1.3)*2} 0 -200)">${cashier({glasses:g,heart,blush,scared,mouth:cm})}</g>${COUNTER()}
      <g transform="translate(${dx},${1640+bob}) scale(.95)">${stink(0,-560,t<6?.35:0,TA,'#ff9ccc')}${dani(dopt)}</g>`;
    if(second&&t>=44.8)s+=sparkles(330,985,TA,7,200);
    if(second&&t>=45.3){for(let i=0;i<4;i++){const k=((TA*.6+i/4)%1);s+=`<path transform="translate(${850+Math.sin(TA*2+i)*120},${800-k*300}) scale(${1.4})" d="M0 10C-26 -6 -14 -26 0 -12C14 -26 26 -6 0 10Z" fill="#ff4f8b" stroke="#14101f" stroke-width="3" opacity="${1-k}"/>`}}
    s+=`</g>`;
  } else if(sh.scene==='room'){
    let ex='tired',arms='down',strip=0,shine=0,item=null,rays=false;
    if(t>=11.6&&t<17.4){ex=t<12.3?'tired':'determined'}
    if(t>=17.4&&t<20.0){ex='grin'}
    if(t>=20.0&&t<25.8){ex='happy';arms='hold';item='box';rays=t>=21.3}
    if(t>=25.8&&t<35.9){ex='grin';strip=t<26.1?0:t<27.45?1:t<32.25?2:0;if(t>=33.6)shine=1+.25*Math.sin(TA*9);if(t>=35.1)ex='happy'}
    if(t>=38.0&&t<42.3){ex='happy';arms='hold';item='box'}
    const muff=t>=29.9&&t<31.6;
    const tilt=muff?Math.sin(TA*14)*6:0;
    const dopt={expr:ex,arms,item,rays,mouth:(strip&&ex==='grin')?0:mouth,blink:(TA%3.3)<.12,teeth:tc,strip,shine,tilt,t:TA};
    s+=`<g transform="${cam}">${ROOM}<g transform="translate(540,1600) scale(1.05)">${dani(dopt)}</g>`;
    if(t>=33.68&&t<35.9)s+=sparkles(540,930,TA,9,260);
    s+=`</g>`;
  } else if(sh.scene==='split'){
    s+=`<defs><clipPath id="cl"><rect x="0" y="0" width="538" height="1920"/></clipPath><clipPath id="cr"><rect x="542" y="0" width="538" height="1920"/></clipPath></defs>`;
    const face=(x,te,sp)=>`<g transform="translate(${x},1830) scale(1.15)">${dani({expr:'grin',teeth:te,shine:sp,mouth,t:TA})}</g>`;
    s+=`<g clip-path="url(#cl)"><g transform="translate(-270,0)">${ROOM}</g><rect width="540" height="1920" fill="#000" opacity=".35"/>${face(270,YEL,0)}</g>`;
    s+=`<g clip-path="url(#cr)"><g transform="translate(270,0)">${ROOM}</g>${face(810,WHT,1+.2*Math.sin(TA*9))}${sparkles(810,1050,TA,7,240)}</g><rect x="533" width="14" height="1920" fill="#fff"/>`;
  }
  W.innerHTML=s+(sh.scene!=='vote'?`<rect width="1080" height="1920" fill="url(#vig)"/>`:'');
  if(t>=47.4&&t<49.85)W.innerHTML+=`<rect width="1080" height="1920" fill="#0b0716" opacity=".6"/>`;
  if(t>=20.15&&t<21.3)W.innerHTML+=`<rect width="1080" height="1920" fill="#0b0716" opacity=".45"/>`;

  // HUD
  $('hud').style.display=t<49.85?'flex':'none';
  const gp=t<33.9?5:5+Math.round(5*eout(seg(t,33.9,34.6)));
  $('glowpct').textContent=gp+'%';$('glowpct').style.color='#33d17a';$('gfill').style.width=(gp*2)+'%';
  $('glowbar').style.transform=`scale(${t>=33.9&&t<34.6?1+.06*Math.sin(t*30):1})`;
  $('chipboda').style.transform=`scale(${t>=15.0&&t<15.6?1+.12*Math.sin(seg(t,15,15.6)*Math.PI):1})`;
  const lv=[[0,'QUESO CURADO','#e0a82e',12],[32.5,'MANTEQUILLA','#f0cf5a',40],[33.0,'MARFIL','#e9dcb5',70],[33.6,'PERLA','#ffffff',100]];
  let L=lv[0];for(const l of lv)if(t>=l[0])L=l;
  const op=pop(t,18.0,49.7);const showM=op.o>0&&!(t>=35.9&&t<38.0)&&!(t>=30.95&&t<31.75);
  $('olor').style.opacity=showM?op.o:0;$('olor').style.transform=`scale(${op.s})`;
  $('olorlvl').textContent=L[1];$('olorlvl').style.color=L[2];$('olor').style.borderColor=L[2]==='#ffffff'?'#c9a6ff':L[2];
  $('ofill').style.width=L[3]+'%';$('ofill').style.background=L[2]==='#ffffff'?'#c9a6ff':L[2];

  place('t_dia',t,0.12,2.4,540,470,-4);
  place('t_aprob',t,1.75,3.6,540,640,3);
  place('b_bolsa1',t,7.9,9.6,800,560,-2);
  place('t_dano',t,10.75,11.6,540,560,-3);
  place('pollres',t,12.3,14.95,540,600,-2);
  place('t_29',t,15.0,17.3,540,560,-3);
  place('t_queso',t,18.85,19.95,540,560,3);
  place('order',t,20.2,21.3,540,520,-2);
  place('t_color',t,23.15,24.95,540,560,-2);
  place('t_ciencia',t,24.95,25.8,540,560,-5);
  place('t_strip1',t,26.1,27.4,540,560,-3);
  place('t_strip2',t,27.45,28.3,540,560,3);
  place('t_timer',t,28.3,29.95,540,560,-2);
  $('hand').setAttribute('transform',`rotate(${TA*360} 48 48)`);
  {const p=t>=30.95&&t<31.75;const el=$('t_despues');el.style.opacity=p?1:0;el.style.transform=`translateX(${p?lerp(1080,0,eout(seg(t,30.95,31.1)))-(t>31.6?lerp(0,1080,seg(t,31.6,31.75)):0):1080}px)`}
  place('t_ting',t,33.68,35.0,780,560,-10);
  place('t_plus',t,33.9,35.9,260,600,6);
  place('t_antes',t,35.95,38.0,270,560,-4);
  place('t_desp',t,36.1,38.0,810,560,4);
  place('cart',t,38.85,40.45,540,1060,-2,.9);
  {const p=pop(t,38.95,40.45);const el=$('arrow');el.style.opacity=p.o;el.style.left='120px';el.style.top=(1480+Math.sin(TA*10)*24)+'px';el.style.transform=`scale(${p.s}) rotate(18deg)`;}
  place('t_novayas',t,40.45,42.25,540,560,-3,1+.03*Math.sin(TA*14));
  place('b_bolsa2',t,43.7,44.9,800,560,-2);
  {const el=$('note');const vis=t>=46.1&&t<47.4;el.style.display=vis?'':'none';if(vis){const k=eio(seg(t,46.1,46.6));el.style.opacity=1;
    const x=lerp(760,330,k),y=lerp(820,900,k)-Math.sin(k*Math.PI)*160;el.style.left=(x-el.offsetWidth/2)+'px';el.style.top=y+'px';el.style.transform=`rotate(${lerp(-20,8,k)}deg) scale(${lerp(.6,1.1,k)})`}}
  place('t_num',t,46.6,47.4,540,560,-3);
  {const el=$('phone');const vis=t>=47.45&&t<49.85;el.style.display=vis?'':'none';if(vis){const k=eout(seg(t,47.45,47.75));el.style.opacity=k;el.style.transform=`scale(${(.8+.2*k)*(t>48.5?1+.06*eout(seg(t,48.5,48.8)):1)})`;
    $('typing').style.display=t<48.5?'flex':'none';$('msg').style.opacity=t>=48.5?1:0;
    [...document.querySelectorAll('.dot')].forEach((d,i)=>d.style.transform=`translateY(${-Math.abs(Math.sin(TA*8+i))*10}px)`)}}
  const vs=t>=49.85;$('vote').style.display=vs?'block':'none';
  if(vs){
    {const p=pop(t,49.9,99);$('v_q').style.opacity=p.o;$('v_q').style.transform=`scale(${p.s}) rotate(-2deg)`}
    [['v1',51.25],['v2',52.0],['v3',52.85]].forEach(([id,a],i)=>{const p=pop(t,a,99);const el=$(id);el.style.opacity=p.o;
      const hl=t>=a&&t<a+.8?1.06:1;el.style.transform=`scale(${p.s*hl}) rotate(${[-4,0,4][i]+Math.sin(TA*3+i)*1.5}deg)`});
    place('v_btn',t,53.55,99,540,1105,0,1+.04*Math.sin(TA*8));
    place('v_sig',t,54.7,99,540,1395,0);
    $('v_dani').innerHTML=`<g transform="translate(540,${lerp(2500,2170,eout(seg(t,50.1,50.7)))}) scale(.72)">${dani({expr:'grin',arms:'wave',teeth:WHT,shine:1,mouth,t:TA})}</g>`;
  }
  caption(tn);
  $('flash').style.opacity=[9.58,10.55,33.68,42.3,49.85,35.9].reduce((m,a)=>Math.max(m,t>=a&&t<a+.25?.8*(1-seg(t,a,a+.25)):0),0);
}
window.render=render;render(0);
