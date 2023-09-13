import{q as f,d,B as g,o as a,c as l,h as p,w as v,f as e,t as r,l as P,r as w,n as y,F as x,p as k}from"./index-da616e41.js";import{u as C}from"./useThoughtOutput-e73015fb.js";const{createThoughtOutput:$}=C(),B=()=>({title:"",description:"",content:"",publishing_state:"drft",image_url:"",output_type:"pblm",progress:0,potential_improvements:"",maturing_state:""}),q=s=>s,D=async()=>(await f.get("/problems")).data.map(o=>q(o));function F(){return{newProblem:B,getProblems:D,createProblem:$}}const N={class:"border shadow-xl rounded m-2 p-4 h-72 w-60"},R={class:"max-h-full"},T=["src"],V={class:"h-full"},A={class:"text-2xs italic",style:{"margin-top":"-8px"}},L={class:"text-2xs mb-auto"},O={class:"flex mt-auto"},S={class:"text-2xs italic mt-auto"},j={class:"ml-auto text-2xs underline"},E=d({__name:"ProblemCard",props:{problem:{}},setup(s){const o=t=>t.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}),i=t=>t.length>200?t.slice(0,150)+"...":t;return(t,c)=>{const n=g("router-link");return a(),l("div",N,[p(n,{to:"/thought_outputs/"+t.problem.id},{default:v(()=>[e("div",R,[e("img",{class:"h-28 mx-auto mb-4",src:t.problem.image_url},null,8,T),e("div",V,[e("div",null,r(t.problem.title),1),e("div",A,r(t.problem.owner_id),1),e("div",L,r(i(t.problem.description)),1),e("div",O,[e("div",S,r(o(t.problem.created_at)),1),e("div",j,r(t.problem.inputs)+" inputs",1)])])])]),_:1},8,["to"])])}}}),H={class:"m-4"},M=e("div",null,"Histoire et sociétés",-1),W=e("hr",{class:"border-top border-slate-800 border-dashed my-1"},null,-1),z={class:"flex"},J=d({__name:"ProblemsView",setup(s){const o=P(),{getProblems:i,newProblem:t,createProblem:c}=F(),n=w([]),_=async()=>{const u=t(),m=await c(u);o.push({path:"/thought_outputs/"+m.id,query:{editing:!0}})};return y(async()=>n.value=await i()),(u,m)=>(a(),l("div",null,[e("div",H,[e("div",{class:"underline italic",onClick:_},"Ajouter une problématique"),M,W,e("div",z,[(a(!0),l(x,null,k(n.value,(h,b)=>(a(),l("div",{key:b},[p(E,{problem:h},null,8,["problem"])]))),128))])])]))}});export{J as default};
