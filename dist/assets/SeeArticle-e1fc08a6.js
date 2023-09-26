import{o,c as p,f as i,d as I,r as c,j as q,u as O,t as $,a as T,i as _,h as d,_ as w,e as G,k as J,l as K,F as oe,m as se,n as P,p as ue,q as R,s as le,w as V,v as ae,x as ne,y as E,z as H}from"./index-80c66211.js";import{_ as Q,a as re,b as ie,c as de}from"./ArticleForm.vue_vue_type_script_setup_true_lang-99eb5762.js";import{_ as W,a as ce}from"./ThoughtInputsList.vue_vue_type_script_setup_true_lang-e62caa54.js";import{u as pe}from"./useThoughtInputs-17dab4d4.js";import{u as X,a as me}from"./useThoughtOutput-bffaeb6b.js";import{_ as ve,u as he}from"./TextInterface.vue_vue_type_script_setup_true_lang-676037a3.js";import{_ as N}from"./TextInput.vue_vue_type_script_setup_true_lang-892883b2.js";function ge(f,m){return o(),p("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[i("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}const _e={key:0},fe={key:2},ye={class:"flex flex-row-reverse"},be=I({__name:"CreateThoughtInputUsageForm",props:{thoughtOutput:{}},emits:["close","refresh"],setup(f,{emit:m}){const v=f,{user:h}=G(),g=c([]),r=c(null),s=c(""),{createThoughtInputUsage:l}=X(),t=async()=>{if(console.log("create"),!r.value)return;const k={thought_output_id:v.thoughtOutput.id,thought_input_id:r.value.id,usage_reason:s.value};await l(k),m("refresh"),m("close")},{getUserThoughtInputs:b}=pe(),U=k=>{r.value=k};return q(async()=>{!h.value||!h.value.id||(g.value=await b(h.value.id))}),(k,y)=>(o(),p("div",null,[O(h)?(o(),p("div",_e,"Nouvelle utilisation par "+$(O(h).first_name)+" "+$(O(h).last_name),1)):T("",!0),r.value?(o(),p("div",fe,[d(Q,{label:"Pourquoi ajouter cet élément ?",modelValue:s.value,"onUpdate:modelValue":y[1]||(y[1]=x=>s.value=x)},null,8,["modelValue"]),i("div",ye,[d(w,{type:"valid",onClick:t,text:"Ajouter"}),d(w,{type:"abort",onClick:y[2]||(y[2]=x=>m("close")),text:"Ajouter"})])])):(o(),_(W,{key:1,"thought-inputs":g.value,center:"",onSelect:y[0]||(y[0]=x=>U(x))},null,8,["thought-inputs"]))]))}}),xe={class:"justify-items-center mx-auto flex flex-wrap max-w-full"},ke=I({__name:"ToggleButtonGroup",props:{choices:{},default:{}},setup(f){const m=f,v=c(null),h=J(),g=K(),r=s=>{v.value=s;const l=g.query,t=g.path;h.push({path:t,query:{...l,tab:s}}),console.log(`route : ${JSON.stringify(g)}`)};return q(()=>r(m.default??"")),(s,l)=>(o(),p("div",xe,[(o(!0),p(oe,null,se(s.choices,t=>(o(),_(w,{key:t.value,class:"w-24 my-1 mx-1",text:t.text,onClick:b=>r(t.value),type:t.value==v.value?"valid":"abort"},null,8,["text","onClick","type"]))),128))]))}}),$e={class:"flex"},Ce={class:"ml-auto h-6 m-4 w-1/3"},Te={class:"flex"},we=I({__name:"ProblemForm",props:{problem:{}},emits:["change"],setup(f,{emit:m}){const v=f,{categories:h}=ue(),g=P(()=>h.value.map(s=>({text:s.display_name,value:s.id}))),r=(s,l)=>{let t={...v.problem};t[s]=l,m("change",t)};return(s,l)=>(o(),p("div",null,[d(N,{label:"Titre",modelValue:s.problem.title,"onUpdate:modelValue":l[0]||(l[0]=t=>r("title",t))},null,8,["modelValue"]),d(N,{class:"h-6",label:"Description",modelValue:s.problem.description,"onUpdate:modelValue":l[1]||(l[1]=t=>r("description",t))},null,8,["modelValue"]),i("div",$e,[d(re,{class:"mr-auto h-6",label:"Progression",modelValue:s.problem.progress,"onUpdate:modelValue":l[2]||(l[2]=t=>r("progress",t))},null,8,["modelValue"]),i("div",Ce,[d(ie,{label:"Catégorie",choices:g.value,"model-value":s.problem.category_id,"onUpdate:modelValue":l[3]||(l[3]=t=>r("category_id",t))},null,8,["choices","model-value"])])]),i("div",Te,[d(N,{class:"h-6",label:"Lien image",modelValue:s.problem.image_url,"onUpdate:modelValue":l[4]||(l[4]=t=>r("image_url",t))},null,8,["modelValue"])])]))}}),Ue={key:0,class:"px-8 mx-auto"},Ve={key:0},Oe={class:"my-8"},qe=["src"],Ie={class:"text-3xl my-3 font-mplus md:text-center text-left"},Ae={class:"md:text-center text-left"},Be={class:"md:text-center text-left"},je={class:"md:flex my-8"},Fe=["href"],Ne={key:1},Pe={class:"flex flex-row-reverse"},De={key:1,class:"p-2 border rounded bg-neutral-100"},Le=i("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Me={key:2},Se={key:3},Qe=I({__name:"SeeArticle",props:{id:{}},setup(f){const m=f,v=K(),h=P(()=>e.value),g=c([{text:"Contenu",value:"ctnt"},{text:"Biblio",value:"bbli"}]),r=c(v.query.tab&&typeof v.query.tab=="string"?v.query.tab:"ctnt"),s=c(null);R(()=>v.query.tab,a=>{console.log("new route query",a),typeof a=="string"&&(s.value=a)});const{getThoughtInputUsagesForThoughtOutput:l}=X(),t=c([]),b=c(!1),U=async()=>{t.value=await l(E(m).id.value)};q(()=>U());const{newThoughtOutput:k,getThoughtOutput:y,updateThoughtOutput:x}=me(),A=c(null),e=c(k()),Y=J();R(()=>v.query.editing,a=>{console.log("Editing : ",a),B.value=a==="false"?!1:!!a});const B=c(!1),D=a=>{Y.push({query:{editing:a.toString()}})},Z=()=>{!e.value||!e.value.id||(e.value.publishing_state="pbsh",x(e.value.id,e.value))},j=(a,u)=>{e.value=u,A.value!==null&&clearTimeout(A.value),A.value=setTimeout(async()=>{try{await x(a,e.value)}catch(F){console.log("An error : ",F)}},1e3)},L=a=>{a!=`
`&&j(E(m).id.value,{...e.value,content:a})},{user:M,getUserById:ee}=G(),S=P(()=>M.value?e.value.author_id==M.value.id:!1),C=c(null),{getCommentsForThoughtOutput:te}=he(),z=c([]);return q(async()=>{e.value=await y(m.id),z.value=await te(m.id),e.value.author_id&&(C.value=await ee(e.value.author_id));const a=v.query.editing;B.value=a==="false"?!1:!!a}),(a,u)=>{const F=le("router-link");return e.value?(o(),p("div",Ue,[B.value?(o(),p("div",Ne,[e.value.output_type=="atcl"?(o(),_(de,{key:0,article:h.value,onChange:u[1]||(u[1]=n=>j(e.value.id,n))},null,8,["article"])):(o(),_(we,{key:1,problem:e.value,onChange:u[2]||(u[2]=n=>j(e.value.id,n))},null,8,["problem"])),i("div",Pe,[d(w,{class:"mx-4",onClick:u[3]||(u[3]=n=>D(!1)),type:"valid",text:"Preview"},{default:V(()=>[H("Ok")]),_:1}),e.value.publishing_state=="drft"?(o(),_(w,{key:0,onClick:Z,type:"valid",text:"Publier"})):(o(),p("div",De,"Publié"))])])):(o(),p("div",Ve,[i("div",Oe,[i("img",{src:e.value.image_url,class:"border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"},null,8,qe)]),i("h1",Ie,$(e.value.title),1),i("div",Ae,$(e.value.description),1),i("div",Be,[C.value?(o(),_(F,{key:0,to:"/users/"+C.value.id,class:"text-sm underline"},{default:V(()=>[H($(C.value.first_name)+" "+$(C.value.last_name),1)]),_:1},8,["to"])):T("",!0)]),S.value?(o(),_(ae,{key:0,onClick:u[0]||(u[0]=n=>D(!0))},{default:V(()=>[d(O(ge),{class:"m-1"})]),_:1})):T("",!0),i("div",je,[d(ne,{"progress-value":e.value.progress,class:"m-2 w-1/3"},null,8,["progress-value"]),e.value.output_type==="atcl"?(o(),p("a",{key:0,class:"ml-auto underline",href:h.value.gdoc_url}," Ajouter un commentaire ",8,Fe)):T("",!0)])])),i("div",null,[d(ke,{choices:g.value,default:r.value},null,8,["choices","default"])]),Le,s.value=="ctnt"?(o(),p("div",Me,[e.value.publishing_state!="drft"?(o(),_(ve,{key:0,"ext-comments":z.value,"ressource-id":e.value.id,"full-text":e.value.content,editable:S.value,onChange:u[4]||(u[4]=n=>L(n))},null,8,["ext-comments","ressource-id","full-text","editable"])):(o(),_(Q,{key:1,class:"h-96",label:"Contenu",modelValue:e.value.content,"onUpdate:modelValue":u[5]||(u[5]=n=>L(n))},null,8,["modelValue"]))])):(o(),p("div",Se,[d(ce,{open:b.value,onClose:u[7]||(u[7]=n=>b.value=!1)},{default:V(()=>[d(be,{onRefresh:U,onClose:u[6]||(u[6]=n=>b.value=!1),"thought-output":e.value},null,8,["thought-output"])]),_:1},8,["open"]),i("div",{onClick:u[8]||(u[8]=n=>b.value=!0),class:"text-sm italic underline"}," Ajouter une référence "),d(W,{"thought-inputs":t.value.map(n=>n.thought_input),"usage-reason":t.value.map(n=>n.usage_reason)},null,8,["thought-inputs","usage-reason"])]))])):T("",!0)}}});export{Qe as default};
