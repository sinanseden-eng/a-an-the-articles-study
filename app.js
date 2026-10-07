const labels={start:'The essentials',a:'A / An',the:'The',zero:'No article · Ø'};
const colours={start:'#d7cbfa',a:'#ffb579',the:'#f8c9dd',zero:'#c5ee98'};
const $=id=>document.getElementById(id);
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const format=s=>escapeHTML(s).replace(/\[([^\]]+)\]/g,'<mark>$1</mark>');
let group='start', selected=0, visible=[];
$('ruleCount').textContent=rules.length;
$('exampleCount').textContent=rules.reduce((n,r)=>n+r.examples.length,0)+'+';
function refresh(){
 const term=$('search').value.trim().toLowerCase();
 visible=rules.filter(r=>(term||r.group===group)&&(!term||[r.title,r.explain,r.note,...r.examples].join(' ').toLowerCase().includes(term)));
 if(!visible.some(r=>r.id===selected))selected=visible[0]?.id;
 $('resultCount').textContent=visible.length;
 $('ruleList').innerHTML=visible.map((r,i)=>`<button data-id="${r.id}" class="${r.id===selected?'selected':''}" aria-current="${r.id===selected?'true':'false'}"><span class="num">${String(i+1).padStart(2,'0')}</span><span>${escapeHTML(r.title)}</span></button>`).join('')||'<p class="empty">No matching rules. Try “school”, “sound” or “general”.</p>';
 renderLesson();
}
function renderLesson(){
 const r=rules.find(r=>r.id===selected), i=visible.findIndex(r=>r.id===selected);
 if(!r){$('lesson').innerHTML='<h3>No results yet.</h3><p class="explain">Try a different search to find the rule you need.</p>';$('position').textContent='0 rules';$('prev').disabled=true;$('next').disabled=true;return;}
 $('lesson').style.setProperty('--accent',colours[r.group]);
 $('lesson').innerHTML=`<div class="lesson-meta"><span>${labels[r.group]} / RULE ${String(rules.filter(x=>x.group===r.group).findIndex(x=>x.id===r.id)+1).padStart(2,'0')}</span><b class="article-token">${r.group==='start'?'a · an · the · Ø':r.group==='a'?'a / an':r.group==='the'?'the':'Ø'}</b></div><h3>${escapeHTML(r.title)}</h3><p class="explain">${escapeHTML(r.explain)}</p><div class="example-label">SEE IT IN A SENTENCE</div><div class="examples">${r.examples.map(e=>`<div class="example">${format(e)}</div>`).join('')}</div>${r.note?`<div class="note"><b>Keep in mind ↗</b>${escapeHTML(r.note)}</div>`:''}`;
 $('position').textContent=`${i+1} of ${visible.length}`;$('prev').disabled=i===0;$('next').disabled=i===visible.length-1;
 document.querySelectorAll('#ruleList button').forEach(b=>{const on=Number(b.dataset.id)===selected;b.classList.toggle('selected',on);b.setAttribute('aria-current',String(on));});
}
$('ruleList').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b){selected=Number(b.dataset.id);renderLesson();}});
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.group;$('search').value='';document.querySelectorAll('.tabs button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b));});refresh();}));
$('search').addEventListener('input',refresh);
function move(delta){const i=visible.findIndex(r=>r.id===selected),r=visible[i+delta];if(r){selected=r.id;renderLesson();document.querySelector(`#ruleList [data-id="${r.id}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});}}
$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);
$('present').onclick=()=>{const on=document.body.classList.toggle('presentation');$('present').textContent=on?'Exit presentation ↙':'Present ↗';$('present').setAttribute('aria-pressed',String(on));if(on)$('learn').scrollIntoView();};
document.addEventListener('keydown',e=>{if(!document.body.classList.contains('presentation')||e.target.matches('input,textarea,select'))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='Escape')$('present').click();});
const contrasts=[
 ['School: purpose or place?','She goes to [school] every day.','She is a student there.','Her father went to [the school].','He visited the specific building.'],
 ['General or specific?','[Music] helps me relax.','Music in general; an uncountable noun.','[The music in this film] is beautiful.','We can identify which music.'],
 ['One cup or the drink?','Could I have [a coffee]?','One serving: a cup of coffee.','I don’t usually drink [coffee].','The drink in general.'],
 ['A medium or an object?','We watched [television] after dinner.','Television as entertainment.','We bought [a television].','One physical television set.'],
 ['An ordinary meal or a particular meal?','We had [dinner] at seven.','The ordinary name of a meal.','[The dinner you cooked] was excellent.','A particular meal identified by a clause.'],
 ['An example or a whole class?','[A tiger] has stripes.','One typical member represents the group.','[Tigers] have stripes.','The plural describes the group generally.']
];
$('contrastGrid').innerHTML=contrasts.map(c=>`<article class="contrast"><h3>${c[0]}</h3><p><b>${format(c[1])}</b><small>${c[2]}</small></p><hr><p><b>${format(c[3])}</b><small>${c[4]}</small></p></article>`).join('');
const questions=[
 ['Sound','She gave me ___ honest answer.','an','Honest begins with a vowel sound because the h is silent.','Choose according to the first sound, not the first letter.'],
 ['Sound','He studies at ___ university in Ankara.','a','University begins with a “y” consonant sound, so use a.','This is the first mention of the university.'],
 ['First mention','Yesterday I found ___ wallet on the bus.','a','Wallet is singular and countable. This introduces it for the first time.','The listener has not heard about this wallet before.'],
 ['Second mention','I found a wallet. ___ wallet had no money inside.','the','We can identify the wallet because it has just been mentioned.','Both sentences refer to the same wallet.'],
 ['General nouns','___ knowledge can open doors.','Ø','Knowledge is an uncountable abstract noun used generally.','Think about knowledge in general.'],
 ['Specific nouns','___ information you sent me was useful.','the','The clause “you sent me” identifies the information.','This refers to particular information.'],
 ['Jobs','My cousin wants to become ___ architect.','an','Use a/an for a job. Architect begins with a vowel sound.','Describe her future job.'],
 ['Instruments','She is learning to play ___ violin.','the','The is commonly used with musical instruments after play.','Use the conventional classroom pattern for playing an instrument.'],
 ['Sports','They play ___ basketball every Friday.','Ø','Names of sports usually take no article.','They are talking about the sport.'],
 ['Countries','We spent a week in ___ Netherlands.','the','The Netherlands is an established plural country name with the.','Think about the usual country name.'],
 ['Countries','She would love to visit ___ Japan.','Ø','Most singular country names, including Japan, take no article.','Use the ordinary country name.'],
 ['Institutions','As a pupil, I go to ___ school every weekday.','Ø','School is used for its main purpose: studying there.','Use British English and the purpose of the institution.'],
 ['Institutions','My father visited ___ school where I study.','the','The clause identifies a particular school. He is visiting it rather than attending as a pupil.','He went there to meet my teacher.'],
 ['Superlatives','That was ___ most exciting match of the season.','the','Use the with a superlative identifying the highest member of a group.','Compare all the matches in this season.'],
 ['Rates','The room costs eighty euros ___ night.','a','A night means per night, a rate for each night.','This gives a price per unit.'],
 ['Frequency','We have a club meeting once ___ month.','a','Once a month means one time in each month.','Think about how often the meeting happens.'],
 ['Unique things','___ moon looked especially bright last night.','the','The moon is identifiable in our usual shared context.','This is the moon visible from Earth.'],
 ['Languages','He speaks ___ Spanish fluently.','Ø','Names of languages take no article when used generally.','Spanish refers to the language.'],
 ['Language phrase','She is interested in ___ English language.','the','Use the in the specific noun phrase “the English language”.','The noun here is language, with English identifying it.'],
 ['Exclamations','What ___ incredible story!','an','What a/an + adjective + singular countable noun. Incredible begins with a vowel sound.','Story is singular and countable.'],
 ['Meals','We usually have ___ breakfast at eight.','Ø','Ordinary meal names take no article in this pattern.','This means the usual daily meal.'],
 ['Particular meals','___ breakfast you made this morning was delicious.','the','The clause “you made this morning” identifies a particular meal.','This is one specific breakfast.'],
 ['Television','I rarely watch ___ television on weekdays.','Ø','Television as a medium takes no article after watch.','This is about watching programmes.'],
 ['Television set','Please turn off ___ television in the living room.','the','The phrase “in the living room” identifies a physical television set.','The house has one television in that room.'],
 ['Names and titles','___ Dr Patel is our family doctor.','Ø','A normal title directly before a personal name takes no article.','The doctor is known to the speaker.'],
 ['A family','___ Browns live opposite our house.','the','The + a plural surname refers to the whole family.','Browns means the Brown family.'],
 ['Same','We are reading ___ same novel.','the','The same is the normal expression.','Both readers have chosen the identical novel.'],
 ['Compass directions','They live in ___ north of Türkiye.','the','The north of a place is a specific geographical area.','North is a noun naming a region here.'],
 ['Uncountable nouns','She gave me ___ useful advice.','Ø','Advice is uncountable and not identified as a particular set here. Useful does not make it countable.','This introduces advice. The speaker has not specified any particular advice.'],
 ['Serving','Could I have ___ coffee, please? Just one cup.','a','A coffee means a serving or cup. Coffee starts with a consonant sound.','You are ordering one serving.']
];
let qi=0,score=0,answered=false;
function showQuestion(){answered=false;const q=questions[qi];$('quizNumber').textContent=`QUESTION ${qi+1} / ${questions.length}`;$('quizTopic').textContent=q[0];$('quizProgress').style.width=`${qi/questions.length*100}%`;$('quizContext').textContent=q[4];$('quizSentence').innerHTML=escapeHTML(q[1]).replace('___','<span class="gap">?</span>');$('answers').innerHTML=['a','an','the','Ø'].map(a=>`<button data-answer="${a}" aria-label="${a==='Ø'?'No article':a}">${a}</button>`).join('');$('feedback').innerHTML='';$('quizNext').hidden=true;$('score').innerHTML=`${score}<span> / ${questions.length}</span>`;}
$('answers').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||answered)return;answered=true;const q=questions[qi],correct=b.dataset.answer===q[2];if(correct)score++;document.querySelectorAll('#answers button').forEach(x=>{x.disabled=true;x.classList.toggle('chosen',x===b);x.classList.toggle('correct',x.dataset.answer===q[2]);});$('score').innerHTML=`${score}<span> / ${questions.length}</span>`;$('feedback').innerHTML=`<b>${correct?'Exactly right.':'Good attempt. The answer is '+q[2]+'.'}</b><br>${escapeHTML(q[3])}`;$('quizSentence').innerHTML=escapeHTML(q[1]).replace('___',`<span class="gap">${q[2]}</span>`);$('quizNext').hidden=false;$('quizNext').textContent=qi===questions.length-1?'See my result →':'Next question →';$('quizProgress').style.width=`${(qi+1)/questions.length*100}%`;});
$('quizNext').onclick=()=>{if(qi<questions.length-1){qi++;showQuestion();}else{$('quizNumber').textContent='CHALLENGE COMPLETE';$('quizTopic').textContent='Well done for finishing';$('quizContext').textContent='Every answer is a chance to notice a pattern.';$('quizSentence').textContent=`You scored ${score} out of ${questions.length}.`;$('answers').innerHTML='';$('feedback').innerHTML=score>=25?'Strong work! Explain three of your choices to a partner.':score>=18?'You are building a good foundation. Revisit the rules you found tricky, then try again.':'Keep exploring the examples. Start with countability, then check whether the noun is specific.';$('quizNext').hidden=true;$('scoreText').textContent='Completed! You can restart the challenge whenever you like.';}};
$('restart').onclick=()=>{qi=0;score=0;$('scoreText').innerHTML='One question at a time.<br>Small steps, stronger grammar.';showQuestion();};
function buildPrint(){ $('printContent').innerHTML='<h1>Article Lab · A / An / The / No Article</h1><p>B2 English study guide · Ø means no article. All examples are for learning.</p>'+Object.keys(labels).map(g=>`<h2>${labels[g]}</h2>`+rules.filter(r=>r.group===g).map(r=>`<article><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.explain)}</p><ul>${r.examples.map(e=>`<li>${format(e)}</li>`).join('')}</ul>${r.note?`<p class="print-note"><b>Keep in mind:</b> ${escapeHTML(r.note)}</p>`:''}</article>`).join('')).join('')+'<h2>Practice</h2>'+questions.map((q,i)=>`<p>${i+1}. ${escapeHTML(q[1])} <br><small>${escapeHTML(q[4])}</small></p>`).join('')+'<h2>Answer key</h2>'+questions.map((q,i)=>`<p>${i+1}. <b>${q[2]}</b> — ${escapeHTML(q[3])}</p>`).join('');}
$('print').onclick=()=>{buildPrint();window.print();};
refresh();showQuestion();
