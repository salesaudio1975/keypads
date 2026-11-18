// Alisse keypad mockups. Each project lives in its link (#e=...), encrypted with the client's email.
// index.html = client view (unlock with email, edit, send changes). projects.html = the team page (projects list + make a project link; new.html forwards there).
"use strict";
const MODE=document.body.dataset.mode||"client";
const VERSION="11-18-26B";   // shown at the bottom of every page; bump with each release
const FIN=[["agedbrass","Aged Brass","#6e5b3b"],["agedbronze","Aged Bronze","#4a3f33"],["chrome","Bright Chrome","#dfe0e1"],["brushedbrass","Brushed Brass","#ad9662"],["graphite","Graphite","#33322f"],["matteblack","Matte Black","#1f1f1f"],["nickel","Satin Nickel","#b4b1ad"],["brilliantwhite","Brilliant White","#e3e1db"],["champagne","Champagne","#bcb7a2"],["archwhite","Architectural White","#eae9e4"],["snowwhite","Snow White","#f0f0f0"]];
// Other Lutron families. g = plate geometry in inches [W,H, keys X,Y,W,H, gap, raise/lower row] (from the Keypad Editor)
const FAMS={alisse:{n:"Alisse",fg:"alisse"},
  pal:{n:"Palladiom",fg:"pal",pt:14,z:1.25,g:[2.95,4.71,.825,.95,1.3,2.8,0,.45]},   // Lutron drawing: plate 2.95 x 4.71, keys 1.3 x 2.8
  palsq:{n:"Palladiom Square",fg:"pal",pt:14,z:1.1,g:[3.39,3.39,.42,.42,2.55,2.55,0,.42],cls:"pal"},
  see:{n:"seeTouch",fg:"see",pt:10,z:1.3,g:[2.94,4.69,.815,1.0,1.31,2.75,0,.36]},
  sun:{n:"Sunnata",fg:"sun",pt:11,z:1.3,g:[2.94,4.69,.92,1.08,1.1,2.53,.07,.32]},
  pico:{n:"Pico",fg:"pico",pt:9,z:1.7,g:[1.3,2.6,.19,.12,1.04,2.42,0,.3]}};   // Pico remote 1.30 x 2.60 (33 x 66 mm)
// [id, family, name, part, buttons per column, raise/lower]
const TYPES=[["pal-2","pal","Palladiom 2-button","HQWT-U-P2W",[2],0],["pal-3","pal","Palladiom 3-button","HQWT-U-P3W",[3],0],["pal-4","pal","Palladiom 4-button","HQWT-U-P4W",[4],0],["pal-3rl","pal","Palladiom 3-button raise/lower","HQWT-U-PRW",[3],1],
  ["palsq-4","palsq","Palladiom Square 4-button","HQWT-S-P4W",[4],0],["palsq-3rl","palsq","Palladiom Square 3-button raise/lower","HQWT-S-PRW",[3],1],["palsq-44","palsq","Palladiom Square 8-button (4+4)","HQWT-S-P44W",[4,4],0],["palsq-33rl","palsq","Palladiom Square 6-button raise/lower (3+3)","HQWT-S-PRRW",[3,3],1],
  ["see-1","see","seeTouch 1-button","HQWD-W1B",[1],0,{sl:"---b---"}],["see-2","see","seeTouch 2-button","HQWD-W2BS",[2],0,{sl:"--b-b--"}],["see-3","see","seeTouch 3-button","HQWD-W3BS",[3],0,{sl:"-b-b-b-"}],["see-3rl","see","seeTouch 3-button raise/lower","HQWD-W3BSRL",[3],1,{sl:"b-b-b-r"}],["see-3s","see","seeTouch 3-scene raise/lower","HQWD-W3S",[3],1,{sl:"bbb---r"}],["see-4","see","seeTouch 4-button","HQWD-W4BS",[4],0,{sl:"b-b-b-b"}],["see-4s","see","seeTouch 4-scene raise/lower","HQWD-W4S",[4],1,{sl:"bbbb--r"}],["see-5","see","seeTouch 5-button","HQWD-W5B",[5],0,{sl:"-bbbbb-"}],
  ["see-5rl","see","seeTouch 5-button raise/lower","HQWD-W5BRL",[5],1,{sl:"bbbbb-r"}],["see-5ir","see","seeTouch 5-button raise/lower + IR","HQWD-W5BIR",[5],1,{sl:"bbbbbir"}],["see-6","see","seeTouch 6-button","HQWD-W6B",[6],0,{sl:"bbbbbb-"}],["see-6rl","see","seeTouch 6-button raise/lower","HQWD-W6BRL",[6],1,{sl:"bbbbbbr"}],["see-7","see","seeTouch 7-button","HQWD-W7B",[7],0,{sl:"bbbbbbb"}],["see-1rld","see","seeTouch dual group raise/lower (3+2)","HQWD-W1RLD",[5],1,{sl:"bbb-bbr"}],["see-2rld","see","seeTouch dual group, 2 raise/lower (2+2)","HQWD-W2RLD",[4],1,{sl:"bbr-bbr"}],["see-3bd","see","seeTouch dual group (3+3)","HQWD-W3BD",[6],0,{sl:"bbb-bbb"}],
  ["seh-1rld","see","seeTouch hybrid dual group raise/lower (3+2)","HQRD-HN1RLD",[5],1,{sl:"bbb-bbr",hy:1}],["seh-2rld","see","seeTouch hybrid dual group, 2 raise/lower (2+2)","HQRD-HN2RLD",[4],1,{sl:"bbr-bbr",hy:1}],["seh-3rl","see","seeTouch hybrid 3-button raise/lower","HQRD-HN3BSRL",[3],1,{sl:"b-b-b-r",hy:1}],["seh-3s","see","seeTouch hybrid 3-scene raise/lower","HQRD-HN3S",[3],1,{sl:"bbb---r",hy:1}],["seh-4s","see","seeTouch hybrid 4-scene raise/lower","HQRD-HN4S",[4],1,{sl:"bbbb--r",hy:1}],["seh-5rl","see","seeTouch hybrid 5-button raise/lower","HQRD-HN5BRL",[5],1,{sl:"bbbbb-r",hy:1}],["seh-6rl","see","seeTouch hybrid 6-button raise/lower","HQRD-HN6BRL",[6],1,{sl:"bbbbbbr",hy:1}],
  ["sun-2","sun","Sunnata 2-button","HRST-W2B",[2],0],["sun-3rl","sun","Sunnata 3-button raise/lower","HRST-W3RL",[3],1],["sun-4","sun","Sunnata 4-button","HRST-W4B",[4],0],
  ["sunh-2","sun","Sunnata hybrid 2-button","HRST-HN2B",[2],0,{hy:1}],["sunh-3rl","sun","Sunnata hybrid 3-button raise/lower","HRST-HN3RL",[3],1,{hy:1}],["sunh-4","sun","Sunnata hybrid 4-button","HRST-HN4B",[4],0,{hy:1}],
  ["pico-2","pico","Pico 2-button","PJ2-2B",[2],0],["pico-2rl","pico","Pico 2-button raise/lower","PJ2-2BRL",[2],1],["pico-3","pico","Pico 3-button","PJ2-3B",[3],0],["pico-3rl","pico","Pico 3-button raise/lower","PJ2-3BRL",[3],1],["pico-4","pico","Pico 4-button","PJ2-4B",[4],0]];
// finish groups [code, name, swatch]; colors on screen are close, not exact
const PLASTIC=[["WH","White","#fbfbf8"],["IV","Ivory","#f3ecd8"],["LA","Light Almond","#eee3cf"],["AL","Almond","#e6d6bb"],["BE","Beige","#d9c9ac"],["TP","Taupe","#a99c8a"],["GR","Gray","#9a9a98"],["SI","Sienna","#8a5a3c"],["BR","Brown","#5a3d2b"],["BL","Black","#1b1b1b"]];
const METAL=[["SN","Satin Nickel","#b9b6ad"],["BN","Bright Nickel","#d4d4d0"],["SC","Satin Chrome","#c3c6c8"],["BC","Bright Chrome","#e3e6e8"],["SB","Satin Brass","#c2a46a"],["BB","Bright Brass","#d9b860"],["QB","Antique Brass","#8f7448"],["CP","Champagne","#cdb894"],["GP","Graphite","#55565a"],["PG","Polished Graphite","#3c3d40"]];
const FG={alisse:null,
  pal:[...METAL,["CWH","Clear White Glass","#f7f7f7"],["CBL","Clear Black Glass","#111111"],...PLASTIC],
  see:[...PLASTIC,...METAL],
  sun:[["WH","White","#fbfbf8"],["LA","Light Almond","#eee3cf"],["IV","Ivory","#f3ecd8"],["BL","Black","#1b1b1b"],["SW","Snow","#f4f4f2"],["PM","Pumice","#e2dccc"],["RW","Architectural White","#ecebe6"],["BI","Biscuit","#e7dcc6"],["TP","Taupe","#a99c8a"],["MN","Midnight","#2a2d33"]],
  pico:[["WH","White","#fbfbf8"],["SW","Snow","#f4f4f2"],["IV","Ivory","#f3ecd8"],["LA","Light Almond","#eee3cf"],["AL","Almond","#e6d6bb"],["BE","Beige","#d9c9ac"],["TP","Taupe","#a99c8a"],["GR","Gray","#9a9a98"],["BR","Brown","#5a3d2b"],["BL","Black","#1b1b1b"],["MN","Midnight","#2a2d33"]]};
