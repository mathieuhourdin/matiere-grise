import{_ as t}from"./TextInput.vue_vue_type_script_setup_true_lang-80273c46.js";import{d as p,r as v,o as V,c,j as u,h as a,l as s}from"./index-fb06ad61.js";import{u as f}from"./ResourceComponent.vue_vue_type_script_setup_true_lang-1210503f.js";const _=a("div",null,"Nouvel apport",-1),b={class:"flex flex-wrap"},g={class:"flex flex-wrap"},w={class:"flex flex-row-reverse"},T=p({__name:"CreateThoughtInput",emits:["close"],setup(x,{emit:n}){const{newThoughtInput:d,createThoughtInput:m}=f(),e=v(d()),i=()=>{m(e.value),r()},r=()=>n("close");return(U,l)=>(V(),c("div",null,[_,u(t,{label:"Titre de l'ouvrage",modelValue:e.value.resource.title,"onUpdate:modelValue":l[0]||(l[0]=o=>e.value.resource.title=o)},null,8,["modelValue"]),a("div",b,[u(t,{class:"h-8 w-full md:w-5/12",label:"Sous-titre",modelValue:e.value.resource.subtitle,"onUpdate:modelValue":l[1]||(l[1]=o=>e.value.resource.subtitle=o)},null,8,["modelValue"]),u(t,{class:"h-8 w-full md:w-5/12 md:ml-auto",label:"type de resource",modelValue:e.value.resource.resource_type,"onUpdate:modelValue":l[2]||(l[2]=o=>e.value.resource.resource_type=o)},null,8,["modelValue"])]),a("div",g,[u(t,{class:"h-8 w-full md:w-5/12",label:"Lien de la ressource",modelValue:e.value.resource.external_content_url,"onUpdate:modelValue":l[3]||(l[3]=o=>e.value.resource.external_content_url=o)},null,8,["modelValue"]),u(t,{class:"h-8 w-full md:w-5/12 md:ml-auto",label:"Lien de l'image",modelValue:e.value.resource.image_url,"onUpdate:modelValue":l[4]||(l[4]=o=>e.value.resource.image_url=o)},null,8,["modelValue"])]),u(t,{label:"Commentaire sur l'ouvrage",modelValue:e.value.resource.comment,"onUpdate:modelValue":l[5]||(l[5]=o=>e.value.resource.comment=o)},null,8,["modelValue"]),u(t,{label:"Avancement de l'ouvrage",modelValue:e.value.interaction_progress,"onUpdate:modelValue":l[6]||(l[6]=o=>e.value.interaction_progress=o),type:"number"},null,8,["modelValue"]),u(t,{label:"Date de lecture",modelValue:e.value.interaction_date,"onUpdate:modelValue":l[7]||(l[7]=o=>e.value.interaction_date=o),type:"date"},null,8,["modelValue"]),u(t,{label:"Pourquoi s'y être interessé ?",modelValue:e.value.interaction_comment,"onUpdate:modelValue":l[8]||(l[8]=o=>e.value.interaction_comment=o)},null,8,["modelValue"]),a("div",w,[u(s,{onClick:i,class:"m-4",text:"Valider",type:"valid"}),u(s,{onClick:r,class:"m-4",text:"Annuler",type:"abort"})])]))}});export{T as _};
