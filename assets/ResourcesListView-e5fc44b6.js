import{_}from"./ArticleCard.vue_vue_type_script_setup_true_lang-c7260fa6.js";import{u as p}from"./useResource-c87a643a.js";import{d as g,a as h,r as R,o as f,c as t,l as v,b as a,F as x,j as k,k as s,e as b}from"./index-f61ac537.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-f51cdca7.js";const w={class:"p-4"},y={class:"grid grid-cols-1 md:grid-cols-2 gap-4 p-6"},C=g({__name:"ResourcesListView",setup(V){const c=h(),{getResources:n,createResource:i,newResource:d}=p(),r=R([]),l=async()=>{const o=d(),u=await i(o);c.push({path:"/thought_outputs/"+u.id,query:{editing:"true"}})};return f(async()=>r.value=await n()),(o,u)=>(s(),t("div",w,[v(" Ressources "),a("div",{class:"text-sm italic underline",onClick:l},"Ajouter une resource externe non existante"),a("div",y,[(s(!0),t(x,null,k(r.value,(e,m)=>(s(),t("div",{key:m},[b(_,{title:e.title,subtitle:e.subtitle,"image-url":e.image_url,uuid:e.id,author:e.author},null,8,["title","subtitle","image-url","uuid","author"])]))),128))])]))}});export{C as default};
