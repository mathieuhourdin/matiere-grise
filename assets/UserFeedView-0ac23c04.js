import{d as h,c as g,h as o,t as n,o as a,r as u,f as $,m,a as d,u as _,w as f,y,j as l,e as k,g as w}from"./index-fb06ad61.js";import{b as B,c as C,u as N}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-1210503f.js";import{_ as V}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-04f0701f.js";import"./TextInterface.vue_vue_type_script_setup_true_lang-3b1eb831.js";import"./TextInput.vue_vue_type_script_setup_true_lang-80273c46.js";import"./useResource-4d35d0fb.js";import"./useThoughtInputUsages-507e4025.js";const b={class:"text-center p-4 bg-slate-200"},T={class:"text-2xl bold"},D=h({__name:"UserInfos",props:{user:{}},setup(i){return(e,s)=>(a(),g("div",b,[o("div",T,n(e.user.first_name)+" "+n(e.user.last_name),1),o("div",null,n(e.user.handle),1)]))}}),j={class:"m-8"},E=o("div",{class:"text-center m-4 italic text-sm"},"Derniers apports extérieurs",-1),H=h({__name:"UserFeedView",props:{pageUserId:{}},setup(i){const e=i,s=u(!1),{getUserById:v,user:p}=k(),r=u(null),{getUserThoughtInputs:x}=N(),c=u([]);return $(async()=>{r.value=await v(e.pageUserId),c.value=await x(e.pageUserId)}),(I,t)=>(a(),g("div",null,[o("div",j,[r.value?(a(),m(D,{key:0,class:"mx-auto border my-8",user:r.value},null,8,["user"])):d("",!0),E,_(p)&&I.pageUserId==_(p).id?(a(),m(y,{key:1,class:"mx-auto md:mx-0",onClick:t[0]||(t[0]=U=>s.value=!0)},{default:f(()=>[w("+")]),_:1})):d("",!0),l(B,{open:s.value},{default:f(()=>[l(V,{onClose:t[1]||(t[1]=U=>s.value=!1)})]),_:1},8,["open"]),l(C,{class:"mx-auto","thought-inputs":c.value},null,8,["thought-inputs"])])]))}});export{H as default};
