/* Grandma's tips (captions plus recorded voice) and celebration effects. Local only. */
window.Grandma=(()=>{
 let enabled=true,last=0,motion=true;const seen=new Set(),cnt={};
 const S=()=>window.QuestSound,T=()=>window.GRANDMA_TEXT||{};
 let el=null,hideT=0;
 function ensure(){if(el)return el;el=document.createElement('aside');el.id='grandma-bubble';el.className='grandma-bubble';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.hidden=true;
  el.innerHTML='<img src="assets/grandma.webp" alt="" width="56" height="56"><div class="gb-text"><strong>Grandma</strong><p></p></div><button type="button" class="gb-close" aria-label="Close Grandma tip">\u00d7</button>';
  document.body.appendChild(el);el.querySelector('.gb-close').onclick=hide;return el}
 function hide(){clearTimeout(hideT);if(el)el.hidden=true}
 function hideLater(ms){clearTimeout(hideT);hideT=setTimeout(hide,ms)}
 function rot(p,n){cnt[p]=((cnt[p]||0)+1)%n;return p+'-'+cnt[p]}
 function say(id,o={}){
  if(!enabled&&!o.force)return false;const text=T()[id];if(!text)return false;
  if(o.once&&seen.has(id))return false;
  const snd=S();const st=snd?.state?.();
  if(!o.force&&Date.now()-last<(o.cool??30000))return false;
  if(!o.force&&st?.talking)return false;
  seen.add(id);last=Date.now();
  const b=ensure();b.querySelector('p').textContent=text;b.hidden=false;
  const spoke=snd?.narrate?.(id,{end:()=>hideLater(2600),error:()=>hideLater(5000)});
  hideLater(spoke?Math.max(9000,text.length*130):Math.max(7000,text.length*70));
  return true}
 const MAP={right:()=>say(rot('praise',4),{cool:26000}),wrong:()=>say(rot('steady',3),{cool:6000}),rapid:()=>say(rot('slow',2),{cool:6000}),
  cheer:()=>say(rot('cheer',4),{force:true}),bump:()=>say(rot('gentle',2),{cool:16000})};
 function react(kind){return MAP[kind]?.()}
 /* Celebration: a short, scaled burst of stars and confetti. Motion is skipped when Playful motion is off. */
 function go(tier=2){
  if(!motion||document.querySelector('.no-motion'))return;const c=document.createElement('canvas');c.className='fiesta';c.setAttribute('aria-hidden','true');c.width=Math.min(innerWidth,1400);c.height=Math.min(innerHeight,900);document.body.appendChild(c);
  const x=c.getContext('2d'),W=c.width,H=c.height,n=18+tier*22,colors=['#f2b84b','#e46f5d','#57a889','#7c8fe0','#f7e08a','#ffffff'];
  const ps=Array.from({length:n},(_,i)=>{const a=Math.random()*Math.PI*2,sp=3+Math.random()*(4+tier*1.5);return {x:W/2+(Math.random()-.5)*W*.35,y:H*.55,vx:Math.cos(a)*sp*(1+tier*.12),vy:Math.sin(a)*sp-4-tier,g:.14+Math.random()*.05,r:3+Math.random()*5,c:colors[i%colors.length],star:i%4===0,rot:Math.random()*6,vr:(Math.random()-.5)*.3,life:1}});
  const total=tier>=4?2600:tier>=3?2000:1500;const t0=performance.now();
  (function step(now){const t=now-t0;x.clearRect(0,0,W,H);
   if(tier>=3){const k=Math.max(0,1-t/500);x.fillStyle='rgba(255,236,170,'+(.35*k)+')';x.fillRect(0,0,W,H)}
   ps.forEach(p=>{p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life=Math.max(0,1-t/total);x.globalAlpha=p.life;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.rot);
    if(p.star){x.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,d=i%2?p.r*.9:p.r*2.1;x.lineTo(Math.cos(a)*d,Math.sin(a)*d)}x.closePath();x.fill()}else x.fillRect(-p.r,-p.r*.5,p.r*2,p.r);x.restore()});
   x.globalAlpha=1;if(t<total)requestAnimationFrame(step);else c.remove()})(t0);
  if(tier>=4){document.body.classList.add('fiesta-shake');setTimeout(()=>document.body.classList.remove('fiesta-shake'),520)}}
 return {say,react,go,hide,setEnabled:v=>{enabled=!!v;if(!enabled)hide()},setMotion:v=>{motion=v!==false},reset:()=>{seen.clear()},state:()=>({enabled,visible:!!el&&!el.hidden,text:el?.querySelector('p')?.textContent||''})};
})();
