import numpy as np, wave, subprocess, sys
SR=44100
import json,os
WJ=json.load(open('build/warp.json')) if os.path.exists('build/warp.json') else {'WARP':[[0,9999,0,9999]],'T':53.5}
def S2W(ts):
    for n0,n1,s0,s1 in WJ['WARP']:
        if s0<=ts<s1: return n0+(ts-s0)*(n1-n0)/(s1-s0)
    return ts
T=WJ['T']; N=int(SR*T)
def load(p):
    if p.endswith('.mp3'):
        raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
        return np.frombuffer(raw,np.int16).reshape(-1,2)/32768
    w=wave.open(p);c=w.getnchannels();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,c)/32768;return np.repeat(x,2,1) if c==1 else x
mix=np.zeros((N,2))
def add(x,t,g=1.0):
    i=int(t*SR); j=min(N,i+len(x)); mix[i:j]+=x[:j-i]*g
voz=load('assets/voz_final.wav' if os.path.exists('assets/voz_final.wav') else 'assets/voz.mp3')
G_VOZ,G_SFX,G_MUS,G_MUS_VOTE,G_BUZZ=1.0,0.32,0.055,0.08,0.07
# compresión suave de la voz para que se entienda siempre
def comp(x,th=0.18,ratio=3.0):
    a=np.abs(x).max(1); env=np.convolve(a,np.ones(441)/441,'same')
    g=np.where(env>th,(th+(env-th)/ratio)/np.maximum(env,1e-9),1.0); return x*g[:,None]
voz=comp(voz); voz=voz/np.abs(voz).max()*0.9
vmix=np.zeros((N,2)); vmix[:min(N,len(voz))]=voz[:N]
venv=np.convolve(np.abs(vmix[:,0]),np.ones(4410)/4410,'same'); duck=1-0.55*np.clip(venv/0.05,0,1)
# música con ducking
m=load('sfx/music.wav')[:N]; env=np.full(N,G_MUS); tt=np.arange(N)/SR
env[(tt>=S2W(42.8))&(tt<S2W(45.7))]=0.0
env[tt>=S2W(45.7)]=G_MUS_VOTE
env*=np.clip((T-tt)/1.0,0,1)*np.clip(tt/0.3,0,1)
mix[:len(m)]+=m*(env*duck)[:len(m),None]
# zumbido moscas
b=load('sfx/buzz.wav'); bz=np.tile(b,(12,1))[:int(SR*S2W(30))]
fade=np.ones(len(bz)); s0=int(SR*S2W(28.85)); fade[s0:]=np.linspace(1,0,len(bz)-s0)
fade[int(SR*S2W(25.6)):int(SR*S2W(27.6))]*=0.4
add(bz*(fade*duck[:len(fade)])[:,None],0,G_BUZZ)
S={k:load(f'sfx/{k}.wav') for k in ['whoosh','pop','ting','sparkle','spray','notif','cash','boom','scratch','boing','tick']}
ev=[(0.1,'pop',.7),(0.45,'whoosh',.5),(2.6,'whoosh',.5),(4.3,'boing',.6),(5.6,'whoosh',.6),(5.75,'notif',.7),(7.15,'whoosh',.6),
(8.13,'boom',.8),(9.2,'boom',.9),(11.2,'pop',.6),(12.85,'pop',.6),(15.62,'scratch',.6),(16.3,'whoosh',.5),(18.15,'sparkle',.6),(18.15,'pop',.5),
(19.9,'whoosh',.5),(21.3,'tick',.8),(22.0,'cash',.7),(22.7,'sparkle',.5),(24.3,'spray',.8),(25.0,'pop',.5),(27.6,'spray',.8),(28.85,'whoosh',.7),
(28.95,'pop',.5),(29.9,'pop',.5),(30.9,'whoosh',.6),(33.0,'ting',.9),(33.0,'sparkle',.6),(33.25,'pop',.6),(34.5,'pop',.6),(37.1,'whoosh',.4),
(37.9,'pop',.6),(39.65,'pop',.6),(40.6,'scratch',.5),(43.1,'whoosh',.5),(44.1,'boom',.9),(45.7,'whoosh',.6),(45.75,'pop',.6),(47.15,'pop',.7),
(48.05,'pop',.7),(48.9,'pop',.7),(49.6,'ting',.6),(50.85,'pop',.6)]
fx=np.zeros((N,2))
for t,k,g in ev:
    i=int(S2W(t)*SR); x=S[k]; j=min(N,i+len(x)); fx[i:j]+=x[:j-i]*g*G_SFX
fx*=(0.5+0.5*duck)[:,None]
mix+=fx; mix+=vmix*G_VOZ
mix/=max(1,np.abs(mix).max()/0.95)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
