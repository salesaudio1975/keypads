// Reads a Lutron Designer engraving report (PDF) into keypads.
// pages: [[{s:text, x, y, h}]] in PDF points (y grows upward), one array per page.
"use strict";
(function(root){
const MODEL=/^[A-Z]{2,6}\d?(-[A-Z0-9]+){1,4}$/;
function lines(items){ // group text items into lines, top to bottom
  const its=items.filter(i=>i.s.trim()).sort((a,b)=>b.y-a.y||a.x-b.x),out=[];
  for(const it of its){const l=out.find(l=>Math.abs(l.y-it.y)<2&&Math.abs(l.x-it.x)<160);
    if(l){l.items.push(it)}else out.push({y:it.y,x:it.x,h:it.h,items:[it]})}
  for(const l of out){l.items.sort((a,b)=>a.x-b.x);l.x=l.items[0].x;l.t=l.items.map(i=>i.s.trim()).join(" ").replace(/\s+/g," ").trim()}
  return out.sort((a,b)=>b.y-a.y||a.x-b.x);
}
function after(items,label){ // the text right of a label like "Color:"
  const l=items.find(i=>i.s.trim()===label);if(!l)return "";
  const r=items.filter(i=>Math.abs(i.y-l.y)<2&&i.x>l.x&&i.x<l.x+230&&i.s.trim()).sort((a,b)=>a.x-b.x);
  const near=[];let x=l.x+l.w;for(const i of r){if(i.x-x>120&&near.length)break;if(/:$/.test(i.s.trim()))break;near.push(i.s.trim());x=i.x+(i.w||0)}
  return near.join(" ").trim();
}
// model number -> {fam, n, rl, cols}
function modelType(m){
  m=String(m||"").toUpperCase();let r;
  const cnt=s=>{let x;if((x=s.match(/(\d)(\d)?B?RL/)))return{n:+x[1],rl:1};if((x=s.match(/(\d)B/)))return{n:+x[1],rl:0};if((x=s.match(/P(\d)W/)))return{n:+x[1],rl:0};return null};
  if(/^PJ2?-/.test(m)){r=cnt(m.replace(/^PJ2?-/,""))||{n:4,rl:0};return{fam:"pico",...r}}
  if(/^(STBK|HRST|RRST|STRK|ST)-/.test(m)){r=cnt(m.split("-")[1]||"")||{n:4,rl:0};return{fam:"sun",...r}}
  if(/^(PBT|HQWT|HQRT|HWT|LQWT)-/.test(m)){
    const sq=/-S-/.test(m)||/^PBT-S/.test(m);
    if(/PRRW/.test(m))return{fam:"palsq",n:6,rl:1,cols:[3,3]};
    if(/P44W/.test(m))return{fam:"palsq",n:8,rl:0,cols:[4,4]};
    if(/PRW|3RL/.test(m))return{fam:sq?"palsq":"pal",n:3,rl:1};
    let x=m.match(/-P?(\d)W/)||m.match(/P(\d)W/);return{fam:sq?"palsq":"pal",n:x?+x[1]:4,rl:0}}
  if(/^(RKD|HQWA|HQWD|HQRD|HQWAS|RRD|HWD|HQRA|QSWS2|RRA|PD)-/.test(m)||/W\dB/.test(m)){
    const s=m.split("-").slice(1).join("-");let x;
    if((x=s.match(/(\d)BRL/)))return{fam:"see",n:+x[1],rl:1};
    if((x=s.match(/(\d)RL/)))return{fam:"see",n:+x[1],rl:1};
    if((x=s.match(/(\d)B/)))return{fam:"see",n:+x[1],rl:0};
    return{fam:"see",n:5,rl:1}}
  return null;
}
const FLOORISH=/^(apartment|apt\.?|unit|suite|penthouse|ph\b|residence|building|bldg|wing|guest house|pool house|townhouse|basement|cellar|lower level|ground|main|first|second|third|fourth|attic|roof|garage|\d+(st|nd|rd|th)?\s*(fl|floor|level)\b|level\s*\d|floor\s*\d|.*\bfloor\b|.*\blevel\b)/i;
function splitLoc(p){const parts=p.split(">").map(s=>s.trim()).filter(Boolean);
  if(parts.length>1&&FLOORISH.test(parts[0])){const code=(parts[0].match(/\b([0-9]+[A-Z]?|[A-Z][0-9]+)$/i)||[])[1];   // "Foyer - 27C" in "Apartment 27C" -> "Foyer"
    const rest=parts.slice(1).map(s=>code?s.replace(new RegExp("\\s*[-–]\\s*"+code+"$","i"),"").trim():s);return{floor:parts[0],loc:dedupe(rest).join(" · ")}}
  return{floor:"Main",loc:dedupe(parts).join(" · ")}}
function dedupe(a){return a.filter((s,i)=>s!==a[i-1])}
function parsePage(items){
  const L=lines(items);
  const hi=L.findIndex(l=>/^Device Locations with Identical Engraving/i.test(l.t));let wi,locs;
  if(hi>=0){wi=L.findIndex((l,i)=>i>hi&&/^Wallplate:/.test(l.t));
    locs=L.slice(hi+1,wi<0?hi+2:wi).map(l=>l.t).filter(t=>t.includes(">")||t.length)}
  else{// one keypad per page: "Area Name Basement\009 Guest Bathroom" and "Device Name: Entrance"
    const an=items.find(i=>/^Area Name:?$/i.test(i.s.trim()));if(!an)return [];
    const area=after(items,an.s.trim()),dev=after(items,"Device Name:");
    wi=L.findIndex(l=>/^Wallplate:/.test(l.t));
    locs=[area.split(/\s*[\\>]\s*/).concat(dev).filter(Boolean).join(" > ")]}
  const color=after(items,"Color:");
  const be=items.find(i=>i.s.trim()==="Button Engraving");   // the button engraving column's font size (not the faceplate's)
  const fsz=be?items.find(i=>i.s.trim()==="Font Size:"&&Math.abs(i.x-be.x)<20):null;
  const pt=fsz?parseFloat(after([fsz,...items.filter(i=>i!==fsz&&i.s.trim()!=="Font Size:")],"Font Size:")):NaN;
  const bb=L.findIndex(l=>/^Backbox Size:|Font Size:/.test(l.t));
  let lowest=Math.max(wi,bb);L.forEach((l,i)=>{if(i>wi&&/Font Size:|Backbox Size:/.test(l.t))lowest=Math.max(lowest,i)});
  // the model line: one model, or one per gang on a multi-gang wallplate ("PBT-4W-WH-E   PBT-4W-WH-E")
  const mi=L.findIndex((l,i)=>i>lowest&&l.items.every(it=>MODEL.test(it.s.trim())));
  const FOOT=/^Please see|^File Name:|^Sheet:|^LUTRON$/i;
  if(mi<0)return locs.map(p=>({...splitLoc(p),model:"",color,pt,mt:{fam:"see",n:1,rl:0},labels:[]}));
  const my=L[mi].y,models=items.filter(it=>Math.abs(it.y-my)<2&&MODEL.test(it.s.trim())).sort((a,b)=>a.x-b.x);
  const below=items.filter(it=>it.y<my-2&&it.y>40&&it.s.trim()&&!FOOT.test(it.s.trim()));
  const gangs=models.map((m,gi)=>{const lo=gi?(models[gi-1].x+models[gi-1].w+m.x)/2:-1e9,nx=models[gi+1],hi=nx?(m.x+m.w+nx.x)/2:1e9;
    const its=below.filter(it=>it.x>=lo&&it.x<hi);const model=m.s.trim();
    const body=lines(its).filter(l=>!FOOT.test(l.t));
    const cols=[];for(const l of body){let c=cols.find(c=>Math.abs(c.x-l.x)<40);if(!c){c={x:l.x,ls:[]};cols.push(c)}c.ls.push(l)}
    cols.sort((a,b)=>a.x-b.x);
    const mt=modelType(model)||{fam:"see",n:Math.max(1,body.length),rl:0};
    const perCol=mt.cols||[mt.n],labels=[];
    cols.forEach((c,ci)=>{const want=perCol[ci]||perCol[perCol.length-1];labels.push(...group(c.ls,want))});
    return{model,mt,labels}});
  const G=gangs.length,side=i=>G===2?(i?"right":"left"):(i+1)+" of "+G;
  return locs.flatMap(p=>gangs.map((g,gi)=>{const r={...splitLoc(p),model:g.model,color,pt,mt:{...g.mt},labels:g.labels.slice()};
    if(G>1){r.loc=(r.loc?r.loc+" ":"")+"("+side(gi)+")";r.gang=gi+1;r.gangs=G}return r}));
}
function group(ls,want){ // join lines into buttons: big vertical gaps split buttons
  ls=ls.slice().sort((a,b)=>b.y-a.y);if(!ls.length)return [];
  let btn=[[ls[0]]];
  for(let i=1;i<ls.length;i++){const gap=ls[i-1].y-ls[i].y,h=Math.max(ls[i].h,ls[i-1].h)||10;
    if(gap>h*1.45)btn.push([ls[i]]);else btn[btn.length-1].push(ls[i])}
  // too many buttons for the model: merge across the smallest gaps
  while(want&&btn.length>want){let bi=1,bg=1e9;for(let i=1;i<btn.length;i++){const g=btn[i-1][btn[i-1].length-1].y-btn[i][0].y;if(g<bg){bg=g;bi=i}}
    btn[bi-1]=btn[bi-1].concat(btn[bi]);btn.splice(bi,1)}
  const out=btn.map(b=>b.map(l=>l.t).join(" "));
  // fewer names than buttons: a gap of two button heights means a blank button in between
  if(want&&btn.length>=2&&btn.length<want){const tops=btn.map(b=>b[0].y),gaps=tops.slice(1).map((y,i)=>tops[i]-y),pitch=Math.min(...gaps);
    const add=gaps.map(g=>Math.round(g/pitch)-1);
    if(pitch>0&&add.some(n=>n>0)&&btn.length+add.reduce((a,b)=>a+b,0)<=want&&gaps.every((g,i)=>Math.abs(g-(add[i]+1)*pitch)<pitch*0.2)){
      const res=[out[0]];add.forEach((n,i)=>{for(let j=0;j<n;j++)res.push("");res.push(out[i+1])});return res}}
  return out;
}
function parseReport(pages){const out=[];pages.forEach((p,i)=>out.push(...parsePage(p).map(r=>({...r,pg:i}))));return out}
root.parseReport=parseReport;root.modelType=modelType;
if(typeof module!=="undefined")module.exports={parseReport,modelType};
})(typeof window!=="undefined"?window:globalThis);