const GROUPS=["alisse","pal","see","sun","pico"],GDEF={pal:"WH",see:"WH",sun:"WH",pico:"WH"};
const TALIAS={"see-1rl":"see-1","see-2rl":"see-2"};   // early names
const typeOf=k=>k&&k.type?TYPES.find(t=>t[0]===(TALIAS[k.type]||k.type))||null:null;
const famOf=k=>{const t=typeOf(k);return t?t[1]:"alisse"};
const grpOf=k=>FAMS[famOf(k)].fg;
const finList=g=>g==="alisse"?FIN:FG[g];
// Alisse finish codes from Lutron's spec sheet 3691154
const ACODE={agedbrass:"AB",agedbronze:"AZ",brushedbrass:"BRB",nickel:"SN",chrome:"BC",graphite:"GP",champagne:"CP",snowwhite:"SWH",matteblack:"BL",archwhite:"AWH",brilliantwhite:"BWH"};
const codeOf=(g,v)=>MODE!=="builder"?"":g==="alisse"?(ACODE[v]?" ("+ACODE[v]+")":""):" ("+v+")";   // Lutron finish code, team page only
const CASES=[["free","free-form"],["title","Title Case"],["caps","ALL CAPS"],["lower","all lower case"]];
const LAYOUTS=["1","2","3","1 + 1","1 + 3","2 + 2","3 + 1","3 + 3","1 + 1 + 1","1 + 3 + 3","2 + 2 + 2","3 + 3 + 1","3 + 3 + 3"];
const $=id=>document.getElementById(id);
const clone=o=>JSON.parse(JSON.stringify(o));
const ls={get(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};

// ---------- state ----------
let D={id:"",title:"",replyTo:"",rev:0,kp:[]};   // project
let ORIG=null;                                    // the version the link opened with (for "Undo all my changes")
const st={finish:"nickel",case:"free",size:"14",floor:"All"};
let EMAIL="";
let PF="nickel";                                  // the project's Alisse finish (locked in the link)
let PFX={...GDEF};                                // the project's finish for each other family
st.fx={...GDEF};                                  // the finish being looked at, each other family
const B={client:"",reply:""};                     // builder-only fields
function fixFx(o){const r={...GDEF};for(const g in GDEF)if(o&&FG[g].some(f=>f[0]===o[g]))r[g]=o[g];return r}
function fix(){st.fx=fixFx(st.fx);if(!FIN.some(f=>f[0]===st.finish))st.finish="nickel";if(!CASES.some(c=>c[0]===st.case))st.case="free";if(!["14","12"].includes(st.size))st.size="14"}
function validKp(kp){return Array.isArray(kp)&&kp.every(k=>k&&Array.isArray(k.cols)&&Array.isArray(k.labels))}
const curFin=g=>g==="alisse"?st.finish:st.fx[g];
const projFin=g=>MODE==="builder"?curFin(g):g==="alisse"?PF:PFX[g];
function setCur(g,v){if(g==="alisse")st.finish=v;else st.fx[g]=v}
function setProj(g,v){if(g==="alisse")PF=v;else PFX[g]=v}
const finOk=(g,v)=>finList(g).some(f=>f[0]===v);
const kFin=k=>{const g=grpOf(k);return k&&k.finish&&finOk(g,k.finish)?k.finish:curFin(g)};
function save(){
  if(MODE==="builder"){ls.set("kpBuilder",{d:D,st:pickSt(),b:B});const o=$("bOut");if(o)o.hidden=true;bSum()}
  else if(D.id){ls.set("kp:"+D.id,{d:D,st:pickSt(),rev:D.rev,pf:PF,pfx:PFX});if(LIVE)track("edit")}
}
const pickSt=()=>({finish:st.finish,fx:{...st.fx},case:st.case,size:st.size});

// ---------- engraving rules (same as the Google Sheet) ----------
const CHAR_W=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584],LINE_LIMIT_14=5558;
function textWidth(s){let w=0;for(const ch of s){const c=ch.charCodeAt(0);w+=(c>=32&&c<=126)?CHAR_W[c-32]:556}return w}
const NINE=textWidth("ABCDEFGHI");   // Palladiom, seeTouch, Sunnata, Pico: 9 capital letters a line for now
const limitOf=k=>famOf(k)==="alisse"?LINE_LIMIT_14*14/+st.size:NINE;
function fitLines(s,lim){const out=[];let cur="";
  for(const w of s.split(/\s+/).filter(Boolean)){if(textWidth(w)>lim)return null;const t=cur?cur+" "+w:w;
    if(textWidth(t)<=lim)cur=t;else{out.push(cur);cur=w}}
  if(cur)out.push(cur);return out.length<=2?out:null}
function kase(t){if(st.case==="caps")return t.toUpperCase();if(st.case==="lower")return t.toLowerCase();
  if(st.case==="title")return t.toLowerCase().replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase());return t}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
const tooLong=(l,k)=>l.trim()&&!fitLines(kase(l.trim()),limitOf(k));

// ---------- what changed since the team sent the link (Jeff, Nov 18: "some way for me to see that that button has been edited") ----------
// "Make client link" stamps each keypad with what was sent (k.sent) and the project with the list sent (D.sent)
const T=s=>String(s||"").replace(/\s+/g," ").trim();
const chgB=(k,i)=>!!(k.sent&&T(k.labels[i])!==T(k.sent.l[i]));
function kpChg(k){const c={btns:[],type:false,where:false,isNew:false,note:T(k.note)&&T(k.note)!==T(k.sent&&k.sent.note)?T(k.note):""};
  if(!k.sent){c.isNew=!!(D.sent&&D.sent.length);}
  else{k.labels.forEach((l,i)=>{if(chgB(k,i))c.btns.push(i)});c.type=typeName(k)!==k.sent.ty;c.where=T(k.loc)!==T(k.sent.loc)||T(k.floor)!==T(k.sent.floor)}
  c.any=!!(c.btns.length||c.type||c.where||c.isNew||c.note);return c}
const gone=()=>{if(!D.sent)return[];const now=new Set(D.kp.map(k=>T(k.n)));return D.sent.filter(x=>!now.has(T(x.n)))};
function stampSent(){D.kp.forEach(k=>{k.sent={l:k.labels.slice(),ty:typeName(k),loc:k.loc||"",floor:k.floor||"",note:k.note||""}});D.sent=D.kp.map(k=>({n:String(k.n),loc:k.loc||""}))}
let ONLY=ls.get("kp:only")===true;
function chgText(k,c){const who=MODE==="builder"?"Client ":"You ",out=[];
  if(c.isNew)out.push(who+"added this keypad");
  if(c.btns.length)out.push(who.trim()+" changed "+c.btns.map(i=>`<b>${esc(T(k.sent.l[i])||"(blank)")}</b> → <b>${esc(T(k.labels[i])||"(blank)")}</b>`).join(", "));
  if(c.type)out.push("Type was "+esc(k.sent.ty));
  if(c.where)out.push("Was "+esc([k.sent.loc,k.sent.floor].filter(Boolean).join(", ")||"no location"));
  return out.join(". ")}

// ---------- drawing ----------
const YS={1:[50],2:[32,68],3:[25,50,75]};
const XS={1:[50],2:[33,67],3:[25,50,75]};
const layName=cols=>cols.join(" + ");
function lum(h){const n=parseInt(h.slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function tint(h,a){const n=parseInt(h.slice(1),16);return "#"+[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v+a*255))).toString(16).padStart(2,"0")).join("")}
function famPlate(k){
  const t=typeOf(k),F=FAMS[t[1]],[W,H,X,Y,FW,FH,GAP,RLH]=F.g,lim=limitOf(k),bad=[];let idx=0;
  const lab=()=>{const raw=(k.labels[idx]||"").trim(),tx=kase(raw),ln=raw?fitLines(tx,lim):[];if(raw&&!ln)bad.push(raw);idx++;
    return `<span class="tx${raw&&!ln?" bad":""}">${!raw?"":ln?ln.map(esc).join("<br>"):"⚠ "+esc(tx)}</span>`};
  const sl=t[6]&&t[6].sl;
  const cols=sl?`<div class="kcol slots">${[...sl].map(c=>c==="b"?`<div class="key${chgB(k,idx)?" chg":""}">${lab()}</div>`:c==="r"?`<div class="key rl"><span>▽</span><span>△</span></div>`:c==="i"?`<div class="ir"><i></i></div>`:`<div class="gapslot"></div>`).join("")}</div>`:t[4].map(cnt=>{let h="";
    for(let i=0;i<cnt;i++,idx++){const raw=(k.labels[idx]||"").trim(),tx=kase(raw),ln=raw?fitLines(tx,lim):[];if(raw&&!ln)bad.push(raw);
      h+=`<div class="key${chgB(k,idx)?" chg":""}"><span class="tx${raw&&!ln?" bad":""}">${!raw?"":ln?ln.map(esc).join("<br>"):"⚠ "+esc(tx)}</span></div>`}
    if(t[5])h+=`<div class="key rl" style="flex:0 0 calc(var(--pw)*${RLH}/3.55)"><span>▽</span><span>△</span></div>`;
    return `<div class="kcol">${h}</div>`}).join("");
  const g=F.fg,c=(finList(g).find(f=>f[0]===kFin(k))||finList(g)[0])[2],dk=lum(c)<.18;
  const vars=`--pf:linear-gradient(150deg,${tint(c,.05)},${c} 55%,${tint(c,.025)});--pedge:rgba(0,0,0,${dk?.35:.14});--kc:${tint(c,dk?.03:-.012)};--ink:${dk?"rgba(255,255,255,.85)":"rgba(0,0,0,.85)"};--pt:${+k.pt||F.pt};--z:${F.z||1};--gap:calc(var(--pw)*${GAP}/3.55)`;
  return {html:`<div class="plate fam ${F.cls||t[1]}${dk?" dk":""}${t[6]&&t[6].hy?" hy":""}" style="width:calc(var(--pw)*${W}/3.55);aspect-ratio:${W}/${H};${vars}"><div class="keys" style="left:${(X/W*100).toFixed(2)}%;top:${(Y/H*100).toFixed(2)}%;width:${(FW/W*100).toFixed(2)}%;height:${(FH/H*100).toFixed(2)}%">${cols}</div></div>`,bad};
}
function plate(k){
  if(typeOf(k))return famPlate(k);
  const nc=k.cols.length,bad=[],cells=[];let idx=0;
  k.cols.forEach((cnt,ci)=>{const ys=YS[cnt]||[50];
    for(let i=0;i<cnt;i++,idx++){
      const raw=(k.labels[idx]||"").trim(),t=kase(raw),ln=raw?fitLines(t,limitOf(k)):[];
      if(raw&&!ln)bad.push(raw);
      const html=!raw?"":ln?ln.map(esc).join("<br>"):"⚠ "+esc(t);
      cells.push(`<div class="cell${chgB(k,idx)?" chg":""}" style="left:${XS[nc][ci]}%;top:${ys[i]}%"><i class="bt"></i><span class="tx${raw&&!ln?" bad":""}">${html}</span></div>`);
    }});
  return {html:`<div class="plate ${nc===1?"one":nc===2?"two":"three"}">${cells.join("")}</div>`,bad};
}
const floors=()=>[...new Set(D.kp.map(k=>k.floor||"No floor"))];
const wallCls=k=>typeOf(k)?"famwall":`f-${kFin(k)} ${st.size==="12"?"pt12":""}`;
const finName=(v,g="alisse")=>(finList(g).find(f=>f[0]===v)||[0,v])[1];
const typeName=k=>{const t=typeOf(k);return t?t[2]:"Alisse "+layName(k.cols)};
const tagOf=k=>{const t=typeOf(k),nb=k.cols.reduce((a,b)=>a+b,0);return (t?FAMS[t[1]].n+(t[6]&&t[6].hy?" hybrid":"")+" ":groups().length>1?"Alisse ":"")+nb+"-button"};
const groups=()=>{const s=new Set(D.kp.map(grpOf));if(!s.size)s.add("alisse");return GROUPS.filter(g=>s.has(g))};
function chgBar(){if(!D.sent)return"";const ch=D.kp.filter(k=>kpChg(k).any),nb=D.kp.reduce((a,k)=>a+kpChg(k).btns.length,0),nn=D.kp.filter(k=>kpChg(k).note).length,gn=gone();
  if(!ch.length&&!gn.length){if(ONLY){ONLY=false;ls.set("kp:only",false)}return ""}
  const who=MODE==="builder"?"The client":"You";
  const bits=[nb?nb+" button name"+(nb===1?"":"s"):"",nn?nn+" note"+(nn===1?"":"s"):"",gn.length?"removed "+gn.map(x=>"keypad "+esc(x.n)+(x.loc?" ("+esc(x.loc)+")":"")).join(", "):""].filter(Boolean);
  return `<div class="chgbar"><p><b>✎ ${who} changed ${ch.length} keypad${ch.length===1?"":"s"}</b>${bits.length?": "+bits.join(", "):""}. Changed buttons have an orange outline.</p><button type="button" class="btnx" id="onlyChg" aria-pressed="${ONLY}">${ONLY?"Show all keypads":"Show only changed"}</button></div>`}
