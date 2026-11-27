/* 병원 진단 리포트 (공개 진단·현장 진단 공용). 데이터: data/hospitals.json */
window.DIAG=(function(){
const esc=HB.esc;
const CH=[["blog","블로그"],["homepage","홈페이지"],["instagram","인스타"],["threads","스레드"],["place","네이버플레이스"],["kakao","카카오채널"],["youtube","유튜브"]];
async function load(base){const r=await fetch((base||"")+"data/hospitals.json");return r.json()}
function find(all,q){q=q.replace(/\s/g,"").toLowerCase();if(!q)return [];return all.filter(h=>(h.name+h.dong+h.city+h.addr).replace(/\s/g,"").toLowerCase().includes(q)).sort((a,b)=>(b.score.total-a.score.total)).slice(0,12)}
function bar(label,v,max,color,avg){const w=Math.max(0,Math.min(100,v/max*100));const a=avg==null?"":`<div style="position:absolute;left:${Math.min(100,avg/max*100)}%;top:-3px;bottom:-3px;border-left:2px dashed #667085" title="같은 진료과 평균 ${avg.toFixed(1)}"></div>`;
 return `<div style="display:flex;align-items:center;gap:10px;margin:7px 0"><div style="width:96px;font-size:.85em;color:#475467">${label}</div><div style="flex:1;height:14px;background:#eef1f7;border-radius:7px;position:relative"><div style="width:${w}%;height:100%;background:${color};border-radius:7px"></div>${a}</div><div style="width:64px;text-align:right;font-weight:700;font-size:.9em">${v}<span class="mu" style="font-weight:400"> /${max}</span></div></div>`}
function stats(all,h){const peers=all.filter(x=>x.dept===h.dept&&x.city===h.city);const n=peers.length||1;
 const avg=k=>peers.reduce((a,x)=>a+x.score[k],0)/n;const rate=k=>Math.round(peers.filter(x=>x.ch[k]).length/n*100);
 const rank=peers.filter(x=>x.score.total>h.score.total).length+1;
 return {peers,n:peers.length,avg:{map:avg("map"),blog:avg("blog"),chan:avg("chan"),rev:avg("rev"),total:avg("total")},rate,rank}}
function tips(h,S){const t=[];
 if(!h.ch.blog)t.push(["블로그","병원 공식 블로그 주소가 지도·홈페이지에서 확인되지 않아요. 블로그가 있다면 연결하고, 없다면 개설부터 시작하는 게 좋아요.","h"]);
 else if(h.blogCityRank==null)t.push(["블로그 검색 노출",`"${h.city}${h.dept}" 검색에서 상위 30개 글 안에 이 병원 블로그 글이 보이지 않아요. 지역+진료 주제 글을 꾸준히 쌓는 것이 첫 단계예요.`,"m"]);
 if(h.cityRank==null)t.push(["지도 노출",`지도에서 "${h.city} ${h.dept}" 목록 50위 안에 들지 않았어요. ${h.areaRank?`동네 검색(${esc(h.areaQ)})에서는 ${h.areaRank}번째로 보여요.`:"동네 검색에서도 50위 안 기록이 없어요."} 플레이스 소개글·소식·리뷰 점검이 필요해요.`,"m"]);
 if(!h.ch.instagram)t.push(["인스타그램","병원 인스타 계정 링크가 확인되지 않아요. 계정이 있다면 플레이스·홈페이지에 연결해 주세요.","l"]);
 if(!h.ch.homepage)t.push(["홈페이지","플레이스에 홈페이지 주소가 없어요. 진료 안내와 예약을 모으는 1페이지 랜딩이 도움이 될 수 있어요.","m"]);
 if(!h.ch.threads)t.push(["스레드","스레드 연결이 확인되지 않아요. 지역 병원 중에는 아직 거의 없는 채널이라 먼저 시작하면 눈에 띌 수 있어요.","l"]);
 if(h.blogRev+h.visitRev<50)t.push(["리뷰·활동",`블로그·방문자 리뷰 수가 적은 편이에요(합계 ${h.blogRev+h.visitRev}). 방문 후 리뷰 안내 문구를 점검해 보세요. 리뷰 대가 제공은 의료법상 주의가 필요해요.`,"m"]);
 if(!t.length)t.push(["현재 상태","주요 채널이 대부분 갖춰져 있어요. 다음 단계는 검색어별 순위 추적과 콘텐츠 품질(검수·주제 다양성) 점검이에요.","l"]);
 return t}
function maskName(n){const F="가나다라마바사아자차카타파하";let o="",k=0;for(const ch of n){if(k===0){o+=ch}else if(ch===" "){o+=" "}else{o+=F[(k*7+n.length)%F.length]}k++}return `<span>${esc(n[0])}</span><span style="filter:blur(5px);user-select:none;pointer-events:none" aria-hidden="true">${esc(o.slice(1))}</span>`}
function render(h,D,opt){opt=opt||{};const all=D.hospitals;const S=stats(all,h);const sc=h.score;
 const chips=CH.map(([k,l])=>`<span class="chip ${h.ch[k]?"on":"off"}">${l}</span>`).join("");
 const top=S.peers.slice().sort((a,b)=>b.score.total-a.score.total).slice(0,6);
 const rk=(v,s,o)=>v==null?`<span class="mu">${o||"50위 밖"}</span>`:`<b>${v}</b>${s||"위"}`;
 return `<div class="card" style="padding:26px">
 <div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between">
  <div><div class="tag">${esc(h.city)} ${esc(h.dong)} · ${esc(h.dept)}</div><h2 style="margin:6px 0 2px;font-size:1.6em">${esc(h.name)}</h2><div class="mu" style="font-size:.88em">${esc(h.addr)}</div></div>
  <div style="text-align:center"><div style="font-size:2.8em;font-weight:900;color:var(--ac);line-height:1">${sc.total}</div><div class="mu" style="font-size:.85em">노출점수 / 100<br>${esc(h.city)} ${esc(h.dept)} ${S.n}곳 중 ${S.rank}위</div></div>
 </div>
 <div class="grid g2" style="margin-top:20px">
  <div><h3 style="margin:0 0 6px;font-size:1.02em">점수 구성 <span class="mu" style="font-weight:400;font-size:.8em">점선 = 같은 지역·진료과 평균</span></h3>
   ${bar("지도 노출",sc.map,35,"#f79009",S.avg.map)}${bar("블로그 노출",sc.blog,30,"#12a36b",S.avg.blog)}${bar("채널 보유",sc.chan,20,"#4f5bff",S.avg.chan)}${bar("리뷰·활동",sc.rev,15,"#9b5cf6",S.avg.rev)}</div>
  <div><h3 style="margin:0 0 6px;font-size:1.02em">검색 순위 현황</h3>
   <table class="cmp" style="font-size:.9em"><tr><td>지도 "${esc(h.city)} ${esc(h.dept)}"</td><td>${rk(h.cityRank,"번째")}${h.cityAd?' <span class="chip" style="background:#fff4d6;color:#7a5a00">광고 표시</span>':""}</td></tr>
   <tr><td>지도 동네 검색 최고</td><td>${h.areaRank?`<b>${h.areaRank}</b>번째 <span class="mu">${esc(h.areaQ)}</span>`:'<span class="mu">50위 밖</span>'}</td></tr>
   <tr><td>블로그탭 "${esc(h.city)}${esc(h.dept)}"</td><td>${rk(h.blogCityRank,"위","30위 밖")}</td></tr>
   <tr><td>블로그탭 동네 검색 최고</td><td>${h.blogRank?`<b>${h.blogRank}</b>위 <span class="mu">${esc(h.blogKw)}</span>`:'<span class="mu">30위 밖</span>'}</td></tr>
   <tr><td>리뷰 (블로그 / 방문자)</td><td>${h.blogRev} / ${h.visitRev}</td></tr></table></div>
 </div>
 <h3 style="margin:22px 0 6px;font-size:1.02em">채널 보유 <span class="mu" style="font-weight:400;font-size:.8em">같은 지역·진료과 병원 중 보유 비율: 블로그 ${S.rate("blog")}% · 홈페이지 ${S.rate("homepage")}% · 인스타 ${S.rate("instagram")}% · 스레드 ${S.rate("threads")}%</span></h3>
 <div>${chips}</div>
 <div class="mu" style="font-size:.82em;margin-top:6px">${[h.blogs&&h.blogs.length?`블로그: ${h.blogs.map(b=>`<a href="https://blog.naver.com/${esc(b)}" target="_blank" style="color:var(--ac)">${esc(b)}</a>`).join(", ")}`:"",h.site?`<a href="${esc(h.site)}" target="_blank" style="color:var(--ac)">홈페이지</a>`:"",h.igId?`<a href="https://www.instagram.com/${esc(h.igId)}/" target="_blank" style="color:var(--ac)">인스타 @${esc(h.igId)}</a>`:""].filter(Boolean).join(" · ")}</div>
 <h3 style="margin:22px 0 6px;font-size:1.02em">개선 포인트</h3>
 <div class="grid g2">${tips(h,S).map(([a,b,p])=>`<div class="card" style="padding:14px 16px;border-left:4px solid ${p==="h"?"#f04438":p==="m"?"#f79009":"#98a2b3"}"><b>${a}</b><p style="margin-top:4px">${b}</p></div>`).join("")}</div>
 <h3 style="margin:22px 0 6px;font-size:1.02em">같은 지역·진료과 노출점수 TOP 6</h3>${opt.blur?`<div class="mu" style="font-size:.84em;margin:-2px 0 8px">🔒 경쟁 병원 이름은 첫 글자만 보여 드려요. 전체 이름과 상세 비교는 상담 신청 시 알려 드립니다.</div>`:""}
 <div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><table class="cmp" style="font-size:.88em;min-width:560px;white-space:nowrap"><tr><th>#</th><th>병원</th><th>동</th><th>노출점수</th><th>지도(시)</th><th>블로그탭(시)</th><th>채널</th></tr>
 ${top.map((x,i)=>`<tr style="${x.id===h.id?"background:#eef0ff":""}"><td>${i+1}</td><td style="white-space:nowrap"><b>${opt.blur&&x.id!==h.id?maskName(x.name):esc(x.name)}</b></td><td>${esc(x.dong)}</td><td><b>${x.score.total}</b></td><td>${x.cityRank??"-"}</td><td>${x.blogCityRank??"-"}</td><td>${CH.slice(0,4).map(([k,l])=>`<span class="chip ${x.ch[k]?"on":"off"}">${l}</span>`).join("")}</td></tr>`).join("")}</table></div>
 <p class="mu" style="font-size:.78em;margin:12px 0 0">※ 네이버 지도·블로그 검색을 로그인 없이 수집한 값(${esc(D.generated||"")} 기준)이라 검색 환경에 따라 다를 수 있어요. 채널 보유는 지도에 등록된 주소와 홈페이지 안 링크 기준이라, 링크 없이 운영하는 계정은 '없음'으로 보일 수 있어요. 외부 기관의 공식 평가가 아닙니다.</p></div>`}
return {load,find,render,stats};
})();
