import{u as V,a as F}from"./useProblem-791aed60.js";import{d as k,r as b,q as C,o as L,s as D,b as t,c as s,e as n,f as $,_ as S,t as p,h as U,m as q,a as z,F as f,l as y,g as P,k as H,j as T,v as E,x as W}from"./index-4e102b89.js";import{u as G}from"./useResource-b03e68c3.js";const J={key:0,class:"flex mb-1.5"},K={key:0,class:"text-xs italic my-auto ml-2"},O={key:1,class:"text-xs italic my-auto ml-2"},Q={key:1,class:"animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"},X=["src"],Y={key:1,class:"h-full overflow-scroll bg-blue-100 p-1 pt-8 border"},Z={class:"bg-blue-100 text-center my-auto"},ee={class:"absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70"},te={class:""},se={class:"mb-2"},oe={class:"text-2xs mb-auto"},le={class:"flex mt-2"},re={class:"text-2xs italic mt-auto"},ne={class:"ml-auto text-2xs underline"},B=k({__name:"ProblemCard",props:{problem:{}},setup(h){const c=h,m=e=>e?e.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}):"",i=b(0),_=b(null),d=b(null),v=C(()=>`${i.value}/${o.value.length}`),o=C(()=>{const e=c.problem.content.replaceAll("?","?.").split(".");let u=0;const g=[];for(;u<e.length-1;){let w=0,A=[];if(e[u].length>=270)g.push(e[u].replaceAll("?.","?")),u++;else{for(;u<e.length&&w+e[u].length<270;)A.push(e[u]),w+=e[u].length,u++;g.push(A.join(". ").replaceAll("?.","?"))}}return g}),r=e=>e.length>200?e.slice(0,150)+"...":e,{getAuthorInteractionForResource:l}=G(),a=b([]),{getResourceRelationsForResource:I}=V(),j=async()=>{c.problem.id&&(a.value=await I(c.problem.id))},{getUserById:M}=q(),R=b(!1),N=async()=>{try{if(_.value=await l(c.problem.id),!_.value)return;d.value=await M(_.value.interaction_user_id)}catch(e){console.log(e)}R.value=!0},x=b(null);return L(async()=>{await j(),await N();const e=x.value.offsetHeight;x.value.style.height=`${e}px`}),(e,u)=>{const g=D("router-link");return t(),s("div",{ref_key:"parentCard",ref:x,class:"border p-1.5"},[n("div",null,[R.value?(t(),s("div",J,[$(S,{user:d.value},null,8,["user"]),d.value?(t(),s("div",K,p(d.value.first_name)+" "+p(d.value.last_name),1)):(t(),s("div",O,"Connectez vous pour voir l'auteur"))])):(t(),s("div",Q))]),n("div",{onClick:u[0]||(u[0]=w=>i.value=(i.value+1)%(o.value.length+1)),class:"relative h-3/5 mb-2 bg-gray-700"},[i.value==0?(t(),s("img",{key:0,class:"object-contain w-full h-full mt-auto mx-auto",src:e.problem.image_url},null,8,X)):(t(),s("div",Y,[n("div",Z,p(o.value[i.value-1]),1)])),n("div",ee,p(v.value),1)]),$(g,{to:"/thought_outputs/"+e.problem.id},{default:U(()=>[n("div",te,[n("div",se,p(e.problem.title),1),n("div",oe,p(r(e.problem.subtitle)),1),n("div",le,[n("div",re,p(m(e.problem.created_at)),1),n("div",ne,p(a.value.length)+" inputs",1)])])]),_:1},8,["to"])],512)}}}),ae={class:"flex"},ue=n("hr",{class:"border-top border-slate-800 border-dashed my-1"},null,-1),ie={class:"flex overflow-scroll"},ce=k({__name:"CategoryProblemsCarousel",props:{problemsList:{},category:{}},setup(h){const c=h,{newProblem:m,createProblem:i}=F(),_=z(),d=async()=>{const o=m();o.resource.category_id=c.category.id;const r=await i(o);_.push({path:"/thought_outputs/"+r.resource.id,query:{editing:"true"}})},v=o=>o=="default"?"Autres":o;return(o,r)=>(t(),s("div",null,[n("div",ae,[n("div",null,p(v(o.category.display_name)),1),n("div",{onClick:d,class:"ml-auto text-sm mr-2 underline"}," Ajouter ")]),ue,n("div",ie,[(t(!0),s(f,null,y(o.problemsList,(l,a)=>(t(),s("div",{class:"mb-4",key:a},[$(B,{class:"w-80 h-96 mx-3 shadow-xl rounded",problem:l},null,8,["problem"])]))),128))])]))}}),de=k({__name:"MobileProblemsFeed",props:{problemsList:{}},setup(h){return(c,m)=>(t(),s("div",null,[(t(!0),s(f,null,y(c.problemsList,(i,_)=>(t(),P(B,{class:"border-b-1 border-black",problem:i},null,8,["problem"]))),256))]))}}),me={key:0,class:"md:m-4"},pe={key:0},_e={key:1},ge=k({__name:"ProblemsView",setup(h){const{getProblems:c}=F(),m=b(null),{categories:i}=E(),{isMobile:_}=W(),d=C(()=>i.value.map(r=>(r.problems=v(r),r.problems_count=r.problems?r.problems.length:0,r))),v=o=>{var r,l;return o.display_name=="default"?(r=m.value)==null?void 0:r.filter(a=>a.category_id==null):(l=m.value)==null?void 0:l.filter(a=>a.category_id==o.id)};return L(async()=>m.value=await c()),(o,r)=>(t(),s("div",null,[m.value?(t(),s("div",me,[H(_)?(t(),s("div",_e,[(t(!0),s(f,null,y(d.value.sort((l,a)=>a.problems_count-l.problems_count),l=>(t(),P(de,{"problems-list":l.problems},null,8,["problems-list"]))),256))])):(t(),s("div",pe,[(t(!0),s(f,null,y(d.value.sort((l,a)=>a.problems_count-l.problems_count),l=>(t(),P(ce,{class:"mt-4",category:l,key:l.id,"problems-list":l.problems},null,8,["category","problems-list"]))),128))]))])):T("",!0)]))}});export{ge as default};