import{o as a,c as _,g as u,d as y,t as f,r as g,q as R,k as C,i as c,e as q,x as me,y as z,z as M,h as _e,A as he,B as ve,a as w,m as ee,w as V,f as B,C as te,j as x,F as W,p as G,D as ge,l as D,u as A,_ as S,n as oe,E as se,s as le,v as fe}from"./index-7f0fbf45.js";import{_ as H,u as be}from"./TextInterface.vue_vue_type_script_setup_true_lang-63cb8eed.js";import{_ as I}from"./TextInput.vue_vue_type_script_setup_true_lang-36af79df.js";import{a as ue,u as ye}from"./useThoughtOutput-03f2ac94.js";function xe(r,s){return a(),_("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[u("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}const we={class:"m-4"},$e={class:"block text-2xs text-slate-800"},ke=["value","placeholder"],J=y({__name:"TextAreaInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue"],setup(r,{emit:s}){const n=t=>{s("update:modelValue",t.target.value)};return(t,d)=>(a(),_("div",we,[u("label",$e,f(t.label),1),u("textarea",{class:"border border-neutral-800 block h-full w-full",value:t.modelValue,placeholder:t.placeholder,onInput:d[0]||(d[0]=l=>n(l))},null,40,ke)]))}}),Ve=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Ie=u("div",{class:"text-xs italic"},"Raison de la lecture",-1),Ce=y({__name:"SeeThoughtInput",props:{thoughtInput:{}},setup(r){const s=r,{getUserById:n,user:t}=q(),d=g(null),l=R(()=>t.value?s.thoughtInput.interaction_user_id===t.value.id:!1);return C(async()=>{s.thoughtInput.interaction_user_id&&(d.value=await n(s.thoughtInput.interaction_user_id))}),(e,i)=>(a(),_("div",null,[c(Dt,{id:e.thoughtInput.id},null,8,["id"]),Ve,Ie,c(H,{"full-text":e.thoughtInput.interaction_comment,editable:l.value},null,8,["full-text","editable"])]))}}),Te={class:"flex"},ne=y({__name:"ModalSheet",props:{open:{type:Boolean,default:!1}},emits:["close"],setup(r,{emit:s}){const n=r,t=g(!1);return C(()=>{t.value=n.open}),me(()=>{const d=l=>{(l.key==="Escape"||l.key==="Enter"||l.key==="Esc"||l.keyCode===27)&&s("close")};return window.addEventListener("keydown",d),()=>{window.removeEventListener("keydown",d)}}),z(M(n).open,d=>t.value=d),(d,l)=>t.value?(a(),_("div",{key:0,tabindex:"0",onKeyup:l[2]||(l[2]=ve(e=>s("close"),["esc"])),class:"fixed top-0 left-0 w-full h-full z-10 bg-slate-500/50",onClick:l[3]||(l[3]=e=>s("close"))},[u("div",{class:"max-w-xl overflow-y-scroll max-h-screen mb-10 bg-white mx-auto mt-6 p-4 rounded shadow",onClick:l[1]||(l[1]=he(()=>{},["stop"]))},[u("div",Te,[u("div",{class:"ml-auto",onClick:l[0]||(l[0]=e=>s("close"))},"x")]),_e(d.$slots,"default")])],32)):w("",!0)}}),Ue={class:"w-full md:w-96"},Oe={key:0,class:"text-xs italic mb-2"},Re={class:"border shadow-lg rounded p-4 md:w-96"},Se={class:"flex"},Ae=["src"],Be={class:"flex flex-wrap w-full",style:{"margin-top":"-8px"}},qe={class:"text-2xs italic"},De={class:"ml-auto m-1 w-1/3"},Ee={class:"text-2xs"},Le={class:"flex flex-wrap"},Fe={key:0,class:"text-2xs italic"},Ne=y({__name:"ThoughtInputCard",props:{thoughtInput:{},usageReason:{}},setup(r){const s=r,{getUserById:n}=q(),t=g(null);C(async()=>{s.thoughtInput.interaction_user_id&&(t.value=await n(s.thoughtInput.interaction_user_id))});const d=e=>e.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}),l=e=>e.length>200?e.slice(0,150)+"...":e;return(e,i)=>{const o=ee("router-link");return a(),_("div",Ue,[e.usageReason?(a(),_("div",Oe,f(e.usageReason),1)):w("",!0),u("div",Re,[u("div",Se,[u("img",{class:"w-8 h-fit mr-4",src:e.thoughtInput.resource_image_url},null,8,Ae),u("div",null,[u("div",null,[c(o,{to:"/thought_inputs/"+e.thoughtInput.id},{default:V(()=>[B(f(e.thoughtInput.resource_title),1)]),_:1},8,["to"])]),u("div",Be,[u("div",qe,f(e.thoughtInput.resource_author_name),1),u("div",De,[c(te,{"progress-value":e.thoughtInput.interaction_progress},null,8,["progress-value"])])]),u("div",Ee,f(l(e.thoughtInput.interaction_comment)),1)])]),u("div",Le,[e.thoughtInput.interaction_date?(a(),_("div",Fe,f(d(e.thoughtInput.interaction_date)),1)):w("",!0),t.value?(a(),x(o,{key:1,to:"/users/"+t.value.id,class:"ml-auto text-2xs underline"},{default:V(()=>[B(f(t.value.first_name)+" "+f(t.value.last_name),1)]),_:1},8,["to"])):w("",!0)])])])}}}),Pe={class:"w-fit"},je=y({__name:"ThoughtInputCardWithPopup",props:{thoughtInput:{},usageReason:{}},setup(r){const s=g(!1);return(n,t)=>(a(),_("div",Pe,[c(ne,{open:s.value,onClose:t[0]||(t[0]=d=>s.value=!1)},{default:V(()=>[c(Ce,{"thought-input":n.thoughtInput,"usage-reason":n.usageReason},null,8,["thought-input","usage-reason"])]),_:1},8,["open"]),c(Ne,{class:"md:w-96","thought-input":n.thoughtInput,"usage-reason":n.usageReason,onClick:t[1]||(t[1]=d=>s.value=!0)},null,8,["thought-input","usage-reason"])]))}}),ze={class:"relative max-w-full"},Me={key:0,class:"absolute md:border h-full start-1/2"},ae=y({__name:"ThoughtInputsList",props:{thoughtInputs:{},usageReasons:{},center:{type:Boolean,default:!1}},emits:["select"],setup(r,{emit:s}){const n=r,t=e=>{if(n.usageReasons&&n.usageReasons.length===n.thoughtInputs.length)return n.usageReasons[e]},d=e=>e.sort((i,o)=>+(o.interaction_date>i.interaction_date)),l=e=>{console.log("Select"),s("select",e)};return(e,i)=>(a(),_("div",ze,[e.center?w("",!0):(a(),_("div",Me)),(a(!0),_(W,null,G(d(e.thoughtInputs),(o,m)=>(a(),x(je,{key:o.id,class:ge(["mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1",{"md:ml-0":m%2==0&&!e.center,"md:mr-0":!e.center}]),"thought-input":o,"usage-reason":t(m),onClick:U=>l(o)},null,8,["class","thought-input","usage-reason","onClick"]))),128))]))}});function He(){return{resource_title:"",resource_author_name:"",resource_type:"",resource_external_content_url:"",resource_image_url:"",resource_comment:"",interaction_progress:0,interaction_date:new Date(Date.now()),interaction_comment:"",interaction_is_public:!0}}function E(r){return console.log("Date : ",r.interaction_date),r.interaction_date=new Date(r.interaction_date),r}async function Ke(){return(await D.get("/thought_inputs")).data.map(s=>E(s))}async function We(r){const s=await D.get("/thought_inputs/"+r);return E(s.data)}async function Ge(r){return(await D.get("/users/"+r+"/thought_inputs")).data.map(n=>E(n))}async function Je(r){const s=new Date(r.interaction_date);console.log("Date : ",s);const n=s.toISOString().split(".")[0];r.interaction_progress=Number(r.interaction_progress);const t=await D.post("/thought_inputs",{...r,interaction_date:n});return E(t.data)}function Qe(){return{getUserThoughtInputs:Ge,newThoughtInput:He,createThoughtInput:Je,getThoughtInputs:Ke,getThoughtInput:We}}const Xe={key:0},Ye={key:2},Ze={class:"flex flex-row-reverse"},et=y({__name:"CreateThoughtInputUsageForm",props:{thoughtOutput:{}},emits:["close","refresh"],setup(r,{emit:s}){const n=r,{user:t}=q(),d=g([]),l=g(null),e=g(""),{createThoughtInputUsage:i}=ue(),o=async()=>{if(console.log("create"),!l.value)return;const T={thought_output_id:n.thoughtOutput.id,thought_input_id:l.value.id,usage_reason:e.value};await i(T),s("refresh"),s("close")},{getUserThoughtInputs:m}=Qe(),U=T=>{l.value=T};return C(async()=>{!t.value||!t.value.id||(d.value=await m(t.value.id))}),(T,$)=>(a(),_("div",null,[A(t)?(a(),_("div",Xe,"Nouvelle utilisation par "+f(A(t).first_name)+" "+f(A(t).last_name),1)):w("",!0),l.value?(a(),_("div",Ye,[c(J,{label:"Pourquoi ajouter cet élément ?",modelValue:e.value,"onUpdate:modelValue":$[1]||($[1]=k=>e.value=k)},null,8,["modelValue"]),u("div",Ze,[c(S,{type:"valid",onClick:o,text:"Ajouter"}),c(S,{type:"abort",onClick:$[2]||($[2]=k=>s("close")),text:"Ajouter"})])])):(a(),x(ae,{key:1,"thought-inputs":d.value,center:"",onSelect:$[0]||($[0]=k=>U(k))},null,8,["thought-inputs"]))]))}}),tt={class:"justify-items-center mx-auto flex flex-wrap max-w-full"},ot=y({__name:"ToggleButtonGroup",props:{choices:{},default:{}},setup(r){const s=r,n=g(null),t=oe(),d=se(),l=e=>{n.value=e;const i=d.query,o=d.path;t.push({path:o,query:{...i,tab:e}}),console.log(`route : ${JSON.stringify(d)}`)};return C(()=>l(s.default??"")),(e,i)=>(a(),_("div",tt,[(a(!0),_(W,null,G(e.choices,o=>(a(),x(S,{key:o.value,class:"w-24 my-1 mx-1",text:o.text,onClick:m=>l(o.value),type:o.value==n.value?"valid":"abort"},null,8,["text","onClick","type"]))),128))]))}}),st={class:"block text-2xs text-slate-800"},lt=["value"],ut=["value"],K=y({__name:"SelectInput",props:{label:{},choices:{},modelValue:{}},emits:["update:modelValue"],setup(r,{emit:s}){const n=t=>{s("update:modelValue",t.target.value)};return(t,d)=>(a(),_("div",null,[u("label",st,f(t.label),1),u("select",{value:t.modelValue,name:"Stade d'écriture",class:"text-xs w-full p-1 block rounded border-2 border-neutral-400",onInput:d[0]||(d[0]=l=>n(l))},[(a(!0),_(W,null,G(t.choices,l=>(a(),_("option",{key:l.value,value:l.value},f(l.text),9,ut))),128))],40,lt)]))}}),nt={class:"m-4"},at={class:"block text-2xs text-slate-800"},rt=["value","placeholder"],re=y({__name:"NumberInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue","input"],setup(r,{emit:s}){const n=t=>{s("update:modelValue",t.target.value),s("input",t.target.value)};return(t,d)=>(a(),_("div",nt,[u("label",at,f(t.label),1),u("input",{class:"border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-xs",type:"number",value:t.modelValue,placeholder:t.placeholder,onInput:d[0]||(d[0]=l=>n(l))},null,40,rt)]))}}),it={class:"flex"},dt={class:"ml-auto h-6 m-4 w-1/3"},ct={class:"ml-auto h-6 m-4 w-1/3"},pt={class:"flex"},mt=y({__name:"ArticleForm",props:{article:{}},emits:["change"],setup(r,{emit:s}){const n=r,t=g([{text:"Terminé",value:"fnsh"},{text:"Relecture",value:"rvew"},{text:"Idée",value:"idea"}]),{categories:d}=le(),l=R(()=>d.value.map(i=>({text:i.display_name,value:i.id}))),e=(i,o)=>{let m={...n.article};m[i]=o,s("change",m)};return(i,o)=>(a(),_("div",null,[c(I,{label:"Titre",modelValue:i.article.resource_title,"onUpdate:modelValue":o[0]||(o[0]=m=>e("resource_title",m))},null,8,["modelValue"]),c(I,{class:"h-6",label:"Sous-titre",modelValue:i.article.resource_subtitle,"onUpdate:modelValue":o[1]||(o[1]=m=>e("resource_subtitle",m))},null,8,["modelValue"]),u("div",it,[c(re,{class:"mr-auto h-6",label:"Progression",modelValue:i.article.interaction_progress,"onUpdate:modelValue":o[2]||(o[2]=m=>e("progress",m))},null,8,["modelValue"]),u("div",dt,[c(K,{label:"Catégorie",choices:l.value,"model-value":i.article.resource_category_id,"onUpdate:modelValue":o[3]||(o[3]=m=>e("resource_category_id",m))},null,8,["choices","model-value"])]),u("div",ct,[c(K,{label:"Stade d'écriture",choices:t.value,"model-value":i.article.resource_maturing_state,"onUpdate:modelValue":o[4]||(o[4]=m=>e("maturing_state",m))},null,8,["choices","model-value"])])]),u("div",pt,[c(I,{class:"h-6",label:"Lien contenu externe",modelValue:i.article.resource_external_content_url,"onUpdate:modelValue":o[5]||(o[5]=m=>e("resource_external_content_url",m))},null,8,["modelValue"]),c(I,{class:"h-6",label:"Lien image",modelValue:i.article.resource_image_url,"onUpdate:modelValue":o[6]||(o[6]=m=>e("resource_image_url",m))},null,8,["modelValue"])]),c(J,{label:"Pistes d'amélioration",modelValue:i.article.resource_comment,"onUpdate:modelValue":o[7]||(o[7]=m=>e("resource_comment",m))},null,8,["modelValue"])]))}}),_t={class:"flex"},ht={class:"ml-auto h-6 m-4 w-1/3"},vt={class:"flex"},gt=y({__name:"ProblemForm",props:{problem:{}},emits:["change"],setup(r,{emit:s}){const n=r,{categories:t}=le(),d=R(()=>t.value.map(e=>({text:e.display_name,value:e.id}))),l=(e,i)=>{let o={...n.problem};o[e]=i,s("change",o)};return(e,i)=>(a(),_("div",null,[c(I,{label:"Titre",modelValue:e.problem.resource_title,"onUpdate:modelValue":i[0]||(i[0]=o=>l("resource_title",o))},null,8,["modelValue"]),c(I,{class:"h-6",label:"Description",modelValue:e.problem.resource_subtitle,"onUpdate:modelValue":i[1]||(i[1]=o=>l("resource_subtitle",o))},null,8,["modelValue"]),u("div",_t,[c(re,{class:"mr-auto h-6",label:"Progression",modelValue:e.problem.interaction_progress,"onUpdate:modelValue":i[2]||(i[2]=o=>l("progress",o))},null,8,["modelValue"]),u("div",ht,[c(K,{label:"Catégorie",choices:d.value,"model-value":e.problem.resource_category_id,"onUpdate:modelValue":i[3]||(i[3]=o=>l("resource_category_id",o))},null,8,["choices","model-value"])])]),u("div",vt,[c(I,{class:"h-6",label:"Lien image",modelValue:e.problem.resource_image_url,"onUpdate:modelValue":i[4]||(i[4]=o=>l("resource_image_url",o))},null,8,["modelValue"])])]))}}),ft={key:0,class:"mx-auto"},bt={key:0},yt={class:"my-8"},xt=["src"],wt={class:"text-3xl my-3 font-mplus md:text-center text-left"},$t={class:"md:text-center text-left"},kt={class:"md:text-center text-left"},Vt={class:"md:flex my-8"},It=["href"],Ct={key:1},Tt={class:"flex flex-row-reverse"},Ut={key:1,class:"p-2 border rounded bg-neutral-100"},Ot=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Rt={key:2},St=u("div",{class:"text-xs italic"},"Commentaire",-1),At=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Bt=u("div",{class:"text-xs italic"},"Contenu",-1),qt={key:3},Dt=y({__name:"ResourceComponent",props:{id:{}},setup(r){const s=r,n=se(),t=R(()=>p.value),d=g([{text:"Contenu",value:"ctnt"},{text:"Biblio",value:"bbli"}]),l=g(n.query.tab&&typeof n.query.tab=="string"?n.query.tab:"ctnt"),e=g(null);z(()=>n.query.tab,v=>{console.log("new route query",v),typeof v=="string"&&(e.value=v)});const{getThoughtInputUsagesForThoughtOutput:i}=ue(),o=g([]),m=g(!1),U=async()=>{o.value=await i(M(s).id.value)};C(()=>U());const{newThoughtOutput:T,getThoughtOutput:$,updateThoughtOutput:k}=ye(),L=g(null),p=g(T()),ie=oe();z(()=>n.query.editing,v=>{console.log("Editing : ",v),F.value=v==="false"?!1:!!v});const F=g(!1),Q=v=>{ie.push({query:{editing:v.toString()}})},de=()=>{!p.value||!p.value.id||(p.value.resource_publishing_state="pbsh",k(p.value.id,p.value))},N=(v,h)=>{p.value=h,L.value!==null&&clearTimeout(L.value),L.value=setTimeout(async()=>{try{await k(v,p.value)}catch(j){console.log("An error : ",j)}},1e3)},X=v=>{v!=`
`&&N(M(s).id.value,{...p.value,resource_content:v})},{user:Y,getUserById:ce}=q(),P=R(()=>Y.value?p.value.interaction_user_id==Y.value.id:!1),O=g(null),{getCommentsForThoughtOutput:pe}=be(),Z=g([]);return C(async()=>{p.value=await $(s.id),Z.value=await pe(s.id),p.value.interaction_user_id&&(O.value=await ce(p.value.interaction_user_id));const v=n.query.editing;F.value=v==="false"?!1:!!v}),(v,h)=>{const j=ee("router-link");return p.value?(a(),_("div",ft,[F.value?(a(),_("div",Ct,[p.value.resource_type=="atcl"?(a(),x(mt,{key:0,article:t.value,onChange:h[1]||(h[1]=b=>N(p.value.id,b))},null,8,["article"])):(a(),x(gt,{key:1,problem:p.value,onChange:h[2]||(h[2]=b=>N(p.value.id,b))},null,8,["problem"])),u("div",Tt,[c(S,{class:"mx-4",onClick:h[3]||(h[3]=b=>Q(!1)),type:"valid",text:"Preview"},{default:V(()=>[B("Ok")]),_:1}),p.value.resource_publishing_state=="drft"?(a(),x(S,{key:0,onClick:de,type:"valid",text:"Publier"})):(a(),_("div",Ut,"Publié"))])])):(a(),_("div",bt,[u("div",yt,[u("img",{src:p.value.resource_image_url,class:"border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto",style:{"max-height":"20rem"}},null,8,xt)]),u("h1",wt,f(p.value.resource_title),1),u("div",$t,f(p.value.resource_subtitle),1),u("div",kt,[O.value?(a(),x(j,{key:0,to:"/users/"+O.value.id,class:"text-sm underline"},{default:V(()=>[B(f(O.value.first_name)+" "+f(O.value.last_name),1)]),_:1},8,["to"])):w("",!0)]),P.value?(a(),x(fe,{key:0,onClick:h[0]||(h[0]=b=>Q(!0))},{default:V(()=>[c(A(xe),{class:"m-1"})]),_:1})):w("",!0),u("div",Vt,[c(te,{"progress-value":p.value.interaction_progress,class:"m-2 w-1/3"},null,8,["progress-value"]),p.value.resource_type==="atcl"?(a(),_("a",{key:0,class:"ml-auto underline",href:t.value.resource_external_content_url}," Ajouter un commentaire ",8,It)):w("",!0)])])),u("div",null,[c(ot,{choices:d.value,default:l.value},null,8,["choices","default"])]),Ot,e.value=="ctnt"?(a(),_("div",Rt,[St,c(H,{"full-text":p.value.resource_comment,editable:P.value},null,8,["full-text","editable"]),At,Bt,p.value.resource_publishing_state!="drft"?(a(),x(H,{key:0,"ext-comments":Z.value,"resource-id":p.value.id,"full-text":p.value.resource_content,editable:P.value,onChange:h[4]||(h[4]=b=>X(b))},null,8,["ext-comments","resource-id","full-text","editable"])):(a(),x(J,{key:1,class:"h-96",label:"Contenu",modelValue:p.value.resource_content,"onUpdate:modelValue":h[5]||(h[5]=b=>X(b))},null,8,["modelValue"]))])):(a(),_("div",qt,[c(ne,{open:m.value,onClose:h[7]||(h[7]=b=>m.value=!1)},{default:V(()=>[c(et,{onRefresh:U,onClose:h[6]||(h[6]=b=>m.value=!1),"thought-output":p.value},null,8,["thought-output"])]),_:1},8,["open"]),u("div",{onClick:h[8]||(h[8]=b=>m.value=!0),class:"text-sm italic underline"}," Ajouter une référence "),c(ae,{"thought-inputs":o.value.map(b=>b.thought_input),"usage-reasons":o.value.map(b=>b.usage_reason)},null,8,["thought-inputs","usage-reasons"])]))])):w("",!0)}}});export{Dt as _,Ce as a,ne as b,ae as c,Qe as u};
