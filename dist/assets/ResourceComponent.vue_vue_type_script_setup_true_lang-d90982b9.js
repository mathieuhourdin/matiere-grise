import{_ as he,u as Ae}from"./useArticle-38bc2c5b.js";import{_ as ne}from"./RoundLinkButton.vue_vue_type_style_index_0_lang-0fcaa2fc.js";import{_ as ee,a as z,b as X,u as De,r as Be}from"./useThoughtInputs-065fd9a6.js";import{_ as E}from"./ActionButton.vue_vue_type_script_setup_true_lang-eac7aa06.js";import{_ as ue,a as fe,u as xe}from"./TextInterface.vue_vue_type_script_setup_true_lang-1c7c0810.js";import{e as t,a as v,g as u,d as T,r as d,c as U,o as j,b as s,n as N,q as ye,t as V,h as $,i as A,j as Y,k,v as Pe,F as be,m as ke,x as Se,l as O,y as K,z as Fe,A as Le,B as qe,w as re,u as Oe,f as je}from"./index-7557a301.js";import{_ as q}from"./TextInput.vue_vue_type_script_setup_true_lang-cefcc0d5.js";import{u as ie}from"./useInteraction-85556e33.js";import{_ as we}from"./ProgressBar.vue_vue_type_script_setup_true_lang-1e17bb19.js";import{u as ce}from"./useResource-6f3572fc.js";import{u as Re}from"./useResourceRelations-cc19fe57.js";import{u as Ne}from"./useProblem-b8bb22d3.js";function Me(y,l){return t(),v("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[u("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"})])}function ze(y,l){return t(),v("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[u("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"})])}const Ee=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),He=u("div",{class:"text-xs italic"},"Raison de la lecture",-1),Je=T({__name:"SeeThoughtInput",props:{thoughtInput:{}},setup(y){const l=y,{getUserById:o,user:a}=N(),n=d(null),b=U(()=>a.value?l.thoughtInput.interaction_user_id===a.value.id:!1);return j(async()=>{l.thoughtInput.interaction_user_id&&(n.value=await o(l.thoughtInput.interaction_user_id))}),(f,r)=>(t(),v("div",null,[s(tl,{id:f.thoughtInput.resource_id,"second-level":""},null,8,["id"]),Ee,He,s(ue,{"full-text":f.thoughtInput.interaction_comment,editable:b.value},null,8,["full-text","editable"])]))}}),We={class:"w-full md:w-96"},Ge={key:0,class:"text-xs italic mb-2 bg-white"},Ke={class:"flex flex-wrap"},Qe={key:1,class:"text-2xs italic ml-2"},Xe={key:2,class:"ml-auto m-1 w-1/3"},Ye={key:0,class:"border shadow-lg rounded p-4 md:w-96 bg-white"},Ze={class:"flex"},et=["src"],tt={class:"flex flex-wrap w-full",style:{"margin-top":"-8px"}},lt={class:"text-2xs"},ot={class:"flex flex-wrap"},st={key:0,class:"text-2xs italic"},at=T({__name:"ThoughtInputCard",props:{contextualResource:{},isDisabled:{type:Boolean,default:!1}},setup(y){const l=y,{getUserById:o}=N(),{getAuthorInteractionForResource:a}=ce(),n=d(null),b=d(null),f=d(null);j(async()=>{l.contextualResource.user_id&&(f.value=await o(l.contextualResource.user_id)),l.contextualResource.resource&&(b.value=await a(l.contextualResource.resource.id)),b.value&&(n.value=await o(b.value.interaction_user_id))});const r=e=>e?e.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}):"",p=e=>e.length>200?e.slice(0,150)+"...":e;return(e,i)=>{const h=ye("router-link");return t(),v("div",We,[e.contextualResource.context_comment?(t(),v("div",Ge,[u("div",null,V(e.contextualResource.context_comment),1),u("div",Ke,[f.value?(t(),$(h,{key:0,to:"/users/"+f.value.id,class:"text-2xs underline"},{default:A(()=>[Y(V(f.value.first_name)+" "+V(f.value.last_name),1)]),_:1},8,["to"])):k("",!0),e.contextualResource.date?(t(),v("div",Qe,V(r(e.contextualResource.date)),1)):k("",!0),e.contextualResource.progress?(t(),v("div",Xe,[s(we,{"progress-value":e.contextualResource.progress},null,8,["progress-value"])])):k("",!0)])])):k("",!0),e.contextualResource.resource?(t(),$(Pe(e.isDisabled?"span":"vue-router"),{key:1,to:"/resources/"+e.contextualResource.resource.id+"?tab=ctnt"},{default:A(()=>[e.contextualResource.resource?(t(),v("div",Ye,[u("div",Ze,[e.contextualResource.resource?(t(),v("img",{key:0,class:"w-8 h-fit mr-4",src:e.contextualResource.resource.image_url},null,8,et)):k("",!0),u("div",null,[u("div",null,V(e.contextualResource.resource.title)+" "+V(e.contextualResource.resource.subtitle),1),u("div",tt,[n.value?(t(),$(h,{key:0,to:"/users/"+n.value.id,class:"text-2xs underline"},{default:A(()=>[Y(V(n.value.first_name)+" "+V(n.value.last_name),1)]),_:1},8,["to"])):k("",!0)]),u("div",lt,V(p(e.contextualResource.resource.comment)),1)])]),u("div",ot,[e.contextualResource.date?(t(),v("div",st,V(r(e.contextualResource.resourcedate)),1)):k("",!0)])])):k("",!0)]),_:1},8,["to"])):k("",!0)])}}}),nt={class:"w-fit"},ut=T({__name:"ThoughtInputCardWithPopup",props:{thoughtInput:{},usageReason:{},isDisabled:{type:Boolean,default:!1}},setup(y){const l=d(!1);return(o,a)=>(t(),v("div",nt,[s(ee,{open:l.value,onClose:a[0]||(a[0]=n=>l.value=!1)},{default:A(()=>[s(Je,{"thought-input":o.thoughtInput,"usage-reason":o.usageReason},null,8,["thought-input","usage-reason"])]),_:1},8,["open"]),s(at,{class:"md:w-96","contextual-resource":o.thoughtInput,"is-disabled":o.isDisabled},null,8,["contextual-resource","is-disabled"])]))}}),rt={class:"relative max-w-full"},it={key:0,class:"absolute md:border h-full start-1/2 -z-10"},Q=T({__name:"ThoughtInputsList",props:{contextualResources:{},center:{type:Boolean,default:!1},linksDisabled:{type:Boolean,default:!1}},emits:["select"],setup(y,{emit:l}){const o=n=>n.sort((b,f)=>+(f.date>b.date)),a=n=>{console.log("Select"),l("select",n)};return(n,b)=>(t(),v("div",rt,[n.center?k("",!0):(t(),v("div",it)),(t(!0),v(be,null,ke(o(n.contextualResources),(f,r)=>(t(),$(ut,{key:f.id,class:Se(["mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1",{"md:ml-0":r%2==0&&!n.center,"md:mr-0":!n.center}]),"thought-input":f,onClick:p=>a(f),"is-disabled":n.linksDisabled},null,8,["class","thought-input","onClick","is-disabled"]))),128))]))}}),ct={key:0,class:"mb-4"},dt={key:1},mt={key:1},vt={key:2},pt={class:"flex flex-row-reverse"},ge=T({__name:"CreateResourceRelationForm",props:{targetResource:{},originResource:{}},emits:["close","refresh"],setup(y,{emit:l}){const o=y,{user:a}=N(),n=d(),b=I=>{console.log("Event : ",I),n.value=I},f=d([{text:"Externes",value:"extr"},{text:"Internes",value:"artl"},{text:"Problème",value:"pblm"}]),r=d([{text:"Biblio",value:"bibl"},{text:"Résumé",value:"sumr"},{text:"Sujet principal",value:"main"},{text:"Evocation",value:"mino"}]),p=d([]),e=d(null),i=d([]),h=d([]),x=d([]),P=d(""),D=d(""),{createResourceRelation:H}=Re(),{getResources:F}=ce(),{getArticles:g}=Ae(),{getProblems:w}=Ne(),B=U(()=>p.value.map(I=>({resource:I.resource}))),J=I=>I.map(C=>({resource:C})),M=U(()=>({extr:J(i.value),artl:J(h.value),pblm:J(x.value)})),te=async()=>{if(console.log("create"),!e.value)return;const I={target_resource_id:o.targetResource?o.targetResource.id:e.value.id,origin_resource_id:o.originResource?o.originResource.id:e.value.id,relation_comment:P.value,relation_type:D.value};await H(I),l("refresh"),l("close")},{getUserThoughtInputs:le}=De(),W=I=>{e.value=I.resource};return j(async()=>{!a.value||!a.value.id||(o.targetResource&&(p.value=await le(a.value.id)),o.originResource&&(i.value=await F(),h.value=await g({author:!0}),x.value=await w()))}),(I,C)=>(t(),v("div",null,[O(a)?(t(),v("div",ct," Nouvelle relation entre ressources par "+V(O(a).first_name)+" "+V(O(a).last_name),1)):k("",!0),e.value?(t(),v("div",vt,[s(z,{class:"m-4",label:"Type de lien",choices:r.value,modelValue:D.value,"onUpdate:modelValue":C[2]||(C[2]=c=>D.value=c)},null,8,["choices","modelValue"]),s(X,{class:"m-4",label:"Pourquoi ajouter cet élément ?",modelValue:P.value,"onUpdate:modelValue":C[3]||(C[3]=c=>P.value=c)},null,8,["modelValue"]),u("div",pt,[s(E,{type:"valid",onClick:te,text:"Ajouter"}),s(E,{type:"abort",onClick:C[4]||(C[4]=c=>l("close")),text:"Annuler",class:"mr-1"})])])):(t(),v("div",dt,[I.targetResource?(t(),$(Q,{key:0,"contextual-resources":B.value,center:"","links-disabled":"",onSelect:C[0]||(C[0]=c=>W(c))},null,8,["contextual-resources"])):(t(),v("div",mt,[u("div",null,[Y(" Choisir une ressource cible "),s(he,{center:"",choices:f.value,default:"pblm",onUpdate:b},null,8,["choices"]),s(Q,{"contextual-resources":M.value[n.value]||[],center:"",onSelect:C[1]||(C[1]=c=>W(c)),"links-disabled":""},null,8,["contextual-resources"])])]))]))]))}}),_t=T({__name:"CommentsThread",props:{resourceId:{}},setup(y){const l=y,{user:o}=N(),a=d([]),{createComment:n,getCommentsForThoughtOutput:b}=xe(),f=async()=>{console.log("Comment thread"),console.log("Props id : ",l.resourceId),a.value=await b(l.resourceId)},r=U(()=>a.value.filter(i=>!i.start_index).sort((i,h)=>i.created_at-h.created_at)),p=d(""),e=async()=>{await n(l.resourceId,null,p.value,!1),p.value="",await f()};return j(async()=>await f()),(i,h)=>(t(),v("div",null,[(t(!0),v(be,null,ke(r.value,x=>(t(),$(fe,{key:x.id,class:"w-full",modelValue:x.content,"onUpdate:modelValue":P=>x.content=P,editing:x.editing,onValidate:P=>x.editing=!1,author:x.author,"created-at":x.created_at},null,8,["modelValue","onUpdate:modelValue","editing","onValidate","author","created-at"]))),128)),s(fe,{class:"w-full",modelValue:p.value,"onUpdate:modelValue":h[0]||(h[0]=x=>p.value=x),editing:!0,onValidate:e,author:O(o),"created-at":null},null,8,["modelValue","author"])]))}}),ft={class:"flex flex-wrap"},gt={class:"flex flex-row-reverse"},ht=T({__name:"CreateInteraction",props:{resource:{}},emits:["close","refresh"],setup(y,{emit:l}){const o=y,a=d([{text:"Lecture / Visionage",value:"inpt"},{text:"Envie",value:"wish"}]),{newInteraction:n,createInteractionForResource:b}=ie(),{user:f}=N(),r=d(n());j(()=>{r.value.interaction_type||(r.value.interaction_type="inpt")});const p=()=>{r.value.resource_id=o.resource.id,r.value.interaction_user_id=f.value.id,b(o.resource.id,r.value),l("refresh"),e()},e=()=>l("close");return(i,h)=>(t(),v("div",null,[u("div",null,"Nouvelle interaction, avec la ressource : "+V(i.resource.title),1),u("div",ft,[s(q,{label:"Avancement de l'ouvrage",class:"my-auto",modelValue:r.value.interaction_progress,"onUpdate:modelValue":h[0]||(h[0]=x=>r.value.interaction_progress=x),type:"number"},null,8,["modelValue"]),s(z,{label:"Type d'interaction",class:"m-4 w-full md:w-5/12 md:ml-auto",choices:a.value,modelValue:r.value.interaction_type,"onUpdate:modelValue":h[1]||(h[1]=x=>r.value.interaction_type=x)},null,8,["choices","modelValue"])]),s(q,{label:"Date de lecture",modelValue:r.value.interaction_date,"onUpdate:modelValue":h[2]||(h[2]=x=>r.value.interaction_date=x),type:"date"},null,8,["modelValue"]),s(X,{label:"Pourquoi s'y être interessé ?",modelValue:r.value.interaction_comment,"onUpdate:modelValue":h[3]||(h[3]=x=>r.value.interaction_comment=x)},null,8,["modelValue"]),u("div",gt,[s(E,{onClick:p,class:"m-4",text:"Valider",type:"valid"}),s(E,{onClick:e,class:"m-4",text:"Annuler",type:"abort"})])]))}}),xt=T({__name:"DateField",props:{date:{}},setup(y){const l=y,o=U(()=>new Date(l.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}));return(a,n)=>(t(),v("div",null,V(o.value),1))}}),yt=T({__name:"CheckboxInput",props:{label:{},modelValue:{type:Boolean}},emits:["update:modelValue"],setup(y,{emit:l}){const o=y,a="checkbox-"+Math.random().toString(36).substr(2,9),n=d(K(o).modelValue),b=()=>{n.value=!n.value,console.log(n.value),l("update:modelValue",!o.modelValue)};return(f,r)=>(t(),v("div",null,[Fe(u("input",{class:"m-2",type:"checkbox",id:a,"onUpdate:modelValue":r[0]||(r[0]=p=>n.value=p),onChange:b},null,544),[[Le,n.value]]),u("label",{for:a},V(f.label),1)]))}}),bt={class:"m-4"},kt={class:"block text-2xs text-slate-800"},wt=["value","placeholder"],Ve=T({__name:"NumberInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue","input"],setup(y,{emit:l}){const o=a=>{l("update:modelValue",a.target.value),l("input",a.target.value)};return(a,n)=>(t(),v("div",bt,[u("label",kt,V(a.label),1),u("input",{class:"border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-xs",type:"number",value:a.modelValue,placeholder:a.placeholder,onInput:n[0]||(n[0]=b=>o(b))},null,40,wt)]))}}),Rt={class:"flex"},Vt={class:"ml-auto h-6 m-4 w-1/3"},$t={class:"ml-auto h-6 m-4 w-1/3"},Ct={class:"ml-auto h-6 m-4 w-1/3"},It={class:"my-auto ml-auto h-6 m-4 w-1/3"},Ut={class:"flex"},Tt=T({__name:"ArticleForm",props:{article:{}},emits:["change"],setup(y,{emit:l}){const o=y,a=d([{text:"Terminé",value:"fnsh"},{text:"Relecture",value:"rvew"},{text:"Idée",value:"idea"}]),n=d([{text:"Livre",value:"book"},{text:"Fiche de lecture",value:"shet"},{text:"Article de média",value:"natc"},{text:"Article de recherche",value:"ratc"},{text:"Film",value:"movi"},{text:"Podcast",value:"pcst"}]),{categories:b}=qe(),f=U(()=>b.value.map(p=>({text:p.display_name,value:p.id}))),r=(p,e)=>{let i={...o.article};i[p]=e,l("change",i)};return(p,e)=>(t(),v("div",null,[s(q,{label:"Titre",modelValue:p.article.title,"onUpdate:modelValue":e[0]||(e[0]=i=>r("title",i))},null,8,["modelValue"]),s(q,{class:"h-6",label:"Sous-titre",modelValue:p.article.subtitle,"onUpdate:modelValue":e[1]||(e[1]=i=>r("subtitle",i))},null,8,["modelValue"]),u("div",Rt,[s(Ve,{class:"mr-auto h-6",label:"Progression",modelValue:p.article.interaction_progress,"onUpdate:modelValue":e[2]||(e[2]=i=>r("progress",i))},null,8,["modelValue"]),u("div",Vt,[s(z,{label:"Catégorie",choices:f.value,"model-value":p.article.category_id,"onUpdate:modelValue":e[3]||(e[3]=i=>r("category_id",i))},null,8,["choices","model-value"])]),u("div",$t,[s(z,{label:"Stade d'écriture",choices:a.value,"model-value":p.article.maturing_state,"onUpdate:modelValue":e[4]||(e[4]=i=>r("maturing_state",i))},null,8,["choices","model-value"])]),u("div",Ct,[s(z,{label:"Type de ressource",choices:n.value,"onUpdate:modelValue":e[5]||(e[5]=i=>r("resource_type",i)),"model-value":p.article.resource_type},null,8,["choices","model-value"])]),u("div",It,[s(yt,{class:"mt-3",label:"Externe","onUpdate:modelValue":e[6]||(e[6]=i=>r("is_external",i)),"model-value":p.article.is_external},null,8,["model-value"])])]),u("div",Ut,[s(q,{class:"h-6",label:"Lien contenu externe",modelValue:p.article.external_content_url,"onUpdate:modelValue":e[7]||(e[7]=i=>r("external_content_url",i))},null,8,["modelValue"]),s(q,{class:"h-6",label:"Lien image",modelValue:p.article.image_url,"onUpdate:modelValue":e[8]||(e[8]=i=>r("image_url",i))},null,8,["modelValue"])]),s(X,{label:"Pistes d'amélioration",modelValue:p.article.comment,"onUpdate:modelValue":e[9]||(e[9]=i=>r("comment",i))},null,8,["modelValue"])]))}}),At={class:"flex flex-wrap"},Dt=T({__name:"ResourceAuthorPicker",props:{interaction:{},resourceId:{}},emits:["update"],setup(y,{emit:l}){const o=y,a=d(null),n=d([]),b=g=>{if(g)return{text:`${g.first_name} ${g.last_name}`,value:g.id}},f=U(()=>{var g;return(g=a.value)==null?void 0:g.id}),r=U(()=>{if(n.value)return n.value.map(g=>b(g))}),{getUsers:p,getUserById:e}=N(),i=async g=>a.value=await e(g.interaction_user_id),{createInteractionForResource:h,newInteraction:x,createInteraction:P,updateInteraction:D}=ie(),H=async g=>{if(console.log(`newUser : ${JSON.stringify(g)}`),o.interaction){const w={...o.interaction};w.interaction_user_id=g,console.log("newUserid : ",g.id),console.log(`Interaction payload : ${JSON.stringify(w)}`),await D(o.interaction.id,w),l("update")}else{console.log("create interaction");const w=x();w.interaction_user_id=g,w.resource_id=o.resourceId,await h(o.resourceId,w),l("update")}},F=async g=>{await D(o.interaction.id,g),l("update")};return j(async()=>{n.value=await p(),await i(o.interaction)}),re(K(o).interaction,async g=>await i(g)),(g,w)=>(t(),v("div",null,[u("div",At,[s(z,{label:"Auteur",class:"my-auto",choices:r.value,"model-value":f.value,"onUpdate:modelValue":w[0]||(w[0]=B=>H(B))},null,8,["choices","model-value"]),g.interaction?(t(),$(q,{key:0,class:"my-auto",label:"Date d'écriture","model-value":g.interaction.interaction_date.split("T")[0],"onUpdate:modelValue":w[1]||(w[1]=B=>F({...g.interaction,interaction_date:B})),type:"date"},null,8,["model-value"])):k("",!0),g.interaction?(t(),$(Ve,{key:1,class:"my-auto",label:"Progression",modelValue:g.interaction.interaction_progress,"onUpdate:modelValue":w[2]||(w[2]=B=>F({...g.interaction,interaction_progress:B}))},null,8,["modelValue"])):k("",!0)])]))}}),Bt={key:0,class:"text-center text-2xl pt-10"},Pt={key:1},St={key:0},Ft={class:"my-8"},Lt=["src"],qt={class:"text-3xl my-3 font-mplus md:text-center text-left"},Ot={class:"md:text-center text-left"},jt={class:"md:text-center text-left"},Nt={class:"md:flex my-8"},Mt=["href"],zt={key:1},Et={class:"flex flex-row-reverse"},Ht={key:1,class:"p-2 border rounded bg-neutral-100"},Jt=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Wt={key:2},Gt=u("div",{class:"text-xs italic"},"Commentaire",-1),Kt=u("hr",{class:"border-top border-zinc-400 my-4"},null,-1),Qt=u("div",{class:"text-xs italic"},"Contenu",-1),Xt={key:3},Yt={key:4},Zt={key:5},el={class:"fixed right-3 bottom-5"},tl=T({__name:"ResourceComponent",props:{id:{},secondLevel:{type:Boolean}},setup(y){const l=y,o=Oe(),a=U(()=>l.secondLevel?"popup_tab":"tab"),n=U(()=>[{text:"Contenu",value:"ctnt"},{text:"Biblio",value:"bbli",count:e.value.length},{text:"Sujets",value:"pblm",count:w.value.length},{text:"Interactions",value:"inpt",count:D.value.length}]),b=d(o.query[a.value]&&typeof o.query[a.value]=="string"?o.query[a.value]:"ctnt"),f=d(o.query[a.value]);re(()=>o.query[a.value],m=>{console.log("new route query",m),typeof m=="string"&&(f.value=m)});const{getResourceRelationsForResource:r,getUsagesForResource:p}=Re(),e=d([]),i=d(!1),h=d(!1),x=async()=>{e.value=await r(K(l).id.value)},P=U(()=>e.value.map(m=>({resource:m.origin_resource,date:m.created_at,user_id:m.user_id,context_comment:m.relation_comment,progress:null}))),D=d([]),{getInteractionsForResource:H}=ie(),F=async()=>{D.value=await H(l.id)},g=U(()=>D.value.map(m=>({resource:null,date:m.interaction_date,user_id:m.interaction_user_id,context_comment:m.interaction_comment,progress:m.interaction_progress}))),w=d([]),B=async()=>{w.value=await p(l.id)},J=U(()=>w.value.map(m=>({resource:m.target_resource,date:m.created_at,user_id:m.user_id,context_comment:m.relation_comment,progress:null}))),M=d(!1),{newResource:te,getResource:le,updateResource:W,getAuthorInteractionForResource:I}=ce(),C=d(null),c=d(te()),$e=je();re(()=>o.query.editing,m=>{console.log("Editing : ",m),oe.value=m==="false"?!1:!!m});const oe=d(!1),de=m=>{$e.push({query:{editing:m.toString()}})},Ce=()=>{!c.value||!c.value.id||(c.value.publishing_state="pbsh",W(c.value.id,c.value))},se=(m,_)=>{c.value=_,C.value!==null&&clearTimeout(C.value),C.value=setTimeout(async()=>{try{await W(m,c.value)}catch(ae){console.log("An error : ",ae)}},1e3)},me=m=>{m!=`
`&&se(K(l).id.value,{...c.value,content:m})},ve=m=>{m!=`
`&&se(K(l).id.value,{...c.value,comment:m})},{user:pe,getUserById:Ie}=N(),G=U(()=>c.value.is_external?!0:pe.value?L.value?L.value.id==pe.value.id:!0:!1),L=d(null),S=d(null),Z=d(!1),Ue=async()=>{S.value=await I(l.id)},{getCommentsForThoughtOutput:Te}=xe(),_e=d([]);return j(async()=>{M.value=!1,c.value=await le(l.id),M.value=!0,await x(),await F(),await B(),_e.value=await Te(l.id),S.value=await I(l.id),S.value&&(L.value=await Ie(S.value.interaction_user_id));const m=o.query.editing;oe.value=m==="false"?!1:!!m}),(m,_)=>{const ae=ye("router-link");return t(),v("div",null,[M.value?(t(),v("div",Pt,[oe.value?(t(),v("div",zt,[s(Tt,{article:c.value,onChange:_[0]||(_[0]=R=>se(c.value.id,R))},null,8,["article"]),s(Dt,{class:"mx-4",interaction:S.value,"resource-id":m.id,onChange:Ue},null,8,["interaction","resource-id"]),u("div",Et,[s(E,{class:"mx-4",onClick:_[1]||(_[1]=R=>de(!1)),type:"valid",text:"Preview"},{default:A(()=>[Y("Ok")]),_:1}),c.value.publishing_state=="drft"?(t(),$(E,{key:0,onClick:Ce,type:"valid",text:"Publier"})):(t(),v("div",Ht,"Publié"))])])):(t(),v("div",St,[u("div",Ft,[u("img",{src:c.value.image_url,class:"border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto",style:{"max-height":"20rem"}},null,8,Lt)]),u("h1",qt,V(c.value.title),1),u("div",Ot,V(c.value.subtitle),1),u("div",jt,[L.value?(t(),$(ae,{key:0,to:"/users/"+L.value.id,class:"text-sm underline"},{default:A(()=>[Y(V(L.value.first_name)+" "+V(L.value.last_name),1)]),_:1},8,["to"])):k("",!0),S.value?(t(),$(xt,{key:1,date:S.value.interaction_date},null,8,["date"])):k("",!0)]),u("div",Nt,[S.value?(t(),$(we,{key:0,"progress-value":S.value.interaction_progress,class:"m-2 w-1/3"},null,8,["progress-value"])):k("",!0),c.value.external_content_url?(t(),v("a",{key:1,class:"ml-auto underline",href:c.value.external_content_url,target:"_blank"}," Lien ressource externe ",8,Mt)):k("",!0)])])),u("div",null,[s(he,{choices:n.value,default:b.value,"url-key":a.value,url:""},null,8,["choices","default","url-key"])]),Jt,f.value=="ctnt"?(t(),v("div",Wt,[Gt,c.value.publishing_state!="drft"?(t(),$(ue,{key:0,"full-text":c.value.comment,editable:G.value,onChange:_[2]||(_[2]=R=>ve(R))},null,8,["full-text","editable"])):(t(),$(X,{key:1,class:"h-20",label:"Commentaire",modelValue:c.value.comment,"onUpdate:modelValue":_[3]||(_[3]=R=>ve(R))},null,8,["modelValue"])),Kt,Qt,M.value&&!c.value.is_local_draft&&c.value.publishing_state!="drft"?(t(),$(ue,{key:2,class:"min-h-fit","ext-comments":_e.value,"resource-id":c.value.id,"full-text":c.value.content,editable:G.value,onChange:_[4]||(_[4]=R=>me(R))},null,8,["ext-comments","resource-id","full-text","editable"])):(t(),$(X,{key:3,class:"h-96",label:"Contenu",modelValue:c.value.content,"onUpdate:modelValue":_[5]||(_[5]=R=>me(R))},null,8,["modelValue"])),s(_t,{"resource-id":m.id},null,8,["resource-id"])])):f.value=="bbli"?(t(),v("div",Xt,[s(ee,{open:i.value,onClose:_[7]||(_[7]=R=>i.value=!1)},{default:A(()=>[s(ge,{onRefresh:x,onClose:_[6]||(_[6]=R=>i.value=!1),"target-resource":c.value},null,8,["target-resource"])]),_:1},8,["open"]),u("div",{onClick:_[8]||(_[8]=R=>i.value=!0),class:"text-sm italic underline"}," Ajouter une référence "),s(Q,{"contextual-resources":P.value},null,8,["contextual-resources"])])):f.value=="pblm"?(t(),v("div",Yt,[s(Q,{"contextual-resources":J.value},null,8,["contextual-resources"])])):f.value=="inpt"?(t(),v("div",Zt,[s(Q,{"contextual-resources":g.value},null,8,["contextual-resources"])])):k("",!0),u("div",el,[G.value?(t(),$(ne,{key:0,title:"Modifier",onClick:_[9]||(_[9]=R=>de(!0))},{default:A(()=>[s(O(Be),{class:"m-1"})]),_:1})):k("",!0),G.value?(t(),$(ne,{key:1,class:"mt-2",color:"red",title:"Marquer comme lu",onClick:_[10]||(_[10]=R=>Z.value=!0)},{default:A(()=>[s(O(Me),{class:"m-1"})]),_:1})):k("",!0),s(ee,{open:Z.value,onClose:_[12]||(_[12]=R=>Z.value=!1)},{default:A(()=>[s(ht,{onRefresh:F,onClose:_[11]||(_[11]=R=>Z.value=!1),resource:c.value},null,8,["resource"])]),_:1},8,["open"]),G.value?(t(),$(ne,{key:2,class:"mt-2",color:"green",title:"Relier à d'autres ressources",onClick:_[13]||(_[13]=R=>h.value=!0)},{default:A(()=>[s(O(ze),{class:"m-1"})]),_:1})):k("",!0),s(ee,{open:h.value,onClose:_[15]||(_[15]=R=>h.value=!1)},{default:A(()=>[s(ge,{onRefresh:B,onClose:_[14]||(_[14]=R=>h.value=!1),"origin-resource":c.value},null,8,["origin-resource"])]),_:1},8,["open"])])])):(t(),v("div",Bt,"Loading..."))])}}});export{tl as _,Je as a,Q as b};
