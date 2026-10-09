/* F1 upgrade v5 — nose-accurate car cursor, NITRO (hold), ghost car, glitch 24, DRS autopilot lap */
(()=>{
const B=document.body,RM=matchMedia('(prefers-reduced-motion:reduce)').matches,R=(m,n)=>m+Math.random()*(n-m);
/* ghost 24 + glitch bursts */
const gh=document.createElement('div');gh.id='f1-ghost';gh.textContent='24';gh.dataset.t='24';B.prepend(gh);
addEventListener('scroll',()=>{gh.style.transform=`translateY(${-scrollY*.07}px) skewX(-6deg)`},{passive:true});
if(!RM)(function gl(){gh.classList.add('gl');setTimeout(()=>gh.classList.remove('gl'),B.classList.contains('drs')?900:480);
 setTimeout(gl,B.classList.contains('drs')?700:R(2200,5200))})();

if(matchMedia('(pointer:fine)').matches){
 const c=new Image();c.id='f1-cursor';c.src='assets/cursor.png';B.append(c);
 const fx=document.createElement('canvas');fx.id='f1-fx';B.append(fx);const g=fx.getContext('2d');
 let W,H,D;const size=()=>{D=devicePixelRatio||1;W=innerWidth;H=innerHeight;fx.width=W*D;fx.height=H*D;g.setTransform(D,0,0,D,0,0)};
 addEventListener('resize',size);size();
 let tx=-99,ty=-99,x=-99,y=-99,px=0,py=0,a=0,v=0,brake=0,pop=0,nitro=0,down=false,P=[],drew=false,hov=false,lock=0,lw=[null,null],boost=0;
 addEventListener('pointermove',e=>{if(x<0){x=px=e.clientX;y=py=e.clientY}tx=e.clientX;ty=e.clientY;c.style.opacity=1});
 document.addEventListener('mouseleave',()=>{c.style.opacity=0});
 document.addEventListener('mouseover',e=>{hov=!!e.target.closest('a,button,input,select,textarea,.r,.card,.row,.di')});
 const hh=()=>c.offsetHeight||68,ww=()=>c.offsetWidth||26;
 // car NOSE sits exactly on the pointer, so what you aim at is what you click
 function rear(){const r=a*Math.PI/180,nx=Math.sin(r),ny=-Math.cos(r),h=hh();return{nx,ny,x:x-nx*h*.96,y:y-ny*h*.96}}
 function sparks(n,spd){const r=rear();for(let i=0;i<n;i++){const s=R(1.2,3.6)*spd,qx=-r.ny,qy=r.nx,sp=R(-1.1,1.1);
  P.push({k:'s',x:r.x+qx*R(-5,5),y:r.y+qy*R(-5,5),vx:-r.nx*s+qx*sp,vy:-r.ny*s+qy*sp,l:0,m:R(12,24)})}}
 function smoke(n){const r=rear();for(let i=0;i<n;i++)P.push({k:'m',x:r.x+R(-6,6),y:r.y+R(-6,6),vx:R(-1.4,1.4)-r.nx*R(0,1.2),vy:R(-1.4,1.4)-r.ny*R(0,1.2),l:0,m:R(26,40),r0:R(3,6)})}
 function flame(n){const r=rear(),qx=-r.ny,qy=r.nx;for(let i=0;i<n;i++){const s=R(4,9)*(1+nitro),sp=R(-.9,.9);
  P.push({k:'f',x:r.x+qx*R(-3,3),y:r.y+qy*R(-3,3),vx:-r.nx*s+qx*sp,vy:-r.ny*s+qy*sp,l:0,m:R(14,24),r0:R(3,6)})}}
 addEventListener('pointerdown',()=>{down=true;pop=1;boost=22;if(!RM){smoke(4);sparks(8,1.4);flame(14)}});
 addEventListener('pointerup',()=>{if(down&&nitro>.45&&!RM){P.push({k:'r',x,y,l:0,m:30});sparks(26,2.4);smoke(3)}down=false});
 (function loop(){
  x=tx;y=ty;   // zero lag: nose == real pointer
  const mx=x-px,my=y-py,sp=Math.hypot(mx,my);px=x;py=y;
  const pv=v;v+=(sp-v)*.25;
  let turn=0;if(sp>.8){const t=Math.atan2(my,mx)*180/Math.PI+90;turn=((t-a+540)%360)-180;a+=turn*.14}
  brake+=((Math.max(0,Math.min(1,(pv-v)*1.8)))-brake)*.3;pop*=.86;
  if(boost>0)boost--;nitro+=(((down||window.F1T||boost>0)?1:0)-nitro)*.12;
  
  const r=a*Math.PI/180,nx=Math.sin(r),ny=-Math.cos(r),h=hh(),cx=x-nx*h/2+(nitro>.2?R(-1,1)*nitro*1.6:0),cy=y-ny*h/2+(nitro>.2?R(-1,1)*nitro*1.6:0);
  const sx=1+pop*.14,sy=sx+Math.min(.07,v/300)+nitro*.16;
  c.style.transform=`translate(${cx-ww()/2}px,${cy-h/2}px) rotate(${a}deg) scale(${sx},${sy})`;
  c.style.filter=nitro>.05?`drop-shadow(0 0 ${6+nitro*16}px rgba(255,110,40,${.35+nitro*.55}))`:'';
  if(!RM){
   if(v>6)sparks(Math.min(4,(v/9|0)+(Math.random()<.5?1:0)),1);
   if(nitro>.15)flame(Math.ceil(nitro*3));
   if(P.length||brake>.03||drew){
    g.clearRect(0,0,W,H);drew=P.length>0||brake>.03;
    if(brake>.03){const q=rear(),gr=g.createRadialGradient(q.x,q.y,0,q.x,q.y,30);
     gr.addColorStop(0,`rgba(255,40,70,${brake*.65})`);gr.addColorStop(1,'rgba(255,40,70,0)');g.fillStyle=gr;g.beginPath();g.arc(q.x,q.y,30,0,7);g.fill()}
    for(let i=P.length-1;i>=0;i--){const p=P[i];p.l++;const u=p.l/p.m;if(u>=1){P.splice(i,1);continue}
     if(p.k==='s'){p.vx*=.95;p.vy*=.95;g.strokeStyle=`rgba(255,${(215-u*110)|0},${(90-u*70)|0},${1-u})`;g.lineWidth=1.7*(1-u*.5);g.lineCap='round';
      g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*2,p.y-p.vy*2);g.stroke()}
     else if(p.k==='f'){p.vx*=.93;p.vy*=.93;g.globalCompositeOperation='lighter';
      g.fillStyle=u<.3?`rgba(190,225,255,${.9-u})`:`rgba(255,${(150-u*110)|0},${(40-u*30)|0},${.8*(1-u)})`;g.beginPath();g.arc(p.x,p.y,p.r0*(1-u*.6),0,7);g.fill();g.globalCompositeOperation='source-over'}
     else if(p.k==='k'){g.strokeStyle=`rgba(20,10,14,${.4*(1-u)})`;g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(p.px,p.py);g.lineTo(p.x,p.y);g.stroke();continue}
     else if(p.k==='r'){g.strokeStyle=`rgba(255,45,135,${.9*(1-u)})`;g.lineWidth=5*(1-u);g.beginPath();g.arc(p.x,p.y,10+u*170,0,7);g.stroke();continue}
     else{p.vx*=.96;p.vy*=.96;g.fillStyle=`rgba(120,100,110,${.26*(1-u)})`;g.beginPath();g.arc(p.x,p.y,p.r0+u*16,0,7);g.fill()}
     p.x+=p.vx;p.y+=p.vy}
   }
  }
  requestAnimationFrame(loop)})();
}

/* ===== DRS BOOST: autopilot flying lap ===== */
const btn=document.getElementById('drs');
if(btn){
 const oc=document.createElement('canvas');oc.id='f1-drs';B.append(oc);const o=oc.getContext('2d');
 const hud=document.createElement('div');hud.id='f1-drs-hud';hud.innerHTML='<b>DRS OPEN</b><span><i id="f1v">0</i> KM/H</span><em>CLICK · SCROLL · ESC TO BRAKE</em>';B.append(hud);
 let on=false,k=0,raf=0,t0=0,y0=0,dist=0,dur=0,ray=[],label=btn.textContent;
 const sz=()=>{oc.width=innerWidth;oc.height=innerHeight};addEventListener('resize',sz);sz();
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 function draw(){
  k+=((on?1:0)-k)*.07;
  o.clearRect(0,0,oc.width,oc.height);
  if(k>.01){const W=oc.width,H=oc.height,cx=W/2,cy=H/2,M=Math.hypot(W,H)/2;
   const vg=o.createRadialGradient(cx,cy,M*.35,cx,cy,M);vg.addColorStop(0,'rgba(255,45,135,0)');vg.addColorStop(1,`rgba(179,18,79,${.38*k})`);o.fillStyle=vg;o.fillRect(0,0,W,H);
   while(ray.length<90)ray.push({a:R(0,6.283),r:R(.1,1),s:R(.01,.035)});
   o.lineCap='round';
   ray.forEach(q=>{q.r+=q.s*(.4+k*2.2);if(q.r>1){q.r=R(.05,.25);q.a=R(0,6.283)}
    const r1=q.r*M,r2=r1+M*.08*k*(1+q.r)*3,ca=Math.cos(q.a),sa=Math.sin(q.a);
    o.strokeStyle=`rgba(${q.a>3.2?'255,255,255':'255,90,160'},${Math.min(.75,q.r)*k})`;o.lineWidth=1+q.r*2.4;
    o.beginPath();o.moveTo(cx+ca*r1,cy+sa*r1);o.lineTo(cx+ca*r2,cy+sa*r2);o.stroke()})}
  const v=document.getElementById('f1v');if(v)v.textContent=Math.round(k*(318+Math.random()*12));
  if(on||k>.01)raf=requestAnimationFrame(draw);else{o.clearRect(0,0,oc.width,oc.height);raf=0}
 }
 function step(now){if(!on)return;const t=Math.min((now-t0)/dur,1);scrollTo(0,y0+dist*ease(t));if(t<1)requestAnimationFrame(step);else stop(true)}
 function stop(done){if(!on)return;on=false;B.classList.remove('drs');window.F1T=false;btn.textContent=label;
  ['wheel','touchstart','keydown','pointerdown'].forEach(e=>removeEventListener(e,brk,true));
  const lt=document.getElementById('lap');
  if(typeof toast==='function')toast(done?`CHEQUERED FLAG · LAP COMPLETE${lt?' · '+lt.textContent:''}`:'DRS CLOSED · BRAKING',2400);
  const fl=document.getElementById('flash');if(fl&&done){fl.classList.add('on');setTimeout(()=>fl.classList.remove('on'),260)}}
 function brk(e){if(e.type==='keydown'&&e.key!=='Escape')return;stop(false)}
 btn.addEventListener('click',e=>{
  if(on){stop(false);return}
  on=true;B.classList.add('drs');window.F1T=true;label=btn.textContent;btn.textContent='🏁 BRAKE';
  const max=document.documentElement.scrollHeight-innerHeight;
  if(scrollY>max-300)scrollTo(0,0);
  y0=scrollY;dist=max-y0;dur=Math.max(3500,Math.min(11000,dist*1.1));t0=performance.now();
  const fl=document.getElementById('flash');fl&&fl.classList.add('on');setTimeout(()=>fl&&fl.classList.remove('on'),260);
  setTimeout(()=>['wheel','touchstart','keydown','pointerdown'].forEach(n=>addEventListener(n,brk,true)),400);
  if(!raf)draw();requestAnimationFrame(step)});
}
})();
/* dropdown: tap-to-open on touch devices, click-outside closes */
(()=>{const dd=[...document.querySelectorAll('.dd')];
 dd.forEach(d=>d.querySelector(':scope>a').addEventListener('click',e=>{if(matchMedia('(hover:none)').matches&&!d.classList.contains('open')){e.preventDefault();dd.forEach(x=>x.classList.remove('open'));d.classList.add('open')}}));
 addEventListener('click',e=>{if(!e.target.closest('.dd'))dd.forEach(x=>x.classList.remove('open'))});
 addEventListener('keydown',e=>{if(e.key==='Escape')dd.forEach(x=>x.classList.remove('open'))});})();
