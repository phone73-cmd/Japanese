
const D=window.APP_DATA, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={view:"home",cat:"",page:0,per:30};
const saved=()=>JSON.parse(localStorage.getItem("savedPhrases")||"[]");
const learned=()=>JSON.parse(localStorage.getItem("learnedWords")||"[]");
function store(k,v){localStorage.setItem(k,JSON.stringify(v))}
function speak(t){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ja-JP";u.rate=.88;speechSynthesis.speak(u)}
function nav(v){state.view=v;$$(".view").forEach(x=>x.classList.add("hidden"));$("#"+v).classList.remove("hidden");$$(".navbtn").forEach(x=>x.classList.toggle("active",x.dataset.v===v));if(v==="vocab")renderVocab();if(v==="saved")renderSaved();if(v==="quiz")newQuiz();window.scrollTo(0,0)}
function renderCats(){ $("#cats").innerHTML=D.categories.map(c=>`<button class="cat" onclick='openCat(${JSON.stringify(c.name)})'><span class="ico">${c.icon}</span><b>${c.name}</b><small>${c.desc} · ${D.phrases.filter(p=>p.category===c.name).length}문장</small></button>`).join("")}
function phraseCard(p){return `<div class="card"><div class="jp">${p.jp}</div><div class="read">${p.reading}</div><div class="ko">${p.ko}</div><div class="actions"><button class="btn primary" onclick='speak(${JSON.stringify(p.jp)})'>🔊 듣기</button><button class="btn" onclick="toggleSave(${p.id})">${saved().includes(p.id)?"❤️ 저장됨":"🤍 저장"}</button></div></div>`}
function openCat(c){state.cat=c;state.page=0;nav("phrases");renderPhrases()}
function renderPhrases(q=""){let a=D.phrases.filter(p=>(!state.cat||p.category===state.cat)&&(!q||[p.jp,p.reading,p.ko,p.category].join(" ").toLowerCase().includes(q.toLowerCase())));$("#phraseTitle").textContent=(state.cat||"전체 표현")+` · ${a.length}문장`;$("#phraseList").innerHTML=a.slice(0,150).map(phraseCard).join("")||'<div class="card">검색 결과가 없습니다.</div>'}
function toggleSave(id){let a=saved();a=a.includes(id)?a.filter(x=>x!==id):[...a,id];store("savedPhrases",a);updateStats(); if(state.view==="phrases")renderPhrases($("#search").value); if(state.view==="saved")renderSaved()}
function renderSaved(){let ids=saved(),a=D.phrases.filter(p=>ids.includes(p.id));$("#savedList").innerHTML=a.length?a.map(phraseCard).join(""):'<div class="card">🤍 문장의 저장 버튼을 눌러 나만의 표현장을 만들어 보세요.</div>';updateStats()}
function renderVocab(){let l=learned();$("#vocabList").innerHTML=D.vocab.map(w=>`<div class="word"><div class="w">${w.word}</div><div>${w.kana} · ${w.reading}</div><div class="ko">${w.meaning}</div><div class="actions"><button class="btn primary" onclick='speak(${JSON.stringify(w.word)})'>🔊 듣기</button><button class="btn" onclick="toggleWord(${w.id})">${l.includes(w.id)?"✅ 암기":"○ 학습중"}</button></div><details><summary>예문 보기</summary><p>${w.example}</p><p class="ko">${w.exampleKo}</p></details></div>`).join("");updateStats()}
function toggleWord(id){let a=learned();a=a.includes(id)?a.filter(x=>x!==id):[...a,id];store("learnedWords",a);renderVocab()}
let qi=0,score=0,quiz=[];
function newQuiz(){qi=0;score=0;quiz=[...D.phrases].sort(()=>Math.random()-.5).slice(0,10);renderQuiz()}
function renderQuiz(){if(qi>=quiz.length){$("#quizBox").innerHTML=`<div class="card"><h2>🎉 ${score}/10 정답</h2><button class="btn primary" onclick="newQuiz()">다시 풀기</button></div>`;return}let p=quiz[qi],opts=[p.ko,...D.phrases.filter(x=>x.id!==p.id).sort(()=>Math.random()-.5).slice(0,3).map(x=>x.ko)].sort(()=>Math.random()-.5);$("#quizBox").innerHTML=`<div class="card"><div>${qi+1}/10</div><div class="jp" style="margin:20px 0">${p.jp}</div>${opts.map(o=>`<button class="btn" style="display:block;width:100%;margin:7px 0" onclick='answer(${JSON.stringify(o===p.ko)})'>${o}</button>`).join("")}</div>`}
function answer(ok){if(ok)score++;qi++;renderQuiz()}
function updateStats(){$("#saveN").textContent=saved().length;$("#learnN").textContent=learned().length;$("#phraseN").textContent=D.phrases.length;$("#wordN").textContent=D.vocab.length}
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem("theme",t)}
function toggleMode(){let m=document.documentElement.dataset.mode==="dark"?"light":"dark";document.documentElement.dataset.mode=m;localStorage.setItem("mode",m)}
$("#search").addEventListener("input",e=>{state.cat="";nav("phrases");renderPhrases(e.target.value)})
document.documentElement.dataset.theme=localStorage.getItem("theme")||"blue";document.documentElement.dataset.mode=localStorage.getItem("mode")||"light";
renderCats();updateStats();
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
