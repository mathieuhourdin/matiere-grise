import{q as _,d,b as p,o as c,f as m,i as l,s as v,w as f,l as w,a as V,m as x}from"./index-4ed96122.js";import{_ as u}from"./TextInput.vue_vue_type_script_setup_true_lang-691de01f.js";import{_ as b}from"./ActionButton.vue_vue_type_script_setup_true_lang-8163d95c.js";async function k(a){return(await _.post("/link_preview",a)).data}function y(){return{postLinkPreview:k}}const P={class:"mx-10 mt-10"},C={key:0},L=["src"],N=d({__name:"ExternalResourcePreview",setup(a){const{postLinkPreview:o}=y(),n=async()=>{const i=await o({external_content_url:r.value});console.log(i),e.value=i},r=p(""),e=p(null);return(i,t)=>(c(),m("div",P,[l(u,{modelValue:r.value,"onUpdate:modelValue":t[0]||(t[0]=s=>r.value=s),class:"p-2",onKeyup:v(n,["enter"]),label:"Lien ressource externe"},null,8,["modelValue","onKeyup"]),l(b,{class:"mb-4",text:"Preview",onClick:n,type:"valid"},{default:f(()=>[w("Preview")]),_:1}),e.value?(c(),m("div",C,[l(u,{class:"mb-4",modelValue:e.value.title,"onUpdate:modelValue":t[1]||(t[1]=s=>e.value.title=s),label:"Titre"},null,8,["modelValue"]),l(u,{class:"mb-4",modelValue:e.value.subtitle,"onUpdate:modelValue":t[2]||(t[2]=s=>e.value.subtitle=s),label:"Description"},null,8,["modelValue"]),V("img",{src:e.value.image_url},null,8,L)])):x("",!0)]))}}),U={class:"w-full"},B=d({__name:"CreateResourceView",setup(a){return(o,n)=>(c(),m("div",U,[l(N)]))}});export{B as default};