function render(){
  const name=D.title||(MODE==="builder"?"New project":"Your");
  if(!document.body.classList.contains("plv")){$("title").textContent=name+" keypads";document.title=name+" keypads"}
  const fl=floors();if(st.floor!=="All"&&!fl.includes(st.floor))st.floor="All";
  segItems("floorSel",["All",...fl].map(f=>[f,f]),"floor");
  const gs=groups().join();if(gs!==finBar.last)finBar();
  $("size").closest(".ctl").hidden=!groups().includes("alisse");
  const tot=D.kp.length,okN=D.kp.filter(k=>k.ok).length;
  const badK=D.kp.filter(k=>k.labels.some(l=>tooLong(l,k)));
  $("out").innerHTML=(badK.length?`<div class="pagewarn" role="alert"><p><b>⚠ ${badK.length} keypad${badK.length===1?" has a name":"s have names"} too long to engrave:</b> ${badK.slice(0,6).map(k=>"keypad "+esc(k.n)+" ("+k.labels.filter(l=>tooLong(l,k)).map(l=>esc(l.trim())).join(", ")+")").join(", ")}${badK.length>6?", and "+(badK.length-6)+" more":""}. Shorten ${badK.length===1?"it":"them"} before approving.</p><button type="button" id="showBad">Show me</button></div>`:"")+chgBar()+(tot?`<div class="apbar${okN===tot?" done":""}"><p><b>${okN===tot?"Every keypad is approved.":"Check off each keypad when it's right."}</b> ${okN===tot?"Tap “Send changes” to send them to us. Tap a ✓ to unlock a keypad.":"Tap the ✓ in a keypad's corner to approve it and lock it. Tap it again to unlock."} <span class="apn">${okN} of ${tot} approved</span></p><div class="r">${okN<tot?`<button type="button" class="btnx primary" data-all="approve">✓ Approve all ${tot}</button>`:""}${okN?`<button type="button" class="btnx" data-all="unlock">Unlock all</button>`:""}</div></div>`:"")+fl.filter(f=>st.floor==="All"||f===st.floor).map(f=>{
    const ks=D.kp.map((k,i)=>[k,i]).filter(([k])=>(k.floor||"No floor")===f&&(!ONLY||kpChg(k).any));if(!ks.length)return "";
    const nOk=ks.filter(([k])=>k.ok).length,all=nOk===ks.length;
    return `<section class="floor"><h2><span>${esc(/basement|floor|level|attic|roof|garage|cellar|apartment|apt\b|unit|suite|penthouse|residence|building|wing|house/i.test(f)?f:f+" floor")} · ${ks.length} keypad${ks.length===1?"":"s"}${nOk?` · ${all?"all ":""}${nOk} approved`:""}</span><button type="button" class="btnx apf${all?"":" go"}" data-floor="${esc(f)}" data-act="${all?"unlock":"approve"}">${all?"Unlock this floor":"✓ Approve this floor"}</button></h2><div class="grid">${ks.map(([k,i])=>{
      const p=plate(k),own=k.finish&&finOk(grpOf(k),k.finish),cg=kpChg(k),ct=chgText(k,cg);
      const lp=String(k.loc||"").split("·").map(x=>x.trim()).filter(Boolean),room=lp[0]||"No location yet",spot=lp.slice(1).join(" · ")||(f==="No floor"?"":/basement|floor|level|attic|roof|garage|cellar|apartment|apt\b|unit|suite|penthouse|residence|building|wing|house/i.test(f)?f:f+" floor");
      return `<div class="kp card${k.ok?" ok":""}${p.bad.length?" toolong":""}${cg.any?" changed":""}" tabindex="0" role="button" data-i="${i}" aria-label="${k.ok?"Keypad "+esc(k.n)+", "+esc(room)+", approved":"Edit keypad "+esc(k.n)+", "+esc(room)}"><div class="khead"><span class="num${String(k.n).length>3?" long":""}">${esc(k.n)}</span><div class="kt"><b class="room">${esc(room)}</b>${spot?`<span class="spot">${esc(spot)}</span>`:""}</div><button type="button" class="okb" data-ok="${i}" aria-pressed="${!!k.ok}" title="${k.ok?"Approved. Tap to unlock":"Approve and lock this keypad"}" aria-label="${k.ok?"Unlock keypad "+esc(k.n):"Approve keypad "+esc(k.n)}">✓</button></div>${p.bad.length?`<div class="strip">⚠ Name${p.bad.length>1?"s":""} too long: <b>${p.bad.map(x=>esc(x.trim())).join(", ")}</b><span>Tap to fix</span></div>`:""}${ct?`<div class="chgstrip">✎ ${ct}</div>`:""}${T(k.note)?`<div class="notestrip"><b>Note:</b> ${esc(T(k.note))}</div>`:""}<div class="wallbox ${wallCls(k)}">${p.html}</div><div class="cap">${(()=>{const g=grpOf(k),v=kFin(k),fc=(finList(g).find(x=>x[0]===v)||[0,v,"#ccc"])[2];return `<small class="fin${own?" own":""}"><i class="sw" style="background:${fc}"></i>${esc(finName(v,g)+codeOf(g,v))}${own?" (own finish)":MODE==="client"&&v!==projFin(g)?" (previewing)":""}</small>`})()}<div class="kfoot"><span class="tag">${esc(tagOf(k))}</span>${k.ok?`<span class="appr">✓ Approved</span>`:`<span class="edit">${p.bad.length?"Tap to fix":"Tap to edit"}</span>`}</div></div></div>`}).join("")}</div></section>`;
  }).join("")||`<p class="hint">No keypads yet. Tap “+ Add keypad”${MODE==="builder"?", or paste them from the Google Sheet above":""}.</p>`;
  updSum();
}
function segItems(id,items,key,obj=st,after){
  const el=$(id);
  if(items)el.innerHTML=items.map(([v,l,c])=>`<button type="button" data-v="${esc(v)}">${c?`<i class="sw" style="background:${c}"></i>`:""}${esc(l)}</button>`).join("");
  el.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===obj[key]));
  if(!el.dataset.bound){el.dataset.bound=1;el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;obj[key]=b.dataset.v;if(after)after(b.dataset.v);else save();
    el.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===obj[key]));render()})}
}
function finBar(){
  const gs=groups(),multi=gs.length>1;finBar.last=gs.join();
  $("finBox").innerHTML=gs.map(g=>{const sx=g==="alisse"?"":"-"+g,cur=curFin(g),pj=projFin(g);
    const lab=multi?FAMS[g].n+" finish":MODE==="builder"?"Project finish":"Finish";
    return `<details class="ctl" data-k="fin${sx}"${isOpen("fin"+sx)?" open":""}><summary><span id="finLabel${sx}">${esc(lab)}</span><b class="cv">${esc(finName(cur,g))}${MODE==="client"&&cur===pj?" ★":""}</b></summary><div class="seg finseg" id="finish${sx}" data-g="${g}">${finList(g).map(([v,l,c])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}"><i class="sw" style="background:${c}"></i>${esc(l+codeOf(g,v))}${MODE==="client"&&v===pj?" ★":""}</button>`).join("")}</div><div id="finNote${sx}" class="finnote">${finNote(g,sx)}</div></details>`}).join("");updSum();
}
// settings panel: closed by default; each part remembers if it was left open on this device
const DELH='Delete<span class="hs"> keypad</span>';
const isOpen=k=>(ls.get("kp:open")||[]).includes(k);
document.addEventListener("toggle",e=>{const d=e.target;if(!d.matches||!d.matches("details[data-k]"))return;const k=d.dataset.k,o=(ls.get("kp:open")||[]).filter(x=>x!==k);if(d.open)o.push(k);ls.set("kp:open",o)},true);
function updSum(){const cv=(id,t)=>{const e=$(id);if(e)e.textContent=t};
  cv("cvCase",(CASES.find(c=>c[0]===st.case)||[0,""])[1]);cv("cvSize",st.size+" pt");cv("cvFloor",st.floor==="All"?"All floors":st.floor);cv("cvZoom",Math.round(ZOOM*100)+"%");
  const gs=groups();cv("setSum",[[...new Set(gs.map(g=>finName(curFin(g),g)))].join(", "),st.floor==="All"?"":st.floor,ZOOM===1?"":"zoom "+Math.round(ZOOM*100)+"%"].filter(Boolean).join(" · "))}
function initSettings(){document.querySelectorAll("details[data-k]").forEach(d=>{if(isOpen(d.dataset.k))d.open=true})}
function finNote(g,sx){
  if(MODE==="builder")return `<span class="small">The client's link opens in this finish. They can tap others to compare.</span>`;
  const cur=curFin(g),pj=projFin(g),nm=v=>esc(finName(v,g));
  let h=cur===pj?`<span class="small">This is your project's finish. Tap another to compare.</span>`
    :`<span class="small">Previewing <b>${nm(cur)}</b>. Your project's finish is <b>${nm(pj)}</b>.</span> <button type="button" class="btnx" id="finBack${sx}" data-act="back" data-g="${g}">Back to project finish</button> <button type="button" class="btnx primary" id="finUse${sx}" data-act="use" data-g="${g}">Use ${nm(cur)} for my project</button>`;
  const was=ORIG&&(g==="alisse"?ORIG.pf:ORIG.pfx[g]);
  if(was&&pj!==was)h+=` <span class="small">You changed this from <b>${nm(was)}</b>.</span>`;
  return h;
}
$("finBox").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.act){const g=b.dataset.g;
    if(b.dataset.act==="back")setCur(g,projFin(g));
    else{setProj(g,curFin(g));toast(FAMS[g].n+" finish set to "+finName(curFin(g),g)+". Send changes to let us know.")}
    save();finBar();render();return}
  const seg=b.closest(".finseg");if(!seg)return;setCur(seg.dataset.g,b.dataset.v);save();finBar();render();
});
// zoom: 1 = actual size (Lutron inches); remembered on this device
const ZSTEPS=[.4,.5,.6,.75,.9,1,1.25,1.5,1.75,2];
let ZOOM=(()=>{const z=+ls.get("kp:zoom");return ZSTEPS.includes(z)?z:ls.get("kp:view")==="compact"?.5:1})();
function applyView(){document.documentElement.style.setProperty("--zoom",ZOOM);if(typeof updSum==="function"&&$("setSum"))updSum();const v=$("zoomVal");if(v){v.textContent=Math.round(ZOOM*100)+"%";v.setAttribute("aria-pressed",ZOOM===1)}
  const s=$("zoomSel");if(s){s.querySelector('[data-z="-"]').disabled=ZOOM===ZSTEPS[0];s.querySelector('[data-z="+"]').disabled=ZOOM===ZSTEPS[ZSTEPS.length-1]}}
