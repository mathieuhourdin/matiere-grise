import{u as F}from"./useProblem-2966c448.js";import{d as x,r as b,c as C,o as L,x as j,e as t,a as o,g as s,b as $,_ as D,t as p,i as S,s as U,n as q,f as z,F as g,m as y,h as P,l as E,k as H,E as T,v as W}from"./index-d5b18566.js";import{u as G}from"./useResourceRelations-bc8a2eea.js";const J={class:"border p-1.5"},K={key:0,class:"flex mb-1.5 h-8"},O={class:"h-full flex flex-col w-full"},Q={class:"flex w-auto shrink overflow-auto"},X={key:0,class:"text-xs font-semibold ml-2"},Y={key:1,class:"text-xs italic ml-2"},Z=s("div",{class:"mx-1 my-auto rounded-full bg-gray-800 w-1 h-1"},null,-1),ee={class:"text-2xs my-auto"},te=s("div",{class:"text-2xs italic ml-2 grow shrink-0 overflow-auto"},"Problématique",-1),se={key:1,class:"animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"},oe=["src"],le={key:1,class:"h-full overflow-scroll bg-blue-100 p-1 pt-8 border"},re={class:"bg-blue-100 text-center my-auto"},ne={class:"absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70"},ae={class:""},ue={class:"mb-2"},ie={class:"text-2xs mb-auto"},ce={class:"flex mt-2"},de={class:"ml-auto text-2xs underline"},B=x({__name:"ProblemCard",props:{problem:{}},setup(h){const i=h,m=e=>e?e.toLocaleString("fr-FR",{day:"numeric",month:"short",year:"2-digit"}):"",c=b(0),_=b(null),d=b(null),v=C(()=>`${c.value}/${l.value.length}`),l=C(()=>{if(!i.problem.content)return[];const e=i.problem.content.replaceAll("?","?.").split(".");let u=0;const f=[];for(;u<e.length-1;){let k=0,A=[];if(e[u].length>=270)f.push(e[u].replaceAll("?.","?")),u++;else{for(;u<e.length&&k+e[u].length<270;)A.push(e[u]),k+=e[u].length,u++;f.push(A.join(". ").replaceAll("?.","?"))}}return f}),n=e=>e?e.length>200?e.slice(0,150)+"...":e:"",{getAuthorInteractionForResource:r}=U(),a=b([]),{getResourceRelationsForResource:I}=G(),M=async()=>{i.problem.id&&(a.value=await I(i.problem.id))},{getUserById:N}=q(),R=b(!1),V=async()=>{try{if(_.value=await r(i.problem.id),!_.value)return;d.value=await N(_.value.interaction_user_id)}catch(e){console.log(e)}R.value=!0},w=b(null);return L(async()=>{await M(),await V();const e=w.value.offsetHeight;w.value.style.height=`${e}px`}),(e,u)=>{const f=j("router-link");return t(),o("div",J,[s("div",null,[R.value?(t(),o("div",K,[$(D,{user:d.value},null,8,["user"]),s("div",O,[s("div",Q,[d.value?(t(),o("div",X,p(d.value.first_name)+" "+p(d.value.last_name),1)):(t(),o("div",Y,"Connectez vous pour voir l'auteur")),Z,s("div",ee,p(m(e.problem.created_at)),1)]),te])])):(t(),o("div",se))]),s("div",{onClick:u[0]||(u[0]=k=>c.value=(c.value+1)%(l.value.length+1)),class:"relative md:h-3/5 mb-2 bg-gray-700",ref_key:"parentCard",ref:w},[c.value==0?(t(),o("img",{key:0,class:"object-contain w-full h-full mt-auto mx-auto",src:e.problem.image_url},null,8,oe)):(t(),o("div",le,[s("div",re,p(l.value[c.value-1]),1)])),s("div",ne,p(v.value),1)],512),$(f,{to:"/resources/"+e.problem.id},{default:S(()=>[s("div",ae,[s("div",ue,p(e.problem.title),1),s("div",ie,p(n(e.problem.subtitle)),1),s("div",ce,[s("div",de,p(a.value.length)+" inputs",1)])])]),_:1},8,["to"])])}}}),me={class:"flex"},pe=s("hr",{class:"border-top border-slate-800 border-dashed my-1"},null,-1),_e={class:"flex overflow-scroll"},be=x({__name:"CategoryProblemsCarousel",props:{problemsList:{},category:{}},setup(h){const i=h,{newProblem:m,createProblem:c}=F(),_=z(),d=async()=>{const l=m();l.resource.category_id=i.category.id;const n=await c(l);_.push({path:"/resources/"+n.resource.id,query:{editing:"true"}})},v=l=>l=="default"?"Autres":l;return(l,n)=>(t(),o("div",null,[s("div",me,[s("div",null,p(v(l.category.display_name)),1),s("div",{onClick:d,class:"ml-auto text-sm mr-2 underline"}," Ajouter ")]),pe,s("div",_e,[(t(!0),o(g,null,y(l.problemsList,(r,a)=>(t(),o("div",{class:"mb-4",key:a},[$(B,{class:"w-80 h-96 mx-3 shadow-xl rounded",problem:r},null,8,["problem"])]))),128))])]))}}),he=x({__name:"MobileProblemsFeed",props:{problemsList:{}},setup(h){return(i,m)=>(t(),o("div",null,[(t(!0),o(g,null,y(i.problemsList,(c,_)=>(t(),P(B,{class:"border-b-1 border-black",problem:c},null,8,["problem"]))),256))]))}}),ve={key:0,class:"md:m-4"},fe={key:0},ge={key:1},ke=x({__name:"ProblemsView",setup(h){const{getProblems:i}=F(),m=b(null),{categories:c}=T(),{isMobile:_}=W(),d=C(()=>c.value.map(n=>(n.problems=v(n),n.problems_count=n.problems?n.problems.length:0,n))),v=l=>{var n,r;return l.display_name=="default"?(n=m.value)==null?void 0:n.filter(a=>a.category_id==null):(r=m.value)==null?void 0:r.filter(a=>a.category_id==l.id)};return L(async()=>m.value=await i()),(l,n)=>(t(),o("div",null,[m.value?(t(),o("div",ve,[E(_)?(t(),o("div",ge,[(t(!0),o(g,null,y(d.value.sort((r,a)=>a.problems_count-r.problems_count),r=>(t(),P(he,{"problems-list":r.problems},null,8,["problems-list"]))),256))])):(t(),o("div",fe,[(t(!0),o(g,null,y(d.value.sort((r,a)=>a.problems_count-r.problems_count),r=>(t(),P(be,{class:"mt-4",category:r,key:r.id,"problems-list":r.problems},null,8,["category","problems-list"]))),128))]))])):H("",!0)]))}});export{ke as default};
