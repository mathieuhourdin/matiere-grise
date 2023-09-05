import{g as L,o as l,c as i,a as v,t as C,d as W,_ as P,q as T,r as h,h as J,n as g,m as S,i as Q,s as Z,l as U,F as _,v as y,x as ee,e as te}from"./index-10c1110e.js";const oe={class:"bg-slate-100 border p-4 m-1 rounded p-2 shadow-xl"},se={class:"text-xs m-1 font-bold"},ae={key:0},le=["value"],ne={class:"flex"},re={key:1,class:"text-xs"},ie=L({__name:"CommentCard",props:{editing:{type:Boolean},modelValue:{},author:{}},emits:["update:modelValue","validate","abort"],setup(d,{emit:n}){const c=o=>{n("update:modelValue",o.target.value)},u=()=>{n("validate")},r=()=>{n("abort")};return(o,A)=>(l(),i("div",oe,[v("div",se,C(o.author.first_name)+" "+C(o.author.last_name),1),o.editing?(l(),i("div",ae,[v("textarea",{class:"w-full text-xs rounded-xl p-2",value:o.modelValue,onInput:c},null,40,le),v("div",ne,[W(P,{onClick:u,class:"text-sm",rounded:"",size:"2xs",text:"Commenter",type:"valid"}),W(P,{onClick:r,class:"text-sm",rounded:"",size:"2xs",text:"Annuler",type:"abort"})])])):(l(),i("div",re,C(o.modelValue),1))]))}}),de=async(d,n)=>{const c={start_index:n,end_index:n};try{return(await T.post("/articles/"+d+"/comments",c)).data}catch(u){console.log("error : ",u)}},ce=async(d,n=!0)=>{const c=n?"?author=true":"";try{return(await T.get("/articles/"+d+"/comments"+c)).data}catch(u){console.log("error : ",u)}},N=async d=>{try{return(await T.put("/comments/"+d.id,d)).data}catch(n){console.log("error : ",n)}},ue=async d=>{console.log("comments : ",d),d.map(n=>N(n))};function me(){return{createComment:de,getCommentsForArticle:ce,updateComment:N,batchUpdateComments:ue}}const ve=v("div",{class:"text-sm align-middle flex items-center p-2",style:{height:"50px"}}," Corriger une faute ",-1),he={class:"flex mx-auto max-w-full"},pe={class:"w-full"},fe={class:"flex flex-wrap"},xe=["onClick","onContextmenu"],ge={key:0,style:{width:"5px"}},_e={key:1,style:{height:"25px"}},ye={key:2},Ce={class:"absolute h-full",style:{right:"-30px"}},we={key:0,style:{width:"200px"}},be=L({__name:"TextInterface",props:{ressourceId:{},fullText:{},extComments:{default:()=>[]},editable:{type:Boolean,default:!0}},emits:["change","changeComments"],setup(d,{emit:n}){const c=d,u=e=>{console.log("selectCursorPosition letter : ",e),c.editable&&(r.value={id:e.id,char:e.char})},r=h(null),o=h([]),A=J(()=>R(o.value)),R=e=>{console.log("textArrayFromString textString: ",e);let t=[{id:0,words:[{id:0,text:[]}],text:[],comments:[]}],s=0,f=0;for(var a=0;a<o.value.length;a++){o.value[a].char==`
`&&(s+=1,f=0,t.push({id:s,words:[{id:0,text:[]}],text:[],comments:[]}));const x=p.value.find(m=>m.start_index==a);x&&t[s].comments.push(x),t[s].words[f].text.push({id:a,char:o.value[a].char,comment:x}),o.value[a].char==" "&&(f+=1,t[s].words.push({id:f,text:[{id:a,char:o.value[a].char}]}))}return t},w=e=>{o.value.filter(t=>t.id>=r.value.id+1).forEach(t=>t.id+=1),o.value.splice(r.value.id+1,0,{id:r.value.id+1,char:e,line:0}),p.value.forEach(t=>{t.start_index>r.value.id&&(t.start_index+=1),t.end_index>r.value.id&&(t.end_index+=1)}),r.value.id+=1},D=e=>{if(console.log("Writes : ",e.key),r.value===null)return;const t=e.key;if(k.value&&t=="v"){K();return}if(t.length==1)w(t);else if(t=="Backspace")o.value.splice(r.value.id,1),o.value.filter(s=>s.id>r.value.id).forEach(s=>s.id-=1),r.value.id-=1;else if(t=="Enter")w(`
`);else if(t=="ArrowRight"){let s=r.value.id;s<o.value.length-1&&u(o.value[s+1])}else if(t=="ArrowLeft"){let s=r.value.id;s>0&&u(o.value[s-1])}else t=="Control"&&(console.log("Control"),k.value=!0)},k=h(!1),K=async()=>{try{let t=await navigator.clipboard.readText();console.log("Clippedtext : ",t);for(var e=0;e<t.length;e++)w(t[e])}catch(t){console.log("Error with clippboard : ",t)}},O=e=>{e.key=="Control"&&(k.value=!1)},{createComment:j,batchUpdateComments:q}=me(),p=h([]),E=h(null),H=e=>{console.log("Comments loading : ",e),p.value=e},M=async()=>{console.log("Add Comment");const e=await j(c.ressourceId,I.value);p.value.push(e)};g(p,e=>{console.log("Watch comments triggered : ",e.value),$.value&&(console.log("Comments : ",e),n("changeComments",e.value),clearTimeout(E.value),E.value=setTimeout(()=>q(e),1e3))},{deep:!0}),g(S(c).extComments,e=>{p.value=e});const b=h(!1),I=h(null),V=h({position:"absolute","z-index":90,top:0,left:0,height:"106px",width:"260px"}),X=(e,t)=>{e.preventDefault(),V.value.top=`${e.layerY}px`,V.value.left=`${e.layerX}px`,b.value=!0,I.value=t,console.log("event : ",e),console.log("Have a new right click")},B=e=>{if(console.log("textArrayFromString textString: ",e),o.value=[],e===void 0||e==""){o.value=[{id:0,char:`
`}],u({id:0,char:`
`});return}for(var t=0;t<e.length;t++){const s=p.value.find(f=>f.start_index==t);o.value.push({id:t,char:e[t],comment:s})}},Y=e=>e.reduce((t,s)=>t+s.char,""),$=h(!1);return Q(()=>{B(c.fullText),H(c.extComments),$.value=!0}),g(o,e=>{console.log("Watch triggered : ",e),$.value&&n("change",Y(e))},{deep:!0}),g(S(c).fullText,e=>{B(e)}),(e,t)=>(l(),i("div",{class:"relative p-4",tabindex:"0",onKeydown:D,onKeyup:O,onClick:t[0]||(t[0]=s=>b.value=!1)},[b.value?(l(),i("div",{key:0,class:"bg-white border-4",style:Z(V.value)},[v("div",{onClick:M,class:"text-sm border-b-2 flex items-center p-2",style:{height:"50px"}}," Ajouter un commentaire "),ve],4)):U("",!0),v("div",he,[v("div",pe,[(l(!0),i(_,null,y(A.value,(s,f)=>(l(),i("div",{key:f,class:"flex flex-wrap"},[v("div",fe,[(l(!0),i(_,null,y(s.words,(a,x)=>(l(),i("div",{key:x,class:"flex flex-wrap"},[(l(!0),i(_,null,y(a.text,(m,G)=>{var F;return l(),i("div",{key:G,class:ee(["border-blue-400",{"border-r-2":m.id==((F=r.value)==null?void 0:F.id),"bg-yellow-400":m.comment}]),onClick:z=>u(m),onContextmenu:z=>X(z,m.id)},[m.char==" "?(l(),i("div",ge)):m.char==`
`?(l(),i("div",_e)):(l(),i("div",ye,[v("div",null,C(m.char),1)]))],42,xe)}),128))]))),128))]),v("div",Ce,[(l(!0),i(_,null,y(s.comments,(a,x)=>(l(),te(ie,{key:x,style:{width:"200px"},modelValue:a.content,"onUpdate:modelValue":m=>a.content=m,editing:a.editing,onValidate:m=>a.editing=!1,author:a.author},null,8,["modelValue","onUpdate:modelValue","editing","onValidate","author"]))),128))])]))),128))]),p.value.length>0?(l(),i("div",we,"Espace")):U("",!0)])],32))}});export{be as _,me as u};