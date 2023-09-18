import{_ as y}from"./useThoughtInputs-1176c06a.js";import{d as h,r as _,l as v,C as I,q as x,A as C,o as u,c as r,f as a,g as $,D as E,E as b,a as p,s as B,v as S,t as i,h as c,w as m,x as g,z as L,i as w,e as T,F as N,p as V,G as z}from"./index-65a2f855.js";const D=h({__name:"ModalSheet",props:{open:{type:Boolean,default:!1}},emits:["close"],setup(d,{emit:o}){const l=d,t=_(!1);return v(()=>{t.value=l.open}),I(()=>{const n=s=>{(s.key==="Escape"||s.key==="Enter"||s.key==="Esc"||s.keyCode===27)&&o("close")};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}}),x(C(l).open,n=>t.value=n),(n,s)=>t.value?(u(),r("div",{key:0,tabindex:"0",onKeyup:s[1]||(s[1]=b(e=>o("close"),["esc"])),class:"fixed top-0 left-0 w-full h-full z-10 bg-slate-500/50",onClick:s[2]||(s[2]=e=>o("close"))},[a("div",{class:"max-w-xl overflow-y-scroll max-h-screen mb-10 bg-white mx-auto mt-6 p-4 rounded shadow",onClick:s[0]||(s[0]=E(()=>{},["stop"]))},[$(n.$slots,"default")])],32)):p("",!0)}}),F={class:"w-full md:w-96"},M={key:0,class:"text-xs italic mb-2"},O={class:"border shadow-lg rounded p-4 md:w-96"},A={class:"flex"},K=["src"],R={class:"flex flex-wrap w-full",style:{"margin-top":"-8px"}},U={class:"text-2xs italic"},q={class:"ml-auto m-1 w-1/3"},G={class:"text-2xs"},P={class:"flex flex-wrap"},W={key:0,class:"text-2xs italic"},j=h({__name:"ThoughtInputCard",props:{thoughtInput:{}},setup(d){const o=d,{getUserById:l}=T(),t=_(null);B(()=>t.value&&t.value.id===user.value.id),v(async()=>t.value=await l(o.thoughtInput.input_user_id));const n=e=>e.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}),s=e=>e.length>200?e.slice(0,150)+"...":e;return(e,k)=>{const f=S("router-link");return u(),r("div",F,[e.thoughtInput.usage_reason?(u(),r("div",M,i(e.thoughtInput.usage_reason),1)):p("",!0),a("div",O,[a("div",A,[a("img",{class:"w-8 h-fit mr-4",src:e.thoughtInput.resource_image_link},null,8,K),a("div",null,[a("div",null,[c(f,{to:"/thought_inputs/"+e.thoughtInput.id},{default:m(()=>[g(i(e.thoughtInput.resource_title),1)]),_:1},8,["to"])]),a("div",R,[a("div",U,i(e.thoughtInput.resource_author_name),1),a("div",q,[c(L,{"progress-value":e.thoughtInput.input_progress},null,8,["progress-value"])])]),a("div",G,i(s(e.thoughtInput.input_comment)),1)])]),a("div",P,[e.thoughtInput.input_date?(u(),r("div",W,i(n(e.thoughtInput.input_date)),1)):p("",!0),t.value?(u(),w(f,{key:1,to:"/users/"+t.value.id,class:"ml-auto text-2xs underline"},{default:m(()=>[g(i(t.value.first_name)+" "+i(t.value.last_name),1)]),_:1},8,["to"])):p("",!0)])])])}}}),H={class:"w-fit"},J=h({__name:"ThoughtInputCardWithPopup",props:{thoughtInput:{}},setup(d){const o=_(!1);return(l,t)=>(u(),r("div",H,[c(D,{open:o.value,onClose:t[0]||(t[0]=n=>o.value=!1)},{default:m(()=>[c(y,{"thought-input":l.thoughtInput},null,8,["thought-input"])]),_:1},8,["open"]),c(j,{class:"md:w-96","thought-input":l.thoughtInput,onClick:t[1]||(t[1]=n=>o.value=!0)},null,8,["thought-input"])]))}}),Q={class:"relative max-w-full"},X={key:0,class:"absolute md:border h-full start-1/2"},tt=h({__name:"ThoughtInputsList",props:{thoughtInputs:{},center:{type:Boolean,default:!1}},emits:["select"],setup(d,{emit:o}){const l=t=>{console.log("Select"),o("select",t)};return(t,n)=>(u(),r("div",Q,[t.center?p("",!0):(u(),r("div",X)),(u(!0),r(N,null,V(t.thoughtInputs,(s,e)=>(u(),w(J,{key:s.id,class:z(["mx-auto max-w-full max-w-fit p-1",{"md:ml-0":e%2==0&&!t.center,"md:mr-0":!t.center}]),"thought-input":s,onClick:k=>l(s)},null,8,["class","thought-input","onClick"]))),128))]))}});export{tt as _,D as a};
