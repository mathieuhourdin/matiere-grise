import{_ as m,u as p}from"./ArticleForm.vue_vue_type_script_setup_true_lang-d85cdf47.js";import{e as _,h as f,l as a,o as v,c as x,b as s,a as i,u as A,_ as h,d as w}from"./index-09898fe7.js";import"./TextInput.vue_vue_type_script_setup_true_lang-fbf0ab11.js";const g={class:"max-w-xl mt-8 mx-auto border-2 p-4"},k=s("div",null,"Edition",-1),y={class:"flex"},b=_({__name:"EditArticle",props:{id:{}},setup(o){const t=o,{newArticle:c,getArticle:r,updateArticle:n}=p(),e=c(),d=async()=>{await n(a(t).id.value,e.value),w.push("/articles/"+a(t).id.value)};return f(async()=>{e.value=await r(a(t).id.value)}),(B,l)=>(v(),x("div",null,[s("div",g,[k,i(m,{class:"w-full",article:A(e),onChange:l[0]||(l[0]=u=>e.value=u)},null,8,["article"]),s("div",y,[i(h,{onClick:d,text:"Valider",type:"valid",class:"ml-auto m-4"})])])]))}});export{b as default};