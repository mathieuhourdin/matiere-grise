import{b as _,c as d,u as f}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-205b74ce.js";import{_ as v}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-229ef043.js";import{d as x,r as u,p as C,o as $,c as i,k as g,j as k,f as o,h as w,e as T,b as c,m as h}from"./index-c91c5f78.js";import"./useArticle-d7d0a5a5.js";import"./ActionButton.vue_vue_type_script_setup_true_lang-0c568b63.js";import"./TextInterface.vue_vue_type_script_setup_true_lang-4b1fab99.js";import"./TextInput.vue_vue_type_script_setup_true_lang-6c2814ae.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-b7257b4c.js";import"./useResource-3e6b3264.js";import"./useProblem-8c9ffa54.js";const N={class:"m-4"},V=T("div",null,"Derniers apports",-1),q=x({__name:"ThoughtInputsView",setup(y){const s=u(!1),{getThoughtInputs:l}=f(),{user:m}=h(),n=u([]),p=C(()=>n.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress}))),r=async()=>n.value=await l();return $(async()=>{await r()}),(e,t)=>(c(),i("div",N,[V,g(m)?(c(),i("div",{key:0,class:"italic underline text-xs",onClick:t[0]||(t[0]=a=>s.value=!0)}," Ajouter un nouvel apport ")):k("",!0),o(_,{open:s.value,onClose:t[2]||(t[2]=a=>s.value=!1)},{default:w(()=>[o(v,{onRefresh:r,onClose:t[1]||(t[1]=a=>s.value=!1)})]),_:1},8,["open"]),o(d,{class:"mt-10","contextual-resources":p.value},null,8,["contextual-resources"])]))}});export{q as default};