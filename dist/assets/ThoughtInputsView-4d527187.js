import{_,u as d}from"./useThoughtInputs-ce7c1c8b.js";import{_ as f}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-89871c19.js";import{b as v}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-43beba17.js";import{d as x,b as u,n as w,h as C,e as $,f as i,q as g,m as T,i as o,w as h,a as k,o as c}from"./index-d06ac2da.js";import"./ActionButton.vue_vue_type_script_setup_true_lang-2cd80ab5.js";import"./SelectionTextInterface.vue_vue_type_script_setup_true_lang-9d770362.js";import"./SelectionTextInterface.vue_vue_type_style_index_0_lang-cc2bf542.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-b9be12b4.js";import"./useResource-7dc6ad42.js";import"./UserPicker.vue_vue_type_script_setup_true_lang-071645c4.js";import"./useResourceRelations-b54bc278.js";const N={class:"m-4"},V=k("div",null,"Derniers apports",-1),z=x({__name:"ThoughtInputsView",setup(y){const s=u(!1),{getThoughtInputs:m}=d(),{user:l}=w(),n=u([]),p=C(()=>n.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress}))),r=async()=>n.value=await m();return $(async()=>{await r()}),(e,t)=>(c(),i("div",N,[V,g(l)?(c(),i("div",{key:0,class:"italic underline text-xs",onClick:t[0]||(t[0]=a=>s.value=!0)}," Ajouter un nouvel apport ")):T("",!0),o(_,{open:s.value,onClose:t[2]||(t[2]=a=>s.value=!1)},{default:h(()=>[o(f,{onRefresh:r,onClose:t[1]||(t[1]=a=>s.value=!1)})]),_:1},8,["open"]),o(v,{class:"mt-10","contextual-resources":p.value},null,8,["contextual-resources"])]))}});export{z as default};
