import{d as i,o as u,c as a,f as e,t as r,z as p,F as _,A as m,i as h,B as g,r as d,q as f,a as v,h as I,e as x}from"./index-56fee21d.js";const y={class:"text-center p-4 bg-slate-200"},w={class:"text-2xl bold"},$=i({__name:"UserInfos",props:{user:{}},setup(n){return(s,o)=>(u(),a("div",y,[e("div",w,r(s.user.first_name)+" "+r(s.user.last_name),1),e("div",null,r(s.user.handle),1)]))}});function k(n){return console.log("Date : ",n.input_date),n.input_date=new Date(n.input_date),n}async function b(n){return(await p.get("/users/"+n+"/thought_inputs")).data.map(o=>k(o))}function B(){return{getUserThoughtInputs:b}}const U={class:"border shadow-xl rounded m-2 p-4 w-96"},D={class:"flex"},C=["src"],F={class:"text-2xs italic",style:{"margin-top":"-8px"}},V={class:"text-2xs"},L={class:"text-2xs italic"},N=i({__name:"ThoughtInputCard",props:{thoughtInput:{}},setup(n){const s=t=>t.toLocaleString("fr-FR",{hour:"numeric",weekday:"short",day:"numeric",month:"short",year:"2-digit"}),o=t=>t.length>200?t.slice(0,150)+"...":t;return(t,c)=>(u(),a("div",U,[e("div",D,[e("img",{class:"w-8 h-fit mr-4",src:t.thoughtInput.resource_image_link},null,8,C),e("div",null,[e("div",null,r(t.thoughtInput.resource_title),1),e("div",F,r(t.thoughtInput.resource_author_name),1),e("div",V,r(o(t.thoughtInput.input_comment)),1)])]),e("div",L,r(s(t.thoughtInput.input_date)),1)]))}}),T=e("div",{class:"absolute border h-full left-1/2"},null,-1),z=i({__name:"ThoughtInputsList",props:{thoughtInputs:{}},setup(n){return(s,o)=>(u(),a("div",null,[T,(u(!0),a(_,null,m(s.thoughtInputs,(t,c)=>(u(),h(N,{key:t.id,class:g({"ml-auto":c%2==0}),"thought-input":t},null,8,["class","thought-input"]))),128))]))}}),A={class:"m-8"},R=e("div",{class:"text-center m-4 italic text-sm"},"Derniers apports extérieurs",-1),M=i({__name:"UserFeedView",props:{userId:{}},setup(n){const s=n,{getUserById:o}=x(),t=d(null),{getUserThoughtInputs:c}=B(),l=d([]);return f(async()=>{t.value=await o(s.userId),l.value=await c(s.userId)}),(S,q)=>(u(),a("div",null,[e("div",A,[t.value?(u(),h($,{key:0,class:"mx-auto border my-8",user:t.value},null,8,["user"])):v("",!0),R,I(z,{class:"mx-auto","thought-inputs":l.value},null,8,["thought-inputs"])])]))}});export{M as default};
