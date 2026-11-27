import numpy as np, wave, sys, json
SR=44100
tm=json.load(open('build/timemap.json'))
f=lambda t: float(np.interp(t,tm['o'],tm['n'],left=t+tm['n'][0]-tm['o'][0],right=t+tm['n'][-1]-tm['o'][-1]))
T=float(sys.argv[2]); N=int(SR*T)
def load(p):
    w=wave.open(p);c=w.getnchannels();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,c)/32768
    return np.repeat(x,2,1) if c==1 else x
G_VOZ,G_SFX,G_MUS,G_MUS_VOTE=1.0,0.32,0.055,0.08
voz=load('assets/voz_rec.wav')[:N]
def comp(x,th=0.18,ratio=3.0):
    a=np.abs(x).max(1); env=np.convolve(a,np.ones(441)/441,'same')
    g=np.where(env>th,(th+(env-th)/ratio)/np.maximum(env,1e-9),1.0); return x*g[:,None]
voz=comp(voz); voz=voz/np.abs(voz).max()*0.9
vmix=np.zeros((N,2)); vmix[:len(voz)]=voz
venv=np.convolve(np.abs(vmix[:,0]),np.ones(4410)/4410,'same'); duck=1-0.55*np.clip(venv/0.05,0,1)
mix=np.zeros((N,2)); tt=np.arange(N)/SR
m=load('sfx/music.wav'); m=np.tile(m,(2,1))[:N]
env=np.full(N,G_MUS); env[(tt>=f(47.4))&(tt<f(49.85))]=0; env[tt>=f(49.85)]=G_MUS_VOTE
env*=np.clip((T-tt)/1.0,0,1)*np.clip(tt/0.3,0,1)
mix+=m*(env*duck)[:,None]
S={k:load(f'sfx/{k}.wav') for k in ['whoosh','pop','ting','sparkle','spray','notif','cash','boom','scratch','boing','tick']}
ev=[(0.05,'whoosh',.5),(0.12,'pop',.7),(1.75,'pop',.6),(5.6,'whoosh',.5),(7.9,'pop',.6),(9.58,'whoosh',.5),(9.9,'ting',.8),(10.0,'boom',.7),
(10.6,'scratch',.5),(10.75,'pop',.6),(11.6,'whoosh',.5),(12.3,'pop',.6),(13.92,'boom',.5),(15.0,'pop',.6),(17.4,'whoosh',.5),(18.85,'boing',.7),
(20.2,'notif',.7),(20.35,'cash',.6),(21.3,'sparkle',.5),(23.15,'pop',.6),(24.95,'ting',.6),(26.1,'pop',.7),(27.45,'pop',.7),
(28.3,'tick',.8),(28.8,'tick',.8),(29.3,'tick',.8),(29.8,'tick',.8),(30.95,'whoosh',.6),(31.6,'whoosh',.5),(32.25,'pop',.7),(32.4,'pop',.6),
(33.68,'ting',.9),(33.68,'sparkle',.6),(33.9,'pop',.6),(35.9,'whoosh',.6),(38.85,'pop',.6),(40.45,'whoosh',.5),(41.8,'whoosh',.6),(42.3,'whoosh',.4),
(43.7,'pop',.6),(44.8,'sparkle',.6),(45.0,'scratch',.4),(45.3,'sparkle',.5),(46.1,'whoosh',.5),(46.6,'cash',.6),(47.45,'notif',.7),(47.5,'boom',.8),
(48.5,'notif',.7),(49.85,'whoosh',.6),(49.9,'pop',.6),(51.25,'pop',.7),(52.0,'pop',.7),(52.85,'pop',.7),(53.55,'ting',.6),(54.7,'pop',.6)]
fx=np.zeros((N,2))
for t,k,g in ev:
    i=int(f(t)*SR); x=S[k]; j=min(N,i+len(x)); fx[i:j]+=x[:j-i]*g*G_SFX
fx*=(0.5+0.5*duck)[:,None]
mix+=fx+vmix*G_VOZ
mix/=max(1,np.abs(mix).max()/0.95)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close();print('mix ok')
