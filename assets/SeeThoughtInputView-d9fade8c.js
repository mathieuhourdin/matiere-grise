import{_ as u,u as s}from"./useThoughtInputs-17dab4d4.js";import{d as c,r,j as p,c as l,i,a as h,o as e}from"./index-80c66211.js";import"./TextInterface.vue_vue_type_script_setup_true_lang-676037a3.js";const k=c({__name:"SeeThoughtInputView",props:{id:{}},setup(o){const n=o,t=r(null),{getThoughtInput:a}=s();return p(async()=>t.value=await a(n.id)),(m,_)=>(e(),l("div",null,[t.value?(e(),i(u,{key:0,"thought-input":t.value,class:"m-2"},null,8,["thought-input"])):h("",!0)]))}});export{k as default};
