import numpy as np, wave, subprocess, sys
SR=44100; T=53.5; N=int(SR*T)
def load(p):
    if p.endswith('.mp3'):
        raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
        return np.frombuffer(raw,np.int16).reshape(-1,2)/32768
    w=wave.open(p);x=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2)/32768;return x
mix=np.zeros((N,2))
def add(x,t,g=1.0):
    i=int(t*SR); j=min(N,i+len(x)); mix[i:j]+=x[:j-i]*g
voz=load('assets/voz.mp3'); add(voz,0,1.0)
# música con ducking
m=load('sfx/music.wav')[:N]; env=np.full(N,0.10); tt=np.arange(N)/SR
env[(tt>=42.8)&(tt<45.7)]=0.0
env[tt>=45.7]=0.15
env*=np.clip((T-tt)/1.0,0,1)*np.clip(tt/0.3,0,1)
mix[:len(m)]+=m*env[:len(m),None]
# zumbido moscas
b=load('sfx/buzz.wav'); bz=np.tile(b,(9,1))[:int(SR*30)]
fade=np.ones(len(bz)); s0=int(SR*28.85); fade[s0:]=np.linspace(1,0,len(bz)-s0)
fade[int(SR*25.6):int(SR*27.6)]*=0.4
add(bz*fade[:,None],0,0.22)
S={k:load(f'sfx/{k}.wav') for k in ['whoosh','pop','ting','sparkle','spray','notif','cash','boom','scratch','boing','tick']}
ev=[(0.1,'pop',.7),(0.45,'whoosh',.5),(2.6,'whoosh',.5),(4.3,'boing',.6),(5.6,'whoosh',.6),(5.75,'notif',.7),(7.15,'whoosh',.6),
(8.13,'boom',.8),(9.2,'boom',.9),(11.2,'pop',.6),(12.85,'pop',.6),(15.62,'scratch',.6),(16.3,'whoosh',.5),(18.15,'sparkle',.6),(18.15,'pop',.5),
(19.9,'whoosh',.5),(21.3,'tick',.8),(22.0,'cash',.7),(22.7,'sparkle',.5),(24.3,'spray',.8),(25.0,'pop',.5),(27.6,'spray',.8),(28.85,'whoosh',.7),
(28.95,'pop',.5),(29.9,'pop',.5),(30.9,'whoosh',.6),(33.0,'ting',.9),(33.0,'sparkle',.6),(33.25,'pop',.6),(34.5,'pop',.6),(37.1,'whoosh',.4),
(37.9,'pop',.6),(39.65,'pop',.6),(40.6,'scratch',.5),(43.1,'whoosh',.5),(44.1,'boom',.9),(45.7,'whoosh',.6),(45.75,'pop',.6),(47.15,'pop',.7),
(48.05,'pop',.7),(48.9,'pop',.7),(49.6,'ting',.6),(50.85,'pop',.6)]
for t,k,g in ev: add(S[k],t,g*0.75)
mix/=max(1,np.abs(mix).max()/0.95)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
