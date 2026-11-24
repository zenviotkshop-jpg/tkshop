p='index.html';s=open(p).read()
def R(a,b,cnt=1):
    global s
    n=s.count(a); assert n==cnt,(n,a[:70]); s=s.replace(a,b)
R("""function bottle(x,y,rot=0,s=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <rect x="-14" y="-118" width="28" height="26" rx="5" fill="#d9d9e3" stroke="${OL}" stroke-width="6"/><rect x="-22" y="-96" width="44" height="22" rx="6" fill="#e6b422" stroke="${OL}" stroke-width="6"/>
  <path d="M-50 -74h100c10 0 16 8 16 18v80c0 14-10 24-24 24h-84c-14 0-24-10-24-24v-80c0-10 6-18 16-18z" fill="#ff8fc0" stroke="${OL}" stroke-width="8"/>
  <path d="M-34 -58v66" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/><rect x="-24" y="-20" width="48" height="30" rx="6" fill="#fff" opacity=".9"/></g>`}""",
"""function bottle(x,y,rot=0,s=1){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <rect x="-48" y="-150" width="96" height="76" rx="10" fill="#f4efe6" stroke="${OL}" stroke-width="7"/>
  <path d="M-36 -138l30 30M-18 -144l40 40M4 -144l34 34M-40 -116l22 22" stroke="#c9bfae" stroke-width="7" stroke-linecap="round"/>
  <rect x="-56" y="-76" width="112" height="106" rx="12" fill="#a8461c" stroke="${OL}" stroke-width="8"/>
  <path d="M-46 -60l36 36M-30 -66l50 50M-8 -66l52 52M-46 -30l30 30" stroke="#c96a2c" stroke-width="7" stroke-linecap="round"/>
  <path d="M-44 -66v80" stroke="#ffd29a" stroke-width="8" stroke-linecap="round" opacity=".55"/>
  <rect x="-20" y="-24" width="40" height="34" rx="4" fill="#e6b422" stroke="${OL}" stroke-width="4"/><path d="M-12 -12h24M-10 0h20" stroke="#7a5a12" stroke-width="3"/></g>`}""")
R("function render(t){\n","let TA=0;\nconst W2S=tn=>{for(const [n0,n1,s0,s1] of WARP)if(tn>=n0&&tn<n1)return s0+(tn-n0)*(s1-s0)/(n1-n0);const l=WARP[WARP.length-1];return l[3]+(tn-l[1])};\nconst S2W=ts=>{for(const [n0,n1,s0,s1] of WARP)if(ts>=s0&&ts<s1)return n0+(ts-s0)*(n1-n0)/(s1-s0);const l=WARP[WARP.length-1];return l[1]+(ts-l[3])};\nconst wt=(w,after=0)=>{const x=WORDS.find(a=>a[0]>=after&&a[2].toLowerCase().replace(/[^a-záéíóúñ]/g,'')===w);return x?x[0]:-1};\nfunction render(tn){\n  const t=W2S(tn);TA=tn;\n")
R("const mouth=lvl(t);","const mouth=lvl(tn);")
R("const blink=(expr==='tired'||expr==='determined'||expr==='shock')&&((t%3.3)<.12);","const blink=(expr==='tired'||expr==='determined'||expr==='shock')&&((TA%3.3)<.12);")
R("g+=`<g>${stink(0,-560,st,t)}</g>`;","g+=`<g>${stink(0,-560,st,TA)}</g>`;")
R("s+=danify(540,1600,1.05,stinkA,0,{expr,arms,mouth,blink,tilt,look,t,rays:t>=22.7&&t<24.1});","s+=danify(540,1600,1.05,stinkA,0,{expr,arms,mouth,blink,tilt,look,t:TA,rays:tn>=INS.A[0]+.6&&tn<INS.A[1]});")
R("${stink(0,-560,.55*seg(t,29.4,30.2),t,'#ff9ccc')}","${stink(0,-560,.55*seg(t,29.4,30.2),TA,'#ff9ccc')}")
R("if(t>=33.0&&t<36.8)s+=sparkles(540,940,t,9,330);","if(t>=33.0&&t<36.8)s+=sparkles(540,940,TA,9,330);")
R("const ph=i*1.31;let x=540+Math.cos(t*(2.1+i*.37)+ph)*(200+i*30), y=880+Math.sin(t*(2.9+i*.23)+ph*2)*(140+i*22)+ (i%2?120:-40);",
  "const ph=i*1.31;let x=540+Math.cos(TA*(2.1+i*.37)+ph)*(200+i*30), y=880+Math.sin(TA*(2.9+i*.23)+ph*2)*(140+i*22)+ (i%2?120:-40);")
