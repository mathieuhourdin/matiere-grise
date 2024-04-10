import{_ as f}from"./FeedList.vue_vue_type_script_setup_true_lang-ce6746b2.js";import{d as c,r as b,o,c as u,w,a,t as h,b as _,e as d,f as n,F as v,g as x,h as g,i as m}from"./index-b68b4189.js";import{u as k}from"./useProblem-92ff8e0f.js";import{u as y}from"./useInteraction-28ce6762.js";import"./useResourceRelations-2dd4808b.js";const F={class:"w-10 mx-auto"},$=["src"],B={class:"text-center mt-1 text-xs"},P=c({__name:"FollowedProblem",props:{problem:{}},setup(l){return(s,t)=>{const r=b("router-link");return o(),u(r,{to:"/resources/"+s.problem.id+"/feed",class:"m-1"},{default:w(()=>[a("div",F,[a("img",{src:s.problem.image_url,class:"border-2 border-zinc-400 rounded-full max-w-full aspect-[2/2] object-cover object-center w-full"},null,8,$)]),a("div",B,h(s.problem.title),1)]),_:1},8,["to"])}}}),C={class:"flex"},I=c({__name:"FollowedProblemsList",setup(l){const{getProblems:s}=k(),t=_([]);return d(async()=>{t.value=await s()}),(r,i)=>(o(),n("div",C,[(o(!0),n(v,null,x(t.value,e=>(o(),u(P,{problem:e,class:"shrink-0 grow-0 w-16"},null,8,["problem"]))),256))]))}}),V={class:"mt-1"},z=c({__name:"FeedView",setup(l){const{getReadAndWriteInteractions:s}=y(),t=_([]),r=g(()=>t.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress,...e})).sort((e,p)=>.5-Math.random())),i=async()=>t.value=await s();return d(async()=>{await i()}),(e,p)=>(o(),n("div",V,[m(I,{class:"overflow-scroll mx-8",style:{"scrollbar-width":"none","-ms-overflow-style":"none"}}),m(f,{"interactions-list":r.value,class:"md:w-96 mx-auto"},null,8,["interactions-list"])]))}});export{z as default};