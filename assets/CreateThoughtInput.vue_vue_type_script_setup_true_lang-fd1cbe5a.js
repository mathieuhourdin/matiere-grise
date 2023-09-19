import{_ as a}from"./TextInput.vue_vue_type_script_setup_true_lang-2ec16d35.js";import{d as p,r as v,o as V,c as _,h as o,f as t,_ as r}from"./index-a6212284.js";import{u as c}from"./useThoughtInputs-99c314d9.js";const f=t("div",null,"Nouvel apport",-1),g={class:"flex flex-wrap"},w={class:"flex flex-wrap"},b={class:"flex flex-row-reverse"},I=p({__name:"CreateThoughtInput",emits:["close"],setup(x,{emit:n}){const{newThoughtInput:m,createThoughtInput:d}=c(),e=v(m()),i=()=>{d(e.value),s()},s=()=>n("close");return(U,l)=>(V(),_("div",null,[f,o(a,{label:"Titre de l'ouvrage",modelValue:e.value.resource_title,"onUpdate:modelValue":l[0]||(l[0]=u=>e.value.resource_title=u)},null,8,["modelValue"]),t("div",g,[o(a,{class:"h-8 w-full md:w-5/12",label:"Nom de l'auteur",modelValue:e.value.resource_author_name,"onUpdate:modelValue":l[1]||(l[1]=u=>e.value.resource_author_name=u)},null,8,["modelValue"]),o(a,{class:"h-8 w-full md:w-5/12 md:ml-auto",label:"type de resource",modelValue:e.value.resource_type,"onUpdate:modelValue":l[2]||(l[2]=u=>e.value.resource_type=u)},null,8,["modelValue"])]),t("div",w,[o(a,{class:"h-8 w-full md:w-5/12",label:"Lien de la ressource",modelValue:e.value.resource_link,"onUpdate:modelValue":l[3]||(l[3]=u=>e.value.resource_link=u)},null,8,["modelValue"]),o(a,{class:"h-8 w-full md:w-5/12 md:ml-auto",label:"Lien de l'image",modelValue:e.value.resource_image_link,"onUpdate:modelValue":l[4]||(l[4]=u=>e.value.resource_image_link=u)},null,8,["modelValue"])]),o(a,{label:"Commentaire sur l'ouvrage",modelValue:e.value.resource_comment,"onUpdate:modelValue":l[5]||(l[5]=u=>e.value.resource_comment=u)},null,8,["modelValue"]),o(a,{label:"Avancement de l'ouvrage",modelValue:e.value.input_progress,"onUpdate:modelValue":l[6]||(l[6]=u=>e.value.input_progress=u),type:"number"},null,8,["modelValue"]),o(a,{label:"Date de lecture",modelValue:e.value.input_date,"onUpdate:modelValue":l[7]||(l[7]=u=>e.value.input_date=u),type:"date"},null,8,["modelValue"]),o(a,{label:"Pourquoi s'y être interessé ?",modelValue:e.value.input_comment,"onUpdate:modelValue":l[8]||(l[8]=u=>e.value.input_comment=u)},null,8,["modelValue"]),t("div",b,[o(r,{onClick:i,class:"m-4",text:"Valider",type:"valid"}),o(r,{onClick:s,class:"m-4",text:"Annuler",type:"abort"})])]))}});export{I as _};