function setZoom(z){ZOOM=z;ls.set("kp:zoom",z);applyView()}
function initView(){const s=$("zoomSel");if(s&&!s.dataset.bound){s.dataset.bound=1;s.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=ZSTEPS.indexOf(ZOOM);
  if(b.dataset.z==="-")setZoom(ZSTEPS[Math.max(0,i-1)]);else if(b.dataset.z==="+")setZoom(ZSTEPS[Math.min(ZSTEPS.length-1,i+1)]);else setZoom(1)})}
  applyView()}
document.addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea,select,dialog"))return;if(e.ctrlKey||e.metaKey||e.altKey)return;const i=ZSTEPS.indexOf(ZOOM);
  if(e.key==="+"||e.key==="=")setZoom(ZSTEPS[Math.min(ZSTEPS.length-1,i+1)]);else if(e.key==="-")setZoom(ZSTEPS[Math.max(0,i-1)]);else if(e.key==="0")setZoom(1)});
function initBar(){if(!initBar.done){initBar.done=1;initSettings()}initView();fix();finBar();segItems("case",CASES,"case");segItems("size",[["14","14 pt"],["12","12 pt"]],"size")}

// ---------- keypad editor ----------
const ed=$("ed");let cur=-1,edSnap=null,edKeep=false;
const layLabel=l=>l==="1"?"1 button":/\+/.test(l)?l.split(" + ").length+" columns: "+l:l+" buttons, 1 column";
$("edLay").innerHTML=`<optgroup label="Alisse">${LAYOUTS.map(l=>`<option value="a:${l}">Alisse ${layLabel(l)}</option>`).join("")}</optgroup>`+
  [["pal",0],["palsq",0],["see",0],["see",1],["sun",0],["sun",1],["pico",0]].map(([f,h])=>`<optgroup label="${FAMS[f].n}${h?" hybrid (keypad + dimmer)":""}">${TYPES.filter(t=>t[1]===f&&!!(t[6]&&t[6].hy)===!!h).map(t=>`<option value="${t[0]}">${esc(t[2])}${t[3]?" · "+t[3]:""}</option>`).join("")}</optgroup>`).join("");
function fillFin(){const k=D.kp[cur],g=grpOf(k);
  $("edFin").innerHTML=`<option value="">Same as project (${esc(finName(projFin(g),g))})</option>`+finList(g).map(([v,l])=>`<option value="${v}">${esc(l+codeOf(g,v))}</option>`).join("");
  $("edFin").value=k.finish&&finOk(g,k.finish)?k.finish:""}
const COLNAME={1:["Buttons (top to bottom)"],2:["Left column (top to bottom)","Right column (top to bottom)"],3:["Left column","Middle column","Right column"]};
function openEd(i){cur=i;edFocus=-1;const k=D.kp[i];edSnap=clone(k);edKeep=false;ed.returnValue="";
  $("edTitle").textContent="Keypad "+k.n;$("edN").value=k.n;$("edLoc").value=k.loc||"";$("edFloor").value=k.floor||"";
  $("floorList").innerHTML=floors().map(f=>`<option value="${esc(f)}">`).join("");
  const sel=$("edLay"),ln=typeOf(k)?k.type:"a:"+layName(k.cols);
  if(![...sel.options].some(o=>o.value===ln))sel.insertAdjacentHTML("beforeend",`<option value="${ln}">Alisse ${layName(k.cols)}</option>`);
  sel.value=ln;fillFin();buildInputs();edPreview();$("edMore").open=isOpen("edinfo");$("edNote").value=k.note||"";
  if(ed.showModal)ed.showModal();else ed.setAttribute("open","");
}
document.addEventListener("focusin",e=>{if(e.target.matches&&e.target.matches("#edCols input")){edFocus=+e.target.dataset.b;edMark()}});
function buildInputs(){const k=D.kp[cur],t=typeOf(k);let idx=0;const nc=k.cols.length;
  $("edCols").innerHTML=k.cols.map((cnt,ci)=>{let h=`<div><p class="colh">${(COLNAME[nc]||[])[ci]||"Column "+(ci+1)}</p>`;
    for(let i=0;i<cnt;i++,idx++)h+=`<div class="bl"><span class="bn" aria-hidden="true">${idx+1}</span><input data-b="${idx}" value="${esc(k.labels[idx]||"")}" placeholder="Button ${idx+1} name (blank = no engraving)" autocomplete="off" aria-label="Button ${idx+1} name"><small data-m="${idx}"></small></div>`;
    return h+"</div>"}).join("")+(t&&t[5]?`<p class="small">Plus raise/lower buttons at the bottom (not engraved).</p>`:"");
  checkInputs();
}
function checkInputs(){const k=D.kp[cur];
  document.querySelectorAll("#edCols input").forEach(inp=>{const i=+inp.dataset.b,raw=(k.labels[i]||"").trim(),m=document.querySelector(`#edCols small[data-m="${i}"]`);
    const was=chgB(k,i)?(MODE==="builder"?"Client changed from “":"Was “")+(T(k.sent.l[i])||"blank")+"”. ":"";inp.classList.toggle("chg",!!was);
    if(!raw){inp.classList.remove("bad");m.className="ok1";m.textContent=was+"No engraving";return}
    const ln=fitLines(kase(raw),limitOf(k));inp.classList.toggle("bad",!ln);m.className=ln?(ln.length===1?"ok1":""):"bad";
    m.textContent=was+(ln?(ln.length===2?"Fits on 2 lines: "+ln.join(" / "):"Fits on 1 line"):typeOf(k)?"Too long (about 9 capital letters a line, 2 lines max). Shorten it or add a space to split it.":"Too long for Lutron's engraving (2 lines max). Shorten it or add a space to split it.");
  });
}
let edFocus=-1;
function edPreview(){const k=D.kp[cur],g=grpOf(k),t=typeOf(k);$("edPv").className="pv "+wallCls(k);$("edPv").innerHTML=plate(k).html;
  const rows=Math.max(...k.cols);$("edPv").style.setProperty("--epw",rows<=4?"150px":rows<=6?"124px":"104px");
  $("edMain").classList.toggle("multi",k.cols.length>1);$("edMain").style.setProperty("--nc",k.cols.length);edMark();
  const fl=k.floor?(/basement|floor|level|attic|roof|garage|cellar|apartment|apt\b|unit|suite|penthouse|residence|building|wing|house/i.test(k.floor)?k.floor:k.floor+" floor"):"";
  $("edMoreSum").innerHTML=[[k.loc||"Add a location",fl].filter(Boolean).join(" · "),t?t[2]:"Alisse "+k.cols.reduce((a,b)=>a+b,0)+"-button",finName(kFin(k),g)].map(x=>`<span class="chip">${esc(x)}<i aria-hidden="true">✎</i></span>`).join("")}
function edMark(){const ks=$("edPv").querySelectorAll(".key:not(.rl),.cell");ks.forEach((e,i)=>e.classList.toggle("cur",i===edFocus))}
function changed(){save();render();if(cur>=0)edPreview()}
$("edCols").addEventListener("input",e=>{const i=e.target.dataset.b;if(i===undefined)return;D.kp[cur].labels[+i]=e.target.value;checkInputs();changed()});
$("edN").addEventListener("input",e=>{D.kp[cur].n=e.target.value;$("edTitle").textContent="Keypad "+e.target.value;changed()});
$("edLoc").addEventListener("input",e=>{D.kp[cur].loc=e.target.value;changed()});
$("edNote").addEventListener("input",e=>{const v=e.target.value.slice(0,1000);if(v.trim())D.kp[cur].note=v;else delete D.kp[cur].note;changed()});
$("edFin").addEventListener("change",e=>{if(e.target.value)D.kp[cur].finish=e.target.value;else delete D.kp[cur].finish;changed()});
$("edFloor").addEventListener("change",e=>{D.kp[cur].floor=e.target.value.trim()||"No floor";changed()});
$("edLay").addEventListener("change",e=>{const k=D.kp[cur];setType(k,e.target.value);fillFin();buildInputs();changed()});
function setType(k,v){
  if(v.startsWith("a:")){delete k.type;k.cols=parseLayout(v.slice(2))}else{const t=TYPES.find(x=>x[0]===v);if(!t)return;k.type=v;k.cols=t[4].slice()}
  const n=k.cols.reduce((a,b)=>a+b,0);k.labels=k.labels.slice(0,n);while(k.labels.length<n)k.labels.push("");
  if(k.finish&&!finOk(grpOf(k),k.finish))delete k.finish}
