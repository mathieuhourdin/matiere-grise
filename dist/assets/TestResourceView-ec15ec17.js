import{u as n}from"./useResource-3e6b3264.js";import{d as c,r as u,o as i,c as t,t as l,j as p,b as o}from"./index-c91c5f78.js";const d={key:0},k=c({__name:"TestResourceView",props:{id:{}},setup(s){const a=s,{getResource:r}=n(),e=u(null);return i(async()=>e.value=await r(a.id)),(m,_)=>(o(),t("div",null,[e.value?(o(),t("div",d,l(e.value.title),1)):p("",!0)]))}});export{k as default};