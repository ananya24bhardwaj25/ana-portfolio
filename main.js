
const cursor = document.getElementById('race-cursor');
const canvas = document.getElementById('telemetry-canvas');

if (cursor && window.matchMedia('(min-width: 981px)').matches) {
  let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
  window.addEventListener('mousemove', e=>{tx=e.clientX;ty=e.clientY});
  (function follow(){cx += (tx-cx)*.22; cy += (ty-cy)*.22; cursor.style.left=`${cx}px`; cursor.style.top=`${cy}px`; requestAnimationFrame(follow)})();
  window.addEventListener('mousemove', (e) => {
  });
  document.querySelectorAll('a,button,input,textarea,select,.project-card,.feature-card,.panel').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
  });
}

// Animated telemetry grid / trace — intentionally lightweight so the portfolio stays static-host friendly.
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w=0,h=0, dpr=1, points=[];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    dpr=Math.min(devicePixelRatio||1,2);
    w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=`${w}px`; canvas.style.height=`${h}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    points=Array.from({length:34},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.14}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    points.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<-10||p.x>w+10)p.vx*=-1;
      if(p.y<-10||p.y>h+10)p.vy*=-1;
    });
    for(let i=0;i<points.length;i++){
      const a=points[i];
      for(let j=i+1;j<points.length;j++){
        const b=points[j];
        const dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
        if(dist<135){
          ctx.strokeStyle=`rgba(255,255,255,${(1-dist/135)*.06})`;
          ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }
    ctx.strokeStyle='rgba(255,79,154,.28)';
    ctx.lineWidth=1.1;
    const t=Date.now()/800;
    ctx.beginPath();
    for(let x=0;x<w;x+=12){
      const y=h*.82 + Math.sin(x*.011+t)*16 + Math.sin(x*.034-t*.4)*7;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);
  resize(); draw();
}

// Mobile navigation
const toggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click',()=>{
  navLinks?.classList.toggle('open');
});

// Active navigation from body data-page
const page = document.body.dataset.page;
document.querySelectorAll('.nav-links a').forEach(a=>{
  const href=a.getAttribute('href');
  if(href===page) a.classList.add('active');
});

// Reveal-on-scroll
const observer = new IntersectionObserver(items=>{
  items.forEach(item=>{
    if(item.isIntersecting){
      item.target.classList.add('visible');
      observer.unobserve(item.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

// Race-light intro
const lights = [...document.querySelectorAll('.race-lights i')];
if(lights.length){
  lights.forEach((light,i)=>setTimeout(()=>light.classList.add('on'),420+i*220));
  setTimeout(()=>lights.forEach(light=>light.classList.remove('on')),2300);
}

// Live "lap clock"
const lapTime = document.querySelector('[data-lap-time]');
if(lapTime){
  const start=performance.now();
  const tick=()=>{
    const elapsed=(performance.now()-start)/1000;
    const m=String(Math.floor(elapsed/60)).padStart(2,'0');
    const s=(elapsed%60).toFixed(3).padStart(6,'0');
    lapTime.textContent=`${m}:${s}`;
    requestAnimationFrame(tick);
  };
  tick();
}

// Generic mailto form
document.querySelectorAll('[data-mail-form]').forEach(form=>{
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

// Small toast helper
window.showToast=(message)=>{
  const t=document.querySelector('.toast');
  if(!t)return;
  t.textContent=message;t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove('show'),2400);
};