let delArm=0;
$("edDel").addEventListener("click",()=>{const b=$("edDel");
  if(Date.now()-delArm>4000){delArm=Date.now();b.textContent="Tap again to delete";setTimeout(()=>{b.innerHTML=DELH},4000);return}
  delArm=0;b.innerHTML=DELH;const k=D.kp[cur];D.kp.splice(cur,1);edKeep=true;ed.close();save();render();toast("Keypad "+k.n+" deleted")});
$("edDup").addEventListener("click",()=>{const k=clone(D.kp[cur]);delete k.ok;delete k.hid;delete k.hpos;delete k.sent;delete k.note;k.n=nextN();D.kp.splice(cur+1,0,k);save();render();openEd(cur+1);toast("Copied as keypad "+k.n)});
$("edCancel").addEventListener("click",()=>ed.close("cancel"));
ed.addEventListener("close",()=>{
  if(cur>=0&&edSnap&&!edKeep&&ed.returnValue!=="done"&&JSON.stringify(D.kp[cur])!==JSON.stringify(edSnap)){D.kp[cur]=edSnap;save();render();toast("Changes canceled")}
  else if(ed.returnValue==="done"&&cur>=0&&JSON.stringify(D.kp[cur])!==JSON.stringify(edSnap))toast("Keypad "+D.kp[cur].n+" saved");
  edSnap=null;edKeep=false;cur=-1;delArm=0;$("edDel").innerHTML=DELH});
function nextN(){const ns=D.kp.map(k=>parseInt(k.n,10)).filter(n=>!isNaN(n));return String((ns.length?Math.max(...ns):0)+1)}
$("addBtn").addEventListener("click",()=>{const fl=st.floor!=="All"?st.floor:(D.kp.length?D.kp[D.kp.length-1].floor:"First");
  const last=D.kp[D.kp.length-1],nk={n:nextN(),floor:fl,loc:"",cols:[3],labels:["","",""]};if(last&&last.type)setType(nk,last.type);
  D.kp.push(nk);save();render();openEd(D.kp.length-1)});
function toggleOk(i){const k=D.kp[i],wasAll=D.kp.every(k=>k.ok);
  if(!k.ok){const bad=k.labels.filter(l=>tooLong(l,k));if(bad.length){toast("Shorten “"+bad.map(x=>x.trim()).join("”, “")+"” before approving keypad "+k.n,1);return}k.ok=1;save();render();toast("Keypad "+k.n+" approved and locked")}
  else{delete k.ok;save();render();toast("Keypad "+k.n+" unlocked. You can edit it again")}
  const b=document.querySelector(`.okb[data-ok="${i}"]`);if(b)b.focus();maybeApproved(wasAll)}
function bulkOk(list,on){
  if(!on){const n=list.filter(k=>k.ok).length;list.forEach(k=>delete k.ok);save();render();toast(n+" keypad"+(n===1?"":"s")+" unlocked");return}
  const skip=list.filter(k=>!k.ok&&k.labels.some(l=>tooLong(l,k))),go=list.filter(k=>!k.ok&&!skip.includes(k));
  const wasAll=D.kp.every(k=>k.ok);go.forEach(k=>k.ok=1);save();render();maybeApproved(wasAll);
  toast((go.length?go.length+" keypad"+(go.length===1?"":"s")+" approved":"Nothing new to approve")+(skip.length?". Not approved, names too long: keypad "+skip.map(k=>k.n).join(", ")+". Shorten them first.":""),skip.length>0)}
function tapKp(i){if(D.kp[i].ok){toast("Keypad "+D.kp[i].n+" is approved. Tap its check mark to unlock it.");return}openEd(i)}
$("out").addEventListener("click",e=>{
  if(e.target.closest("#onlyChg")){ONLY=!ONLY;ls.set("kp:only",ONLY);render();return}
  if(e.target.closest("#showBad")){if(st.floor!=="All"&&!document.querySelector("#out .kp.toolong")){st.floor="All";save();render()}
    const el=document.querySelector("#out .kp.toolong");if(el){el.scrollIntoView({behavior:"smooth",block:"center"});el.focus({preventScroll:true})}return}
  const a=e.target.closest("[data-all]");if(a){bulkOk(D.kp,a.dataset.all==="approve");return}
  const fb=e.target.closest(".apf");if(fb){bulkOk(D.kp.filter(k=>(k.floor||"No floor")===fb.dataset.floor),fb.dataset.act==="approve");return}
  const o=e.target.closest(".okb");if(o){e.stopPropagation();toggleOk(+o.dataset.ok);return}const k=e.target.closest(".kp");if(k)tapKp(+k.dataset.i)});
$("out").addEventListener("keydown",e=>{if(e.target.closest(".okb"))return;const k=e.target.closest(".kp");if(k&&(e.key==="Enter"||e.key===" ")){e.preventDefault();tapKp(+k.dataset.i)}});

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
    const ty=findType(r[3]);
    let cols=ty?ty[4].slice():parseLayout(String(r[3]||"").replace(/^alisse\s*/i,""));if(!cols)cols=guessLayout(labels.length);
    const n=cols.reduce((a,b)=>a+b,0);const lb=labels.slice(0,n);while(lb.length<n)lb.push("");
    const k={n:r[0]||String(kp.length+1),floor:r[1]||"First",loc:r[2]||"",cols,labels:lb};if(ty)k.type=ty[0];
    const fm=findFin(grpOf(k),r[13]);if(fm)k.finish=fm;if(/^(yes|y|x|✓|approved|true)$/i.test(r[14]||""))k.ok=1;
    kp.push(k);
  }
  return kp;
}

function findType(s){s=String(s||"").trim().toLowerCase();if(!s)return null;
  return TYPES.find(t=>t[2].toLowerCase()===s||(t[3]&&s.startsWith(t[3].toLowerCase()))||t[0]===s)||null}
function findFin(g,s){s=String(s||"").trim().toLowerCase().replace(/\s*\([a-z]{2,3}\)$/,"");if(!s)return null;const f=finList(g).find(f=>f[1].toLowerCase()===s||f[0].toLowerCase()===s||(g==="alisse"&&(ACODE[f[0]]||"").toLowerCase()===s));return f?f[0]:null}
// a Lutron engraving report's model number -> one of our types
// exact match on a Lutron model or replacement-kit number: RKD-H6BRL -> hybrid 6BRL, HQWD-W3BS -> 3BS, HRST-HN4B -> Sunnata hybrid 4B
function typeByModel(m){m=String(m||"").toUpperCase();
  let x=m.match(/^(RKD|HQWD|HQWA|HQRD|HQRA|RRD|HWD|HQWAS)-(HN|H|W)(\d[A-Z]*)/);
  if(x){const hy=x[2]!=="W",code=x[3].replace(/I$/,"").replace(/^(\d)BS?(RL)?$/,(q,n,rl)=>n+"B"+(rl||""));
    const norm=p=>{const y=p.match(/-(?:HN|W)(\d[A-Z]*)$/);return y?y[1].replace(/^(\d)BS?(RL)?$/,(q,n,rl)=>n+"B"+(rl||"")):""};
    const c=TYPES.filter(t=>t[1]==="see"&&norm(t[3])===code);return c.find(t=>!!(t[6]&&t[6].hy)===hy)||c[0]||null}
  x=m.match(/^(HRST|RRST)-(HN|W)(\d[A-Z]+)/);
  if(x){const hy=x[2]==="HN";return TYPES.find(t=>t[1]==="sun"&&t[3].endsWith(x[3])&&!!(t[6]&&t[6].hy)===hy)||null}
  return TYPES.filter(t=>t[3]&&m.startsWith(t[3])).sort((p,q)=>q[3].length-p[3].length)[0]||null}
function typeForModel(mt,model){const e=typeByModel(model);if(e)return e;if(!mt)return null;const sum=t=>t[4].reduce((a,b)=>a+b,0);
  const same=TYPES.filter(t=>t[1]===mt.fam);
  return same.find(t=>sum(t)===mt.n&&!!t[5]===!!mt.rl)||same.find(t=>sum(t)===mt.n)||same.find(t=>sum(t)>=mt.n)||same[same.length-1]||null}
function reportToKp(rs){
  return rs.map((r,i)=>{const t=typeForModel(r.mt,r.model);const k={n:String(i+1),floor:r.floor||"Main",loc:r.loc||"",cols:t?t[4].slice():guessLayout(r.labels.length),labels:[]};
    if(t)k.type=t[0];const n=k.cols.reduce((a,b)=>a+b,0);k.labels=r.labels.slice(0,n);while(k.labels.length<n)k.labels.push("");
    const g=grpOf(k);let f=findFin(g,r.color);
    if(!f){const code=(String(r.model).match(/-([A-Z]{2,3})(-[A-Z0-9]+)?$/)||[])[1];if(code)f=findFin(g,code)||findFin(g,code.slice(-2))}
    if(f)k.finish=f;if(+r.pt>=6&&+r.pt<=20)k.pt=+r.pt;if(r.ocr)k.ocr=1;return k});
}
// most common finish in each family becomes the project finish; keypads that match it drop their own
function adoptFinishes(){for(const g of GROUPS){const ks=D.kp.filter(k=>grpOf(k)===g&&k.finish);if(!ks.length)continue;
  const cnt={};ks.forEach(k=>cnt[k.finish]=(cnt[k.finish]||0)+1);const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  setCur(g,top);setProj(g,top);D.kp.forEach(k=>{if(grpOf(k)===g&&k.finish===top)delete k.finish})}}
