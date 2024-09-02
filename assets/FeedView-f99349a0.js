import{_ as b}from"./FeedList.vue_vue_type_script_setup_true_lang-335e32fe.js";import{d as l,r as f,o as r,c as d,w as v,a as n,t as x,b as p,e as w,f as c,F as h,g,h as y,i as m,u as k}from"./index-69e4f77a.js";import{u as F}from"./useResource-3f04247d.js";import"./useResourceRelations-7b098201.js";const $={class:"w-10 mx-auto"},B=["src"],R={class:"text-center overflow-hidden mt-1 text-xs",style:{display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":"3"}},C=l({__name:"FollowedProblem",props:{problem:{}},setup(i){return(t,s)=>{const o=f("router-link");return r(),d(o,{to:"/resources/"+t.problem.id+"/feed",class:"m-1"},{default:v(()=>[n("div",$,[n("img",{src:t.problem.image_url,class:"border-2 border-zinc-400 rounded-full max-w-full aspect-[2/2] object-cover object-center w-full"},null,8,B)]),n("div",R,x(t.problem.title),1)]),_:1},8,["to"])}}}),I={class:"flex"},V=l({__name:"FollowedProblemsList",setup(i){const{getResources:t}=F(),s=p([]);return w(async()=>{s.value=await t({is_external:!1,resource_type:"pblm"})}),(o,_)=>(r(),c("div",I,[(r(!0),c(h,null,g(s.value,a=>(r(),d(C,{problem:a,class:"shrink-0 grow-0 w-16"},null,8,["problem"]))),256))]))}}),j={class:"mt-1"},S=l({__name:"FeedView",setup(i){const{getReadAndWriteInteractions:t,interactionSortFunction:s}=k(),o=p([]),_=y(()=>o.value.map(e=>({resource:e.resource,date:e.interaction_date,post_date:e.interaction_type==="inpt"?e.interaction_date:new Date(e.resource.created_at),user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress,...e})).sort((e,u)=>s(u)-s(e))),a=async()=>o.value=await t();return w(async()=>{await a()}),(e,u)=>(r(),c("div",j,[m(V,{class:"overflow-scroll mb-2 md:mx-8",style:{"scrollbar-width":"none","-ms-overflow-style":"none"}}),m(b,{"interactions-list":_.value,class:"md:w-2/3 mx-auto"},null,8,["interactions-list"])]))}});export{S as default};