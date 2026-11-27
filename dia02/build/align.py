import sys,wave,numpy as np
w=wave.open(sys.argv[1]);sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16)/32768
H=sr//100;n=len(x)//H;e=np.sqrt((x[:n*H].reshape(n,H)**2).mean(1));db=20*np.log10(e+1e-6)
new=np.clip((db+45)/25,0,1)
words=[(float(a),float(b),t) for a,b,t in (l.strip().split(' ',2) for l in open('build/words.txt',encoding='utf8'))]
tags=[(10.88,11.52),(33.16,33.52),(35.12,35.6)]
m=int(57*100);orig=np.zeros(m)
for a,b,_ in words: orig[int(a*100):int(b*100)+1]=1
for a,b in tags: orig[int(a*100):int(b*100)]=.6
k=np.ones(5)/5;orig=np.convolve(orig,k,'same');new=np.convolve(new,k,'same')
N,M=len(orig),len(new);band=150;INF=1e9
D=np.full((N+1,M+1),INF,dtype=np.float32);D[0,0]=0
P=np.zeros((N+1,M+1),dtype=np.int8)
off=40
for i in range(1,N+1):
    c=int(i*M/N)+off;lo=max(1,c-band);hi=min(M,c+band)
    cost=np.abs(orig[i-1]-new[lo-1:hi])
    for j in range(lo,hi+1):
        a=D[i-1,j-1];b=D[i-1,j]+0.3;cc=D[i,j-1]+0.3
        if a<=b and a<=cc: D[i,j]=cost[j-lo]+a;P[i,j]=0
        elif b<=cc: D[i,j]=cost[j-lo]+b;P[i,j]=1
        else: D[i,j]=cost[j-lo]+cc;P[i,j]=2
i,j=N,int(np.argmin(D[N,:]));mp=np.zeros(N+1)
while i>0 and j>0:
    mp[i]=j;p=P[i,j]
    if p==0:i-=1;j-=1
    elif p==1:i-=1
    else:j-=1
f=lambda t: mp[min(N,max(1,int(round(t*100))))]/100
out=open('build/words_rec.txt','w')
for a,b,t in words: out.write(f'{f(a):.2f} {max(f(b),f(a)+0.05):.2f} {t}\n')
out.close()
print('offsets sample:',[(t,round(f(a)-a,2)) for a,b,t in words[::15]])