// the Keypad Editor / Lutron Builder "keypad labels" file (the Projects board's client-link data)
function labelsToKp(j){
  const FM={palladiom:"pal",sunnata:"sun",pico:"pico",seetouch:"see",alisse:"alisse"};
  return (j.keypads||[]).map((x,i)=>{
    const sb=(x.buttons||[]).slice().sort((a,b)=>(a.pos||0)-(b.pos||0)),bs=sb.map(b=>String(b.text||"").replace(/\s*\n\s*/g," ").trim());
    const sq=/-S-|square/i.test(String(x.model||""));let fam=FM[String(x.family||"").toLowerCase()]||null;
    let mt=window.modelType?window.modelType(x.model):null;if(fam==="pal"&&sq)fam="palsq";
    if(!mt||(fam&&mt.fam.replace("sq","")!==fam.replace("sq","")))mt={fam:fam||"see",n:bs.length,rl:!!x.raise_lower};
    if(fam==="palsq")mt.fam="palsq";
    const k={n:String(i+1),floor:x.floor||"Main",loc:[x.room,x.name].filter(Boolean).filter((v,i,a)=>v!==a[i-1]).join(" · "),cols:[],labels:[]};
    if(mt.fam==="alisse"||fam==="alisse"){k.cols=guessLayout(bs.length)}else{const t=typeForModel(mt,x.model);if(t){k.type=t[0];k.cols=t[4].slice()}else k.cols=guessLayout(bs.length)}
    const n=k.cols.reduce((a,b)=>a+b,0);k.labels=bs.slice(0,n);while(k.labels.length<n)k.labels.push("");
    // the Keypad Editor's keypad id and button numbers, so "Export for Keypad Editor" lands on the same keypad and buttons
    if(x.id!=null&&x.id!==""){k.hid=String(x.id);if(bs.length===n)k.hpos=sb.map((b,i)=>+b.pos||i+1)}
    const f=findFin(grpOf(k),x.finish_code)||findFin(grpOf(k),(String(x.faceplate||x.model||"").match(/-([A-Z]{2,3})$/)||[])[1]);if(f)k.finish=f;
    return k});
}
let pdfjsP=null;
function loadPdfjs(){return pdfjsP||(pdfjsP=new Promise((ok,no)=>{const s=document.createElement("script");s.src="vendor/pdf.min.js";
  s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="vendor/pdf.worker.min.js";ok(window.pdfjsLib)};s.onerror=()=>{pdfjsP=null;no(new Error("pdf"))};document.head.appendChild(s)}))}
async function readReport(file){
  const lib=await loadPdfjs();const doc=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const pages=[];
  for(let i=1;i<=doc.numPages;i++){const tc=await (await doc.getPage(i)).getTextContent();pages.push(tc.items.map(it=>({s:it.str,x:it.transform[4],y:it.transform[5],h:it.height,w:it.width})))}
  const rs=window.parseReport(pages);
  // Sunnata (and some other) reports draw button names as pictures: read them
  const need=[...new Set(rs.filter(r=>!r.labels.some(l=>String(l).trim())).map(r=>r.pg))];
  if(need.length){
    try{if(!window.kpOcr)await loadScript("ocr.js?v="+VERSION);
      let done=0;
      for(const pg of need){toast("Reading button names from the report pictures… "+(++done)+" of "+need.length);
        const page=await doc.getPage(pg+1);const ims=(await window.kpOcr.pageImages(page,lib)).filter(i=>i.w>15&&i.w<200&&i.h>8&&i.h<120);
        if(!ims.length)continue;
        const cols=[];for(const im of ims.sort((a,b)=>a.x-b.x)){let c=cols.find(c=>Math.abs(c.x-im.x)<25);if(!c){c={x:im.x,ims:[]};cols.push(c)}c.ims.push(im)}
        const ordered=cols.flatMap(c=>c.ims.sort((a,b)=>b.y-a.y));
        const txt=await window.kpOcr.ocrImages(ordered.map(i=>i.obj));
        for(const r of rs.filter(r=>r.pg===pg)){r.labels=txt.slice();r.ocr=1;
          if(r.mt&&!/\d/.test(String(r.model).split("-").slice(1).join("")))r.mt={...r.mt,n:txt.length,rl:0,cols:cols.length>1?cols.map(c=>c.ims.length):undefined}}}
    }catch(e){console.warn("ocr",e)}}
  return reportToKp(rs);
}
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>no(new Error(src));document.head.appendChild(s)})}

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
async function makeLink(email){return siteBase()+"#e="+await seal({v:1,id:D.id,title:D.title,replyTo:D.replyTo,rev:D.rev,kp:D.kp,sent:D.sent||null,st:{...pickSt(),finish:MODE==="builder"?st.finish:PF,fx:MODE==="builder"?{...st.fx}:{...PFX}}},email)}

// ---------- send changes (client) ----------
const sd=$("sd");
const SALES="sales@audio1975.com";   // every email from the site goes here
// ---------- shared "Keypad projects" Google Sheet (Apps Script web app) ----------
const KP_API="https://script.google.com/macros/s/AKfycbzgek0Y9rzL9yc5yidI5J6SfsautVMnqllwjVLirrANkPrtceK-tyUVO4IoD_MGpa0Z/exec";   // the web app's /exec URL; empty = list turned off
let LIVE=false,trackT=0;
async function api(o,keep){const body=JSON.stringify(o);const r=await fetch(KP_API,{method:"POST",body,keepalive:!!keep&&body.length<60000});return r.json()}
const okCount=()=>D.kp.filter(k=>k.ok).length+" of "+D.kp.length;
// client page: tell the list what's happening; "edit" waits until they pause
function track(ev){if(!KP_API||MODE!=="client"||!D.id||!EMAIL)return;clearTimeout(trackT);
  const go=async()=>{try{const all=D.kp.length&&D.kp.every(k=>k.ok);
    const status=ev==="open"?"":ev==="send"?(all?"Approved, emailed":"Changes emailed"):(all?"Approved":"Client editing");
    await api({a:"client",id:D.id,ev,status,approved:okCount(),link:ev==="open"?"":await makeLink(EMAIL)},ev==="send")}catch(e){}};
  if(ev==="edit")trackT=setTimeout(go,6000);else go()}
// the changes and notes, written out for the email (a link alone doesn't say what changed)
function chgSummary(){const L=[];
  D.kp.forEach(k=>{const c=kpChg(k);if(!c.any)return;const h="Keypad "+k.n+(k.loc?" ("+T(k.loc)+")":"")+": ",x=[];
    if(c.isNew)x.push("new keypad");if(c.btns.length)x.push(c.btns.map(i=>"button "+(i+1)+" "+(T(k.sent.l[i])||"(blank)")+" -> "+(T(k.labels[i])||"(blank)")).join(", "));
    if(c.type)x.push("type changed to "+typeName(k));if(c.where)x.push("location changed");if(c.note)x.push("note: "+c.note);L.push(h+x.join("; "))});
  gone().forEach(g=>L.push("Keypad "+g.n+(g.loc?" ("+g.loc+")":"")+": removed"));
  if(!L.length)return"";let t="\nWhat changed:\n- "+L.join("\n- ")+"\n";if(t.length>1500)t=t.slice(0,1480)+"…\n(more in the link)\n";return t}
async function openSend(approved){
  $("sdTitle").textContent=approved?"All keypads approved":"Send your changes";
  $("sdText").textContent=approved?"Thank you! Every keypad is approved. Tap below to email your approval to Audio Breakthroughs, so we can order the engraving.":"This makes a link that opens the keypads exactly as you have them now. It opens with the same email as before.";
  $("sdMail").textContent=approved?"Email approval to Audio Breakthroughs":"Email changes";
  $("sdMail").removeAttribute("href");if(!sd.open){if(sd.showModal)sd.showModal();else sd.setAttribute("open","")}
  D.rev=Date.now();save();
  const url=await makeLink(EMAIL);
  const bad=D.kp.flatMap(k=>k.labels.filter(l=>tooLong(l,k)));
  $("sdWarn").innerHTML=bad.length?`<div class="banner">Still too long for Lutron: ${bad.map(esc).join(", ")}. You can send anyway, but these need shortening before ordering.</div>`:"";
  const gs=groups(),fn=gs.map(g=>(gs.length>1?FAMS[g].n+" ":"")+finName(projFin(g),g)).join(", ");
  const own=D.kp.filter(k=>k.finish&&finOk(grpOf(k),k.finish)).map(k=>"Keypad "+k.n+": "+finName(k.finish,grpOf(k)));
  const ok=D.kp.filter(k=>k.ok).map(k=>k.n),all=ok.length===D.kp.length&&ok.length>0;
  const okTxt=all?"All "+ok.length+" keypads approved. ":ok.length?"Approved: keypad"+(ok.length>1?"s ":" ")+ok.join(", ")+" ("+ok.length+" of "+D.kp.length+"). ":"";
  const subj=(D.title||"Project")+(approved||all?" keypads approved":" keypad changes");
  const body=(approved?"I approve all "+ok.length+" keypads for "+(D.title||"this project")+" as shown in this link (finish: "+fn+(own.length?"; different finish on "+own.join(", "):"")+"). Open it with the same email as before:\n\n"+url+"\n"
    :okTxt+"Here are my keypad changes (finish: "+fn+(own.length?"; different finish on "+own.join(", "):"")+"). Open this link and use the same email as before:\n\n"+url+"\n")+chgSummary()+(EMAIL?"\nFrom: "+EMAIL+"\n":"");
  $("sdMail").href="mailto:"+SALES+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
  $("sdCopy").onclick=()=>copy(url);
  $("sdMail").onclick=()=>track("send");
}
$("sendBtn").addEventListener("click",()=>openSend(false));
// the moment every keypad is approved, offer the approval email (client only)
function maybeApproved(wasAll){const all=D.kp.length&&D.kp.every(k=>k.ok);if(MODE==="client"&&all&&!wasAll)setTimeout(()=>openSend(true),350)}
async function copy(t){try{await navigator.clipboard.writeText(t);toast("Link copied")}catch(e){window.prompt("Copy this link:",t)}}

