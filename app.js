// Alisse keypad mockups. Each project lives in its link (#e=...), encrypted with the client's email.
// index.html = client view (unlock with email, edit, send changes). new.html = make a new project link.
"use strict";
const MODE=document.body.dataset.mode||"client";
const FIN=[["agedbrass","Aged Brass","#6e5b3b"],["agedbronze","Aged Bronze","#4a3f33"],["chrome","Bright Chrome","#dfe0e1"],["brushedbrass","Brushed Brass","#ad9662"],["graphite","Graphite","#33322f"],["matteblack","Matte Black","#1f1f1f"],["nickel","Satin Nickel","#b4b1ad"],["brilliantwhite","Brilliant White","#e3e1db"],["champagne","Champagne","#bcb7a2"],["archwhite","Architectural White","#eae9e4"],["snowwhite","Snow White","#f0f0f0"]];
const CASES=[["free","free-form"],["title","Title Case"],["caps","ALL CAPS"],["lower","all lower case"]];
const LAYOUTS=["1","2","3","1 + 1","1 + 3","2 + 2","3 + 1","3 + 3","1 + 1 + 1","1 + 3 + 3","2 + 2 + 2","3 + 3 + 1","3 + 3 + 3"];
const $=id=>document.getElementById(id);
const clone=o=>JSON.parse(JSON.stringify(o));
const ls={get(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};

// ---------- state ----------
let D={id:"",title:"",replyTo:"",rev:0,kp:[]};   // project
let ORIG=null;                                    // the version the link opened with (for "Undo all my changes")
const st={finish:"nickel",case:"free",size:"14",floor:"All"};
let EMAIL="";                                     // the email that unlocked this project (client mode)
const B={client:"",reply:""};                     // builder-only fields
function fix(){if(!FIN.some(f=>f[0]===st.finish))st.finish="nickel";if(!CASES.some(c=>c[0]===st.case))st.case="free";if(!["14","12"].includes(st.size))st.size="14"}
function validKp(kp){return Array.isArray(kp)&&kp.every(k=>k&&Array.isArray(k.cols)&&Array.isArray(k.labels))}
function save(){
  if(MODE==="builder"){ls.set("kpBuilder",{d:D,st:pickSt(),b:B});const o=$("bOut");if(o)o.hidden=true}
  else if(D.id)ls.set("kp:"+D.id,{d:D,st:pickSt(),rev:D.rev});
}
const pickSt=()=>({finish:st.finish,case:st.case,size:st.size});

// ---------- engraving rules (same as the Google Sheet) ----------
const CHAR_W=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584],LINE_LIMIT_14=5558;
function textWidth(s){let w=0;for(const ch of s){const c=ch.charCodeAt(0);w+=(c>=32&&c<=126)?CHAR_W[c-32]:556}return w}
function fitLines(s,pt){const lim=LINE_LIMIT_14*14/pt,out=[];let cur="";
  for(const w of s.split(/\s+/).filter(Boolean)){if(textWidth(w)>lim)return null;const t=cur?cur+" "+w:w;
    if(textWidth(t)<=lim)cur=t;else{out.push(cur);cur=w}}
  if(cur)out.push(cur);return out.length<=2?out:null}
function kase(t){if(st.case==="caps")return t.toUpperCase();if(st.case==="lower")return t.toLowerCase();
  if(st.case==="title")return t.toLowerCase().replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase());return t}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
const tooLong=l=>l.trim()&&!fitLines(kase(l.trim()),+st.size);

