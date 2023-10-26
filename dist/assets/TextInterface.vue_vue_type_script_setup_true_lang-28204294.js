import{d as N,p as O,o as s,c as n,h as m,t as g,a as y,j as P,m as R,G as S,J as ae,e as j,r as x,x as k,A as K,f as le,K as se,F as b,i as $,E as L,n as ne}from"./index-3a1f6e15.js";const re={class:"bg-slate-100 border p-1 m-1 rounded shadow-xl"},ue={class:"flex"},de={key:0,class:"text-xs mt-0.5 font-bold"},ie={class:"text-2xs italic ml-auto mr-1 my-auto"},ce={key:0},he=["value"],ve={class:"flex"},me={key:1,class:"text-xs mt-0.5"},fe=N({__name:"CommentCard",props:{editing:{type:Boolean},modelValue:{},author:{},createdAt:{}},emits:["update:modelValue","validate","abort"],setup(r,{emit:u}){const d=r,i=O(()=>d.createdAt?d.createdAt.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}):""),o=f=>{u("update:modelValue",f.target.value)},l=()=>{u("validate")},V=()=>{u("abort")};return(f,C)=>(s(),n("div",re,[m("div",ue,[f.author?(s(),n("div",de,g(f.author.first_name)+" "+g(f.author.last_name),1)):y("",!0),m("div",ie,g(i.value),1)]),f.editing?(s(),n("div",ce,[m("textarea",{class:"w-full text-xs rounded-xl p-2",value:f.modelValue,onInput:o},null,40,he),m("div",ve,[P(R,{onClick:l,class:"text-sm",rounded:"",size:"2xs",text:"Commenter",type:"valid"}),P(R,{onClick:V,class:"text-sm",rounded:"",size:"2xs",text:"Annuler",type:"abort"})])])):(s(),n("div",me,g(f.modelValue),1))]))}}),{launchSnackbar:D}=ae(),pe=async(r,u)=>{const{user:d}=j(),i={start_index:u,end_index:u};try{const o=await S.post("/thought_outputs/"+r+"/comments",i),l=z(o.data);return d.value&&l.author_id==d.value.id&&(l.author=d.value),l}catch(o){throw console.log("error : ",o),D(`Error creating comment : ${o}`,"error"),o}},z=r=>(r.updated_at=new Date(r.updated_at.split(".")[0]),r.created_at=new Date(r.created_at.split(".")[0]),r),xe=async(r,u=!0)=>{const d=u?"?author=true":"";try{return(await S.get("/thought_outputs/"+r+"/comments"+d)).data.map(o=>z(o))}catch(i){throw console.log("error : ",i),D(`Error getting comments : ${i}`,"error"),i}},G=async r=>{try{const u=await S.put("/comments/"+r.id,r);return z(u.data)}catch(u){console.log("error : ",u),D(`Error updating comment : ${u}`,"error")}},_e=async r=>{console.log("comments : ",r),r.map(u=>G(u))};function ge(){return{createComment:pe,getCommentsForThoughtOutput:xe,updateComment:G,batchUpdateComments:_e}}const ye=m("div",{class:"text-sm align-middle flex items-center p-2",style:{height:"50px"}}," Corriger une faute ",-1),Ce={class:"flex mx-auto max-w-full"},we={class:"w-full"},ke={key:0,class:"flex"},be=m("div",{class:"w-6"},[m("div",{class:"rounded-full ml-4 mr-2 mt-2 h-1 w-1 bg-black"})],-1),$e=[be],Ve={class:"flex flex-wrap"},Ae=["onClick","onContextmenu"],Ee={key:0,style:{width:"5px"}},Te={key:1,style:{height:"25px"}},Ie={key:2},Be={key:1,class:"absolute h-full",style:{right:"-2%",width:"27%"}},Se={key:0,style:{width:"33%"}},ze=N({__name:"TextInterface",props:{resourceId:{},fullText:{},extComments:{default:()=>[]},editable:{type:Boolean,default:!0}},emits:["change","changeComments"],setup(r,{emit:u}){const d=r,i=e=>{console.log("selectCursorPosition letter : ",e),d.editable&&(o.value={id:e.id,char:e.char})},o=x(null),l=x([]),V=O(()=>{let e=[{id:0,words:[{id:0,text:[]}],comments:[]}],t=0,a=0;for(var c=0;c<l.value.length;c++){l.value[c].char==`
`&&(t+=1,a=0,e.push({id:t,words:[{id:0,text:[]}],lineStyle:c<l.value.length-1?l.value[c+1].char:null,comments:[]}));const h=p.value.find(_=>_.start_index==c);h&&e[t].comments.push(h),e[t].words[a].text.push({id:c,char:l.value[c].char,comment:h}),l.value[c].char==" "&&(a+=1,e[t].words.push({id:a,text:[]}))}return e}),f=e=>{e==1?p.value.forEach(t=>{o.value&&t.start_index>o.value.id&&(t.start_index+=1),o.value&&t.end_index>o.value.id&&(t.end_index+=1)}):e==-1&&p.value.forEach(t=>{o.value&&t.start_index>=o.value.id&&(t.start_index-=1),o.value&&t.end_index>=o.value.id&&(t.end_index-=1)})},C=e=>{o.value&&(l.value.filter(t=>o.value&&t.id>=o.value.id+1).forEach(t=>t.id+=1),l.value.splice(o.value.id+1,0,{id:o.value.id+1,char:e}),f(1),o.value.id+=1)},H=e=>{if(console.log("Writes : ",e.key),o.value===null)return;const t=e.key;if(A.value&&t=="v"){J();return}if(t.length==1)e.preventDefault(),C(t);else if(t=="Backspace")l.value.splice(o.value.id,1),l.value.filter(a=>o.value&&a.id>o.value.id).forEach(a=>a.id-=1),f(-1),o.value.id-=1;else if(t=="Enter")C(`
`);else if(t=="ArrowRight"){let a=o.value.id;a<l.value.length-1&&i(l.value[a+1])}else if(t=="ArrowLeft"){let a=o.value.id;a>0&&i(l.value[a-1])}else t=="Control"&&(console.log("Control"),A.value=!0)},A=x(!1),J=async()=>{try{let t=await navigator.clipboard.readText();console.log("Clippedtext : ",t);for(var e=0;e<t.length;e++)C(t[e])}catch(t){console.log("Error with clippboard : ",t)}},M=e=>{e.key=="Control"&&(A.value=!1)},{createComment:X,batchUpdateComments:Y}=ge(),p=x([]),E=x(null),q=e=>{console.log("Comments loading : ",e),p.value=e},Q=async()=>{if(console.log("Add Comment"),console.log(d.resourceId),console.log(w.value),!d.resourceId||!w.value)return;console.log("Add Comment 2");const e=await X(d.resourceId,w.value);p.value.push(e)};k(p,e=>{console.log("Watch comments triggered : ",e),B.value&&(console.log("Comments : ",e),u("changeComments",e),E.value!==null&&clearTimeout(E.value),E.value=setTimeout(()=>Y(e),1e3))},{deep:!0}),k(K(d).extComments,e=>{p.value=e});const T=x(!1),w=x(null),I=x({position:"absolute","z-index":90,top:"0px",left:"0px",height:"106px",width:"260px"}),{user:Z}=j(),ee=(e,t)=>{e.preventDefault(),Z.value&&(o.value=null,I.value.top=`${e.layerY}px`,I.value.left=`${e.layerX}px`,T.value=!0,w.value=t,console.log("event : ",e),console.log("Have a new right click"))},F=e=>{if(l.value=[],e===void 0||e==""){l.value=[{id:0,char:`
`}],i({id:0,char:`
`});return}for(var t=0;t<e.length;t++){const a=p.value.find(c=>c.start_index==t);l.value.push({id:t,char:e[t],comment:a})}},te=e=>e.reduce((t,a)=>t+a.char,""),B=x(!1);return le(()=>{F(d.fullText),q(d.extComments),B.value=!0}),k(l,e=>{console.log("Watch triggered : ",e),B.value&&u("change",te(e))},{deep:!0}),k(K(d).fullText,e=>{F(e)}),(e,t)=>(s(),n("div",{class:"relative p-4",tabindex:"0",onKeydown:H,onKeyup:M,onClick:t[0]||(t[0]=a=>T.value=!1)},[T.value?(s(),n("div",{key:0,class:"bg-white border-4",style:se(I.value)},[m("div",{onClick:Q,class:"text-sm border-b-2 flex items-center p-2",style:{height:"50px"}}," Ajouter un commentaire "),ye],4)):y("",!0),m("div",Ce,[m("div",we,[(s(!0),n(b,null,$(V.value,(a,c)=>(s(),n("div",{key:c,class:"flex"},[a.lineStyle=="*"?(s(),n("div",ke,$e)):y("",!0),m("div",Ve,[(s(!0),n(b,null,$(a.words,(h,_)=>(s(),n("div",{key:_,class:"flex flex-wrap"},[(s(!0),n(b,null,$(h.text,(v,oe)=>{var U;return s(),n("div",{key:oe,class:L(["border-blue-400",{"border-r-2":v.id==((U=o.value)==null?void 0:U.id),"bg-yellow-400":v.comment}]),onClick:W=>i(v),onContextmenu:W=>ee(W,v.id)},[v.char==" "?(s(),n("div",Ee)):v.char==`
`?(s(),n("div",Te)):(v.char=="#"||v.char=="*")&&_==0?(s(),n("div",Ie)):(s(),n("div",{key:3,class:L({"font-bold":a.lineStyle=="#"})},[m("div",null,g(v.char),1)],2))],42,Ae)}),128))]))),128))]),p.value.length>0?(s(),n("div",Be,[(s(!0),n(b,null,$(a.comments,(h,_)=>(s(),ne(fe,{key:_,class:"w-full",modelValue:h.content,"onUpdate:modelValue":v=>h.content=v,editing:h.editing,onValidate:v=>h.editing=!1,author:h.author,"created-at":h.created_at},null,8,["modelValue","onUpdate:modelValue","editing","onValidate","author","created-at"]))),128))])):y("",!0)]))),128))]),p.value.length>0?(s(),n("div",Se)):y("",!0)])],32))}});export{ze as _,ge as u};