// ---------- CSV, print, reset ----------
$("csvBtn").addEventListener("click",()=>{
  const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':String(v);
  const rows=[["Keypad","Floor","Location","Layout",...Array.from({length:9},(_,i)=>"Button "+(i+1)),"Finish (if different)","Approved","Note"]];
  D.kp.forEach(k=>rows.push([k.n,k.floor,k.loc,typeOf(k)?typeOf(k)[2]:layName(k.cols),...Array.from({length:9},(_,i)=>k.labels[i]||""),k.finish&&finOk(grpOf(k),k.finish)?finName(k.finish,grpOf(k)):"",k.ok?"Yes":"",T(k.note)]));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(",")).join("\r\n")],{type:"text/csv"}));
  a.download=(D.title||"keypads").replace(/[^\w -]/g,"")+" keypads.csv";document.body.appendChild(a);a.click();a.remove();
});
$("printBtn").addEventListener("click",()=>window.print());
// the file the Keypad Editor's "Import keypads..." reads (Jeff, Nov 17: "export file and then in builder import file")
function keFile(){const parts=k=>{const p=String(k.loc||"").split(/\s+·\s+/);return p.length>1?[p[0],p.slice(1).join(" · ")]:["",String(k.loc||"")]};
  return {kind:"keypad import",version:1,job:D.title.trim()||"Keypads",made:new Date().toISOString(),made_by:"Keypads site "+VERSION,
    keypads:D.kp.map(k=>{const [room,name]=parts(k),hp=Array.isArray(k.hpos)&&k.hpos.length===k.labels.length?k.hpos:null;
      return {hid:k.hid||"",n:String(k.n),floor:k.floor||"",loc:k.loc||"",room,name,note:T(k.note),type:typeOf(k)?typeOf(k)[2]:"Alisse "+layName(k.cols),approved:!!k.ok,
        buttons:k.labels.map((t,i)=>({pos:hp?hp[i]:i+1,text:String(t||"")}))}})}}
if($("keBtn"))$("keBtn").addEventListener("click",()=>{if(!D.kp.length){toast("There are no keypads to export yet.",1);return}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(keFile(),null,1)],{type:"application/json"}));
  a.download=(D.title.trim()||"Keypads").replace(/[^\w -]/g,"")+" keypads for Keypad Editor.json";document.body.appendChild(a);a.click();a.remove();
  toast("Saved. In the Keypad Editor, open the .hw and press Import keypads.")});
let resetArm=0;$("resetBtn").addEventListener("click",e=>{const b=e.currentTarget;
  const lab=MODE==="builder"?"Start new project":"Undo all my changes";
  if(Date.now()-resetArm>4000){resetArm=Date.now();b.textContent=MODE==="builder"?"Tap again to clear this project":"Tap again to undo everything";setTimeout(()=>b.textContent=lab,4000);return}
  resetArm=0;b.textContent=lab;
  if(MODE==="builder"){D={id:"",title:"",replyTo:"",rev:0,kp:[]};B.client="";B.reply="";ls.del("kpBuilder");builderFill()}
  else{D=clone(ORIG.d);Object.assign(st,ORIG.st);PF=ORIG.pf;PFX={...ORIG.pfx};st.finish=PF;st.fx={...PFX};ls.del("kp:"+D.id)}
  initBar();render();toast(MODE==="builder"?"New project started. Add a name, the client's email and the keypads.":"Back to the version in the link")});
let tt;function toast(m,bad){const t=$("toast");t.textContent=(bad?"⚠ ":"")+m;t.classList.toggle("bad",!!bad);t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),Math.max(1400,m.length*45))}

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
  ORIG={d:{id:p.id,title:p.title,replyTo:p.replyTo||"",rev:p.rev||0,kp:p.kp,sent:p.sent||null},st:p.st||{}};
  PF=FIN.some(f=>f[0]===(p.st||{}).finish)?p.st.finish:"nickel";ORIG.pf=PF;PFX=fixFx((p.st||{}).fx);ORIG.pfx={...PFX};
  const local=ls.get("kp:"+p.id);
  if(local&&validKp(local.d&&local.d.kp)&&(local.rev||0)>=(p.rev||0)){D=local.d;Object.assign(st,local.st||{});if(FIN.some(f=>f[0]===local.pf))PF=local.pf;if(local.pfx)PFX=fixFx(local.pfx)}
  else{D=clone(ORIG.d);Object.assign(st,ORIG.st);
    if(local)$("banner").innerHTML=`<div class="banner">This link is newer than what was saved on this device, so you're seeing the link's version.</div>`;
    save()}
  st.finish=PF;st.fx={...PFX};
  $("gate").hidden=true;{const w=$("gate").closest(".wrap");if(w&&!w.contains($("app")))w.hidden=true}$("app").hidden=false;initBar();render();
  $("helpLink").hidden=false;$("helpLink").onclick=showHelp;
  if(!ls.get("kp:helpSeen"))showHelp();
  LIVE=true;track("open");
}
function showHelp(){const h=$("help");if(h.showModal)h.showModal();else h.setAttribute("open","");ls.set("kp:helpSeen",1)}
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

// ---------- builder (projects.html) ----------
function clearProject(){D={id:"",title:"",replyTo:"",rev:0,kp:[]};B.client="";ls.del("kpBuilder");builderFill();$("bPaste").value="";initBar();render();setView("edit");$("bTitle").focus();
  toast("New project started. Add a name, the client's email and the keypads.")}
// ---- all projects (reads the shared Google Sheet) ----
let ROWS=null,openArm="",rmArm="",JOB=ls.get("kp:job")==="Closed"?"Closed":"Open";
const jobOf=r=>r.job==="Closed"?"Closed":"Open";
const teamTok=()=>{try{return localStorage.getItem("kpTeamTok")||""}catch(e){return""}};
const linkTok=u=>{const m=String(u||"").match(/#e=([A-Za-z0-9_-]+)/);return m?m[1]:""};
function summary(kp,s0){const set=new Set(kp.map(grpOf)),gs=GROUPS.filter(g=>set.has(g));if(!gs.length)gs.push("alisse");
  const fin=g=>g==="alisse"?(s0.finish||"nickel"):fixFx(s0.fx)[g];
  return {keypads:kp.length,types:gs.map(g=>FAMS[g].n).join(", "),finish:gs.map(g=>(gs.length>1?FAMS[g].n+" ":"")+finName(fin(g),g)).join(", "),approved:kp.some(k=>k.ok)?kp.filter(k=>k.ok).length+" of "+kp.length:""}}
async function listSave(url,email,status,p){if(!KP_API)return false;p=p||{id:D.id,title:D.title,kp:D.kp,st:pickSt()};
  try{const r=await api({a:"save",token:teamTok(),site:siteBase(),id:p.id,title:p.title,client:normEmail(email),status,link:url,...summary(p.kp,p.st||{})});if(!r.ok)throw 0;
    ROWS=null;toast("Saved to the projects list");return true}
  catch(e){toast("Couldn't save to the projects list. Check the internet connection and try again.",1);return false}}
function signedOut(){try{localStorage.removeItem("kpTeamPass");localStorage.removeItem("kpTeamTok")}catch(e){}$("pMsg").textContent="Your sign-in has ended. Reload the page to sign in again."}
async function loadRows(){if(!KP_API)return;$("pMsg").textContent="Loading projects…";
  try{const r=await api({a:"list",token:teamTok()});if(r.err==="signin"){signedOut();return}if(!r.ok)throw 0;ROWS=r.rows;$("pMsg").textContent="";drawRows()}
  catch(e){$("pMsg").textContent="Couldn't load the projects list. Check the internet connection, then tap Refresh."}}
const when=iso=>{if(!iso)return"";const d=new Date(iso);return isNaN(d)?"":d.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})};
const stCls=t=>/^approved/i.test(t)?"ok":/link sent/i.test(t)?"draft":"wait";
function drawRows(){if(!ROWS)return;const q=$("pSearch").value.trim().toLowerCase();
  const hit=ROWS.filter(r=>!q||[r.title,r.client,r.status,r.types,r.finish].join(" ").toLowerCase().includes(q));
  const n={Open:0,Closed:0};hit.forEach(r=>n[jobOf(r)]++);$("pnOpen").textContent=n.Open;$("pnClosed").textContent=n.Closed;
  $("pJob").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.j===JOB));
  const rs=hit.filter(r=>jobOf(r)===JOB).sort((a,b)=>String(b.last).localeCompare(String(a.last))),other=JOB==="Open"?"Closed":"Open";
  $("pRows").innerHTML=!ROWS.length?`<p class="hint">No projects yet. Each client link you make is added here, or tap “Add an existing link”.</p>`
  :!rs.length?`<p class="hint">${q?`No ${JOB.toLowerCase()} jobs match “${esc(q)}”.`:JOB==="Open"?"No open jobs. Everything is closed.":"No closed jobs yet. Tap “Close job” on a finished project to move it here."}${n[other]?` ${n[other]} ${other.toLowerCase()} job${n[other]===1?"":"s"}${q?(n[other]===1?" matches":" match"):""} under <button type="button" class="linkbtn" data-j="${other}">${other==="Open"?"Open jobs":"Closed"}</button>.`:""}</p>`:
  `<table class="ptab"><thead><tr><th>Project</th><th class="hs">Keypads</th><th>Status</th><th class="hs">Last activity</th><th></th></tr></thead><tbody>${rs.map(r=>`<tr data-id="${esc(r.id)}"><td class="pn"><b>${esc(r.title||"Untitled")}</b><small>${esc(r.client)}</small></td><td class="hs">${esc(r.keypads)}<small>${esc(r.types)}${r.finish?" · "+esc(r.finish):""}</small></td><td><span class="pst ${stCls(r.status)}">${esc(r.status||"Link sent")}</span>${r.approved?`<small>${esc(r.approved)} approved</small>`:""}</td><td class="hs">${esc(when(r.last))}</td><td><div class="pact"><button type="button" class="btnx primary" data-act="open">Open</button><button type="button" class="btnx" data-act="copy">Copy link</button><button type="button" class="btnx" data-act="job">${jobOf(r)==="Open"?"Close job":"Reopen"}</button><button type="button" class="btnx danger" data-act="rm" aria-label="Remove from list">${rmArm===r.id?"Tap to remove":"Remove"}</button></div></td></tr>`).join("")}</tbody></table>`}
function loadIntoBuilder(p,email,id){const s0=p.st||{};
  D={id:p.id||id||"",title:p.title||"",replyTo:SALES,rev:p.rev||0,kp:p.kp,sent:p.sent||null};
  st.finish=s0.finish||"nickel";st.fx=fixFx(s0.fx);if(s0.case)st.case=s0.case;if(s0.size)st.size=s0.size;st.floor="All";fix();
  B.client=normEmail(email);save();builderFill();$("bPaste").value="";initBar();setView("edit");window.scrollTo(0,0)}