// ---------- drawing ----------
const YS={1:[50],2:[32,68],3:[25,50,75]};
const XS={1:[50],2:[33,67],3:[25,50,75]};
const layName=cols=>cols.join(" + ");
function plate(k){
  const nc=k.cols.length,bad=[],cells=[];let idx=0;
  k.cols.forEach((cnt,ci)=>{const ys=YS[cnt]||[50];
    for(let i=0;i<cnt;i++,idx++){
      const raw=(k.labels[idx]||"").trim(),t=kase(raw),ln=raw?fitLines(t,+st.size):[];
      if(raw&&!ln)bad.push(raw);
      const html=!raw?"":ln?ln.map(esc).join("<br>"):"⚠ "+esc(t);
      cells.push(`<div class="cell" style="left:${XS[nc][ci]}%;top:${ys[i]}%"><i class="bt"></i><span class="tx${raw&&!ln?" bad":""}">${html}</span></div>`);
    }});
  return {html:`<div class="plate ${nc===1?"one":nc===2?"two":"three"}">${cells.join("")}</div>`,bad};
}
const floors=()=>[...new Set(D.kp.map(k=>k.floor||"No floor"))];
const wallCls=()=>`f-${st.finish} ${st.size==="12"?"pt12":""}`;
function render(){
  const name=D.title||(MODE==="builder"?"New project":"Your");
  $("title").textContent=name+" keypads";document.title=name+" keypads";
  const fl=floors();if(st.floor!=="All"&&!fl.includes(st.floor))st.floor="All";
  segItems("floorSel",["All",...fl].map(f=>[f,f]),"floor");
  $("out").innerHTML=fl.filter(f=>st.floor==="All"||f===st.floor).map(f=>{
    const ks=D.kp.map((k,i)=>[k,i]).filter(([k])=>(k.floor||"No floor")===f);
    return `<section class="floor"><h2>${esc(/basement|floor|level|attic|roof|garage|cellar/i.test(f)?f:f+" floor")} · ${ks.length} keypad${ks.length===1?"":"s"}</h2><div class="grid">${ks.map(([k,i])=>{
      const p=plate(k),nb=k.cols.reduce((a,b)=>a+b,0);
      return `<div class="kp" tabindex="0" role="button" data-i="${i}" aria-label="Edit keypad ${esc(k.n)}"><div class="wallbox ${wallCls()}">${p.html}</div><div class="cap"><b>Keypad ${esc(k.n)}<span class="tag">${nb}-button</span></b><small>${esc(k.loc||"")}</small>${p.bad.length?`<span class="warn">Too long for Lutron: ${p.bad.map(esc).join(", ")}</span>`:""}<span class="edit">Tap to edit</span></div></div>`}).join("")}</div></section>`;
  }).join("")||`<p class="hint">No keypads yet. Tap “+ Add keypad”${MODE==="builder"?", or paste them from the Google Sheet above":""}.</p>`;
}
function segItems(id,items,key){
  const el=$(id);
  if(items)el.innerHTML=items.map(([v,l,c])=>`<button type="button" data-v="${esc(v)}">${c?`<i class="sw" style="background:${c}"></i>`:""}${esc(l)}</button>`).join("");
  el.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===st[key]));
  if(!el.dataset.bound){el.dataset.bound=1;el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;st[key]=b.dataset.v;save();
    el.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===st[key]));render()})}
}
function initBar(){fix();segItems("finish",FIN,"finish");segItems("case",CASES,"case");segItems("size",[["14","14 pt"],["12","12 pt"]],"size")}

// ---------- keypad editor ----------
const ed=$("ed");let cur=-1;
$("edLay").innerHTML=LAYOUTS.map(l=>`<option value="${l}">${l==="1"?"1 button":/\+/.test(l)?l.split(" + ").length+" columns: "+l:l+" buttons, 1 column"}</option>`).join("");
const COLNAME={1:["Buttons (top to bottom)"],2:["Left column (top to bottom)","Right column (top to bottom)"],3:["Left column","Middle column","Right column"]};
function openEd(i){cur=i;const k=D.kp[i];
  $("edTitle").textContent="Keypad "+k.n;$("edN").value=k.n;$("edLoc").value=k.loc||"";$("edFloor").value=k.floor||"";
  $("floorList").innerHTML=floors().map(f=>`<option value="${esc(f)}">`).join("");
  const sel=$("edLay"),ln=layName(k.cols);
  if(![...sel.options].some(o=>o.value===ln))sel.insertAdjacentHTML("beforeend",`<option value="${ln}">${ln}</option>`);
  sel.value=ln;buildInputs();edPreview();
  if(ed.showModal)ed.showModal();else ed.setAttribute("open","");
}
function buildInputs(){const k=D.kp[cur];let idx=0;const nc=k.cols.length;
  $("edCols").innerHTML=k.cols.map((cnt,ci)=>{let h=`<div><p class="colh">${(COLNAME[nc]||[])[ci]||"Column "+(ci+1)}</p>`;
    for(let i=0;i<cnt;i++,idx++)h+=`<div class="bl"><input data-b="${idx}" value="${esc(k.labels[idx]||"")}" placeholder="Button ${idx+1} name (blank = no engraving)" autocomplete="off" aria-label="Button ${idx+1} name"><small data-m="${idx}"></small></div>`;
    return h+"</div>"}).join("");
  checkInputs();
}
function checkInputs(){const k=D.kp[cur];
  document.querySelectorAll("#edCols input").forEach(inp=>{const i=+inp.dataset.b,raw=(k.labels[i]||"").trim(),m=document.querySelector(`#edCols small[data-m="${i}"]`);
    if(!raw){inp.classList.remove("bad");m.className="";m.textContent="No engraving";return}
    const ln=fitLines(kase(raw),+st.size);inp.classList.toggle("bad",!ln);m.className=ln?"":"bad";
    m.textContent=ln?(ln.length===2?"Fits on 2 lines: "+ln.join(" / "):"Fits on 1 line"):"Too long for Lutron's engraving (2 lines max). Shorten it or add a space to split it.";
  });
}
function edPreview(){$("edPv").className="pv "+wallCls();$("edPv").innerHTML=plate(D.kp[cur]).html}
function changed(){save();render();if(cur>=0)edPreview();toast("Saved on this device")}
$("edCols").addEventListener("input",e=>{const i=e.target.dataset.b;if(i===undefined)return;D.kp[cur].labels[+i]=e.target.value;checkInputs();changed()});
$("edN").addEventListener("input",e=>{D.kp[cur].n=e.target.value;$("edTitle").textContent="Keypad "+e.target.value;changed()});
$("edLoc").addEventListener("input",e=>{D.kp[cur].loc=e.target.value;changed()});
$("edFloor").addEventListener("change",e=>{D.kp[cur].floor=e.target.value.trim()||"No floor";changed()});
$("edLay").addEventListener("change",e=>{const k=D.kp[cur];k.cols=parseLayout(e.target.value);
  const n=k.cols.reduce((a,b)=>a+b,0);k.labels=k.labels.slice(0,n);while(k.labels.length<n)k.labels.push("");buildInputs();changed()});
