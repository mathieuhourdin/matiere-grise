import{d as c,b as d,h as i,e as m,c as p,_,q as f,o as v}from"./index-25faa315.js";const g=c({__name:"UserPicker",props:{modelValue:{}},emits:["update:modelValue"],setup(U,{emit:l}){const{getUsers:o,getUserById:V}=f(),s=d([]),t=e=>{if(e)return{text:e.display_name,value:e.id}},u=i(()=>{if(s.value)return s.value.map(e=>t(e))}),n=e=>{l("update:modelValue",e)};return m(async()=>{s.value=await o()}),(e,a)=>(v(),p(_,{label:"Utilisateur",class:"",choices:u.value,"model-value":e.modelValue,"onUpdate:modelValue":a[0]||(a[0]=r=>n(r))},null,8,["choices","model-value"]))}});export{g as _};
