import{e as p,o as m,c,b as u,t as V,r as g,f as i,a as o}from"./index-a50c0045.js";import{_ as n}from"./TextInput.vue_vue_type_script_setup_true_lang-a0469827.js";import{_ as b}from"./TextInterface.vue_vue_type_script_setup_true_lang-3a562d0b.js";const f={class:"m-4"},_={class:"block text-2xs text-slate-800"},v=["value","placeholder"],h=p({__name:"NumberInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue","input"],setup(d,{emit:s}){const r=t=>{s("update:modelValue",t.target.value),s("input",t.target.value)};return(t,l)=>(m(),c("div",f,[u("label",_,V(t.label),1),u("input",{class:"border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-xs",type:"number",value:t.modelValue,placeholder:t.placeholder,onInput:l[0]||(l[0]=e=>r(e))},null,40,v)]))}}),A={class:"m-4"},$={class:"block text-2xs text-slate-800"},U=["value","placeholder"],w=p({__name:"TextAreaInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue"],setup(d,{emit:s}){const r=t=>{s("update:modelValue",t.target.value)};return(t,l)=>(m(),c("div",A,[u("label",$,V(t.label),1),u("textarea",{class:"border border-neutral-800 block h-full w-full",value:t.modelValue,placeholder:t.placeholder,onInput:l[0]||(l[0]=e=>r(e))},null,40,U)]))}});function C(){return{newArticle:()=>g({title:"",description:"",content:"",potential_improvements:"",progress:0,maturing_state:"",gdoc_url:"",image_url:"",url_slug:""}),getArticle:async l=>(await i.get("/articles/"+l)).data,createArticle:async l=>(l.progress=Number(l.progress),await i.post("/articles",l)),updateArticle:async(l,e)=>(e.progress=Number(e.progress),await i.put("/articles/"+l,e))}}const k={class:"flex"},I={class:"flex"},B=p({__name:"ArticleForm",props:{article:{}},emits:["change"],setup(d,{emit:s}){const r=d,t=(l,e)=>{let a={...r.article};a[l]=e,s("change",a)};return(l,e)=>(m(),c("div",null,[o(n,{label:"Titre",modelValue:l.article.title,"onUpdate:modelValue":e[0]||(e[0]=a=>t("title",a))},null,8,["modelValue"]),o(n,{class:"h-6",label:"Description",modelValue:l.article.description,"onUpdate:modelValue":e[1]||(e[1]=a=>t("description",a))},null,8,["modelValue"]),u("div",k,[o(h,{class:"mr-auto h-6",label:"Progression",modelValue:l.article.progress,"onUpdate:modelValue":e[2]||(e[2]=a=>t("progress",a))},null,8,["modelValue"]),o(n,{class:"h-6",label:"Stade d'écriture",modelValue:l.article.maturing_state,"onUpdate:modelValue":e[3]||(e[3]=a=>t("maturing_state",a))},null,8,["modelValue"])]),u("div",I,[o(n,{class:"h-6",label:"Lien Gdoc",modelValue:l.article.gdoc_url,"onUpdate:modelValue":e[4]||(e[4]=a=>t("gdoc_url",a))},null,8,["modelValue"]),o(n,{class:"h-6",label:"Lien image",modelValue:l.article.image_url,"onUpdate:modelValue":e[5]||(e[5]=a=>t("image_url",a))},null,8,["modelValue"]),o(n,{class:"h-6",label:"Suffix url",modelValue:l.article.url_slug,"onUpdate:modelValue":e[6]||(e[6]=a=>t("url_slug",a))},null,8,["modelValue"])]),o(w,{label:"Pistes d'amélioration",modelValue:l.article.potential_improvements,"onUpdate:modelValue":e[7]||(e[7]=a=>t("potential_improvements",a))},null,8,["modelValue"]),o(b,{class:"h-60",label:"Contenu","full-text":l.article.content,onChange:e[8]||(e[8]=a=>t("content",a))},null,8,["full-text"])]))}});export{B as _,C as u};
