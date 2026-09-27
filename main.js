const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const page=(location.pathname.split('/').pop()||'index.html');
$$('nav a.l').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('act')});

const L=$$('.lights u');
if(L.length){
  let k=0;
  const iv=setInterval(()=>{
    if(k<5){L[k++].classList.add('on')}
    else{
      clearInterval(iv);
      setTimeout(()=>{
        L.forEach(x=>x.classList.remove('on'));
        $$('.hero').forEach(h=>h.classList.add('go'));
        const t=$('#ltxt');
        if(t) t.textContent='LIGHTS OUT. AND AWAY WE GO.';
      },600);
    }
  },420);
  setTimeout(()=>$$('.hero').forEach(h=>h.classList.add('go')),4200);
}else{
  $$('.hero').forEach(h=>h.classList.add('go'));
}

const cnt=e=>{
  const n=+e.dataset.n,d=+e.dataset.d||0,s=e.dataset.x||'',t=performance.now();
  (function f(x){
    const p=Math.min((x-t)/1800,1),v=n*(1-Math.pow(1-p,3));
    e.textContent=v.toFixed(d)+s;
    if(p<1)requestAnimationFrame(f);
  })(t);
};
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.2});
$$('.rv').forEach(e=>io.observe(e));
const io2=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){cnt(e.target);io2.unobserve(e.target)}
}));
$$('[data-n]').forEach(e=>io2.observe(e));

