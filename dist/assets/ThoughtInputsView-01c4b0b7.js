import{_,u as d}from"./useThoughtInputs-9c987aa4.js";import{_ as f}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-73772e82.js";import{b as v}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-b4bdb35b.js";import{d as x,b as u,h as w,e as C,f as i,p as $,m as g,i as o,w as T,a as h,o as c,q as k}from"./index-c23c6ded.js";import"./ActionButton.vue_vue_type_script_setup_true_lang-a60d2659.js";import"./SelectionTextInterface.vue_vue_type_script_setup_true_lang-6f018e08.js";import"./SelectionTextInterface.vue_vue_type_style_index_0_lang-65dce772.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-40cea443.js";import"./useResource-d4bf34d0.js";import"./UserPicker.vue_vue_type_script_setup_true_lang-06028e97.js";import"./useResourceRelations-121aadd3.js";const N={class:"m-4"},V=h("div",null,"Derniers apports",-1),z=x({__name:"ThoughtInputsView",setup(y){const s=u(!1),{getThoughtInputs:m}=d(),{user:l}=k(),n=u([]),p=w(()=>n.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress}))),r=async()=>n.value=await m();return C(async()=>{await r()}),(e,t)=>(c(),i("div",N,[V,$(l)?(c(),i("div",{key:0,class:"italic underline text-xs",onClick:t[0]||(t[0]=a=>s.value=!0)}," Ajouter un nouvel apport ")):g("",!0),o(_,{open:s.value,onClose:t[2]||(t[2]=a=>s.value=!1)},{default:T(()=>[o(f,{onRefresh:r,onClose:t[1]||(t[1]=a=>s.value=!1)})]),_:1},8,["open"]),o(v,{class:"mt-10","contextual-resources":p.value},null,8,["contextual-resources"])]))}});export{z as default};