let delArm=0;
$("edDel").addEventListener("click",()=>{const b=$("edDel");
  if(Date.now()-delArm>4000){delArm=Date.now();b.textContent="Tap again to delete";setTimeout(()=>{b.textContent="Delete keypad"},4000);return}
  delArm=0;b.textContent="Delete keypad";const k=D.kp[cur];D.kp.splice(cur,1);ed.close();save();render();toast("Keypad "+k.n+" deleted")});
$("edDup").addEventListener("click",()=>{const k=clone(D.kp[cur]);k.n=nextN();D.kp.splice(cur+1,0,k);save();render();openEd(cur+1);toast("Copied as keypad "+k.n)});
ed.addEventListener("close",()=>{cur=-1;delArm=0;$("edDel").textContent="Delete keypad"});
function nextN(){const ns=D.kp.map(k=>parseInt(k.n,10)).filter(n=>!isNaN(n));return String((ns.length?Math.max(...ns):0)+1)}
$("addBtn").addEventListener("click",()=>{const fl=st.floor!=="All"?st.floor:(D.kp.length?D.kp[D.kp.length-1].floor:"First");
  D.kp.push({n:nextN(),floor:fl,loc:"",cols:[3],labels:["","",""]});save();render();openEd(D.kp.length-1)});
$("out").addEventListener("click",e=>{const k=e.target.closest(".kp");if(k)openEd(+k.dataset.i)});
$("out").addEventListener("keydown",e=>{const k=e.target.closest(".kp");if(k&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openEd(+k.dataset.i)}});

// ---------- layouts and importing from the Google Sheet ----------
function parseLayout(s){const c=String(s||"").split(/[+,]/).map(x=>parseInt(x,10)).filter(n=>n>=1&&n<=3);return c.length&&c.length<=3?c:null}
function guessLayout(n){return n<=0?[1]:n<=3?[n]:n===4?[2,2]:n===5?[3,2]:n<=6?[3,3]:n<=9?[3,3,Math.min(3,n-6)]:[3,3,3]}
function parseTable(text){
  const lines=text.replace(/\r/g,"").split("\n").filter(l=>l.trim());
  const tab=lines.some(l=>l.includes("\t"));
  const csvRow=l=>{const out=[];let cur="",q=false;for(let i=0;i<l.length;i++){const c=l[i];
    if(q){if(c==='"'&&l[i+1]==='"'){cur+='"';i++}else if(c==='"')q=false;else cur+=c}
    else if(c==='"')q=true;else if(c===","){out.push(cur);cur=""}else cur+=c}out.push(cur);return out};
  const rows=lines.map(l=>tab?l.split("\t"):csvRow(l)).map(r=>r.map(c=>c.trim()));
  const kp=[];
  for(const r of rows){
    if(/^keypad$/i.test(r[0])||/^project:?$/i.test(r[0])||/^pick a layout/i.test(r[0]))continue;
    if(!r.some(Boolean))continue;
    const labels=r.slice(4,13);while(labels.length&&!labels[labels.length-1])labels.pop();
    let cols=parseLayout(r[3]);if(!cols)cols=guessLayout(labels.length);
    const n=cols.reduce((a,b)=>a+b,0);const lb=labels.slice(0,n);while(lb.length<n)lb.push("");
    kp.push({n:r[0]||String(kp.length+1),floor:r[1]||"First",loc:r[2]||"",cols,labels:lb});
  }
  return kp;
}

