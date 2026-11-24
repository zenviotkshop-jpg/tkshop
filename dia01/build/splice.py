"""Empalma las frases nuevas (A: producto, B: carrito) en la voz original.
Uso: python3 splice.py nueva.mp3 nuevas_palabras.txt
nuevas_palabras.txt: 'inicio fin palabra' por línea (tiempos del audio nuevo)."""
import sys, json, subprocess, numpy as np, wave
SR=44100
def load(p):
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(float)/32768
orig=load('../assets/voz.mp3'); new=load(sys.argv[1])
NW=[(float(a),float(b),w) for a,b,w in (l.strip().split(' ',2) for l in open(sys.argv[2],encoding='utf8') if l.strip())]
# frase B empieza en "Y lo mejor"
iB=next(i for i,w in enumerate(NW) if w[2].lower().startswith('y') and i>0 and NW[i-1][2].endswith('.'))
A=(max(0,NW[0][0]-.06), NW[iB-1][1]+.15); B=(NW[iB][0]-.06, NW[-1][1]+.2)
OA=(21.90,24.10); OB=(34.40,36.85); OEND=len(orig)/SR
cut=lambda x,a,b:x[int(a*SR):int(b*SR)]
parts=[cut(orig,0,OA[0]),cut(new,*A),cut(orig,OA[1],OB[0]),cut(new,*B),cut(orig,OB[1],OEND)]
# micro fundidos para evitar clics
for k,p in enumerate(parts):
    f=min(len(p)//4,int(.008*SR)); p=p.copy(); p[:f]*=np.linspace(0,1,f); p[-f:]*=np.linspace(1,0,f); parts[k]=p
voz=np.concatenate(parts)
w=wave.open('../assets/voz_final.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(voz,-1,1)*32767).astype(np.int16).tobytes());w.close()
LA=A[1]-A[0]; LB=B[1]-B[0]
n=[0,OA[0]]; n.append(n[-1]+LA); n.append(n[-1]+(OB[0]-OA[1])); n.append(n[-1]+LB)
WARP=[[0,n[1],0,OA[0]],[n[1],n[2],OA[0],OA[1]],[n[2],n[3],OA[1],OB[0]],[n[3],n[4],OB[0],OB[1]],[n[4],n[4]+999,OB[1],OB[1]+999]]
def S2W(ts):
    for n0,n1,s0,s1 in WARP:
        if s0<=ts<s1: return n0+(ts-s0)*(n1-n0)/(s1-s0)
    return ts
words=[]
for line in open('words.txt',encoding='utf8'):
    a,b,wd=line.strip().split(' ',2);a=float(a);b=float(b)
    if OA[0]<=a<OA[1] or OB[0]<=a<OB[1]: continue
    words.append([round(S2W(a),3),round(S2W(b),3),wd])
for a,b,wd in NW[:iB]: words.append([round(a-A[0]+n[1],3),round(b-A[0]+n[1],3),wd])
for a,b,wd in NW[iB:]: words.append([round(a-B[0]+n[3],3),round(b-B[0]+n[3],3),wd])
words.sort()
fps=30;hop=SR//fps;N=len(voz)//hop;r=np.sqrt((voz[:N*hop].reshape(N,hop)**2).mean(1))
lv=np.clip((20*np.log10(r+1e-6)+42)/26,0,1)
open('data.js','w').write('window.LEVELS='+json.dumps([round(v,2) for v in lv])+';\nwindow.WORDS='+json.dumps(words,ensure_ascii=False)+
  ';\nwindow.WARP='+json.dumps(WARP)+';\nwindow.INS={A:'+json.dumps([n[1],n[2]])+',B:'+json.dumps([n[3],n[4]])+'};\n')
json.dump({'WARP':WARP,'T':S2W(53.5)},open('warp.json','w'))
print('A',round(LA,2),'s  B',round(LB,2),'s  total',round(S2W(53.5),2),'s')
