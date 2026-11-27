const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>document.fonts.ready);
const ts=process.argv.slice(3).map(Number);
for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${process.argv[2]}/s_${t.toFixed(2)}.jpg`,type:'jpeg',quality:70});}
await b.close()})();
