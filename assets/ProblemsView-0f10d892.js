import{u as F,a as w}from"./useProblem-c66f09df.js";import{d as g,r as h,o as k,s as A,b as s,c as r,f as x,h as L,e as n,t as d,j as C,m as B,a as I,F as v,l as f,g as y,q as M,k as N,v as V,x as D}from"./index-aee788f0.js";import{u as U}from"./useResource-8625e6f4.js";const j={class:"border shadow-xl rounded p-4"},q=["src"],S={class:""},T={class:"mb-2"},E={key:0,class:"text-2xs italic",style:{"margin-top":"-8px"}},W={class:"text-2xs mb-auto"},z={class:"flex mt-2"},G={class:"text-2xs italic mt-auto"},H={class:"ml-auto text-2xs underline"},P=g({__name:"ProblemCard",props:{problem:{}},setup(_){const u=_,i=l=>l?l.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}):"",c=h(null),m=h(null),p=l=>l.length>200?l.slice(0,150)+"...":l,{getAuthorInteractionForResource:b}=U(),e=h([]),{getResourceRelationsForResource:o}=F(),t=async()=>{u.problem.id&&(e.value=await o(u.problem.id))},{getUserById:a}=B(),R=async()=>{c.value=await b(u.problem.id),c.value&&(m.value=await a(c.value.interaction_user_id))};return k(async()=>{await t(),await R()}),(l,te)=>{const $=A("router-link");return s(),r("div",j,[x($,{to:"/thought_outputs/"+l.problem.id},{default:L(()=>[n("img",{class:"h-3/5 mx-auto mb-4",src:l.problem.image_url},null,8,q),n("div",S,[n("div",T,d(l.problem.title),1),m.value?(s(),r("div",E,d(m.value.first_name)+" "+d(m.value.last_name),1)):C("",!0),n("div",W,d(p(l.problem.subtitle)),1),n("div",z,[n("div",G,d(i(l.problem.created_at)),1),n("div",H,d(e.value.length)+" inputs",1)])])]),_:1},8,["to"])])}}}),J={class:"flex"},K=n("hr",{class:"border-top border-slate-800 border-dashed my-1"},null,-1),O={class:"flex overflow-scroll"},Q=g({__name:"CategoryProblemsCarousel",props:{problemsList:{},category:{}},setup(_){const u=_,{newProblem:i,createProblem:c}=w(),m=I(),p=async()=>{const e=i();e.resource.category_id=u.category.id;const o=await c(e);m.push({path:"/thought_outputs/"+o.resource.id,query:{editing:"true"}})},b=e=>e=="default"?"Autres":e;return(e,o)=>(s(),r("div",null,[n("div",J,[n("div",null,d(b(e.category.display_name)),1),n("div",{onClick:p,class:"ml-auto text-sm mr-2 underline"}," Ajouter ")]),K,n("div",O,[(s(!0),r(v,null,f(e.problemsList,(t,a)=>(s(),r("div",{class:"mb-4",key:a},[x(P,{class:"w-80 h-96 mx-3",problem:t},null,8,["problem"])]))),128))])]))}}),X=g({__name:"MobileProblemsFeed",props:{problemsList:{}},setup(_){return(u,i)=>(s(),r("div",null,[(s(!0),r(v,null,f(u.problemsList,(c,m)=>(s(),y(P,{problem:c},null,8,["problem"]))),256))]))}}),Y={key:0,class:"md:m-4"},Z={key:0},ee={key:1},le=g({__name:"ProblemsView",setup(_){const{getProblems:u}=w(),i=h(null),{categories:c}=V(),{isMobile:m}=D(),p=M(()=>c.value.map(o=>(o.problems=b(o),o.problems_count=o.problems?o.problems.length:0,o))),b=e=>{var o,t;return e.display_name=="default"?(o=i.value)==null?void 0:o.filter(a=>a.category_id==null):(t=i.value)==null?void 0:t.filter(a=>a.category_id==e.id)};return k(async()=>i.value=await u()),(e,o)=>(s(),r("div",null,[i.value?(s(),r("div",Y,[N(m)?(s(),r("div",ee,[(s(!0),r(v,null,f(p.value.sort((t,a)=>a.problems_count-t.problems_count),t=>(s(),y(X,{"problems-list":t.problems},null,8,["problems-list"]))),256))])):(s(),r("div",Z,[(s(!0),r(v,null,f(p.value.sort((t,a)=>a.problems_count-t.problems_count),t=>(s(),y(Q,{class:"mt-4",category:t,key:t.id,"problems-list":t.problems},null,8,["category","problems-list"]))),128))]))])):C("",!0)]))}});export{le as default};