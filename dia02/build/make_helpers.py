s=open('dia01/build/index.html').read()
a=s.index('const $=id=>document.getElementById(id);'); b=s.index('// ---------- RENDER ----------')
h=s[a:b]
css=s[s.index('<style>'):s.index('</style>')+8]
def R(x,y,c=1):
    global h; assert h.count(x)==c,(h.count(x),x[:60]); h=h.replace(x,y)
R("const m=o.mouth||0, ex=o.expr||'tired', arms=o.arms||'down';","const m=o.mouth||0, ex=o.expr||'tired', arms=o.arms||'down', TC=o.teeth||'#e0b53a';")
R('fill="#e8c84a"/>`;\n  }else{','fill="${TC}"/>`;\n  }else if(ex===\'grin\'){\n    s+=grinMouth(o,TC,my);\n  }else{')
R('fill="#e8c84a" stroke="${OL}" stroke-width="3"/>','fill="${TC}" stroke="${OL}" stroke-width="3"/>')
R("const lid=ex==='determined'?.42:.55;","const lid=ex==='determined'?.42:ex==='grin'?.2:.55;")
R("if(arms==='spray'||arms==='hold')s+=hand(...ra[2]);","if(arms==='spray'||arms==='hold')s+=hand(...ra[2]);\n  if(o.glint)s+=`<circle cx=\"0\" cy=\"-560\" r=\"${120+60*o.glint}\" fill=\"#ffe45c\" opacity=\"${.45*o.glint}\"/>`+[0,1,2,3,4,5].map(i=>`<path transform=\"translate(0,-560) rotate(${i*60+o.glint*40})\" d=\"M-10 0L0 -${150+120*o.glint}L10 0Z\" fill=\"#ffe45c\" opacity=\"${.8*o.glint}\"/>`).join('');\n  s+='</g>';")
R("bot=(o.rays?rays(150,-540,o.t):'')+bottle(150,-520,0,1.45)}","bot=(o.rays?rays(150,-540,o.t):'')+(o.item==='box'?stripbox(150,-540,1.05):bottle(150,-520,0,1.45))}")

# --- más movimiento y boca más expresiva ---
R('s+=`<ellipse cx="0" cy="0" rx="210" ry="30" fill="#000" opacity=".25"/>`;','s+=`<ellipse cx="0" cy="0" rx="210" ry="30" fill="#000" opacity=".25"/>`;\n  const _t=o.t||0,_k=o.mouth||0;\n  s+=`<g transform="rotate(${Math.sin(_t*1.6)*1.8} 0 -60) translate(0,${-Math.abs(Math.sin(_t*5.5))*_k*14})">`;')
R("s+=`<g transform=\"translate(0,${hy}) rotate(${o.tilt||0})\">`;","s+=`<g transform=\"translate(0,${hy}) rotate(${(o.tilt||0)+Math.sin(_t*2.3)*2.5+Math.sin(_t*9)*_k*4})\">`;")
R("const h=6+op*58, w=ex==='shock'?40:52;","const h=6+op*78, w=ex==='shock'?40:56;")
R("s+=`<path d=\"M-70 ${my-14}Q0 ${my+70+m*20} 70 ${my-14}Z\"","s+=`<path d=\"M-70 ${my-14}Q0 ${my+62+m*55} 70 ${my-14}Z\"")
h+=open('dia02/build/_extra.js').read()
R("const KEY=['espera...',","const KEY=['dientes.','dientes','queso','curado.','tiras','blanqueadoras','moradas.','morado','amarillo...','ciencia.','arriba...','abajo...','treinta','minutos','dientes!?','pantalla','carrito','naranja,','vayáis,','súper.','cajera.','número.','mensaje','pelo,','granos...','ropa?','encuesta.','tres!','bolsa.','contenedor...','espera...',")
R("const RED=['ex...',","const RED=['sonreído.','ex?','Espera...','queso','curado.','ex...',")
open('dia02/build/_helpers.js','w').write(h); open('dia02/build/_style.css','w').write(css); print('helpers',len(h))