const trk=$('#trk'),rcE=$('#rc');
if(trk && $('#dot')){
  const len=trk.getTotalLength(),dot=$('#dot'),sec=$('#sec');
  const t0=performance.now();
  const SL=[...Array(20)].map((_,i)=>{
    const e=document.createElement('i');
    e.className=i<8?'':i<14?'q':'z';
    $('#sl')?.append(e);
    return e;
  });
  let last,rt;
  const MSG={
    'THE CIRCUIT':['GREEN FLAG','Track is clear. Lap started.'],
    'SECTOR 1':['PURPLE SECTOR','8.73 CGPA. Fastest split of the lap.'],
    'SECTOR 2':['DRS ENABLED','Cloud data work at speed.'],
    'SECTOR 3':['PODIUM','Project Expo 2024, 3rd place.'],
    'RACE PACE':['FASTEST LAP','Skills trending up.'],
    'NEXT LAP':['STRATEGY UPDATE','Next stint is being planned.'],
    'PIT STOP':['BOX BOX','Pit lane is open. Say hello.'],
    'GARAGE':['BOX BOX','Projects under load. Case files open.'],
    'DRIVER':['RADIO CHECK','Driver profile on the pit wall.'],
    'PADDOCK':['MEDIA PADDOCK','Story craft, not just the model.'],
    'BRIEF':['STRATEGY UPDATE','Pick a job for the crew.'],
    'CASE FILE':['TELEMETRY','Session data from this build.']
  };
  function tick(){
    const t=performance.now()-t0,m=Math.floor(t/60000),s=Math.floor(t/1000)%60,ms=Math.floor(t%1000);
    if($('#lap')) $('#lap').textContent=`${m}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
    requestAnimationFrame(tick);
  }
  tick();
  function upd(){
    const p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const pt=trk.getPointAtLength(p*len);
    dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);
    let c='START';
    $$('[data-s]').forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.5)c=s.dataset.s});
    if(c!==last){
      last=c;
      const q=MSG[c];
      if(q && rcE){
        rcE.innerHTML=`<b>RACE CONTROL · ${q[0]}</b>${q[1]}`;
        rcE.classList.add('s');
        clearTimeout(rt);
        rt=setTimeout(()=>rcE.classList.remove('s'),3800);
      }
    }
    if(sec) sec.textContent=c;
    if($('#gear')) $('#gear').textContent=1+Math.min(7,Math.floor(p*8));
    SL.forEach((e,i)=>e.classList.toggle('on',i<p*20+1));
  }
  addEventListener('scroll',upd,{passive:true});
  upd();
}

const bp=$('#bigp');
if(bp && $('#big')){
  const bl=bp.getTotalLength();
  [[0,'START / FINISH','#top'],[50,'SECTOR 1','#s1'],[150,'SECTOR 2','#s2'],[250,'SECTOR 3','#s3']].forEach(([at,t,h])=>{
    const p=bp.getPointAtLength(at/300*bl),g=document.createElementNS('http://www.w3.org/2000/svg','a'),Lft=p.x<200;
    g.setAttribute('href',h);
    g.innerHTML=`<circle cx="${p.x}" cy="${p.y}" r="7" fill="#fff" stroke="#b3124f" stroke-width="3"><animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/></circle><text class="mt" x="${p.x+(Lft?-14:14)}" y="${p.y+4}" text-anchor="${Lft?'end':'start'}">${t}</text>`;
    $('#big').append(g);
  });
}

if($('#clk')){
  new IntersectionObserver((es,o)=>es.forEach(e=>{
    if(e.isIntersecting){
      o.disconnect();
      const t=performance.now();
      (function f(x){
        const p=Math.min((x-t)/2400,1);
        $('#clk').textContent=(p*2.4).toFixed(2)+'s';
        if(p<1)requestAnimationFrame(f);
      })(t);
    }
  }),{threshold:.6}).observe($('#clk'));
}

const cu=$('#cur'),tr=$('#trail');
let S=[];
if(cu && tr){
  const svg=cu.firstElementChild,tc=tr.getContext('2d'),sp=$('#spd');
  let mx=0,my=0,x=0,y=0,a=0,ta=0,v=0,P=[],go=0,H=0,sv=0,ly=0;
  addEventListener('scroll',()=>{sv=Math.max(sv,Math.min(90,Math.abs(scrollY-ly)));ly=scrollY});
  addEventListener('mousedown',()=>{
    for(let i=0;i<18;i++){
      const r=Math.random()*6.28,q=2+Math.random()*4;
      S.push({x,y,vx:Math.cos(r)*q,vy:Math.sin(r)*q,l:1});
    }
  });
  const rz=()=>{tr.width=innerWidth;tr.height=innerHeight};
  rz();addEventListener('resize',rz);
  addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(!go){go=1;x=mx;y=my;cu.classList.add('on');document.documentElement.classList.add('nc')}
  });
  document.addEventListener('mouseover',e=>{
    H=!!e.target.closest('a,.r,.card,.row,button');
    cu.classList.toggle('h',H);
  });
  (function f(){
    const dx=mx-x,dy=my-y,d=Math.hypot(dx,dy);
    x+=dx*.3;y+=dy*.3;v+=(d-v)*.15;
    if(d>2)ta=Math.atan2(dy,dx)*180/Math.PI+90;
    a+=((((ta-a)%360)+540)%360-180)*.2;
    cu.style.transform=`translate(${x}px,${y}px)`;
    if(svg) svg.style.transform=`rotate(${a}deg)`;
    if(sp) sp.textContent=H?'DRS OPEN':Math.round(v*9)+' KM/H';
    if(go)P.push({x,y,l:1});P=P.filter(p=>(p.l-=.035)>0);
    tc.clearRect(0,0,tr.width,tr.height);tc.lineCap='round';
    for(let i=1;i<P.length;i++){
      tc.strokeStyle=`rgba(179,18,79,${P[i].l*.55})`;
      tc.lineWidth=7*P[i].l;
      tc.beginPath();tc.moveTo(P[i-1].x,P[i-1].y);tc.lineTo(P[i].x,P[i].y);tc.stroke();
    }
    S=S.filter(p=>(p.l-=.03)>0);
    S.forEach(p=>{p.x+=p.vx;p.y+=p.vy;tc.fillStyle=`rgba(255,45,135,${p.l})`;tc.fillRect(p.x,p.y,3,3)});
    if(sv>6){
      tc.lineWidth=1.5;tc.strokeStyle=`rgba(179,18,79,${Math.min(sv/150,.4)})`;
      for(let i=0;i<sv/4;i++){
        const yy=Math.random()*tr.height,xx=Math.random()*tr.width;
        tc.beginPath();tc.moveTo(xx,yy);tc.lineTo(xx+sv*3,yy);tc.stroke();
      }
    }
    sv*=.9;
    requestAnimationFrame(f);
  })();
}

$$('.radio i').forEach(i=>i.insertAdjacentHTML('afterend','<span class="wv"><u></u><u></u><u></u><u></u><u></u></span>'));
const sc=e=>{
  const t=e.textContent,C='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let n=0;
  const q=setInterval(()=>{
    e.textContent=[...t].map((c,i)=>c==' '||i<n?c:C[Math.random()*36|0]).join('');
    if((n+=.8)>t.length){e.textContent=t;clearInterval(q)}
  },35);
};
const so=new IntersectionObserver((es,o)=>es.forEach(e=>{
  if(e.isIntersecting){sc(e.target);o.unobserve(e.target)}
}),{threshold:.6});
$$('.sh h2,.circ h2').forEach(e=>so.observe(e));
if($('#dl')) setInterval(()=>{$('#dl').textContent=(-(Math.random()*.6+.1)).toFixed(3)},500);

const RB=$('#rb'),RR=$('#rr'),LU=$$('.ll u');
if(RB && RR.length!==undefined){
  let st=0,tm=[],t1=0;
  const off=()=>LU.forEach(u=>u.classList.remove('on'));
  RB.onclick=()=>{
    if(st==0){
      st=1;off();RB.textContent='WAIT…';RR.textContent='Lights are coming on…';
      LU.forEach((u,i)=>tm.push(setTimeout(()=>u.classList.add('on'),i*600)));
      tm.push(setTimeout(()=>{off();t1=performance.now();st=2;RB.textContent='GO!'},3200+Math.random()*2000));
    }else if(st==1){
      tm.forEach(clearTimeout);tm=[];st=0;off();RB.textContent='START';
      RR.textContent='Jump start! You pressed before the lights went out. Try again.';
    }else{
      const ms=Math.round(performance.now()-t1);st=0;tm=[];RB.textContent='TRY AGAIN';
      RR.textContent=`Reaction: ${ms} ms. `+(ms<250?'Race-ready. F1 level.':ms<400?'Solid. A points finish.':'Warm up the tyres and go again.');
    }
  };
}

function toast(msg,ms){
  const t=$('#toast');if(!t)return;
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._k);t._k=setTimeout(()=>t.classList.remove('show'),ms);
}
$('#drs')?.addEventListener('click',()=>{
  const fl=$('#flash');
  fl?.classList.add('on');
  setTimeout(()=>fl?.classList.remove('on'),260);
  for(let i=0;i<46;i++){
    const r=Math.random()*6.28,q=3+Math.random()*7;
    S.push({x:innerWidth/2,y:innerHeight*.35,vx:Math.cos(r)*q,vy:Math.sin(r)*q,l:1});
  }
  toast('DRS ACTIVATED · OVERTAKE MODE',1800);
});

$$('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('[data-filter]').forEach(x=>x.classList.remove('on'));
    btn.classList.add('on');
    const f=btn.dataset.filter;
    $$('.project-item').forEach(card=>{
      card.classList.toggle('hide', f!=='all' && card.dataset.category!==f);
    });
  });
});

$$('[data-mail-form]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.querySelector('[name=name]')?.value.trim()||'there';
    const email=form.querySelector('[name=email]')?.value.trim()||'';
    const brief=form.querySelector('[name=brief]')?.value.trim()||'';
    const subject=encodeURIComponent(`Portfolio enquiry — ${name}`);
    const body=encodeURIComponent(`Hi Ananya,\n\n${brief}\n\nReply to: ${email}`);
    window.location.href=`mailto:ananyabhardwaj.tech@gmail.com?subject=${subject}&body=${body}`;
  });
});

const claim=$('#claim'), verdict=$('#verdict'), reason=$('#reason');
$('#verifyBtn')?.addEventListener('click',()=>{
  const text=(claim?.value||'').trim().toLowerCase();
  if(text.includes('earth')&&text.includes('sun')){
    if(verdict) verdict.textContent='SUPPORTED';
    if(reason) reason.textContent='Sample demo: this claim is treated as supported. In the original system, retrieved evidence would be passed into Mistral for the final verdict.';
  }else if(text.includes('2+2')||text.includes('moon is made of cheese')){
    if(verdict) verdict.textContent='REFUTED';
    if(reason) reason.textContent='Sample demo: this claim is treated as refuted. This UI does not call the original model.';
  }else{
    if(verdict) verdict.textContent='UNVERIFIABLE';
    if(reason) reason.textContent='Sample demo: no deterministic evidence is configured for this claim. The full pipeline would retrieve evidence first.';
  }
});
$('#sampleBtn')?.addEventListener('click',()=>{if(claim) claim.value='The Earth orbits the Sun.';});

const pet=$('#petType'), petResult=$('#petResult'), petText=$('#petText');
pet?.addEventListener('change',()=>{
  const map={
    'Sample Pet Image A':['CLASS 12','Confidence 94% · recommendation layer ready for Gemini enrichment.'],
    'Sample Pet Image B':['CLASS 27','Confidence 91% · model output ready for allergy-context generation.'],
    'Sample Pet Image C':['CLASS 04','Confidence 89% · secondary explanation layer available.']
  };
  const hit=map[pet.value];
  if(hit){if(petResult) petResult.textContent=hit[0];if(petText) petText.textContent=hit[1];}
});

const d=$('#dist'),s=$('#stops'),l=$('#lead'),c=$('#cabin'),band=$('#priceBand');
function runFlight(){
  if(!d||!band) return;
  const base=5800+Number(d.value)*48-Number(l.value)*24+Number(s.value)*850;
  const low=Math.max(2200,base*Number(c.value));
  const hi=low+1700+Number(s.value)*300;
  band.textContent=`₹${(low/1000).toFixed(1)}K–₹${(hi/1000).toFixed(1)}K`;
  if($('#dOut')) $('#dOut').textContent=d.value;
  if($('#sOut')) $('#sOut').textContent=s.value;
  if($('#lOut')) $('#lOut').textContent=l.value+'D';
}
if(d) [d,s,l,c].forEach(x=>x.addEventListener('input',runFlight));
runFlight();