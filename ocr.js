// Reads button names that Lutron draws as pictures (Sunnata) out of an engraving report.
// pageImages(page): the images on a PDF page with their position (PDF points, y up).
// ocrImages(imgs): text for each image (blank buttons come back "").
"use strict";
(function(root){
const mul=(m,n)=>[m[0]*n[0]+m[1]*n[2],m[0]*n[1]+m[1]*n[3],m[2]*n[0]+m[3]*n[2],m[2]*n[1]+m[3]*n[3],m[4]*n[0]+m[5]*n[2]+n[4],m[4]*n[1]+m[5]*n[3]+n[5]];
async function pageImages(page,lib){
  const ops=await page.getOperatorList(),O=lib.OPS,out=[],st=[];let ctm=[1,0,0,1,0,0];
  for(let i=0;i<ops.fnArray.length;i++){const f=ops.fnArray[i],a=ops.argsArray[i];
    if(f===O.save)st.push(ctm);else if(f===O.restore)ctm=st.pop()||ctm;
    else if(f===O.transform)ctm=mul(a,ctm);
    else if(f===O.paintFormXObjectBegin){st.push(ctm);if(a&&a[0])ctm=mul(a[0],ctm)}
    else if(f===O.paintFormXObjectEnd)ctm=st.pop()||ctm;
    else if(f===O.paintImageXObject||f===O.paintInlineImageXObject){
      const w=Math.hypot(ctm[0],ctm[1]),h=Math.hypot(ctm[2],ctm[3]);
      out.push({ref:f===O.paintImageXObject?a[0]:a[0],inline:f!==O.paintImageXObject,x:Math.min(ctm[4],ctm[4]+ctm[0]),y:Math.min(ctm[5],ctm[5]+ctm[3]),w,h})}}
  for(const im of out){
    try{im.obj=im.inline?im.ref:await new Promise((ok,no)=>{const t=setTimeout(()=>no(new Error("img")),8000);
      const src=String(im.ref).startsWith("g_")?page.commonObjs:page.objs;src.get(im.ref,o=>{clearTimeout(t);ok(o)})})}catch(e){im.obj=null}}
  return out.filter(i=>i.obj);
}
// draw a pdf.js image object on a white canvas, scaled up, as dark text on white
function toCanvas(o,scale){
  const w=o.width,h=o.height,src=document.createElement("canvas");src.width=w;src.height=h;const sx=src.getContext("2d");
  if(o.bitmap)sx.drawImage(o.bitmap,0,0);
  else{const d=sx.createImageData(w,h),p=d.data,s=o.data;
    if(o.kind===3)p.set(s.subarray?s.subarray(0,p.length):s);
    else if(o.kind===2){for(let i=0,j=0;i<w*h;i++){p[j++]=s[i*3];p[j++]=s[i*3+1];p[j++]=s[i*3+2];p[j++]=255}}
    else{const rb=(w+7)>>3;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=(s[y*rb+(x>>3)]>>(7-(x&7))&1)?255:0,j=(y*w+x)*4;p[j]=p[j+1]=p[j+2]=v;p[j+3]=255}}
    sx.putImageData(d,0,0)}
  // ink = how dark and how opaque each pixel is
  const id=sx.getImageData(0,0,w,h).data;let ink=0;const g=new Uint8ClampedArray(w*h);
  for(let i=0;i<w*h;i++){const a=id[i*4+3]/255,l=(id[i*4]*.3+id[i*4+1]*.59+id[i*4+2]*.11)/255,v=a*(1-l*.6);g[i]=v*255;if(v>.25)ink++}
  if(ink<w*h*.004)return null;   // blank button
  let mx=0;for(const v of g)if(v>mx)mx=v;
  const c=document.createElement("canvas");c.width=w*scale+40;c.height=h*scale+40;const cx=c.getContext("2d");
  const t=document.createElement("canvas");t.width=w;t.height=h;const tx=t.getContext("2d"),td=tx.createImageData(w,h);
  for(let i=0;i<w*h;i++){const v=255-Math.min(255,g[i]/(mx||1)*255*1.15);td.data[i*4]=td.data[i*4+1]=td.data[i*4+2]=v;td.data[i*4+3]=255}
  tx.putImageData(td,0,0);cx.fillStyle="#fff";cx.fillRect(0,0,c.width,c.height);cx.imageSmoothingQuality="high";cx.drawImage(t,20,20,w*scale,h*scale);
  return c;
}
let workerP=null;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>no(new Error(src));document.head.appendChild(s)})}
async function worker(){
  if(!workerP)workerP=(async()=>{if(!root.Tesseract)await loadScript("vendor/ocr/tesseract.min.js");
    const base=new URL("vendor/ocr/",location.href).href;
    const w=await root.Tesseract.createWorker("eng",1,{workerPath:base+"worker.min.js",corePath:base,langPath:base+"lang",gzip:true,workerBlobURL:false});
    await w.setParameters({tessedit_pageseg_mode:"6",tessedit_char_whitelist:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &/-'.,+#()"});return w})().catch(e=>{workerP=null;throw e});
  return workerP;
}
async function ocrImages(objs){
  const out=[];let w=null;
  for(const o of objs){const c=toCanvas(o,4);if(!c){out.push("");continue}
    w=w||await worker();const r=await w.recognize(c);
    out.push(String(r.data.text||"").split(/\n+/).map(s=>s.trim()).filter(Boolean).join(" ").replace(/\s+/g," ").trim())}
  return out;
}
root.kpOcr={pageImages,ocrImages,toCanvas};
})(window);