// ---------- encrypted links ----------
const b64u={enc:u8=>{let s="";for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
  dec:s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0))}};
async function pipe(u8,stream){return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer())}
const normEmail=e=>String(e||"").trim().toLowerCase();
async function keyFor(email,salt,usage){
  const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(normEmail(email)),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:150000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,[usage]);
}
async function seal(obj,email){
  let data=new TextEncoder().encode(JSON.stringify(obj)),flag=0;
  if(window.CompressionStream){try{data=await pipe(data,new CompressionStream("deflate-raw"));flag=1}catch(e){}}
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},await keyFor(email,salt,"encrypt"),data));
  const all=new Uint8Array(1+16+12+ct.length);all[0]=flag;all.set(salt,1);all.set(iv,17);all.set(ct,29);return b64u.enc(all);
}
async function open_(token,email){
  const all=b64u.dec(token),flag=all[0],salt=all.slice(1,17),iv=all.slice(17,29),ct=all.slice(29);
  let data=new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv},await keyFor(email,salt,"decrypt"),ct));
  if(flag===1)data=await pipe(data,new DecompressionStream("deflate-raw"));
  return JSON.parse(new TextDecoder().decode(data));
}
const siteBase=()=>new URL("./",location.href).href;
async function makeLink(email){return siteBase()+"#e="+await seal({v:1,id:D.id,title:D.title,replyTo:D.replyTo,rev:D.rev,kp:D.kp,st:pickSt()},email)}

// ---------- send changes (client) ----------
const sd=$("sd");
$("sendBtn").addEventListener("click",async()=>{
  $("sdMail").removeAttribute("href");if(sd.showModal)sd.showModal();else sd.setAttribute("open","");
  D.rev=Date.now();save();
  const url=await makeLink(EMAIL);
  const bad=D.kp.flatMap(k=>k.labels.filter(tooLong));
  $("sdWarn").innerHTML=bad.length?`<div class="banner">Still too long for Lutron: ${bad.map(esc).join(", ")}. You can send anyway, but these need shortening before ordering.</div>`:"";
  const subj=(D.title||"Project")+" keypad changes";
  const body="Here are my keypad changes. Open this link and use the same email as before:\n\n"+url+"\n";
  $("sdMail").href="mailto:"+encodeURIComponent(D.replyTo||"")+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
  $("sdCopy").onclick=()=>copy(url);
});
async function copy(t){try{await navigator.clipboard.writeText(t);toast("Link copied")}catch(e){window.prompt("Copy this link:",t)}}

// ---------- CSV, print, reset ----------
$("csvBtn").addEventListener("click",()=>{
  const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':String(v);
  const rows=[["Keypad","Floor","Location","Layout",...Array.from({length:9},(_,i)=>"Button "+(i+1))]];
  D.kp.forEach(k=>rows.push([k.n,k.floor,k.loc,layName(k.cols),...Array.from({length:9},(_,i)=>k.labels[i]||"")]));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(",")).join("\r\n")],{type:"text/csv"}));
  a.download=(D.title||"keypads").replace(/[^\w -]/g,"")+" keypads.csv";document.body.appendChild(a);a.click();a.remove();
});
$("printBtn").addEventListener("click",()=>window.print());
let resetArm=0;$("resetBtn").addEventListener("click",e=>{const b=e.currentTarget;
  if(Date.now()-resetArm>4000){resetArm=Date.now();b.textContent="Tap again to undo everything";setTimeout(()=>b.textContent="Undo all my changes",4000);return}
  resetArm=0;b.textContent="Undo all my changes";
  if(MODE==="builder"){D={id:"",title:"",replyTo:"",rev:0,kp:[]};B.client="";B.reply="";ls.del("kpBuilder");builderFill()}
  else{D=clone(ORIG.d);Object.assign(st,ORIG.st);ls.del("kp:"+D.id)}
  initBar();render();toast(MODE==="builder"?"Started over":"Back to the version in the link")});
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),1400)}

