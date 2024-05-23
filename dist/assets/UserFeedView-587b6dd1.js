import{_ as C}from"./FeedList.vue_vue_type_script_setup_true_lang-935d1e44.js";import{d as k,y as N,h as $,b as _,e as w,B as h,f as n,a as u,p as U,t as r,c as y,w as x,H as q,m as f,i as o,q as I,o as t,u as E}from"./index-25faa315.js";import{_ as c,a as P}from"./ActionButton.vue_vue_type_script_setup_true_lang-3964f62e.js";import{_ as z}from"./CheckboxInput.vue_vue_type_script_setup_true_lang-94a11bff.js";import{a as A,r as H,_ as R}from"./useThoughtInputs-ea907a3f.js";import{_ as j}from"./CreateThoughtInput.vue_vue_type_script_setup_true_lang-beea270c.js";import"./SelectionTextInterface.vue_vue_type_style_index_0_lang-992f0a5b.js";import"./useResourceRelations-ae5b9314.js";import"./useResource-3cfd14ee.js";const D={class:"text-center p-4 bg-slate-200"},F={key:0,class:"relative"},M=["src"],S={key:0,class:"text-2xl bold"},T={key:1,class:"text-2xl bold"},W={class:"mt-4"},G={key:1},J={class:"grid grid-cols-2 gap-y-1 gap-x-2"},K={class:"col-span-1 flex flex-col"},L={class:"col-span-2"},O={class:"mt-2 flex flex-row-reverse"},Q=k({__name:"UserInfos",props:{user:{}},setup(g){const d=g,{user:i,debouncedUpdateUser:b}=I(),V=N(),m=$(()=>!d.user.is_platform_user||d.user.id===i.value.id),p=_(!1),s=_(null);return w(()=>{s.value=d.user,p.value=V.query.editingUser}),h(s,a=>{m.value&&b(a.id,a)},{deep:!0}),(a,l)=>(t(),n("div",D,[p.value?(t(),n("div",G,[u("div",J,[o(c,{class:"col-span-2",modelValue:s.value.profile_picture_url,"onUpdate:modelValue":l[1]||(l[1]=e=>s.value.profile_picture_url=e),label:"Photo de profil"},null,8,["modelValue"]),o(c,{class:"col-span-1",modelValue:s.value.first_name,"onUpdate:modelValue":l[2]||(l[2]=e=>s.value.first_name=e),label:"Prénom"},null,8,["modelValue"]),o(c,{class:"col-span-1",modelValue:s.value.last_name,"onUpdate:modelValue":l[3]||(l[3]=e=>s.value.last_name=e),label:"Nom"},null,8,["modelValue"]),o(c,{class:"col-span-1",modelValue:s.value.pseudonym,"onUpdate:modelValue":l[4]||(l[4]=e=>s.value.pseudonym=e),label:"Pseudo"},null,8,["modelValue"]),u("div",K,[o(z,{class:"item-center mr-auto my-auto",modelValue:s.value.pseudonymized,"onUpdate:modelValue":l[5]||(l[5]=e=>s.value.pseudonymized=e),label:"Ne montrer que votre pseudo"},null,8,["modelValue"])]),s.value.is_platform_user?(t(),y(c,{key:0,class:"col-span-1",modelValue:s.value.handle,"onUpdate:modelValue":l[6]||(l[6]=e=>s.value.handle=e),label:"Handle"},null,8,["modelValue"])):f("",!0),s.value.is_platform_user?(t(),y(c,{key:1,class:"col-span-1",modelValue:s.value.email,"onUpdate:modelValue":l[7]||(l[7]=e=>s.value.email=e),label:"Email"},null,8,["modelValue"])):f("",!0),u("div",L,[o(A,{modelValue:s.value.biography,"onUpdate:modelValue":l[8]||(l[8]=e=>s.value.biography=e),label:"Bio"},null,8,["modelValue"])])]),u("div",O,[o(P,{onClick:l[9]||(l[9]=e=>p.value=!1),text:"Valider",type:"valid"})])])):(t(),n("div",F,[u("img",{src:a.user.profile_picture_url,class:"mx-auto m-4 w-1/6"},null,8,M),a.user.id===U(i).id?(t(),n("div",S,r(a.user.first_name)+" "+r(a.user.last_name)+" "+r(a.user.pseudonym),1)):(t(),n("div",T,r(a.user.display_name),1)),u("div",null,r(a.user.handle),1),u("div",null,r(a.user.email),1),u("div",W,r(a.user.biography),1),m.value?(t(),y(q,{key:2,class:"right-4 absolute",onClick:l[0]||(l[0]=e=>p.value=!0)},{default:x(()=>[o(U(H),{class:"m-1"})]),_:1})):f("",!0)]))]))}}),X={class:"mt-8 md:mx-6"},re=k({__name:"UserFeedView",props:{pageUserId:{}},setup(g){const d=g,i=_(!1),{getUserById:b,user:V}=I(),m=_(null),{getUserReadAndWriteInteractions:p,getInteractions:s}=E(),a=_([]),l=$(()=>a.value.map(e=>({resource:e.resource,date:e.interaction_date,user_id:e.interaction_user_id,context_comment:e.interaction_comment,progress:e.interaction_progress,...e})).sort((e,v)=>v.date-e.date));return w(async()=>{m.value=await b(d.pageUserId),a.value=await p(d.pageUserId);const e=await s("rvew");a.value=a.value.concat(e)}),(e,v)=>(t(),n("div",null,[u("div",X,[m.value?(t(),y(Q,{key:0,class:"mx-auto border my-8",user:m.value},null,8,["user"])):f("",!0),U(V)&&e.pageUserId==U(V).id?(t(),n("div",{key:1,class:"italic underline text-xs mb-4",onClick:v[0]||(v[0]=B=>i.value=!0)}," Ajouter un nouvel apport ")):f("",!0),o(R,{open:i.value},{default:x(()=>[o(j,{onClose:v[1]||(v[1]=B=>i.value=!1)})]),_:1},8,["open"]),o(C,{"interactions-list":l.value},null,8,["interactions-list"])])]))}});export{re as default};
