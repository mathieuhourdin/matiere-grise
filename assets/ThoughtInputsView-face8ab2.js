import{b as p,c as m,u as c}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-f326075f.js";import{_ as f}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-be7d8824.js";import{d,r as a,k as _,o as u,c as r,u as v,a as h,i as s,w as g,g as C,e as $}from"./index-7f0fbf45.js";import"./TextInterface.vue_vue_type_script_setup_true_lang-63cb8eed.js";import"./TextInput.vue_vue_type_script_setup_true_lang-36af79df.js";import"./useThoughtOutput-03f2ac94.js";const k={class:"m-4"},w=C("div",null,"Derniers apports",-1),j=d({__name:"ThoughtInputsView",setup(x){const t=a(!1),{getThoughtInputs:i}=c(),{user:l}=$(),o=a([]);return _(async()=>{o.value=await i()}),(I,e)=>(u(),r("div",k,[w,v(l)?(u(),r("div",{key:0,class:"italic underline text-xs",onClick:e[0]||(e[0]=n=>t.value=!0)}," Ajouter un nouvel apport ")):h("",!0),s(p,{open:t.value,onClose:e[2]||(e[2]=n=>t.value=!1)},{default:g(()=>[s(f,{onClose:e[1]||(e[1]=n=>t.value=!1)})]),_:1},8,["open"]),s(m,{"thought-inputs":o.value},null,8,["thought-inputs"])]))}});export{j as default};
