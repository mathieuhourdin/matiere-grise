import{_ as M,u as P}from"./TextInterface.vue_vue_type_script_setup_true_lang-0a02625e.js";import{o,c,f as u,d as O,h as i,r as v,l as q,m as D,n as L,p as N,q as z,t as w,i as m,w as C,u as E,s as R,a as $,v as j,x as F,_ as T,y as H,e as S}from"./index-77e9de4b.js";import{a as G,_ as I,b as J}from"./ArticleForm.vue_vue_type_script_setup_true_lang-89774e13.js";import{_ as h}from"./TextInput.vue_vue_type_script_setup_true_lang-86b74612.js";import{u as K}from"./useThoughtOutput-1bbe5dec.js";function Q(p,d){return o(),c("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[u("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}const W={class:"flex"},X={class:"flex"},Y=O({__name:"ProblemForm",props:{problem:{}},emits:["change"],setup(p,{emit:d}){const _=p,r=(n,e)=>{let s={..._.problem};s[n]=e,d("change",s)};return(n,e)=>(o(),c("div",null,[i(h,{label:"Titre",modelValue:n.problem.title,"onUpdate:modelValue":e[0]||(e[0]=s=>r("title",s))},null,8,["modelValue"]),i(h,{class:"h-6",label:"Description",modelValue:n.problem.description,"onUpdate:modelValue":e[1]||(e[1]=s=>r("description",s))},null,8,["modelValue"]),u("div",W,[i(G,{class:"mr-auto h-6",label:"Progression",modelValue:n.problem.progress,"onUpdate:modelValue":e[2]||(e[2]=s=>r("progress",s))},null,8,["modelValue"])]),u("div",X,[i(h,{class:"h-6",label:"Lien image",modelValue:n.problem.image_url,"onUpdate:modelValue":e[3]||(e[3]=s=>r("image_url",s))},null,8,["modelValue"])])]))}}),Z={key:0,class:"px-8 mx-auto"},ee={key:0},te={class:"my-8"},le=["src"],se={class:"text-3xl my-3 font-mplus md:text-center text-left"},oe={class:"md:text-center text-left"},ae={class:"md:flex my-8"},ue=["href"],ne={key:1},re={class:"flex flex-row-reverse"},ie={key:1,class:"p-2 border rounded bg-neutral-100"},de=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),fe=O({__name:"SeeArticle",props:{id:{}},setup(p){const d=p,{getThoughtOutput:_,updateThoughtOutput:r}=K(),n=v(null),e=v(null),s=q(),U=D();L(()=>s.query.editing,t=>{console.log("Editing : ",t),f.value=t==="false"?!1:!!t});const f=v(!1),b=t=>{U.push({query:{editing:t}})},A=()=>{e.value.publishing_state="pbsh",r(e.value.id,e.value)},g=(t,l)=>{e.value=l,clearTimeout(n.value),n.value=setTimeout(async()=>{try{await r(t,e.value)}catch(a){console.log("An error : ",a)}},1e3)},x=t=>{t!=`
`&&g(H(d).id.value,{...e.value,content:t})},{user:y}=S(),k=N(()=>y.value?e.value.author_id==y.value.id:!1),{getCommentsForThoughtOutput:B}=P(),V=v([]);return z(async()=>{e.value=await _(d.id),V.value=await B(d.id);const t=s.query.editing;f.value=t==="false"?!1:!!t}),(t,l)=>e.value?(o(),c("div",Z,[f.value?(o(),c("div",ne,[e.value.output_type=="atcl"?(o(),m(I,{key:0,article:e.value,onChange:l[1]||(l[1]=a=>g(e.value.id,a))},null,8,["article"])):(o(),m(Y,{key:1,problem:e.value,onChange:l[2]||(l[2]=a=>g(e.value.id,a))},null,8,["problem"])),u("div",re,[i(T,{class:"mx-4",onClick:l[3]||(l[3]=a=>b(!1)),type:"valid",text:"Preview"},{default:C(()=>[F("Ok")]),_:1}),e.value.publishing_state=="drft"?(o(),m(T,{key:0,onClick:A,type:"valid",text:"Publier"})):(o(),c("div",ie,"Publié"))])])):(o(),c("div",ee,[u("div",te,[u("img",{src:e.value.image_url,class:"border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"},null,8,le)]),u("h1",se,w(e.value.title),1),u("div",oe,w(e.value.description),1),k.value?(o(),m(R,{key:0,onClick:l[0]||(l[0]=a=>b(!0))},{default:C(()=>[i(E(Q),{class:"m-1"})]),_:1})):$("",!0),u("div",ae,[i(j,{"progress-value":e.value.progress,class:"w-1/3"},null,8,["progress-value"]),u("a",{class:"ml-auto underline",href:e.value.gdoc_url}," Ajouter un commentaire ",8,ue)])])),de,e.value.publishing_state!="drft"?(o(),m(M,{key:2,"ext-comments":V.value,"ressource-id":e.value.id,"full-text":e.value.content,editable:k.value,onChange:l[4]||(l[4]=a=>x(a))},null,8,["ext-comments","ressource-id","full-text","editable"])):(o(),m(J,{key:3,class:"h-96",label:"Contenu",modelValue:e.value.content,"onUpdate:modelValue":l[5]||(l[5]=a=>x(a))},null,8,["modelValue"]))])):$("",!0)}});export{fe as default};
