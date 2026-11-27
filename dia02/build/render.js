const {chromium}=require('playwright');
(async()=>{const out=process.argv[2],T=+process.argv[3],FPS=30;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>document.fonts.ready);
const N=Math.round(T*FPS);
for(let i=+(process.argv[4]||0);i<N;i++){await p.evaluate(t=>render(t),i/FPS);
 await p.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});
 if(i%300==0)console.log(i,'/',N)}
await b.close()})();
