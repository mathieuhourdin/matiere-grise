import{d as i,r as n,f as c,c as s,g as d,h as r,F as l,i as _,o as t,j as m,_ as p}from"./index-fb06ad61.js";import{u as g}from"./useResource-4d35d0fb.js";const f={class:"p-4"},h=r("div",{class:"text-sm italic underline"},"Ajouter une resource externe non existante",-1),v={class:"grid grid-cols-1 md:grid-cols-2 gap-4 p-6"},B=i({__name:"ResourcesListView",setup(x){const{getResources:a}=g(),o=n([]);return c(async()=>o.value=await a()),(R,V)=>(t(),s("div",f,[d(" Ressources "),h,r("div",v,[(t(!0),s(l,null,_(o.value,(e,u)=>(t(),s("div",{key:u},[m(p,{title:e.title,subtitle:e.subtitle,"image-url":e.image_url,uuid:e.id,author:e.author},null,8,["title","subtitle","image-url","uuid","author"])]))),128))])]))}});export{B as default};
