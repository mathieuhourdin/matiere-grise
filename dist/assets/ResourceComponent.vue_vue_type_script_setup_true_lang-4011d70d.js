import{o as a,c as d,i as r,d as I,t as y,F as ye,j as be,r as v,q as U,g as B,k as u,e as K,z as De,x as ne,A as q,m as Se,B as Te,C as Fe,a as w,s as we,p as R,w as A,h as j,D as ke,E as Be,G as D,u as z,H as $e,n as J,I as Oe,J as Ee,K as Le,v as Pe,l as Me,f as Ne,y as ce}from"./index-736ccde6.js";import{_ as de,u as qe}from"./TextInterface.vue_vue_type_script_setup_true_lang-c61a64fb.js";import{_ as P}from"./TextInput.vue_vue_type_script_setup_true_lang-5d6237ad.js";import{u as me}from"./useResource-f95a6930.js";import{a as je,u as Re}from"./useProblem-66cb382c.js";function ze(n,e){return a(),d("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[r("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"})])}function He(n,e){return a(),d("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[r("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}function Je(n,e){return a(),d("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[r("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"})])}const Ke={class:"block text-2xs text-slate-800"},We=["value"],Ge=["value"],H=I({__name:"SelectInput",props:{label:{},choices:{},modelValue:{},displayFunction:{type:Function,default:n=>n.text}},emits:["update:modelValue"],setup(n,{emit:e}){const o=t=>{console.log(t.target.value),e("update:modelValue",t.target.value)};return(t,l)=>(a(),d("div",null,[r("label",Ke,y(t.label),1),r("select",{value:t.modelValue,name:"Stade d'écriture",class:"text-xs w-full p-1 block rounded border-2 border-neutral-400",onInput:l[0]||(l[0]=i=>o(i))},[(a(!0),d(ye,null,be(t.choices,i=>(a(),d("option",{key:i.value,value:i.value},y(t.displayFunction(i)),9,Ge))),128))],40,We)]))}}),Qe={class:"m-4"},Xe={class:"block text-2xs text-slate-800"},Ye=["value","placeholder"],Z=I({__name:"TextAreaInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue"],setup(n,{emit:e}){const o=t=>{e("update:modelValue",t.target.value)};return(t,l)=>(a(),d("div",Qe,[r("label",Xe,y(t.label),1),r("textarea",{class:"border border-neutral-800 block h-full w-full",value:t.modelValue,placeholder:t.placeholder,onInput:l[0]||(l[0]=i=>o(i))},null,40,Ye)]))}}),Ze=r("hr",{class:"border-top border-zinc-400 my-4"},null,-1),et=r("div",{class:"text-xs italic"},"Raison de la lecture",-1),tt=I({__name:"SeeThoughtInput",props:{thoughtInput:{}},setup(n){const e=n,{getUserById:o,user:t}=K(),l=v(null),i=U(()=>t.value?e.thoughtInput.interaction_user_id===t.value.id:!1);return B(async()=>{e.thoughtInput.interaction_user_id&&(l.value=await o(e.thoughtInput.interaction_user_id))}),(f,m)=>(a(),d("div",null,[u($o,{id:f.thoughtInput.resource_id,"second-level":""},null,8,["id"]),Ze,et,u(de,{"full-text":f.thoughtInput.interaction_comment,editable:i.value},null,8,["full-text","editable"])]))}}),ot={class:"flex"},oe=I({__name:"ModalSheet",props:{open:{type:Boolean,default:!1}},emits:["close"],setup(n,{emit:e}){const o=n,t=v(!1);return B(()=>{t.value=o.open}),De(()=>{const l=i=>{(i.key==="Escape"||i.key==="Enter"||i.key==="Esc"||i.keyCode===27)&&e("close")};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}}),ne(q(o).open,l=>t.value=l),(l,i)=>t.value?(a(),d("div",{key:0,tabindex:"0",onKeyup:i[2]||(i[2]=Fe(f=>e("close"),["esc"])),class:"fixed top-0 left-0 w-full h-full z-10 bg-slate-500/50",onClick:i[3]||(i[3]=f=>e("close"))},[r("div",{class:"max-w-xl overflow-y-scroll max-h-screen mb-10 bg-white mx-auto mt-6 p-4 rounded shadow",onClick:i[1]||(i[1]=Te(()=>{},["stop"]))},[r("div",ot,[r("div",{class:"ml-auto",onClick:i[0]||(i[0]=f=>e("close"))},"x")]),Se(l.$slots,"default")])],32)):w("",!0)}}),nt={class:"w-full md:w-96"},st={key:0,class:"text-xs italic mb-2"},lt={class:"flex flex-wrap"},at={key:1,class:"text-2xs italic ml-2"},rt={key:2,class:"ml-auto m-1 w-1/3"},ut={key:1,class:"border shadow-lg rounded p-4 md:w-96"},it={class:"flex"},ct=["src"],dt={class:"flex flex-wrap w-full",style:{"margin-top":"-8px"}},mt={class:"text-2xs"},pt={class:"flex flex-wrap"},vt={key:0,class:"text-2xs italic"},_t=I({__name:"ThoughtInputCard",props:{contextualResource:{}},setup(n){const e=n,{getUserById:o}=K(),{getAuthorInteractionForResource:t}=me(),l=v(null),i=v(null),f=v(null);B(async()=>{e.contextualResource.user_id&&(f.value=await o(e.contextualResource.user_id)),e.contextualResource.resource&&(i.value=await t(e.contextualResource.resource.id)),i.value&&(l.value=await o(i.value.interaction_user_id))});const m=s=>s?s.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}):"",x=s=>s.length>200?s.slice(0,150)+"...":s;return(s,_)=>{const b=we("router-link");return a(),d("div",nt,[s.contextualResource.context_comment?(a(),d("div",st,[r("div",null,y(s.contextualResource.context_comment),1),r("div",lt,[f.value?(a(),R(b,{key:0,to:"/users/"+f.value.id,class:"text-2xs underline"},{default:A(()=>[j(y(f.value.first_name)+" "+y(f.value.last_name),1)]),_:1},8,["to"])):w("",!0),s.contextualResource.date?(a(),d("div",at,y(m(s.contextualResource.date)),1)):w("",!0),s.contextualResource.progress?(a(),d("div",rt,[u(ke,{"progress-value":s.contextualResource.progress},null,8,["progress-value"])])):w("",!0)])])):w("",!0),s.contextualResource.resource?(a(),d("div",ut,[r("div",it,[s.contextualResource.resource?(a(),d("img",{key:0,class:"w-8 h-fit mr-4",src:s.contextualResource.resource.image_url},null,8,ct)):w("",!0),r("div",null,[r("div",null,[u(b,{to:"/resources/"+s.contextualResource.resource.id},{default:A(()=>[j(y(s.contextualResource.resource.title)+" "+y(s.contextualResource.resource.subtitle),1)]),_:1},8,["to"])]),r("div",dt,[l.value?(a(),R(b,{key:0,to:"/users/"+l.value.id,class:"text-2xs underline"},{default:A(()=>[j(y(l.value.first_name)+" "+y(l.value.last_name),1)]),_:1},8,["to"])):w("",!0)]),r("div",mt,y(x(s.contextualResource.resource.comment)),1)])]),r("div",pt,[s.contextualResource.date?(a(),d("div",vt,y(m(s.contextualResource.resourcedate)),1)):w("",!0)])])):w("",!0)])}}}),gt={class:"w-fit"},ft=I({__name:"ThoughtInputCardWithPopup",props:{thoughtInput:{},usageReason:{}},setup(n){const e=v(!1);return(o,t)=>(a(),d("div",gt,[u(oe,{open:e.value,onClose:t[0]||(t[0]=l=>e.value=!1)},{default:A(()=>[u(tt,{"thought-input":o.thoughtInput,"usage-reason":o.usageReason},null,8,["thought-input","usage-reason"])]),_:1},8,["open"]),u(_t,{class:"md:w-96","contextual-resource":o.thoughtInput,onClick:t[1]||(t[1]=l=>e.value=!0)},null,8,["contextual-resource"])]))}}),ht={class:"relative max-w-full"},xt={key:0,class:"absolute md:border h-full start-1/2"},Y=I({__name:"ThoughtInputsList",props:{contextualResources:{},center:{type:Boolean,default:!1}},emits:["select"],setup(n,{emit:e}){const o=l=>l.sort((i,f)=>+(f.date>i.date)),t=l=>{console.log("Select"),e("select",l)};return(l,i)=>(a(),d("div",ht,[l.center?w("",!0):(a(),d("div",xt)),(a(!0),d(ye,null,be(o(l.contextualResources),(f,m)=>(a(),R(ft,{key:f.id,class:Be(["mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1",{"md:ml-0":m%2==0&&!l.center,"md:mr-0":!l.center}]),"thought-input":f,onClick:x=>t(f)},null,8,["class","thought-input","onClick"]))),128))]))}});function yt(){const n={title:"",subtitle:"",content:"",external_content_url:"",publishing_state:"pbsh",maturing_state:"fnsh",image_url:"",resource_type:"",comment:""};return{interaction_progress:0,interaction_date:new Date(Date.now()),interaction_comment:"",interaction_is_public:!0,resource:n}}function se(n){return console.log("Date : ",n.interaction_date),n.interaction_date=new Date(n.interaction_date),n}async function bt(){return(await D.get("/thought_inputs")).data.map(e=>se(e))}async function wt(n){const e=await D.get("/thought_inputs/"+n);return se(e.data)}async function kt(n){return(await D.get("/users/"+n+"/thought_inputs")).data.map(o=>se(o))}async function $t(n){const e=new Date(n.interaction_date);console.log("Date : ",e);const o=e.toISOString().split(".")[0];n.interaction_progress=Number(n.interaction_progress);const t=await D.post("/thought_inputs",{...n,interaction_date:o});return se(t.data)}function Rt(){return{getUserThoughtInputs:kt,newThoughtInput:yt,createThoughtInput:$t,getThoughtInputs:bt,getThoughtInput:wt}}const Vt={key:0,class:"mb-4"},Ct={key:1},It={key:1},Ut={key:2},At={class:"flex flex-row-reverse"},xe=I({__name:"CreateResourceRelationForm",props:{targetResource:{},originResource:{}},emits:["close","refresh"],setup(n,{emit:e}){const o=n,{user:t}=K(),l=v(),i=V=>{console.log("Event : ",V),l.value=V},f=v([{text:"Externes",value:"extr"},{text:"Internes",value:"artl"},{text:"Problème",value:"pblm"}]),m=v([{text:"Biblio",value:"bibl"},{text:"Résumé",value:"sumr"},{text:"Sujet principal",value:"main"},{text:"Evocation",value:"mino"}]),x=v([]),s=v(null),_=v([]),b=v([]),C=v([]),N=v(""),S=v(""),{createResourceRelation:W}=Re(),{getResources:E}=me(),{getArticles:h}=Oe(),{getProblems:k}=je(),T=U(()=>x.value.map(V=>({resource:V.resource}))),G=V=>V.map(c=>({resource:c})),le=U(()=>({extr:G(_.value),artl:G(b.value),pblm:G(C.value)})),ae=async()=>{if(console.log("create"),!s.value)return;const V={target_resource_id:o.targetResource?o.targetResource.id:s.value.id,origin_resource_id:o.originResource?o.originResource.id:s.value.id,relation_comment:N.value,relation_type:S.value};await W(V),e("refresh"),e("close")},{getUserThoughtInputs:ee}=Rt(),Q=V=>{s.value=V.resource};return B(async()=>{!t.value||!t.value.id||(o.targetResource&&(x.value=await ee(t.value.id)),o.originResource&&(_.value=await E(),b.value=await h({author:!0}),C.value=await k()))}),(V,c)=>(a(),d("div",null,[z(t)?(a(),d("div",Vt," Nouvelle relation entre ressources par "+y(z(t).first_name)+" "+y(z(t).last_name),1)):w("",!0),s.value?(a(),d("div",Ut,[u(H,{class:"m-4",label:"Type de lien",choices:m.value,modelValue:S.value,"onUpdate:modelValue":c[2]||(c[2]=F=>S.value=F)},null,8,["choices","modelValue"]),u(Z,{class:"m-4",label:"Pourquoi ajouter cet élément ?",modelValue:N.value,"onUpdate:modelValue":c[3]||(c[3]=F=>N.value=F)},null,8,["modelValue"]),r("div",At,[u(J,{type:"valid",onClick:ae,text:"Ajouter"}),u(J,{type:"abort",onClick:c[4]||(c[4]=F=>e("close")),text:"Annuler",class:"mr-1"})])])):(a(),d("div",Ct,[V.targetResource?(a(),R(Y,{key:0,"contextual-resources":T.value,center:"",onSelect:c[0]||(c[0]=F=>Q(F))},null,8,["contextual-resources"])):(a(),d("div",It,[r("div",null,[j(" Choisir une ressource cible "),u($e,{center:"",choices:f.value,default:"pblm",onUpdate:i},null,8,["choices"]),u(Y,{"contextual-resources":le.value[l.value]||[],center:"",onSelect:c[1]||(c[1]=F=>Q(F))},null,8,["contextual-resources"])])]))]))]))}});function Dt(){return{interaction_progress:0,interaction_date:new Date(Date.now()),interaction_comment:"",interaction_is_public:!0}}function M(n){return console.log("Date : ",n.interaction_date),n.interaction_date=new Date(n.interaction_date),n}async function St(){return(await D.get("/thought_inputs")).data.map(e=>M(e))}async function Tt(n){const e=await D.get("/thought_inputs/"+n);return M(e.data)}async function Ft(n){return(await D.get("/users/"+n+"/thought_inputs")).data.map(o=>M(o))}async function Bt(n,e){const o=new Date(e.interaction_date);console.log("Date : ",o);const t=o.toISOString().split(".")[0];e.interaction_progress=Number(e.interaction_progress);const l=await D.put("/interactions/"+n,{...e,interaction_date:t});return M(l.data)}async function Ot(n){const e=new Date(n.interaction_date);console.log("Date : ",e);const o=e.toISOString().split(".")[0];n.interaction_progress=Number(n.interaction_progress);const t=await D.post("/thought_inputs",{...n,interaction_date:o});return M(t.data)}async function Et(n,e){const o=new Date(e.interaction_date);console.log("Date : ",o);const t=o.toISOString().split(".")[0];e.interaction_progress=Number(e.interaction_progress);const l=await D.post(`/resources/${n}/interactions`,{...e,interaction_date:t});return M(l.data)}async function Lt(n){return(await D.get(`/resources/${n}/interactions`)).data.map(o=>M(o))}function pe(){return{getUserInteractions:Ft,newInteraction:Dt,createInteraction:Ot,getInteractions:St,getInteraction:Tt,updateInteraction:Bt,createInteractionForResource:Et,getInteractionsForResource:Lt}}const Pt={class:"flex flex-wrap"},Mt={class:"flex flex-row-reverse"},Nt=I({__name:"CreateInteraction",props:{resource:{}},emits:["close","refresh"],setup(n,{emit:e}){const o=n,t=v([{text:"Lecture / Visionage",value:"inpt"},{text:"Envie",value:"wish"}]),{newInteraction:l,createInteractionForResource:i}=pe(),{user:f}=K(),m=v(l());B(()=>{m.value.interaction_type||(m.value.interaction_type="inpt")});const x=()=>{m.value.resource_id=o.resource.id,m.value.interaction_user_id=f.value.id,i(o.resource.id,m.value),e("refresh"),s()},s=()=>e("close");return(_,b)=>(a(),d("div",null,[r("div",null,"Nouvelle interaction, avec la ressource : "+y(_.resource.title),1),r("div",Pt,[u(P,{label:"Avancement de l'ouvrage",class:"my-auto",modelValue:m.value.interaction_progress,"onUpdate:modelValue":b[0]||(b[0]=C=>m.value.interaction_progress=C),type:"number"},null,8,["modelValue"]),u(H,{label:"Type d'interaction",class:"m-4 w-full md:w-5/12 md:ml-auto",choices:t.value,modelValue:m.value.interaction_type,"onUpdate:modelValue":b[1]||(b[1]=C=>m.value.interaction_type=C)},null,8,["choices","modelValue"])]),u(P,{label:"Date de lecture",modelValue:m.value.interaction_date,"onUpdate:modelValue":b[2]||(b[2]=C=>m.value.interaction_date=C),type:"date"},null,8,["modelValue"]),u(Z,{label:"Pourquoi s'y être interessé ?",modelValue:m.value.interaction_comment,"onUpdate:modelValue":b[3]||(b[3]=C=>m.value.interaction_comment=C)},null,8,["modelValue"]),r("div",Mt,[u(J,{onClick:x,class:"m-4",text:"Valider",type:"valid"}),u(J,{onClick:s,class:"m-4",text:"Annuler",type:"abort"})])]))}}),qt=I({__name:"DateField",props:{date:{}},setup(n){const e=n,o=U(()=>new Date(e.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}));return(t,l)=>(a(),d("div",null,y(o.value),1))}}),jt=I({__name:"CheckboxInput",props:{label:{},modelValue:{type:Boolean}},emits:["update:modelValue"],setup(n,{emit:e}){const o=n,t="checkbox-"+Math.random().toString(36).substr(2,9),l=v(q(o).modelValue),i=()=>{l.value=!l.value,console.log(l.value),e("update:modelValue",!o.modelValue)};return(f,m)=>(a(),d("div",null,[Ee(r("input",{class:"m-2",type:"checkbox",id:t,"onUpdate:modelValue":m[0]||(m[0]=x=>l.value=x),onChange:i},null,544),[[Le,l.value]]),r("label",{for:t},y(f.label),1)]))}}),zt={class:"m-4"},Ht={class:"block text-2xs text-slate-800"},Jt=["value","placeholder"],Ve=I({__name:"NumberInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue","input"],setup(n,{emit:e}){const o=t=>{e("update:modelValue",t.target.value),e("input",t.target.value)};return(t,l)=>(a(),d("div",zt,[r("label",Ht,y(t.label),1),r("input",{class:"border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-xs",type:"number",value:t.modelValue,placeholder:t.placeholder,onInput:l[0]||(l[0]=i=>o(i))},null,40,Jt)]))}}),Kt={class:"flex"},Wt={class:"ml-auto h-6 m-4 w-1/3"},Gt={class:"ml-auto h-6 m-4 w-1/3"},Qt={class:"ml-auto h-6 m-4 w-1/3"},Xt={class:"my-auto ml-auto h-6 m-4 w-1/3"},Yt={class:"flex"},Zt=I({__name:"ArticleForm",props:{article:{}},emits:["change"],setup(n,{emit:e}){const o=n,t=v([{text:"Terminé",value:"fnsh"},{text:"Relecture",value:"rvew"},{text:"Idée",value:"idea"}]),l=v([{text:"Livre",value:"book"},{text:"Fiche de lecture",value:"shet"},{text:"Article de média",value:"natc"},{text:"Article de recherche",value:"ratc"},{text:"Film",value:"movi"},{text:"Podcast",value:"pcst"}]),{categories:i}=Pe(),f=U(()=>i.value.map(x=>({text:x.display_name,value:x.id}))),m=(x,s)=>{let _={...o.article};_[x]=s,e("change",_)};return(x,s)=>(a(),d("div",null,[u(P,{label:"Titre",modelValue:x.article.title,"onUpdate:modelValue":s[0]||(s[0]=_=>m("title",_))},null,8,["modelValue"]),u(P,{class:"h-6",label:"Sous-titre",modelValue:x.article.subtitle,"onUpdate:modelValue":s[1]||(s[1]=_=>m("subtitle",_))},null,8,["modelValue"]),r("div",Kt,[u(Ve,{class:"mr-auto h-6",label:"Progression",modelValue:x.article.interaction_progress,"onUpdate:modelValue":s[2]||(s[2]=_=>m("progress",_))},null,8,["modelValue"]),r("div",Wt,[u(H,{label:"Catégorie",choices:f.value,"model-value":x.article.category_id,"onUpdate:modelValue":s[3]||(s[3]=_=>m("category_id",_))},null,8,["choices","model-value"])]),r("div",Gt,[u(H,{label:"Stade d'écriture",choices:t.value,"model-value":x.article.maturing_state,"onUpdate:modelValue":s[4]||(s[4]=_=>m("maturing_state",_))},null,8,["choices","model-value"])]),r("div",Qt,[u(H,{label:"Type de ressource",choices:l.value,"onUpdate:modelValue":s[5]||(s[5]=_=>m("resource_type",_)),"model-value":x.article.resource_type},null,8,["choices","model-value"])]),r("div",Xt,[u(jt,{class:"mt-3",label:"Externe","onUpdate:modelValue":s[6]||(s[6]=_=>m("is_external",_)),"model-value":x.article.is_external},null,8,["model-value"])])]),r("div",Yt,[u(P,{class:"h-6",label:"Lien contenu externe",modelValue:x.article.external_content_url,"onUpdate:modelValue":s[7]||(s[7]=_=>m("external_content_url",_))},null,8,["modelValue"]),u(P,{class:"h-6",label:"Lien image",modelValue:x.article.image_url,"onUpdate:modelValue":s[8]||(s[8]=_=>m("image_url",_))},null,8,["modelValue"])]),u(Z,{label:"Pistes d'amélioration",modelValue:x.article.comment,"onUpdate:modelValue":s[9]||(s[9]=_=>m("comment",_))},null,8,["modelValue"])]))}}),eo={class:"flex flex-wrap"},to=I({__name:"ResourceAuthorPicker",props:{interaction:{},resourceId:{}},emits:["update"],setup(n,{emit:e}){const o=n,t=v(null),l=v([]),i=h=>{if(h)return{text:`${h.first_name} ${h.last_name}`,value:h.id}},f=U(()=>{var h;return(h=t.value)==null?void 0:h.id}),m=U(()=>{if(l.value)return l.value.map(h=>i(h))}),{getUsers:x,getUserById:s}=K(),_=async h=>t.value=await s(h.interaction_user_id),{createInteractionForResource:b,newInteraction:C,createInteraction:N,updateInteraction:S}=pe(),W=async h=>{if(console.log(`newUser : ${JSON.stringify(h)}`),o.interaction){const k={...o.interaction};k.interaction_user_id=h,console.log("newUserid : ",h.id),console.log(`Interaction payload : ${JSON.stringify(k)}`),await S(o.interaction.id,k),e("update")}else{console.log("create interaction");const k=C();k.interaction_user_id=h,k.resource_id=o.resourceId,await b(o.resourceId,k),e("update")}},E=async h=>{await S(o.interaction.id,h),e("update")};return B(async()=>{l.value=await x(),await _(o.interaction)}),ne(q(o).interaction,async h=>await _(h)),(h,k)=>(a(),d("div",null,[r("div",eo,[u(H,{label:"Auteur",class:"my-auto",choices:m.value,"model-value":f.value,"onUpdate:modelValue":k[0]||(k[0]=T=>W(T))},null,8,["choices","model-value"]),h.interaction?(a(),R(P,{key:0,class:"my-auto",label:"Date d'écriture","model-value":h.interaction.interaction_date.split("T")[0],"onUpdate:modelValue":k[1]||(k[1]=T=>E({...h.interaction,interaction_date:T})),type:"date"},null,8,["model-value"])):w("",!0),h.interaction?(a(),R(Ve,{key:1,class:"my-auto",label:"Progression",modelValue:h.interaction.interaction_progress,"onUpdate:modelValue":k[2]||(k[2]=T=>E({...h.interaction,interaction_progress:T}))},null,8,["modelValue"])):w("",!0)])]))}}),oo={key:0,class:"mx-auto"},no={key:0},so={class:"my-8"},lo=["src"],ao={class:"text-3xl my-3 font-mplus md:text-center text-left"},ro={class:"md:text-center text-left"},uo={class:"md:text-center text-left"},io={class:"md:flex my-8"},co=["href"],mo={key:1},po={class:"flex flex-row-reverse"},vo={key:1,class:"p-2 border rounded bg-neutral-100"},_o=r("hr",{class:"border-top border-zinc-400 my-4"},null,-1),go={key:2},fo=r("div",{class:"text-xs italic"},"Commentaire",-1),ho=r("hr",{class:"border-top border-zinc-400 my-4"},null,-1),xo=r("div",{class:"text-xs italic"},"Contenu",-1),yo={key:3},bo={key:4},wo={key:5},ko={class:"fixed right-3 bottom-5"},$o=I({__name:"ResourceComponent",props:{id:{},secondLevel:{type:Boolean}},setup(n){const e=n,o=Me(),t=U(()=>e.secondLevel?"popup_tab":"tab"),l=U(()=>[{text:"Contenu",value:"ctnt"},{text:"Biblio",value:"bbli",count:s.value.length},{text:"Sujets",value:"pblm",count:k.value.length},{text:"Interactions",value:"inpt",count:S.value.length}]),i=v(o.query[t.value]&&typeof o.query[t.value]=="string"?o.query[t.value]:"ctnt"),f=v(o.query[t.value]);ne(()=>o.query[t.value],p=>{console.log("new route query",p),typeof p=="string"&&(f.value=p)});const{getResourceRelationsForResource:m,getUsagesForResource:x}=Re(),s=v([]),_=v(!1),b=v(!1),C=async()=>{s.value=await m(q(e).id.value)},N=U(()=>s.value.map(p=>({resource:p.origin_resource,date:p.created_at,user_id:p.user_id,context_comment:p.relation_comment,progress:null})));B(()=>C());const S=v([]),{getInteractionsForResource:W}=pe(),E=async()=>{S.value=await W(e.id)};B(async()=>await E());const h=U(()=>S.value.map(p=>({resource:null,date:p.interaction_date,user_id:p.interaction_user_id,context_comment:p.interaction_comment,progress:p.interaction_progress}))),k=v([]);B(async()=>await T());const T=async()=>{k.value=await x(e.id)},G=U(()=>k.value.map(p=>({resource:p.target_resource,date:p.created_at,user_id:p.user_id,context_comment:p.relation_comment,progress:null}))),{newResource:le,getResource:ae,updateResource:ee,getAuthorInteractionForResource:Q}=me(),V=v(null),c=v(le()),F=Ne();ne(()=>o.query.editing,p=>{console.log("Editing : ",p),re.value=p==="false"?!1:!!p});const re=v(!1),ve=p=>{F.push({query:{editing:p.toString()}})},Ce=()=>{!c.value||!c.value.id||(c.value.publishing_state="pbsh",ee(c.value.id,c.value))},ue=(p,g)=>{c.value=g,V.value!==null&&clearTimeout(V.value),V.value=setTimeout(async()=>{try{await ee(p,c.value)}catch(ie){console.log("An error : ",ie)}},1e3)},_e=p=>{p!=`
`&&ue(q(e).id.value,{...c.value,content:p})},ge=p=>{p!=`
`&&ue(q(e).id.value,{...c.value,comment:p})},{user:fe,getUserById:Ie}=K(),X=U(()=>c.value.is_external?!0:!fe.value||!L.value?!1:L.value.id==fe.value.id),L=v(null),O=v(null),te=v(!1),Ue=async()=>{O.value=await Q(e.id)},{getCommentsForThoughtOutput:Ae}=qe(),he=v([]);return B(async()=>{c.value=await ae(e.id),he.value=await Ae(e.id),O.value=await Q(e.id),O.value&&(L.value=await Ie(O.value.interaction_user_id));const p=o.query.editing;re.value=p==="false"?!1:!!p}),(p,g)=>{const ie=we("router-link");return c.value?(a(),d("div",oo,[re.value?(a(),d("div",mo,[u(Zt,{article:c.value,onChange:g[0]||(g[0]=$=>ue(c.value.id,$))},null,8,["article"]),u(to,{class:"mx-4",interaction:O.value,"resource-id":p.id,onChange:Ue},null,8,["interaction","resource-id"]),r("div",po,[u(J,{class:"mx-4",onClick:g[1]||(g[1]=$=>ve(!1)),type:"valid",text:"Preview"},{default:A(()=>[j("Ok")]),_:1}),c.value.publishing_state=="drft"?(a(),R(J,{key:0,onClick:Ce,type:"valid",text:"Publier"})):(a(),d("div",vo,"Publié"))])])):(a(),d("div",no,[r("div",so,[r("img",{src:c.value.image_url,class:"border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto",style:{"max-height":"20rem"}},null,8,lo)]),r("h1",ao,y(c.value.title),1),r("div",ro,y(c.value.subtitle),1),r("div",uo,[L.value?(a(),R(ie,{key:0,to:"/users/"+L.value.id,class:"text-sm underline"},{default:A(()=>[j(y(L.value.first_name)+" "+y(L.value.last_name),1)]),_:1},8,["to"])):w("",!0),O.value?(a(),R(qt,{key:1,date:O.value.interaction_date},null,8,["date"])):w("",!0)]),r("div",io,[O.value?(a(),R(ke,{key:0,"progress-value":O.value.interaction_progress,class:"m-2 w-1/3"},null,8,["progress-value"])):w("",!0),c.value.external_content_url?(a(),d("a",{key:1,class:"ml-auto underline",href:c.value.external_content_url,target:"_blank"}," Lien ressource externe ",8,co)):w("",!0)])])),r("div",null,[u($e,{choices:l.value,default:i.value,"url-key":t.value,url:""},null,8,["choices","default","url-key"])]),_o,f.value=="ctnt"?(a(),d("div",go,[fo,c.value.publishing_state!="drft"?(a(),R(de,{key:0,"full-text":c.value.comment,editable:X.value,onChange:g[2]||(g[2]=$=>ge($))},null,8,["full-text","editable"])):(a(),R(Z,{key:1,class:"h-20",label:"Commentaire",modelValue:c.value.comment,"onUpdate:modelValue":g[3]||(g[3]=$=>ge($))},null,8,["modelValue"])),ho,xo,c.value.publishing_state!="drft"?(a(),R(de,{key:2,"ext-comments":he.value,"resource-id":c.value.id,"full-text":c.value.content,editable:X.value,onChange:g[4]||(g[4]=$=>_e($))},null,8,["ext-comments","resource-id","full-text","editable"])):(a(),R(Z,{key:3,class:"h-96",label:"Contenu",modelValue:c.value.content,"onUpdate:modelValue":g[5]||(g[5]=$=>_e($))},null,8,["modelValue"]))])):f.value=="bbli"?(a(),d("div",yo,[u(oe,{open:_.value,onClose:g[7]||(g[7]=$=>_.value=!1)},{default:A(()=>[u(xe,{onRefresh:C,onClose:g[6]||(g[6]=$=>_.value=!1),"target-resource":c.value},null,8,["target-resource"])]),_:1},8,["open"]),r("div",{onClick:g[8]||(g[8]=$=>_.value=!0),class:"text-sm italic underline"}," Ajouter une référence "),u(Y,{"contextual-resources":N.value},null,8,["contextual-resources"])])):f.value=="pblm"?(a(),d("div",bo,[u(Y,{"contextual-resources":G.value},null,8,["contextual-resources"])])):f.value=="inpt"?(a(),d("div",wo,[u(Y,{"contextual-resources":h.value},null,8,["contextual-resources"])])):w("",!0),r("div",ko,[X.value?(a(),R(ce,{key:0,title:"Modifier",onClick:g[9]||(g[9]=$=>ve(!0))},{default:A(()=>[u(z(He),{class:"m-1"})]),_:1})):w("",!0),X.value?(a(),R(ce,{key:1,class:"mt-2",color:"red",title:"Marquer comme lu",onClick:g[10]||(g[10]=$=>te.value=!0)},{default:A(()=>[u(z(ze),{class:"m-1"})]),_:1})):w("",!0),u(oe,{open:te.value,onClose:g[12]||(g[12]=$=>te.value=!1)},{default:A(()=>[u(Nt,{onRefresh:E,onClose:g[11]||(g[11]=$=>te.value=!1),resource:c.value},null,8,["resource"])]),_:1},8,["open"]),X.value?(a(),R(ce,{key:2,class:"mt-2",color:"green",title:"Relier à d'autres ressources",onClick:g[13]||(g[13]=$=>b.value=!0)},{default:A(()=>[u(z(Je),{class:"m-1"})]),_:1})):w("",!0),u(oe,{open:b.value,onClose:g[15]||(g[15]=$=>b.value=!1)},{default:A(()=>[u(xe,{onRefresh:T,onClose:g[14]||(g[14]=$=>b.value=!1),"origin-resource":c.value},null,8,["origin-resource"])]),_:1},8,["open"])])])):w("",!0)}}});export{$o as _,tt as a,oe as b,Y as c,H as d,He as r,Rt as u};