# Sintetiza efectos de sonido y música de fondo (sin dependencias externas salvo numpy)
import numpy as np, wave, sys, os
SR=44100
out=sys.argv[1]
def save(name,x):
    x=np.clip(x,-1,1); x=(x*32767*0.9).astype(np.int16)
    if x.ndim==1: x=np.stack([x,x],1)
    w=wave.open(os.path.join(out,name+'.wav'),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x.tobytes()); w.close()
t=lambda d: np.arange(int(SR*d))/SR
rng=np.random.default_rng(1)
def env(n,a=0.005,r=None):
    e=np.ones(n); na=int(SR*a); e[:na]=np.linspace(0,1,na)
    if r: e*=np.exp(-np.arange(n)/SR/r)
    return e
def lp(x,k): # simple moving average lowpass
    return np.convolve(x,np.ones(k)/k,'same')
# whoosh
d=0.45; n=rng.standard_normal(int(SR*d)); s=np.sin(np.linspace(0,np.pi,len(n)))**2
w=np.zeros_like(n)
for i,k in enumerate([40,20,10,6]):
    seg=slice(i*len(n)//4,(i+1)*len(n)//4); w[seg]=lp(n,k)[seg]
save('whoosh',w*s*1.6)
# pop
tt=t(0.12); f=900*np.exp(-tt*25)+300; save('pop',np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*35))
# ting (brillo)
tt=t(1.4); x=sum(a*np.sin(2*np.pi*f*tt) for f,a in [(2093,1),(4186,.5),(3136,.35),(6272,.15)])*np.exp(-tt*3.5)*env(len(tt),0.002)
save('ting',x*0.5)
# sparkle (cascada de tintineos)
x=np.zeros(int(SR*1.2))
for i,f in enumerate([1568,2093,2637,3136,4186,3520,5274]):
    st=int(SR*i*0.07); tt=t(0.5); x[st:st+len(tt)]+=np.sin(2*np.pi*f*tt)*np.exp(-tt*9)*0.35
save('sparkle',x)
# spray (aerosol)
d=0.7; n=rng.standard_normal(int(SR*d)); hp=n-lp(n,4); e=env(len(n),0.02); e[-int(SR*.15):]*=np.linspace(1,0,int(SR*.15))
save('spray',hp*e*0.6)
# moscas zumbando (loop 4s)
tt=t(4.0); f=210+18*np.sin(2*np.pi*3.1*tt)+9*np.sin(2*np.pi*7.3*tt); ph=np.cumsum(f)/SR
saw=2*(ph%1)-1; f2=240+22*np.sin(2*np.pi*2.3*tt+1); saw2=2*((np.cumsum(f2)/SR)%1)-1
am=0.6+0.4*np.sin(2*np.pi*0.7*tt)
save('buzz',lp(saw*0.5+saw2*0.4,6)*am*0.35)
# notificación móvil
x=np.zeros(int(SR*0.6))
for st,f in [(0,1318),(0.12,1760)]:
    tt=t(0.4); i=int(SR*st); x[i:i+len(tt)]+=np.sin(2*np.pi*f*tt)*np.exp(-tt*10)*0.6
save('notif',x)
# caja registradora
x=np.zeros(int(SR*0.9)); tt=t(0.08); x[:len(tt)]+=rng.standard_normal(len(tt))*np.exp(-tt*60)*0.5
tt=t(0.8); i=int(SR*0.08); x[i:i+len(tt)]+=(np.sin(2*np.pi*2637*tt)+0.6*np.sin(2*np.pi*3951*tt))*np.exp(-tt*5)*0.4
save('cash',x)
# golpe dramático (boom)
tt=t(1.0); f=120*np.exp(-tt*4)+40; x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*3.5)
x+=lp(rng.standard_normal(len(tt)),30)*np.exp(-tt*8)*0.6
save('boom',x*0.9)
# record scratch / disco rayado
tt=t(0.5); f=600+500*np.sin(2*np.pi*6*tt); x=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.25+lp(rng.standard_normal(len(tt)),3)*0.3
save('scratch',x*np.exp(-tt*4))
# boing (mosca cae)
tt=t(0.6); f=400+250*np.sin(2*np.pi*9*tt)*np.exp(-tt*3)-200*tt; save('boing',np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*4)*0.7)
# tick reloj / texto
tt=t(0.04); save('tick',rng.standard_normal(len(tt))*np.exp(-tt*150)*0.6)
# gasp de multitud (aaah) suave
# música: loop alegre/cómico 100 bpm, 64 s
bpm=104; beat=60/bpm; L=int(SR*66); m=np.zeros(L)
def note(f,d,kind='pluck',a=1):
    tt=t(d)
    if kind=='pluck': return (np.sin(2*np.pi*f*tt)+0.3*np.sin(4*np.pi*f*tt))*np.exp(-tt*6)*a
    if kind=='bass': return (np.sin(2*np.pi*f*tt)+0.2*np.sin(4*np.pi*f*tt))*np.minimum(1,tt*200)*np.exp(-tt*3)*a
def add(i,x):
    j=min(L,i+len(x)); m[i:j]+=x[:j-i]
prog=[(261.6,[261.6,329.6,392]),(220,[220,261.6,329.6]),(174.6,[174.6,220,261.6]),(196,[196,246.9,293.7])]
nb=int(66/beat)
for b in range(nb):
    i=int(b*beat*SR); bar=(b//4)%4; root,ch=prog[bar]
    # kick
    if b%2==0:
        tt=t(0.25); fk=100*np.exp(-tt*30)+45; add(i,np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tt*12)*0.9)
    else:
        tt=t(0.15); add(i,lp(rng.standard_normal(len(tt)),2)*np.exp(-tt*25)*0.35)  # snare
    # hats
    for h in (0,0.5):
        tt=t(0.05); n=rng.standard_normal(len(tt)); add(i+int(h*beat*SR),(n-lp(n,3))*np.exp(-tt*80)*0.15)
    add(i,note(root/2,beat*0.9,'bass',0.55))
    # pluck arpegio
    for k in range(2):
        f=ch[(b*2+k)%3]*2; add(i+int(k*beat/2*SR),note(f,beat*0.6,'pluck',0.18))
m=m/np.abs(m).max()*0.8
save('music',m)
print('ok')
