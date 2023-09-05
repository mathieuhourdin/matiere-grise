import{_ as u}from"./TextInput.vue_vue_type_script_setup_true_lang-9684cd8e.js";import{h as m,o as i,c as p,a as r,t as b,d as t}from"./index-0b741eec.js";const c={class:"m-4"},g={class:"block text-2xs text-slate-800"},f=["value","placeholder"],_=m({__name:"NumberInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue","input"],setup(d,{emit:s}){const n=e=>{s("update:modelValue",e.target.value),s("input",e.target.value)};return(e,o)=>(i(),p("div",c,[r("label",g,b(e.label),1),r("input",{class:"border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-xs",type:"number",value:e.modelValue,placeholder:e.placeholder,onInput:o[0]||(o[0]=l=>n(l))},null,40,f)]))}}),v={class:"m-4"},h={class:"block text-2xs text-slate-800"},U=["value","placeholder"],V=m({__name:"TextAreaInput",props:{label:{},modelValue:{},placeholder:{}},emits:["update:modelValue"],setup(d,{emit:s}){const n=e=>{s("update:modelValue",e.target.value)};return(e,o)=>(i(),p("div",v,[r("label",h,b(e.label),1),r("textarea",{class:"border border-neutral-800 block h-full w-full",value:e.modelValue,placeholder:e.placeholder,onInput:o[0]||(o[0]=l=>n(l))},null,40,U)]))}}),$={class:"flex"},k={class:"flex"},C=m({__name:"ArticleForm",props:{article:{}},emits:["change"],setup(d,{emit:s}){const n=d,e=(o,l)=>{let a={...n.article};a[o]=l,s("change",a)};return(o,l)=>(i(),p("div",null,[t(u,{label:"Titre",modelValue:o.article.title,"onUpdate:modelValue":l[0]||(l[0]=a=>e("title",a))},null,8,["modelValue"]),t(u,{class:"h-6",label:"Description",modelValue:o.article.description,"onUpdate:modelValue":l[1]||(l[1]=a=>e("description",a))},null,8,["modelValue"]),r("div",$,[t(_,{class:"mr-auto h-6",label:"Progression",modelValue:o.article.progress,"onUpdate:modelValue":l[2]||(l[2]=a=>e("progress",a))},null,8,["modelValue"]),t(u,{class:"h-6",label:"Stade d'écriture",modelValue:o.article.maturing_state,"onUpdate:modelValue":l[3]||(l[3]=a=>e("maturing_state",a))},null,8,["modelValue"])]),r("div",k,[t(u,{class:"h-6",label:"Lien Gdoc",modelValue:o.article.gdoc_url,"onUpdate:modelValue":l[4]||(l[4]=a=>e("gdoc_url",a))},null,8,["modelValue"]),t(u,{class:"h-6",label:"Lien image",modelValue:o.article.image_url,"onUpdate:modelValue":l[5]||(l[5]=a=>e("image_url",a))},null,8,["modelValue"]),t(u,{class:"h-6",label:"Suffix url",modelValue:o.article.url_slug,"onUpdate:modelValue":l[6]||(l[6]=a=>e("url_slug",a))},null,8,["modelValue"])]),t(V,{label:"Pistes d'amélioration",modelValue:o.article.potential_improvements,"onUpdate:modelValue":l[7]||(l[7]=a=>e("potential_improvements",a))},null,8,["modelValue"]),t(V,{class:"h-60",label:"Contenu",modelValue:o.article.content,"onUpdate:modelValue":l[8]||(l[8]=a=>e("content",a))},null,8,["modelValue"])]))}});export{C as _};
