import{b as n,u as c}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-b4be5dcc.js";import{d as i,b as t,n as u,h as m,e as p,f as _,i as l,a as d,o as f}from"./index-c12685c0.js";import"./ActionButton.vue_vue_type_script_setup_true_lang-9e80b0f1.js";import"./TextAreaInput.vue_vue_type_script_setup_true_lang-db8eaa9f.js";import"./SelectionTextInterface.vue_vue_type_style_index_0_lang-020b5036.js";import"./ProgressBar.vue_vue_type_script_setup_true_lang-fc6306cf.js";import"./useResource-512f2130.js";import"./UserPicker.vue_vue_type_script_setup_true_lang-f1d24e96.js";import"./useResourceRelations-65809224.js";const h={class:"m-4"},x=d("div",null,"Derniers apports",-1),D=i({__name:"ThoughtInputsView",setup(v){t(!1);const{getThoughtInputs:o}=c();u();const s=t([]),r=m(()=>s.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress}))),a=async()=>s.value=await o();return p(async()=>{await a()}),(e,g)=>(f(),_("div",h,[x,l(n,{class:"mt-10","contextual-resources":r.value},null,8,["contextual-resources"])]))}});export{D as default};