// ---------- client start: unlock with email ----------
function showGate(msg){
  const g=$("gate");g.hidden=false;$("app").hidden=true;
  if(msg!==undefined)$("gateErr").textContent=msg;
}
async function tryOpen(token,email){
  try{const p=await open_(token,email);if(!p||!validKp(p.kp))throw 0;return p}catch(e){return null}
}
function useProject(p,email){
  EMAIL=normEmail(email);
  const emails=ls.get("kp:emails")||[];if(!emails.includes(EMAIL)){emails.unshift(EMAIL);ls.set("kp:emails",emails.slice(0,10))}
  ls.set("kp:lastLink",location.hash);
  ORIG={d:{id:p.id,title:p.title,replyTo:p.replyTo||"",rev:p.rev||0,kp:p.kp},st:p.st||{}};
  const local=ls.get("kp:"+p.id);
  if(local&&validKp(local.d&&local.d.kp)&&(local.rev||0)>=(p.rev||0)){D=local.d;Object.assign(st,local.st||{})}
  else{D=clone(ORIG.d);Object.assign(st,ORIG.st);
    if(local)$("banner").innerHTML=`<div class="banner">This link is newer than what was saved on this device, so you're seeing the link's version.</div>`;
    save()}
  $("gate").hidden=true;$("app").hidden=false;initBar();render();
}
async function startClient(){
  const m=location.hash.match(/^#e=([A-Za-z0-9_-]+)$/);
  if(!m){const last=ls.get("kp:lastLink");$("gateLanding").hidden=false;$("gateForm").hidden=true;
    if(last){$("gateLast").hidden=false;$("gateLast").href=last}
    $("gate").hidden=false;return}
  const token=m[1];
  for(const e of (ls.get("kp:emails")||[])){const p=await tryOpen(token,e);if(p){useProject(p,e);return}}
  showGate("");$("gateEmail").focus();
  $("gateForm").onsubmit=async ev=>{ev.preventDefault();const e=$("gateEmail").value;if(!e.trim())return;
    $("gateBtn").disabled=true;$("gateErr").textContent="Opening…";
    const p=await tryOpen(token,e);$("gateBtn").disabled=false;
    if(p)useProject(p,e);else $("gateErr").textContent="That email doesn't open this link. Use the email the link was sent to."};
}
window.addEventListener("hashchange",()=>{if(MODE==="client")location.reload()});

// ---------- builder (new.html) ----------
function builderFill(){
  $("bTitle").value=D.title;$("bClient").value=B.client;$("bReply").value=B.reply;$("bOut").hidden=true;
}
function startBuilder(){
  const s=ls.get("kpBuilder");
  if(s&&s.d&&validKp(s.d.kp)){D=s.d;Object.assign(st,s.st||{});Object.assign(B,s.b||{})}
  $("sendBtn").hidden=true;$("resetBtn").textContent="Undo all my changes";
  $("builder").innerHTML=$("builderTpl").innerHTML;
  builderFill();
  $("bTitle").addEventListener("input",e=>{D.title=e.target.value;save();render()});
  $("bClient").addEventListener("input",e=>{B.client=e.target.value.trim();save()});
  $("bReply").addEventListener("input",e=>{B.reply=e.target.value.trim();save()});
  $("bImport").addEventListener("click",()=>{const kp=parseTable($("bPaste").value);
    if(!kp.length){toast("Nothing to import. Copy the rows from the Keypads tab first.");return}
    D.kp=kp;save();render();$("bPaste").value="";toast(kp.length+" keypads imported")});
  $("bFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;const kp=parseTable(await f.text());
    if(!kp.length){toast("No keypads found in that file");return}D.kp=kp;save();render();e.target.value="";toast(kp.length+" keypads imported")});
  $("bMake").addEventListener("click",async()=>{
    const err=[];if(!D.title.trim())err.push("a project name");if(!/^\S+@\S+\.\S+$/.test(B.client))err.push("the client's email");if(!D.kp.length)err.push("at least one keypad");
    if(err.length){$("bErr").textContent="Add "+err.join(", ")+" first.";return}
    $("bErr").textContent="";
    D.id=D.id||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2));
    D.replyTo=B.reply;D.rev=Date.now();save();
    const url=await makeLink(B.client);
    $("bLink").textContent=url;$("bOut").hidden=false;
    $("bCopy").onclick=()=>copy(url);
    const body=`Here are your keypads for ${D.title}. Open the link, enter this email address (${B.client}), and tap any keypad to change the button names. When you're done, tap "Send changes".\n\n${url}\n`;
    $("bMail").href="mailto:"+encodeURIComponent(B.client)+"?subject="+encodeURIComponent(D.title+" keypads")+"&body="+encodeURIComponent(body);
    $("bOpen").href=url;
  });
  $("app").hidden=false;initBar();render();
}

if(MODE==="builder")startBuilder();else startClient();