async function openRow(r){
  const unsaved=D.kp.length&&D.id!==r.id&&!(ROWS||[]).some(x=>x.id===D.id);
  if(unsaved&&openArm!==r.id){openArm=r.id;toast("“"+(D.title||"The project you're editing")+"” isn't in the list yet, so opening another one replaces it. Tap Open again to go ahead.",1);setTimeout(()=>{if(openArm===r.id)openArm=""},6000);return}
  openArm="";let p=null,latest=false;
  for(const u of [r.clink,r.link]){const t=linkTok(u);if(t&&(p=await tryOpen(t,r.client))){latest=u===r.clink;break}}
  if(!p){toast("Couldn't open this project with "+r.client+".",1);return}
  loadIntoBuilder(p,r.client,r.id);toast("Opened "+(p.title||"the project")+(latest?", with the client's latest changes":""))}
function setView(v){if(!$("vtabs"))return;const list=v==="list"&&!!KP_API;document.body.classList.toggle("plv",list);
  $("vtabs").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===(list?"list":"edit")));
  if(list){$("title").textContent="Keypad projects";document.title="Keypad projects";if(!ROWS)loadRows();else drawRows()}else render()}
function initList(){const hasApi=!!KP_API;$("vtabs").hidden=!hasApi;if(!hasApi)return;
  $("vtabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setView(b.dataset.v)});
  $("pSearch").addEventListener("input",drawRows);
  $("pRefresh").addEventListener("click",loadRows);
  const pickJob=j=>{JOB=j;ls.set("kp:job",j);drawRows()};
  $("pJob").addEventListener("click",e=>{const b=e.target.closest("button[data-j]");if(b)pickJob(b.dataset.j)});
  $("pRows").addEventListener("click",e=>{const b=e.target.closest(".linkbtn[data-j]");if(b)pickJob(b.dataset.j)});
  $("pNew").addEventListener("click",()=>{if(!D.kp.length&&!D.title.trim()||(ROWS||[]).some(x=>x.id===D.id)){clearProject();return}setView("edit");$("bNew").click();$("bNew").scrollIntoView({block:"center"})});
  $("pAddLink").addEventListener("click",()=>{$("pAddForm").hidden=false;$("pAddErr").textContent="";$("pAddUrl").focus()});
  $("pAddCancel").addEventListener("click",()=>{$("pAddForm").hidden=true});
  $("pAddForm").addEventListener("submit",async e=>{e.preventDefault();const u=$("pAddUrl").value.trim(),em=$("pAddEmail").value.trim(),t=linkTok(u);
    if(!t){$("pAddErr").textContent="That doesn't look like a keypads link. It should have #e= in it.";return}
    if(!/^\S+@\S+\.\S+$/.test(em)){$("pAddErr").textContent="Add the client's email.";return}
    $("pAddErr").textContent="Opening…";const p=await tryOpen(t,em);
    if(!p){$("pAddErr").textContent="That email doesn't open this link. Use the email the link was sent to.";return}
    if(!p.id)p.id=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2);
    const known=(ROWS||[]).find(x=>x.id===p.id);
    $("pAddErr").textContent="Saving…";
    if(await listSave(siteBase()+"#e="+t,em,known?known.status:(p.kp.length&&p.kp.every(k=>k.ok)?"Approved":"Link sent"),p)){$("pAddForm").hidden=true;$("pAddUrl").value="";$("pAddEmail").value="";$("pAddErr").textContent="";loadRows()}
    else $("pAddErr").textContent="Couldn't save it. Check the internet connection and try again."});
  $("pRows").addEventListener("click",async e=>{const b=e.target.closest("button[data-act]");if(!b)return;const tr=b.closest("tr"),r=(ROWS||[]).find(x=>x.id===tr.dataset.id);if(!r)return;
    if(b.dataset.act==="open")openRow(r);
    else if(b.dataset.act==="copy")copy(r.clink||r.link);
    else if(b.dataset.act==="job"){const was=jobOf(r),to=was==="Open"?"Closed":"Open";b.disabled=true;
      try{const x=await api({a:"job",token:teamTok(),id:r.id,job:to});if(x.err==="signin"){signedOut();return}
        if(x.err==="unknown action"){toast("The projects sheet's script needs updating before jobs can be closed. The steps are in the thread.",1);b.disabled=false;return}
        if(!x.ok)throw 0;r.job=to;drawRows();toast((to==="Closed"?"Closed “":"Reopened “")+(r.title||"project")+(to==="Closed"?"”. It's under Closed now.":"”. It's back under Open jobs."))}
      catch(err){b.disabled=false;toast("Couldn't change it. Check the internet connection and try again.",1)}}
    else if(b.dataset.act==="rm"){if(rmArm!==r.id){rmArm=r.id;drawRows();setTimeout(()=>{if(rmArm===r.id){rmArm="";drawRows()}},4000);return}
      rmArm="";try{const x=await api({a:"delete",token:teamTok(),id:r.id});if(!x.ok)throw 0;ROWS=ROWS.filter(y=>y.id!==r.id);drawRows();toast("Removed “"+(r.title||"project")+"” from the list. The client's link still works.")}
      catch(err){toast("Couldn't remove it. Try again.",1)}}});
  $("pSignOut").addEventListener("click",()=>{try{localStorage.removeItem("kpTeamPass");localStorage.removeItem("kpTeamTok")}catch(e){}location.reload()});
  const m=location.hash.match(/^#open=([\w-]+)$/);
  if(m){history.replaceState(null,"",location.pathname);setView("list");(async()=>{await loadRows();const r=(ROWS||[]).find(x=>x.id===m[1]);if(r)openRow(r);else toast("That project isn't in the list any more.",1)})()}
  else setView("list")}
function builderFill(){
  $("bTitle").value=D.title;$("bClient").value=B.client;$("bOut").hidden=true;
  $("bSetup").open=!(D.kp.length&&D.title.trim()&&B.client);bSum();
}
function bSum(){const e=$("bSum");if(!e)return;const n=D.kp.length;
  e.textContent=[D.title.trim()||"No name yet",B.client||"no client email",n?n+" keypad"+(n===1?"":"s"):"no keypads"].join(" · ")}
function startBuilder(){
  const s=ls.get("kpBuilder");
  if(s&&s.d&&validKp(s.d.kp)){D=s.d;Object.assign(st,s.st||{});Object.assign(B,s.b||{})}
  $("sendBtn").hidden=true;$("resetBtn").textContent="Start new project";
  $("builder").innerHTML=$("builderTpl").innerHTML;
  builderFill();
  let newArm=0;$("bNew").addEventListener("click",()=>{const b=$("bNew");
    if(!D.kp.length&&!D.title.trim()){$("bTitle").focus();return}
    if(Date.now()-newArm>4000){newArm=Date.now();b.textContent="Tap again to clear "+(D.title.trim()||"this project");b.classList.add("danger");setTimeout(()=>{b.textContent="+ Start new project";b.classList.remove("danger")},4000);return}
    newArm=0;b.textContent="+ Start new project";b.classList.remove("danger");clearProject()});
  $("bTitle").addEventListener("input",e=>{D.title=e.target.value;save();render()});
  $("bClient").addEventListener("input",e=>{B.client=e.target.value.trim();save()});
  $("bImport").addEventListener("click",()=>{const kp=parseTable($("bPaste").value);
    if(!kp.length){toast("Nothing to import. Copy the rows from the Keypads tab first.");return}
    D.kp=kp;D.sent=null;save();initBar();render();$("bPaste").value="";toast(kp.length+" keypads imported")});
  $("bFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;e.target.value="";
    const pdf=/\.pdf$/i.test(f.name)||f.type==="application/pdf",json=/\.json$/i.test(f.name);let kp=[],jj=null;
    try{if(pdf){toast("Reading the engraving report…");kp=await readReport(f)}else if(json){jj=JSON.parse(await f.text());kp=labelsToKp(jj)}else kp=parseTable(await f.text())}
    catch(err){toast(pdf?"Couldn't read that PDF. Use a Lutron Designer engraving report.":"Couldn't read that file");return}
    if(!kp.length){toast(pdf?"No keypads found. Use a Lutron Designer engraving report.":"No keypads found in that file");return}
    D.kp=kp;D.sent=null;if(pdf||json)adoptFinishes();
    if(jj&&jj.job&&!D.title.trim()){D.title=String(jj.job);$("bTitle").value=D.title}
    if(jj&&jj.clientEmail&&!B.client){B.client=String(jj.clientEmail);$("bClient").value=B.client}
    save();initBar();render();
    const blank=kp.filter(k=>k.labels.every(l=>!l.trim())).length;
    const ocr=kp.filter(k=>k.ocr).length;kp.forEach(k=>delete k.ocr);save();
    toast(kp.length+" keypads imported"+(ocr?". Button names on "+ocr+" were read from Lutron's pictures, so check the spelling.":"")+(blank?". "+blank+" came in without button names, so tap those to type them.":""))});
  $("bMake").addEventListener("click",async()=>{
    const err=[];if(!D.title.trim())err.push("a project name");if(!/^\S+@\S+\.\S+$/.test(B.client))err.push("the client's email");if(!D.kp.length)err.push("at least one keypad");
    if(err.length){$("bErr").textContent="Add "+err.join(", ")+" first.";$("bSetup").open=true;return}
    $("bErr").textContent="";
    D.id=D.id||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2));
    D.replyTo=SALES;D.rev=Date.now();stampSent();save();render();
    const url=await makeLink(B.client);
    $("bLink").textContent=url;$("bOut").hidden=false;$("bOut").scrollIntoView({behavior:"smooth",block:"nearest"});
    $("bCopy").onclick=()=>copy(url);
    const body=`Here are your keypads for ${D.title}. Open the link, enter this email address (${B.client}), and tap any keypad to change the button names. When you're done, tap "Send changes".\n\n${url}\n`;
    $("bMail").href="mailto:"+encodeURIComponent(B.client)+"?subject="+encodeURIComponent(D.title+" keypads")+"&body="+encodeURIComponent(body);
    $("bOpen").href=url;
    listSave(url,B.client,"Link sent");
  });
  $("app").hidden=false;initBar();render();initList();
}

document.body.insertAdjacentHTML("beforeend",`<p class="ver">Version ${VERSION}</p>`);
if(MODE==="builder")startBuilder();else startClient();
