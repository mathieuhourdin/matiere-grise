import{_}from"./ArticleCard.vue_vue_type_script_setup_true_lang-37078ccf.js";import{u as p}from"./useResource-aaa89c8d.js";import{d as g,k as f,b as R,e as h,f as s,l as v,a as u,F as x,g as k,o as t,i as b}from"./index-292dcd80.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-0e211b15.js";const w={class:"p-4"},y={class:"grid grid-cols-1 md:grid-cols-2 gap-4 p-6"},F=g({__name:"ResourcesListView",setup(V){const c=f(),{getResources:i,createResource:n,newResource:d}=p(),r=R([]),l=async()=>{const o=d(),a=await n(o);c.push({path:"/resources/"+a.id,query:{editing:"true"}})};return h(async()=>r.value=await i()),(o,a)=>(t(),s("div",w,[v(" Ressources "),u("div",{class:"text-sm italic underline",onClick:l}," Ajouter une resource externe non existante "),u("div",y,[(t(!0),s(x,null,k(r.value,(e,m)=>(t(),s("div",{key:m},[b(_,{title:e.title,subtitle:e.subtitle,"image-url":e.image_url,uuid:e.id,author:e.author},null,8,["title","subtitle","image-url","uuid","author"])]))),128))])]))}});export{F as default};