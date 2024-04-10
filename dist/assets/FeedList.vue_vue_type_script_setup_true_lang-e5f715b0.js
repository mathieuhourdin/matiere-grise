import{e as r,a as l,g as n,d as T,r as c,c as p,o as I,x as M,h as F,J as N,b as v,i as y,l as S,t as u,n as j,F as U,m as z}from"./index-0a240239.js";import{u as D}from"./useResourceRelations-d3bc52fe.js";const H=a=>{if(!a)return[];const t=a.replace("/?/g","?.").split(".");let o=0;const i=[];for(;o<t.length;){let d=0,s=[];if(t[o].length>=270)i.push(t[o].replace("/?./g","?")),o++;else{for(;o<t.length&&d+t[o].length<270;)s.push(t[o]),d+=t[o].length,o++;i.push(s.join(". ").replace("/?./g","?"))}}return i},V=a=>a?a.split(`
`).map(o=>H(o)).flat():[],k={splitTextForPanel:V};function q(a,t){return r(),l("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[n("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})])}const E={class:"flex flex-col border p-1.5 overflow-auto"},J={class:"flex"},G={key:1,class:"animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"},K=["src"],O={key:1,class:"overflow-auto h-full overflow-scroll bg-red-100 p-1 pt-8 border"},Q={class:"bg-red-100 text-center text-sm my-auto"},W={key:2,class:"overflow-auto h-full overflow-scroll bg-blue-100 p-1 pt-8 border"},X={class:"bg-blue-100 text-center text-sm my-auto"},Y={class:"absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70"},Z={class:""},ee={class:"mb-2 font-bold text-sm"},te={class:"text-2xs mb-auto"},oe={class:"flex mt-2"},se={class:"ml-auto text-2xs underline"},ne=T({__name:"FeedCard",props:{interaction:{}},setup(a){const t=a,o=e=>e?e.toLocaleString("fr-FR",{day:"numeric",month:"short",year:"2-digit"}):"",i=e=>e==="outp"?"Production personnelle":"Bibliographie",d=e=>{switch(e){case"pblm":return"Problématique";case"book":return"Livre";case"atcl":return"Article";case"ratc":return"Article de recherche"}return e},s=c(0);c(null);const f=c(null),B=()=>{s.value=(s.value+1)%g.value},C=p(()=>`${s.value+1}/${g.value}`),g=p(()=>h.value.length+_.value.length+1),_=p(()=>k.splitTextForPanel(t.interaction.resource.content)),h=p(()=>k.splitTextForPanel(t.interaction.context_comment)),L=e=>e?e.length>200?e.slice(0,150)+"...":e:"",x=c([]),{getResourceRelationsForResource:R}=D(),P=async()=>{t.interaction.id&&(x.value=await R(t.interaction.resource.id))},{getUserById:$}=j(),b=c(!1),A=async()=>{try{f.value=await $(t.interaction.user_id)}catch(e){console.log(e)}b.value=!0},m=c(null);return I(async()=>{await P(),await A();const e=m.value.offsetHeight;m.value.style.height=`${e}px`}),(e,ae)=>{const w=M("router-link");return r(),l("div",E,[n("div",J,[b.value?(r(),F(N,{key:0,class:"flex mb-1.5 h-8",user:f.value,secondText:o(e.interaction.date),firstBottomText:i(e.interaction.interaction_type),secondBottomText:d(e.interaction.resource.resource_type)},null,8,["user","secondText","firstBottomText","secondBottomText"])):(r(),l("div",G)),v(w,{to:"/resources/"+e.interaction.resource.id+"/feed",class:"ml-auto"},{default:y(()=>[v(S(q),{class:"w-8"})]),_:1},8,["to"])]),n("div",{onClick:B,class:"overflow-auto relative w-full md:h-3/5 min-h-60 mb-2 bg-gray-700",ref_key:"parentCard",ref:m},[s.value==0?(r(),l("img",{key:0,class:"overflow-auto object-contain w-full h-full mt-auto mx-auto",src:e.interaction.resource.image_url},null,8,K)):s.value>0&&s.value<=h.value.length?(r(),l("div",O,[n("div",Q,u(h.value[s.value-1]),1)])):(r(),l("div",W,[n("div",X,u(_.value[s.value-h.value.length-1]),1)])),n("div",Y,u(C.value),1)],512),v(w,{class:"",to:"/resources/"+e.interaction.resource.id},{default:y(()=>[n("div",Z,[n("div",ee,u(e.interaction.resource.title),1),n("div",te,u(L(e.interaction.resource.subtitle)),1),n("div",oe,[n("div",se,u(x.value.length)+" inputs",1)])])]),_:1},8,["to"])])}}}),re={class:"flex flex-col"},ce=T({__name:"FeedList",props:{interactionsList:{}},setup(a){return(t,o)=>(r(),l("div",re,[(r(!0),l(U,null,z(t.interactionsList,(i,d)=>(r(),F(ne,{class:"md:mb-2 flex-grow md:rounded max-h-screen border-b-1 border-black",interaction:i},null,8,["interaction"]))),256))]))}});export{ce as _};