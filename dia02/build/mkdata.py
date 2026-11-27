import json,sys,subprocess,numpy as np
words=[[float(a),float(b),w] for a,b,w in (l.strip().split(' ',2) for l in open(sys.argv[2] if len(sys.argv)>2 else 'words.txt',encoding='utf8') if l.strip())]
fps=30;T=58.3;N=int(T*fps)
if len(sys.argv)>1:
    raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar','24000','-f','s16le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,np.int16)/32768;hop=24000//fps;n=len(x)//hop;r=np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1))
    lv=list(np.clip((20*np.log10(r+1e-6)+42)/26,0,1))
else:
    lv=[0.0]*N
    for a,b,w in words:
        for i in range(int(a*fps),int(b*fps)+1): lv[i]=0.45+0.4*abs(np.sin(i*1.7))
open('data.js','w').write('window.LEVELS='+json.dumps([round(float(v),2) for v in lv])+';\nwindow.WORDS='+json.dumps(words,ensure_ascii=False)+';')
print('data ok',len(lv))