R("const tf=25.6;","const tf=S2W(25.6);",2)
R("s+=fly(x,y,sc,t,ph,dead);","s+=fly(x,y,sc,TA,ph,dead);")
R("${stink(0,-560,1,t)}${dani({expr:'tired',arms:'down',mouth:0,blink:(t%2)<.1})}","${stink(0,-560,1,TA)}${dani({expr:'tired',arms:'down',mouth:0,blink:(TA%2)<.1})}")
R("${[0,1,2,3].map(i=>fly(270+Math.cos(t*3+i*1.6)*180,900+Math.sin(t*4+i)*120,1.2,t,i)).join('')}","${[0,1,2,3].map(i=>fly(270+Math.cos(TA*3+i*1.6)*180,900+Math.sin(TA*4+i)*120,1.2,TA,i)).join('')}")
R("${stink(0,-560,.6,t,'#ff9ccc')}${dani({expr:'happy',arms:'up',mouth:.3,t})}</g>${sparkles(810,950,t,7,240)}","${stink(0,-560,.6,TA,'#ff9ccc')}${dani({expr:'happy',arms:'up',mouth:.3,t:TA})}</g>${sparkles(810,950,TA,7,240)}")
R("${dani({expr:'happy',arms:'wave',mouth:lvl(t),t})}","${dani({expr:'happy',arms:'wave',mouth:lvl(tn),t:TA})}")
R("caption(t);","caption(tn);")
R("el.style.top=(1480+Math.sin(t*10)*24)+'px';","el.style.top=(1480+Math.sin(TA*10)*24)+'px';")
R("""place('order',t,22.0,24.1,540,470,-2);""","""const hu=wt('huele',INS.A[0]);
  place('order',tn,INS.A[0]+.08,hu>0?hu-.1:INS.A[1],540,470,-2);
  place('prod',tn,hu>0?hu-.05:INS.A[1],INS.A[1]-.05,540,560,1.5);
  {const v=wt('vainilla',INS.A[0]),c=wt('canela',INS.A[0]);const pv=pop(tn,v,INS.A[1]-.05),pc=pop(tn,c,INS.A[1]-.05);
   $('n_vai').style.transform=`scale(${pv.s})`;$('n_vai').style.opacity=pv.o;$('n_can').style.transform=`scale(${pc.s})`;$('n_can').style.opacity=pc.o;}""")
R("""place('cart',t,34.5,36.8,540,520,-2);
  {const p=pop(t,34.7,36.8);""","""const no=wt('noche',INS.B[0]),cr=wt('carrito',INS.B[0]);
  place('t_dura',tn,no>0?no-.1:INS.B[0],cr>0?cr-.3:INS.B[1],540,470,-3);
  place('cart',tn,cr>0?cr-.3:INS.B[0],INS.B[1]+.05,540,520,-2);
  {const p=pop(tn,cr>0?cr-.15:INS.B[0],INS.B[1]+.05);""")
R("""<div style="width:110px;height:110px;border-radius:26px;background:#14101f;display:flex;align-items:center;justify-content:center"><svg width="70" height="70" viewBox="0 0 70 70"><path d="M8 18h8l8 32h32l7-24H22" fill="none" stroke="#ff7a1a" stroke-width="7" stroke-linejoin="round"/><circle cx="28" cy="60" r="6" fill="#ff7a1a"/><circle cx="52" cy="60" r="6" fill="#ff7a1a"/></svg></div>""",
"""<img src="../assets/khamrah.jpg" style="width:130px;height:112px;object-fit:cover;border-radius:20px;border:4px solid #14101f">""")
R("""<div id="precio" style="font-weight:900;font-size:48px;color:#ff4757"></div>""","""<div style="text-align:right"><div id="precio" style="font-weight:900;font-size:44px;color:#14101f"></div><div style="font-weight:800;font-size:24px;color:#20b26b">Envío gratis</div></div>""")
R("""<div id="t_ting" ""","""<div id="prod" class="abs card" style="width:760px;opacity:0;padding:22px 22px 26px;text-align:center">
    <img src="../assets/khamrah.jpg" style="width:700px;height:500px;object-fit:contain;display:block;margin:0 auto">
    <div style="font-weight:900;font-size:56px;color:#14101f;margin-top:6px">Khamrah · Lattafa</div>
    <div style="display:flex;gap:18px;justify-content:center;margin-top:14px">
      <div id="n_vai" class="pill" style="background:#ffe7b3;color:#7a4a12;font-size:40px;padding:10px 30px;box-shadow:none;border-width:5px">VAINILLA</div>
      <div id="n_can" class="pill" style="background:#c96a2c;color:#fff;font-size:40px;padding:10px 30px;box-shadow:none;border-width:5px">CANELA</div></div>
  </div>
  <div id="t_dura" class="abs tag" style="background:#7a4fd6;opacity:0;font-size:54px;text-align:center;line-height:1.05">SIGUE OLIENDO<br>POR LA NOCHE</div>
  <div id="t_ting" """)
R("const CONFIG={producto:'Perfume', precio:''};","const CONFIG={producto:'Khamrah · Lattafa', precio:'25,99 €'};")
open(p,'w').write(s); print('patched')
