import{o as u,f as i,a as y,d as F,b as _,i as C,D as H,q as a,O as k,n as q,j as b,h as G,e as J,A as B,C as D,F as Q,g as X,c as Y,w as Z,G as ee,m as te,t as O}from"./index-d06ac2da.js";import{u as oe,a as ne}from"./SelectionTextInterface.vue_vue_type_style_index_0_lang-cc2bf542.js";function re(e,t){return u(),i("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[y("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"})])}function se(e,t){return u(),i("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[y("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"})])}const ae=F({__name:"ClipboardButton",props:{text:{}},setup(e){const t=e,r=_(!1),{launchSnackbar:o}=k(),s=async()=>{try{await navigator.clipboard.writeText(t.text),r.value=!0,o("Text copied to clipboard","success"),setTimeout(()=>r.value=!1,2e3)}catch(c){console.log(`Error with copy : ${c}`)}};return(c,w)=>(u(),i("div",null,[C(a(se),{onClick:s,class:H({"text-slate-400":r.value})},null,8,["class"])]))}});let g;const ce=new Uint8Array(16);function ue(){if(!g&&(g=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!g))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return g(ce)}const n=[];for(let e=0;e<256;++e)n.push((e+256).toString(16).slice(1));function ie(e,t=0){return n[e[t+0]]+n[e[t+1]]+n[e[t+2]]+n[e[t+3]]+"-"+n[e[t+4]]+n[e[t+5]]+"-"+n[e[t+6]]+n[e[t+7]]+"-"+n[e[t+8]]+n[e[t+9]]+"-"+n[e[t+10]]+n[e[t+11]]+n[e[t+12]]+n[e[t+13]]+n[e[t+14]]+n[e[t+15]]}const le=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),A={randomUUID:le};function de(e,t,r){if(A.randomUUID&&!t&&!e)return A.randomUUID();e=e||{};const o=e.random||(e.rng||ue)();if(o[6]=o[6]&15|64,o[8]=o[8]&63|128,t){r=r||0;for(let s=0;s<16;++s)t[r+s]=o[s];return t}return ie(o)}const{launchSnackbar:f}=k(),me=async(e,t,r,o,s)=>{const{user:c}=q(),w={start_index:t,end_index:r,content:o,editing:s};try{const l=await b.post("/resources/"+e+"/comments",w),p=U(l.data);return c.value&&p.author_id==c.value.id&&(p.author=c.value),p}catch(l){throw console.log("error : ",l),f(`Error creating comment : ${l}`,"error"),l}},U=e=>(e.updated_at=new Date(e.updated_at.split(".")[0]),e.created_at=new Date(e.created_at.split(".")[0]),e),pe=async(e,t=!0)=>{const r=t?"?author=true":"";try{return(await b.get("/resources/"+e+"/comments"+r)).data.map(s=>U(s))}catch(o){throw console.log("error : ",o),f(`Error getting comments : ${o}`,"error"),o}},L=async e=>{try{const t=await b.put("/comments/"+e.id,e);return U(t.data)}catch(t){console.log("error : ",t),f(`Error updating comment : ${t}`,"error")}},he=async e=>{console.log("comments : ",e),e.map(t=>L(t))};function ye(){return{createComment:me,getCommentsForThoughtOutput:pe,updateComment:L,batchUpdateComments:he}}const ve={class:""},ge=y("div",{class:"cursor bg-blue-400"},null,-1),we=[ge],xe=["onClick","id"],_e={key:0},Ce={key:1,class:"ml-4"},Ue=F({__name:"SelectionTextInterface",props:{resourceId:{},text:{},editable:{type:Boolean}},emits:["change"],setup(e,{emit:t}){const r=e,{launchSnackbar:o}=k(),{formatText:s,textLines:c,keydown:w,editCount:l,parseTextLines:p}=oe(),{getCursorCoordinates:T,cursorPosition:m,cursorCoordinates:V,componentUuid:E,handleKeydown:j,mouseupHandler:I,setCursorPositionFromClick:M}=ne(),R=G(()=>{if(m.value)return m.value.startOffset<m.value.endOffset}),{getCommentsForThoughtOutput:z,createComment:N,batchUpdateComments:ke}=ye(),P=_([]),K=async()=>{N(r.resourceId,m.value.startOffset,m.value.endOffset)};J(async()=>{E.value=de(),c.value=p(r.text),document.getElementById("router-view").addEventListener("scroll",()=>{T()}),P.value=await z(r.resourceId)});const x=_(null),W=()=>{x.value!==null&&clearTimeout(x.value),x.value=setTimeout(async()=>{const h=s();h===""||!h?o("Try to update with empty content","error"):t("change",s())},1e3)};return B(l,()=>{W()}),B(m,()=>{T()},{deep:!0}),(h,v)=>(u(),i("div",ve,[y("div",{style:D(a(V)),class:"absolute flex flex-column"},we,4),C(ae,{class:"ml-auto h-6 w-6",text:h.text},null,8,["text"]),y("div",{id:"editor-interface",tabindex:"0",onKeydown:v[1]||(v[1]=d=>a(j)(d))},[(u(!0),i(Q,null,X(a(c),(d,S)=>(u(),i("div",{class:H(["whitespace-pre-wrap",{"font-bold":d.bold}]),onClick:$=>a(M)(S),onMouseup:v[0]||(v[0]=(...$)=>a(I)&&a(I)(...$)),id:`line-${a(E)}-${S}`},[d.chip?(u(),i("li",Ce,O(d.text),1)):(u(),i("div",_e,O(d.text===""?" ":d.text),1))],42,xe))),256))],32),R.value?(u(),Y(ee,{key:0,class:"absolute right-2 w-9",style:D({top:a(V).top}),onClick:K},{default:Z(()=>[C(a(re))]),_:1},8,["style"])):te("",!0)]))}});export{Ue as _,ae as a,ye as u};