/* dropdowns: opening one snaps the other shut (no overlap) */
(()=>{const dd=[...document.querySelectorAll('.dd')];
 dd.forEach(d=>{d.addEventListener('mouseenter',()=>{d.classList.remove('kill');dd.forEach(o=>{if(o!==d){o.classList.add('kill');o.classList.remove('open')}})})});})();
/* clickable tech tags */
(()=>{const D={
'project-f1-race-lab.html':{'PYTHON':'Everything: FastF1 ingestion, stint segmentation, fuel correction, models and the simulator.','FASTF1':'Source of real lap, tyre and weather telemetry. Sessions are cached and loaded into SQLite.','GRADIENT BOOSTING':'Quantile gradient boosting predicts tyre degradation as P10 / P50 / P90 bands instead of one number.','SHAP':'Explains what drives degradation: tyre age, compound, track temperature.','MONTE CARLO':'Thousands of simulated races over degradation curves, pit loss and Safety Car probability to compare strategies.','SQLITE':'Normalized schema for sessions, laps and stints, so features load fast and offline.','STREAMLIT':'Multi-page dashboard for degradation, Safety Car cost and the pit simulator.','PLOTLY':'Shared figure builders for every chart, with hover and uncertainty bands.'},
'project-flight-predictor.html':{'PYTHON':'Data cleaning, feature engineering, training and the Flask app.','SCIKIT-LEARN':'Pipeline, 80/20 split, Random Forest Regressor and metrics (R² 0.87).','RANDOM FOREST':'Main model: handles non-linear fare patterns and beat the linear baseline.','FEATURE ENGINEERING':'Date, duration and stops parsed into numeric features, plus days left to departure.','PANDAS':'Loading the Kaggle fare data, trimming outliers and log-transforming price.','ONE-HOT ENCODING':'Airline, source and destination turned into numeric columns the forest can use.'},
'project-animal-allergy.html':{'PYTHON':'Training code, preprocessing and the Streamlit app.','TENSORFLOW':'Framework for building and training the CNN.','TINYVGG':'Small VGG-style CNN: stacked conv + pool blocks into a dense head, 37 classes.','STREAMLIT':'Upload-and-predict interface, no separate backend.','GEMINI API':'Takes the predicted breed and returns breed-specific food-allergy guidance.','KERAS':'Layers, augmentation pipeline and training loop.','DATA AUGMENTATION':'Flip, rotation, zoom and colour-jitter to reduce overfitting.'},
'project-factcheck-ai.html':{'PYTHON':'Glue for embedding, retrieval, prompting and the UI.','FAISS':'Fast nearest-neighbour search over the evidence vectors.','SENTENCETRANSFORMERS':'Turns the claim and the evidence into embeddings.','MISTRAL':'Reads only the retrieved evidence and gives a verdict with reasoning.','OLLAMA':'Serves Mistral locally, so there are no external API calls.','STREAMLIT':'Front end to enter a claim and read the verdict.','RAG':'Retrieve first, then reason, so the LLM is grounded instead of guessing.'},
'project-the-bench.html':{'PYTHON':'Retrieval, ranking and orchestration logic.','FASTAPI':'API layer serving search and paging.','REACT':'Front end for browsing ranked case law.','LANGGRAPH':'Orchestrates the pipeline as a stateful graph, so paging keeps its context.','POSTGRESQL':'Stores case documents and metadata.','REDIS':'Caches results and keeps paging state.','HYBRID SEARCH':'Keyword plus vector retrieval, merged and re-ranked.','RAG':'Answers are grounded in retrieved legal documents.'}};
 const d=D[document.body.dataset.page];const box=document.querySelector('.chips');if(!d||!box)return;
 const panel=document.createElement('div');panel.className='chip-detail';box.after(panel);
 const chips=[...box.querySelectorAll('.chip')];
 const show=c=>{chips.forEach(x=>x.classList.toggle('on',x===c));const t=c.textContent.trim();panel.innerHTML='<b>'+t+'</b><p>'+(d[t]||'')+'</p>';panel.classList.add('show')};
 chips.forEach(c=>{c.tabIndex=0;c.setAttribute('role','button');c.addEventListener('click',()=>show(c));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(c)}})});
 show(chips[0]);})();/* mobile menu (hamburger) — the button is hidden by CSS above 900px */
(()=>{const nav=document.querySelector('nav');if(!nav)return;
 const b=document.createElement('button');b.className='nav-burger';b.type='button';b.setAttribute('aria-label','Menu');b.setAttribute('aria-expanded','false');b.innerHTML='<i></i><i></i><i></i>';nav.append(b);
 const set=o=>{nav.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));document.body.classList.toggle('menu-open',o)};
 b.addEventListener('click',()=>set(!nav.classList.contains('open')));
 nav.addEventListener('click',e=>{if(e.target.closest('#drs,a.pill,a.di,a[href^="#"]'))set(false)});
 addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 addEventListener('resize',()=>{if(innerWidth>900)set(false)});})();