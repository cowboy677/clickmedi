/* 공개 사이트 모션: 스크롤 등장(좌·우·아래·확대), 숫자 올라가기, 도형 시차, 플로팅 버튼, 모바일 메뉴 */
(function(){
 var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
 var doc=document.documentElement,B=document.body;
 /* 진행 막대 + 플로팅 버튼 */
 var prog=document.createElement("div");prog.className="prog";B.appendChild(prog);
 var fab=document.createElement("div");fab.className="fab";
 fab.innerHTML='<a href="index.html#contact"><b>✎</b>상담<br>신청</a><a href="diagnose.html"><b>◎</b>무료<br>진단</a><button type="button" id="fabtop"><b>↑</b>TOP</button>';
 B.appendChild(fab);
 fab.querySelector("#fabtop").onclick=function(){window.scrollTo({top:0,behavior:"smooth"})};
 /* 헤더 */
 var hd=document.querySelector(".hd"),nav=document.querySelector(".nav"),hbg=document.querySelector(".hbg");
 if(hbg&&nav){hbg.onclick=function(){nav.classList.toggle("open")};nav.addEventListener("click",function(e){if(e.target.tagName==="A")nav.classList.remove("open")})}
 /* 히어로·어두운 구역에 움직이는 도형 */
 var shaped=[].slice.call(document.querySelectorAll(".hero,.ph,.hhero,#seo,.cta2"));
 shaped.forEach(function(el){
  var s=document.createElement("div");s.className="shapes";
  s.innerHTML='<i class="grid2"></i><i class="slab"></i><i class="slab2"></i><i class="ring"></i><i class="ring2"></i><i class="dot d1"></i><i class="dot d2"></i><i class="dot d3"></i><i class="dot d4"></i><i class="dot d5"></i>';
  el.insertBefore(s,el.firstChild);
 });
 var shapeEls=[].slice.call(document.querySelectorAll(".shapes"));
 /* 스크롤 */
 var ticking=false;
 function onScroll(){
  var y=window.scrollY||doc.scrollTop,h=doc.scrollHeight-innerHeight;
  prog.style.transform="scaleX("+(h>0?Math.min(1,y/h):0)+")";
  if(hd)hd.classList.toggle("sm",y>30);
  fab.classList.toggle("show",y>380);
  if(!reduce)shapeEls.forEach(function(s){if(s.parentNode.classList.contains("ph"))return;var r=s.parentNode.getBoundingClientRect();if(r.bottom<-50||r.top>innerHeight+50)return;s.style.transform="translate3d(0,"+(-r.top*0.18).toFixed(1)+"px,0)"});
  ticking=false;
 }
 window.addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
 window.addEventListener("resize",onScroll);onScroll();
 if(reduce)return;
 /* 등장 모션 */
 doc.classList.add("mo");
 var io=new IntersectionObserver(function(es){es.forEach(function(e){
   if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);el.classList.add("in");
   if(el.matches(".stats>div"))countUp(el.querySelector("b"));
   setTimeout(function(){el.classList.remove("rv","rv-u","rv-l","rv-r","rv-z","rv-d","in");el.style.removeProperty("--d")},1900);
  })},{threshold:.1,rootMargin:"0px 0px -6% 0px"});
 function mark(el,dir,delay){
  if(!el||el.__rv)return;el.__rv=1;el.classList.add("rv","rv-"+dir);if(delay)el.style.setProperty("--d",delay+"s");io.observe(el);
 }
 function kids(sel,mode){
  [].slice.call(document.querySelectorAll(sel)).forEach(function(box){
   var c=[].slice.call(box.children).filter(function(k){return k.tagName!=="SCRIPT"&&k.tagName!=="STYLE"});
   var n=c.length;
   c.forEach(function(k,i){
    var d,t=0;
    if(mode==="lr"){d=i%2?"r":"l";t=Math.floor(i/2)*.06}
    else if(n===2){d=i?"r":"l"}
    else if(n===3){d=i===0?"l":i===1?"u":"r";t=i*.08}
    else if(n===4){d=i<2?"l":"r";t=(i%2)*.1}
    else if(n===5){d=i<2?"l":i===2?"u":"r";t=(i%3)*.08}
    else{d=(Math.floor(i/4)%2)?"z":"u";t=(i%4)*.09}
    mark(k,d,t);
   });
  });
 }
 function scan(){
  [].slice.call(document.querySelectorAll("section.s>.wrap>.eyebrow,.ph .eyebrow")).forEach(function(e){mark(e,"d")});
  [].slice.call(document.querySelectorAll("section.s h2.t,section.s .wrap>.lead")).forEach(function(e){mark(e,"u",.08)});
  kids(".grid,.val,.steps,.feat,.types,.mp,.diff,.who,#tiers,#svc,#hooks,#seo_p");
  kids(".faq,.rec-box,.recs","lr");
  [].slice.call(document.querySelectorAll(".rec")).forEach(function(e,i){mark(e,i%2?"r":"l",0)});
  [].slice.call(document.querySelectorAll(".stats>div")).forEach(function(e,i){mark(e,"u",i*.1)});
  [].slice.call(document.querySelectorAll("table.cmp tr,table.rl tr")).forEach(function(e,i){mark(e,i%2?"r":"l",0)});
  [].slice.call(document.querySelectorAll(".cta2,.chips,.tipc,#about .wrap>p,#contact .card,section.s>.wrap>.card,.cta")).forEach(function(e){if(!e.closest(".hero"))mark(e,"z",0)});
 }
 var t0=0;scan();
 var timer=setInterval(function(){scan();if(++t0>14)clearInterval(timer)},350);
 window.addEventListener("load",scan);
 /* 숫자 올라가기 */
 function countUp(b){
  if(!b||b.__c)return;b.__c=1;var m=b.textContent.match(/^([^\d]*)([\d,]+)(.*)$/);if(!m)return;
  var to=parseInt(m[2].replace(/,/g,""),10),st=null,dur=1500;
  function f(ts){if(!st)st=ts;var p=Math.min(1,(ts-st)/dur),e=1-Math.pow(1-p,3);
   b.textContent=m[1]+Math.round(to*e).toLocaleString("ko-KR")+m[3];if(p<1)requestAnimationFrame(f)}
  requestAnimationFrame(f);
 }
 /* 히어로 통계는 처음 화면에 보이면 바로 */
 [].slice.call(document.querySelectorAll(".hero .stats b")).forEach(function(b){setTimeout(function(){countUp(b)},1100)});
})();
