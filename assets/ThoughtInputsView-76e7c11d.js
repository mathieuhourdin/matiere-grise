import{b as _,c as d,u as f}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-9624074c.js";import{_ as v}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-a2c48a3a.js";import{d as x,r as u,q as g,g as w,c as i,u as C,a as $,k as o,w as k,i as T,o as c,e as N}from"./index-6c4140f3.js";import"./TextInterface.vue_vue_type_script_setup_true_lang-8caef554.js";import"./TextInput.vue_vue_type_script_setup_true_lang-2b16633b.js";import"./useResource-b1b16e86.js";import"./useProblem-6c76ded6.js";const V={class:"m-4"},h=T("div",null,"Derniers apports",-1),D=x({__name:"ThoughtInputsView",setup(y){const t=u(!1),{getThoughtInputs:l}=f(),{user:m}=N(),n=u([]),p=g(()=>n.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress}))),a=async()=>n.value=await l();return w(async()=>{await a()}),(e,s)=>(c(),i("div",V,[h,C(m)?(c(),i("div",{key:0,class:"italic underline text-xs",onClick:s[0]||(s[0]=r=>t.value=!0)}," Ajouter un nouvel apport ")):$("",!0),o(_,{open:t.value,onClose:s[2]||(s[2]=r=>t.value=!1)},{default:k(()=>[o(v,{onRefresh:a,onClose:s[1]||(s[1]=r=>t.value=!1)})]),_:1},8,["open"]),o(d,{class:"mt-10","contextual-resources":p.value},null,8,["contextual-resources"])]))}});export{D as default};