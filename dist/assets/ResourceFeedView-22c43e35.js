import{_ as u}from"./FeedList.vue_vue_type_script_setup_true_lang-f812461f.js";import{u as l}from"./useResourceRelations-6471b35f.js";import{d as i,r as t,c as m,o as d,a as _,g as p,b as R,e as f}from"./index-675deefb.js";const g={class:"m-8"},B=i({__name:"ResourceFeedView",props:{id:{}},setup(o){const r=o;t(!1),t(null);const{getAllRelationsForResource:a}=l(),s=t([]),n=m(()=>s.value.map(e=>({resource:targetResource.target_resource,date:targetResource.created_at,user_id:targetResource.user_id,context_comment:targetResource.relation_comment,progress:null,...e})).sort((e,c)=>.5-Math.random()));return d(async()=>{s.value=await a(r.id)}),(e,c)=>(f(),_("div",null,[p("div",g,[R(u,{"interactions-list":n.value},null,8,["interactions-list"])])]))}});export{B as default};
